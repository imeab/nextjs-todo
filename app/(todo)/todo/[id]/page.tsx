import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { getTodoById } from '@/domains/todo/queries/getTodoById.query';
import TodoContent from '@/domains/todo/components/TodoContent';
import TodoStatusSelect from '@/domains/todo/components/TodoStatusSelect';
import DeleteTodoButton from '@/domains/todo/components/DeleteTodoButton';

// 동적 라우트: /todo/123 → params.id = '123'
export default async function TodoDetailPage({
    params,
}: PageProps<'/todo/[id]'>) {
    const { id } = await params;
    const todo = await getTodoById(id);

    // 없거나 내 할일이 아니면 404 화면
    if (!todo) notFound();

    const created = todo.createdAt
        ? new Date(todo.createdAt).toLocaleString('ko-KR')
        : '';
    const updated = todo.updatedAt
        ? new Date(todo.updatedAt).toLocaleString('ko-KR')
        : '';

    return (
        <article>
            <Link href="/" className="text-sm text-zinc-500 hover:underline">
                ← 목록으로
            </Link>

            <div className="mt-3 mb-2 flex items-center justify-between gap-2">
                <h1 className="text-xl font-bold break-all">{todo.title}</h1>
                <TodoStatusSelect id={todo.id} status={todo.status} />
            </div>

            <p className="mb-4 text-xs text-zinc-400">
                등록 {created}
                {updated && ` · 수정 ${updated}`}
            </p>

            <div className="mb-6 rounded-xl border p-4">
                <TodoContent html={todo.content} />
            </div>

            <div className="flex gap-2">
                <Link href={`/todo/${todo.id}/edit`}>
                    <Button variant="outline">수정</Button>
                </Link>
                <DeleteTodoButton id={todo.id} />
            </div>
        </article>
    );
}
