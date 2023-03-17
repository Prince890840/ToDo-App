window.onload = renderTodoList;

const task = document.querySelector("form input");

const list = document.querySelector("ul");

const todoForm = document.querySelector("form");

let dateInput = document.getElementById("dateInput");

let addButton = document.querySelector(".add__btn");

let editButton = document.querySelector(".edit__btn");
editButton.classList.add("btn__visibility");

var today = new Date().toISOString().split("T")[0];
document.getElementsByName("date")[0].setAttribute("min", today);

let taskId;

dateInput.disabled = true;
addButton.disabled = true;
editButton.disabled = true;

task.addEventListener("input", stateHandle);

function stateHandle() {
  if (document.querySelector("form input").value === "") {
    dateInput.disabled = true;
    addButton.disabled = true;
    editButton.disabled = true;
  } else {
    console.log("Else condition called.");
    dateInput.disabled = false;
    addButton.disabled = false;
    editButton.disabled = false;
  }
}

function resetForm() {
  task.value = "";
  dateInput.value = "";
  dateInput.disabled = true;
  addButton.disabled = true;
  editButton.disabled = true;
  taskId = "";
}

function renderTodoList() {
  try {
    const list = document.querySelector("ul");
    list.innerHTML = "";

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    if (localStorage.getItem("tasks") == null) return;

    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));

    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((task) => {
        const li = document.createElement("li");

        const dueDate = new Date(task?.date);
        const currentDate = new Date();

        li.innerHTML = `
          <input type="checkbox" 
          onclick="toggleTodoItem(this)" id="check" ${
            task?.completed ? "checked" : ""
          }>
          <p class="task truncate ${task?.completed ? "completed" : ""}">${
          task?.task
        }</p>
          <p class="date__box ${
            task?.date
              ? dueDate.getTime() < currentDate.getTime()
                ? "overdue__date"
                : "leftfordue__date"
              : ""
          }">${task?.date ? formattedDate(task?.date) : "-"}</p>
          <i class="fas fa-edit ${
            task?.completed ? "update__icon" : ""
          }" id="edit__icon" class="edit__task" onclick="updateTodoItem(${
          task?.todo_id
        })"></i>
          <i class="fa fa-trash" onclick="deleteTodoItem(${task?.todo_id})"></i>
        `;
        list.insertBefore(li, list.children[0]);
      });
  } catch (error) {
    console.log(error);
  }
}

function addTodo() {
  try {
    const taskInput = task.value.trim();

    const payload = {
      todo_id: new Date().getTime(),
      task: taskInput,
      completed: false,
      date: dateInput.value,
    };

    localStorage.setItem(
      "tasks",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("tasks") || "[]"),
        payload,
      ])
    );

    const li = document.createElement("li");
    const dueDate = new Date(payload?.date);
    const currentDate = new Date();
    li.innerHTML = `
          <input type="checkbox" onclick="toggleTodoItem(this)" id="check">
          <p class="task truncate">${taskInput}</p>
          <p class="date__box ${
            payload?.date
              ? dueDate.getTime() < currentDate.getTime()
                ? "overdue__date"
                : "leftfordue__date"
              : ""
          }">${payload?.date ? formattedDate(payload?.date) : "-"}</p>
          <i class="fas fa-edit ${
            payload?.completed ? "update__icon" : ""
          }" id="edit__icon" class="edit__task" onclick="updateTodoItem(${
      payload?.todo_id
    })"></i>
          <i class="fa fa-trash" onclick="deleteTodoItem(${
            payload?.todo_id
          })"></i>
        `;
    list.insertBefore(li, list.children[0]);
    // toast("Task created successfully.", "#61bd4f");
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

const taskElement = list.querySelector("truncate");
if (task.value.length > 20) {
  taskElement.classList.add("truncate");
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo();
});

function toggleTodoItem(event) {
  try {
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    tasks.forEach((task) => {
      if (task.task === event.nextElementSibling.value) {
        task.completed = !task.completed;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    event.nextElementSibling.classList.toggle("completed");
  } catch (error) {
    console.log(error);
  }
}

function deleteTodoItem(todoId) {
  try {
    let todoList = JSON.parse(localStorage.getItem("tasks")) || [];
    todoList =
      todoList &&
      todoList?.length > 0 &&
      todoList?.filter((item) => item.todo_id !== todoId);
    localStorage.setItem("tasks", JSON.stringify(todoList));
    renderTodoList();
    addButton.classList.add("visibility");
    addButton.classList.remove("btn__visibility");
    editButton.classList.remove("visibility");
    // toast("Task deleted successfully.", "#61bd4f");
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

function updateTodoItem(todoId) {
  taskId = todoId;
  let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));
  const todo =
    todoList &&
    todoList?.length > 0 &&
    todoList?.find((item) => item.todo_id === todoId);
  task.value = todo?.task;
  dateInput.value = todo?.date;
  addButton.classList.add("btn__visibility");
  editButton.classList.add("visibility");
  dateInput.disabled = false;
  editButton.disabled = false;
}

editButton.addEventListener("click", (event) => {
  event.preventDefault();
  editCurrentTask(taskId);
});

task.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    if (taskId) {
      editCurrentTask(taskId);
    } else {
      addTodo();
    }
  }
});

function editCurrentTask(taskId) {
  const todoList = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskInput = task.value.trim();
  const index = todoList?.findIndex((obj) => obj.todo_id === taskId);
  todoList[index] = {
    ...todoList[index],
    task: taskInput,
    date: dateInput.value,
  };
  localStorage.setItem("tasks", JSON.stringify(todoList));
  addButton.classList.add("visibility");
  addButton.classList.remove("btn__visibility");
  editButton.classList.remove("visibility");
  // toast("Task updated successfully.", "#61bd4f");
  renderTodoList();
  resetForm();
}

function formattedDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function toast(message, bgColor) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = message;
  x.style.backgroundColor = bgColor;
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}
