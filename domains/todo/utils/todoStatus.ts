import type { TodoStatus } from '../types/todo.types';

// 상태값 → 화면에 보일 이름, 색
export const STATUS_LABEL: Record<TodoStatus, string> = {
    READY: '대기',
    PROGRESS: '진행중',
    DONE: '완료',
};

export const STATUS_COLOR: Record<TodoStatus, string> = {
    READY: 'bg-zinc-100 text-zinc-700',
    PROGRESS: 'bg-blue-100 text-blue-700',
    DONE: 'bg-green-100 text-green-700',
};

export const STATUS_LIST: TodoStatus[] = ['READY', 'PROGRESS', 'DONE'];

export function isTodoStatus(value: unknown): value is TodoStatus {
    return STATUS_LIST.includes(value as TodoStatus);
}
