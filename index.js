let ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./schemas/task.schema");

const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());

app.get("/calendar", async (req, res) => {
  console.log(`Requête GET /calendar effectuée`);

  let newArray = [];
  // Récupérer les tâches de la BDD
  const dbTasks = await Task.find();

  res.render("calendar", { tasksList: dbTasks });
});

app.get("/", async (req, res) => {
  console.log(`Requête GET effectuée`);

  res.sendFile(__dirname + "/index.html");
});

app.post("/delete", async (req, res) => {
  console.log(`Requête POST /delete effectuée`);
  const body = req.body; // { taskSelect: "test" }

  const deleteTask = async () => {
    const del = await Task.deleteOne({ title: body.taskSelected });
  };

  // Fonction appelée si la requête contient bien le titre de la tâche
  req.body.taskSelected && deleteTask();

  res.redirect("/calendar");
});

app.post("/", async (req, res) => {
  console.log(`Requête POST effectuée`);

  // Ajouter une tâche
  const addTask = async (userTask) => {
    const newTask = new Task({
      title: userTask.title,
      start: userTask.start,
      end: userTask.end,
    });
    await newTask.save();
  };

  // S'il y a un title dans la request alors ajouter la tâche (rajouter vérification pour start et end)
  req.body.title && addTask(req.body);

  res.redirect("/calendar");
});

app.listen(port, () => {
  console.log(`En écoute sur http://localhost:${port}`);

  // Connexion à la BDD
  async function main() {
    await mongoose.connect("mongodb://localhost:27017/todolist");

    console.log(`Connexion à la BDD effectuée !`);

    // Affiche la liste des tâches
    /* const tasks = await Task.find();
    console.log(tasks); */
  }

  main().catch((err) => console.log(err));

  // CTRL + C va fermer la connexion Mongoose
  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log("Mongoose disconnected on app termination");
      process.exit(0);
    });
  });
});
