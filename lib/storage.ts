import { Note } from './types';

const STORAGE_KEY = 'next_crud_notes_v1';

export const INITIAL_SAMPLE_NOTES: Note[] = [
  {
    id: 'seed-note-1',
    title: '🚀 Next.js App Router ノートアプリへようこそ',
    content: `# Next.js App Router 構成ノートアプリ

このアプリは、**Next.js 16 (App Router)** と **localStorage** を使用して作成されたマルチページCRUDノートアプリです。

## 主な機能
- 📝 **マルチページCRUD**: 新規作成 (\`/notes/new\`)、詳細表示 (\`/notes/[id]\`)、編集 (\`/notes/[id]/edit\`)
- 📌 **ピン留め & お気に入り**: 重要なノートを上部に固定
- 🏷️ **タグフィルター**: カテゴリやタグごとの絞り込み
- 🔍 **リアルタイム検索**: タイトルと本文から即座に検出
- 🌓 **ダークモード切り替え**: トグルスイッチで目に優しい配色へ
- 📦 **JSONバックアップ**: データのエクスポート・インポート対応

> **Tip:** このサンプルノートは自由に編集・削除できます！`,
    tags: ['Next.js', 'React', 'チュートリアル'],
    categoryColor: 'indigo',
    isPinned: true,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'seed-note-2',
    title: '💡 今週のWebデザイン・アイデアメモ',
    content: `## デザインシステムの検討項目

1. **グラスモフィズム (Glassmorphic Styling)**
   - \`backdrop-blur-md\` を使用して半透明なガラス質カード表現を構築
   - 暗色背景での繊細なボーダーグラデーション

2. **アクセシビリティとタイポグラフィ**
   - 視認性の高いフォントと十分なコントラスト比
   - フォーカス時のスタイルを明確化 (\`outline-none focus:ring-2\`)

\`\`\`typescript
const themeConfig = {
  glass: "backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border border-white/20 dark:border-slate-800",
  animation: "transition-all duration-200 ease-in-out"
};
\`\`\``,
    tags: ['Design', 'UI/UX', 'アイデア'],
    categoryColor: 'purple',
    isPinned: true,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'seed-note-3',
    title: '🛒 週末の買物＆Todoリスト',
    content: `### 週末にやること
- [x] 新機能の要件定義書 (\`requirement.md\`) の作成
- [ ] Next.js 16 App Router アプリ動作テスト
- [ ] ノートデータのバックアップ出力テスト

### 買物リスト
- コーヒー豆 (エチオピア モカ)
- システム手帳リフィル
- USB-C ケーブル (2m)`,
    tags: ['Todo', 'プライベート'],
    categoryColor: 'emerald',
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
];

export function getStoredNotes(): Note[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_NOTES));
      return INITIAL_SAMPLE_NOTES;
    }
    const parsed = JSON.parse(rawData);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SAMPLE_NOTES;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return INITIAL_SAMPLE_NOTES;
  }
}

export function saveStoredNotes(notes: Note[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
    return false;
  }
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'note-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
}

export function exportNotesAsJson(notes: Note[]): string {
  return JSON.stringify(notes, null, 2);
}

export function parseNotesImport(jsonStr: string): Note[] | null {
  try {
    const data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) return null;

    const validNotes: Note[] = data
      .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.content === 'string')
      .map((item) => ({
        id: item.id || generateId(),
        title: item.title || 'Untitled Note',
        content: item.content || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        categoryColor: item.categoryColor || 'indigo',
        isPinned: Boolean(item.isPinned),
        isFavorite: Boolean(item.isFavorite),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));

    return validNotes;
  } catch (error) {
    console.error('Invalid JSON for import:', error);
    return null;
  }
}
