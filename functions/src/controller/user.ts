import cors from "cors";
import * as functions from "firebase-functions";
import { UserRecord } from "firebase-functions/v1/auth";
import { HTTPMethod } from "../enums/http.enum";
import BadRequestDto from "../models/response/bad-request-dto.model";
import InternalServerErrorDto from "../models/response/internal-server-error-dto.model";
import MethodNotAllowedDto from "../models/response/method-not-allowed-dto.model";
import {
  addNewUserAsync,
  getUserByIdAsync,
  getUserByDisplayNameAsync,
  addFriendByIdAsync,
} from "../service/user.service";

const corsHandler = cors({ credentials: true, origin: true });

export const addNewUser = async (user: UserRecord) => {
  functions.logger.log("A new user has been created", user);

  await addNewUserAsync(user);
};

export const getUser = async (
  request: functions.Request,
  response: functions.Response
) => {
  corsHandler(request, response, async () => {
    if (request.method !== HTTPMethod.GET) {
      response.status(405).send(new MethodNotAllowedDto(request.method));

      return;
    }

    if (!request.query?.userId) {
      response.status(400).send(new BadRequestDto("userId"));
    }

    try {
      const user = await getUserByIdAsync(request.query?.userId as string);

      response.status(200).send(user);
    } catch (e) {
      functions.logger.error(e);
      response.status(500).send(new InternalServerErrorDto(e as Error));
    }
  });
};

export const searchUser = async (
  request: functions.Request,
  response: functions.Response
) => {
  corsHandler(request, response, async () => {
    if (request.method !== HTTPMethod.GET) {
      response.status(405).send(new MethodNotAllowedDto(request.method));

      return;
    }

    try {
      if (request.query?.displayName) {
        const user = await getUserByDisplayNameAsync(
          (request.query?.displayName as string).trim().toLowerCase()
        );

        response.status(200).send(user);

        return;
      }

      if (request.query?.userId) {
        const user = await getUserByIdAsync(request.query?.userId as string);

        response.status(200).send(user);

        return;
      }

      response.status(400).send(new BadRequestDto("displayName or userId"));
    } catch (e) {
      functions.logger.error(e);
      response.status(500).send(new InternalServerErrorDto(e as Error));
    }
  });
};

export const addAFriend = async (
  request: functions.Request,
  response: functions.Response
) => {
  corsHandler(request, response, async () => {
    if (request.method !== HTTPMethod.PATCH) {
      response.status(405).send(new MethodNotAllowedDto(request.method));

      return;
    }

    if (!request.headers?.authorization) {
      response.status(403).send(new BadRequestDto("authorization"));
    }

    if (!request.body?.userId) {
      response.status(400).send(new BadRequestDto("userId"));
    }

    try {
      const token = request.headers.authorization?.split(" ")[1];
      const user = await addFriendByIdAsync(
        token as string,
        request.body?.userId as string
      );

      response.status(200).send(user);
    } catch (e) {
      functions.logger.error(e);
      response.status(500).send(new InternalServerErrorDto(e as Error));
    }
  });
};
