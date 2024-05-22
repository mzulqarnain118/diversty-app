"use client";
import React from 'react';
import { type Editor } from '@tiptap/react';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';


type Props = {
    editor: Editor | null;
}

function TiptapToolbar({ editor }: Props) {
    if (!editor) {
        return null;
    }

    return (
        <Stack direction={"row"} spacing={1} mb={2} useFlexGap flexWrap="wrap">
            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleBold()
                        .run()
                }
            >
                <FormatBoldIcon />
            </ToggleButton>
            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={
                    !editor.can()
                        .chain()
                        .focus()
                        .toggleItalic()
                        .run()
                }
            >
                <FormatItalicIcon />
            </ToggleButton>

            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
                <strong>h1</strong>

            </ToggleButton>
            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
                <strong>h2</strong>
            </ToggleButton>

            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <FormatListBulletedIcon />
            </ToggleButton>

            <ToggleButton size="small"
                value="check"
                selected={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <FormatListNumberedIcon />
            </ToggleButton>
        </Stack>
    )
}

export default TiptapToolbar