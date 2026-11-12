// 페이지 데이터를 불러오는 동안 자동으로 보여지는 로딩 화면
export default function TodoLoading() {
    return (
        <div className="flex flex-col gap-2" aria-busy="true">
            <p className="text-sm text-zinc-500">불러오는 중...</p>
            {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 animate-pulse rounded-xl bg-zinc-100" />
            ))}
        </div>
    );
}
