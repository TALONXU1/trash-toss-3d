import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Send } from 'lucide-react';
import { TrashItem } from '../types';

interface TossControlsProps {
  currentTrash: TrashItem;
  currentAngle: number;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onToss: () => void;
  isTossing: boolean;
}

export const TossControls: React.FC<TossControlsProps> = ({
  currentTrash,
  onRotateLeft,
  onRotateRight,
  onToss,
  isTossing,
}) => {
  // 10秒后显示提示
  const [showTip, setShowTip] = useState(false);
  const [tipTimer, setTipTimer] = useState<number | null>(null);

  useEffect(() => {
    setShowTip(false);
    if (tipTimer) clearTimeout(tipTimer);
    const timer = window.setTimeout(() => setShowTip(true), 10000);
    setTipTimer(timer);
    return () => { clearTimeout(timer); };
  }, [currentTrash.id]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTossing) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        onRotateLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        onRotateRight();
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onToss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTossing, onRotateLeft, onRotateRight, onToss]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end pb-4 sm:pb-6 md:pb-10 px-3 sm:px-4 z-10 select-none safe-bottom">
      <div className="max-w-md w-full mx-auto flex flex-col items-center gap-2 sm:gap-3 pointer-events-auto">
        {/* 当前持有垃圾卡片 */}
        <div className="w-fit mx-auto bg-white/85 backdrop-blur-xl px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-stone-200/60 shadow-md flex items-center gap-2 transition-all duration-300">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center text-lg sm:text-xl shadow-inner border border-amber-200 flex-shrink-0">
            {currentTrash.emoji}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-stone-800 tracking-tight leading-tight whitespace-nowrap">
              {currentTrash.name}
            </h3>
            {showTip && (
              <p className="text-[9px] sm:text-[10px] text-stone-500/50 leading-tight flex items-center gap-0.5 animate-fade-in max-w-[160px] sm:max-w-[200px] line-clamp-1">
                <span className="text-amber-400/50 flex-shrink-0">·</span>
                {currentTrash.tip}
              </p>
            )}
          </div>
        </div>

        {/* 转向 + 扔 */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* 左转 */}
          <button
            onClick={onRotateLeft}
            disabled={isTossing}
            className="pointer-events-auto group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 hover:bg-indigo-50 active:scale-90 text-stone-600 hover:text-indigo-600 border-2 border-stone-200 hover:border-indigo-400 shadow-lg backdrop-blur-md transition-all duration-150 disabled:opacity-40 touch-manipulation"
            title="向左转"
          >
            <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7 group-active:-translate-x-1 transition-transform" />
          </button>

          {/* 扔 */}
          <button
            onClick={onToss}
            disabled={isTossing}
            className={`px-8 sm:px-10 py-4 sm:py-5 md:py-6 rounded-3xl font-black text-lg sm:text-xl md:text-2xl tracking-wider shadow-2xl flex items-center justify-center gap-2 transition-all duration-150 active:scale-95 disabled:opacity-40 border-2 touch-manipulation ${
              isTossing
                ? 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 active:from-amber-500 active:to-rose-600 text-white border-amber-300 shadow-amber-500/20 active:shadow-amber-500/40 active:-translate-y-0.5'
            }`}
          >
            <span>{isTossing ? '飞行中...' : '扔'}</span>
            <Send className={`w-5 h-5 sm:w-6 sm:h-6 ${isTossing ? 'animate-spin' : 'animate-pulse'}`} />
          </button>

          {/* 右转 */}
          <button
            onClick={onRotateRight}
            disabled={isTossing}
            className="pointer-events-auto group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/90 hover:bg-indigo-50 active:scale-90 text-stone-600 hover:text-indigo-600 border-2 border-stone-200 hover:border-indigo-400 shadow-lg backdrop-blur-md transition-all duration-150 disabled:opacity-40 touch-manipulation"
            title="向右转"
          >
            <ArrowRight className="w-6 h-6 sm:w-7 sm:h-7 group-active:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 操作提示 - 手机隐藏键盘提示 */}
        <div className="text-[9px] sm:text-[10px] text-stone-400/60 font-medium flex items-center gap-1.5 sm:gap-2 bg-white/60 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full border border-stone-200/50 shadow-sm">
          <span>⬅️ 左转</span>
          <span className="text-stone-300/50">|</span>
          <span className="hidden sm:inline">空格 扔</span>
          <span className="sm:hidden">点按扔</span>
          <span className="text-stone-300/50">|</span>
          <span>右转 ➡️</span>
        </div>
      </div>
    </div>
  );
};
