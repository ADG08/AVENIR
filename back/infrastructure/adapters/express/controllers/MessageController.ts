import { Request, Response } from 'express';

export class MessageController {
    constructor(
        private readonly sendMessageUseCase: any,
        private readonly markMessageAsReadUseCase: any,
        private readonly chatRepository: any
    ) {}
}
