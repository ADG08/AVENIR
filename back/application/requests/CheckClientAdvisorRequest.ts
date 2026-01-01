export class CheckClientAdvisorRequest {
  constructor(
    public readonly clientId: string,
    public readonly advisorId: string
  ) {}
}
