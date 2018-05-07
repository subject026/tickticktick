// Increase / Reduce todo count
function getMeta() {
  return JSON.parse(localStorage.getItem("meta"));
}
function setMeta(meta) {
  localStorage.setItem("meta", JSON.stringify(meta));
}

function setView(newView) {
  let newMeta = getMeta();
  newMeta.view = newView;
  setMeta(newMeta);
}


function getTodo(id) {
  // return individual todo
  return JSON.parse(localStorage.getItem(id));
}
function setTodo(todo) {
  deleteLocalStore(todo.id);  
  localStorage.setItem(todo.id, JSON.stringify(todo));
}

function addLocalStore(newTodo) {

  // Increase Count
  let meta = getMeta();
  meta.count++;
  setMeta(meta);

  // Store new data object
  let todos = JSON.parse(localStorage.getItem("todos"));

  console.log(todos);

  console.log("newTodo.id : "+newTodo.id);

  let id = newTodo.id; 
  todos[id] = newTodo;

  console.log(newTodo.id);

  localStorage.setItem("todos", JSON.stringify(todos));    
}

function deleteLocalStore(id) {
  localStorage.removeItem(id);
}

// Complete / Incomplete
function toggleLocalStore(id) {
  let todo = getTodo(id);
  if (todo.complete == false ? todo.complete = true : todo.complete = false);
  setTodo(todo);
}
/*
*
*    HELPERS
*
*/
function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function removeClassFromAll(selector, classname) {
  let buttons = qsa(selector);
  for (let i = 0, l = buttons.length; i < l; i++) {
    if (buttons[i].classList.contains(classname)) {
      buttons[i].classList.remove(classname)
    }
  }
}


/*
*
*   Handle events
*
*/ 

// Bound to add button
function addTodo() {
  let todoText = todoInput.value;
  if (todoText != "") {

    // New todo Obj to play with
    let newTodo = {
      id: getMeta().count + 1,
      title: todoText,      
      complete: false
    }

    // Update local storage
    addLocalStore(newTodo);

    // Clear inout field
    todoInput.value = "";
    todoInput.focus();

    // Append new DOM element
    appendTodo(newTodo);

    // Animate it
    let dataId = "[data-id=\"" + newTodo.id + "\"]";
    TweenMax.to(dataId, 0.15, {
      ease: Power2.easeIn,
      display: "list-item",
      opacity: 1
    });
    TweenMax.to(dataId, 0.15, {
      ease: Power2.easeIn,
      x: 0
    });
  }
}

// Bound to delete button
function deleteTodo(dataId) {
  deleteLocalStore(dataId);

  // Old storage
  unStoreTodo(dataId);

  unappendTodo(dataId)
}


// ADD TO OR REMOVE FORM STORAGE
function storeTodo(todoText) {  

  // Old storage
  let newTodo = {};
  newTodo.name = todoText;
  newTodo.completed = false;
  newTodo.id = todos.length + 1;

  // Old storage
  todos.push(newTodo);
  return newTodo;
}


function unStoreTodo(dataId) {
  for (let i = 0, l = todos.length; i < l; i++) {
    if (todos[i].id == dataId) {
      todos = todos.slice(0, i).concat(todos.slice(i + 1));
      break;
    }
  }
}


function createListItem(newTodo) {
  let listItem = document.createElement('li'); // Using document.createElement() - element must be of type 'Node' to use appendChild()
  listItem.className = 'todo-item';
  listItem.setAttribute('data-id', newTodo.id);

  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-item__checkbox';
  checkbox.addEventListener('change', function () {
    changeCheckbox(newTodo.id);
  });

  let title = document.createElement('span');
  title.innerText = newTodo.title;

  let deleteButton = document.createElement('button');
  deleteButton.className = 'todo-button todo-item__delete';
  deleteButton.innerText = 'Delete';
  deleteButton.addEventListener('click', function () {
    deleteTodo(newTodo.id);
  });

  if (newTodo.completed === true) {
    listItem.classList.add('todo-item--complete');
    checkbox.setAttribute('checked', 'checked');
  }

  listItem.appendChild(checkbox);
  listItem.appendChild(title);
  listItem.appendChild(deleteButton);

  return listItem;

}

