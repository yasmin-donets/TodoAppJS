// SELECT ELEMENTS
const formEl = document.getElementById("todo-form");
const inputEl = document.getElementById("js-input");
const todosListEl = document.getElementById("js-list-items");

// ARRAY
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;
// 1st render
renderTodo();
renderNumTask();
//FORM SUBMIT
formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  saveTodo();
  renderTodo();
	renderNumTask();
	localStorage.setItem('todos', JSON.stringify(todos));
});

// SAVE TODO

function saveTodo() {
  const inputValue = inputEl.value;
  const isEmpty = inputValue === "";
  const isDuplicate = todos.some(
    (todo) => todo.value.toUpperCase() === inputValue.toUpperCase()
  );
  if (isEmpty) {
    alert("There is no value.");
  } else if (isDuplicate) {
    alert("Your task is dublicated");
  } else if(EditTodoId >= 0){
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? inputValue : todo.value,
      }));
      EditTodoId = -1;
			inputEl.value = "";
	}else {
    todos.push({
      value: inputValue,
      checked: false,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
    inputEl.value = "";
  }
}
// RENDER TODOS
function renderTodo() {
	// CLEAR ELEMENT BEFORE A RE-RENDER
	todosListEl.innerHTML = '';
  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
		<div class="todo" id="${index}">
				<i 
					class="bi ${todo.checked ? "fas fa-check-circle" : "far fa-circle"}"
					style="color : ${todo.color}"
					data-action="check"
				></i>
					<p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
				<i class="far fa-edit" data-action="edit"></i>
				<i class="fas fa-trash"data-action="delete"></i>
		</div>
	`;
  });
}
// CLICK EVENT LISTENER FOR ALL THE TODOS
todosListEl.addEventListener('click', (event)=>{
	const target = event.target;
	const parentElement = target.parentNode;
	if (parentElement.className !== 'todo') return;
	// t o d o id
  const todo = parentElement;
  const todoId = Number(todo.id);
	// target action
  const action = target.dataset.action;
	console.log(action,todoId)
  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
  action === 'delete' && deleteTodo(todoId);
});
function checkTodo(todoId){
	todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));
	renderTodo();
	renderNumTask();
	localStorage.setItem('todos', JSON.stringify(todos));
}
// EDIT A TODO
function editTodo(todoId) {
  inputEl.value = todos[todoId].value;
  EditTodoId = todoId;
}

// DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  // re-render
  renderTodo();
	renderNumTask();
	localStorage.setItem('todos', JSON.stringify(todos));
}

// COUNT COMPLETED TASKS
function countCompletedTasks() {
  let count = 0;
  todos.forEach((todo) => {
    if (todo.checked) {
      count++;
    }
  });
  return count;
}
//Render number of completed tasks
function renderNumTask(count){
	const completedCount = countCompletedTasks(count);
	document.querySelector('.message').innerHTML = `Completed tasks: <span>${completedCount}</span>`;
}