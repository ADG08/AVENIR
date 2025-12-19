'use client';

import { ReactNode } from 'react';
import { Carousel, type CarouselSlide } from './Carousel';
import { cn } from '@/lib/utils';

type AuthLayoutProps = {
    children: ReactNode;
    slides: CarouselSlide[];
    className?: string;
};

export const AuthLayout = ({ children, slides, className }: AuthLayoutProps) => {
    return (
        <div className={cn("flex min-h-screen overflow-x-hidden", className)}>
            <div className="hidden w-1/2 lg:block">
                <Carousel slides={slides} />
            </div>

            <div className="flex w-full items-center justify-center bg-gray-50 px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md px-4">
                    {children}
                </div>
            </div>
        </div>
    );
};
