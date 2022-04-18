import BaseResponseDto from "./base-response-dto.model";

export default class BadRequestDto extends BaseResponseDto {
  constructor(missingField: string) {
    super(`Bad request. Missing the following field: ${missingField}`);
  }
}
