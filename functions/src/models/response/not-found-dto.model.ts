import ErrorDto from "./error-dto.model";

export default class NotFoundDto extends ErrorDto {
  constructor(error: Error) {
    super("Not found", error);
  }
}
