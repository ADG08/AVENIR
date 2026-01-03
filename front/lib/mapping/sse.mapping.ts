import type { SSELoanCreatedPayload, SSENewsCreatedPayload, SSENotificationCreatedPayload } from '@/contexts/SSEContext';
import type { LoanApiResponse } from '@/lib/api/loan.api';
import type { News } from '@/types/news';
import type { Notification } from '@/types/notification';
import { NotificationType } from '@avenir/shared/enums';

export function mapSSELoanToLoanApiResponse(data: SSELoanCreatedPayload): LoanApiResponse {
  return {
    id: data.id,
    name: data.name,
    advisorId: data.advisorId,
    clientId: data.clientId,
    amount: data.amount,
    duration: data.duration,
    annualInterestRate: data.annualInterestRate,
    insuranceRate: data.insuranceRate,
    monthlyPayment: data.monthlyPayment,
    totalCost: data.totalCost,
    totalInterest: data.totalInterest,
    insuranceCost: data.insuranceCost,
    remainingPayment: data.totalCost - data.paidAmount,
    paidAmount: data.paidAmount,
    progressPercentage: (data.paidAmount / data.totalCost) * 100,
    monthsPaid: Math.floor(data.paidAmount / data.monthlyPayment),
    status: data.status,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export function mapSSENewsToNews(data: SSENewsCreatedPayload): News {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    authorId: data.authorId,
    authorName: data.authorName,
    createdAt: new Date(data.createdAt),
  };
}

export function mapSSENotificationToNotification(data: SSENotificationCreatedPayload): Notification {
  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.type as NotificationType,
    advisorName: data.advisorName ?? undefined,
    read: data.isRead,
    createdAt: new Date(data.createdAt),
    newsId: data.newsId ?? undefined,
  };
}
