/**
 * Single source of truth for subjective utility math.
 * U_i(x) = dot(w_i, v(x)) − c_i · effort(x)
 */
import { valueDimensions } from './constants.js';

export function dot(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) {
    throw new Error('dot: vectors must be same-length arrays');
  }
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Number(a[i]) * Number(b[i]);
  return s;
}

/**
 * Per-dimension contribution to benefit term: w_i[d] * v[d]
 */
export function perDimensionContributions(w_i, v) {
  return w_i.map((w, i) => Number(w) * Number(v[i]));
}

export function computeUtility(w_i, c_i, v, effort) {
  const benefit = dot(w_i, v);
  const cost = Number(c_i) * Number(effort);
  const perDimensionContributionsList = perDimensionContributions(w_i, v);
  return {
    benefit,
    cost,
    net: benefit - cost,
    perDimensionContributions: perDimensionContributionsList,
  };
}

/**
 * Map PVQ-like willingness Likert 1..10 to c_i in [0,1].
 * High willingness => low cost sensitivity (matches existing calculator).
 */
export function likertWillingnessToCi(willingness1to10) {
  const v = Number(willingness1to10);
  if (!Number.isFinite(v)) throw new Error('likertWillingnessToCi: invalid value');
  return Number(((10 - v) / 9).toFixed(3));
}

/**
 * Normalize vector by max absolute value (for radar-style display).
 */
export function normalizeMaxAbs(values, epsilon = 1e-9) {
  const nums = values.map(x => Number(x));
  const m = Math.max(...nums.map(x => Math.abs(x)), epsilon);
  return nums.map(x => x / m);
}

/**
 * Rank dimensions by absolute contribution magnitude.
 * @returns {{ rank: number, dimensionId: string, contribution: number }[]}
 */
export function rankContributors(perDimensionContributions, topN = 3, dimIds = valueDimensions) {
  if (!Array.isArray(perDimensionContributions) || perDimensionContributions.length !== dimIds.length) {
    throw new Error('rankContributors: length mismatch with dimension list');
  }
  const scored = perDimensionContributions.map((c, i) => ({
    dimensionId: dimIds[i],
    contribution: Number(c),
    abs: Math.abs(Number(c)),
  }));
  scored.sort((a, b) => b.abs - a.abs);
  return scored.slice(0, topN).map((row, idx) => ({
    rank: idx + 1,
    dimensionId: row.dimensionId,
    contribution: row.contribution,
  }));
}
