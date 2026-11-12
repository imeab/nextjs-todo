import Link from 'next/link';
import type { Todo } from '../types/todo.types';
import { STATUS_COLOR, STATUS_LABEL } from '../utils/todoStatus';
import TodoStatusSelect from './TodoStatusSelect';

interface TodoItemProps {
    todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
    const date = todo.createdAt
        ? new Date(todo.createdAt).toLocaleDateString('ko-KR')
        : '';

    return (
        <li className="flex items-center gap-3 rounded-xl border p-3">
            <span
                className={`shrink-0 rounded-md px-2 py-0.5 text-xs ${STATUS_COLOR[todo.status]}`}
            >
                {STATUS_LABEL[todo.status]}
            </span>

            {/* 동적 라우트 /todo/[id] 로 이동 */}
            <Link
                href={`/todo/${todo.id}`}
                className={`grow truncate hover:underline ${
                    todo.status === 'DONE' ? 'text-zinc-400 line-through' : ''
                }`}
            >
                {todo.title}
            </Link>

            <span className="shrink-0 text-xs text-zinc-400">{date}</span>

            {/* 상태 변경만 클라이언트 컴포넌트 (클릭 이벤트가 필요해서) */}
            <TodoStatusSelect id={todo.id} status={todo.status} />
        </li>
    );
}
