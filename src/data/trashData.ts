import { BinInfo, TrashItem } from '../types';

export const BINS: BinInfo[] = [
  {
    id: 'organic',
    name: 'Kitchen / Organic',
    cnName: '厨余垃圾',
    color: 'bg-emerald-600 border-emerald-400 text-emerald-100',
    hexColor: 0x10b981,
    direction: 'north',
    angle: 0,
    icon: '🍏',
    desc: '剩菜剩饭、果皮、绿植、茶叶渣等容易腐烂的生物质废弃物'
  },
  {
    id: 'recyclable',
    name: 'Recyclable',
    cnName: '可回收物',
    color: 'bg-blue-600 border-blue-400 text-blue-100',
    hexColor: 0x3b82f6,
    direction: 'east',
    angle: Math.PI / 2,
    icon: '📦',
    desc: '适宜回收利用和资源化的废弃物，如纸张、塑料、玻璃、金属等'
  },
  {
    id: 'residual',
    name: 'Other / Residual',
    cnName: '其他垃圾',
    color: 'bg-slate-600 border-slate-400 text-slate-100',
    hexColor: 0x64748b,
    direction: 'south',
    angle: Math.PI,
    icon: '🗑️',
    desc: '除可回收物、有害垃圾、厨余垃圾外的绝大多数生活废弃物'
  },
  {
    id: 'hazardous',
    name: 'Hazardous',
    cnName: '有害垃圾',
    color: 'bg-rose-600 border-rose-400 text-rose-100',
    hexColor: 0xf43f5e,
    direction: 'west',
    angle: (3 * Math.PI) / 2,
    icon: '☣️',
    desc: '对人体健康或自然环境造成直接或潜在危害的废弃物'
  }
];

