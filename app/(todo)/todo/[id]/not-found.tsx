import Link from 'next/link';

export default function TodoNotFound() {
    return (
        <div className="rounded-xl border border-dashed p-10 text-center text-zinc-500">
            <p className="mb-3">할일을 찾을 수 없습니다.</p>
            <Link href="/" className="text-blue-600 underline">
                목록으로 돌아가기
            </Link>
        </div>
    );
}
