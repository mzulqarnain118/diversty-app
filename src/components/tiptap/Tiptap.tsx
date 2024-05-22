'use client'
import styles from "./Tiptap.module.css";
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapToolbar from "./TiptapToolbar";
import { Box } from "@mui/material";

type ITiptapProp = {
    content: string,
    onChange: (value: string) => void
}

const Tiptap = ({ content, onChange }: ITiptapProp) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content,
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        }
    })

    return (
        <div className={styles.editor}>
            <TiptapToolbar editor={editor} />
            <Box sx={{
                '& .ProseMirror': {
                    border:'none',
                    borderTop: '1px solid rgba(0,0,0,0.1)'
                }
            }}>
            <EditorContent editor={editor} />
            </Box>
        </div>
    )
}

export default Tiptap