export const STORAGE_KEYS = {
  pvqResult: 'vcs:pvq40:result:v1',
  settings: 'vcs:settings:v1',
};

export const valueDimensions = [
  'self_direction',
  'stimulation',
  'hedonism',
  'achievement',
  'power',
  'security',
  'conformity',
  'tradition',
  'benevolence',
  'universalism',
];

export const DIM_META = {
  self_direction: { zh: '自我导向', en: 'Self-Direction', shortEn: 'Self-Dir', descZh: '独立思考、创造、探索' },
  stimulation: { zh: '刺激', en: 'Stimulation', shortEn: 'Stimul', descZh: '新奇、挑战、兴奋' },
  hedonism: { zh: '享乐', en: 'Hedonism', shortEn: 'Hedon', descZh: '感官愉悦、即时满足' },
  achievement: { zh: '成就', en: 'Achievement', shortEn: 'Achiev', descZh: '个人成功、能力展示' },
  power: { zh: '权力', en: 'Power', shortEn: 'Power', descZh: '社会地位、对他人的控制' },
  security: { zh: '安全', en: 'Security', shortEn: 'Secur', descZh: '社会秩序、个人安全稳定' },
  conformity: { zh: '顺从', en: 'Conformity', shortEn: 'Conform', descZh: '克制冲动、遵守规范' },
  tradition: { zh: '传统', en: 'Tradition', shortEn: 'Trad', descZh: '尊重文化、宗教传统' },
  benevolence: { zh: '仁慈', en: 'Benevolence', shortEn: 'Benev', descZh: '关心身边人的福祉' },
  universalism: { zh: '普世主义', en: 'Universalism', shortEn: 'Univers', descZh: '理解、欣赏、保护所有人与自然' },
};

// PVQ-40 question bank grouped by dimension (ids match original PVQ order in existing pvq40.html)
export const PVQ_QUESTIONS = {
  self_direction: [
    { id: 1, text: '对她/他来说，想出新点子、发挥创造力很重要。她/他喜欢用自己独特的方式做事。' },
    { id: 11, text: '对她/他来说，自己做决定很重要。她/他喜欢自由，不喜欢依赖别人。' },
    { id: 22, text: '她/他认为自己追求自己的目标很重要，而不是按照别人的期望行事。' },
    { id: 34, text: '对她/他来说，能够独立思考、形成自己的观点很重要。' },
  ],
  stimulation: [
    { id: 6, text: '她/他喜欢冒险，总是在寻求刺激。她/他希望生活充满冒险。' },
    { id: 15, text: '她/他寻求各种各样的活动。对她/他来说，体验新奇和多样化的事情非常重要。' },
    { id: 30, text: '她/他喜欢惊喜。有一个充满意外的生活对她/他来说很重要。' },
  ],
  hedonism: [
    { id: 10, text: '享乐对她/他来说很重要。她/他喜欢犒劳自己。' },
    { id: 25, text: '她/他认为花钱享受生活很重要。她/他希望能够享受生活中的美好事物。' },
    { id: 26, text: '她/他认为尽情享受生活中的乐趣很重要。她/他喜欢纵容自己。' },
  ],
  achievement: [
    { id: 4, text: '对她/他来说，展示自己的能力很重要。她/他希望别人认可她/他的成就。' },
    { id: 13, text: '对她/他来说，在生活中取得成功很重要。她/他希望自己的能力得到社会的认可。' },
    { id: 24, text: '她/他认为雄心壮志很重要。她/他希望比别人做得更好。' },
    { id: 32, text: '对她/他来说，成为一个非常成功的人很重要。她/他希望别人尊重她/他的成就。' },
  ],
  power: [
    { id: 2, text: '对她/他来说，有钱有势很重要。她/他希望别人尊重自己所拥有的。' },
    { id: 17, text: '对她/他来说，被别人尊重很重要。她/他希望别人按照她/他说的去做。' },
    { id: 39, text: '她/他认为拥有权力、能够让别人做自己想要的事很重要。' },
  ],
  security: [
    { id: 5, text: '对她/他来说，生活在一个安全的环境中很重要。她/他努力避免任何可能威胁安全的事情。' },
    { id: 14, text: '对她/他来说，国家的强大很重要，这样她/他的政府才能保护公民免受各种威胁。' },
    { id: 21, text: '对她/他来说，事情井然有序很重要。她/他不喜欢混乱，总是喜欢保持整洁。' },
    { id: 31, text: '她/他努力保护自身安全。她/他认为避免任何可能令自己受伤的事情很重要。' },
    { id: 37, text: '对她/他来说，稳定的政府很重要，这样保持公共秩序并阻止混乱。' },
  ],
  conformity: [
    { id: 9, text: '对她/他来说，表现良好很重要。她/他总是力求避免做任何人们会说她/他做错的事。' },
    { id: 20, text: '对她/他来说，遵守规则很重要，即使没有人在看着。' },
    { id: 35, text: '在任何情况下都遵守法律法规对她/他来说很重要，即使没有人监督。' },
    { id: 38, text: '对她/他来说，在任何情况下都要表现得体面很重要。她/他总是努力遵守礼仪规范。' },
  ],
  tradition: [
    { id: 7, text: '她/他认为按照家庭传统行事很重要，即使不同意某些东西，她/他也尊重这些传统。' },
    { id: 16, text: '对她/他来说，按照宗教信仰或其所在文化的传统行事很重要。' },
    { id: 28, text: '她/他认为谦逊和简朴很重要，她/他尽量不引人注意。' },
    { id: 36, text: '她/他认为尊重传统很重要，她/他想保留代代相传的习俗。' },
  ],
  benevolence: [
    { id: 12, text: '对她/他来说，帮助身边的人很重要，关注他们的幸福对她/他而言至关重要。' },
    { id: 18, text: '对她/他来说，忠于朋友很重要。她/他致力于帮助身边关心的人。' },
    { id: 27, text: '对她/他来说，回应他人的需求很重要，她/他总是竭力帮助身边的人。' },
    { id: 33, text: '宽恕生活中伤害过她/他的人对她/他来说很重要，她/他努力以善待人。' },
  ],
  universalism: [
    { id: 3, text: '她/他认为所有人都应该被平等对待。她/他相信每个人都应该有平等的机会。' },
    { id: 8, text: '倾听与自己不同的人的意见对她/他来说很重要，即使她/他不同意这些人的观点。' },
    { id: 19, text: '她/他认为保护环境非常重要，关心自然和地球对她/他来说很重要。' },
    { id: 23, text: '她/他相信所有世界人民都应该和平共处，促进世界和平对她/他来说很重要。' },
    { id: 29, text: '她/他希望所有人都能被公正对待，即使是陌生人。她/他认为保护弱势群体很重要。' },
    { id: 40, text: '照顾好自然环境对她/他来说很重要，她/他认为我们应该保护环境。' },
  ],
};

