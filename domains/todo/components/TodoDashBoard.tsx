import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { getTodos } from '../queries/getTodos.query';
import type { TodoStatus } from '../types/todo.types';
import { STATUS_LABEL, STATUS_LIST } from '../utils/todoStatus';
import TodoItems from './TodoItems';

interface TodoDashBoardProps {
    status?: TodoStatus;
}

// 서버 컴포넌트: 서버에서 바로 DB 조회 후 HTML로 보내서 첫 화면이 빠름
export default async function TodoDashBoard({ status }: TodoDashBoardProps) {
    const todos = await getTodos(status);

    const filters: { label: string; href: string; active: boolean }[] = [
        { label: '전체', href: '/', active: !status },
        ...STATUS_LIST.map((s) => ({
            label: STATUS_LABEL[s],
            href: `/?status=${s}`,
            active: status === s,
        })),
    ];

    return (
        <section>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold">내 할일</h1>
                <Link href="/todo/new">
                    <Button>+ 할일 등록</Button>
                </Link>
            </div>

            {/* 필터: 주소의 ?status= 로 구분 (새로고침해도 유지) */}
            <nav className="mb-4 flex gap-2" aria-label="상태 필터">
                {filters.map((f) => (
                    <Link
                        key={f.label}
                        href={f.href}
                        className={`rounded-lg px-3 py-1 text-sm ${
                            f.active
                                ? 'bg-zinc-900 text-white'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                    >
                        {f.label}
                    </Link>
                ))}
            </nav>

            {todos.length === 0 ? (
                // 빈 데이터 상태
                <div className="rounded-xl border border-dashed p-10 text-center text-zinc-500">
                    <p className="mb-3">
                        {status
                            ? `'${STATUS_LABEL[status]}' 상태인 할일이 없습니다.`
                            : '아직 등록한 할일이 없습니다.'}
                    </p>
                    {!status && (
                        <Link href="/todo/new" className="text-blue-600 underline">
                            첫 할일 등록하기
                        </Link>
                    )}
                </div>
            ) : (
                <TodoItems todos={todos} />
            )}
        </section>
    );
}
