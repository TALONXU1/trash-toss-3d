import React from 'react';
import { Trophy, Flame, Clock, Volume2, VolumeX, HelpCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { GameMode, GameStats } from '../types';

interface GameHUDProps {
  stats: GameStats;
  gameMode: GameMode;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  onRestart: () => void;
  onBack: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  gameMode,
  soundEnabled,
  onToggleSound,
  onOpenHelp,
  onRestart,
  onBack,
}) => {
  const modeLabel = gameMode === 'timed' ? '限时' : '无限';

  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-3">
      {/* 顶部主条 */}
      <div className="flex items-center justify-between pointer-events-auto">
        {/* 左侧：返回 + 模式标签 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onBack}
            className="p-2 sm:p-2 bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-xl border border-stone-200 transition-all shadow-md active:scale-95 touch-manipulation"
            title="返回菜单"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* 桌面端标题 */}
          <div className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-stone-200 shadow-lg">
            <span className="text-lg">🗑️</span>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-stone-800 tracking-tight leading-none">垃圾投篮3D</h1>
              <span className="text-[10px] text-indigo-500 font-medium">{modeLabel === '限时' ? '限时竞速' : '无限积分'}</span>
            </div>
          </div>

          {/* 移动端模式标签 */}
          <span className="sm:hidden text-[10px] font-bold bg-white/80 px-2 py-1 rounded-lg border border-stone-200 text-indigo-500">
            {modeLabel}
          </span>
        </div>

        {/* 右侧：统计 + 控制 */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          {/* 倒计时 */}
          {gameMode === 'timed' && (
            <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-mono font-bold shadow-md backdrop-blur-md border ${
              stats.timeLeft <= 10
                ? 'bg-red-100 text-red-600 border-red-400 animate-pulse'
                : 'bg-white/90 text-amber-600 border-stone-200'
            }`}>
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              <span className="text-xs sm:text-sm md:text-base">{Math.max(0, stats.timeLeft)}s</span>
            </div>
          )}

          {/* 分数 */}
          <div className="flex items-center gap-1 sm:gap-2 bg-white/90 backdrop-blur-md px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-stone-200 shadow-md">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            <span className="text-sm sm:text-base md:text-lg font-black text-stone-800 font-mono leading-none">{stats.score}</span>
          </div>

          {/* 连击 - 移动端隐藏 */}
          {stats.combo > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white px-3 py-1.5 rounded-xl shadow-lg font-black animate-bounce">
              <Flame className="w-4 h-4 fill-white" />
              <span className="text-sm md:text-base font-mono">{stats.combo}x</span>
            </div>
          )}

          {/* 控制按钮 */}
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              onClick={onToggleSound}
              className="p-1.5 sm:p-2 bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg sm:rounded-xl border border-stone-200 transition-all shadow-sm active:scale-95 touch-manipulation"
              title={soundEnabled ? '音效开启' : '音效关闭'}
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-stone-400" />}
            </button>
            <button
              onClick={onRestart}
              className="p-1.5 sm:p-2 bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg sm:rounded-xl border border-stone-200 transition-all shadow-sm active:scale-95 touch-manipulation"
              title="重新开始"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={onOpenHelp}
              className="p-1.5 sm:p-2 bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-lg sm:rounded-xl border border-stone-200 transition-all shadow-sm active:scale-95 touch-manipulation"
              title="垃圾分类指南"
            >
              <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
