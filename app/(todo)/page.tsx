import TodoDashBoard from '@/domains/todo/components/TodoDashBoard';
import { isTodoStatus } from '@/domains/todo/utils/todoStatus';

// 주소의 ?status=READY 같은 값을 읽어서 대시보드에 전달
export default async function TodoPage({ searchParams }: PageProps<'/'>) {
    const { status } = await searchParams;

    return <TodoDashBoard status={isTodoStatus(status) ? status : undefined} />;
}
