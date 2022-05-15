import axios from "axios";
import AppConstant from "../constants/app.constant";
import UserDetail from "../models/user-detail.model";

export default class Api {
  public static async getImageById(imageId: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("imageId", imageId);

    const response = await axios.get(`${AppConstant.baseUrl}get_draw_event`, {
      params,
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  public static async postImage(
    userId: string,
    imageData: string
  ): Promise<void> {
    await axios.post(`${AppConstant.baseUrl}add_draw_event`, {
      imageData,
      receiverId: userId,
    });
  }

  public static async getUserById(userId: string): Promise<UserDetail> {
    const params = new URLSearchParams();
    params.append("userId", userId);

    const response = await axios.get(`${AppConstant.baseUrl}get_user`, {
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

    const response = await axios.get(`${AppConstant.baseUrl}search_user`, {
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
    const params = new URLSearchParams();
    params.append("userId", userId);

    await axios.get(`${AppConstant.baseUrl}add_a_friend`, {
      params,
    });
  }
}
