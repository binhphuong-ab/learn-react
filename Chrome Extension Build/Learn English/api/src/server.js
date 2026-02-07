import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import { createDictionaryService } from "./services/dictionaryService.js";

async function main() {
  await connectDb(config.mongoUri);

  const io = new Server({
    cors: {
      origin: [config.dashboardOrigin],
      credentials: true
    }
  });

  const dictionaryService = createDictionaryService({
    rapidApiHost: config.rapidApiHost,
    rapidApiKey: config.rapidApiKey,
    wordsApiBaseUrl: config.wordsApiBaseUrl,
    merriamDictionaryApiKey: config.merriamDictionaryApiKey,
    merriamDictionaryBaseUrl: config.merriamDictionaryBaseUrl,
    merriamAudioBaseUrl: config.merriamAudioBaseUrl,
    cacheTtlDays: config.cacheTtlDays,
    lookupTimeoutMs: config.lookupTimeoutMs,
    missCacheTtlMinutes: config.missCacheTtlMinutes
  });

  const app = createApp({
    io,
    dictionaryService,
    dashboardOrigin: config.dashboardOrigin
  });

  app.set("db", mongoose.connection);

  const server = http.createServer(app);
  io.attach(server);

  io.on("connection", (socket) => {
    socket.emit("connected", { ok: true });
  });

  server.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
}

main().catch((error) => {
  console.error("Failed to start API server", error);
  process.exit(1);
});
