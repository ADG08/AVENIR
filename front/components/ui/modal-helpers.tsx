'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type AnimatedFormSectionProps = {
    children: ReactNode;
    delay?: number;
};

export const AnimatedFormSection = ({ children, delay = 0.1 }: AnimatedFormSectionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
    >
        {children}
    </motion.div>
);

type ModalButtonProps = {
    type?: 'button' | 'submit';
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger';
    children: ReactNode;
};

export const ModalButton = ({
    type = 'button',
    onClick,
    disabled = false,
    variant = 'secondary',
    children
}: ModalButtonProps) => {
    const baseClasses = 'cursor-pointer rounded-full px-6 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50';

    const variantClasses = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const scaleHover = variant === 'secondary' ? 1.02 : 1.05;
    const scaleTap = variant === 'secondary' ? 0.98 : 0.95;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : scaleHover }}
            whileTap={{ scale: disabled ? 1 : scaleTap }}
            className={`${baseClasses} ${variantClasses[variant]}`}
        >
            {children}
        </motion.button>
    );
};
