export default abstract class BaseResponseDto {
  constructor(message: string) {
    this.message = message;
  }

  public message: string;
}
