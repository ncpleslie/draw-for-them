import ErrorDto from "./error-dto.model";

export default class InternalServerErrorDto extends ErrorDto {
  constructor(error: Error) {
    super("Internal server error", error);
  }
}
