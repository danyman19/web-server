import { Router } from "express";
import { readFile, writeFile } from "node:fs/promises";
import { Ok, Err, Some, None } from "../result.js";

const router = Router();
const ENTRIES_FILE = "entries.json";
const readEntries = async () => {
  const data = await readFile(ENTRIES_FILE, "utf-8");
  return JSON.parse(data);
};
const writeEntries = async (entries) => {
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

const validateEntry = ({ title, body }) => {
  if (!title || !body) {
    return Err("must have title/body");
  }
  return Ok({ title, body });
};

router.get("/", async (req, res) => {
  const entries = await readEntries();
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

router.post("/", async (req, res) => {
  const result = validateEntry(req.body);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  const entries = await readEntries();
  entries.push(result.value);
  await writeEntries(entries);

  res.status(201).json(result.value);
});

router.post("/classic", async (req, res) => {
  const result = validateEntry(req.body);
  if (!result.ok) {
    res.status(400).json({ error: result.error });
    return;
  }

  const data = await readFile(ENTRIES_FILE, "utf-8");
  const entries = JSON.parse(data);
  entries.push(result.value);
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));

  res.redirect("/entries");
});

const findEntryById = (entries, id) => {
  const entry = entries[id];
  return entry ? Some(entry) : None;
};

router.delete("/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const entries = await readEntries();

  const found = findEntryById(entries, id);
  if (!found.some) {
    res.status(404).json({ error: "Entry not found" });
  }

  entries.splice(id, 1);
  await writeEntries(entries);

  res.status(204).send();
});

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = Number.parseInt(req.params.id);
    const data = await readFile(ENTRIES_FILE, "utf-8");
    const entries = JSON.parse(data);

    const found = findEntryById(entries, id);
    if (!found.some) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    const result = validateEntry(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    entries[id] = result.value;
    await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
    res.status(200).json(result.value);
  }),
);

export default router;
