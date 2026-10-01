import { Note, FilterTab } from '../types';

export function matchesQuery(note: Note, query: string): boolean {
  const cleanQuery = query.trim().toLowerCase();
  if (cleanQuery === '') return true;

  const titleMatch = note.title.toLowerCase().includes(cleanQuery);
  const contentMatch = note.content.toLowerCase().includes(cleanQuery);

  return titleMatch || contentMatch;
}

export function matchesTag(note: Note, tag: string | null): boolean {
  if (!tag) return true;
  return note.tags.includes(tag);
}

export function filterAndSortNotes(
  notes: Note[],
  query: string,
  tag: string | null,
  activeTab: FilterTab = 'all'
): Note[] {
  return notes.filter((note) => {
    const isQueryMatched = matchesQuery(note, query);
    const isTagMatched = matchesTag(note, tag);
    
    let isTabMatched = true;
    if (activeTab === 'pinned') {
      isTabMatched = note.isPinned;
    } else if (activeTab === 'favorites') {
      isTabMatched = note.isFavorite;
    }

    return isQueryMatched && isTagMatched && isTabMatched;
  }).sort((a, b) => {
    // Sort pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    // Then sort by updatedAt descending (newest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}
