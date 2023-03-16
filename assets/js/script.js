const task = document.querySelector("form input");

const list = document.querySelector("ul");

const todoForm = document.querySelector("form");

let errorMessage = document.getElementById("msg");

let dateInput = document.getElementById("dateInput");

let addButton = document.querySelector(".add__btn");

let editButton = document.querySelector(".edit__btn");
editButton.style.display = "none";

var today = new Date().toISOString().split("T")[0];
document.getElementsByName("date")[0].setAttribute("min", today);

window.onload = renderTodoList;

function resetForm() {
  task.value = "";
  dateInput.value = "";
}

function renderTodoList() {
  try {
    if (localStorage.getItem("tasks") == null) return;

    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));

    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((task) => {
        const list = document.querySelector("ul");
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" 
          onclick="toggleTodoItem(this)" id="check" ${
            task.completed ? "checked" : ""
          }>
          <input type="text" value="${task?.task}" class="task ${
          task.completed ? "completed" : ""
        }"
          onfocus="getCurrentTask(this)" 
          onblur="editTodoItem(this)"
          >
          <input type="date" class="date__box" value=${
            task?.date
          } onfocus="getCurrentDate(this)" onchange="editTodoItem(this)"
          >
          <i class="fa fa-trash" onclick="deleteTodoItem(this)"></i>
        `;
        list.insertBefore(li, list.children[0]);
      });
  } catch (error) {
    console.log(error);
  }
}

function addTodo() {
  try {
    if (task.value === "" && dateInput.value === "") {
      errorMessage.innerHTML = "Task and date can't be blank.";
      return;
    } else if (task.value === "") {
      errorMessage.innerHTML = "Todo can't be blank.";
      return;
    } else if (dateInput.value === "") {
      errorMessage.innerHTML = "Date can't be blank.";
      return;
    } else {
      errorMessage.innerHTML = "";
    }

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
    li.innerHTML = `
          <input type="checkbox" onclick="toggleTodoItem(this)" id="check">
          <input type="text" value="${task?.value}" class="task" onblur="editTodoItem(this)">
          <input type="date" class="date__box" value=${payload?.date}>
          <i class="fa fa-trash" onclick="deleteTodoItem(this)"></i>
        `;
    list.insertBefore(li, list.children[0]);

    resetForm();
  } catch (error) {
    console.log(error);
  }
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

function deleteTodoItem(event) {
  try {
    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));
    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((task) => {
        if (task.task === event.parentNode.children[1].value) {
          todoList?.splice(todoList.indexOf(task), 1);
        }
      });
    localStorage.setItem("tasks", JSON.stringify(todoList));
    event.parentElement.remove();
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

var currentTask = null;
var currentDueDate = null;

function getCurrentTask(event) {
  currentTask = event.value;
}

function getCurrentDate(event) {
  currentDueDate = event.value;
}

function editTodoItem(event) {
  try {
    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));
    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((task) => {
        if (task.task === currentTask) {
          task.task = event.value;
        }
        if (task.date === currentDueDate) {
          task.date = event.value;
        }
      });
    localStorage.setItem("tasks", JSON.stringify(todoList));
  } catch (error) {
    console.log(error);
  }
}
