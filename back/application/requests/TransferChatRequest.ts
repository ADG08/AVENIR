export class TransferChatRequest {
    constructor(
        readonly chatId: string,
        readonly currentAdvisorId: string,
        readonly newAdvisorId: string,
    ) {}
}
