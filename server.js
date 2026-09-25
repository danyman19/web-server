import express from "express";
import apiRouter from "./routes/api.js";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(express.json());

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

const entries = [
  { title: "First note", body: "Notes from the first session." },
  { title: "Second note", body: "Notes from the second session." },
  { title: "Third note", body: "Notes from the third session." },
];

app.get("/entries", (req, res) => {
  res.set("Cache-Control", "public, max-age=60");
  res.set("X-Total-Count", entries.length);
  res.status(200).render("entries", { title: "My Notes", entries });
});

app.post("/entries", (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400).json({ error: "must have title/body" });
  }

  const newEntry = { title, body };
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

const books = [{ name: "Harry Potter", author: "JK Rowling" }];

app.get("/books", (req, res) => {
  res.json(books);
});

app.post("/books", (req, res) => {
  const { name, author } = req.body;
  if (!name || !author) {
    res.status(500).send("Missing a name/author field");
    return;
  }
  books.push({ name, author });
  res.status(201).json({ name, author });
});

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log("server running at http://localhost:" + PORT);
});
