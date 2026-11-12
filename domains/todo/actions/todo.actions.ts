'use server';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import type { TodoStatus } from '../types/todo.types';
import { validateTodoInput } from '../utils/todoValidation';

// 할일 등록
export async function addTodoAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const title = (formData.get('title') as string) ?? '';
    const content = (formData.get('content') as string) ?? '';

    // getCurrentUser()는 프로필 객체(또는 null)를 바로 반환
    const user = await getCurrentUser();
    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 서비스 입니다.',
        };
    }

    // 필드별 유효성 검사
    const errors = validateTodoInput({ title, content });

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const supabase = createServerClient();

    const { data: todo, error: todoError } = await supabase
        .from('todos')
        .insert({
            status: 'READY',
            title: title.trim(),
            content,
            user_id: user.id,
            user_name: user.name,
        })
        .select('id')
        .single();

    if (todoError) {
        return {
            success: false,
            message: `할일 등록에 실패했습니다: ${todoError.message}`,
        };
    }

    revalidatePath('/', 'page');

    return {
        success: true,
        message: '할일이 등록되었습니다.',
        data: { id: todo.id },
    };
}

// 할일 수정 (제목, 내용)
export async function updateTodoAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const id = (formData.get('id') as string) ?? '';
    const title = (formData.get('title') as string) ?? '';
    const content = (formData.get('content') as string) ?? '';

    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 서비스 입니다.' };
    }

    const errors = validateTodoInput({ id, title, content });
    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('todos')
        .update({
            title: title.trim(),
            content,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .select('id')
        .maybeSingle();

    if (error || !data) {
        return {
            success: false,
            message: error
                ? `할일 수정에 실패했습니다: ${error.message}`
                : '할일을 찾을 수 없거나 수정 권한이 없습니다.',
        };
    }

    revalidatePath('/', 'page');
    revalidatePath(`/todo/${id}`);

    return { success: true, message: '할일이 수정되었습니다.', data: { id } };
}

// 상태 변경 (대기 / 진행중 / 완료)
export async function changeTodoStatus(
    id: string,
    status: TodoStatus,
): Promise<void> {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('인증되지 않은 사용자입니다.');
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('todos')
        .update({
            status,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .select('id')
        .single();

    if (error || !data) {
        throw new Error(
            error?.message ??
                `할일을 찾을 수 없거나 수정 권한이 없습니다. - ID: ${id}`,
        );
    }

    revalidatePath('/', 'page');
    revalidatePath(`/todo/${id}`);
}

// 삭제 (deleted_at에 시간 기록 = 소프트 삭제)
export async function deleteTodoAction(id: string): Promise<ActionState> {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: '로그인이 필요한 서비스 입니다.' };
    }

    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('todos')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .select('id')
        .maybeSingle();

    if (error || !data) {
        return {
            success: false,
            message: error
                ? `삭제에 실패했습니다: ${error.message}`
                : '할일을 찾을 수 없거나 삭제 권한이 없습니다.',
        };
    }

    revalidatePath('/', 'page');

    return { success: true, message: '삭제되었습니다.' };
}
