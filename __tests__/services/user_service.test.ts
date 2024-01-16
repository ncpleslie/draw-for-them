import { PrismaClient } from "@prisma/client";
import UserService from "../../src/server/services/user.service";
import { IUserDomain } from "../../src/server/domain/db/client";
import NotFoundError from "../../src/server/services/errors/not-found.error";
import ValidationError from "../../src/server/services/errors/validation.error";

describe("UserService", () => {
  let userService: UserService;
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
    userService = new UserService(prisma.user);
  });

  beforeEach(async () => {
    await prisma.$transaction(async (prisma) => {
      await prisma.user.deleteMany();

      await prisma.user.create({
        data: {
          id: "friend-id-1",
          name: "Friend 1",
          email: "friend1@test.com",
        },
      });

      await prisma.user.create({
        data: {
          id: "friend-id-2",
          name: "Friend 2",
          email: "friend2@test.com",
        },
      });

      await prisma.user.create({
        data: {
          id: "user-id",
          name: "John Doe",
          email: "test@test.com",
          sentImages: {
            create: [
              {
                id: "image-id-1",
                date: new Date(),
                receiver: {
                  connect: {
                    id: "friend-id-1",
                  },
                },
              },
              {
                id: "image-id-2",
                date: new Date(),
                receiver: {
                  connect: {
                    id: "friend-id-2",
                  },
                },
              },
            ],
          },
          receivedImages: {
            create: [
              {
                active: true,
                id: "image-id-3",
                date: new Date(),
                sender: {
                  connect: {
                    id: "friend-id-1",
                  },
                },
              },
              {
                active: true,
                id: "image-id-4",
                date: new Date(),
                sender: {
                  connect: {
                    id: "friend-id-2",
                  },
                },
              },
              {
                active: false,
                id: "image-id-5",
                date: new Date(),
                sender: {
                  connect: {
                    id: "friend-id-2",
                  },
                },
              },
            ],
          },
        },
      });

      await prisma.user.update({
        where: { id: "user-id" },
        data: {
          friends: {
            connect: [{ id: "friend-id-1" }, { id: "friend-id-2" }],
          },
        },
      });
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("deleteFriendByIdAsync", () => {
    it("should delete the friend from the user's friend list", async () => {
      // Arrange
      const userId = "user-id";
      const friendId = "friend-id-1";

      // Act
      const result = await userService.deleteFriendByIdAsync(userId, friendId);

      // Assert
      expect(result).toEqual({
        id: userId,
        name: "John Doe",
        email: "test@test.com",
        emailVerified: null,
        friends: [{ id: "friend-id-2", name: "Friend 2" }],
      });
    });

    it("should return the user as is if the friend relationship does not exist", async () => {
      // Arrange
      const userId = "user-id";
      const friendId = "non-existent-friend-id";

      // Act
      const result = await userService.deleteFriendByIdAsync(userId, friendId);

      // Assert
      expect(result).toEqual({
        id: userId,
        name: "John Doe",
        email: "test@test.com",
        emailVerified: null,
        friends: expect.arrayContaining([
          { id: "friend-id-1", name: "Friend 1" },
          { id: "friend-id-2", name: "Friend 2" },
        ]),
      });
    });

    it("should throw an error if the user does not exist", async () => {
      // Arrange
      const error = NotFoundError;
      const userId = "non-existent-user-id";
      const friendId = "friend-id-1";

      // Act and Assert
      await expect(
        userService.deleteFriendByIdAsync(userId, friendId)
      ).rejects.toThrow(error);
    });
  });

  describe("getUserFriendsAsync", () => {
    it("should return the user's friends with the email excluded", async () => {
      // Arrange
      const userId = "user-id";

      // Act
      const result = await userService.getUserFriendsAsync(userId);

      // Assert
      expect(result).toEqual(
        expect.arrayContaining([
          { id: "friend-id-1", name: "Friend 1" },
          { id: "friend-id-2", name: "Friend 2" },
        ])
      );
    });

    it("should throw a User not found if the user does not exist", async () => {
      // Arrange
      const error = NotFoundError;
      const userId = "non-existent-user-id";

      // Act and Assert
      await expect(userService.getUserFriendsAsync(userId)).rejects.toThrow(
        error
      );
    });
  });

  describe("getUsersByNameAsync", () => {
    it("should return users with matching name (case-insensitive)", async () => {
      // Arrange
      const name = "friend";

      // Act
      const result = await userService.getUsersByNameAsync(name);

      // Assert
      expect(result).toEqual(
        expect.arrayContaining([
          { id: "friend-id-1", name: "Friend 1" },
          { id: "friend-id-2", name: "Friend 2" },
        ])
      );
    });

    it("should return an empty array if no users match the name", async () => {
      // Arrange
      const name = "non-existent";

      // Act
      const result = await userService.getUsersByNameAsync(name);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("getUserProfileAsync", () => {
    it("should return the user's profile with the email excluded", async () => {
      // Arrange
      const userId = "user-id";

      // Act
      const result = await userService.getUserProfileAsync(userId);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({
          id: userId,
          name: "John Doe",
          friends: expect.arrayContaining([
            { id: "friend-id-1", name: "Friend 1" },
            { id: "friend-id-2", name: "Friend 2" },
          ]),
        })
      );

      expect(result.sentImages).toEqual(
        expect.arrayContaining([
          {
            id: "image-id-1",
            active: true,
            date: expect.any(Date),
            senderId: userId,
            receiverId: "friend-id-1",
          },
          {
            id: "image-id-2",
            active: true,
            date: expect.any(Date),
            senderId: userId,
            receiverId: "friend-id-2",
          },
        ])
      );

      expect(result.receivedImages).toEqual(
        expect.arrayContaining([
          {
            id: "image-id-3",
            active: true,
            date: expect.any(Date),
            senderId: "friend-id-1",
            receiverId: userId,
          },
          {
            id: "image-id-4",
            active: true,
            date: expect.any(Date),
            senderId: "friend-id-2",
            receiverId: userId,
          },
        ])
      );
    });

    it("should throw a NotFoundError if the user's profile does not exist", async () => {
      // Arrange
      const error = NotFoundError;
      const userId = "non-existent-user-id";

      // Act and Assert
      await expect(userService.getUserProfileAsync(userId)).rejects.toThrow(
        error
      );
    });
  });

  describe("getHistoryByUserIdAsync", () => {
    it("should return the user's history with the friend's details and relevant images", async () => {
      // Arrange
      const currentUserId = "user-id";
      const friendId = "friend-id-1";

      // Act
      const result = await userService.getHistoryByUserIdAsync(
        currentUserId,
        friendId
      );

      // Assert
      expect(result).toEqual({
        id: currentUserId,
        name: "John Doe",
        email: "test@test.com",
        emailVerified: null,
        friends: [{ id: friendId, name: "Friend 1" }],
        sentImages: [
          {
            active: true,
            id: "image-id-1",
            date: expect.any(Date),
            senderId: "user-id",
            receiverId: "friend-id-1",
          },
        ],
        receivedImages: [
          {
            active: true,
            id: "image-id-3",
            date: expect.any(Date),
            senderId: "friend-id-1",
            receiverId: "user-id",
          },
        ],
      });
    });

    it("should throw a NotFoundError if the user's friend history does not exist", async () => {
      // Arrange
      const currentUserId = "user-id";
      const friendId = "non-existent-friend-id";

      // Act and Assert
      await expect(
        userService.getHistoryByUserIdAsync(currentUserId, friendId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("addUserAsFriendByIdAsync", () => {
    it("should add the user as a friend and return the updated friend details", async () => {
      // Arrange
      const currentUserId = "user-id";
      const userToFriendId = "user-to-friend-id";

      await prisma.user.create({
        data: {
          id: userToFriendId,
          name: "User to Friend",
          email: "email@email.com",
        },
      });

      // Act
      const result = await userService.addUserAsFriendByIdAsync(
        currentUserId,
        userToFriendId
      );

      // Assert
      expect(result).toEqual({
        id: currentUserId,
        name: "John Doe",
        friends: expect.arrayContaining([
          { id: "friend-id-1", name: "Friend 1" },
          { id: "friend-id-2", name: "Friend 2" },
          { id: userToFriendId, name: "User to Friend" },
        ]),
      });
    });

    it("should throw a NotFoundError if the current user does not exist", async () => {
      // Arrange
      const currentUserId = "user-id";
      const userToFriendId = "non-existent-user-id";

      // Act and Assert
      await expect(
        userService.addUserAsFriendByIdAsync(currentUserId, userToFriendId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("getUsersFriendByIdAsync", () => {
    it("should return the friend ID if the user has a friend with the provided ID", async () => {
      // Arrange
      const userId = "user-id";
      const friendId = "friend-id-1";

      // Act
      const result = await userService.getUsersFriendByIdAsync(
        userId,
        friendId
      );

      // Assert
      expect(result).toEqual({ id: friendId, name: "Friend 1" });
    });

    it("should throw a NotFoundError if the current user does not exist", async () => {
      // Arrange
      const userId = "non-existent-user-id";
      const friendId = "friend-id-1";

      // Act and Assert
      await expect(
        userService.getUsersFriendByIdAsync(userId, friendId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw a ValidationError if the user has no friend with the provided ID", async () => {
      // Arrange
      const userId = "user-id";
      const friendId = "non-existent-user-id";

      // Act and Assert
      await expect(
        userService.getUsersFriendByIdAsync(userId, friendId)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("getAllImageEventsForUserAsync", () => {
    it("should return all active image events for the provided user ID", async () => {
      // Arrange
      const userId = "user-id";

      // Act
      const result = await userService.getAllImageEventsForUserAsync(userId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "image-id-3", active: true }),
          expect.objectContaining({ id: "image-id-4", active: true }),
        ])
      );
    });

    it("should throw a NotFoundError if the user does not exist", async () => {
      // Arrange
      const userId = "non-existent-user-id";

      // Act and Assert
      await expect(
        userService.getAllImageEventsForUserAsync(userId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateProfileAsync", () => {
    it("should update the user's name if the user exists", async () => {
      // Arrange
      const userId = "user-id";
      const profileData = { name: "Jane Smith" };

      // Act
      const result = await userService.updateProfileAsync(userId, profileData);

      // Assert
      expect(result).toEqual(
        expect.objectContaining({ id: userId, name: profileData.name })
      );
    });

    it("should throw a NotFoundError if the user does not exist", async () => {
      // Arrange
      const userId = "non-existent-user-id";
      const profileData = { name: "Jane Smith" };

      // Act and Assert
      await expect(
        userService.updateProfileAsync(userId, profileData)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
