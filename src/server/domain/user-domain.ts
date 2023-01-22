import { UserDomainType } from "../../types/prisma.types";

export default class UserDomain {
  constructor(private db: UserDomainType) {}

  public async getUserByNameAsync(name: string) {
    return await this.db.findFirst({
      where: { email: name },
    });
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

  public async addImageEventToUserByIdAsync(
    currentUserId: string,
    imageString: string
  ) {
    const currentUser = await this.db.findFirst({
      where: { id: currentUserId },
      include: { friends: true },
    });

    if (!currentUser || currentUser.friends.length === 0) {
      throw new Error("User has no friends");
    }

    const firstFriendId = currentUser.friends[0]?.id;
    await this.db.update({
      where: { id: firstFriendId },
      data: {
        receivedImages: {
          create: { imageData: imageString, senderId: currentUserId },
        },
      },
    });
  }

  public async getAllImagesForUserAsync(userId: string) {
    const user = await this.db.findFirst({
      where: { id: userId },
      include: {
        receivedImages: { include: { sender: true }, where: { active: true } },
      },
    });

    return user?.receivedImages;
  }
}
