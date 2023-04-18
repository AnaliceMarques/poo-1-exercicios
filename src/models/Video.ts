export class Video {
  constructor(
    private id: string,
    private title: string,
    private duration: number,
    private upload: string = new Date().toISOString()
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(newId: string): void {
    this.id = newId;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(newTitle: string): void {
    this.title = newTitle;
  }

  public getDuration(): number {
    return this.duration;
  }

  public setDuration(newDuration: number): void {
    this.duration = newDuration;
  }

  public getUpload(): string {
    return this.upload;
  }

  public setUpload(newUpload: string): void {
    this.upload = newUpload;
  }
}
