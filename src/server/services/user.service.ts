import { User } from "@prisma/client";
import { type IUserDomain } from "../domain/db/client";
import NotFoundError from "./errors/not-found.error";
import ValidationError from "./errors/validation.error";
import { exclude } from "../../utils/helper.utils";

/**
 * The user service for interacting with users in the database.
 * TODO: This class will need to be refactored to follow domain-driven design.
 * As it stands, it is a service that is tightly coupled to the database.
 */
export default class UserService {
  /**
   * Creates an instance of user service.
   * @param db - The database.
   */
  constructor(private db: IUserDomain) {}

  /**
   * Deletes a friend from a user by id.
   * @param userId - The id of the user with the friend.
   * @param friendId - The id of the friend to delete.
   * @returns - The user with the friend deleted.
   */
  public async deleteFriendByIdAsync(
    userId: string,
    friendId: string
  ): Promise<User> {
    const user = await this.db.findUnique({
      where: { id: userId },
      include: { friends: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const friendIndex = user.friends.findIndex(
      (friend) => friend.id === friendId
    );

    if (friendIndex === -1) {
      user.friends.map((friend) => {
        this.excludeEmail(friend);
      });
      return user;
    }

    const userWithoutFriend = await this.db.update({
      where: { id: userId },
      data: {
        friends: {
          disconnect: [{ id: friendId }],
        },
      },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
        },
      },
    });

    return userWithoutFriend;
  }

  /**
   * Gets a user's friends by id.
   * @param userId - The id of the user to retrieve.
   * @returns - The user's friends.
   */
  public async getUserFriendsAsync(userId: string) {
    const userWithFriends = await this.db.findFirst({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
        },
      },
    });

    if (!userWithFriends) {
      throw new NotFoundError("User not found");
    }

    return userWithFriends.friends;
  }

  /**
   * Gets users by name.
   * @param userId - The name of the users to search for.
   * @returns - A list of users.
   */
  public async getUsersByNameAsync(name: string) {
    const users = await this.db.findMany({
      where: {
        OR: [
          {
            email: {
              contains: name,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: false,
        emailVerified: false,
      },
    });

    return users;
  }

  /**
   * Gets a user's profile by id.
   * @param userId - The id of the user to retrieve.
   * @returns - The user's profile.
   */
  public async getUserProfileAsync(userId: string) {
    const userProfile = await this.db.findFirst({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
        },
        sentImages: true,
        receivedImages: true,
      },
    });

    if (!userProfile) {
      throw new NotFoundError("Unable to find user's profile");
    }

    return userProfile;
  }

  /**
   * Gets a user's history by id.
   * @param currentUserId - The id of the current user.
   * @param friendId - The id of the friend to retrieve.
   * @returns - The user's history.
   */
  public async getHistoryByUserIdAsync(
    currentUserId: string,
    friendId: string
  ) {
    const history = await this.db.findFirst({
      where: { id: currentUserId, friends: { some: { id: friendId } } },
      include: {
        friends: {
          where: {
            id: friendId,
          },
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
        },
        sentImages: {
          where: {
            senderId: currentUserId,
            receiverId: friendId,
          },
        },
        receivedImages: {
          where: {
            senderId: friendId,
            receiverId: currentUserId,
          },
        },
      },
    });

    if (!history) {
      throw new NotFoundError("Unable to find current user's friend history");
    }

    return history;
  }

  /**
   * Adds a user as a friend by id.
   * @param currentUserId - The id of the current user.
   * @param userToFriendId - The id of the user to friend.
   * @returns - The updated user.
   */
  public async addUserAsFriendByIdAsync(
    currentUserId: string,
    userToFriendId: string
  ) {
    const friendToAdd = await this.db.findFirst({
      where: { id: userToFriendId },
    });

    if (!friendToAdd) {
      throw new NotFoundError("User to friend not found");
    }

    return await this.db.update({
      where: { id: currentUserId },
      select: {
        id: true,
        name: true,
        email: false,
        emailVerified: false,
        friends: {
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
        },
      },
      data: { friends: { connect: [{ id: userToFriendId }] } },
    });
  }

  /**
   * Gets a user's friend by id.
   * @param userId - The id of the user to retrieve.
   * @param friendUserId - The id of the friend.
   * @returns - The user's friend.
   */
  public async getUsersFriendByIdAsync(userId: string, friendUserId: string) {
    const currentUser = await this.db.findFirst({
      where: { id: userId },
      include: {
        friends: {
          select: {
            id: true,
            name: true,
            email: false,
            emailVerified: false,
          },
          where: {
            id: friendUserId,
          },
        },
      },
    });

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    const friend = currentUser.friends[0];

    if (!friend) {
      throw new ValidationError("User has no friend with that id");
    }

    return friend;
  }

  /**
   * Gets all image events for a user by id.
   * @param userId - The id of the user to retrieve.
   * @returns - The user's image events.
   */
  public async getAllImageEventsForUserAsync(userId: string) {
    const user = await this.db.findFirst({
      where: { id: userId },
      include: {
        receivedImages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                email: false,
                emailVerified: false,
              },
            },
          },
          where: { active: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user?.receivedImages;
  }

  /**
   * Updates a user's profile by id.
   * @param userId - The id of the user to update.
   * @param profileData - The profile data to update.
   * @returns - The updated user.
   */
  public async updateProfileAsync(
    userId: string,
    profileData: { name?: string }
  ) {
    const user = await this.db.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = await this.db.update({
      where: {
        id: userId,
      },
      data: {
        name: profileData.name,
      },
    });

    return updatedUser;
  }

  /**
   * Removes the email from a user.
   * @param user - The user to remove the email from.
   * @returns - The user without the email.
   */
  private excludeEmail(user: User): Omit<User, "email" | "emailVerified"> {
    return exclude(user, ["email", "emailVerified"]);
  }
}
