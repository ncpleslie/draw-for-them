import { PrismaClient } from "@prisma/client";
import UserService from "../src/server/services/user.service";
import { IUserDomain } from "../src/server/domain/db/client";

describe("UserService", () => {
  let userService: UserService;
  let prisma: PrismaClient;
  let userClient: IUserDomain;

  beforeAll(() => {
    prisma = new PrismaClient();
    userClient = prisma.user;
    userService = new UserService(userClient);
  });

  beforeEach(async () => {
    await userClient.deleteMany();

    await userClient.create({
      data: {
        id: "user-id",
        name: "John Doe",
        email: "test@test.com",
      },
    });

    await userClient.create({
      data: {
        id: "friend-id-1",
        name: "Friend 1",
        email: "friend1@test.com",
      },
    });

    await userClient.create({
      data: {
        id: "friend-id-2",
        name: "Friend 2",
        email: "friend2@test.com",
      },
    });

    await userClient.update({
      where: { id: "user-id" },
      data: {
        friends: {
          connect: [{ id: "friend-id-1" }, { id: "friend-id-2" }],
        },
      },
    });
  });

  afterAll(async () => {
    await userClient.deleteMany();
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
        friends: [
          { id: "friend-id-1", name: "Friend 1" },
          { id: "friend-id-2", name: "Friend 2" },
        ],
      });
    });

    it("should throw an error if the user does not exist", async () => {
      // Arrange
      const userId = "non-existent-user-id";
      const friendId = "friend-id-1";

      // Act and Assert
      await expect(
        userService.deleteFriendByIdAsync(userId, friendId)
      ).rejects.toThrow("User not found");
    });
  });
});
