import UserDetail from "../models/user-detail.model";
import BaseApi from "./base-api";

export default class Api extends BaseApi {
  public static async getImageById(imageId: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("imageId", imageId);
    const http = await this.http();
    const response = await http.get(`get_draw_event`, {
      params,
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  public static async postImage(
    userId: string,
    imageData: string
  ): Promise<void> {
    const http = await this.http();
    await http.post(`add_draw_event`, {
      imageData,
      receiverId: userId,
    });
  }

  public static async getUserById(userId: string): Promise<UserDetail> {
    const params = new URLSearchParams();
    params.append("userId", userId);

    const http = await this.http();
    const response = await http.get(`get_user`, {
      params,
    });

    const responseData = response.data as UserDetail;

    return new UserDetail(
      responseData.displayName,
      responseData.email,
      responseData.friendIds,
      responseData.uid
    );
  }

  public static async searchUser(displayName: string): Promise<UserDetail> {
    const params = new URLSearchParams();
    params.append("displayName", displayName);

    const http = await this.http();
    const response = await http.get(`search_user`, {
      params,
    });

    const responseData = response.data as UserDetail;

    return new UserDetail(
      responseData.displayName,
      responseData.email,
      responseData.friendIds,
      responseData.uid
    );
  }

  public static async addAFriend(userId: string): Promise<void> {
    const http = await this.http();
    await http.patch(`add_a_friend`, { userId });
  }
}
