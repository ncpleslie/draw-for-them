import { ImageDomainType } from "../../types/prisma.types";

export default class ImageDomain {
  constructor(private db: ImageDomainType) {}

  public async getActiveImageByIdAsync(imageId: string) {
    return await this.db.findFirst({
      where: { id: imageId, active: true },
    });
  }

  public async setImageInactiveByIdAsync(imageId: string) {
    await this.db.update({
      where: { id: imageId },
      data: { active: false },
    });
  }
}
