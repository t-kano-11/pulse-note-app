'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, LayoutGrid, List, Pin, Star, Sparkles, StickyNote } from 'lucide-react';
import { useNotes } from '../lib/useNotes';
import { NoteCard } from '../components/NoteCard';
import { Navbar } from '../components/Navbar';
import { FilterTab, ViewMode } from '../lib/types';
import { filterAndSortNotes } from '../lib/domain/FilterNotesUseCase';

export default function HomePage() {
  const {
    notes,
    allTags,
    isMounted,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    togglePin,
    toggleFavorite,
    deleteNote,
    importNotes,
  } = useNotes();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  // Export all notes as JSON string for backup
  const handleExport = (): string => JSON.stringify(notes, null, 2);

  // Apply filterTab + searchQuery + selectedTag
  const displayedNotes = useMemo(() => {
    return filterAndSortNotes(notes, searchQuery, selectedTag, filterTab);
  }, [notes, searchQuery, selectedTag, filterTab]);

  const pinnedNotes = useMemo(() => displayedNotes.filter((n) => n.isPinned), [displayedNotes]);
  const otherNotes = useMemo(() => displayedNotes.filter((n) => !n.isPinned), [displayedNotes]);

  // Quick stats (always based on raw notes, not filtered)
  const totalCount = notes.length;
  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const favoriteCount = notes.filter((n) => n.isFavorite).length;

  const filterTabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'すべて', icon: <StickyNote className="w-4 h-4" /> },
    { id: 'pinned', label: 'ピン留め', icon: <Pin className="w-4 h-4" /> },
    { id: 'favorites', label: 'お気に入り', icon: <Star className="w-4 h-4" /> },
  ];

  const gridClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      : 'flex flex-col gap-3';

  // Loading skeleton
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-2xl bg-slate-100 dark:bg-slate-800/60 animate-pulse"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onExport={handleExport} onImport={importNotes} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Hero / Quick Stats ── */}
        <section aria-label="クイック統計" className="animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                マイノート
              </span>
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
              アイデアをいつでもすばやく記録・整理
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {/* Total */}
            <div className="rounded-2xl p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center gap-1 text-center shadow-sm hover:shadow-md transition-shadow">
              <StickyNote className="w-5 h-5 text-indigo-500" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ノート</p>
            </div>
            {/* Pinned */}
            <div className="rounded-2xl p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center gap-1 text-center shadow-sm hover:shadow-md transition-shadow">
              <Pin className="w-5 h-5 text-amber-500" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{pinnedCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">ピン留め</p>
            </div>
            {/* Favorites */}
            <div className="rounded-2xl p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 flex flex-col items-center gap-1 text-center shadow-sm hover:shadow-md transition-shadow">
              <Star className="w-5 h-5 text-rose-500" />
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{favoriteCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">お気に入り</p>
            </div>
          </div>
        </section>

        {/* ── Search Bar ── */}
        <section aria-label="ノート検索" className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 pointer-events-none" />
            <input
              id="search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="タイトル・本文・タグで検索…"
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                id="search-clear-btn"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="検索クエリをクリア"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </section>

        {/* ── Filter Tabs + View Toggle ── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          {/* Filter tabs */}
          <div
            role="tablist"
            aria-label="ノートフィルター"
            className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80"
          >
            {filterTabs.map(({ id, label, icon }) => (
              <button
                key={id}
                id={`filter-tab-${id}`}
                role="tab"
                aria-selected={filterTab === id}
                onClick={() => setFilterTab(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filterTab === id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              title="グリッド表示"
              aria-label="グリッド表示に切替"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-list-btn"
              onClick={() => setViewMode('list')}
              title="リスト表示"
              aria-label="リスト表示に切替"
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Tag Filter Pill Carousel ── */}
        {allTags.length > 0 && (
          <section
            aria-label="タグフィルター"
            className="animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                id="tag-filter-all"
                onClick={() => setSelectedTag(null)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  selectedTag === null
                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                    : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                }`}
              >
                すべてのタグ
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  id={`tag-filter-${tag}`}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    selectedTag === tag
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                      : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Note List ── */}
        {displayedNotes.length === 0 ? (
          /* Empty State */
          <section
            aria-label="ノートが見つかりません"
            className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center mb-5 shadow-inner">
              <Sparkles className="w-9 h-9 text-indigo-400 dark:text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
              ノートが見つかりません
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
              {searchQuery || selectedTag
                ? '検索条件を変えて、もう一度お試しください。'
                : '最初のノートを作成してみましょう！'}
            </p>
            {!searchQuery && !selectedTag && (
              <Link
                id="empty-state-new-note-btn"
                href="/notes/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                新規ノートを作成
              </Link>
            )}
            {(searchQuery || selectedTag) && (
              <button
                id="empty-state-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" /> 検索条件をクリア
              </button>
            )}
          </section>
        ) : (
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <section aria-label="ピン留めノート">
                <div className="flex items-center gap-2 mb-3">
                  <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    ピン留め
                  </h2>
                </div>
                <div className={gridClass}>
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      onTogglePin={togglePin}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteNote}
                      onTagClick={(tag) => setSelectedTag(tag)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Notes */}
            {otherNotes.length > 0 && (
              <section aria-label="その他のノート">
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <StickyNote className="w-4 h-4 text-slate-400" />
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      その他
                    </h2>
                  </div>
                )}
                <div className={gridClass}>
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      onTogglePin={togglePin}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteNote}
                      onTagClick={(tag) => setSelectedTag(tag)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
