/* SIMULATED operations only. No DOM, renderer, network, Session or Event writes. */
export const VISITOR_ESTIMATES = Object.freeze({
  source: 'SIMULATED',
  provenance: 'User-provided third-edition operating estimates; not measured traffic',
  dailyByInterval: Object.freeze({ 5: 6600, 5.5: 6000, 6: 5500 }),
  averageByDwell: Object.freeze({ 20: 167, 30: 250, 45: 375, 60: 500, 90: 745, 120: 979 }),
  particlesByDwell: Object.freeze({ 20: 17, 30: 25, 45: 38, 60: 50, 90: 75, 120: 98 }),
});

export const VISITOR_HOURS = Object.freeze({
  opens: '09:30', lastAdmission: '20:30', closes: '21:30',
  openMinuteOfDay: 570, admissionMinutes: 660, operatingMinutes: 720,
});

const BATCH_SIZE = 50;
const PEOPLE_PER_PARTICLE = 10;
const SPEEDS = [0.5, 1, 2];
const METRIC_WINDOWS = [15, 30, 60, 120];
const ROUTE_SAMPLES = 512;
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const finite = (value, name) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
  return value;
};

function validateConfig(next) {
  if (!Object.hasOwn(VISITOR_ESTIMATES.dailyByInterval, next.intervalMinutes)) throw new RangeError('intervalMinutes must be 5, 5.5 or 6');
  if (!Object.hasOwn(VISITOR_ESTIMATES.averageByDwell, next.dwellMinutes)) throw new RangeError('dwellMinutes must be 20, 30, 45, 60, 90 or 120');
  if (!SPEEDS.includes(next.speed)) throw new RangeError('speed must be 0.5, 1 or 2');
  if (finite(next.minutesPerRealSecond, 'minutesPerRealSecond') <= 0) throw new RangeError('minutesPerRealSecond must be positive');
  if (typeof next.routeId !== 'string' || !next.routeId) throw new TypeError('routeId is required');
}

function normalizeRegions(regions = []) {
  if (!Array.isArray(regions)) throw new TypeError('regions must be an array');
  const ids = new Set();
  return regions.map(region => {
    if (!region.regionId || ids.has(region.regionId)) throw new TypeError('Each region needs a unique regionId');
    ids.add(region.regionId);
    const start = finite(region.start, 'region.start');
    const end = finite(region.end, 'region.end');
    const participationRate = region.participationRate ?? 1;
    const speedFactor = region.speedFactor ?? 1;
    if (start < 0 || end > 1 || end <= start) throw new RangeError('Region progress must satisfy 0 <= start < end <= 1');
    if (finite(participationRate, 'participationRate') < 0 || participationRate > 1) throw new RangeError('participationRate must be between 0 and 1');
    if (finite(speedFactor, 'speedFactor') <= 0) throw new RangeError('speedFactor must be positive');
    return { regionId: region.regionId, label: region.label || region.regionId,
      floorId: region.floorId ?? null, start, end, participationRate, speedFactor,
      source: 'SIMULATED', verified: false };
  });
}

// Regions refer to normalized distance along the caller's CAD-registered route.
// A speedFactor < 1 reserves more of the chosen visit duration for that interval.
function createPaceMap(regions) {
  const cuts = [...new Set([0, 1, ...regions.flatMap(region => [region.start, region.end])])].sort((a, b) => a - b);
  let total = 0;
  const spans = cuts.slice(1).map((end, index) => {
    const start = cuts[index];
    const midpoint = (start + end) / 2;
    const speedFactor = regions.filter(region => midpoint >= region.start && midpoint < region.end)
      .reduce((slowest, region) => Math.min(slowest, region.speedFactor), 1);
    const span = { start, end, speedFactor, timeStart: total };
    total += (end - start) / speedFactor;
    span.timeEnd = total;
    return span;
  });
  return {
    at(timeFraction) {
      const weightedTime = clamp(timeFraction, 0, 1) * total;
      const span = spans.find(item => weightedTime < item.timeEnd) || spans[spans.length - 1];
      return { progress: clamp(span.start + (weightedTime - span.timeStart) * span.speedFactor, 0, 1),
        progressPerTimeFraction: total * span.speedFactor };
    },
    timeAt(progress) {
      const value = clamp(progress, 0, 1);
      const span = spans.find(item => value < item.end) || spans[spans.length - 1];
      return (span.timeStart + (value - span.start) / span.speedFactor) / total;
    },
  };
}

