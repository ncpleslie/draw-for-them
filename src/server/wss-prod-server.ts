import { applyWSSHandler } from "@trpc/server/adapters/ws";
import http from "http";
import next from "next";
import { parse } from "url";
import { WebSocketServer } from "ws";
import type { Socket } from "net";
import { env } from "../env/server";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router/_app";

const app = next({ dev: env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // const proto = req.headers["x-forwarded-proto"];
    // if (proto && proto === "http") {
    //   res.writeHead(303, {
    //     location: `https://` + req.headers.host + (req.headers.url ?? ""),
    //   });
    //   res.end();

    //   return;
    // }

    if (!req.url) {
      return;
    }

    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const wss = new WebSocketServer({ server });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext });

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
  });

  server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket as Socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  server.listen(env.PORT, "0.0.0.0", () => {
    const address = server.address();
    console.log(`Next address: ${JSON.stringify(address)}`);
    console.log(
      `> Server listening at http://localhost:${env.PORT} as ${env.NODE_ENV}`
    );
  });
});
