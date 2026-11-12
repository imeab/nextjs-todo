'use server';
import { createServerClient } from "@/shared/lib/supabase";
import { type UserProfile } from "../types/auth.types";
import { cache } from "react";
import { connection } from "next/server";

type UserType = UserProfile | null;
export const getCurrentUser = cache(async (): Promise<UserType> => {
    // 로그인 정보는 요청마다 다르므로 미리 렌더링(prerender)하지 않고 요청 시점에 실행
    await connection();

    const supabase = createServerClient();

    const { data: { user: authUser}, error: authError } = await supabase.auth.getUser();

    if (authError|| !authUser) {
        return null;
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .is("deleted_at", null)
        .maybeSingle();

    if (!profile) {
        return null;
    }

    return {
        id: profile.id,
        name: profile.name,
        email: authUser.email,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        deletedAt: profile.deleted_at,
    }
});