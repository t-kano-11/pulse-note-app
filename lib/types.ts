export type CategoryColor = 'indigo' | 'emerald' | 'rose' | 'amber' | 'purple' | 'cyan';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  categoryColor: CategoryColor;
  isPinned: boolean;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

export type ViewMode = 'grid' | 'list';

export type FilterTab = 'all' | 'pinned' | 'favorites';

export interface ColorOption {
  id: CategoryColor;
  name: string;
  bgClass: string;
  badgeClass: string;
  borderClass: string;
  dotClass: string;
}

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'indigo',
    name: 'Indigo',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/20',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    borderClass: 'border-indigo-500/30 hover:border-indigo-500/60 dark:border-indigo-400/30 dark:hover:border-indigo-400/60',
    dotClass: 'bg-indigo-500',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    borderClass: 'border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-400/30 dark:hover:border-emerald-400/60',
    dotClass: 'bg-emerald-500',
  },
  {
    id: 'rose',
    name: 'Rose',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/20',
    badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    borderClass: 'border-rose-500/30 hover:border-rose-500/60 dark:border-rose-400/30 dark:hover:border-rose-400/60',
    dotClass: 'bg-rose-500',
  },
  {
    id: 'amber',
    name: 'Amber',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/20',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    borderClass: 'border-amber-500/30 hover:border-amber-500/60 dark:border-amber-400/30 dark:hover:border-amber-400/60',
    dotClass: 'bg-amber-500',
  },
  {
    id: 'purple',
    name: 'Purple',
    bgClass: 'bg-purple-500/10 dark:bg-purple-500/20',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    borderClass: 'border-purple-500/30 hover:border-purple-500/60 dark:border-purple-400/30 dark:hover:border-purple-400/60',
    dotClass: 'bg-purple-500',
  },
  {
    id: 'cyan',
    name: 'Cyan',
    bgClass: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    borderClass: 'border-cyan-500/30 hover:border-cyan-500/60 dark:border-cyan-400/30 dark:hover:border-cyan-400/60',
    dotClass: 'bg-cyan-500',
  },
];
