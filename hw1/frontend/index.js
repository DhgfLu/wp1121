/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const todos = await getTodos();
    const moodfilter = document.querySelector("#mood_filter");
    const tagfilter = document.querySelector("#tag_filter");
    for (var i = 0; i < todos.length; i++) {
      if (moodfilter.value == (todos[i].mood) || moodfilter.value == 'all'){
        if(tagfilter.value == (todos[i].tag) || tagfilter.value == 'all'){
          if(todos[i].title&&todos[i].description&&todos[i].mood&&todos[i].tag&&todos[i].date){
            renderTodo(todos[i]);
          }
        }
      }
    }
    
  } catch (error) {
    alert("Failed to load todos!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#add_diary");
  const addTodoButton = document.querySelector("#todo-add");
  const todoInput = document.querySelector("#todo-input");
  const filterbutton = document.querySelector('#filter');
  const todoDescriptionInput = document.querySelector(
    "#todo-description-input"
  );
  const canceButton = document.querySelector('#cancel_button');
  const diaryMood = document.querySelector("#mood_select");
  const diaryTag = document.querySelector("#tag_select");
  const diaryDate = document.querySelector("#date");
  date = new Date();
  if ((date.getMonth()+1) < 10) {
    date = (date.getFullYear() + '-' + 0 +(date.getMonth()+1) + '-' + date.getDate());
  } else {
    date = (date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
  }

  addDiaryButton.addEventListener("click", async () => {
    todoInput.value = "";
    todoDescriptionInput.value = "";
    diaryTag.value = '';
    diaryMood.value = '';
    diaryDate.value = date;
    if (document.querySelector('#home_page').style.display === 'none') {
      document.querySelector('#home_page').style.display = 'block';
    } else{
      document.querySelector('#home_page').style.display = 'none';
    }
    if (document.querySelector('#write_diary_page').style.display === 'none') {
      document.querySelector('#write_diary_page').style.display = 'block';
    } else{
      document.querySelector('#write_diary_page').style.display = 'none';
    }
  });
  canceButton.addEventListener("click", async () => {
    if (document.querySelector('#home_page').style.display === 'none') {
      document.querySelector('#home_page').style.display = 'block';
    } else{
      document.querySelector('#home_page').style.display = 'none';
    }
    if (document.querySelector('#write_diary_page').style.display === 'none') {
      document.querySelector('#write_diary_page').style.display = 'block';
    } else{
      document.querySelector('#write_diary_page').style.display = 'none';
    }
  });
  addTodoButton.addEventListener("click", async () => {
    //save button pressed
    if(!event.detail || event.detail == 1){
      const title = todoInput.value;
      const description = todoDescriptionInput.value;
      const mood = diaryMood.value;
      const tag = diaryTag.value;
      const date = diaryDate.value;
      if (!title) {
        alert("Please enter a todo title!");
        return;
      }
      if (!description) {
        alert("Please enter some words!");
        return;
      }
      if (!mood) {
        alert("Please select your mood!");
        return;
      }
      if (!date || (date.slice(0,4)) > 2023) {
        alert("Please enter valid date!");
        return;
      }
      if (!tag) {
        alert("Please select your tag!");
        return;
      }
      try {
        const todo = await createTodo({ title, description, mood, tag, date });
        renderTodo(todo);
      } catch (error) {
        alert("Failed to create todo!");
        return;
      }
      todoInput.value = "";
      todoDescriptionInput.value = "";
      diaryMood.value = '';
      diaryTag.value = '';
      diaryDate.value = '';
      if (document.querySelector('#home_page').style.display === 'none') {
        document.querySelector('#home_page').style.display = 'block';
      } else{
        document.querySelector('#home_page').style.display = 'none';
      }
      if (document.querySelector('#write_diary_page').style.display === 'none') {
        document.querySelector('#write_diary_page').style.display = 'block';
      } else{
        document.querySelector('#write_diary_page').style.display = 'none';
      }
      location.reload(); 
    }
  });
  filterbutton.addEventListener("click", async () => {
    // renderTodo(todo);
    location.reload(); 
  });
}

function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const todoInput = document.querySelector("#todo-input");
  const todoDescriptionInput = document.querySelector(
    "#todo-description-input"
  );
  const diaryMood = document.querySelector("#mood_select");
  const diaryTag = document.querySelector("#tag_select");
  const diaryDate = document.querySelector("#date");
  const addTodoButton = document.querySelector("#todo-add");
  const week = new Date().getDay();
  const daysofweek = ["日", "一", "二", "三", "四", "五", "六"];

  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  // console.log(container);
  console.log(todo);
  const checkbox = item.querySelector(`input[type="checkbox"]`);
  checkbox.checked = todo.completed;
  checkbox.dataset.id = todo.id;
  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const deleteButton = item.querySelector("button.delete-todo");
  deleteButton.dataset.id = todo.id;
  deleteButton.addEventListener("click", () => {
    deleteTodoElement(todo.id);
  });
  const mood = item.querySelector('p.diary-mood');
  mood.innerText = todo.mood;
  const tag = item.querySelector('p.diary-tag');
  tag.innerText = todo.tag;
  const date = item.querySelector('p.diary-date');
  let newdate = todo.date.replace(/-/g,'.');
  newdate = newdate.concat('('+daysofweek[week]+')');
  date.innerText = newdate;
  const editbutton = item.querySelector("button.edit-button");
  editbutton.addEventListener("click", () => {
    todoInput.value = todo.title;
    todoDescriptionInput.value = todo.description;
    diaryDate.value = todo.date;
    diaryTag.value = todo.tag;
    diaryMood.value = todo.mood;
    document.querySelector('#home_page').style.display = 'none';
    document.querySelector('#write_diary_page').style.display = 'block';
    addTodoButton.addEventListener("click", () => {
      deleteTodoElement(todo.id);
    });
  });
  return item;
}

async function deleteTodoElement(id) {
  try {
    await deleteTodoById(id);
  } catch (error) {
    alert("Failed to delete todo!");
  } finally {
    const todo = document.getElementById(id);
    todo.remove();
  }
}

async function getTodos() {
  const response = await instance.get("/todos");
  return response.data;
}

async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function deleteTodoById(id) {
  const response = await instance.delete(`/todos/${id}`);
  return response.data;
}

main();
