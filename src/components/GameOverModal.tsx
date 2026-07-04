import React from 'react';
import { Trophy, Flame, CheckCircle2, XCircle, RotateCcw, Home } from 'lucide-react';
import { GameStats, GameMode } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  gameMode: GameMode;
  onRestart: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  gameMode,
  onRestart,
  onBackToMenu,
}) => {
  if (!isOpen) return null;

  const totalTossed = stats.correctCount + stats.wrongCount;
  const accuracy = totalTossed > 0 ? Math.round((stats.correctCount / totalTossed) * 100) : 0;

  let rankTitle = '初级分类学徒';
  let rankBadge = '🌱';
  let rankColor = 'text-emerald-600';

  if (stats.score > 3000) {
    rankTitle = '环保分类宗师';
    rankBadge = '👑';
    rankColor = 'text-amber-600';
  } else if (stats.score > 1800) {
    rankTitle = '垃圾处理专家';
    rankBadge = '🌟';
    rankColor = 'text-indigo-600';
  } else if (stats.score > 800) {
    rankTitle = '社区分类标兵';
    rankBadge = '🎖️';
    rankColor = 'text-sky-600';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-lg animate-fade-in select-none">
      <div className="relative w-full max-w-sm sm:max-w-md bg-white border-2 border-stone-200 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center gap-4 sm:gap-6 overflow-hidden">
        {/* 光晕装饰 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-200/40 blur-3xl rounded-full pointer-events-none" />

        {/* 头部标题图标 */}
        <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl sm:text-4xl shadow-lg shadow-amber-500/20 animate-bounce">
            🏆
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-800 tracking-tight mt-0.5 sm:mt-1">
            {gameMode === 'timed' ? '时间到！挑战结束' : '结算游戏'}
          </h2>
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] sm:text-xs text-stone-500">
            <span>评价称号:</span>
            <span className="text-sm sm:text-base">{rankBadge}</span>
            <span className={`font-bold ${rankColor}`}>{rankTitle}</span>
          </div>
        </div>

        {/* 核心分数牌 */}
        <div className="w-full bg-stone-50 rounded-2xl p-3 sm:p-5 border border-stone-200 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <span className="text-[10px] sm:text-xs text-stone-400 font-medium uppercase tracking-wider">FINAL SCORE</span>
          <span className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-800 font-mono mt-0.5 sm:mt-1 tracking-tight">
            {stats.score}
          </span>
        </div>

        {/* 统计数据网格 */}
        <div className="w-full grid grid-cols-3 gap-2 md:gap-3 text-center">
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center">
            <Flame className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">MAX COMBO</span>
            <span className="text-lg font-black text-stone-800 font-mono">{stats.maxCombo}x</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">准确率</span>
            <span className="text-lg font-black text-emerald-600 font-mono">{accuracy}%</span>
          </div>

          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 flex flex-col items-center">
            <XCircle className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-[10px] text-stone-400 font-medium">正确 / 错误</span>
            <span className="text-sm font-bold text-stone-600 font-mono mt-0.5">
              <span className="text-emerald-600">{stats.correctCount}</span> : <span className="text-rose-500">{stats.wrongCount}</span>
            </span>
          </div>
        </div>

        {/* 重新挑战按钮 */}
        <div className="w-full flex flex-col gap-2.5 mt-2 z-10">
          <button
            onClick={onRestart}
            className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            <span>再来一局！</span>
          </button>
          <button
            onClick={onBackToMenu}
            className="w-full py-3 px-6 bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>返回菜单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
