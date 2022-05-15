import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import AppConstant from "../constants/app.constant";
import { store } from "../store/store";

export default abstract class BaseApi {
  protected static async http(): Promise<AxiosInstance> {
    const api = axios.create({ baseURL: AppConstant.baseUrl });

    const user = store.user;

    if (user) {
      const userToken = await user.getIdToken();
      if (userToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
      }
    }

    return api;
  }
}
