import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "./ui/toggle";

interface MenuBarProps {
  editor: Editor | null;
}

const options = [
  {
    icon: <Heading1 className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    pressed: (editor: Editor) => editor.isActive("heading", { level: 1 }),
    ariaLabel: "Toggle Heading 1",
  },
  {
    icon: <Heading2 className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    pressed: (editor: Editor) => editor.isActive("heading", { level: 2 }),
    ariaLabel: "Toggle Heading 2",
  },
  {
    icon: <Heading3 className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    pressed: (editor: Editor) => editor.isActive("heading", { level: 3 }),
    ariaLabel: "Toggle Heading 3",
  },
  {
    icon: <Bold className="size-4" />,
    onClick: (editor: Editor) => editor.chain().focus().toggleBold().run(),
    pressed: (editor: Editor) => editor.isActive("bold"),
    ariaLabel: "Toggle Bold",
  },
  {
    icon: <Italic className="size-4" />,
    onClick: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
    pressed: (editor: Editor) => editor.isActive("italic"),
    ariaLabel: "Toggle Italic",
  },
  {
    icon: <Strikethrough className="size-4" />,
    onClick: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
    pressed: (editor: Editor) => editor.isActive("strike"),
    ariaLabel: "Toggle Strikethrough",
  },
  {
    icon: <AlignLeft className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("left").run(),
    pressed: (editor: Editor) => editor.isActive({ textAlign: "left" }),
    ariaLabel: "Align Left",
  },
  {
    icon: <AlignCenter className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("center").run(),
    pressed: (editor: Editor) => editor.isActive({ textAlign: "center" }),
    ariaLabel: "Align Center",
  },
  {
    icon: <AlignRight className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().setTextAlign("right").run(),
    pressed: (editor: Editor) => editor.isActive({ textAlign: "right" }),
    ariaLabel: "Align Right",
  },
  {
    icon: <List className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleBulletList().run(),
    pressed: (editor: Editor) => editor.isActive("bulletList"),
    ariaLabel: "Toggle Bullet List",
  },
  {
    icon: <ListOrdered className="size-4" />,
    onClick: (editor: Editor) =>
      editor.chain().focus().toggleOrderedList().run(),
    pressed: (editor: Editor) => editor.isActive("orderedList"),
    ariaLabel: "Toggle Ordered List",
  },
  {
    icon: <Highlighter className="size-4" />,
    onClick: (editor: Editor) => editor.chain().focus().toggleHighlight().run(),
    pressed: (editor: Editor) => editor.isActive("highlight"),
    ariaLabel: "Toggle Highlight",
  },
];

export default function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-md p-1 mb-1 space-x-2 z-50">
      {options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed(editor)}
          onPressedChange={() => {
            // Si un heading est actif, le désactiver pour revenir au paragraphe
            if (
              option.ariaLabel.includes("Heading") &&
              editor.isActive("heading", {
                level: parseInt(option.ariaLabel.split(" ")[2]),
              })
            ) {
              editor.chain().focus().setParagraph().run();
            } else {
              option.onClick(editor);
            }
          }}
          aria-label={option.ariaLabel}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
