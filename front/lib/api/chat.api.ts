// Service API pour les chats
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface SendMessageDto {
  chatId: string;
  senderId: string;
  content: string;
}

export interface CreateChatDto {
  clientId: string;
  initialMessage: string;
}

export interface GetChatsParams {
  userId: string;
  userRole: string;
}

export interface CloseChatDto {
  chatId: string;
  userId: string;
}

export interface TransferChatDto {
  chatId: string;
  newAdvisorId: string;
  currentUserId: string;
}

export interface AssignAdvisorDto {
  chatId: string;
  advisorId: string;
}

export const chatApi = {
  async getChats(params: GetChatsParams) {
    const response = await fetch(
      `${API_BASE_URL}/chats?userId=${params.userId}&userRole=${params.userRole}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  },

  async getChatMessages(chatId: string, userId: string) {
    const response = await fetch(
      `${API_BASE_URL}/chats/${chatId}/messages?userId=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  },

  async sendMessage(data: SendMessageDto) {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return response.json();
  },

  async createChat(data: CreateChatDto) {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  },

  async closeChat(data: CloseChatDto) {
    const response = await fetch(`${API_BASE_URL}/chats/${data.chatId}/close`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: data.userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to close chat');
    }

    return response.json();
  },

  async transferChat(data: TransferChatDto) {
    const response = await fetch(`${API_BASE_URL}/chats/${data.chatId}/transfer`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newAdvisorId: data.newAdvisorId,
        currentUserId: data.currentUserId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to transfer chat');
    }

    return response.json();
  },

  async assignAdvisor(data: AssignAdvisorDto) {
    const response = await fetch(`${API_BASE_URL}/chats/${data.chatId}/assign`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ advisorId: data.advisorId }),
    });

    if (!response.ok) {
      throw new Error('Failed to assign advisor');
    }

    return response.json();
  },

  async markMessageAsRead(messageId: string) {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }

    return response.json();
  },
};
