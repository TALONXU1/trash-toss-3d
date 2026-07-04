import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TossFeedback } from '../types';

interface FeedbackOverlayProps {
  feedbacks: TossFeedback[];
  combo: number;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({ feedbacks, combo }) => {
  // 连击礼花特效触发
  useEffect(() => {
    if (combo > 0 && combo % 5 === 0) {
      confetti({
        particleCount: 60 + combo * 5,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    }
  }, [combo]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-center overflow-hidden">
      {feedbacks.map((fb) => {
        const isPerfect = fb.type === 'perfect';
        return (
          <div
            key={fb.id}
            className={`absolute pointer-events-none flex flex-col items-center justify-center animate-bounce transition-all duration-700 transform -translate-y-12 ${
              isPerfect ? 'text-emerald-600 drop-shadow-[0_4px_16px_rgba(16,185,129,0.6)]' : 'text-rose-600 drop-shadow-[0_4px_16px_rgba(244,63,94,0.6)]'
            }`}
          >
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-3xl border-2 border-current shadow-2xl scale-125">
              <span className="text-3xl md:text-4xl">{isPerfect ? '🎉' : '❌'}</span>
              <div className="flex flex-col">
                <span className="text-xl md:text-3xl font-black tracking-wider leading-none">
                  {fb.text}
                </span>
                <span className={`text-sm md:text-base font-bold leading-none mt-1 ${isPerfect ? 'text-amber-600' : 'text-rose-500'}`}>
                  {fb.scoreDelta >= 0 ? `+${fb.scoreDelta} PTS` : `${fb.scoreDelta} PTS`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
