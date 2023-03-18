window.onload = renderTodoList;

const task = document.querySelector("form input");

const list = document.querySelector("ul");

const todoForm = document.querySelector("form");

let dateInput = document.getElementById("dateInput");

let addButton = document.querySelector(".add__btn");

let editButton = document.querySelector(".edit__btn");
editButton.classList.add("btn__visibility");

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();

today = yyyy + "-" + mm + "-" + dd;
document.getElementById("dateInput").setAttribute("min", today);

var modal = document.getElementById("myModal");
var closeButton = document.querySelector(".close");
var cancelDeleteBtn = document.getElementById("cancelDelete");
var confirmDeleteBtn = document.getElementById("confirmDelete");

let taskId, todoIdToDelete;

dateInput.disabled = true;
addButton.disabled = true;
editButton.disabled = true;

task.addEventListener("input", () => {
  const isInputEmpty = !document.querySelector("form input").value;
  dateInput.disabled = isInputEmpty;
  addButton.disabled = isInputEmpty;
  editButton.disabled = isInputEmpty;
});

function resetForm() {
  task.value = "";
  dateInput.value = "";
  dateInput.disabled = true;
  addButton.disabled = true;
  taskId = "";
}

function renderTodoList() {
  try {
    task.focus();
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
          <input type="checkbox" onclick="toggleTodoItem(this)" id="check" ${
            task.completed ? "checked" : ""
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
            task?.completed ? "disabled" : ""
          }" id="edit__icon" onclick="updateTodoItem(${
          task?.todo_id
        })"></i>                   
          <i class="fa fa-trash" onclick="showDeleteModal(${
            task?.todo_id
          })"></i>
        `;
        list.insertBefore(li, list.children[0]);
      });
  } catch (error) {
    console.log(error);
  }
}

function addTodo() {
  try {
    const payload = {
      todo_id: new Date().getTime(),
      task: task.value.trim(),
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
    toast("Task created successfully.");
    renderTodoList();
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
    let todoList = Array.from(JSON.parse(localStorage.getItem("tasks")));
    const taskId = Number(
      event.parentNode
        .querySelector("#edit__icon")
        .getAttribute("onclick")
        .match(/\d+/)[0]
    );
    let task = todoList.find((task) => task.todo_id === taskId);
    if (task) {
      task.completed = !task.completed;
      localStorage.setItem("tasks", JSON.stringify(todoList));
      event.nextElementSibling.classList.toggle("completed");
    }
    renderTodoList();
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
  addButton.classList.remove("visibility");
  editButton.classList.add("visibility");
  editButton.classList.remove("btn__visibility");
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
  const index = todoList?.findIndex((obj) => obj.todo_id === taskId);
  todoList[index] = {
    ...todoList[index],
    task: task.value.trim(),
    date: dateInput.value,
  };
  localStorage.setItem("tasks", JSON.stringify(todoList));
  addButton.classList.add("visibility");
  addButton.classList.remove("btn__visibility");
  editButton.classList.add("btn__visibility");
  editButton.classList.remove("visibility");
  toast("Task updated successfully.");
  renderTodoList();
  resetForm();
}

function formattedDate(inputDate) {
  const date = new Date(inputDate);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function toast(message) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = message;
  x.style.backgroundColor = "#61bd4f";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

function showDeleteModal(todoId) {
  todoIdToDelete = todoId;
  modal.style.display = "block";
}

function hideDeleteModal() {
  modal.style.display = "none";
}

function deleteConfirmed() {
  deleteTodoItem(todoIdToDelete);
  hideDeleteModal();
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
    toast("Task deleted successfully.");
    resetForm();
  } catch (error) {
    console.log(error);
  }
}

cancelDeleteBtn.addEventListener("click", hideDeleteModal);
closeButton.addEventListener("click", hideDeleteModal);
confirmDeleteBtn.addEventListener("click", deleteConfirmed);

// Close the modal when the user clicks outside of it
window.onclick = function (event) {
  if (event.target == modal) {
    hideDeleteModal();
  }
};
