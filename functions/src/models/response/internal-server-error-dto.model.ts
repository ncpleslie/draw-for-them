import ErrorDto from "./error-dto.model";

export default class InternalServerErrorDto extends ErrorDto {
  constructor(error: unknown) {
    super("Internal server error", error);
  }
}
