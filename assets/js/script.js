const task = document.querySelector("form input");

const list = document.querySelector("ul");

const todoForm = document.querySelector("form");

let message = document.getElementById("msg");

let dateInput = document.getElementById("dateInput");

let addButton = document.querySelector(".add__btn");

let editButton = document.querySelector(".edit__btn");
editButton.classList.add("btn__visibility");

var today = new Date().toISOString().split("T")[0];
document.getElementsByName("date")[0].setAttribute("min", today);

window.onload = renderTodoList;

function resetForm() {
  task.value = "";
  dateInput.value = "";
}

let taskId;

function renderTodoList() {
  try {
    const list = document.querySelector("ul");
    list.innerHTML = "";

    while (list.firstChild) {
      console.log("Inside");
      list.removeChild(list.firstChild);
    }

    if (localStorage.getItem("tasks") == null) return;

    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));

    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((task) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" 
          onclick="toggleTodoItem(this)" id="check" ${
            task.completed ? "checked" : ""
          }>
          <p class="task">${task?.task}</p>
          <p class="date__box">${formattedDate(task?.date)}</p>
          <i class="fas fa-edit" id="edit__icon" class="edit__task" onclick="updateTodoItem(this,${
            task?.todo_id
          })"></i>
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
      message.innerHTML = "Task and date can't be blank.";
      messageDisplayTime();
      return;
    } else if (task.value === "") {
      message.innerHTML = "Todo can't be blank.";
      messageDisplayTime();
      return;
    } else if (dateInput.value === "") {
      message.innerHTML = "Date can't be blank.";
      messageDisplayTime();
      return;
    } else {
      message.innerHTML = "";
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
          <p class="task">${taskInput}</p>
          <p class="date__box">${formattedDate(payload?.date)}</p>
          <i class="fas fa-edit" id="edit__icon" class="edit__task" onclick="updateTodoItem(this,${
            payload?.todo_id
          })"></i>
          <i class="fa fa-trash" onclick="deleteTodoItem(this)"></i>
        `;
    list.insertBefore(li, list.children[0]);
    message.innerHTML = "Task created successfully.";
    message.style.color = "green";
    resetForm();
    messageDisplayTime();
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
    const list = document.querySelector("ul");
    const editIcon = list.querySelector("#edit__icon");
    editIcon.classList.toggle("btn__visibility");
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
    addButton.classList.add("visibility");
    addButton.classList.remove("btn__visibility");
    editButton.classList.remove("visibility");
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

function updateTodoItem(event, todoId) {
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
}

editButton.addEventListener("click", (event) => {
  event.preventDefault();
  editCurrentTask(taskId);
});

task.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    editCurrentTask(taskId);
  }
});

const editCurrentTask = (taskId) => {
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
  message.innerHTML = "Task updated successfully.";
  message.style.color = "green";
  messageDisplayTime();
  renderTodoList();
  resetForm();
};

function messageDisplayTime() {
  setTimeout(() => {
    message.style.display = "none";
  }, 5000);
}

function formattedDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}