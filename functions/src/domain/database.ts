import {
  Firestore,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase-admin/firestore";
import { UserRecord } from "firebase-functions/v1/auth";
import { CollectionKey } from "../enums/collection-key.enum";
import DrawEvent from "../models/draw_event";
import User from "../models/user";

export default class Database {
  private db: Firestore;
  constructor() {
    this.db = getFirestore();
  }

  public async createUserAsync(user: UserRecord): Promise<UserRecord> {
    this.db
      .collection(CollectionKey.Users)
      .doc(user.uid)
      .set(new User(user.displayName, user.email, user.uid).toJSON());

    return user;
  }

  public async createDrawEventAsync(
    receiverId: string,
    filename: string
  ): Promise<void> {
    this.db
      .collection(CollectionKey.Events)
      .doc(receiverId)
      .collection(CollectionKey.DrawEvents)
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
      .collection(CollectionKey.Events)
      .doc(userId)
      .collection(CollectionKey.DrawEvents)
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
