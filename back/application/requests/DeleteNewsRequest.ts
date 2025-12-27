export class DeleteNewsRequest {
  constructor(
    public readonly newsId: string,
    public readonly userId: string
  ) {}
}
