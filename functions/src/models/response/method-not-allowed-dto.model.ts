import BaseResponseDto from "./base-response-dto.model";

export default class MethodNotAllowedDto extends BaseResponseDto {
  constructor(method: string) {
    super(`${method} is not supported`);
  }
}
