import { WebSocket } from '@fastify/websocket';
import { WebSocket as WSWebSocket } from 'ws';

export interface WebSocketClient {
    userId: string;
    userRole: string;
    socket: WebSocket;
}

export interface ChatMessage {
    type: 'new_message' | 'message_read' | 'chat_assigned' | 'chat_transferred' | 'chat_closed' | 'user_typing';
    chatId: string;
    data: any;
}

export class WebSocketService {
    private clients: Map<string, WebSocketClient[]> = new Map();

    registerClient(userId: string, userRole: string, socket: WebSocket): void {
        const client: WebSocketClient = { userId, userRole, socket };

        if (!this.clients.has(userId)) {
            this.clients.set(userId, []);
        }

        this.clients.get(userId)!.push(client);

        console.log(`[WebSocket] Client connecté: ${userId} (${userRole})`);
        console.log(`[WebSocket] Total clients connectés: ${this.getConnectedClientsCount()}`);

        socket.on('close', () => {
            this.unregisterClient(userId, socket);
        });
    }

    private unregisterClient(userId: string, socket: WebSocket): void {
        const userClients = this.clients.get(userId);
        if (userClients) {
            const index = userClients.findIndex(c => c.socket === socket);
            if (index !== -1) {
                userClients.splice(index, 1);
            }
            if (userClients.length === 0) {
                this.clients.delete(userId);
            }
        }
        console.log(`[WebSocket] Client déconnecté: ${userId}`);
        console.log(`[WebSocket] Total clients connectés: ${this.getConnectedClientsCount()}`);
    }

    sendMessageToUser(userId: string, message: ChatMessage): void {
        const userClients = this.clients.get(userId);
        if (userClients) {
            const payload = JSON.stringify(message);
            console.log(`[WebSocket] Envoi du message`, message);
            userClients.forEach(client => {
                if (client.socket.readyState === WSWebSocket.OPEN) {
                    client.socket.send(payload);
                }
            });
        } else {
            console.log(`[WebSocket] Utilisateur non connecté, message non envoyé`);
        }
    }

    sendMessageToChatParticipants(participantIds: string[], message: ChatMessage): void {
        participantIds.forEach(userId => {
            this.sendMessageToUser(userId, message);
        });
    }

    sendToAllAdvisors(message: ChatMessage): void {
        this.clients.forEach((clients, userId) => {
            const isAdvisor = clients.some(c => c.userRole === 'ADVISOR');
            if (isAdvisor) {
                this.sendMessageToUser(userId, message);
            }
        });
    }

    notifyNewMessage(chatId: string, participantIds: string[], messageData: any): void {
        this.sendMessageToChatParticipants(participantIds, {
            type: 'new_message',
            chatId,
            data: messageData,
        });
    }

    // notifyMessageRead(chatId: string, participantIds: string[], messageId: string): void {
    //     this.sendMessageToChatParticipants(participantIds, {
    //         type: 'message_read',
    //         chatId,
    //         data: { messageId },
    //     });
    // }

    notifyChatAssigned(chatId: string, clientId: string, advisorId: string): void {
        this.sendMessageToChatParticipants([clientId, advisorId], {
            type: 'chat_assigned',
            chatId,
            data: { advisorId },
        });
    }

    notifyChatTransferred(chatId: string, participantIds: string[], newAdvisorId: string): void {
        this.sendMessageToChatParticipants(participantIds, {
            type: 'chat_transferred',
            chatId,
            data: { newAdvisorId },
        });
    }

    notifyChatClosed(chatId: string, participantIds: string[]): void {
        this.sendMessageToChatParticipants(participantIds, {
            type: 'chat_closed',
            chatId,
            data: { closedAt: new Date().toISOString() },
        });
    }

    // notifyUserTyping(chatId: string, participantIds: string[], userId: string, isTyping: boolean): void {
    //     console.log(`[WebSocket] notifyUserTyping - chatId: ${chatId}, userId: ${userId}, isTyping: ${isTyping}`);
    //     console.log(`[WebSocket] Participants:`, participantIds);
    //
    //     const otherParticipants = participantIds.filter(id => id !== userId);
    //     console.log(`[WebSocket] Autres participants (destinataires):`, otherParticipants);
    //
    //     this.sendMessageToChatParticipants(otherParticipants, {
    //         type: 'user_typing',
    //         chatId,
    //         data: { userId, isTyping },
    //     });
    // }

    getConnectedClientsCount(): number {
        let count = 0;
        this.clients.forEach(clients => {
            count += clients.length;
        });
        return count;
    }

    isUserConnected(userId: string): boolean {
        return this.clients.has(userId);
    }

    getConnectedClients(): string[] {
        return Array.from(this.clients.keys());
    }
}

export const webSocketService = new WebSocketService();



