import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TODOS_FILE = path.join(__dirname, "todos.json");

if (!fs.existsSync(TODOS_FILE)) {
  fs.writeFileSync(TODOS_FILE, "[]");
}

const readTodos = () => JSON.parse(fs.readFileSync(TODOS_FILE, "utf8"));
const writeTodos = (todos) =>
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { todos: readTodos() });
});

app.post("/todo", (req, res) => {
  const todos = readTodos();
  const nextId = todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;

  todos.push({
    id: nextId,
    description: req.body.description,
    completed: false,
  });

  writeTodos(todos);
  res.redirect("/");
});

app.post("/todo/:id/toggle", (req, res) => {
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id === Number(req.params.id));

  if (todo) {
    todo.completed = !todo.completed;
    writeTodos(todos);
  }

  res.redirect("/");
});

app.post("/todo/:id/delete", (req, res) => {
  const todos = readTodos().filter((todo) => todo.id !== Number(req.params.id));

  writeTodos(todos);
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Todornaut kjører på http://localhost:${port}`));
