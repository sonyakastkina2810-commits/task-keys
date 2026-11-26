import React, { useEffect, useState } from 'react';

export interface IItem {
    id: number;
    name: string;
}

interface IProps {
    sorting: 'ASC' | 'DESC';
    initialData: IItem[];
}

interface IRowProps {
    item: IItem;
    onSave: (id: number, name: string) => void;
}

function Row({ item, onSave }: IRowProps) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(item.name);

    if (!editing) {
        return (
            <li
                onClick={() => {
                    setValue(item.name);
                    setEditing(true);
                }}
            >
                {item.name}
            </li>
        );
    }

    return (
        <li>
            <input
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onSave(item.id, value);
                        setEditing(false);
                    } else if (e.key === 'Escape') {
                        setValue(item.name);
                        setEditing(false);
                    }
                }}
            />
        </li>
    );
}

export function Keys({ sorting, initialData }: IProps) {
    const [items, setItems] = useState<IItem[]>(initialData);

    useEffect(() => {
        setItems(initialData);
    }, [initialData]);

    const sorted = [...items].sort((a, b) =>
        sorting === 'ASC' ? a.id - b.id : b.id - a.id
    );

    const handleSave = (id: number, name: string) => {
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, name } : item))
        );
    };

    return (
        <ul>
            {sorted.map((item) => (
                <Row key={item.id} item={item} onSave={handleSave} />
            ))}
        </ul>
    );
}

export default Keys;