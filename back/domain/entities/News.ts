export class News {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly authorId: string,
    public readonly authorName: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
