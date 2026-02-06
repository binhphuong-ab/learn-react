import cors from "cors";
import express from "express";
import morgan from "morgan";

import healthRoutes from "./routes/health.js";
import lookupRoutes from "./routes/lookup.js";
import vocabRoutes from "./routes/vocab.js";
import statsRoutes from "./routes/stats.js";
import importExportRoutes from "./routes/importExport.js";
import settingsRoutes from "./routes/settings.js";

export function createApp({ io, dictionaryService, dashboardOrigin }) {
  const app = express();

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          return callback(null, true);
        }

        if (origin === dashboardOrigin || origin.startsWith("chrome-extension://")) {
          return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
      }
    })
  );

  app.use(morgan("dev"));
  app.use(express.json({ limit: "2mb" }));

  app.set("io", io);
  app.set("dictionaryService", dictionaryService);

  app.use(healthRoutes);
  app.use("/api", lookupRoutes);
  app.use("/api", vocabRoutes);
  app.use("/api", statsRoutes);
  app.use("/api", importExportRoutes);
  app.use("/api", settingsRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  app.use((error, req, res, next) => {
    const status = error.status || 500;
    if (status >= 500) {
      console.error(error);
    }

    res.status(status).json({
      error: error.message || "Internal server error"
    });
  });

  return app;
}
