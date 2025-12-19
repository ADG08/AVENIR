'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wifi, RotateCw, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

type CreditCardProps = {
    cardNumber: string;
    expiryDate?: string;
    cardType?: string;
    className?: string;
    firstName?: string;
    lastName?: string;
    accountName?: string;
    cvv?: string;
    onEditAccountName?: () => void;
};

export const CreditCard = ({
    cardNumber,
    expiryDate = '09/28',
    cardType = 'VISA',
    className,
    firstName = 'John',
    lastName = 'Doe',
    accountName = 'Compte Principal',
    cvv = '123',
    onEditAccountName
}: CreditCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const isMastercard = cardType === 'Mastercard';
    const cardBackground = isMastercard
        ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'
        : 'linear-gradient(135deg, #e8e9f3 0%, #d8d9e8 100%)';
    const textColor = isMastercard ? 'text-white' : 'text-[#1a1f71]';
    const iconColor = isMastercard ? 'text-white/80' : 'text-gray-600';
    const numberColor = isMastercard ? 'text-white' : 'text-gray-900';
    const expiryBgColor = isMastercard ? 'rgba(255, 255, 255, 0.2)' : '#eef1f7';
    const expiryTextColor = isMastercard ? 'text-white' : 'text-gray-900';

    const maskedNumber = cardNumber.replace(/\*/g, '').padStart(16, '*');
    const formattedMaskedNumber = maskedNumber.replace(/(.{4})/g, '$1 ').trim();

    const handleFlip = () => setIsFlipped(!isFlipped);

    return (
        <div className="relative h-[210px] w-full" style={{ perspective: '1000px' }}>
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn('absolute inset-0 overflow-hidden rounded-2xl p-6', className)}
                    style={{
                        background: cardBackground,
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <button
                        onClick={handleFlip}
                        className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/10 p-2 transition-colors hover:bg-black/20"
                        aria-label="Flip card"
                    >
                        <RotateCw className={cn('h-4 w-4', textColor)} />
                    </button>

                    <div className="mb-12 flex items-start justify-between">
                        <div className={cn('text-3xl font-black', isMastercard ? 'font-bold' : 'italic', textColor)}>
                            {cardType}
                        </div>
                        <Wifi className={cn('h-6 w-6 rotate-90', iconColor)} />
                    </div>

                    <div className="mb-2">
                        <Image src="/chip.png" alt="EMV Chip" width={45} height={34} />
                    </div>

                    <div className="flex items-end justify-between">
                        <p className={cn('text-2xl font-bold tracking-wider', numberColor)}>{cardNumber}</p>
                        <div className="rounded-full px-3 py-1.5" style={{ backgroundColor: expiryBgColor }}>
                            <p className={cn('text-base font-semibold', expiryTextColor)}>{expiryDate}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className={cn('absolute inset-0 overflow-hidden rounded-2xl p-6', className)}
                    style={{
                        background: cardBackground,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <button
                        onClick={handleFlip}
                        className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/10 p-2 transition-colors hover:bg-black/20"
                        aria-label="Flip card"
                    >
                        <RotateCw className={cn('h-4 w-4', textColor)} />
                    </button>

                    <div className="h-8 w-full bg-black/40 absolute left-0 top-10" />

                    <div className="mt-14 space-y-3">
                        <div>
                            <p className={cn('text-[10px] font-medium uppercase tracking-wide opacity-70 mb-1', textColor)}>
                                Numéro de carte
                            </p>
                            <p className={cn('text-base font-mono tracking-wider', numberColor)}>
                                {formattedMaskedNumber}
                            </p>
                        </div>

                        <div>
                            <p className={cn('text-[10px] font-medium uppercase tracking-wide opacity-70 mb-1', textColor)}>
                                Titulaire
                            </p>
                            <p className={cn('text-sm font-semibold uppercase', numberColor)}>
                                {firstName} {lastName}
                            </p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <p className={cn('text-[10px] opacity-70', textColor)}>
                                    {accountName}
                                </p>
                                {onEditAccountName && (
                                    <button
                                        onClick={onEditAccountName}
                                        className="rounded p-0.5 transition-colors hover:bg-black/10"
                                        aria-label="Edit account name"
                                    >
                                        <Pencil className={cn('h-3 w-3 opacity-70', textColor)} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-6 flex gap-4">
                        <div>
                            <p className={cn('text-[10px] font-medium uppercase tracking-wide opacity-70 mb-1', textColor)}>
                                Expire
                            </p>
                            <p className={cn('text-sm font-semibold', numberColor)}>
                                {expiryDate}
                            </p>
                        </div>
                        <div>
                            <p className={cn('text-[10px] font-medium uppercase tracking-wide opacity-70 mb-1', textColor)}>
                                CVV
                            </p>
                            <p className={cn('text-sm font-semibold', numberColor)}>
                                {cvv}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
