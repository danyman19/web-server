import { Router } from "express";

const router = Router();
router.get("/status", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

router.get("/info", (req, res) => {
  res.json({ name: "Daniel", description: "Web Developer" });
});

router.get("/error", (req, res) => {
  res.status(400).send("Bad request.");
});

export default router;
