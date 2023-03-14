let todoList = JSON.parse(localStorage.getItem("todoList")) || [];

renderTodoList();

function renderTodoList() {
  try {
    const todoListElement = document.getElementById("todoList");
    const taskInput = document.getElementById("task");
    taskInput.focus();
    todoListElement.innerHTML = "";
    todoList &&
      todoList?.length > 0 &&
      todoList?.forEach((todo) => {
        const todoElement = document.createElement("li");
        const checkboxElement = document.createElement("input");

        const todoStatusDiv = document.createElement("div");
        const todoTaskPara = document.createElement("p");
        const todoEditDiv = document.createElement("div");
        const todoDeleteDiv = document.createElement("div");

        checkboxElement.type = "checkbox";
        checkboxElement.checked = todo?.todo_status;
        checkboxElement.onchange = () => toggleTodoItem(todo?.id);

        todoStatusDiv.appendChild(checkboxElement);
        todoStatusDiv.classList.add("check__mark");
        todoElement.appendChild(todoStatusDiv);

        todoTaskPara.appendChild(document.createTextNode(todo?.task));
        todoElement.appendChild(todoTaskPara);
        if (todo?.todo_status) {
          todoElement.style.textDecoration = "line-through";
          todoTaskPara.style.backgroundColor = "rgb(229 223 223)";
        }

        todoEditDiv.innerHTML = '<i class="fas fa-edit"></i>';
        todoEditDiv.classList.add("edit__icon");
        todoEditDiv.onclick = () => editTodoItem(todo?.id);

        todoDeleteDiv.innerHTML = '<i class="fas fa-trash"></i>';
        todoDeleteDiv.classList.add("delete__icon");
        todoDeleteDiv.onclick = () => deleteTodoItem(todo?.id);

        todoElement.appendChild(todoEditDiv);
        todoElement.appendChild(todoDeleteDiv);
        todoListElement.appendChild(todoElement);
      });
  } catch (error) {
    console.log(error);
  }
}

function addTodo() {
  try {
    const taskInput = document.getElementById("task");
    const task = taskInput.value.trim();
    if (!task) {
      alert("Please enter a task");
      return;
    }
    const todo = {
      id: new Date().getTime(),
      task: task,
      todo_status: false,
    };
    todoList?.push(todo);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    taskInput.value = "";
    renderTodoList();
  } catch (error) {
    console.log(error);
  }
}

function editTodoItem(todoId) {
  try {
    const todo =
      todoList &&
      todoList?.length > 0 &&
      todoList?.find((item) => item.id === todoId);
    const newTask = prompt("Enter new task:", todo?.task);
    if (!newTask) {
      return;
    }
    todo.task = newTask;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList();
  } catch (error) {
    console.log(error);
  }
}

function deleteTodoItem(todoId) {
  try {
    todoList =
      todoList &&
      todoList?.length > 0 &&
      todoList?.filter((item) => item.id !== todoId);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList();
  } catch (error) {
    console.log(error);
  }
}

function toggleTodoItem(todoId) {
  try {
    const todo =
      todoList &&
      todoList?.length > 0 &&
      todoList?.find((item) => item.id === todoId);
    todo.todo_status = !todo?.todo_status;
    localStorage.setItem("todoList", JSON.stringify(todoList));
    renderTodoList();
  } catch (error) {
    console.log(error);
  }
}
