let toggleBtnArr = document.querySelectorAll(".toggle-btn");
let listContainer = document.querySelector(".list");
let plusBtn = document.querySelector(".plus-btn");
let newTodoBtn = document.querySelector(".new-todo-btn");

// Open IndexedDB database
let db;
let request = window.indexedDB.open("ToDoListDB", 1);

request.onerror = function(event) {
  console.log("IndexedDB error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
  db = event.target.result;
  loadTasks(); // Load tasks from IndexedDB on success
};

request.onupgradeneeded = function(event) {
  db = event.target.result;
  let objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
  objectStore.createIndex("content", "content", { unique: false });
  objectStore.createIndex("status", "status", { unique: false });
};

// Function to load tasks from IndexedDB
async function loadTasks() {
  let transaction = db.transaction(["tasks"], "readonly");
  let objectStore = transaction.objectStore("tasks");
  let request = objectStore.getAll();

  request.onsuccess = function(event) {
    tasksArr = event.target.result;
    loadList("pending"); // Load tasks into the UI
  };

  request.onerror = function(event) {
    console.log("Error loading tasks: " + event.target.errorCode);
  };
}

// Function to add task to IndexedDB
async function addTaskToDB(taskContent) {
  let transaction = db.transaction(["tasks"], "readwrite");
  let objectStore = transaction.objectStore("tasks");
  let request = objectStore.add({ content: taskContent, status: "pending" });

  request.onsuccess = function(event) {
    console.log("Task added to IndexedDB");
  };

  request.onerror = function(event) {
    console.log("Error adding task to IndexedDB: " + event.target.errorCode);
  };
}

let loadList = (category) => {
  listContainer.innerHTML = "";
  let icon =
    category === "completed" ? "assignment_turned_in" : "check_box_outline_blank";

  for (let i = 0; i < tasksArr.length; i++) {
    let task = tasksArr[i];
    if (task.status == category) {
      let taskDiv = document.createElement("div");
      taskDiv.innerHTML = `
          <div class="task" id=${task.id}>
            <span class="material-icons done-btn"> ${icon} </span>
            <div class="task-content" contenteditable="true">${task.content}</div>
            <span class="material-icons delete-btn"> dangerous </span>
          </div>`;

      listContainer.appendChild(taskDiv);
    }
  }
};

for (let i = 0; i < toggleBtnArr.length; i++) {
  toggleBtnArr[i].addEventListener("click", (e) => {
    e.target.classList.remove("inactive-btn");
    toggleBtnArr[(i + 1) % toggleBtnArr.length].classList.add("inactive-btn");

    let category = e.target.classList[0];
    loadList(category);
  });
}

plusBtn.addEventListener("click", (e) => {
  let taskInput = document.createElement("input");
  taskInput.setAttribute("type", "text");
  taskInput.classList.add("task-input", "active");

  taskInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      addTask(this.value); // Add task to IndexedDB
      this.value = ""; // Clear input field after adding task
      this.classList.remove("active"); // Hide input field
    }
  });

  newTodoBtn.appendChild(taskInput);
});

async function addTask(taskContent) {
  await addTaskToDB(taskContent); // Add task to IndexedDB
  await loadTasks(); // Reload the tasks from IndexedDB
}

// Adding event listener for "done" button click
document.addEventListener("click", async function(event) {
  if (event.target.classList.contains("done-btn")) {
    let taskId = event.target.closest(".task").id;
    let taskIndex = tasksArr.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
      tasksArr[taskIndex].status = "completed";
      await updateTaskInDB(tasksArr[taskIndex]); // Update task status in IndexedDB
      await loadTasks(); // Reload the tasks from IndexedDB
    }
  }
});

// Adding event listener for "delete" button click
document.addEventListener("click", async function(event) {
  if (event.target.classList.contains("delete-btn")) {
    let taskId = event.target.closest(".task").id;
    let taskIndex = tasksArr.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
      await deleteTaskFromDB(taskId); // Delete task from IndexedDB
      await loadTasks(); // Reload the tasks from IndexedDB
    }
  }
});

// Function to update task in IndexedDB
async function updateTaskInDB(task) {
  let transaction = db.transaction(["tasks"], "readwrite");
  let objectStore = transaction.objectStore("tasks");
  let request = objectStore.put(task);

  request.onerror = function(event) {
    console.log("Error updating task: " + event.target.errorCode);
  };
}

// Function to delete task from IndexedDB
async function deleteTaskFromDB(taskId) {
  let transaction = db.transaction(["tasks"], "readwrite");
  let objectStore = transaction.objectStore("tasks");
  let request = objectStore.delete(parseInt(taskId));

  request.onerror = function(event) {
    console.log("Error deleting task: " + event.target.errorCode);
  };
}
