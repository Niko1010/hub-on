"""Floor coordinates to named zones. Phase 07.

Phase 06 produced a position in metres. On its own that is not an analytic:
"(7.2, 4.4)" tells nobody anything. This module gives positions names —
Entrance, Electronics, Checkout — from polygons in `config/zones.yaml`, and
turns a stream of positions into the dwell intervals every later metric is
actually built from.

Three decisions here are load-bearing:

- **Outside is a value, not an absence.** A person in an aisle between two
  zones belongs to no zone, and that is a fact about them worth recording. They
  are labelled `OUTSIDE`, never dropped: silently discarding them would delete
  the aisle traffic that a store cares about and would make every dwell total
  quietly incomplete.
- **A zone is a claim with an error bar.** D-012 measured the foot-point error
  at a p95 of roughly a metre, and it is systematic rather than random. Within
  that distance of a boundary the assignment is not trustworthy, so
  `assign()` reports how far the point was from the nearest edge and whether
  that puts it inside the margin. Somebody browsing a shelf edge — the most
  interesting person in the shop — is exactly who lands there.
- **Intervals, not frames.** The brief is explicit that event data beats
  millions of frame rows. `ZoneEventBuilder` turns per-frame assignments into
  `ZoneEvent` intervals, and suppresses the flicker that D-012 predicts: a
  person standing on a boundary would otherwise generate dozens of half-second
  "visits" to two zones alternately, each of them fictional.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from shapely.geometry import Point, Polygon
from shapely.validation import explain_validity

from retailvision.config import ConfigError, load_yaml
from retailvision.schemas import ZoneEvent
from retailvision.utils.logging import get_logger

if TYPE_CHECKING:
    from collections.abc import Iterable, Sequence

    from retailvision.schemas import FloorPoint, Track

__all__ = [
    "OUTSIDE",
    "Zone",
    "ZoneAssignment",
    "ZoneError",
    "ZoneEventBuilder",
    "ZoneMap",
    "load_zone_map",
]

log = get_logger(__name__)

# The label for a floor position inside no zone. A real answer, deliberately
# spelled in capitals like the zone ids so it cannot be mistaken for a missing
# value further down.
OUTSIDE = "OUTSIDE"


class ZoneError(RuntimeError):
    """A zone definition is missing, malformed or self-contradictory."""


@dataclass(frozen=True, slots=True)
class Zone:
    """One named area of the shop floor, in floor metres."""

    zone_id: str
    name: str
    polygon: Polygon
    kind: str = "retail"
    # Which zone wins where two overlap. Higher takes precedence. Overlaps are
    # usually a mistake, but a checkout queue inside a general area is a real
    # case, so they are allowed when the precedence is stated.
    priority: int = 0
    description: str = ""

    @property
    def area_m2(self) -> float:
        return float(self.polygon.area)

    def contains(self, floor_xy: Sequence[float]) -> bool:
        # `intersects` rather than `contains`: a point exactly on the boundary
        # belongs to the zone. Dropping boundary points would put a person
        # standing precisely on a shelf line into OUTSIDE, which is worse than
        # an arbitrary but consistent tie-break.
        return bool(self.polygon.intersects(Point(floor_xy[0], floor_xy[1])))

    def distance_to_boundary_m(self, floor_xy: Sequence[float]) -> float:
        """Distance from a point to this zone's edge, in metres. Always >= 0.

        Measured to the *edge*, so a point deep inside the zone is far from the
        boundary. That is what `near_boundary` needs; `distance_to_m` below is
        the different question of how far away the zone itself is.
        """
        return float(self.polygon.exterior.distance(Point(floor_xy[0], floor_xy[1])))

    def distance_to_m(self, floor_xy: Sequence[float]) -> float:
        """How far a point is from this zone. Zero when inside it.

        Phase 10 asks "how far is this employee from their work zone", for which
        a point inside must answer 0 rather than its distance to the nearest
        wall.
        """
        return float(self.polygon.distance(Point(floor_xy[0], floor_xy[1])))


@dataclass(frozen=True, slots=True)
class ZoneAssignment:
    """Where a floor position is, and how much to trust that.

    `near_boundary` is the field that matters. The zone id alone reads as a
    fact; paired with the distance to the nearest edge it reads as what it is —
    a claim whose reliability depends on where in the zone the person stood.
    """

    zone_id: str
    distance_to_boundary_m: float
    near_boundary: bool

    @property
    def is_outside(self) -> bool:
        return self.zone_id == OUTSIDE


class ZoneMap:
    """The set of zones for one store, and the lookup over them.

    Loaded from configuration, so editing a polygon in `config/zones.yaml`
    changes behaviour with no code change — which is Phase 07's fourth
    acceptance criterion and also the only way the zones can be corrected once
    somebody looks at a floor plan and disagrees.
    """

    def __init__(
        self,
        zones: Sequence[Zone],
        *,
        boundary_margin_m: float = 1.0,
        floor_size_m: tuple[float, float] | None = None,
    ) -> None:
        if not zones:
            raise ZoneError("no zones defined")
        self.zones = list(zones)
        self.boundary_margin_m = boundary_margin_m
        self.floor_size_m = floor_size_m
        self._by_id = {z.zone_id: z for z in self.zones}
        self._warn_about_overlaps()

    # -- construction ------------------------------------------------------- #

    def _warn_about_overlaps(self) -> None:
        """Overlapping zones with equal priority have no defined winner.

        Not an error: a checkout queue drawn inside a wider area is legitimate.
        But an accidental overlap makes the assignment depend on the order
        zones happen to appear in the file, which is the kind of bug that
        reproduces only on some frames.
        """
        for i, a in enumerate(self.zones):
            for b in self.zones[i + 1 :]:
                if not a.polygon.intersects(b.polygon):
                    continue
                overlap = a.polygon.intersection(b.polygon).area
                if overlap <= 1e-9:
                    continue  # touching edges, not overlapping areas
                if a.priority == b.priority:
                    log.warning(
                        "zones overlap with equal priority - the winner is "
                        "whichever appears first in config/zones.yaml",
                        extra={
                            "zone_a": a.zone_id,
                            "zone_b": b.zone_id,
                            "overlap_m2": round(overlap, 3),
                        },
                    )

    # -- lookup ------------------------------------------------------------- #

    def __len__(self) -> int:
        return len(self.zones)

    def __contains__(self, zone_id: str) -> bool:
        return zone_id in self._by_id

    def get(self, zone_id: str) -> Zone | None:
        return self._by_id.get(zone_id)

    @property
    def zone_ids(self) -> list[str]:
        return [z.zone_id for z in self.zones]

    def assign(self, floor_xy: FloorPoint | None) -> ZoneAssignment:
        """Name the zone containing a floor position.

        `None` in — a track whose foot point had no floor position at all — gives
        `OUTSIDE` with an infinite distance, because "we could not place this
        person" and "this person was in no zone" are both genuinely not-in-a-zone
        and neither is a reason to invent a location.
        """
        if floor_xy is None:
            return ZoneAssignment(OUTSIDE, float("inf"), near_boundary=False)

        point = Point(floor_xy[0], floor_xy[1])
        candidates = [z for z in self.zones if z.polygon.intersects(point)]
        if not candidates:
            # Distance to the nearest zone, so "just outside Electronics" is
            # distinguishable from "in the middle of the car park".
            nearest = min(
                (float(z.polygon.distance(point)) for z in self.zones),
                default=float("inf"),
            )
            return ZoneAssignment(
                OUTSIDE, nearest, near_boundary=nearest <= self.boundary_margin_m
            )

        # Highest priority wins; ties go to the first in the file, which is
        # what the overlap warning is about.
        zone = max(candidates, key=lambda z: z.priority)
        distance = zone.distance_to_boundary_m(floor_xy)
        return ZoneAssignment(
            zone.zone_id, distance, near_boundary=distance <= self.boundary_margin_m
        )

    def locate(self, track: Track) -> Track:
        """Fill in `track.zone` from `track.floor_xy`. Mutates and returns."""
        track.zone = self.assign(track.floor_xy).zone_id
        return track

    def locate_all(self, tracks: Iterable[Track]) -> list[Track]:
        return [self.locate(t) for t in tracks]


# --------------------------------------------------------------------------- #
# Dwell intervals
# --------------------------------------------------------------------------- #


@dataclass(slots=True)
class _OpenVisit:
    zone_id: str
    entered_at: float
    last_seen_at: float
    # How many of this visit's samples sat within the boundary margin. Carried
    # so D-013's uncertainty reaches Phase 12's journeys instead of being lost
    # between stages — a visit that was mostly near an edge may have been in
    # the neighbouring zone entirely.
    samples: int = 0
    near_boundary_samples: int = 0


@dataclass(slots=True)
class ZoneEventBuilder:
    """Turns per-frame zone assignments into dwell intervals.

    The brief's storage rule is intervals, not frame rows: a ten-minute,
    two-camera run is ~30 000 frames, and nobody wants a row per person per
    frame to answer "how long did they spend at the checkout".

    `min_dwell_seconds` is the flicker guard, and it exists because of a
    measurement rather than a hunch. D-012 put the foot-point error's p95 at
    about a metre, systematically biased away from the camera, so a person
    standing near a zone edge oscillates across it frame to frame. Without the
    guard they generate dozens of fractional-second visits alternating between
    two zones, every one of them fictional. Visits shorter than this are
    dropped, and the interval that surrounds them is left intact.
    """

    min_dwell_seconds: float = 0.5
    # Optional, and only used to record how close each sample was to a zone
    # edge. Absent it, `near_boundary_shares` stays empty and Phase 12 simply
    # reports less — never something false.
    zone_map: ZoneMap | None = None
    _open: dict[str, _OpenVisit] = field(default_factory=dict, init=False)
    _closed: list[ZoneEvent] = field(default_factory=list, init=False)
    _suppressed: int = field(default=0, init=False)
    # (global_id, zone_id, entered_at) -> share of samples near a boundary.
    near_boundary_shares: dict[tuple[str, str, float], float] = field(
        default_factory=dict, init=False
    )

    def update(
        self,
        person_id: str,
        zone_id: str,
        timestamp: float,
        *,
        near_boundary: bool = False,
    ) -> None:
        """Record where one person was at one moment."""
        current = self._open.get(person_id)

        if current is None:
            self._open[person_id] = _OpenVisit(
                zone_id, timestamp, timestamp, samples=1,
                near_boundary_samples=1 if near_boundary else 0,
            )
            return

        if zone_id == current.zone_id:
            current.last_seen_at = timestamp
            current.samples += 1
            current.near_boundary_samples += 1 if near_boundary else 0
            return

        # They moved. Close the previous visit — unless it was too short to
        # have been real.
        duration = current.last_seen_at - current.entered_at
        if duration >= self.min_dwell_seconds:
            self._closed.append(
                ZoneEvent(
                    global_id=person_id,
                    zone_id=current.zone_id,
                    entered_at=current.entered_at,
                    exited_at=timestamp,
                )
            )
            self._record_share(person_id, current)
        else:
            self._suppressed += 1
        self._open[person_id] = _OpenVisit(
            zone_id, timestamp, timestamp, samples=1,
            near_boundary_samples=1 if near_boundary else 0,
        )

    def _record_share(self, person_id: str, visit: _OpenVisit) -> None:
        if visit.samples:
            self.near_boundary_shares[(person_id, visit.zone_id, visit.entered_at)] = (
                visit.near_boundary_samples / visit.samples
            )

    def update_tracks(self, tracks: Iterable[Track]) -> None:
        """Record a frame's worth of tracks.

        Keyed on `global_id` where Phase 08 has supplied one, and on
        `camera_id:local_track_id` until then — never on `local_track_id`
        alone, which is only unique within one camera and would merge two
        people the moment a second camera was processed.
        """
        for track in tracks:
            if track.zone is None:
                continue
            person = track.global_id or f"{track.camera_id}:{track.local_track_id}"
            near = False
            if track.floor_xy is not None and self.zone_map is not None:
                near = self.zone_map.assign(track.floor_xy).near_boundary
            self.update(person, track.zone, track.timestamp, near_boundary=near)

    def close(self, timestamp: float | None = None) -> list[ZoneEvent]:
        """Finish every open visit and return the complete list.

        A visit still open at the end of the video has an unknown exit time.
        Passing the final timestamp closes it there; passing nothing leaves
        `exited_at` as None, which `ZoneEvent.duration_seconds` reports as None
        rather than as zero. "Still inside when the recording stopped" is not
        "stayed no time at all".
        """
        for person, visit in self._open.items():
            duration = visit.last_seen_at - visit.entered_at
            if duration < self.min_dwell_seconds and timestamp is not None:
                self._suppressed += 1
                continue
            self._closed.append(
                ZoneEvent(
                    global_id=person,
                    zone_id=visit.zone_id,
                    entered_at=visit.entered_at,
                    exited_at=timestamp,
                )
            )
            self._record_share(person, visit)
        self._open.clear()
        return list(self._closed)

    @property
    def events(self) -> list[ZoneEvent]:
        """Visits closed so far. Does not finish the open ones."""
        return list(self._closed)

    def stats(self) -> dict[str, object]:
        return {
            "events": len(self._closed),
            "open_visits": len(self._open),
            "suppressed_flicker": self._suppressed,
            "min_dwell_seconds": self.min_dwell_seconds,
        }


# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #


def _polygon_from(zone_id: str, points: Sequence[Sequence[float]]) -> Polygon:
    if len(points) < 3:
        raise ZoneError(
            f"zone {zone_id!r} has {len(points)} point(s); a polygon needs at least 3"
        )
    try:
        polygon = Polygon([(float(x), float(y)) for x, y in points])
    except (TypeError, ValueError) as exc:
        raise ZoneError(f"zone {zone_id!r} has malformed points: {exc}") from exc

    if not polygon.is_valid:
        # Self-intersecting ("bow-tie") polygons are the usual cause, and they
        # come from listing corners in the wrong order. Shapely will still
        # answer containment questions about them, inconsistently.
        raise ZoneError(
            f"zone {zone_id!r} is not a valid polygon: {explain_validity(polygon)}. "
            "The usual cause is corners listed out of order, which makes a "
            "bow-tie shape that answers containment questions inconsistently."
        )
    if polygon.area <= 0:
        raise ZoneError(f"zone {zone_id!r} has zero area")
    return polygon


def load_zone_map(path: str = "zones") -> ZoneMap:
    """Build the `ZoneMap` from `config/zones.yaml`.

    Zones outside the declared floor plan are a warning rather than an error:
    the floor size is a convenience for drawing, and refusing to start because a
    polygon overhangs it by five centimetres would be obstructive.
    """
    data = load_yaml(path)
    raw = data.get("zones") or []
    if not raw:
        raise ConfigError(f"config/{path}.yaml defines no zones")

    floor = data.get("floor") or {}
    floor_size = (
        (float(floor["width_m"]), float(floor["depth_m"]))
        if "width_m" in floor and "depth_m" in floor
        else None
    )

    zones: list[Zone] = []
    seen: set[str] = set()
    for i, entry in enumerate(raw):
        missing = {"zone_id", "points"} - set(entry)
        if missing:
            raise ConfigError(f"config/{path}.yaml: zone #{i} is missing {sorted(missing)}")
        zone_id = str(entry["zone_id"])
        if zone_id in seen:
            raise ConfigError(
                f"config/{path}.yaml: duplicate zone_id {zone_id!r}. Dwell time is "
                "aggregated per zone id, so two zones sharing one would silently "
                "merge their totals."
            )
        if zone_id == OUTSIDE:
            raise ConfigError(
                f"config/{path}.yaml: {OUTSIDE!r} is reserved for positions in no "
                "zone and cannot be used as a zone_id."
            )
        seen.add(zone_id)
        zones.append(
            Zone(
                zone_id=zone_id,
                name=str(entry.get("name", zone_id)),
                polygon=_polygon_from(zone_id, entry["points"]),
                kind=str(entry.get("kind", "retail")),
                priority=int(entry.get("priority", 0)),
                description=str(entry.get("description", "")),
            )
        )

    zone_map = ZoneMap(
        zones,
        boundary_margin_m=float(data.get("boundary_margin_m", 1.0)),
        floor_size_m=floor_size,
    )

    if floor_size:
        width, depth = floor_size
        for zone in zones:
            minx, miny, maxx, maxy = zone.polygon.bounds
            if minx < -0.01 or miny < -0.01 or maxx > width + 0.01 or maxy > depth + 0.01:
                log.warning(
                    "zone extends beyond the declared floor plan",
                    extra={
                        "zone": zone.zone_id,
                        "bounds": [round(v, 2) for v in zone.polygon.bounds],
                        "floor": [width, depth],
                    },
                )
    return zone_map
