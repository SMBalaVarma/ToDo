let toggleBtnArr = document.querySelectorAll(".toggle-btn");
let listContainer = document.querySelector(".list");
let plusBtn = document.querySelector(".plus-btn");
let newTodoBtn = document.querySelector(".new-todo-btn");

let tasksArr = [
  {
    id: 0,
    content: "Eat Food",
    status: "pending",
  },
  {
    id: 1,
    content: "Listen music",
    status: "completed",
  },
  {
    id: 2,
    content: "Make Notes",
    status: "pending",
  },
  {
    id: 3,
    content: "Do class",
    status: "pending",
  },
];

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

loadList("pending");

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
      addTask(this.value);
      this.value = ""; // Clear input field after adding task
      this.classList.remove("active"); // Hide input field
    }
  });

  newTodoBtn.appendChild(taskInput);
});

function addTask(taskContent) {
  let newTask = {
    id: tasksArr.length, // Assigning a unique id
    content: taskContent,
    status: "pending",
  };

  tasksArr.push(newTask);
  loadList("pending"); // Reload the list to reflect the changes
}

// Adding event listener for "done" button click
// Adding event listener for the "done" button to mark task as completed
document.addEventListener("click", function(event) {
  if (event.target.classList.contains("done-btn")) {
    let taskId = event.target.closest(".task").id;
    let taskIndex = tasksArr.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
      tasksArr[taskIndex].status = "completed";
      loadList("pending"); // Reload the list of pending tasks
    }
  }
});

document.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    let taskId = event.target.closest(".task").id;
    let taskIndex = tasksArr.findIndex(task => task.id === parseInt(taskId));
    if (taskIndex !== -1) {
      tasksArr.splice(taskIndex, 1); // Remove the task from the array
      loadList("pending"); // Reload the list of pending tasks
    }
  }
});