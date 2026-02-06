import { Router } from "express";

const router = Router();

router.get("/lookup", async (req, res, next) => {
  try {
    const term = String(req.query.term || "").trim();
    const dictionaryService = req.app.get("dictionaryService");
    const result = await dictionaryService.lookupTerm(term);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
