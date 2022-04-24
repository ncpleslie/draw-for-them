import {
  Firestore,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";
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
    this.db
      .collection("events")
      .doc(receiverId)
      .collection("draw_events")
      .add(new DrawEvent(true, filename, "user_2").toJSON());
  }

  public async updateDrawEventAsync(
    userId: string,
    drawEvent: DrawEvent
  ): Promise<void> {
    const drawEventSnapshot = await this.getQuerySnapshotOfDrawEventById(
      userId,
      drawEvent.imageId
    );

    await drawEventSnapshot.ref.update(drawEvent.toJSON());
  }

  public async getDrawEventAsync(
    userId: string,
    imageId: string
  ): Promise<DrawEvent> {
    const drawEventSnapshot = await this.getQuerySnapshotOfDrawEventById(
      userId,
      imageId
    );
    const drawEvent = drawEventSnapshot.data() as DrawEvent;

    return new DrawEvent(drawEvent.active, drawEvent.imageId, drawEvent.sentBy);
  }

  private async getQuerySnapshotOfDrawEventById(
    userId: string,
    imageId: string
  ): Promise<QueryDocumentSnapshot<DocumentData>> {
    const eventRef = this.db
      .collection("events")
      .doc(userId)
      .collection("draw_events")
      .where("imageId", "==", imageId)
      .limit(1);
    const eventDoc = await eventRef.get();

    if (eventDoc.empty) {
      throw new Error(
        `Draw event ${imageId} for user with id ${userId} was not found.`
      );
    }

    return eventDoc.docs[0];
  }
}
