import { randomUUID } from 'crypto';
import { Loan } from '@avenir/domain/entities/Loan';
import { LoanRepository } from '@avenir/domain/repositories/LoanRepository';
import { UserRepository } from '@avenir/domain/repositories/UserRepository';
import { NotificationRepository } from '@avenir/domain/repositories/NotificationRepository';
import { CreateLoanRequest } from '../../requests/CreateLoanRequest';
import { LoanResponse } from '../../responses/LoanResponse';
import { UserNotFoundError } from '@avenir/domain/errors';
import { UserRole, NotificationType, LoanStatus } from '@avenir/shared/enums';
import { Notification } from '@avenir/domain/entities/Notification';
import { NotificationResponse } from '../../responses/NotificationResponse';
import { webSocketService } from '@avenir/infrastructure/adapters/services/WebSocketService';
import { LoanCalculationService } from '@avenir/domain/services/LoanCalculationService';

export class CreateLoanUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(request: CreateLoanRequest): Promise<LoanResponse> {
    const advisor = await this.userRepository.getById(request.advisorId);
    if (!advisor || advisor.role !== UserRole.ADVISOR) {
      throw new UserNotFoundError(request.advisorId);
    }

    const client = await this.userRepository.getById(request.clientId);
    if (!client || client.role !== UserRole.CLIENT) {
      throw new UserNotFoundError(request.clientId);
    }

    const calculation = LoanCalculationService.calculateLoan(
      request.amount,
      request.duration,
      request.interestRate,
      request.insuranceRate,
    );

    const now = new Date();
    const paidAmount = 0;

    const loan = new Loan(
      randomUUID(),
      request.name,
      request.advisorId,
      request.clientId,
      calculation.amount,
      calculation.duration,
      calculation.annualInterestRate,
      calculation.insuranceRate,
      calculation.monthlyPayment,
      calculation.totalCost,
      calculation.totalInterest,
      calculation.insuranceCost,
      paidAmount,
      LoanStatus.ACTIVE,
      now,
      now,
    );

    const createdLoan = await this.loanRepository.createLoan(loan);

    // Créer une notification pour le client
    const advisorName = `${advisor.firstName} ${advisor.lastName}`;
    const notification = new Notification(
      randomUUID(),
      client.id,
      'Nouveau crédit octroyé',
      `Le crédit "${request.name}" vous a été octroyé. Mensualité : ${calculation.monthlyPayment}€`,
      NotificationType.LOAN,
      advisorName,
      false,
      now,
      null,
    );

    const createdNotification = await this.notificationRepository.addNotification(notification);

    const notificationResponse = NotificationResponse.fromNotification(createdNotification);
    webSocketService.notifyNotificationCreated(client.id, notificationResponse.toWebSocketPayload());

    // Envoyer un événement loan_created au client pour mise à jour en temps réel
    const loanResponse = LoanResponse.fromLoan(createdLoan);
    webSocketService.notifyLoanCreated(client.id, loanResponse);

    return loanResponse;
  }
}
