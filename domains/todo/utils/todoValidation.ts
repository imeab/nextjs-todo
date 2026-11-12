import type { AddTodoInput, ChangeTodoInput } from '../types/todo.types';

export function validateTodoInput(
    input: AddTodoInput | ChangeTodoInput,
): Record<string, string> {
    const errors: Record<string, string> = {};

    if ('id' in input && (!input.id || !input.id.trim())) {
        errors.id = '유효하지 않은 식별자입니다.';
    }
    
    if (!input.title || !input.title.trim()) {
        errors.title = '할일 제목을 입력해 주세요.';
    }

    // 에디터는 빈 내용도 <p></p>로 보내서, 태그를 뺀 글자만으로 검사
    const plainContent = (input.content ?? '').replace(/<[^>]*>/g, '').trim();
    if (!plainContent) {
        errors.content = '할일 내용을 입력해 주세요.';
    }

    return errors;
}
