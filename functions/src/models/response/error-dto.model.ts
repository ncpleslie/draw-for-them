import BaseResponseDto from "./base-response-dto.model";

export default abstract class ErrorDto extends BaseResponseDto {
  constructor(message: string, error: Error) {
    super(message);
    this.error = error.message;
  }

  public error: string;
}
