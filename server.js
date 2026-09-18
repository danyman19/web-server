import express from "express";
import apiRouter from "./routes/api.js";
import { join } from "path";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
// app.get("/", (req, res) => {
//   res.sendFile(join(import.meta.dirname, "public", "index.html"));
// });

// app.get("/entries", (req, res) => {
//   const entries = [
//     { title: "First note", body: "one" },
//     { title: "Second note", body: "two" },
//     { title: "Third note", body: "three" },
//   ];
//   res.render("entries", { entries: entries });
// });

app.get("/events", (req, res) => {
  const events = [
    // { title: "Birthday Party" },
    // { title: "Coding Class" },
    // { title: "Dinner" },
  ];

  res.render("events", { events });
});

app.get("/entries", (req, res) => {
  const entries = [
    { title: "First note" },
    { title: "Second note" },
    { title: "note 3" },
  ];
  const inner =
    "<ul>" + entries.map((e) => `<li>${e.title}</li>`).join("") + "</ul>";
  res.render("layout", { title: "Entries", body: inner, entries });
});
app.get("/entries/:id", (req, res) => {
  const entries = [
    { title: "First note", body: "one" },
    { title: "Second note", body: "two" },
    { title: "Third note", body: "three" },
  ];
  const id = req.params.id;
  if (id < 0 || id >= entries.length) {
    res.status(404).send("Invalid ID");
    return;
  }
  const inner = entries[id].title;
  res.render("layout", { title: "Entry #" + id, body: inner });
});

app.get("/hello", (req, res) => {
  res.send("I am learning how to develop a website :D");
});

app.get("/hello/:name", (req, res) => {
  res.send("Hello, " + req.params.name + "!");
});

app.get("/repeat/:word", (req, res) => {
  let x = req.params.word;

  res.send(x + " " + x + " " + x);
});

app.get("/count", (req, res) => {
  let from = req.query.from || 1;
  let to = req.query.to || 10;

  res.send("Counting from " + from + " to " + to);
});

app.use("/api", apiRouter);

app.get("/projects", (req, res) => {
  const projects = [
    { name: "Weather app", tag: "javascript" },
    { name: "Portfolio site", tag: "express" },
    { name: "Budget tracker", tag: "python" },
  ];
  const tag = req.query.tag || null;

  if (tag == null) {
    res.send(projects);
    return;
  }

  const out = [];

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].tag == tag) {
      out.push(projects[i]);
    }
  }

  if (out.length == 0) {
    res.send("No projects found with that tag");
    return;
  }

  res.send(out);
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log("server running at http://localhost:" + PORT);
});
