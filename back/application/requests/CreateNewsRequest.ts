export class CreateNewsRequest {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly authorId: string,
    public readonly authorName: string
  ) {}
}
