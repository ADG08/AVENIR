import { Request, Response } from 'express';

export class AccountController {
    constructor(
        private readonly addAccountUseCase: any,
        private readonly deleteAccountUseCase: any,
        private readonly updateAccountNameUseCase: any,
        private readonly getAccountsUseCase: any
    ) {}
}