function clockAt(elapsedMinutes) {
  const seconds = Math.floor((VISITOR_HOURS.openMinuteOfDay + elapsedMinutes) * 60 + 1e-7);
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor(seconds / 60) % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

/**
 * A deterministic batch scenario, separate from the user's published averages.
 * seek() uses minutes elapsed since 09:30. advance() accepts real seconds.
 * configure() replays the new scenario at the current clock; it does not mutate
 * any business history. reset() returns to 09:30, paused, retaining chosen controls.
 * routeResolver(progress, particle) may return {floorId, regionId, phase}; no CAD
 * coordinates or floor transformations are calculated by this module.
 */
export function createVisitorSimulation(options = {}) {
  let config = {
    intervalMinutes: options.intervalMinutes ?? 6,
    dwellMinutes: options.dwellMinutes ?? 30,
    speed: options.speed ?? 1,
    minutesPerRealSecond: options.minutesPerRealSecond ?? 1,
    routeId: options.routeId ?? 'visitor-primary',
  };
  validateConfig(config);
  let regions = normalizeRegions(options.regions);
  let pace = createPaceMap(regions);
  let routeResolver = options.routeResolver ?? null;
  if (routeResolver !== null && typeof routeResolver !== 'function') throw new TypeError('routeResolver must be a function');
  let elapsedMinutes = clamp(finite(options.initialMinute ?? 0, 'initialMinute'), 0, VISITOR_HOURS.operatingMinutes);
  let playing = false;
  let scenarioRevision = 0;
  let cache = null;
  let resolvedRegions = null;
  const invalidate = () => { cache = null; };

  // Only the caller can associate a progress value with a CAD-registered region.
  // Sample these associations once, then integrate time analytically per batch.
  function regionIntervals() {
    if (resolvedRegions) return resolvedRegions;
    const groups = new Map();
    let previousKey = null;
    for (let index = 0; index < ROUTE_SAMPLES; index++) {
      const start = index / ROUTE_SAMPLES;
      const end = (index + 1) / ROUTE_SAMPLES;
      const progress = (start + end) / 2;
      const assigned = regions.find(region => progress >= region.start && progress < region.end);
      const resolved = routeResolver?.(progress, { routeId: config.routeId, progress,
        particleId: 'SIMULATED-metric-probe', simulationTime: null, source: 'SIMULATED' });
      const regionId = resolved?.regionId ?? assigned?.regionId;
      if (regionId === null || regionId === undefined) { previousKey = null; continue; }
      const floorId = resolved?.floorId ?? assigned?.floorId ?? null;
      const key = `${floorId ?? ''}::${regionId}`;
      let group = groups.get(key);
      if (!group) {
        const allocation = regions.find(region => region.regionId === regionId);
        group = { regionId, floorId, label: allocation?.label ?? regionId,
          participationRate: allocation?.participationRate ?? 1, intervals: [] };
        groups.set(key, group);
      }
      if (previousKey === key) group.intervals[group.intervals.length - 1].end = end;
      else group.intervals.push({ start, end });
      previousKey = key;
    }
    resolvedRegions = [...groups.values()].map(group => ({ ...group,
      intervals: group.intervals.map(interval => ({ start: pace.timeAt(interval.start), end: pace.timeAt(interval.end) })) }));
    return resolvedRegions;
  }

  function aggregateRegions(batchStates, particles, minute) {
    return regionIntervals().map(region => {
      const windows = Object.fromEntries(METRIC_WINDOWS.map(windowMinutes => [windowMinutes, {
        windowMinutes, observedMinutes: Math.min(minute, windowMinutes), windowVisitors: 0,
        enteredPeople: 0, personMinutes: 0, windowAveragePeople: 0, meanObservedDwellMinutes: 0,
      }]));
      let cumulativeParticipants = 0;
      let personMinutes = 0;
      for (const batch of batchStates) {
        const weight = BATCH_SIZE * region.participationRate;
        let visited = false;
        const overlaps = Object.fromEntries(METRIC_WINDOWS.map(windowMinutes => [windowMinutes, { seen: false, entered: false }]));
        for (const interval of region.intervals) {
          const start = batch.entryMinute + interval.start * batch.effectiveDwellMinutes;
          const end = batch.entryMinute + interval.end * batch.effectiveDwellMinutes;
          if (minute >= start) visited = true;
          personMinutes += Math.max(0, Math.min(minute, end) - start) * weight;
          for (const windowMinutes of METRIC_WINDOWS) {
            const windowStart = Math.max(0, minute - windowMinutes);
            const overlap = Math.max(0, Math.min(minute, end) - Math.max(windowStart, start));
            windows[windowMinutes].personMinutes += overlap * weight;
            if (overlap > 0) overlaps[windowMinutes].seen = true;
            if (start >= windowStart && start <= minute) overlaps[windowMinutes].entered = true;
          }
        }
        if (visited) cumulativeParticipants += weight;
        for (const windowMinutes of METRIC_WINDOWS) {
          if (overlaps[windowMinutes].seen) windows[windowMinutes].windowVisitors += weight;
          if (overlaps[windowMinutes].entered) windows[windowMinutes].enteredPeople += weight;
        }
      }
      for (const window of Object.values(windows)) {
        window.windowAveragePeople = window.observedMinutes > 0 ? window.personMinutes / window.observedMinutes : 0;
        window.meanObservedDwellMinutes = window.windowVisitors > 0 ? window.personMinutes / window.windowVisitors : 0;
      }
      return { regionId: region.regionId, floorId: region.floorId, label: region.label,
        source: 'SIMULATED', verified: false, participationRate: region.participationRate,
        currentPeople: particles.filter(particle => particle.regionId === region.regionId && particle.floorId === region.floorId)
          .reduce((total, particle) => total + particle.representedPeople * region.participationRate, 0),
        cumulativeParticipants, personMinutes,
        meanObservedDwellMinutes: cumulativeParticipants > 0 ? personMinutes / cumulativeParticipants : 0,
        windows, routeSamples: ROUTE_SAMPLES,
        method: 'CAD-route resolver assignment sampled at 512 progress bins; cohort-centerline time integration approximates the five spaced representative particles. Current people use their individual route positions. Window dwell is truncated to the selected window.',
      };
    });
  }

  function compute(minute = elapsedMinutes, queryOnly = false) {
    if (!queryOnly && cache) return cache;
    const elapsedMinutes = minute;
    const particles = [];
    const batchStates = [];
    const floorOccupancy = {};
    const regionStats = regions.map(region => ({ ...region, currentPeople: 0, cumulativeParticipants: 0,
      completedParticipants: 0, totalDwellPersonMinutes: 0, averageDwellMinutes: 0,
      allocationMethod: 'SIMULATED route interval and participation rate; not observed behavior' }));
    let cumulativeAdmitted = 0;
    let cumulativeExited = 0;
    let earlyDepartures = 0;
    let scheduledEarlyDepartures = 0;
    let currentBatch = 0;
    let inTransitOccupancy = 0;
    const maximumBatches = Math.ceil(VISITOR_HOURS.admissionMinutes / config.intervalMinutes);

    for (let index = 0; index < maximumBatches; index++) {
      const entryMinute = index * config.intervalMinutes;
      if (entryMinute > elapsedMinutes) break;
      const batchNumber = index + 1;
      currentBatch = batchNumber;
      cumulativeAdmitted += BATCH_SIZE;
      const plannedExitMinute = entryMinute + config.dwellMinutes;
      const exitMinute = Math.min(plannedExitMinute, VISITOR_HOURS.operatingMinutes);
      const effectiveDwellMinutes = exitMinute - entryMinute;
      batchStates.push({ entryMinute, effectiveDwellMinutes });
      const early = plannedExitMinute > VISITOR_HOURS.operatingMinutes;
      const departed = elapsedMinutes >= exitMinute;
      const age = Math.min(elapsedMinutes - entryMinute, effectiveDwellMinutes);
      const { progress, progressPerTimeFraction } = pace.at(age / effectiveDwellMinutes);
      if (early) scheduledEarlyDepartures += BATCH_SIZE;
      if (departed) {
        cumulativeExited += BATCH_SIZE;
        if (early) earlyDepartures += BATCH_SIZE;
      }

      for (const region of queryOnly ? [] : regionStats) {
        const startMinute = entryMinute + pace.timeAt(region.start) * effectiveDwellMinutes;
        const endMinute = entryMinute + pace.timeAt(region.end) * effectiveDwellMinutes;
        const participants = BATCH_SIZE * region.participationRate;
        if (elapsedMinutes >= startMinute) region.cumulativeParticipants += participants;
        if (elapsedMinutes >= endMinute) region.completedParticipants += participants;
        if (!departed && progress >= region.start && progress < region.end) region.currentPeople += participants;
        region.totalDwellPersonMinutes += Math.max(0, Math.min(elapsedMinutes, endMinute) - startMinute) * participants;
      }
      if (departed) continue;

      for (let displayIndex = 0; displayIndex < BATCH_SIZE / PEOPLE_PER_PARTICLE; displayIndex++) {
        // Spread only along the registered path, never sideways through CAD walls.
        // Each monotonic curve has the same entry/exit time and both exact endpoints.
        const offset = (displayIndex - 2) * 0.008;
        const particleProgress = clamp(progress + offset * Math.sin(Math.PI * progress), 0, 1);
        const spacingDerivative = 1 + offset * Math.PI * Math.cos(Math.PI * progress);
        const particle = {
          particleId: `sim-${scenarioRevision}-${batchNumber}-${displayIndex}`,
          routeId: config.routeId, progress: particleProgress, speed: progressPerTimeFraction / effectiveDwellMinutes * spacingDerivative,
          alpha: clamp(age / Math.min(0.3, effectiveDwellMinutes * 0.015), 0, 1) * clamp((1 - particleProgress) / 0.055, 0, 1),
          floorId: null, regionId: null, phase: null,
          simulationTime: elapsedMinutes, entryMinute, exitMinute, plannedExitMinute,
          effectiveDwellMinutes, batchNumber, displayIndex, representedPeople: PEOPLE_PER_PARTICLE,
          earlyDeparture: early, source: 'SIMULATED', verified: false,
        };
        const location = routeResolver ? routeResolver(particleProgress, particle) : null;
        particle.floorId = location?.floorId ?? null;
        particle.regionId = location?.regionId ?? regions.find(region => particleProgress >= region.start && particleProgress < region.end)?.regionId ?? null;
        particle.phase = location?.phase ?? null;
        if (particle.floorId !== null) floorOccupancy[particle.floorId] = (floorOccupancy[particle.floorId] || 0) + PEOPLE_PER_PARTICLE;
        else inTransitOccupancy += PEOPLE_PER_PARTICLE;
        particles.push(particle);
      }
    }
    for (const region of regionStats) {
      region.averageDwellMinutes = region.cumulativeParticipants > 0 ? region.totalDwellPersonMinutes / region.cumulativeParticipants : 0;
    }
    const givenMeanOccupancy = VISITOR_ESTIMATES.averageByDwell[config.dwellMinutes];
    const result = {
      particles,
      snapshot: {
        source: 'SIMULATED', verified: false, scenarioRevision,
        playing, status: elapsedMinutes >= VISITOR_HOURS.operatingMinutes ? 'CLOSED' : playing ? 'PLAYING' : 'PAUSED',
        intervalMinutes: config.intervalMinutes, dwellMinutes: config.dwellMinutes,
        speed: config.speed, minutesPerRealSecond: config.minutesPerRealSecond,
        effectiveMinutesPerRealSecond: config.minutesPerRealSecond * config.speed,
        timeScaleLabel: `1 real second = ${config.minutesPerRealSecond} simulated minute(s) × ${config.speed}`,
        elapsedMinutes, simulationTime: elapsedMinutes, clockLabel: clockAt(elapsedMinutes),
        admissionsOpen: elapsedMinutes < VISITOR_HOURS.admissionMinutes,
        closesAt: VISITOR_HOURS.closes, admissionEndsAt: VISITOR_HOURS.lastAdmission,
        batchSize: BATCH_SIZE, currentBatch, totalScheduledBatches: maximumBatches,
        nextAdmissionMinute: currentBatch < maximumBatches ? currentBatch * config.intervalMinutes : null,
        dailyEstimate: VISITOR_ESTIMATES.dailyByInterval[config.intervalMinutes],
        givenMeanOccupancy, averageOccupancyEstimate: givenMeanOccupancy,
        estimatedMeanParticleCount: VISITOR_ESTIMATES.particlesByDwell[config.dwellMinutes],
        cumulativeAdmitted, cumulativeExited, currentOccupancy: cumulativeAdmitted - cumulativeExited,
        earlyDepartures, scheduledEarlyDepartures,
        displayParticleCount: particles.length, peoplePerParticle: PEOPLE_PER_PARTICLE,
        floorOccupancy, inTransitOccupancy, regionStats,
        regionMetrics: queryOnly ? [] : aggregateRegions(batchStates, particles, elapsedMinutes),
        estimateProvenance: VISITOR_ESTIMATES.provenance,
        occupancyMethod: 'Deterministic 50-person batches; actual scenario state, separate from supplied mean estimate',
        closingPolicy: 'Admission at 09:30 included; 20:30 excluded. Visits ending after 21:30 are shortened to reach the exit by closing.',
        closingEstimateNote: 'The supplied mean estimates are retained unchanged. No additional original early-departure assumptions were supplied.',
      },
    };
    if (!queryOnly) cache = result;
    return result;
  }

  const api = {
    snapshot() {
      const value = compute().snapshot;
      return { ...value, floorOccupancy: { ...value.floorOccupancy }, regionStats: value.regionStats.map(region => ({ ...region })),
        regionMetrics: value.regionMetrics.map(region => ({ ...region,
          windows: Object.fromEntries(Object.entries(region.windows).map(([key, window]) => [key, { ...window }])) })) };
    },
    particles() { return compute().particles.map(particle => ({ ...particle })); },
    particlesAt(minute) {
      return compute(clamp(finite(minute, 'elapsedMinutes'), 0, VISITOR_HOURS.operatingMinutes), true).particles;
    },
    configure(patch = {}) {
      const next = { ...config };
      for (const key of Object.keys(config)) if (Object.hasOwn(patch, key)) next[key] = patch[key];
      validateConfig(next);
      const nextRegions = Object.hasOwn(patch, 'regions') ? normalizeRegions(patch.regions) : regions;
      if (next.intervalMinutes !== config.intervalMinutes || next.dwellMinutes !== config.dwellMinutes ||
          next.routeId !== config.routeId || nextRegions !== regions) scenarioRevision++;
      config = next;
      regions = nextRegions;
      pace = createPaceMap(regions);
      resolvedRegions = null;
      invalidate();
      return api.snapshot();
    },
    setRouteResolver(resolver) {
      if (resolver !== null && typeof resolver !== 'function') throw new TypeError('routeResolver must be a function');
      routeResolver = resolver;
      resolvedRegions = null;
      invalidate();
      return api.snapshot();
    },
    play() { playing = elapsedMinutes < VISITOR_HOURS.operatingMinutes; invalidate(); return api.snapshot(); },
    pause() { playing = false; invalidate(); return api.snapshot(); },
    reset() { elapsedMinutes = 0; playing = false; scenarioRevision++; invalidate(); return api.snapshot(); },
    seek(minute) {
      elapsedMinutes = clamp(finite(minute, 'elapsedMinutes'), 0, VISITOR_HOURS.operatingMinutes);
      if (elapsedMinutes === VISITOR_HOURS.operatingMinutes) playing = false;
      invalidate();
      return api.snapshot();
    },
    advance(realSeconds) {
      if (finite(realSeconds, 'realSeconds') < 0) throw new RangeError('realSeconds must not be negative');
      if (playing) {
        elapsedMinutes = Math.min(VISITOR_HOURS.operatingMinutes,
          elapsedMinutes + realSeconds * config.minutesPerRealSecond * config.speed);
        if (elapsedMinutes === VISITOR_HOURS.operatingMinutes) playing = false;
        invalidate();
      }
      return api.snapshot();
    },
  };
  return api;
}
