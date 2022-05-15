import * as functions from "firebase-functions";
import cors from "cors";
import { HTTPMethod } from "../enums/http.enum";
import InternalServerErrorDto from "../models/response/internal-server-error-dto.model";
import {
  addDrawEventAsync,
  getImageByIdAsync,
} from "../service/draw-event.service";
import MethodNotAllowedDto from "../models/response/method-not-allowed-dto.model";
import SuccessDto from "../models/response/success-dto.model";
import BadRequestDto from "../models/response/bad-request-dto.model";
import AppConstant from "../constants/app.constant";

const corsHandler = cors({ credentials: true, origin: true });

export const addDrawEvent = async (
  request: functions.Request,
  response: functions.Response
) => {
  corsHandler(request, response, async () => {
    if (!request.headers?.authorization) {
      response.status(403).send(new BadRequestDto("authorization"));
    }

    if (!request.body?.imageData) {
      response.status(400).send(new BadRequestDto("imageData"));

      return;
    }

    if (!request.body?.receiverId) {
      response.status(400).send(new BadRequestDto("receiverId"));

      return;
    }

    try {
      const token = request.headers.authorization?.split(" ")[1];
      await addDrawEventAsync(
        token as string,
        request.body.receiverId,
        request.body.imageData
      );
      response.status(200).send(new SuccessDto());
    } catch (e) {
      functions.logger.error("Unable to upload image", e);
      response.status(500).send(new InternalServerErrorDto(e as Error));
    }
  });

  return;
};

export const getDrawEvent = async (
  request: functions.Request,
  response: functions.Response
) => {
  corsHandler(request, response, async () => {
    if (request.method !== HTTPMethod.GET) {
      response.status(405).send(new MethodNotAllowedDto(request.method));

      return;
    }

    if (!request.headers?.authorization) {
      response.status(403).send(new BadRequestDto("authorization"));
    }

    if (!request.query?.imageId) {
      response.status(400).send(new BadRequestDto("imageId"));
    }

    try {
      const token = request.headers.authorization?.split(" ")[1];
      const imageBuffer = await getImageByIdAsync(
        token as string,
        request.query?.imageId as string
      );
      response.status(200).header({
        "Content-Type": `image/${AppConstant.defaultImageFormat}`,
      });
      response.write(imageBuffer.toString("binary"), "binary");
      response.end();
    } catch (e) {
      functions.logger.error(e);
      response.status(500).send(new InternalServerErrorDto(e as Error));
    }
  });
};
