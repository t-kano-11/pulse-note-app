'use client';

import React from 'react';
import Link from 'next/link';
import { Pin, Star, Edit3, Trash2, Calendar, Tag as TagIcon, ArrowRight } from 'lucide-react';
import { Note, COLOR_OPTIONS, ViewMode } from '../lib/types';

interface NoteCardProps {
  note: Note;
  viewMode: ViewMode;
  onTogglePin: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  viewMode,
  onTogglePin,
  onToggleFavorite,
  onDelete,
  onTagClick,
}) => {
  const colorOption = COLOR_OPTIONS.find((c) => c.id === note.categoryColor) || COLOR_OPTIONS[0];

  const formattedDate = new Date(note.updatedAt).toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Strip markdown formatting for preview text
  const previewText = note.content
    .replace(/[#*`>]/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .trim()
    .substring(0, 140);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`ノート「${note.title}」を削除しますか？`)) {
      onDelete(note.id);
    }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onTogglePin(note.id);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(note.id);
  };

  if (viewMode === 'list') {
    return (
      <div
        className={`group relative rounded-2xl border ${colorOption.borderClass} bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
      >
        {/* Color accent line */}
        <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${colorOption.dotClass}`} />

        <div className="pl-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorOption.badgeClass}`}
            >
              {colorOption.name}
            </span>
            {note.isPinned && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                <Pin className="w-3 h-3 fill-amber-500 text-amber-500" /> ピン留め
              </span>
            )}
            {note.tags.map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-[10px] text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          <Link href={`/notes/${note.id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {note.title || '無題のノート'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {previewText || '本文はありません'}
            </p>
          </Link>
        </div>

        {/* Meta & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePinClick}
              title={note.isPinned ? 'ピン留め解除' : 'ピン留め'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isPinned
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleFavoriteClick}
              title={note.isFavorite ? 'お気に入り解除' : 'お気に入りに追加'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isFavorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <Link
              href={`/notes/${note.id}/edit`}
              title="編集"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDeleteClick}
              title="削除"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view card
  return (
    <div
      className={`group relative rounded-2xl border ${colorOption.borderClass} bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden min-h-[220px]`}
    >
      {/* Background ambient glow */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full ${colorOption.bgClass} blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      <div>
        {/* Card Header: Color badge + Pin/Favorite */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colorOption.badgeClass}`}
          >
            {colorOption.name}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePinClick}
              title={note.isPinned ? 'ピン留め解除' : 'ピン留め'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isPinned
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleFavoriteClick}
              title={note.isFavorite ? 'お気に入り解除' : 'お気に入り'}
              className={`p-1.5 rounded-lg transition-colors ${
                note.isFavorite
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/50'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <Link href={`/notes/${note.id}`} className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2">
            {note.title || '無題のノート'}
          </h3>
        </Link>

        {/* Content Snippet */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {previewText || '本文はありません'}
        </p>
      </div>

      <div>
        {/* Tag Pills */}
        {note.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <TagIcon className="w-3 h-3 text-slate-400 shrink-0" />
            {note.tags.slice(0, 3).map((tag) => (
              <button
                key={tag}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onTagClick?.(tag);
                }}
                className="text-[10px] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </button>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-slate-400">+{note.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>

          <div className="flex items-center gap-1">
            <Link
              href={`/notes/${note.id}/edit`}
              title="編集"
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleDeleteClick}
              title="削除"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <Link
              href={`/notes/${note.id}`}
              className="ml-1 p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
