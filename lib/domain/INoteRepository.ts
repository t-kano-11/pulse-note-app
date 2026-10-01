import { Note, NoteInput } from '../types';

export interface INoteRepository {
  findAll(): Note[];
  findById(id: string): Note | undefined;
  findByQueryAndTag(query: string, tag: string | null): Note[];
  save(noteInput: NoteInput): Note;
  update(id: string, noteInput: Partial<NoteInput>): Note | null;
  delete(id: string): boolean;
  togglePin(id: string): void;
  toggleFavorite(id: string): void;
  importAll(jsonStr: string): boolean;
  resetToDefault(): void;
}