export const TRASH_POOL: TrashItem[] = [
  // ============ 厨余垃圾 (Organic) — 15种 ============
  { id: 't1',  name: '香蕉皮', emoji: '🍌', category: 'organic', tip: '果皮易腐烂，属于厨余垃圾', modelType: 'banana', color: 0xfacc15 },
  { id: 't2',  name: '吃剩的苹果', emoji: '🍎', image: '/assets/trash/apple_peel.png', category: 'organic', tip: '水果核和果肉都属于易腐易降解垃圾', modelType: 'apple', color: 0xef4444 },
  { id: 't3',  name: '枯树叶', emoji: '🍂', category: 'organic', tip: '庭院绿植和枯枝落叶属于厨余生物质', modelType: 'leaf', color: 0xd97706 },
  { id: 't4',  name: '过期面包', emoji: '🍞', category: 'organic', tip: '过期食品和糕点类都放入厨余桶', modelType: 'box', color: 0xf59e0b },
  { id: 't5',  name: '西瓜皮', emoji: '🍉', category: 'organic', tip: '水分充足的瓜果皮屑', modelType: 'apple', color: 0x22c55e },
  { id: 't6',  name: '剩菜剩饭', emoji: '🍚', category: 'organic', tip: '米饭面条等容易腐烂的食物残渣', modelType: 'box', color: 0xeab308 },
  { id: 't7',  name: '橘子皮', emoji: '🍊', category: 'organic', tip: '柑橘类果皮自然降解快', modelType: 'leaf', color: 0xf97316 },
  { id: 't8',  name: '蛋壳', emoji: '🥚', image: '/assets/trash/egg_shell.png', category: 'organic', tip: '蛋壳是优质的钙质厨余', modelType: 'can', color: 0xfde68a },
  { id: 't9',  name: '茶叶渣', emoji: '🍵', image: '/assets/trash/tea_leaves.png', category: 'organic', tip: '茶叶渣富含生物碱，可降解', modelType: 'paper', color: 0x84cc16 },
  { id: 't10', name: '鱼骨', emoji: '🐟', image: '/assets/trash/fish_bone.png', category: 'organic', tip: '细小的鱼骨容易腐烂，厨余处理', modelType: 'bone', color: 0x94a3b8 },
  { id: 't11', name: '烂菜叶', emoji: '🥬', image: '/assets/trash/leafy_greens.png', category: 'organic', tip: '蔬菜残余是厨余垃圾主力', modelType: 'leaf', color: 0x4ade80 },
  { id: 't12', name: '咖啡渣', emoji: '☕', category: 'organic', tip: '咖啡渣可堆肥，放入厨余', modelType: 'paper', color: 0x78350f },
  { id: 't13', name: '葡萄皮', emoji: '🍇', category: 'organic', tip: '水果皮核统一进厨余', modelType: 'apple', color: 0xa855f7 },
  { id: 't14', name: '桃核', emoji: '🍑', category: 'organic', tip: '果核虽硬但可降解，属厨余', modelType: 'apple', color: 0xf472b6 },
  { id: 't15', name: '中药渣', emoji: '🌿', category: 'organic', tip: '中药渣属于生物质废弃物', modelType: 'paper', color: 0x15803d },

  // ============ 可回收物 (Recyclable) — 15种 ============
  { id: 't16', name: '易拉罐', emoji: '🥤', category: 'recyclable', tip: '铝制易拉罐可熔炼循环再生', modelType: 'can', color: 0x38bdf8 },
  { id: 't17', name: '快递纸箱', emoji: '📦', category: 'recyclable', tip: '干净的纸板箱是非常优质的回收原料', modelType: 'box', color: 0xb45309 },
  { id: 't18', name: '塑料瓶', emoji: '🍾', category: 'recyclable', tip: '清空液体并压扁后回收更佳', modelType: 'bottle', color: 0x60a5fa },
  { id: 't19', name: '旧报纸', emoji: '📰', category: 'recyclable', tip: '废纸类可回收制成再生纸', modelType: 'paper', color: 0xe2e8f0 },
  { id: 't20', name: '玻璃杯', emoji: '🥛', category: 'recyclable', tip: '玻璃回收可节约大量石英砂资源', modelType: 'cup', color: 0x93c5fd },
  { id: 't21', name: '旧衣服', emoji: '👕', category: 'recyclable', tip: '纺织品回收可制成再生纤维', modelType: 'cloth', color: 0x3b82f6 },
  { id: 't22', name: '铁罐', emoji: '🥫', category: 'recyclable', tip: '金属罐头盒可回收冶炼', modelType: 'can', color: 0x475569 },
  { id: 't23', name: '洗发水空瓶', emoji: '🧴', category: 'recyclable', tip: 'HDPE塑料可回收再造', modelType: 'bottle', color: 0xec4899 },
  { id: 't24', name: '旧杂志', emoji: '📚', category: 'recyclable', tip: '铜版纸杂志回收可制纸浆', modelType: 'paper', color: 0xf43f5e },
  { id: 't25', name: '牛奶盒', emoji: '🥛', category: 'recyclable', tip: '利乐包装复合回收处理', modelType: 'box', color: 0x64748b },
  { id: 't26', name: '镜子碎片', emoji: '🪞', category: 'recyclable', tip: '玻璃镜片可回收', modelType: 'mirror', color: 0x94a3b8 },
  { id: 't27', name: '旧玩具', emoji: '🧸', category: 'recyclable', tip: '塑料玩具可回收再加工', modelType: 'toy', color: 0xf59e0b },
  { id: 't28', name: '泡沫塑料', emoji: '🧽', category: 'recyclable', tip: 'EPS泡沫回收可压缩再生', modelType: 'box', color: 0xfce7f3 },
  { id: 't29', name: '铝箔', emoji: '🧾', category: 'recyclable', tip: '铝箔纸可回收重熔', modelType: 'paper', color: 0xc0c0c0 },
  { id: 't30', name: '旧书本', emoji: '📖', category: 'recyclable', tip: '书籍纸张回收再造纸', modelType: 'paper', color: 0x6366f1 },

  // ============ 其他垃圾 (Residual) — 15种 ============
  { id: 't31', name: '用过的餐巾纸', emoji: '🧻', category: 'residual', tip: '纸巾遇水即溶且受污染，无法循环再生', modelType: 'paper', color: 0xf8fafc },
  { id: 't32', name: '破损陶瓷碗', emoji: '🥣', category: 'residual', tip: '陶瓷难以熔炼再生，属于其他垃圾', modelType: 'cup', color: 0xcbd5e1 },
  { id: 't33', name: '外卖脏餐盒', emoji: '🥡', category: 'residual', tip: '沾满油污且难以清洗的塑料盒属于其他垃圾', modelType: 'box', color: 0xfca5a5 },
  { id: 't34', name: '灰尘与扫地屑', emoji: '🧹', category: 'residual', tip: '日常扫地灰尘属于无害复合废弃物', modelType: 'paper', color: 0x94a3b8 },
  { id: 't35', name: '贝壳核桃壳', emoji: '🦪', category: 'residual', tip: '坚硬的外壳不易受微生物腐烂降解', modelType: 'shell', color: 0xa8a29e },
  { id: 't36', name: '大骨头', emoji: '🍖', category: 'residual', tip: '大骨头过于坚硬，难以在厨余中分解', modelType: 'bone', color: 0xd6d3d1 },
  { id: 't37', name: '烟蒂', emoji: '🚬', category: 'residual', tip: '烟蒂含滤嘴纤维，属于其他垃圾', modelType: 'paper', color: 0xf59e0b },
  { id: 't38', name: '纸尿裤', emoji: '👶', category: 'residual', tip: '纸尿裤复合材料不可回收', modelType: 'diaper', color: 0xfce7f3 },
  { id: 't39', name: '口香糖', emoji: '🍬', category: 'residual', tip: '口香糖粘性强，无法回收处理', modelType: 'paper', color: 0x22c55e },
  { id: 't40', name: '粘胶带', emoji: '📎', category: 'residual', tip: '胶带粘性强，属于复合材料废弃物', modelType: 'tape', color: 0xfacc15 },
  { id: 't41', name: '碎瓷片', emoji: '🏺', category: 'residual', tip: '陶瓷碎片不可回收，不可降解', modelType: 'cup', color: 0xfef3c7 },
  { id: 't42', name: '一次性筷子', emoji: '🥢', category: 'residual', tip: '竹木筷子受污染后不可回收', modelType: 'box', color: 0xd4a373 },
  { id: 't43', name: '脏湿巾', emoji: '🧼', category: 'residual', tip: '湿巾含塑料纤维，不可降解', modelType: 'paper', color: 0xe0f2fe },
  { id: 't44', name: '椰子壳', emoji: '🥥', category: 'residual', tip: '椰子壳过于坚硬，难以分解', modelType: 'shell', color: 0x5c4033 },
  { id: 't45', name: '墨粉盒', emoji: '🖨️', category: 'residual', tip: '普通墨盒不可回收，属其他垃圾', modelType: 'box', color: 0x1e293b },

  // ============ 有害垃圾 (Hazardous) — 15种 ============
  { id: 't46', name: '废旧干电池', emoji: '🔋', category: 'hazardous', tip: '重金属会对土壤和水源造成深远污染', modelType: 'battery', color: 0xeab308 },
  { id: 't47', name: '废灯管灯泡', emoji: '💡', category: 'hazardous', tip: '节能灯和荧光灯管含有微量汞蒸汽', modelType: 'bulb', color: 0xfef08a },
  { id: 't48', name: '过期药品', emoji: '💊', category: 'hazardous', tip: '过期药物需连同包装放入有害垃圾桶', modelType: 'pill', color: 0xf43f5e },
  { id: 't49', name: '杀虫剂喷雾罐', emoji: '🪰', category: 'hazardous', tip: '化学药剂残留会对环境生态造成毒害', modelType: 'can', color: 0xe11d48 },
  { id: 't50', name: '指甲油瓶', emoji: '💅', category: 'hazardous', tip: '化学溶剂具有挥发毒性', modelType: 'bottle', color: 0xdb2777 },
  { id: 't51', name: '水银温度计', emoji: '🌡️', image: '/assets/trash/thermometer.png', category: 'hazardous', tip: '水银含汞，对人体有剧毒', modelType: 'thermo', color: 0xc0c0c0 },
  { id: 't52', name: '过期化妆品', emoji: '💄', image: '/assets/trash/cosmetics.png', category: 'hazardous', tip: '化妆品含化学添加剂，过期有害', modelType: 'bottle', color: 0xf472b6 },
  { id: 't53', name: '相片胶卷', emoji: '🎞️', image: '/assets/trash/film.png', category: 'hazardous', tip: '胶卷含银盐等重金属，属有害', modelType: 'film', color: 0x1e293b },
  { id: 't54', name: '油漆桶', emoji: '🎨', image: '/assets/trash/paint_bucket.png', category: 'hazardous', tip: '油漆含苯类溶剂，有害健康', modelType: 'can', color: 0x4ade80 },
  { id: 't55', name: '消毒剂', emoji: '🧪', image: '/assets/trash/disinfectant.png', category: 'hazardous', tip: '消毒液含次氯酸钠，有害成分', modelType: 'bottle', color: 0x38bdf8 },
  { id: 't56', name: '染发剂', emoji: '💇', image: '/assets/trash/hair_dye.png', category: 'hazardous', tip: '染发剂含苯胺类物质，有害', modelType: 'box', color: 0x7c3aed },
  { id: 't57', name: '防虫丸', emoji: '🌲', image: '/assets/trash/mothballs.png', category: 'hazardous', tip: '樟脑丸含萘/对二氯苯，有害', modelType: 'box', color: 0x94a3b8 },
  { id: 't58', name: '充电电池', emoji: '🔌', image: '/assets/trash/battery_pack.png', category: 'hazardous', tip: '锂电池含电解液，属有害', modelType: 'battery', color: 0x06b6d4 },
  { id: 't59', name: '光碟', emoji: '💿', image: '/assets/trash/cd.png', category: 'hazardous', tip: '光盘含重金属层，属有害', modelType: 'film', color: 0xa855f7 },
  { id: 't60', name: 'LED灯管', emoji: '💡', image: '/assets/trash/led_tube.png', category: 'hazardous', tip: 'LED灯管含电子元件，回收处理', modelType: 'bulb', color: 0x22c55e },
];

export function getRandomTrash(excludeId?: string): TrashItem {
  let pool = TRASH_POOL;
  if (excludeId) {
    pool = TRASH_POOL.filter(t => t.id !== excludeId);
  }
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}
