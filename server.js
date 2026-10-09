import express from "express";
import entriesRouter from "./routes/entries.js";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/entries", entriesRouter);
// app.use(express.urlencoded({ extended: true }));

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.use((req, res) => {
  res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
  console.log("server running at http://localhost:" + PORT);
});
