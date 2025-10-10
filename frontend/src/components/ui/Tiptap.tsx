'use client';

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Link } from "lucide-react";
import { useCallback } from "react";
import { Link as LinkExtension } from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

interface TiptapProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function Tiptap({ content = "<p></p>", onChange }: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const setLink = useCallback(() => {
    const url = window.prompt("Enter a URL");
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-xl p-4 bg-white shadow-md">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Link size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="prose prose-sm max-w-none min-h-[150px]" />
      {/* Aperçu du rendu final */}
        <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Aperçu :</h3>
            <div
                className="tiptap prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
        </div>
      {/* Rendu */}
      <div className="mt-4 text-xs text-gray-500">
        {editor.getHTML()}
      </div>
    </div>
  );
}
