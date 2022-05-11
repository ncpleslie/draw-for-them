import { User } from "firebase/auth";
import { proxy } from "valtio";
import BaseNotification from "../models/base-notification.model";
import DrawEvent from "../models/responses/draw_event.model";

interface ApplicationState {
  drawEvents: DrawEvent[];
  notifications: BaseNotification[];
  user: User | null;
}

export const store = proxy<ApplicationState>({
  drawEvents: [],
  notifications: [],
  user: null,
});
