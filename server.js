import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TODOS_FILE = path.join(__dirname, "todos.json");

// Et par eksempler, så lista ikke er tom før skjemaet er bygget.
// De får ulik createdAt, så popoveren på holdeplass 9 har noe å vise.
const DAY = 24 * 60 * 60 * 1000;
const EXAMPLE_TODOS = [
  {
    id: 1,
    description: "Male perrongen",
    completed: false,
    createdAt: new Date(Date.now() - DAY).toISOString(),
  },
  {
    id: 2,
    description: "Bytte til vinterrutetabell",
    completed: true,
    createdAt: new Date(Date.now() - 5 * DAY).toISOString(),
  },
];

if (!fs.existsSync(TODOS_FILE)) {
  fs.writeFileSync(TODOS_FILE, JSON.stringify(EXAMPLE_TODOS, null, 2));
}

const readTodos = () => JSON.parse(fs.readFileSync(TODOS_FILE, "utf8"));
const writeTodos = (todos) =>
  fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2));

// Monoton teller: id-er gjenbrukes aldri, heller ikke etter sletting.
// Det er viktig fordi view-transition-name er avledet av id-en.
let nextId = readTodos().reduce((max, todo) => Math.max(max, todo.id), 0) + 1;

// Teksten popoveren på holdeplass 9 viser. Todos laget før createdAt fantes
// i modellen har ingen dato — da sier vi det rett ut i stedet for å krasje.
const created = (todo) =>
  todo.createdAt
    ? new Date(todo.createdAt).toLocaleString("no-NO", {
        dateStyle: "long",
        timeStyle: "short",
      })
    : "et ukjent tidspunkt";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { todos: readTodos(), created });
});

app.post("/todo", (req, res) => {
  const todos = readTodos();

  todos.push({
    id: nextId++,
    description: req.body.description,
    completed: false,
    createdAt: new Date().toISOString(),
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
app.listen(port, () => console.log(`Rutine kjører på http://localhost:${port}`));
