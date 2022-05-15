import {
  Firestore,
  getFirestore,
  QueryDocumentSnapshot,
  DocumentData,
  FieldValue,
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

  public async addFriendAsync(
    currentUser: UserRecord,
    userToAdd: UserRecord
  ): Promise<void> {
    await this.db
      .collection(CollectionKey.Users)
      .doc(currentUser.uid)
      .update({ friendIds: FieldValue.arrayUnion(userToAdd.uid) });
  }

  public async createUserAsync(user: UserRecord): Promise<User> {
    const newUser = new User(user.displayName, user.email, [], user.uid);
    this.db.collection(CollectionKey.Users).doc(user.uid).set(newUser.toJSON());

    return newUser;
  }

  public async getUserAsync(user: UserRecord): Promise<User> {
    const userRef = this.db.collection(CollectionKey.Users).doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error(`User ${user.uid} was not found.`);
    }

    const userData = userDoc.data() as User;

    return new User(
      userData.displayName,
      userData.email,
      userData.friendIds,
      userData.uid
    );
  }

  public async getUserByDisplayNameAsync(displayName: string): Promise<User> {
    const userRef = this.db
      .collection(CollectionKey.Users)
      .where("displayName", "==", displayName)
      .limit(1);
    const userDoc = await userRef.get();

    if (userDoc.empty) {
      throw new Error(`User ${displayName} was not found.`);
    }

    const userData = userDoc.docs[0].data() as User;

    return new User(
      userData.displayName,
      userData.email,
      userData.friendIds,
      userData.uid
    );
  }

  public async createDrawEventAsync(
    receiverId: string,
    filename: string,
    sentFromUserId: string
  ): Promise<void> {
    this.db
      .collection(CollectionKey.Events)
      .doc(receiverId)
      .collection(CollectionKey.DrawEvents)
      .add(new DrawEvent(true, filename, sentFromUserId).toJSON());
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

    return new DrawEvent(
      drawEvent.active,
      drawEvent.imageId,
      drawEvent.sentById
    );
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
