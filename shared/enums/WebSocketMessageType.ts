export enum WebSocketMessageType {
    CONNECTED = 'connected',
    NEW_MESSAGE = 'new_message',
    MESSAGE_READ = 'message_read',
    CHAT_CREATED = 'chat_created',
    CHAT_ASSIGNED = 'chat_assigned',
    CHAT_TRANSFERRED = 'chat_transferred',
    CHAT_CLOSED = 'chat_closed',
    USER_TYPING = 'user_typing',
    NEWS_CREATED = 'news_created',
    NEWS_DELETED = 'news_deleted',
    NOTIFICATION_CREATED = 'notification_created',
    LOAN_CREATED = 'loan_created',
    PONG = 'pong'
}
