'use client';

import { cn } from '@/lib/utils';

type FilterToggleButtonProps = {
    value: string;
    isActive: boolean;
    onClick: () => void;
    label?: string;
};

export const FilterToggleButton = ({ value, isActive, onClick, label }: FilterToggleButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                'cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors',
                isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
        >
            {label || value}
        </button>
    );
};
