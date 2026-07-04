import React from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { BINS } from '../data/trashData';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[90vh]">
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📘</span>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-stone-800 tracking-tight">3D视角垃圾分类指南</h2>
              <span className="text-xs text-indigo-500 font-medium">RECYCLING 101 GUIDE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 弹窗内容区 (滚动) */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-600 text-sm">
          {/* 玩法介绍说明 */}
          <div className="bg-gradient-to-r from-indigo-50 to-sky-50 p-4 rounded-2xl border border-indigo-200 space-y-2">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-indigo-500" /> 沉浸式第一人称视角玩法
            </h3>
            <p className="leading-relaxed text-xs md:text-sm text-stone-600">
              你正站在一个3D垃圾分类站的<strong className="text-indigo-600">正中心</strong>，手中持有随机掉落的废弃物。
              场地四周分布着4个不同颜色的国家标准垃圾桶：
            </p>
            <ul className="grid grid-cols-2 gap-2 pt-1 text-xs font-medium">
              <li className="text-emerald-600">• 正前方 (0°)：厨余垃圾</li>
              <li className="text-blue-600">• 右侧 (90°)：可回收物</li>
              <li className="text-stone-500">• 正后方 (180°)：其他垃圾</li>
              <li className="text-rose-600">• 左侧 (270°)：有害垃圾</li>
            </ul>
          </div>

          {/* 四大分类卡片详情 */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-800 text-base">国家标准四大分类细则</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BINS.map((bin) => {
                const badgeColors: Record<string, string> = {
                  organic: 'bg-emerald-50 border-emerald-300 text-emerald-700',
                  recyclable: 'bg-blue-50 border-blue-300 text-blue-700',
                  residual: 'bg-stone-100 border-stone-300 text-stone-700',
                  hazardous: 'bg-rose-50 border-rose-300 text-rose-700',
                };

                return (
                  <div
                    key={bin.id}
                    className={`p-4 rounded-2xl border flex flex-col gap-2 transition-all ${badgeColors[bin.id]}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{bin.icon}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/60 border border-current/20">
                        {bin.name}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-800 text-base">{bin.cnName}</h4>
                    <p className="text-xs opacity-80 leading-relaxed">{bin.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 计分规则与连击机制 */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-base">
              <CheckCircle2 className="w-4 h-4 text-amber-500" /> 计分与连击机制 (Combo)
            </h3>
            <p className="text-xs leading-relaxed text-stone-500">
              • <strong className="text-emerald-600">正确分类</strong>：基础 +100 分。连续投对会触发 <strong className="text-amber-500">Combo 连击加成</strong>，每上一层 Combo 额外奖励 20 分！<br />
              • <strong className="text-rose-500">错误分类</strong>：扣除 50 分，并且连击计数立刻重置为 1。<br />
              • <strong className="text-indigo-500">计时竞速模式</strong>：初始 60 秒倒计时。每次投对额外增加 +2 秒，投错扣除 -4 秒！
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 text-sm"
          >
            我明白了，开始游戏！
          </button>
        </div>
      </div>
    </div>
  );
};
