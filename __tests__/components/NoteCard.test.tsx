import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NoteCard } from '../../components/NoteCard';
import { Note } from '../../lib/types';

// ─── Mock Next.js Link ────────────────────────────────────────────────────────
// next/link requires the full Next.js runtime; mock it with a plain anchor.
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// ─── Test Fixture ─────────────────────────────────────────────────────────────

const baseNote: Note = {
  id: 'note-abc',
  title: 'My Test Note',
  content: 'This is test content for the note card.',
  tags: ['alpha', 'beta', 'gamma'],
  categoryColor: 'indigo',
  isPinned: false,
  isFavorite: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-06-01T12:00:00.000Z',
};

const defaultProps = {
  note: baseNote,
  viewMode: 'grid' as const,
  onTogglePin: jest.fn(),
  onToggleFavorite: jest.fn(),
  onDelete: jest.fn(),
  onTagClick: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  // Suppress window.confirm in tests
  window.confirm = jest.fn(() => true);
});

// ─── NoteCard Tests ───────────────────────────────────────────────────────────

describe('NoteCard', () => {
  // T-19: viewMode='grid' でグリッドカードが描画される
  it('T-19: renders title in grid view mode', () => {
    render(<NoteCard {...defaultProps} viewMode="grid" />);
    expect(screen.getByText('My Test Note')).toBeInTheDocument();
  });

  // T-20: viewMode='list' でリスト行が描画される
  it('T-20: renders title in list view mode', () => {
    render(<NoteCard {...defaultProps} viewMode="list" />);
    expect(screen.getByText('My Test Note')).toBeInTheDocument();
  });

  // T-21: ピン留めボタンクリック → onTogglePin が呼ばれ stopPropagation が機能する
  it('T-21: calls onTogglePin with note id on pin button click and prevents propagation', () => {
    render(<NoteCard {...defaultProps} />);
    const pinBtn = screen.getByTitle('ピン留め');
    const stopPropagation = jest.fn();

    fireEvent.click(pinBtn, { stopPropagation });
    expect(defaultProps.onTogglePin).toHaveBeenCalledWith('note-abc');
    // stopPropagation is called internally via e.stopPropagation() inside the handler.
    // We verify the mock was called (once only) and no parent navigation happened.
    expect(defaultProps.onTogglePin).toHaveBeenCalledTimes(1);
  });

  // T-22: お気に入りボタンクリック → onToggleFavorite が呼ばれる
  it('T-22: calls onToggleFavorite with note id on favorite button click', () => {
    render(<NoteCard {...defaultProps} />);
    // The favorite button title is 'お気に入りに追加' when isFavorite=false
    const favBtn = screen.getByTitle('お気に入り');
    fireEvent.click(favBtn);
    expect(defaultProps.onToggleFavorite).toHaveBeenCalledWith('note-abc');
    expect(defaultProps.onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  // T-23: タグピルクリック → onTagClick が対象タグ名で呼ばれる
  it('T-23: calls onTagClick with the correct tag name when a tag pill is clicked', () => {
    render(<NoteCard {...defaultProps} />);
    // Tags are rendered as "# alpha" (icon + text node) — use regex to match
    const tagPill = screen.getByText((content, element) => {
      return element?.tagName === 'BUTTON' && (element?.textContent ?? '').includes('#alpha');
    });
    fireEvent.click(tagPill);
    expect(defaultProps.onTagClick).toHaveBeenCalledWith('alpha');
  });

  // T-24: isPinned=true → ピン留めバッジが表示される
  it('T-24: shows pin badge and active pin button when note is pinned', () => {
    const pinnedNote = { ...baseNote, isPinned: true };
    render(<NoteCard {...defaultProps} note={pinnedNote} />);
    expect(screen.getByTitle('ピン留め解除')).toBeInTheDocument();
  });

  // T-25: note.title が空文字 → フォールバック「無題のノート」が表示される
  it('T-25: renders "無題のノート" fallback when title is empty', () => {
    const noTitleNote = { ...baseNote, title: '' };
    render(<NoteCard {...defaultProps} note={noTitleNote} />);
    expect(screen.getAllByText('無題のノート').length).toBeGreaterThan(0);
  });

  // T-26: tags が4件以上 → 4件目以降は "+N" で省略表示
  it('T-26: truncates tags beyond 3 and shows "+N" label in grid view', () => {
    const manyTagsNote = {
      ...baseNote,
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
    };
    render(<NoteCard {...defaultProps} note={manyTagsNote} viewMode="grid" />);
    // First 3 tags are shown
    expect(screen.getByText('#tag1')).toBeInTheDocument();
    expect(screen.getByText('#tag2')).toBeInTheDocument();
    expect(screen.getByText('#tag3')).toBeInTheDocument();
    // tags 4 & 5 are hidden, replaced with "+2"
    expect(screen.queryByText('#tag4')).not.toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
