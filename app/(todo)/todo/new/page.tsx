import TodoForm from '@/domains/todo/components/TodoForm';

export default function AddTodoPage() {
    return (
        <>
            <h1 className="mb-4 text-xl font-bold">할일 등록</h1>
            <TodoForm />
        </>
    );
}
