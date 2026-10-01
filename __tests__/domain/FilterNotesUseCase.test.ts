import { matchesQuery, matchesTag, filterAndSortNotes } from '../../lib/domain/FilterNotesUseCase';
import { Note } from '../../lib/types';

// ─── Test Fixture ─────────────────────────────────────────────────────────────

const makeNote = (overrides: Partial<Note> = {}): Note => ({
  id: 'note-1',
  title: 'Test Title',
  content: 'Test content body',
  tags: ['work', 'idea'],
  categoryColor: 'indigo',
  isPinned: false,
  isFavorite: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ...overrides,
});

// ─── matchesQuery ─────────────────────────────────────────────────────────────

describe('matchesQuery', () => {
  // T-01: 空クエリは全件マッチ
  it('T-01: returns true when query is empty string', () => {
    const note = makeNote();
    expect(matchesQuery(note, '')).toBe(true);
  });

  // T-02: タイトルへの部分一致
  it('T-02: returns true when query partially matches the title', () => {
    const note = makeNote({ title: 'My Important Note' });
    expect(matchesQuery(note, 'Important')).toBe(true);
  });

  // T-03: 本文への部分一致
  it('T-03: returns true when query partially matches the content', () => {
    const note = makeNote({ content: 'This is a great idea' });
    expect(matchesQuery(note, 'great idea')).toBe(true);
  });

  // T-04: 大文字・小文字を無視してマッチ
  it('T-04: is case-insensitive', () => {
    const note = makeNote({ title: 'Hello World' });
    expect(matchesQuery(note, 'hello world')).toBe(true);
    expect(matchesQuery(note, 'HELLO')).toBe(true);
  });

  // T-05: どちらにもマッチしない場合
  it('T-05: returns false when query matches neither title nor content', () => {
    const note = makeNote({ title: 'Hello', content: 'World' });
    expect(matchesQuery(note, 'xyz-no-match')).toBe(false);
  });
});

// ─── matchesTag ───────────────────────────────────────────────────────────────

describe('matchesTag', () => {
  // T-06: tagがnullなら全件マッチ
  it('T-06: returns true when tag is null', () => {
    const note = makeNote({ tags: ['work'] });
    expect(matchesTag(note, null)).toBe(true);
  });

  // T-07: ノートのtagsに含まれるタグ
  it('T-07: returns true when tag is included in note.tags', () => {
    const note = makeNote({ tags: ['work', 'idea'] });
    expect(matchesTag(note, 'work')).toBe(true);
  });

  // T-08: ノートのtagsに含まれないタグ
  it('T-08: returns false when tag is NOT included in note.tags', () => {
    const note = makeNote({ tags: ['work'] });
    expect(matchesTag(note, 'personal')).toBe(false);
  });
});

// ─── filterAndSortNotes ───────────────────────────────────────────────────────

describe('filterAndSortNotes', () => {
  const pinnedNote = makeNote({
    id: 'pinned-1',
    title: 'Pinned Note',
    isPinned: true,
    isFavorite: false,
    updatedAt: '2024-01-02T00:00:00.000Z',
  });
  const favoriteNote = makeNote({
    id: 'fav-1',
    title: 'Favorite Note',
    isPinned: false,
    isFavorite: true,
    updatedAt: '2024-01-03T00:00:00.000Z',
  });
  const normalNote = makeNote({
    id: 'normal-1',
    title: 'Normal Note',
    isPinned: false,
    isFavorite: false,
    updatedAt: '2024-01-01T00:00:00.000Z',
  });
  const notes = [normalNote, favoriteNote, pinnedNote];

  // T-09: activeTab='pinned' → ピン留めノートのみ
  it('T-09: returns only pinned notes when activeTab is "pinned"', () => {
    const result = filterAndSortNotes(notes, '', null, 'pinned');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('pinned-1');
  });

  // T-10: activeTab='favorites' → お気に入りノートのみ
  it('T-10: returns only favorite notes when activeTab is "favorites"', () => {
    const result = filterAndSortNotes(notes, '', null, 'favorites');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('fav-1');
  });

  // T-11: activeTab='all' → ピン留めが先頭
  it('T-11: places pinned notes before unpinned notes in "all" tab', () => {
    const result = filterAndSortNotes(notes, '', null, 'all');
    expect(result[0].isPinned).toBe(true);
  });

  // T-12: query + tag + tab の複合フィルター (AND条件)
  it('T-12: combines query, tag, and tab filters with AND logic', () => {
    const taggedPinnedNote = makeNote({
      id: 'tagged-pinned',
      title: 'Tagged and Pinned',
      tags: ['special'],
      isPinned: true,
      updatedAt: '2024-01-05T00:00:00.000Z',
    });
    const mixedNotes = [...notes, taggedPinnedNote];

    const result = filterAndSortNotes(mixedNotes, 'Tagged', 'special', 'pinned');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('tagged-pinned');
  });

  // T-13: updatedAt 降順ソート（ピン留め内でも適用）
  it('T-13: sorts notes by updatedAt descending within the same pin status', () => {
    const older = makeNote({
      id: 'older',
      isPinned: false,
      updatedAt: '2024-01-01T00:00:00.000Z',
    });
    const newer = makeNote({
      id: 'newer',
      isPinned: false,
      updatedAt: '2024-03-01T00:00:00.000Z',
    });
    const result = filterAndSortNotes([older, newer], '', null, 'all');
    // Exclude pinned notes for this check
    const unpinned = result.filter((n) => !n.isPinned);
    expect(unpinned[0].id).toBe('newer');
    expect(unpinned[1].id).toBe('older');
  });
});
