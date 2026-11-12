'use server';

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import type { Todo, TodoResponse, TodoStatus } from '../types/todo.types';
import { toTodo } from '../utils/todoConverter';

// status를 넘기면 해당 상태만 조회
export async function getTodos(status?: TodoStatus): Promise<Todo[]> {
    // 로그인 확인을 먼저 해야 요청 시점에 실행됨 (클라이언트를 먼저 만들면 prerender 경고)
    const user = await getCurrentUser();

    if (!user) return [];

    const supabase = createServerClient();

    let query = supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null);

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', {
        ascending: false,
    });

    // 조회 실패는 빈 목록과 구분해야 해서 에러를 던짐 → error.tsx가 오류 화면 표시
    if (error) {
        throw new Error(`할일을 조회하지 못했습니다: ${error.message}`);
    }

    return ((data ?? []) as TodoResponse[]).map((item) => toTodo(item));
}
