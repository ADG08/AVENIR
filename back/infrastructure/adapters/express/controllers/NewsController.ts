import { Request, Response } from 'express';

export class NewsController {
    constructor(
        private readonly createNewsUseCase: any,
        private readonly getAllNewsUseCase: any,
        private readonly getNewsByIdUseCase: any,
        private readonly deleteNewsUseCase: any
    ) {}
}
