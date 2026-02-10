import "../styles/RichTextEditor.css";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import { Color } from "@tiptap/extension-color";
import { useEffect } from "react";

type RichTextEditorProps = {
  value: string;
  editable: boolean;
  onChange: (html: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

function RichTextEditor({ value, editable, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    
    extensions: [
      StarterKit.configure({
        underline: false,
        link: false,
        bulletList: {},
        orderedList: {},
        code: {},
        codeBlock: {},
        heading: { levels: [1, 2, 3] },
      }), 
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value,
    editable,
  });
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editable, editor]);
  useEffect(() => {
    if (!editor || !editable) return;
    const handler = () => {
      onChange(editor.getHTML());
    };
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, editable, onChange]);
  if (!editor) return null;
  const prevent = (e: React.MouseEvent) => e.preventDefault();
  const applyLinkToSelection = () => {
    if (!editable) return;
    const { from, to } = editor.state.selection;
    if (from === to) {
      alert("Selecciona texto para convertirlo en enlace");
      return;
    }
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "");
    if (!url) return;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };
  return (
    <div className="rich-editor">
      {editable && (
        <div className="editor-toolbar">
          <select
            onMouseDown={(e) => e.stopPropagation()}
            value={editor.getAttributes("textStyle").fontFamily || "Arial"}
            onChange={(e) =>
              editor
                .chain()
                .focus()
                .setFontFamily(e.target.value)
                .run()
            }
          >
            <option value="Arial">Arial</option>
            <option value="Montserrat">Montserrat</option>
            <option value="Lora">Lora</option>
            <option value="Merriweather">Merriweather</option>
            <option value="Roboto">Roboto</option>
            <option value="Playfair Display">Playfair Display</option>
            <option value="Pacifico">Pacifico</option>
          </select>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBold().run()}>
            <b>B</b>
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <i>I</i>
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <u>U</u>
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <s>S</s>
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            H1
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            H2
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            H3
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            • List
          </button>
          <button onMouseDown={prevent} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            1. List
          </button>
          <button onMouseDown={prevent} onClick={applyLinkToSelection}>
            🔗
          </button>
          <input
            type="color"
            onMouseDown={prevent}
            value={editor.getAttributes("textStyle").color || "#000000"}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
          />
        </div>
      )}
      <EditorContent editor={editor} className="editor-content" />
    </div>
  );
}

export default RichTextEditor;
