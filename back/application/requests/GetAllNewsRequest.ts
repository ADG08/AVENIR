export class GetAllNewsRequest {
  constructor(
    public readonly limit?: number,
    public readonly offset?: number
  ) {}
}
