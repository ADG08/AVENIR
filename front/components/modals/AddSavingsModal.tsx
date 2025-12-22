'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedFormSection, ModalButton } from '@/components/ui/modal-helpers';
import { useLanguage } from '@/hooks/use-language';

type AddSavingsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const SAVINGS_TYPES = [
    { value: 'livret-a', labelKey: 'dashboard.savingsTypes.livretA' as const },
    { value: 'livret-jeune', labelKey: 'dashboard.savingsTypes.livretJeune' as const },
    { value: 'ldds', labelKey: 'dashboard.savingsTypes.ldds' as const },
    { value: 'pel', labelKey: 'dashboard.savingsTypes.pel' as const },
    { value: 'cel', labelKey: 'dashboard.savingsTypes.cel' as const },
    { value: 'lep', labelKey: 'dashboard.savingsTypes.lep' as const },
] as const;

const addSavingsSchema = z.object({
    savingsType: z.string().min(1, 'Le type de compte d\'épargne est requis'),
});

type AddSavingsFormData = z.infer<typeof addSavingsSchema>;

export const AddSavingsModal = ({ open, onOpenChange }: AddSavingsModalProps) => {
    const { t } = useLanguage();

    const form = useForm<AddSavingsFormData>({
        resolver: zodResolver(addSavingsSchema),
        defaultValues: {
            savingsType: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset();
        }
    }, [open, form]);

    const handleSubmit = async (data: AddSavingsFormData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        form.reset();
        onOpenChange(false);
    };

    const handleCancel = () => {
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('dashboard.addSavingsModal.title')}</DialogTitle>
                    <DialogDescription>{t('dashboard.addSavingsModal.description')}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <AnimatedFormSection delay={0.1}>
                            <div className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="savingsType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('dashboard.addSavingsModal.savingsType')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={form.formState.isSubmitting}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder={t('dashboard.addSavingsModal.savingsTypePlaceholder')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {SAVINGS_TYPES.map((type) => (
                                                        <SelectItem key={type.value} value={type.value}>
                                                            {t(type.labelKey)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </AnimatedFormSection>

                        <AnimatedFormSection delay={0.15}>
                            <DialogFooter>
                                <ModalButton onClick={handleCancel} disabled={form.formState.isSubmitting}>
                                    {t('common.cancel')}
                                </ModalButton>
                                <ModalButton
                                    type="submit"
                                    variant="primary"
                                    disabled={form.formState.isSubmitting || !form.formState.isValid}
                                >
                                    {form.formState.isSubmitting ? t('common.loading') : t('common.create')}
                                </ModalButton>
                            </DialogFooter>
                        </AnimatedFormSection>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
