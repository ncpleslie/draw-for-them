import BaseResponseDto from "./base-response-dto.model";

export default class SuccessDto extends BaseResponseDto {
  constructor() {
    super("Success");
  }
}
