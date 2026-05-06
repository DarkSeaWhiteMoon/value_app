import { DIM_META } from './constants.js';

function zh(dimId) {
  return DIM_META[dimId]?.zh || dimId;
}
function en(dimId) {
  return DIM_META[dimId]?.en || dimId;
}

const FIT_ACTIVITY_POOL = {
  self_direction: [
    ['做一个个人小项目（写作/产品/代码）', '你会在“自己做主 + 创造”里获得持续的内在动力。'],
    ['每周固定留出一段独处思考时间', '独立整理想法会让你更清晰、更有掌控感。'],
  ],
  stimulation: [
    ['去一个没去过的街区/咖啡馆探索', '新鲜感会显著抬高你的主观效用。'],
    ['学习一项带挑战的技能（攀岩/舞蹈/乐器）', '你会被“有点难但很上头”的体验点燃。'],
  ],
  hedonism: [
    ['安排一次高质量的犒赏（美食/电影/泡澡）', '及时的感官愉悦能让你快速回血。'],
    ['做一顿“好吃但不凑合”的晚餐', '把生活过得舒服，会让你更愿意投入其他事。'],
  ],
  achievement: [
    ['设一个 7 天可完成的小目标并打卡', '完成感会显著增强你的自我肯定。'],
    ['把一个任务拆成清晰的里程碑', '你会更享受“我在变强/我做成了”的过程。'],
  ],
  power: [
    ['在一个小领域建立影响力（输出/带队/组织）', '可见的影响与资源感会让你更有劲。'],
    ['学一点谈判/表达，让边界更清晰', '你会更喜欢“我能决定/我能推动”的状态。'],
  ],
  security: [
    ['做一次生活系统整理（预算/日程/收纳）', '稳定和可预期会让你更安心。'],
    ['给未来 1-3 个月设定一个安全缓冲计划', '有兜底会让你更敢选择想要的方向。'],
  ],
  conformity: [
    ['建立一个“简单但可持续”的日常规则', '清晰的规范能降低内耗、提升效率。'],
    ['把重要事情写进清单并按流程执行', '按规则推进会让你更踏实。'],
  ],
  tradition: [
    ['把一个传统仪式感带回生活（家庭/节日/习惯）', '稳定的文化与秩序会给你归属感。'],
    ['跟长辈/家人聊一次家族故事', '连结与传承会让你更笃定。'],
  ],
  benevolence: [
    ['每周主动关心一位身边的人', '你会在“让重要的人更好”里得到满足。'],
    ['做一件具体的小帮助（跑腿/陪伴/倾听）', '看见对方被照顾到，会让你很有意义感。'],
  ],
  universalism: [
    ['参与一次公益/环保的具体行动', '对更大的群体与世界的关心会点亮你。'],
    ['学习并理解不同立场的人（书/访谈/纪录片）', '扩展视野会让你更平衡、更坚定。'],
  ],
};

const UNFIT_ACTIVITY_POOL = {
  self_direction: [
    ['被严格规定流程、几乎没有自主空间的工作/活动', '你的“自我导向”会觉得被闷住。'],
  ],
  stimulation: [
    ['长期重复、几乎没有变化的日常', '刺激不足会让你很快失去兴趣。'],
  ],
  hedonism: [
    ['完全剥夺娱乐与休息的高压模式', '你会更容易透支，反而难以持续。'],
  ],
  achievement: [
    ['没有反馈、也看不到成果的长期任务', '缺少成就回路会让你觉得不值。'],
  ],
  power: [
    ['完全没有话语权、一直被动配合的场景', '你的“影响感”很难被满足。'],
  ],
  security: [
    ['高风险且不确定性极强的决策/环境', '安全需求会被反复拉扯，消耗很大。'],
  ],
  conformity: [
    ['规则混乱、边界不清、全靠临场发挥的团队', '你会觉得“不按规矩来”很难受。'],
  ],
  tradition: [
    ['持续挑战你核心习俗/信仰的环境', '长期价值冲突会让你疲惫。'],
  ],
  benevolence: [
    ['长期需要冷酷竞争、把人当工具的氛围', '这会和你对“善意与照顾”的偏好冲突。'],
  ],
  universalism: [
    ['鼓励偏见与排斥、缺少公平感的场景', '你会很难认同，也很难投入。'],
  ],
};

function pick5(dimIds, poolMap) {
  const out = [];
  dimIds.forEach(id => {
    const list = poolMap[id] || [];
    list.forEach(([act, why]) => out.push({ act, why, dimId: id }));
  });
  // fallback fill with generic items if pool不足
  const GENERIC = [
    { act: '做一次小复盘：这周什么让我更有能量？', why: '把“有效的选择”沉淀下来，你会越来越省力。' },
    { act: '把一个重要选择写成 3 个备选方案', why: '把选择显性化，会让你的决策更稳。' },
  ];
  for (const g of GENERIC) {
    if (out.length >= 5) break;
    out.push({ ...g, dimId: 'generic' });
  }
  return out.slice(0, 5);
}

export function generatePortrait(pvqResult) {
  const top = pvqResult?.top || [];
  const bottom = pvqResult?.bottom || [];

  const topZh = top.map(zh).join(' / ');
  const topEn = top.map(en).join(' / ');
  const bottomZh = bottom.map(zh).join(' / ');
  const bottomEn = bottom.map(en).join(' / ');

  const summary = [
    `你的价值驱动力更偏向：${topZh}（${topEn}）。你做决定时通常会优先考虑这些维度能不能被满足。`,
    bottom.length
      ? `相对来说，你没那么看重：${bottomZh}（${bottomEn}）。这不代表你不在乎，而是它们更少成为你的第一优先级。`
      : '相对来说，你的价值分布比较均衡，通常能在多种动机之间找到折中点。',
  ].join('\n');

  const fitActivities = pick5(top, FIT_ACTIVITY_POOL);
  const unfitActivities = pick5(bottom, UNFIT_ACTIVITY_POOL);

  const typeLine = `一句话总结：你是一个“${top.map(zh).join(' + ')}驱动”的人。`;

  return { summary, fitActivities, unfitActivities, typeLine };
}

