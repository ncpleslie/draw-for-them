import axios from "axios";

export default class Api {
  private static baseApi =
    "https://us-central1-draw-for-them.cloudfunctions.net/";

  public static async getImageByName(name: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("imageName", name);

    const response = await axios.get(`${Api.baseApi}download_image`, {
      params,
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  }

  public static async postImage(imageData: string): Promise<void> {
    await axios.post(`${Api.baseApi}upload_image`, { imageData });
  }
}
