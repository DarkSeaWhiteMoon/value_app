import { valueDimensions, DIM_META } from './constants.js';
import { normalizeMaxAbs } from './utility.js';

/**
 * Archetype object shape:
 * { id, zh, en, tagline, description, coreDimensions, colorPalette, symbolicTraits }
 */

const ARCHETYPES = [
  {
    id: 'pioneer',
    en: 'Pioneer',
    zh: '拓荒者',
    tagline: '用好奇心开路，用行动验证。',
    description: '你更容易被新鲜感与自主探索点燃。你会在“自己做主 + 走进未知”里获得持续的动能。',
    coreDimensions: ['self_direction', 'stimulation'],
    colorPalette: { accent: '#8fb8a0', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['探索', '主动试错', '边走边学', '开放性'],
  },
  {
    id: 'conqueror',
    en: 'Conqueror',
    zh: '征服者',
    tagline: '目标清晰，结果导向。',
    description: '你更看重成就与影响力。你会在“做成一件事并被看见”里获得强烈的确认感。',
    coreDimensions: ['achievement', 'power'],
    colorPalette: { accent: '#c8a96e', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['野心', '竞争', '资源感', '推动力'],
  },
  {
    id: 'guardian',
    en: 'Guardian',
    zh: '守护者',
    tagline: '稳住秩序，守住边界。',
    description: '你倾向于优先保证安全感与规则感。你更相信“可预期的系统”能带来自由。',
    coreDimensions: ['security', 'conformity'],
    colorPalette: { accent: '#7fc7c7', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['秩序', '稳定', '谨慎', '可预期'],
  },
  {
    id: 'idealist',
    en: 'Idealist',
    zh: '理想主义者',
    tagline: '意义优先，向更大的善靠近。',
    description: '你更容易被公平、包容与长期价值打动。你会在“让世界更好一点”的方向里更坚定。',
    coreDimensions: ['universalism', 'benevolence'],
    colorPalette: { accent: '#8aa4ff', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['价值感', '公正', '同理', '长期主义'],
  },
  {
    id: 'hedonist',
    en: 'Hedonist',
    zh: '享乐主义者',
    tagline: '把生活过得有质感。',
    description: '你更看重当下体验与情绪回报。你会在“舒服且有趣”的节奏里更高效、更持续。',
    coreDimensions: ['hedonism', 'stimulation'],
    colorPalette: { accent: '#d48a8a', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['感受力', '享受', '节奏感', '自我照顾'],
  },
  {
    id: 'architect',
    en: 'Architect',
    zh: '架构师',
    tagline: '先建模型，再做选择。',
    description: '你更倾向于用清晰结构把事情做对。你会在“自主规划 + 可衡量的推进”里感到踏实。',
    coreDimensions: ['self_direction', 'achievement'],
    colorPalette: { accent: '#b38ad4', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['系统化', '策略', '拆解', '复盘'],
  },
  {
    id: 'rebel',
    en: 'Rebel',
    zh: '反叛者',
    tagline: '不被规训，也不盲从。',
    description: '你强烈偏好自主与表达，并且对高顺从/强规则场景更敏感。你会更愿意走自己的路。',
    coreDimensions: ['self_direction', 'conformity'],
    colorPalette: { accent: '#c06060', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['独立', '反常规', '边界感', '表达'],
  },
  {
    id: 'dreamer',
    en: 'Dreamer',
    zh: '梦想家',
    tagline: '愿景清晰，内心辽阔。',
    description: '你更容易在理想与想象中找到方向。你会被“更好的可能性”吸引，并愿意自己去定义答案。',
    coreDimensions: ['universalism', 'self_direction'],
    colorPalette: { accent: '#8aa4ff', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['愿景', '想象力', '世界观', '自我定义'],
  },
  {
    id: 'caregiver',
    en: 'Caregiver',
    zh: '照料者',
    tagline: '先照顾人，再谈成败。',
    description: '你更看重身边人的福祉与关系质量。你会在“陪伴、支持、修复关系”里获得意义。',
    coreDimensions: ['benevolence', 'security'],
    colorPalette: { accent: '#8fb8a0', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['善意', '支持', '关系', '可靠'],
  },
  {
    id: 'survivor',
    en: 'Survivor',
    zh: '生存者',
    tagline: '先保证不崩，再谈理想。',
    description: '你当前更强烈需要安全与确定性。当环境不稳时，你会本能地优先寻找兜底与秩序。',
    coreDimensions: ['security'],
    colorPalette: { accent: '#7fc7c7', ink: '#e9edf3', muted: '#a7b0bf' },
    symbolicTraits: ['兜底', '防御性规划', '风险控制', '稳态优先'],
  },
];

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function zToHigh01(z) {
  // z in [-1,1] -> high preference in [0,1]
  return clamp01((z + 1) / 2);
}

function zToLow01(z) {
  return clamp01((1 - z) / 2);
}

function geoMean2(a, b) {
  // emphasize "both must be high"
  return Math.sqrt(Math.max(0, a) * Math.max(0, b));
}

function weightedSum(pairs, weights) {
  let s = 0;
  let wSum = 0;
  for (const [k, v] of pairs) {
    const w = weights[k] ?? 1;
    s += v * w;
    wSum += w;
  }
  return wSum > 0 ? s / wSum : 0;
}

/**
 * inferArchetype(valueProfile)
 * Input: ValueProfile v1
 * Output:
 * { primary, secondary?, scores }
 */
export function inferArchetype(valueProfile) {
  const w = valueProfile?.w_i;
  if (!Array.isArray(w) || w.length !== 10) {
    throw new Error('inferArchetype: valueProfile.w_i must be length 10');
  }

  const dimIds = valueProfile.valueDimensions && valueProfile.valueDimensions.length === 10
    ? valueProfile.valueDimensions
    : valueDimensions;

  // Normalize w_i by max-abs so heuristics are scale-stable.
  const z = normalizeMaxAbs(w); // [-1..1]
  const byId = {};
  dimIds.forEach((id, i) => {
    byId[id] = {
      z: z[i],
      high: zToHigh01(z[i]),
      low: zToLow01(z[i]),
    };
  });

  // Heuristic scoring (deterministic, no randomness).
  // Each score is normalized to [0,1] approximately.
  const scores = {};

  // Examples given in prompt + additional archetypes:
  scores.pioneer = geoMean2(byId.self_direction.high, byId.stimulation.high);
  scores.conqueror = geoMean2(byId.achievement.high, byId.power.high);
  scores.guardian = geoMean2(byId.security.high, byId.conformity.high);
  scores.architect = geoMean2(byId.self_direction.high, byId.achievement.high);
  scores.rebel = geoMean2(byId.self_direction.high, byId.conformity.low);
  scores.dreamer = geoMean2(byId.universalism.high, byId.self_direction.high);

  // Idealist: universalism + benevolence, with a small penalty if power is very high
  scores.idealist = clamp01(
    geoMean2(byId.universalism.high, byId.benevolence.high) * (1 - 0.25 * byId.power.high)
  );

  // Hedonist: hedonism + stimulation, with small support from self-direction (doing it your way)
  scores.hedonist = clamp01(
    weightedSum(
      [
        ['hedonism', geoMean2(byId.hedonism.high, byId.stimulation.high)],
        ['self_direction', byId.self_direction.high],
      ],
      { hedonism: 0.75, self_direction: 0.25 }
    )
  );

  // Caregiver: benevolence + security, with a little conformity (pro-social norms)
  scores.caregiver = clamp01(
    weightedSum(
      [
        ['benevolence', geoMean2(byId.benevolence.high, byId.security.high)],
        ['conformity', byId.conformity.high],
      ],
      { benevolence: 0.8, conformity: 0.2 }
    )
  );

  // Survivor: extremely high security dominates; accentuate extremes with power curve
  scores.survivor = clamp01(Math.pow(byId.security.high, 2.2));

  // Sort primary/secondary
  const ordered = Object.entries(scores)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const primaryId = ordered[0]?.id;
  const secondaryId = ordered[1]?.id;
  const primaryScore = ordered[0]?.score ?? 0;
  const secondaryScore = ordered[1]?.score ?? 0;

  const archetypeById = Object.fromEntries(ARCHETYPES.map(a => [a.id, a]));

  const primary = archetypeById[primaryId];
  if (!primary) throw new Error('inferArchetype: internal archetype mapping missing');

  // Secondary only if meaningfully close
  const secondary = (secondaryId && secondaryScore >= primaryScore * 0.92)
    ? archetypeById[secondaryId]
    : undefined;

  return {
    primary,
    secondary,
    scores,
    // helpful, non-breaking metadata for UI:
    debug: {
      normalized: dimIds.reduce((acc, id) => {
        acc[id] = { z: Number(byId[id].z.toFixed(3)), high: Number(byId[id].high.toFixed(3)), low: Number(byId[id].low.toFixed(3)) };
        return acc;
      }, {}),
    },
  };
}

export function listArchetypes() {
  return ARCHETYPES.map(a => ({
    ...a,
    coreDimensions: a.coreDimensions.map(id => ({
      id,
      zh: DIM_META[id]?.zh,
      en: DIM_META[id]?.en,
    })),
  }));
}

