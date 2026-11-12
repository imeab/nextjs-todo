'use client';
import { ChangeEvent, useState } from "react";

type ElementType = HTMLInputElement | HTMLSelectElement

export default function useFormState<T>(initialState: T) {
    const [form, setForm] = useState(initialState);

    const onChange = (e: ChangeEvent<ElementType>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    // as const: [폼값, 핸들러] 순서와 타입을 그대로 유지 (없으면 둘이 섞인 배열 타입이 됨)
    return [form, onChange] as const;
}