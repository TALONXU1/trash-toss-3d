import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="h-dvh w-screen flex flex-col items-center justify-between bg-[#F5F0EB] overflow-hidden select-none safe-bottom">
      {/* 顶部装饰 */}
      <div className="w-full pt-6 sm:pt-8 flex justify-center">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-stone-200 shadow-sm">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
          <span className="text-[11px] sm:text-xs font-bold text-stone-500 tracking-wider">垃圾分类小游戏</span>
        </div>
      </div>

      {/* 海报区域 */}
      <div className="flex-1 flex items-center justify-center w-full px-4 sm:px-6">
        <div className="w-full max-w-[280px] sm:max-w-sm aspect-[3/4] rounded-2xl sm:rounded-3xl border-2 border-dashed border-stone-300 bg-white/50 flex flex-col items-center justify-center gap-3 sm:gap-4 shadow-inner">
          <span className="text-4xl sm:text-5xl">🗑️</span>
          <div className="text-center space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-stone-400">海报区域</h2>
            <p className="text-[10px] sm:text-xs text-stone-300">待上传替换</p>
          </div>
        </div>
      </div>

      {/* 底部箭头入口 */}
      <div className="w-full pb-8 sm:pb-12 safe-bottom flex flex-col items-center gap-2 sm:gap-3">
        <p className="text-[10px] sm:text-xs text-stone-400 font-medium tracking-wide">点击开始</p>
        <button
          onClick={onEnter}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 animate-bounce touch-manipulation"
        >
          <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        </button>
      </div>
    </div>
  );
};
