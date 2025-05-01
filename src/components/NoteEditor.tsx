// components/NoteEditor.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import useNote from "@/hooks/useNote";
import { updateNoteAction } from "@/actions/notes";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  EditorState,
  LexicalEditor,
} from "lexical";
import { CustomEditor } from "./editor/CustomEditor";

type NoteEditorProps = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

export default function NoteEditor({
  noteId,
  startingNoteText,
}: NoteEditorProps) {
  const noteIdParam = useSearchParams().get("noteId") || "";
  const { noteText, setNoteText } = useNote();
  const editorRef = useRef<LexicalEditor>(null!);

  // Charger le texte initial dans l'éditeur
  useEffect(() => {
    if (noteIdParam === noteId && editorRef.current) {
      const editor = editorRef.current;
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(startingNoteText);
        paragraph.append(textNode);
        root.append(paragraph);
        setNoteText(startingNoteText);
      });
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);

  // Gestion des mises à jour de l'éditeur
  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const text = root.getTextContent();

      setNoteText(text);

      clearTimeout(updateTimeout);
      updateTimeout = setTimeout(() => {
        updateNoteAction(noteId, text);
      }, 600);
    });
  };

  return (
    <div className="custom-scrollbar mb-4 h-full max-w-4xl border p-4">
      <CustomEditor onChange={handleEditorChange} editorRef={editorRef} />
    </div>
  );
}
