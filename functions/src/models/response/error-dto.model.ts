import BaseResponseDto from "./base-response-dto.model";

export default abstract class ErrorDto extends BaseResponseDto {
  constructor(message: string, error: unknown) {
    super(message);
    this.error = error;
  }

  public error: unknown;
}
