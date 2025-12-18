import { Chat, Message, User, UserState } from '@/types/chat';
import { ChatStatus, UserRole } from '@/types/enums';

/**
 * DTO reçu de l'API pour un chat
 */
export interface ChatApiDto {
  id: string;
  clientId: string;
  clientName?: string;
  advisorId: string | null;
  advisorName?: string | null;
  status: ChatStatus;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO reçu de l'API pour un message
 */
export interface MessageApiDto {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  senderRole?: UserRole;
  content: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * DTO reçu de l'API pour un utilisateur
 */
export interface UserApiDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  role: UserRole;
  state: UserState;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mapper pour transformer un ChatApiDto en Chat
 */
export const mapChatFromApi = (apiChat: ChatApiDto): Chat => {
  return {
    id: apiChat.id,
    clientId: apiChat.clientId,
    advisorId: apiChat.advisorId,
    status: apiChat.status,
    lastMessage: apiChat.lastMessage && apiChat.lastMessageAt ? {
      id: '',
      chatId: apiChat.id,
      senderId: apiChat.clientId,
      content: apiChat.lastMessage,
      createdAt: new Date(apiChat.lastMessageAt),
      isRead: true,
    } : undefined,
    unreadCount: apiChat.unreadCount || 0,
    createdAt: new Date(apiChat.createdAt),
    updatedAt: new Date(apiChat.updatedAt),
  };
};

/**
 * Mapper pour transformer un tableau de ChatApiDto en tableau de Chat
 */
export const mapChatsFromApi = (apiChats: ChatApiDto[]): Chat[] => {
  return apiChats.map(mapChatFromApi);
};

/**
 * Mapper pour transformer un MessageApiDto en Message
 */
export const mapMessageFromApi = (apiMessage: MessageApiDto): Message => {
  // Extraire le prénom et nom du senderName
  const [firstName = '', lastName = ''] = (apiMessage.senderName || '').split(' ');

  return {
    id: apiMessage.id,
    chatId: apiMessage.chatId,
    senderId: apiMessage.senderId,
    sender: apiMessage.senderName && apiMessage.senderRole ? {
      id: apiMessage.senderId,
      firstName,
      lastName,
      email: '',
      identityNumber: '',
      role: apiMessage.senderRole,
      state: UserState.ACTIVE, // Par défaut
      createdAt: new Date(),
      updatedAt: new Date(),
    } : undefined,
    content: apiMessage.content,
    isRead: apiMessage.isRead,
    createdAt: new Date(apiMessage.createdAt),
  };
};

/**
 * Mapper pour transformer un tableau de MessageApiDto en tableau de Message
 */
export const mapMessagesFromApi = (apiMessages: MessageApiDto[]): Message[] => {
  return apiMessages.map(mapMessageFromApi);
};

/**
 * Mapper pour transformer un UserApiDto en User
 */
export const mapUserFromApi = (apiUser: UserApiDto): User => {
  return {
    id: apiUser.id,
    firstName: apiUser.firstName,
    lastName: apiUser.lastName,
    email: apiUser.email,
    identityNumber: apiUser.identityNumber,
    role: apiUser.role,
    state: apiUser.state,
    createdAt: new Date(apiUser.createdAt),
    updatedAt: new Date(apiUser.updatedAt),
  };
};

/**
 * Mapper pour transformer un tableau de UserApiDto en tableau de User
 */
export const mapUsersFromApi = (apiUsers: UserApiDto[]): User[] => {
  return apiUsers.map(mapUserFromApi);
};
