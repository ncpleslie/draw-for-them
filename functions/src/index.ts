import * as functions from "firebase-functions";
import { addDrawEvent, getDrawEvent } from "./controller/draw-event";
import { addNewUser } from "./controller/user";

export const add_draw_event = functions.https.onRequest(addDrawEvent);

export const get_draw_event = functions.https.onRequest(getDrawEvent);

export const add_new_user = functions.auth.user().onCreate(addNewUser);
