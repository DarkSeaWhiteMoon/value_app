import { valueDimensions, DIM_META, PVQ_QUESTIONS } from './constants.js';

export function buildPvqQuestionList() {
  const out = [];
  valueDimensions.forEach((dimId, dimIdx) => {
    const meta = DIM_META[dimId];
    out.push({
      type: 'dimension',
      dimId,
      dimIdx,
      zh: meta.zh,
      en: meta.en,
      descZh: meta.descZh,
    });
    PVQ_QUESTIONS[dimId].forEach(q => {
      out.push({
        type: 'question',
        dimId,
        id: q.id,
        text: q.text,
      });
    });
  });
  return out;
}

export function computePvqResult(answersById) {
  // answersById: { [questionId:number]: 1..6 }
  const answers = {};
  Object.keys(answersById || {}).forEach(k => {
    const n = Number(k);
    const v = Number(answersById[k]);
    if (Number.isFinite(n) && Number.isFinite(v)) answers[n] = v;
  });

  const allVals = Object.values(answers);
  if (allVals.length < 40) {
    throw new Error(`PVQ-40 未完成：需要 40 题，当前 ${allVals.length} 题`);
  }
  const grandMean = allVals.reduce((a, b) => a + b, 0) / allVals.length;

  const dimensions = valueDimensions.map(dimId => {
    const qs = PVQ_QUESTIONS[dimId];
    const vals = qs.map(q => answers[q.id]).filter(v => typeof v === 'number');
    const rawMean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const centered = Number((rawMean - grandMean).toFixed(3));
    return {
      id: dimId,
      zh: DIM_META[dimId].zh,
      en: DIM_META[dimId].en,
      shortEn: DIM_META[dimId].shortEn,
      rawMean: Number(rawMean.toFixed(3)),
      centered,
    };
  });

  const sorted = [...dimensions].sort((a, b) => b.centered - a.centered);
  const top = sorted.slice(0, 3).map(d => d.id);
  const bottom = sorted.slice(-2).map(d => d.id);

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    answers,
    grandMean: Number(grandMean.toFixed(3)),
    dimensions,
    w_i: dimensions.map(d => d.centered),
    top,
    bottom,
  };
}

