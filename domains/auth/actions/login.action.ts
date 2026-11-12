'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { validateSignInInput } from '../utils/authValidations';
import { revalidatePath } from 'next/cache';

export async function signInAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const email = (formData.get('email') as string) ?? '';
    const password = (formData.get('password') as string) ?? '';

    // 입력값 유효성 검사
    const errors = validateSignInInput({ email, password });
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const supabase = createServerClient();
    const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });

    if (signInError || !authData.user) {
        return {
            success: false,
            message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

    // profile이 없을 때 profile.deleted_at을 읽으면 에러가 나서 ?.로 확인
    if (!profile || profile.deleted_at) {
        await supabase.auth.signOut(); // 로그아웃
        return {
            success: false,
            message: profile?.deleted_at
                ? '탈퇴한 회원입니다.'
                : '프로필이 존재하지 않습니다.',
        };
    }

    revalidatePath('/', 'layout'); // layout - 전체, page - 페이지

    return {
        success: true,
        message: '로그인 되었습니다.',
    };
}
