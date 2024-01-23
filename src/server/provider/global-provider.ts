import { UserDB, ImageEventDB } from "../domain/db/client";
import Base64ImageStorageClient from "../domain/storage/base64-image-storage-client";
import ImageEventService from "../services/image-event.service";
import UserService from "../services/user.service";
import { env } from "../../env/server.js";
import GlobalRef from "./global-ref";
import EmailClient from "../client/email/email-client";

/**
 * Global provider for services and other singletons that should be shared across the application.
 */
class GlobalProvider {
  private static emailClientRef = new GlobalRef<EmailClient>(EmailClient.name);
  private static imageEventServiceRef = new GlobalRef<ImageEventService>(
    ImageEventService.name
  );
  private static userServiceRef = new GlobalRef<UserService>(UserService.name);

  /**
   * Gets the email client.
   * @returns - The email client.
   */
  static getEmailClient() {
    if (!GlobalProvider.emailClientRef.value) {
      GlobalProvider.emailClientRef.value = new EmailClient(
        env.RESEND_API_KEY,
        env.EMAIL_FROM
      );
    }

    return GlobalProvider.emailClientRef.value;
  }

  /**
   * Gets the image event service.
   * @returns - The image event service.
   */
  static getImageEventService(): ImageEventService {
    if (!GlobalProvider.imageEventServiceRef.value) {
      const config = Base64ImageStorageClient.createConfig(
        env.STORAGE_PROJECT_ID,
        env.STORAGE_PRIVATE_KEY,
        env.STORAGE_CLIENT_EMAIL
      );
      const storageClient = new Base64ImageStorageClient(
        config,
        env.STORAGE_BUCKET
      );
      GlobalProvider.imageEventServiceRef.value = new ImageEventService(
        ImageEventDB,
        storageClient
      );
    }

    return GlobalProvider.imageEventServiceRef.value;
  }

  /**
   * Gets the user service.
   * @returns - The user service.
   */
  static getUserService(): UserService {
    if (!GlobalProvider.userServiceRef.value) {
      GlobalProvider.userServiceRef.value = new UserService(UserDB);
    }

    return GlobalProvider.userServiceRef.value;
  }
}

/**
 * The email client.
 * @see EmailClient
 */
export const emailClient = GlobalProvider.getEmailClient();

/**
 * The image event service.
 * @see ImageEventService
 */
export const imageEventService = GlobalProvider.getImageEventService();

/**
 * The user service.
 * @see UserService
 */
export const userService = GlobalProvider.getUserService();
