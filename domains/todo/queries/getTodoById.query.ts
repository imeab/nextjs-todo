'use server';

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import { Todo } from '../types/todo.types';
import { toTodo } from '../utils/todoConverter';

export async function getTodoById(id: string): Promise<Todo | null> {
    // 로그인 확인을 먼저 해야 요청 시점에 실행됨 (클라이언트를 먼저 만들면 prerender 경고)
    const user = await getCurrentUser();

    if (!user) return null;

    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .maybeSingle();

    if (error) {
        console.error(
            `할일을 조회하지 못했습니다. [id: ${id}]:`,
            error.message,
        );
        return null;
    }

    if (!data) return null;

    return toTodo(data);
}
