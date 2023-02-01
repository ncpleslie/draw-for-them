import { IUserDomain } from "../domain/db/client";
import DomainNotFoundError from "./errors/domain-not-found.error";
import DomainValidationError from "./errors/domain-validation.error";

export default class UserService {
  constructor(private db: IUserDomain) {}

  public async getUserByNameAsync(name: string) {
    const user = await this.db.findFirst({
      where: { email: name },
    });

    if (!user) {
      throw new DomainNotFoundError("User not found");
    }

    return user;
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

  public async getUsersFirstFriendAsync(currentUserId: string) {
    const currentUser = await this.db.findFirst({
      where: { id: currentUserId },
      include: { friends: true },
    });

    if (!currentUser) {
      throw new DomainNotFoundError("User not found");
    }

    const firstFriendId = currentUser.friends[0]?.id;

    if (!firstFriendId) {
      throw new DomainValidationError("User has no friends");
    }

    return firstFriendId;
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
}
