import {LoanRepository} from '../../../domain/repositories/LoanRepository';
import {AccountRepository} from '../../../domain/repositories/AccountRepository';
import {CreateNotificationUseCase} from '../notification/CreateNotificationUseCase';
import {NotificationType} from '@avenir/shared/enums/NotificationType';
import {AccountType} from '@avenir/shared/enums/AccountType';
import {ClientHasNoAccountError, LoanNotFoundError} from '@avenir/domain/errors';

export class DeliverLoanUseCase {
    constructor(
        private loanRepository: LoanRepository,
        private accountRepository: AccountRepository,
        private createNotificationUseCase: CreateNotificationUseCase
    ) {}

    async execute(loanId: string): Promise<void> {
        const loan = await this.loanRepository.getLoanById(loanId);
        if (!loan) {
            throw new LoanNotFoundError(loanId);
        }

        const accounts = await this.accountRepository.getByUserId(loan.clientId);
        if (accounts.length === 0) {
            throw new ClientHasNoAccountError();
        }

        const account = accounts.find(acc => acc.type === AccountType.CURRENT) || accounts[0];

        // Créditer le montant sur le compte du client
        const newBalance = account.balance + loan.amount;
        await this.accountRepository.updateBalance(account.id, newBalance);

        // Envoyer une notification au client
        await this.createNotificationUseCase.execute(
            loan.clientId,
            'Crédit versé',
            `Le montant de ${loan.amount.toFixed(2)}€ de votre crédit "${loan.name}" a été crédité sur votre compte.`,
            NotificationType.LOAN,
            'Système'
        );
    }
}
