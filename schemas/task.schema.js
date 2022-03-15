const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
