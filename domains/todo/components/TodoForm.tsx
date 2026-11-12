'use client';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import TiptabEditor from '@/shared/components/TiptabEditor';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { addTodoAction, updateTodoAction } from '../actions/todo.actions';
import type { Todo } from '../types/todo.types';

interface FormState {
    title: string;
    content: string;
}

interface TodoFormProps {
    todo?: Todo; // 있으면 수정 모드, 없으면 등록 모드
}

export default function TodoForm({ todo }: TodoFormProps) {
    const router = useRouter();
    const isEdit = !!todo;

    const [state, formAction, isPending] = useActionState(
        isEdit ? updateTodoAction : addTodoAction,
        INITIAL_ACTION_STATE,
    );

    const [form, setForm] = useState<FormState>({
        title: todo?.title ?? '',
        content: todo?.content ?? '',
    });

    const onChange = (e: ChangeEvent<HTMLInputElement> | string) => {
        setForm((prev) => {
            if (typeof e === 'string') {
                return { ...prev, content: e }; // 에디터는 HTML 문자열을 넘겨줌
            }
            return { ...prev, [e.target.name]: e.target.value };
        });
    };

    // 성공하면 상세 페이지로 이동
    useEffect(() => {
        if (state.success) {
            const { id } = state.data as { id: string };
            router.push(`/todo/${id}`);
        }
    }, [state.success, state.data, router]);

    return (
        <div>
            {state.message && !state.success && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {state.message}
                </div>
            )}
            <form action={formAction} noValidate autoComplete="off">
                {isEdit && <input type="hidden" name="id" value={todo.id} />}
                <input type="hidden" name="content" value={form.content} />

                <div className="mb-2 flex items-center">
                    <label htmlFor="title" className="basis-30 shrink-0">
                        할일
                    </label>
                    <div className="grow">
                        <Input
                            id="title"
                            type="text"
                            name="title"
                            placeholder="할일을 입력하세요..."
                            value={form.title}
                            onChange={onChange}
                        />
                    </div>
                </div>
                {state.errors?.title && (
                    <p className="mb-2 text-sm text-red-500">{state.errors.title}</p>
                )}

                <div className="mb-2 flex items-start">
                    <span className="basis-30 shrink-0 pt-2">내용</span>
                    <div className="grow">
                        <TiptabEditor
                            content={form.content}
                            onChange={onChange}
                            placeholder="할일의 상세 내용을 입력하세요..."
                        />
                    </div>
                </div>
                {state.errors?.content && (
                    <p className="mb-2 text-sm text-red-500">{state.errors.content}</p>
                )}

                <div className="mt-4 flex gap-2">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? '처리중...' : isEdit ? '수정하기' : '등록하기'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        취소
                    </Button>
                </div>
            </form>
        </div>
    );
}
