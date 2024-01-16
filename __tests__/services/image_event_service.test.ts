import { PrismaClient } from "@prisma/client";
import ImageEventService from "../../src/server/services/image-event.service";
import MockStorageService from "./mock/mock_storage_service";
import NotFoundError from "../../src/server/services/errors/not-found.error";

describe("ImageEventService", () => {
  let imageEventService: ImageEventService;
  let storageService: MockStorageService;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
    storageService = new MockStorageService();
    imageEventService = new ImageEventService(
      prisma.imageEvent,
      storageService
    );
  });

  beforeEach(async () => {
    await prisma.$transaction(async (prisma) => {
      await prisma.user.deleteMany();

      await prisma.user.create({
        data: {
          id: "event-friend-id-1",
          name: "Event 1",
          email: "event-one@test.com",
        },
      });

      await prisma.user.create({
        data: {
          id: "event-friend-id-2",
          name: "Event 2",
          email: "event-two@test.com",
        },
      });

      await prisma.user.create({
        data: {
          id: "event-user-id",
          name: "Event Doe",
          email: "eventtest@test.com",
        },
      });

      await prisma.user.update({
        where: { id: "event-user-id" },
        data: {
          friends: {
            connect: [{ id: "event-friend-id-1" }, { id: "event-friend-id-2" }],
          },
        },
      });
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.imageEvent.deleteMany();
  });

  describe("addImageByIdAsync", () => {
    it("should create a new image event and store the image in the storage", async () => {
      // Arrange
      const senderId = "event-user-id";
      const receiverId = "event-friend-id-1";
      const imageString = "base64-encoded-image";

      // Act
      await imageEventService.addImageByIdAsync(
        senderId,
        receiverId,
        imageString
      );

      // Assert
      const createdImageEvent = await prisma.imageEvent.findFirst({
        where: {
          senderId,
          receiverId,
        },
      });

      expect(createdImageEvent).toBeDefined();
      expect(createdImageEvent?.active).toBe(true);
      expect(createdImageEvent?.senderId).toBe(senderId);
      expect(createdImageEvent?.receiverId).toBe(receiverId);

      const storedImage = await storageService.getById(
        createdImageEvent?.id || ""
      );
      expect(storedImage).toBe(imageString);
    });
  });

  describe("getActiveImageByIdAsync", () => {
    it("should retrieve the active image by ID if it exists", async () => {
      // Arrange
      const imageId = "image-id";
      const imageData = "base64-encoded-image";

      // Create a test image event
      await prisma.imageEvent.create({
        data: {
          id: imageId,
          active: true,
          date: new Date(),
          sender: {
            connect: {
              id: "event-user-id",
            },
          },
          receiver: {
            connect: {
              id: "event-friend-id-1",
            },
          },
        },
      });

      // Store the image data
      await storageService.storeById(imageId, imageData);

      // Act
      const result = await imageEventService.getActiveImageByIdAsync(imageId);

      // Assert
      expect(result).toBe(imageData);
    });

    it("should throw a NotFoundError if the active image does not exist", async () => {
      // Arrange
      const nonExistentImageId = "non-existent-image-id";

      // Act and Assert
      await expect(
        imageEventService.getActiveImageByIdAsync(nonExistentImageId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("setImageInactiveByIdAsync", () => {
    it("should set the active image to inactive if it exists", async () => {
      // Arrange
      const imageId = "an-image-id-123";

      // Create a test image event
      await prisma.imageEvent.create({
        data: {
          id: imageId,
          active: true,
          date: new Date(),
          sender: {
            connect: {
              id: "event-user-id",
            },
          },
          receiver: {
            connect: {
              id: "event-friend-id-1",
            },
          },
        },
      });

      // Act
      await imageEventService.setImageInactiveByIdAsync(imageId);

      // Assert
      const updatedImageEvent = await prisma.imageEvent.findUnique({
        where: { id: imageId },
      });
      expect(updatedImageEvent?.active).toBe(false);
    });

    it("should throw a NotFoundError if the active image does not exist", async () => {
      // Arrange
      const nonExistentImageId = "non-existent-image-id";

      // Act and Assert
      await expect(
        imageEventService.setImageInactiveByIdAsync(nonExistentImageId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
