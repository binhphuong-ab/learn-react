import { Router } from "express";

const router = Router();

router.get("/health", async (req, res) => {
  const db = req.app.get("db");
  const dbReady = Boolean(db?.readyState === 1);

  res.json({
    ok: true,
    service: "learn-english-api",
    dbReady,
    now: new Date().toISOString()
  });
});

export default router;
