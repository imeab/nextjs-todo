'use client';

import { ChangeEvent, useState, useTransition } from 'react';
import { changeTodoStatus } from '../actions/todo.actions';
import type { TodoStatus } from '../types/todo.types';
import { isTodoStatus, STATUS_LABEL, STATUS_LIST } from '../utils/todoStatus';

interface TodoStatusSelectProps {
    id: string;
    status: TodoStatus;
}

export default function TodoStatusSelect({ id, status }: TodoStatusSelectProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState('');

    const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const next = e.target.value;
        if (!isTodoStatus(next)) return;

        setError('');
        // 서버 액션이 끝날 때까지 isPending = true (select 비활성화)
        startTransition(async () => {
            try {
                await changeTodoStatus(id, next);
            } catch {
                setError('변경 실패');
            }
        });
    };

    return (
        <div className="flex shrink-0 items-center gap-1">
            <select
                aria-label="상태 변경"
                value={status}
                onChange={onChange}
                disabled={isPending}
                className="rounded-md border px-1 py-0.5 text-sm disabled:opacity-50"
            >
                {STATUS_LIST.map((s) => (
                    <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}
