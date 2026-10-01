import { Note } from '../types';

export function extractUniqueTags(notes: Note[]): string[] {
  if (!Array.isArray(notes)) return [];
  const tagSet = new Set<string>();
  notes.forEach((note) => {
    if (Array.isArray(note.tags)) {
      note.tags.forEach((tag) => {
        if (tag && tag.trim()) {
          tagSet.add(tag.trim());
        }
      });
    }
  });

  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
}