// Toggle complete/incomplete
function changeCheckbox(id) {
  toggleLocalStore(id);
  for (let i = 0, l = todos.length; i < l; i++) {
    if (todos[i].id == id) {
      if (todos[i].completed === false ? todos[i].completed = true : todos[i].completed = false)
        break;
    }
  }
  if (getMeta().view != ALL) unappendTodo(id);
}


/*
*
*   CHANGE DOM
*
*/

function appendTodo(newTodo) {
  let listItem = createListItem(newTodo);
  todoListUl.appendChild(listItem);
}

function unappendTodo(dataId) {
  let dataIdVal = "[data-id=\"" + dataId + "\"]";
  let todoNode = qs(dataIdVal);
  TweenMax.to(todoNode, 0.15, {
    ease: Power2.easeIn,
    opacity: 0
  });
  TweenMax.to(todoNode, 0.15, { ease: Power2.easeIn, x: 10, onComplete: deleteNode });
  function deleteNode() {
    setTimeout(function () {
      todoNode.parentNode.removeChild(todoNode);
    }, 150);
  }
}



/*
*
*   Filter List
*
*/

function swapActiveClass(target) {
  removeClassFromAll('.todo-button', 'todo-button__filter--active');
  if (!target.classList.contains('todo-button__filter--active')) {
    target.classList.add('todo-button__filter--active');
  }
}

// Write list to DOM
function renderTodos() {
  if (view == 'COMPLETE') {
    filteredTodos = todos.filter(todo => todo.completed == true);
  } else if (view == 'INCOMPLETE') {
    filteredTodos = todos.filter(todo => todo.completed == false);
  } else {
    filteredTodos = todos;
  }
  let ul = qs('.todo-list');
  ul.innerHTML = '';
  for (let i = 0, l = filteredTodos.length; i < l; i++) {
    ul.appendChild(createListItem(filteredTodos[i]));
  }
  // animatey
  let tl1 = new TimelineMax();
  let tl2 = new TimelineMax();
  // GSAP staggerTo...
  // FIRST VALUE IS DURATION
  // SECOND VALUE IS STAGGER GAP/DELAY
  tl1.staggerTo('.todo-item', 0.15, {
    ease: Power2.easeIn,
    display: "list-item",
    opacity: 1
  }, 0.05);

  tl2.staggerTo('.todo-item', 0.15, {
    ease: Power2.easeIn,
    x: 0
  }, 0.05);
  // bindTodoEvents();
}
// Filter vars
const ALL = "ALL";
const INCOMPLETE = "INCOMPLETE"
const COMPLETE = "COMPLETE";

// Initialise Local Storage
// Set counter if none exists
if (!localStorage.getItem("meta")) {
  let metaData = {
    count: 0,
    view: ALL
  }
  localStorage.setItem("meta", JSON.stringify(metaData));
  localStorage.setItem("todos", JSON.stringify({}));
} 

// On load

  // If there is already data render todos based on that



// Storage / state
let todos = [];
let view = 'ALL';

// Get DOM elements 
let todoInput = qs(".todo-add__input");
let addButton = qs('.todo-button__add');
let filterAll = qs('.filter__all');
let filterIncomplete = qs('.filter__incomplete');
let filterComplete = qs('.filter__complete');

let todoListUl = qs('.todo-list');


//
// document loads
//

  // Look at local storage and render list based on what's there




//
// Initial Button event listeners
//
// Add todo
addButton.addEventListener('click', addTodo);
todoInput.addEventListener('keyup', function (event) {
  // if key is return
  if (event.which === 13) {
    addTodo();
  }
});

// Filter todos
filterAll.addEventListener('click', function () {
  setView(ALL);
  view = 'ALL';
  swapActiveClass(this);
  renderTodos();
});
filterIncomplete.addEventListener('click', function () {
  setView(INCOMPLETE);
  view = 'INCOMPLETE';
  swapActiveClass(this);
  renderTodos();
});
filterComplete.addEventListener('click', function () {
  setView(COMPLETE);
  view = 'COMPLETE';
  swapActiveClass(this);
  renderTodos();
});

