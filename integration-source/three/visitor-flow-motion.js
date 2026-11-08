/* Visual-only SIMULATED flow scheduling. Never changes operational visitor counts. */
const CAPACITY = 240;
const ROUTE_BINS = 256;
const ADMISSION_END = 660;
const CLOSING = 720;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const smooth = value => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); };
const PROFILES = Object.freeze({
  low: Object.freeze({ rate: 0.76, widthScale: 0.6, clustering: 0.12, regionWeight: 1.12, sizeScale: 0.96, highlights: 0.045 }),
  medium: Object.freeze({ rate: 1.00, widthScale: 0.8, clustering: 0.38, regionWeight: 1.38, sizeScale: 1.00, highlights: 0.065 }),
  high: Object.freeze({ rate: 1.28, widthScale: 1.0, clustering: 0.72, regionWeight: 1.72, sizeScale: 1.03, highlights: 0.085 }),
});

function hashText(value) {
  let seed = 2166136261;
  for (let i = 0; i < value.length; i++) seed = Math.imul(seed ^ value.charCodeAt(i), 16777619);
  return seed >>> 0;
}

function random(seed, index, salt) {
  let value = (seed ^ Math.imul(index + 1, 0x9e3779b1) ^ Math.imul(salt + 1, 0x85ebca6b)) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d);
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296;
}

function createPace(mask, regionWeight) {
  const weights = mask.map(value => 1 + value * (regionWeight - 1));
  const cumulative = [0];
  for (let i = 1; i < weights.length; i++) cumulative.push(cumulative[i - 1] + (weights[i - 1] + weights[i]) / (2 * ROUTE_BINS));
  const total = cumulative.at(-1);
  return fraction => {
    const target = clamp(fraction, 0, 1) * total;
    let low = 0, high = ROUTE_BINS;
    while (low + 1 < high) { const middle = (low + high) >> 1; if (cumulative[middle] <= target) low = middle; else high = middle; }
    const a = weights[low], delta = weights[low + 1] - a;
    const localTime = Math.max(0, (target - cumulative[low]) * ROUTE_BINS);
    // Exact inverse of an integrated linearly varying weight: continuous speed
    // at every bin boundary, without per-frame randomness or abrupt slow zones.
    const position = clamp(2 * localTime / (a + Math.sqrt(Math.max(0, a * a + 2 * delta * localTime))), 0, 1);
    return { progress: (low + position) / ROUTE_BINS, derivative: total / (a + delta * position) };
  };
}

/**
 * sample(snapshot) is a deterministic, stateless visual query. Time is simulated
 * minutes since 09:30, supplied by the unchanged operations simulation. Playback
 * pause/seek/speed therefore work without another clock, RAF, or accumulator.
 * Slots are reused modulo 240; emissions are deliberately not 50-person batches.
 * Their number and speed are an abstract rendering, never a visitor-count source.
 */
