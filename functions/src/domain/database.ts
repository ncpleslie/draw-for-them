import { FieldValue, Firestore, getFirestore } from "firebase-admin/firestore";
import DrawEvent from "../models/draw_event";

export default class Database {
  private db: Firestore;
  constructor() {
    this.db = getFirestore();
  }

  public async createDrawEventAsync(
    receiverId: string,
    filename: string
  ): Promise<void> {
    const eventRef = this.db.collection("events").doc(receiverId);
    await eventRef.update({
      draw_events: FieldValue.arrayUnion(
        new DrawEvent(true, "user_2", filename).toJSON()
      ),
    });
  }

  public async updateDrawEventByIdAsync(
    userId: string,
    drawEvent: DrawEvent
  ): Promise<void> {
    const eventRef = this.db.collection("events").doc(userId);
    const userEventDoc = await eventRef.get();

    if (!userEventDoc.exists) {
      throw new Error(`User events for user with id ${userId} were not found.`);
    }

    const userEvent = userEventDoc.data();
  }

  public async getDrawEventAsync(
    userId: string,
    eventId: string
  ): Promise<DrawEvent> {
    const eventRef = this.db.collection("events").doc(userId);
    const userEventDoc = await eventRef.get();

    if (!userEventDoc.exists) {
      throw new Error(`User events for user with id ${userId} were not found.`);
    }

    const userEvent = userEventDoc.data();
    const drawEvent = (userEvent?.draw_events as any).where(
      (drawEvent: any) => drawEvent.image_id
    );

    return new DrawEvent(
      drawEvent.active,
      drawEvent.created_by,
      drawEvent.image_id
    );
  }
}
