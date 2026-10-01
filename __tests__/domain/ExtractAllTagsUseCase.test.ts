import { extractUniqueTags } from '../../lib/domain/ExtractAllTagsUseCase';
import { Note } from '../../lib/types';

// ─── Test Fixture ─────────────────────────────────────────────────────────────

const makeNote = (tags: string[]): Note => ({
  id: 'note-1',
  title: 'Test',
  content: '',
  tags,
  categoryColor: 'indigo',
  isPinned: false,
  isFavorite: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

// ─── extractUniqueTags ────────────────────────────────────────────────────────

describe('extractUniqueTags', () => {
  // T-14: 空配列を渡す
  it('T-14: returns empty array when notes is empty', () => {
    expect(extractUniqueTags([])).toEqual([]);
  });

  // T-15: タグなしのノート群
  it('T-15: returns empty array when all notes have no tags', () => {
    const notes = [makeNote([]), makeNote([])];
    expect(extractUniqueTags(notes)).toEqual([]);
  });

  // T-16: 重複するタグを含む複数ノート → ユニーク化
  it('T-16: deduplicates tags across multiple notes', () => {
    const notes = [
      makeNote(['work', 'idea']),
      makeNote(['work', 'personal']),
      makeNote(['idea']),
    ];
    const result = extractUniqueTags(notes);
    expect(result).toHaveLength(3);
    expect(result).toContain('work');
    expect(result).toContain('idea');
    expect(result).toContain('personal');
    // 重複が除去されていることを確認
    expect(new Set(result).size).toBe(result.length);
  });

  // T-17: 空白タグを除外
  it('T-17: excludes empty-string and whitespace-only tags', () => {
    const notes = [makeNote(['valid', '', '   ', 'also-valid'])];
    const result = extractUniqueTags(notes);
    expect(result).not.toContain('');
    expect(result).not.toContain('   ');
    expect(result).toContain('valid');
    expect(result).toContain('also-valid');
  });

  // T-18: アルファベット昇順ソート
  it('T-18: returns tags sorted in ascending alphabetical order', () => {
    const notes = [makeNote(['zebra', 'apple', 'mango'])];
    const result = extractUniqueTags(notes);
    expect(result).toEqual(['apple', 'mango', 'zebra']);
  });
});
