import { IUserDomain } from "../domain/db/client";
import DomainNotFoundError from "./errors/domain-not-found.error";
import DomainValidationError from "./errors/domain-validation.error";

export default class UserService {
  constructor(private db: IUserDomain) {}

  public async getUserFriendsAsync(userId: string) {
    const userWithFriends = await this.db.findFirst({
      where: { id: userId },
      include: { friends: true },
    });

    if (!userWithFriends) {
      throw new DomainNotFoundError("User not found");
    }

    return userWithFriends.friends;
  }

  public async getUsersByNameAsync(name: string) {
    const users = await this.db.findMany({
      where: {
        OR: [
          {
            email: {
              contains: name,
            },
          },
          {
            name: {
              contains: name,
            },
          },
        ],
      },
    });

    return users;
  }

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
      throw new Error("Unable to find user's profile");
    }

    return this.exclude(userProfile, ["emailVerified"]);
  }

  public async addUserAsFriendByIdAsync(
    currentUserId: string,
    userToFriendId: string
  ) {
    await this.db.update({
      where: { id: currentUserId },
      data: { friends: { connect: [{ id: userToFriendId }] } },
    });
  }

  public async getUsersFriendByIdAsync(userId: string, currentUserId: string) {
    const currentUser = await this.db.findFirst({
      where: { id: currentUserId },
      include: {
        friends: {
          where: {
            id: userId,
          },
        },
      },
    });

    if (!currentUser) {
      throw new DomainNotFoundError("User not found");
    }

    const friendId = currentUser.friends[0]?.id;

    if (!friendId) {
      throw new DomainValidationError("User has no friend with that id");
    }

    return friendId;
  }

  public async getAllImageEventsForUserAsync(userId: string) {
    const user = await this.db.findFirst({
      where: { id: userId },
      include: {
        receivedImages: { include: { sender: true }, where: { active: true } },
      },
    });

    if (!user) {
      throw new DomainNotFoundError("User not found");
    }

    return user?.receivedImages;
  }

  public async updateProfileAsync(
    userId: string,
    profileData: { name?: string }
  ) {
    const user = await this.db.update({
      where: {
        id: userId,
      },
      data: {
        name: profileData.name,
      },
    });

    return user;
  }

  // TODO: Move to custom modal or base service
  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (const key of keys) {
      delete user[key];
    }
    return user;
  }
}
