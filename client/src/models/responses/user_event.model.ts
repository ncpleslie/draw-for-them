import { DocumentData } from "firebase/firestore";
import DrawEvent from "./draw_event.model";

export default class UserEvent {
  constructor(data: DocumentData) {
    if (!data.draw_events) {
      throw new Error("No draw events");
    }

    this.drawEvents = data.draw_events.map((d: unknown) => new DrawEvent(d));
  }

  public drawEvents: DrawEvent[];
}
