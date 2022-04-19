import { proxy } from "valtio";
import DrawEvent from "../models/responses/draw_event.model";

interface ApplicationState {
  drawEvents: DrawEvent[];
  activeDrawEvents: DrawEvent[];
}

export const store = proxy<ApplicationState>({
  drawEvents: [],
  activeDrawEvents: [],
});
