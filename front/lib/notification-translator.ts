import { TFunction } from 'i18next';

interface NotificationPattern {
  titlePattern: RegExp;
  messagePattern: RegExp;
  titleKey: string;
  messageKey: string;
  extractParams: (message: string) => Record<string, string | undefined>;
}

// Patterns pour identifier et extraire les paramètres des notifications système
const NOTIFICATION_PATTERNS: NotificationPattern[] = [
  // Nouveau crédit accordé
  {
    titlePattern: /^Nouveau crédit accordé$/,
    messagePattern: /^Votre conseiller (.+?) vous a accordé un nouveau crédit "(.+?)" de ([\d.]+)€\.$/,
    titleKey: 'notifications.loan.newLoanCreated',
    messageKey: 'notifications.loan.newLoanCreatedMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Votre conseiller (.+?) vous a accordé un nouveau crédit "(.+?)" de ([\d.]+)€\.$/);
      return match ? { advisorName: match[1], loanName: match[2], amount: match[3] } : {};
    }
  },

  // Crédit versé
  {
    titlePattern: /^Crédit versé$/,
    messagePattern: /^Le montant de ([\d.]+)€ de votre crédit "(.+?)" a été crédité sur votre compte\.$/,
    titleKey: 'notifications.loan.delivered',
    messageKey: 'notifications.loan.deliveredMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Le montant de ([\d.]+)€ de votre crédit "(.+?)" a été crédité sur votre compte\.$/);
      return match ? { amount: match[1], loanName: match[2] } : {};
    }
  },

  // Mensualité prélevée
  {
    titlePattern: /^Mensualité prélevée$/,
    messagePattern: /^La mensualité de ([\d.]+)€ pour votre crédit "(.+?)" a été prélevée\. Reste à payer : ([\d.]+)€$/,
    titleKey: 'notifications.loan.paymentCollected',
    messageKey: 'notifications.loan.paymentCollectedMessage',
    extractParams: (message: string) => {
      const match = message.match(/^La mensualité de ([\d.]+)€ pour votre crédit "(.+?)" a été prélevée\. Reste à payer : ([\d.]+)€$/);
      return match ? { amount: match[1], loanName: match[2], remaining: match[3] } : {};
    }
  },

  // Paiement rattrapé
  {
    titlePattern: /^Paiement rattrapé$/,
    messagePattern: /^Le paiement de ([\d.]+)€ pour votre crédit "(.+?)" a été effectué avec succès\. Votre crédit est de nouveau actif\. Reste à payer : ([\d.]+)€$/,
    titleKey: 'notifications.loan.paymentRecovered',
    messageKey: 'notifications.loan.paymentRecoveredMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Le paiement de ([\d.]+)€ pour votre crédit "(.+?)" a été effectué avec succès\. Votre crédit est de nouveau actif\. Reste à payer : ([\d.]+)€$/);
      return match ? { amount: match[1], loanName: match[2], remaining: match[3] } : {};
    }
  },

  // Échéance impayée
  {
    titlePattern: /^Échéance impayée$/,
    messagePattern: /^Le prélèvement de ([\d.]+)€ pour votre crédit "(.+?)" n'a pas pu être effectué/,
    titleKey: 'notifications.loan.paymentFailed',
    messageKey: 'notifications.loan.paymentFailedMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Le prélèvement de ([\d.]+)€ pour votre crédit "(.+?)"/);
      return match ? { amount: match[1], loanName: match[2] } : {};
    }
  },

  // Traitement manuel lancé
  {
    titlePattern: /^Traitement manuel lancé$/,
    messagePattern: /^Votre conseiller (.+?) a lancé un traitement manuel pour votre crédit "(.+?)"\.$/,
    titleKey: 'notifications.loan.manualProcessing',
    messageKey: 'notifications.loan.manualProcessingMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Votre conseiller (.+?) a lancé un traitement manuel pour votre crédit "(.+?)"\.$/);
      return match ? { advisorName: match[1], loanName: match[2] } : {};
    }
  },

  // Crédit remboursé
  {
    titlePattern: /^Crédit remboursé$/,
    messagePattern: /^Félicitations ! Votre crédit "(.+?)" est entièrement remboursé\.$/,
    titleKey: 'notifications.loan.completed',
    messageKey: 'notifications.loan.completedMessage',
    extractParams: (message: string) => {
      const match = message.match(/^Félicitations ! Votre crédit "(.+?)" est entièrement remboursé\.$/);
      return match ? { loanName: match[1] } : {};
    }
  }
];

/**
 * Traduit une notification système du français vers la langue courante
 * @param title Titre de la notification en français
 * @param message Message de la notification en français
 * @param t Fonction de traduction i18next
 * @returns Notification traduite ou notification originale si aucun pattern ne correspond
 */
export function translateNotification(
  title: string,
  message: string,
  t: TFunction
): { title: string; message: string } {
  for (const pattern of NOTIFICATION_PATTERNS) {
    if (pattern.titlePattern.test(title) && pattern.messagePattern.test(message)) {
      const params = pattern.extractParams(message);

      // Traduire
      return {
        title: (t as any)(pattern.titleKey),
        message: (t as any)(pattern.messageKey, params)
      };
    }
  }

  // Si aucun pattern ne correspond, retourner la notification originale
  return { title, message };
}

