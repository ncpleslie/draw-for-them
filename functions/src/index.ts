import * as functions from "firebase-functions";
import { addDrawEvent, getDrawEvent } from "./controller/draw-event";
import { addAFriend, addNewUser, getUser, searchUser } from "./controller/user";

export const add_draw_event = functions.https.onRequest(addDrawEvent);

export const get_draw_event = functions.https.onRequest(getDrawEvent);

export const get_user = functions.https.onRequest(getUser);

export const search_user = functions.https.onRequest(searchUser);

export const add_a_friend = functions.https.onRequest(addAFriend);

export const add_new_user = functions.auth.user().onCreate(addNewUser);
