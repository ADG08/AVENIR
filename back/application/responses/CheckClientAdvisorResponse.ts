export class CheckClientAdvisorResponse {
  constructor(
    public readonly isManaged: boolean,
    public readonly advisorId: string | null,
    public readonly advisorName: string | null
  ) {}

  static create(
    isManaged: boolean,
    advisorId: string | null,
    advisorName: string | null
  ): CheckClientAdvisorResponse {
    return new CheckClientAdvisorResponse(isManaged, advisorId, advisorName);
  }
}
