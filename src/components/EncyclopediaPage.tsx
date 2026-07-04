import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, X, ChevronRight } from 'lucide-react';
import { BINS, TRASH_POOL } from '../data/trashData';
import { BinCategory, TrashItem } from '../types';

interface EncyclopediaPageProps {
  onBack: () => void;
}

export const EncyclopediaPage: React.FC<EncyclopediaPageProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BinCategory | 'all'>('all');
  const [detailItem, setDetailItem] = useState<TrashItem | null>(null);

  const filteredItems = useMemo(() => {
    let items = TRASH_POOL;
    if (selectedCategory !== 'all') {
      items = items.filter((t) => t.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter((t) => t.name.toLowerCase().includes(q) || t.tip.toLowerCase().includes(q));
    }
    return items;
  }, [search, selectedCategory]);

  const categoryTabs: { key: BinCategory | 'all'; label: string; color: string }[] = [
    { key: 'all', label: '全部', color: 'bg-stone-100 text-stone-600 border-stone-300' },
    { key: 'organic', label: '厨余', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
    { key: 'recyclable', label: '可回收', color: 'bg-blue-50 text-blue-700 border-blue-300' },
    { key: 'residual', label: '其他', color: 'bg-stone-100 text-stone-600 border-stone-300' },
    { key: 'hazardous', label: '有害', color: 'bg-rose-50 text-rose-700 border-rose-300' },
  ];

  const binColors: Record<BinCategory, string> = {
    organic: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    recyclable: 'bg-blue-100 text-blue-700 border-blue-300',
    residual: 'bg-stone-100 text-stone-600 border-stone-300',
    hazardous: 'bg-rose-100 text-rose-700 border-rose-300',
  };

  // 详情弹窗
  if (detailItem) {
    const bin = BINS.find((b) => b.id === detailItem.category);
    return (
      <div className="h-dvh w-screen bg-[#F5F0EB] flex flex-col select-none safe-bottom">
        <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-2 flex items-center">
          <button
            onClick={() => setDetailItem(null)}
            className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-stone-200 shadow-sm text-stone-500 hover:text-stone-800 transition-all active:scale-95 touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex-1 text-center mr-8 sm:mr-10">
            <h2 className="text-base sm:text-lg font-bold text-stone-800">垃圾详情</h2>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 gap-4 sm:gap-6">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-white flex items-center justify-center shadow-xl border border-stone-200 overflow-hidden">
            {detailItem.image ? (
              <img src={detailItem.image} alt={detailItem.name} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-5xl sm:text-6xl">{detailItem.emoji}</span>
            )}
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-stone-800">{detailItem.name}</h1>
            {bin && (
              <span className={`inline-block px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold border ${binColors[bin.id]}`}>
                {bin.icon} {bin.cnName}
              </span>
            )}
          </div>
          <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-stone-600">分类说明</h3>
            <p className="text-[13px] sm:text-sm text-stone-500 leading-relaxed">{detailItem.tip}</p>
            {bin && (
              <div className="pt-2 sm:pt-3 border-t border-stone-100">
                <p className="text-[11px] sm:text-xs text-stone-400">{bin.desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 主列表
  return (
    <div className="h-dvh w-screen bg-[#F5F0EB] flex flex-col select-none safe-bottom">
      {/* 顶部 */}
      <div className="px-3 sm:px-4 pt-4 sm:pt-6 pb-2 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onBack}
          className="p-2 sm:p-2.5 rounded-xl bg-white/90 border border-stone-200 shadow-sm text-stone-500 hover:text-stone-800 transition-all flex-shrink-0 active:scale-95 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400" />
          <input
            type="text"
            placeholder="搜索垃圾..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 sm:py-2.5 bg-white border border-stone-200 rounded-xl text-[13px] sm:text-sm text-stone-700 placeholder:text-stone-300 focus:outline-none focus:border-indigo-400 transition-colors"
            inputMode="search"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-0.5 text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 分类标签 - 横向滚动 */}
      <div className="px-3 sm:px-4 pb-2.5 pt-1 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5 sm:gap-2 whitespace-nowrap">
          {categoryTabs.map((tab) => {
            const active = selectedCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-all active:scale-95 touch-manipulation ${
                  active
                    ? `${tab.color} shadow-sm`
                    : 'bg-white text-stone-400 border-stone-200 hover:border-stone-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 pb-4 safe-bottom">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-stone-400 gap-2">
            <span className="text-3xl sm:text-4xl">🔍</span>
            <p className="text-xs sm:text-sm">没有找到匹配的垃圾</p>
          </div>
        ) : (
          <div className="space-y-1.5 sm:space-y-2">
            {filteredItems.map((item) => {
              const bin = BINS.find((b) => b.id === item.category);
              return (
                <button
                  key={item.id}
                  onClick={() => setDetailItem(item)}
                  className="w-full bg-white rounded-xl border border-stone-200 hover:border-indigo-300 hover:shadow-sm p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-all text-left group active:scale-[0.99] touch-manipulation"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center flex-shrink-0 border border-amber-200 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xl sm:text-2xl">{item.emoji}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] sm:text-sm font-bold text-stone-700 group-hover:text-stone-900 leading-tight line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {bin && (
                        <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md font-bold border ${binColors[bin.id]}`}>
                          {bin.cnName}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-300 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 底部统计 */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-stone-200 bg-white/60 backdrop-blur-sm safe-bottom">
        <div className="flex items-center justify-between text-[10px] sm:text-xs text-stone-400">
          <span>共 {TRASH_POOL.length} 种</span>
          <span>显示 {filteredItems.length} 条</span>
        </div>
      </div>
    </div>
  );
};
