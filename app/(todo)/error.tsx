'use client';

import { Button } from '@/shared/components/ui/button';

// 페이지에서 에러가 나면 자동으로 보여지는 오류 화면 (클라이언트 컴포넌트여야 함)
export default function TodoError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-2 font-bold text-red-600">문제가 발생했습니다.</p>
            <p className="mb-4 text-sm text-red-500">{error.message}</p>
            <Button variant="outline" onClick={() => reset()}>
                다시 시도
            </Button>
        </div>
    );
}
