"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";

export function CodeEditor({
  value,
  onChange,
  language = "sql",
  height = "100%",
}: {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string | number;
}) {
  const configured = useRef(false);

  const handleMount: OnMount = (_editor, monaco) => {
    if (configured.current) return;
    configured.current = true;
    monaco.editor.defineTheme("ops-center", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "94A3B8", fontStyle: "italic" },
        { token: "keyword", foreground: "8B5CF6" },
        { token: "string", foreground: "22D3EE" },
        { token: "number", foreground: "F59E0B" },
        { token: "operator", foreground: "4F8CFF" },
        { token: "function", foreground: "4F8CFF" },
        { token: "type", foreground: "10B981" },
      ],
      colors: {
        "editor.background": "#0F172A",
        "editor.foreground": "#F9FAFB",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#CBD5E1",
        "editor.lineHighlightBackground": "#131A2266",
        "editor.selectionBackground": "#2563EB44",
        "editorCursor.foreground": "#4F8CFF",
        "editorGutter.background": "#0F172A",
        "editorIndentGuide.background1": "#1F2937",
      },
    });
    monaco.editor.setTheme("ops-center");
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      onMount={handleMount}
      theme="ops-center"
      loading={
        <div className="grid h-full place-items-center bg-deep text-xs text-muted">
          Loading editor…
        </div>
      }
      options={{
        fontSize: 13,
        fontFamily: "var(--font-jetbrains), monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        renderLineHighlight: "all",
        padding: { top: 14, bottom: 14 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        roundedSelection: true,
        automaticLayout: true,
        tabSize: 2,
        scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      }}
    />
  );
}
