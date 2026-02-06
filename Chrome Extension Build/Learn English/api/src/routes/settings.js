import { Router } from "express";
import { Setting } from "../models/Setting.js";

const router = Router();

async function getOrCreateSettings() {
  let settings = await Setting.findOne({ key: "default" });
  if (!settings) {
    settings = await Setting.create({ key: "default" });
  }
  return settings;
}

router.get("/settings", async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put("/settings", async (req, res, next) => {
  try {
    const payload = req.body || {};
    const settings = await Setting.findOneAndUpdate(
      { key: "default" },
      { $set: { ...payload, key: "default" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(settings);
  } catch (error) {
    next(error);
  }
});

export default router;
