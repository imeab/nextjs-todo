'use client';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// 저장된 HTML을 읽기 전용 에디터로 보여줌
// (dangerouslySetInnerHTML 대신 에디터가 허용된 태그만 그려서 더 안전)
export default function TodoContent({ html }: { html: string }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: html,
        editable: false,
        immediatelyRender: false,
    });

    return <EditorContent editor={editor} className="todo-content" />;
}