export function createVisitorMotion(route) {
  if (!route || typeof route.sample !== 'function') throw new TypeError('A registered visitor route is required');
  const routeId = route.network?.route_id || 'visitor-primary';
  const seed = hashText(routeId);
  let mask = Array.from({ length: ROUTE_BINS + 1 }, (_, index) => route.sample(index / ROUTE_BINS).regionId ? 1 : 0);
  for (let pass = 0; pass < 3; pass++) mask = mask.map((_, index) => {
    let total = 0, count = 0;
    for (let offset = -3; offset <= 3; offset++) { total += mask[clamp(index + offset, 0, ROUTE_BINS)]; count++; }
    return total / count;
  });
  const paceMaps = Object.fromEntries(Object.entries(PROFILES).map(([level, profile]) => [level, createPace(mask, profile.regionWeight)]));

  return {
    sample(snapshot) {
      const elapsed = Number(snapshot.elapsedMinutes);
      const dwell = Number(snapshot.dwellMinutes);
      const interval = Number(snapshot.intervalMinutes);
      if (!Number.isFinite(elapsed) || ![20, 30, 45, 60, 90, 120].includes(dwell) || ![5, 5.5, 6].includes(interval)) {
        throw new RangeError('Expected the unchanged operations snapshot with elapsedMinutes, dwellMinutes and intervalMinutes');
      }
      const level = dwell <= 30 ? 'low' : dwell <= 60 ? 'medium' : 'high';
      const profile = PROFILES[level];
      const emissionRate = profile.rate * 5.5 / interval;
      const gap = 1 / emissionRate;
      const density = {
        level, widthScale: profile.widthScale, clustering: profile.clustering,
        emissionRatePerMinute: elapsed < ADMISSION_END ? emissionRate : 0,
        scheduledEmissionRatePerMinute: emissionRate,
        visualParticleCount: 0, capacity: CAPACITY, statistical: false,
        particleRepresentsPeople: null,
        note: 'SIMULATED visual emissions; variable spacing, pace and size. Operational occupancy and batch counts remain exclusively in visitor-simulation.',
      };
      const result = { particles: [], density, source: 'SIMULATED', statistical: false };
      if (elapsed < 0 || elapsed >= CLOSING || Number(snapshot.currentOccupancy) <= 0) return result;

      const maximumLifetime = dwell * 1.22;
      const first = Math.max(0, Math.floor((elapsed - maximumLifetime) / gap) - 2);
      const last = Math.ceil(Math.min(elapsed, ADMISSION_END) / gap) + 2;
      const birthPhase = random(seed, 0, 1) * Math.PI * 2;
      for (let index = first; index <= last; index++) {
        const jitter = (random(seed, index, 2) - 0.5) * 0.38;
        const cluster = (0.18 + profile.clustering * 0.48) * (Math.sin(index * 0.61 + birthPhase) - Math.sin(birthPhase));
        const birth = index === 0 ? 0 : gap * (index + jitter + cluster);
        if (birth < 0 || birth >= ADMISSION_END || birth > elapsed) continue;
        const lifetime = dwell * (0.74 + random(seed, index, 3) * 0.48);
        const exit = Math.min(birth + lifetime, CLOSING);
        if (elapsed >= exit) continue;
        const age = elapsed - birth;
        const duration = exit - birth;
        const fraction = age / duration;
        const phase = random(seed, index, 4) * Math.PI * 2;
        const modulation = 0.08 + random(seed, index, 5) * 0.14;
        const timeFraction = fraction + modulation * (Math.sin(fraction * Math.PI * 2 + phase) - Math.sin(phase)) / (Math.PI * 2);
        const timeDerivative = 1 + modulation * Math.cos(fraction * Math.PI * 2 + phase);
        const paced = paceMaps[level](timeFraction);
        const speed = paced.derivative * timeDerivative / duration;
        const highlight = random(seed, index, 6) < profile.highlights;
        const size = highlight ? 4 + random(seed, index, 7) * 2 : clamp((2.5 + random(seed, index, 7) * 2.05) * profile.sizeScale, 2.4, 4.8);
        const fade = smooth(age / (0.16 + random(seed, index, 8) * 0.14)) * smooth((exit - elapsed) / (0.20 + random(seed, index, 9) * 0.18));
        const alpha = (0.48 + random(seed, index, 10) * 0.36) * fade;
        const lane = (random(seed, index, 11) * 2 - 1) * 0.62;
        const drift = Math.sin(age * (0.18 + random(seed, index, 12) * 0.14) + phase) * (0.12 + profile.clustering * 0.13);
        const lateralSeed = clamp((lane + drift) * Math.sin(Math.PI * paced.progress), -1, 1);
        const location = route.sample(paced.progress);
        result.particles.push({
          id: `visual-flow-${index % CAPACITY}`, particleId: `visual-flow-${index % CAPACITY}`,
          emissionId: index, routeId, progress: paced.progress, speed,
          lateralSeed, size, alpha, highlight,
          trailLength: 2 + Math.floor(random(seed, index, 13) * (level === 'low' ? 2 : 3)),
          trailStep: clamp(speed * 0.012, 0.000035, 0.00026),
          floorId: location.floorId ?? null, phase: location.phase ?? null,
          birthMinute: birth, exitMinute: exit, simulationTime: elapsed,
          source: 'SIMULATED', statistical: false,
        });
      }
      // With supported controls the lifetime/rate bounds stay below 240 slots.
      // Retain the hard cap independently so a visual pool cannot grow unbounded.
      if (result.particles.length > CAPACITY) result.particles.splice(0, result.particles.length - CAPACITY);
      density.visualParticleCount = result.particles.length;
      return result;
    },
  };
}
