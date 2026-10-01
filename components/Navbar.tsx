'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, Plus, FileText, Download, Upload, X } from 'lucide-react';

interface NavbarProps {
  onExport?: () => string;
  onImport?: (json: string) => boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onExport, onImport }) => {
  const [isDark, setIsDark] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const [exportJson, setExportJson] = useState('');

  // Sync dark mode with html class
  useEffect(() => {
    const stored = localStorage.getItem('pn_dark_mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored !== null ? stored === 'true' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('pn_dark_mode', String(next));
  };

  const handleOpenBackup = () => {
    if (onExport) {
      setExportJson(onExport());
    }
    setImportError(null);
    setImportSuccess(false);
    setShowBackupModal(true);
  };

  const handleExportDownload = () => {
    const blob = new Blob([exportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulsenote_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (onImport) {
        const success = onImport(text);
        if (success) {
          setImportSuccess(true);
          setImportError(null);
          setTimeout(() => setShowBackupModal(false), 1500);
        } else {
          setImportError('インポートに失敗しました。有効なJSONファイルを選択してください。');
        }
      }
    };
    reader.readAsText(file);
    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b border-slate-200/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="PulseNote ホームへ"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/40 transition-shadow duration-300">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Pulse<span className="text-indigo-500">Note</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Backup / Restore */}
            <button
              id="navbar-backup-btn"
              onClick={handleOpenBackup}
              title="バックアップ・復元"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="バックアップ・復元モーダルを開く"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              id="navbar-dark-toggle"
              onClick={toggleDark}
              title={isDark ? 'ライトモードに切替' : 'ダークモードに切替'}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="ダーク・ライトモード切替"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* New Note CTA */}
            <Link
              id="navbar-new-note-btn"
              href="/notes/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="新規ノートを作成"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新規ノート</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Backup / Restore Modal */}
      {showBackupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="backup-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-5">
              <h2
                id="backup-modal-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                バックアップ・復元
              </h2>
              <button
                onClick={() => setShowBackupModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="モーダルを閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Export */}
            <div className="mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-indigo-500" /> エクスポート
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                全ノートをJSON形式でダウンロードします。
              </p>
              <button
                id="export-download-btn"
                onClick={handleExportDownload}
                className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
              >
                JSONをダウンロード
              </button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-500" /> インポート
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                バックアップJSONを選択して復元します（既存データは上書きされます）。
              </p>
              <label
                id="import-file-label"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" /> ファイルを選択
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleImportFile}
                />
              </label>
              {importError && (
                <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{importError}</p>
              )}
              {importSuccess && (
                <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                  ✅ インポートに成功しました！
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
