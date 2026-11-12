import type { Todo } from '../types/todo.types';
import TodoItem from './TodoItem';

interface TodoItemsProps {
    todos: Todo[];
}

// 목록 렌더링: key는 DB의 고유 id 사용
export default function TodoItems({ todos }: TodoItemsProps) {
    return (
        <ul className="flex flex-col gap-2">
            {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </ul>
    );
}
