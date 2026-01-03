// Types partagés pour le système de chat
import { UserRole, UserState, ChatStatus, MessageType } from './enums';
export { UserRole, UserState, ChatStatus, MessageType };

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identityNumber: string;
  role: UserRole;
  state: UserState;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  sender?: User;
  content: string;
  isRead: boolean;
  type: MessageType;
  createdAt: Date;
}

export interface Chat {
  id: string;
  clientId: string;
  client?: User;
  isMyClient: boolean;
  advisorId: string | null;
  advisor?: User | null;
  status: ChatStatus;
  messages?: Message[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
