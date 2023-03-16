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

    while (list.firstChild) {
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
          <input type="text" value="${task?.task}" class="task ${
          task.completed ? "completed" : ""
        }"
          onfocus="getCurrentTask(this)" 
          onblur="editTodoItem(this)"
          >
          <input type="date" name="date" class="date__box" value=${
            task?.date
          } onfocus="getCurrentDate(this)" onchange="editTodoItem(this)"
          >
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
      return;
    } else if (task.value === "") {
      message.innerHTML = "Todo can't be blank.";
      return;
    } else if (dateInput.value === "") {
      message.innerHTML = "Date can't be blank.";
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
          <input type="text" value="${task?.value}" class="task" onblur="editTodoItem(this)" onfocus="getCurrentTask(this)">
          <input type="date" name="date" class="date__box" value=${payload?.date} onchange="editTodoItem(this)" onfocus="getCurrentDate(this)">
          <i class="fas fa-edit" id="edit__icon" class="edit__task" onclick="updateTodoItem(this,${payload?.todo_id})"></i>
          <i class="fa fa-trash" onclick="deleteTodoItem(this)"></i>
        `;
    list.insertBefore(li, list.children[0]);
    message.innerHTML = "Task created successfully.";
    message.style.color = "green";
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
    addButton.classList.add("visibility");
    addButton.classList.remove("btn__visibility");
    editButton.classList.remove("visibility");
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

let currentTask = null,
  currentDueDate = null;

const getCurrentTask = (event) => (currentTask = event.value);
const getCurrentDate = (event) => (currentDueDate = event.value);

const editTodoItem = (event) => {
  try {
    const todoList = JSON.parse(localStorage.getItem("tasks")) || [];
    todoList.forEach((task) => {
      if (task.task === currentTask) task.task = event.value;
      if (task.date === currentDueDate) task.date = event.value;
    });
    localStorage.setItem("tasks", JSON.stringify(todoList));
  } catch (error) {
    console.log(error);
  }
};

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

/* function editCurrentTask(taskId) {
  let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));
  const todo =
    todoList &&
    todoList?.length > 0 &&
    todoList?.find((item) => item.todo_id === taskId);
  const taskInput = task.value.trim();

  const index = todoList.findIndex((obj) => obj.todo_id === taskId);

  todoList[index].todo_id = taskId;
  todoList[index].task = taskInput;
  todoList[index].date = dateInput.value;
  todoList[index].completed = todo.completed ? true : false;

  localStorage.setItem("tasks", JSON.stringify(todoList));
  renderTodoList();
} */

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
  renderTodoList();
  resetForm();
};