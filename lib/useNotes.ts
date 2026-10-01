'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Note, NoteInput } from './types';
import { LocalStorageNoteRepository } from './infrastructure/LocalStorageNoteRepository';
import { INoteRepository } from './domain/INoteRepository';
import { filterAndSortNotes } from './domain/FilterNotesUseCase';
import { extractUniqueTags } from './domain/ExtractAllTagsUseCase';

export function useNotes(repository: INoteRepository = useMemo(() => new LocalStorageNoteRepository(), [])) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Initial load from repository on client mount
  useEffect(() => {
    const loaded = repository.findAll();
    setNotes(loaded);
    setIsMounted(true);
  }, [repository]);

  // Sync state across tabs when localStorage updates
  useEffect(() => {
    if (!isMounted) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'next_crud_notes_v1' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setNotes(parsed);
          }
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isMounted]);

  const refreshNotes = useCallback(() => {
    setNotes(repository.findAll());
  }, [repository]);

  const getNoteById = useCallback(
    (id: string): Note | undefined => {
      return repository.findById(id);
    },
    [repository]
  );

  const addNote = useCallback(
    (input: NoteInput): Note => {
      const created = repository.save(input);
      refreshNotes();
      return created;
    },
    [repository, refreshNotes]
  );

  const updateNote = useCallback(
    (id: string, input: Partial<NoteInput>): Note | null => {
      const updated = repository.update(id, input);
      refreshNotes();
      return updated;
    },
    [repository, refreshNotes]
  );

  const deleteNote = useCallback(
    (id: string): boolean => {
      const success = repository.delete(id);
      if (success) {
        refreshNotes();
      }
      return success;
    },
    [repository, refreshNotes]
  );

  const togglePin = useCallback(
    (id: string) => {
      repository.togglePin(id);
      refreshNotes();
    },
    [repository, refreshNotes]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      repository.toggleFavorite(id);
      refreshNotes();
    },
    [repository, refreshNotes]
  );

  const importNotes = useCallback(
    (jsonStr: string): boolean => {
      const success = repository.importAll(jsonStr);
      if (success) {
        refreshNotes();
      }
      return success;
    },
    [repository, refreshNotes]
  );

  const resetToSampleNotes = useCallback(() => {
    repository.resetToDefault();
    refreshNotes();
  }, [repository, refreshNotes]);

  // Derived state: unique tags list via domain use case
  const allTags = useMemo(() => {
    return extractUniqueTags(notes);
  }, [notes]);

  // Derived state: filtered notes via domain use case
  const filteredNotes = useMemo(() => {
    return filterAndSortNotes(notes, searchQuery, selectedTag, 'all');
  }, [notes, searchQuery, selectedTag]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);
  const favoriteNotes = useMemo(() => filteredNotes.filter((n) => n.isFavorite), [filteredNotes]);

  return {
    notes,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    favoriteNotes,
    allTags,
    isMounted,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    getNoteById,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    importNotes,
    resetToSampleNotes,
  };
}
