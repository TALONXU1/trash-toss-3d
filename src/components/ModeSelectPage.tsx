import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { GameMode } from '../types';

interface ModeSelectPageProps {
  onSelectMode: (mode: GameMode | 'encyclopedia') => void;
  onBack: () => void;
}

export const ModeSelectPage: React.FC<ModeSelectPageProps> = ({ onSelectMode, onBack }) => {
  const modes = [
    {
      key: 'timed' as const,
      label: '限时竞速',
      desc: '60秒倒计时，争取最高分',
      badge: '⏱️',
      color: 'from-rose-400 to-pink-500',
    },
    {
      key: 'endless' as const,
      label: '无限积分',
      desc: '无时间限制，享受连击快感',
      badge: '🔥',
      isDefault: true,
      color: 'from-amber-400 to-orange-500',
    },
    {
      key: 'encyclopedia' as const,
      label: '知识图鉴',
      desc: '学习垃圾分类知识',
      badge: '📚',
      color: 'from-emerald-400 to-teal-500',
    },
  ];

  return (
    <div className="h-dvh w-screen bg-[#F5F0EB] flex flex-col select-none safe-bottom">
      {/* 顶部导航 */}
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-2 flex items-center">
        <button
          onClick={onBack}
          className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-stone-200 shadow-sm text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-all active:scale-95 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 text-center mr-8 sm:mr-10">
          <h2 className="text-base sm:text-lg font-bold text-stone-800">选择模式</h2>
        </div>
      </div>

      {/* 选项卡片 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 sm:gap-4 px-4 sm:px-6 pb-6 sm:pb-8 safe-bottom">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => onSelectMode(mode.key)}
            className="w-full max-w-sm bg-white rounded-2xl border-2 border-stone-200 hover:border-indigo-400 hover:shadow-lg active:scale-[0.98] p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all duration-200 text-left group touch-manipulation"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${mode.color} flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-lg`}>
              {mode.badge}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-stone-800">{mode.label}</h3>
                {mode.isDefault && (
                  <span className="text-[9px] sm:text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-bold">推荐</span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400 leading-relaxed mt-0.5 sm:mt-1">{mode.desc}</p>
            </div>
            <div className="text-stone-300 group-hover:text-indigo-400 transition-colors text-base sm:text-lg ml-0.5 sm:ml-1">›</div>
          </button>
        ))}
      </div>
    </div>
  );
};
