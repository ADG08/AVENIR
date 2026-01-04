import {LoanRepository} from '../../../domain/repositories/LoanRepository';
import {AccountRepository} from '../../../domain/repositories/AccountRepository';
import {CreateNotificationUseCase} from '../notification/CreateNotificationUseCase';
import {NotificationType} from '@avenir/shared/enums/NotificationType';
import {AccountType} from '@avenir/shared/enums/AccountType';
import {Account} from '../../../domain/entities/Account';
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
        const updatedAccount = new Account(
            account.id,
            account.userId,
            account.iban,
            account.name,
            account.type,
            account.balance + loan.amount,
            account.currency,
            account.cardNumber,
            account.cardHolderName,
            account.cardExpiryDate,
            account.cardCvv,
            account.savingType,
            account.transactions,
            account.createdAt
        );

        await this.accountRepository.update(updatedAccount);

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
