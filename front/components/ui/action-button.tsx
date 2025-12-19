'use client';

import { LucideIcon } from 'lucide-react';

type ActionButtonProps = {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
};

export const ActionButton = ({ icon: Icon, label, onClick }: ActionButtonProps) => {
    return (
        <button
            onClick={onClick}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-3 transition-all hover:bg-gray-50"
        >
            <Icon className="h-5 w-5 text-gray-700" />
            <span className="text-base font-medium text-gray-900">{label}</span>
        </button>
    );
};
