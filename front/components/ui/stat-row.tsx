'use client';

import { LucideIcon } from 'lucide-react';

type StatRowProps = {
    icon: LucideIcon;
    label: string;
    amount: string;
};

export const StatRow = ({ icon: Icon, label, amount }: StatRowProps) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border">
                <Icon className="h-5 w-5 text-gray-600" />
            </div>
            <span className="flex-1 text-base font-medium text-gray-700">{label}</span>
            <span className="text-lg font-semibold financial-amount text-gray-900">{amount}</span>
        </div>
    );
};
