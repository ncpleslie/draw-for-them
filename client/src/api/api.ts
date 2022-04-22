import axios from "axios";
import AppConstant from "../constants/app.constant";

export default class Api {
  public static async getImageByName(name: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("imageName", name);

    const response = await axios.get(`${AppConstant.baseUrl}download_image`, {
      params,
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  public static async postImage(imageData: string): Promise<void> {
    await axios.post(`${AppConstant.baseUrl}upload_image`, { imageData });
  }
}
