import {ScheduledTask} from 'node-cron';
import cron from 'node-cron';
import { ProcessMonthlyPaymentsUseCase } from '@avenir/application/usecases/loan/ProcessMonthlyPaymentsUseCase';

export class LoanPaymentScheduler {
    private scheduledTask: ScheduledTask | null = null;

    constructor(private processMonthlyPaymentsUseCase: ProcessMonthlyPaymentsUseCase) {}

    start(): void {

        // MODE TEST (actuellement actif)
        // Exécution toutes les 2 minutes pour faciliter les tests
        this.scheduledTask = cron.schedule('*/2 * * * *', async () => {
            try {
                await this.processMonthlyPaymentsUseCase.execute();
            } catch {
                return null
            }
        }, {
            timezone: 'Europe/Paris'
        });

        // TODO : A faire après
        // Exécution le 1er de chaque mois à minuit
        // this.scheduledTask = cron.schedule('0 0 1 * *', async () => {
        //     try {
        //         await this.processMonthlyPaymentsUseCase.execute();
        //     } catch {
        //         return null
        //     }
        // }, {
        //     timezone: 'Europe/Paris'
        // });
    }

    stop(): void {
        if (this.scheduledTask) {
            this.scheduledTask.stop();
        }
    }
}
