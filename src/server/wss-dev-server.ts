import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";
import fetch from "node-fetch";
import { appRouter } from "./trpc/router/_app";
import { createContext } from "./trpc/context";
import { env } from "../env/server";

/**
 * This file is used to run a WebSocket server for development purposes only.
 */

if (!global.fetch) {
  (global as any).fetch = fetch;
}

const wssDevLog = (msg: string) => {
  console.log(`[Dev WSS] ${msg}`);
};

const wss = new ws.Server({
  port: env.WS_PORT,
});

wss.on("connection", (ws) => {
  wssDevLog(`Connection Added. Count: (${wss.clients.size})`);
  ws.once("close", () => {
    wssDevLog(`Connection closed. Count: (${wss.clients.size})`);
  });
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wssDevLog(`WebSocket Server listening on ws://localhost:${wss.options.port}`);

process.on("SIGTERM", () => {
  wssDevLog("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
