import express from "express";
import { readFile, writeFile } from "node:fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ENTRIES_FILE = "entries.json";
const readEntries = async () => {
  const data = await readFile(ENTRIES_FILE, "utf-8");
  return JSON.parse(data);
};
const writeEntries = async (entries) => {
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));
};

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/entries", async (req, res) => {
  const entries = await readEntries();
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

app.post("/entries", async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400).json({ error: "must have title/body" });
    return;
  }

  const entries = await readEntries();
  const newEntry = { title, body };
  entries.push(newEntry);
  await writeEntries(entries);

  res.status(201).json(newEntry);
});

app.post("/entries/classic", async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).send("title and body are required");
    return;
  }

  const data = await readFile(ENTRIES_FILE, "utf-8");
  const entries = JSON.parse(data);
  entries.push({ title, body });
  await writeFile(ENTRIES_FILE, JSON.stringify(entries, null, 2));

  res.redirect("/entries");
});

app.delete("/entries/:id", async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const entries = await readEntries();

  if (Number.isNaN(id) || id < 0 || id >= entries.length) {
    res.status(400).json({ error: "must have title/body" });
    return;
  }

  entries.splice(id, 1);
  await writeEntries(entries);

  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log("server running at http://localhost:" + PORT);
});
