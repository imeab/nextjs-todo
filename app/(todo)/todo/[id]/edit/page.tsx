import { notFound } from 'next/navigation';
import TodoForm from '@/domains/todo/components/TodoForm';
import { getTodoById } from '@/domains/todo/queries/getTodoById.query';

export default async function EditTodoPage({
    params,
}: PageProps<'/todo/[id]/edit'>) {
    const { id } = await params;
    const todo = await getTodoById(id);

    if (!todo) notFound();

    return (
        <>
            <h1 className="mb-4 text-xl font-bold">할일 수정</h1>
            <TodoForm todo={todo} />
        </>
    );
}
