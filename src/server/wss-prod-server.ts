import { applyWSSHandler } from "@trpc/server/adapters/ws";
import http from "http";
import next from "next";
import { parse } from "url";
import ws from "ws";
import { env } from "../env/server.mjs";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router/_app";

const app = next({ dev: env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const server = http.createServer((req, res) => {
  const proto = req.headers["x-forwarded-proto"];
  if (proto && proto === "http") {
    res.writeHead(303, {
      location: `https://` + req.headers.host + (req.headers.url ?? ""),
    });
    res.end();

    return;
  }

  if (!req.url) {
    return;
  }

  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
});

app.prepare().then(() => {
  const wss = new ws.Server({ server });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext });

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
  });
  server.listen(env.PORT);

  console.log(
    `> Server listening at http://localhost:${env.PORT} as ${env.NODE_ENV}`
  );
});
