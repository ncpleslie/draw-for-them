import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import serviceAccount from "../draw-for-them-firebase-adminsdk.json";

export const app = initializeApp({
  projectId: serviceAccount.project_id,
  credential: cert(serviceAccount as ServiceAccount),
  storageBucket: "draw-for-them.appspot.com",
});
