export type BinCategory = 'organic' | 'recyclable' | 'residual' | 'hazardous';

export interface BinInfo {
  id: BinCategory;
  name: string;
  cnName: string;
  color: string;
  hexColor: number;
  direction: 'north' | 'east' | 'south' | 'west';
  angle: number;
  icon: string;
  desc: string;
}

export interface TrashItem {
  id: string;
  name: string;
  emoji: string;
  image?: string;  // 可选的图鉴图片路径
  category: BinCategory;
  tip: string;
  modelType: 'banana' | 'can' | 'paper' | 'battery' | 'box' | 'bottle' | 'apple' | 'bulb' | 'cup' | 'leaf' | 'bone' | 'pill' | 'toy' | 'shell' | 'diaper' | 'thermo' | 'film' | 'mirror' | 'cloth' | 'tape';
  color: number;
}

export type GameMode = 'timed' | 'endless' | 'chill';

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  wrongCount: number;
  timeLeft: number;
}

export interface TossFeedback {
  id: number;
  text: string;
  type: 'perfect' | 'wrong';
  scoreDelta: number;
}
