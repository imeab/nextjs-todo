'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Button } from '@/shared/components/ui/button';
import { deleteTodoAction } from '../actions/todo.actions';

export default function DeleteTodoButton({ id }: { id: string }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const onClick = () => {
        if (!confirm('정말 삭제할까요?')) return;

        startTransition(async () => {
            const result = await deleteTodoAction(id);
            if (result.success) {
                router.push('/');
            } else {
                alert(result.message);
            }
        });
    };

    return (
        <Button variant="destructive" onClick={onClick} disabled={isPending}>
            {isPending ? '삭제중...' : '삭제'}
        </Button>
    );
}
