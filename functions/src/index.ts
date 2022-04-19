import * as functions from "firebase-functions";
import cors from "cors";
import { HTTPMethod } from "./enums/http.enum";
import InternalServerErrorDto from "./models/response/internal-server-error-dto.model";
import { getImageByNameAsync } from "./service/download-image";
import { uploadImageAsync } from "./service/upload-image";
import MethodNotAllowedDto from "./models/response/method-not-allowed-dto.model";
import SuccessDto from "./models/response/success-dto.model";
import BadRequestDto from "./models/response/bad-request-dto.model";
import AppConstant from "./constants/app.constant";

const corsHandler = cors({ origin: true });

export const upload_image = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    corsHandler(request, response, async () => {
      if (!request.body?.imageData) {
        response.status(400).send(new BadRequestDto("imageData"));
      }

      try {
        await uploadImageAsync(request?.body?.imageData);
        response.status(200).send(new SuccessDto());
      } catch (e) {
        functions.logger.error("Unable to upload image", e);
        response.status(500).send(new InternalServerErrorDto(e));
      }
    });

    return;
  }
);

export const download_image = functions.https.onRequest(
  async (request: functions.Request, response: functions.Response) => {
    if (request.method !== HTTPMethod.GET) {
      response.status(405).send(new MethodNotAllowedDto(request.method));

      return;
    }

    corsHandler(request, response, async () => {
      if (!request.query?.imageName) {
        response.status(400).send(new BadRequestDto("imageName"));
      }

      try {
        const imageBuffer = await getImageByNameAsync(
          request.query?.imageName as string
        );
        response.status(200).header({
          "Content-Type": `image/${AppConstant.defaultImageFormat}`,
        });
        response.write(imageBuffer.toString("binary"), "binary");
        response.end();
      } catch (e) {
        response.status(500).send(new InternalServerErrorDto(e));
      }
    });
  }
);
