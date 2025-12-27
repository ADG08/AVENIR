import {
  createChatSchema,
  sendMessageSchema,
  getChatByIdSchema,
  transferChatSchema,
  closeChatSchema,
  markMessageAsReadSchema,
} from '@avenir/shared/schemas/chat.schema';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SendMessageDto {
  chatId: string;
  content: string;
}

export interface CreateChatDto {
  initialMessage: string;
}

export interface CloseChatDto {
  chatId: string;
}

export interface TransferChatDto {
  chatId: string;
  newAdvisorId: string;
}

export interface AssignAdvisorDto {
  chatId: string;
  advisorId: string;
}

export interface MarkMessageAsReadDto {
  messageId: string;
}

export const chatApi = {
  async getChats() {
    const response = await fetch(
      `${API_BASE_URL}/api/chats`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  },

  async getChatById(chatId: string) {
    const validatedData = getChatByIdSchema.parse({ chatId });
    const response = await fetch(
      `${API_BASE_URL}/api/chats/${validatedData.chatId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch chat: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async getChatMessages(chatId: string) {
    const validatedData = getChatByIdSchema.parse({ chatId });
    const response = await fetch(
      `${API_BASE_URL}/api/chats/${validatedData.chatId}/messages`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  async sendMessage(data: SendMessageDto) {
    const validatedData = sendMessageSchema.parse(data);
    const response = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  },

  async createChat(data: CreateChatDto) {
    const validatedData = createChatSchema.parse(data);
    const response = await fetch(`${API_BASE_URL}/api/chats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  },

  async closeChat(data: CloseChatDto) {
    const validatedData = closeChatSchema.parse({ chatId: data.chatId });
    const response = await fetch(`${API_BASE_URL}/api/chats/${validatedData.chatId}/close`, {
      method: 'PUT',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to close chat');
    }

    return response.json();
  },

  async transferChat(data: TransferChatDto) {
    const validatedData = transferChatSchema.parse({
      chatId: data.chatId,
      newAdvisorId: data.newAdvisorId,
    });
    const response = await fetch(`${API_BASE_URL}/api/chats/${validatedData.chatId}/transfer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        newAdvisorId: validatedData.newAdvisorId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to transfer chat');
    }

    return response.json();
  },

  async assignAdvisor(data: AssignAdvisorDto) {
    const response = await fetch(`${API_BASE_URL}/api/chats/${data.chatId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ advisorId: data.advisorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign advisor');
    }

    return response.json();
  },

  async markMessageAsRead(data: MarkMessageAsReadDto) {
    const validatedData = markMessageAsReadSchema.parse(data);
    const response = await fetch(`${API_BASE_URL}/api/messages/${validatedData.messageId}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }

    return response.json();
  },
};
