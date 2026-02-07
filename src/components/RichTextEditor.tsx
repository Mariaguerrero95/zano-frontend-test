import "../styles/RichTextEditor.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";

type RichTextEditorProps = {
    value: string;
    editable: boolean;
    onChange: (html: string) => void;
};

function RichTextEditor({ value, editable, onChange }: RichTextEditorProps) {
    const editor = useEditor(
        {
        extensions: [
            StarterKit.configure({
            bulletList: { keepMarks: true },
            orderedList: { keepMarks: true },
            }),
            Underline,
            TextStyle,
            Color,
        ],
        content: value,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        },
        [] 
    );
    useEffect(() => {
        if (!editor) return;
        if (editor.getHTML() !== value) {
        editor.commands.setContent(value, false);
        }
    }, [value, editor]);
    if (!editor) return null;
    const preventFocusLoss = (e: React.MouseEvent) => {
        e.preventDefault();
    };
    return (
        <div className="rich-editor">
        {editable && (
            <div className="editor-toolbar">
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleBold().run()}>
                <strong>B</strong>
            </button>
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleItalic().run()}>
                <em>I</em>
            </button>
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleStrike().run()}>
                <span style={{ textDecoration: "line-through" }}>S</span>
            </button>
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <span style={{ textDecoration: "underline" }}>U</span>
            </button>
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                • List
            </button>
            <button onMouseDown={preventFocusLoss} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                1. List
            </button>
            <label className="color-picker">
                🎨
                <input
                type="color"
                onMouseDown={preventFocusLoss}
                value={editor.getAttributes("textStyle").color || "#000000"}
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                />
            </label>
            </div>
        )}
        <EditorContent editor={editor} className="editor-content" />
        </div>
    );
}

export default RichTextEditor;
