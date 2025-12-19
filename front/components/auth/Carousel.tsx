'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CarouselSlide = {
    image: string;
    quote: string;
    author: string;
    authorTitle: string;
};

type CarouselProps = {
    slides: CarouselSlide[];
    className?: string;
};

export const Carousel = ({ slides, className }: CarouselProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handlePrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    return (
        <div className={cn("relative h-full w-full p-3", className)}>
            <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-3xl bg-slate-900">
                <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].author}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/60 to-transparent" />

                <div className="relative z-10 space-y-6 p-12">
                    <blockquote className="text-white">
                        <p className="text-lg font-light italic leading-relaxed">
                            "{slides[currentSlide].quote}"
                        </p>
                        <footer className="mt-4">
                            <cite className="not-italic">
                                <div className="text-sm font-medium">-{slides[currentSlide].author}</div>
                                <div className="text-xs text-gray-400">{slides[currentSlide].authorTitle}</div>
                            </cite>
                        </footer>
                    </blockquote>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handlePrevious}
                                onKeyDown={(e) => handleKeyDown(e, handlePrevious)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-label="Previous slide"
                                tabIndex={0}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                onKeyDown={(e) => handleKeyDown(e, handleNext)}
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
                                aria-label="Next slide"
                                tabIndex={0}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentSlide(index)}
                                    onKeyDown={(e) => handleKeyDown(e, () => setCurrentSlide(index))}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900",
                                        currentSlide === index
                                            ? "w-8 bg-white"
                                            : "bg-white/50 hover:bg-white/75"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                    tabIndex={0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
