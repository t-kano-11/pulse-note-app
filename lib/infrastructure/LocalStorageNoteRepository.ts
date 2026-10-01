import { INoteRepository } from '../domain/INoteRepository';
import { Note, NoteInput } from '../types';
import {
  getStoredNotes,
  saveStoredNotes,
  generateId,
  INITIAL_SAMPLE_NOTES,
  parseNotesImport,
} from '../storage';

export class LocalStorageNoteRepository implements INoteRepository {
  private storageKey: string;

  constructor(storageKey: string = 'next_crud_notes_v1') {
    this.storageKey = storageKey;
  }

  public findAll(): Note[] {
    return getStoredNotes();
  }

  public findById(id: string): Note | undefined {
    const notes = this.findAll();
    return notes.find((n) => n.id === id);
  }

  public findByQueryAndTag(query: string, tag: string | null): Note[] {
    const notes = this.findAll();
    const cleanQuery = query.trim().toLowerCase();

    return notes.filter((note) => {
      const matchesQuery =
        cleanQuery === '' ||
        note.title.toLowerCase().includes(cleanQuery) ||
        note.content.toLowerCase().includes(cleanQuery);

      const matchesTag = !tag || note.tags.includes(tag);

      return matchesQuery && matchesTag;
    });
  }

  public save(input: NoteInput): Note {
    const notes = this.findAll();
    const now = new Date().toISOString();
    const newNote: Note = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    const updatedNotes = [newNote, ...notes];
    saveStoredNotes(updatedNotes);
    return newNote;
  }

  public update(id: string, input: Partial<NoteInput>): Note | null {
    const notes = this.findAll();
    let updatedNote: Note | null = null;

    const updatedNotes = notes.map((n) => {
      if (n.id === id) {
        updatedNote = {
          ...n,
          ...input,
          updatedAt: new Date().toISOString(),
        };
        return updatedNote;
      }
      return n;
    });

    if (updatedNote) {
      saveStoredNotes(updatedNotes);
    }
    return updatedNote;
  }

  public delete(id: string): boolean {
    const notes = this.findAll();
    const filtered = notes.filter((n) => n.id !== id);
    if (filtered.length !== notes.length) {
      saveStoredNotes(filtered);
      return true;
    }
    return false;
  }

  public togglePin(id: string): void {
    const note = this.findById(id);
    if (note) {
      this.update(id, { isPinned: !note.isPinned });
    }
  }

  public toggleFavorite(id: string): void {
    const note = this.findById(id);
    if (note) {
      this.update(id, { isFavorite: !note.isFavorite });
    }
  }

  public importAll(jsonStr: string): boolean {
    const parsed = parseNotesImport(jsonStr);
    if (parsed) {
      saveStoredNotes(parsed);
      return true;
    }
    return false;
  }

  public resetToDefault(): void {
    saveStoredNotes(INITIAL_SAMPLE_NOTES);
  }
}
