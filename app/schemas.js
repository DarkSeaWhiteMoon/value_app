/**
 * Shared JSON shapes for exports (schemaVersion: "v1").
 */
import { valueDimensions } from './constants.js';

export const SCHEMA_VERSION = 'v1';

/**
 * ValueProfile — measured or manually supplied individual parameters.
 * @param {object} pvqResult — persisted PVQ payload from storage (has w_i, dimensions, etc.)
 */
export function buildValueProfileFromPvqResult(pvqResult) {
  if (!pvqResult || typeof pvqResult !== 'object') throw new Error('buildValueProfileFromPvqResult: invalid input');
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'value_profile',
    source: 'pvq40',
    createdAt: pvqResult.createdAt,
    valueDimensions: [...valueDimensions],
    w_i: pvqResult.w_i.map(Number),
    grandMean: pvqResult.grandMean,
    topDimensionIds: pvqResult.top,
    bottomDimensionIds: pvqResult.bottom,
    dimensions: pvqResult.dimensions,
    answers: pvqResult.answers,
    pvqPayloadVersion: pvqResult.version,
  };
}

/**
 * Minimal profile when user only supplies w_i (e.g. pasted vector).
 */
export function buildValueProfileFromWiOnly(w_i, meta = {}) {
  if (!Array.isArray(w_i) || w_i.length !== 10) throw new Error('buildValueProfileFromWiOnly: w_i must be length 10');
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'value_profile',
    source: meta.source || 'manual_w_i',
    createdAt: meta.createdAt || new Date().toISOString(),
    valueDimensions: [...valueDimensions],
    w_i: w_i.map(Number),
  };
}

/**
 * Choice — one evaluable option x.
 */
export function normalizeChoice(raw, indexFallback = 0) {
  const v = Array.isArray(raw.v) ? raw.v.map(Number) : [];
  if (v.length !== 10) throw new Error('normalizeChoice: v must have length 10');
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'choice',
    id: raw.id != null ? String(raw.id) : `choice_${indexFallback}`,
    name: String(raw.name ?? ''),
    tag: raw.tag != null ? String(raw.tag) : '',
    v,
    effort: Number(raw.effort),
  };
}

export function buildCompareSessionExport({ profile, utilityParams, choicesRaw, rankingRows }) {
  const choices = choicesRaw.map((c, i) => normalizeChoice(c, i));
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'compare_session',
    exportedAt: new Date().toISOString(),
    profile,
    utilityParams,
    choices,
    rankings: rankingRows,
  };
}

export function buildCalculatorSessionExport({ profile, utilityParams, choicesRaw, rankingRows }) {
  const choices = choicesRaw.map((c, i) => normalizeChoice(c, i));
  return {
    schemaVersion: SCHEMA_VERSION,
    kind: 'calculator_session',
    exportedAt: new Date().toISOString(),
    profile,
    utilityParams,
    choices,
    rankings: rankingRows,
  };
}
