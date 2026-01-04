import {ScheduledTask} from 'node-cron';
import cron from 'node-cron';
import { ProcessMonthlyPaymentsUseCase } from '@avenir/application/usecases/loan/ProcessMonthlyPaymentsUseCase';

export class LoanPaymentScheduler {
    private scheduledTask: ScheduledTask | null = null;

    constructor(private processMonthlyPaymentsUseCase: ProcessMonthlyPaymentsUseCase) {}

    start(): void {
        // Exécution le 1er de chaque mois à 10h00
        this.scheduledTask = cron.schedule('0 10 1 * *', async () => {
            try {
                await this.processMonthlyPaymentsUseCase.execute();
            } catch {
                return null;
            }
        }, {
            timezone: 'Europe/Paris'
        });
    }

    stop(): void {
        if (this.scheduledTask) {
            this.scheduledTask.stop();
        }
    }
}
