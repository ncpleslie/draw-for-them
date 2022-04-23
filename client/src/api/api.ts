import axios from "axios";
import AppConstant from "../constants/app.constant";

export default class Api {
  public static async getImageByName(name: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("imageName", name);

    const response = await axios.get(`${AppConstant.baseUrl}get_draw_event`, {
      params,
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  public static async postImage(imageData: string): Promise<void> {
    const receiverId = "user_1";
    await axios.post(`${AppConstant.baseUrl}add_draw_event`, {
      imageData,
      receiverId,
    });
  }
}
