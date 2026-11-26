import React, { useState, useEffect, useRef, useMemo } from 'react';

export interface IItem {
    id: number;
    name: string;
}

interface KeysProps {
    sorting: 'ASC' | 'DESC';
    initialData: IItem[];
}

export const Keys: React.FC<KeysProps> = ({ sorting, initialData }) => {
    const [data, setData] = useState<IItem[]>(() => [...initialData]);

    const [editingId, setEditingId] = useState<number | null>(null);

    const [draft, setDraft] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setData([...initialData]);
    }, [initialData]);

    // Фокус на input при входе в режим редактирования
    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
            const len = inputRef.current.value.length;
            inputRef.current.setSelectionRange(len, len);
        }
    }, [editingId]);

    const sortedData = useMemo(() => {
        const copy = [...data];
        copy.sort((a, b) => {
            if (sorting === 'ASC') {
                return a.id - b.id;
            }
            return b.id - a.id;
        });
        return copy;
    }, [data, sorting]);

    const startEdit = (item: IItem) => {
        setEditingId(item.id);
        setDraft(item.name);
    };

    const saveEdit = () => {
        if (editingId === null) return;

        setData((prev) =>
            prev.map((item) =>
                item.id === editingId ? { ...item, name: draft } : item
            )
        );
        setEditingId(null);
        setDraft('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setDraft('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    };

    return (
        <ul>
            {sortedData.map((item) => (
                <li key={item.id}>
                    {editingId === item.id ? (
                        <input
                            ref={inputRef}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleKeyDown}
                            // Чтобы клик по input не всплывал и не сбрасывал редактирование
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span
                            onClick={() => startEdit(item)}
                            style={{ cursor: 'pointer' }}
                        >
              {item.name}
            </span>
                    )}
                </li>
            ))}
        </ul>
    );
};

export default Keys;