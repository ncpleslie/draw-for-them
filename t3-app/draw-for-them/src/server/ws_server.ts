import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./router/index";
import { createContext } from "./router/context";

const wss = new ws.Server({
  port: 3001,
});

const handler = applyWSSHandler({ wss, createContext, router: appRouter });

wss.on("connection", () => {
  console.log(`New connection made. Total connections: ${wss.clients.size}.`);
});

wss.on("close", () => {
  console.log(
    `Previous connection ended. Total connections: ${wss.clients.size}.`
  );
});

console.log("ws server started...");

process.on("SIGTERM", () => {
  console.log(
    "SIGTERM has occurred. Broadcasting to previous connections to reconnect."
  );
  handler.broadcastReconnectNotification();

  wss.close();
});
