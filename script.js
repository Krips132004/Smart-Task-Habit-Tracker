// Task Class
class Task {
  constructor(title, description, category, dueDate) {
    this.id = Date.now();
    this.title = title;
    this.description = description;
    this.category = category;
    this.dueDate = dueDate;
    this.status = "pending";
  }

  markComplete() {
    this.status = "completed";
  }
}

// Example of inheritance
class SpecialHabit extends Task {
  constructor(title, description, category, dueDate, frequency) {
    super(title, description, category, dueDate);
    this.frequency = frequency; // daily/weekly habit
  }
}

let tasks = [];

// DOM Elements
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalTasksEl = document.getElementById("totalTasks");
const completedTasksEl = document.getElementById("completedTasks");
const pendingTasksEl = document.getElementById("pendingTasks");
const overdueTasksEl = document.getElementById("overdueTasks");

// Add Task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("category").value;
  const dueDate = document.getElementById("dueDate").value;

  const task = new Task(title, description, category, dueDate);
  tasks.push(task);
  taskForm.reset();
  renderTasks();
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    task.category.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (filterStatus.value !== "all") {
    filteredTasks = filteredTasks.filter((task) => {
      if (filterStatus.value === "overdue") {
        return new Date(task.dueDate) < new Date() && task.status !== "completed";
      }
      return task.status === filterStatus.value;
    });
  }

  filteredTasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = `col-md-4`;
    card.innerHTML = `
      <div class="card task-card p-3 ${task.status === "completed" ? "task-completed" : ""}">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        <small>📂 ${task.category} | ⏰ ${task.dueDate}</small>
        <div class="mt-2">
          <button class="btn btn-success btn-sm me-2" onclick="completeTask(${task.id})">Complete</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </div>
    `;
    taskList.appendChild(card);
  });

  updateDashboard();
}

// Complete Task
function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.markComplete();
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}

// Update Dashboard
function updateDashboard() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const overdue = tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "completed").length;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  pendingTasksEl.textContent = pending;
  overdueTasksEl.textContent = overdue;
}

// Search & Filter
searchInput.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);
