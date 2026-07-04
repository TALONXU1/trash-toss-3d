import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas3D } from './components/GameCanvas3D';
import { GameHUD } from './components/GameHUD';
import { TossControls } from './components/TossControls';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { HelpModal } from './components/HelpModal';
import { GameOverModal } from './components/GameOverModal';
import { LandingPage } from './components/LandingPage';
import { ModeSelectPage } from './components/ModeSelectPage';
import { EncyclopediaPage } from './components/EncyclopediaPage';
import { getRandomTrash, BINS } from './data/trashData';
import { GameMode, GameStats, TossFeedback, BinCategory } from './types';
import { soundManager } from './utils/audio';

type Page = 'landing' | 'modeSelect' | 'game' | 'encyclopedia';

export default function App() {
  const [page, setPage] = useState<Page>('landing');
  const [gameMode, setGameMode] = useState<GameMode>('endless');
  const [currentTrash, setCurrentTrash] = useState(() => getRandomTrash());
  const [currentAngle, setCurrentAngle] = useState<number>(0);
  const [isTossing, setIsTossing] = useState<boolean>(false);
  const [tossTargetAngle, setTossTargetAngle] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<TossFeedback[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    combo: 1,
    maxCombo: 1,
    correctCount: 0,
    wrongCount: 0,
    timeLeft: 0,
  });

  const feedbackIdCounter = useRef(0);

  // 初始提示
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('trash_toss_seen_help_3d');
    if (!hasSeenHelp) {
      localStorage.setItem('trash_toss_seen_help_3d', 'true');
    }
  }, []);

  // 倒计时 (计时模式)
  useEffect(() => {
    if (page !== 'game' || gameMode !== 'timed' || isGameOver || isHelpOpen) return;
    const timer = setInterval(() => {
      setStats((prev) => {
        if (prev.timeLeft <= 1) {
          setIsGameOver(true);
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [page, gameMode, isGameOver, isHelpOpen]);

  // 进入游戏：初始化状态
  const enterGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setStats({
      score: 0,
      combo: 1,
      maxCombo: 1,
      correctCount: 0,
      wrongCount: 0,
      timeLeft: mode === 'timed' ? 60 : 0,
    });
    setCurrentTrash(getRandomTrash());
    setIsGameOver(false);
    setIsTossing(false);
    setFeedbacks([]);
    setCurrentAngle(0);
    setPage('game');
  }, []);

  // 从首页进入模式选择
  const handleEnterFromLanding = useCallback(() => {
    setPage('modeSelect');
  }, []);

  // 从模式选择页选择
  const handleSelectMode = useCallback((mode: GameMode | 'encyclopedia') => {
    if (mode === 'encyclopedia') {
      setPage('encyclopedia');
    } else {
      enterGame(mode);
    }
  }, [enterGame]);

  // 返回首页
  const handleBackToLanding = useCallback(() => {
    setPage('landing');
  }, []);

  // 返回模式选择
  const handleBackToModeSelect = useCallback(() => {
    setPage('modeSelect');
  }, []);

  // 重新开始
  const handleRestart = useCallback(() => {
    setStats({
      score: 0,
      combo: 1,
      maxCombo: 1,
      correctCount: 0,
      wrongCount: 0,
      timeLeft: gameMode === 'timed' ? 60 : 0,
    });
    setCurrentTrash(getRandomTrash());
    setIsGameOver(false);
    setIsTossing(false);
    setFeedbacks([]);
    setCurrentAngle(0);
  }, [gameMode]);

  // 音效开关
  const handleToggleSound = useCallback(() => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  }, []);

  // 旋转控制
  const handleRotateLeft = useCallback(() => {
    if (isTossing) return;
    soundManager.playRotate();
    setCurrentAngle((prev) => prev + Math.PI / 2);
  }, [isTossing]);

  const handleRotateRight = useCallback(() => {
    if (isTossing) return;
    soundManager.playRotate();
    setCurrentAngle((prev) => prev - Math.PI / 2);
  }, [isTossing]);

  // 触发抛出
  const handleToss = useCallback(() => {
    if (isTossing || isGameOver) return;
    setIsTossing(true);
    setTossTargetAngle(currentAngle);
  }, [isTossing, isGameOver, currentAngle]);

  // 抛出完成判定
  const handleTossComplete = useCallback((targetBinCategory: BinCategory) => {
    const isCorrect = targetBinCategory === currentTrash.category;
    setStats((prev) => {
      if (isCorrect) {
        const nextCombo = prev.combo + 1;
        const pts = 100 + (prev.combo - 1) * 20;
        soundManager.playScore(nextCombo);
        feedbackIdCounter.current += 1;
        const newFb: TossFeedback = {
          id: feedbackIdCounter.current,
          text: prev.combo > 1 ? `${prev.combo}连击完美分类！` : '准确投入！',
          type: 'perfect',
          scoreDelta: pts,
        };
        setFeedbacks([newFb]);
        return {
          ...prev,
          score: prev.score + pts,
          combo: nextCombo,
          maxCombo: Math.max(prev.maxCombo, nextCombo),
          correctCount: prev.correctCount + 1,
          timeLeft: gameMode === 'timed' ? Math.min(99, prev.timeLeft + 2) : prev.timeLeft,
        };
      } else {
        soundManager.playWrong();
        feedbackIdCounter.current += 1;
        const correctBin = BINS.find((b) => b.id === currentTrash.category);
        const newFb: TossFeedback = {
          id: feedbackIdCounter.current,
          text: `进错桶了！应进【${correctBin?.cnName || '对应'}】`,
          type: 'wrong',
          scoreDelta: -50,
        };
        setFeedbacks([newFb]);
        return {
          ...prev,
          score: Math.max(0, prev.score - 50),
          combo: 1,
          wrongCount: prev.wrongCount + 1,
          timeLeft: gameMode === 'timed' ? Math.max(0, prev.timeLeft - 4) : prev.timeLeft,
        };
      }
    });
    setTimeout(() => {
      setFeedbacks((fbs) => fbs.filter((f) => f.id !== feedbackIdCounter.current));
    }, 2000);
    setCurrentTrash((prev) => getRandomTrash(prev.id));
    setIsTossing(false);
  }, [currentTrash, gameMode]);

  // ====== 页面路由 ======
  if (page === 'landing') {
    return <LandingPage onEnter={handleEnterFromLanding} />;
  }

  if (page === 'modeSelect') {
    return <ModeSelectPage onSelectMode={handleSelectMode} onBack={handleBackToLanding} />;
  }

  if (page === 'encyclopedia') {
    return <EncyclopediaPage onBack={handleBackToModeSelect} />;
  }

  // 游戏主界面
  return (
    <div className="relative w-screen h-dvh overflow-hidden bg-[#F5F0EB] font-sans select-none">
      {/* 3D 场景 */}
      <GameCanvas3D
        currentAngle={currentAngle}
        currentTrash={currentTrash}
        isTossing={isTossing}
        tossTargetAngle={tossTargetAngle}
        onTossComplete={handleTossComplete}
        highlightedBin={currentTrash.category}
      />

      {/* 顶部 HUD */}
      <GameHUD
        stats={stats}
        gameMode={gameMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHelp={() => setIsHelpOpen(true)}
        onRestart={handleRestart}
        onBack={handleBackToModeSelect}
      />

      {/* 操作控制 */}
      <TossControls
        currentTrash={currentTrash}
        currentAngle={currentAngle}
        onRotateLeft={handleRotateLeft}
        onRotateRight={handleRotateRight}
        onToss={handleToss}
        isTossing={isTossing}
      />

      {/* 反馈特效 */}
      <FeedbackOverlay feedbacks={feedbacks} combo={stats.combo - 1} />

      {/* 帮助弹窗 */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* 结算弹窗 */}
      <GameOverModal
        isOpen={isGameOver}
        stats={stats}
        gameMode={gameMode}
        onRestart={handleRestart}
        onBackToMenu={handleBackToModeSelect}
      />
    </div>
  );
}
