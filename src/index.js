import { Selector } from './selector';
import { Tasklist } from './tasklist';

let openTasksSelector = new Selector(document.getElementById('openTasksSort'));

let completedTasksSelector = new Selector(
  document.getElementById('completedTasksSort'),
);

let taskList = new Tasklist(
  'myList',
  document.getElementById('openTasksList'),
  document.getElementById('completedTasksList'),
);
// load data from storage
taskList.loadData();

// enable search
function onSearchFunc(ev) {
  let value = ev.currentTarget.parentElement.querySelector('.search-input')
    .value;
  console.log('Filter: ' + value);
  taskList.filter(value);
}

let searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', onSearchFunc);
let searchInput = document.querySelector('.search-input');
searchInput.addEventListener('keyup', e => {
  console.log('On search enter: ' + e.keyCode);
  if (e.keyCode === 13) {
    onSearchFunc(e);
  }
});

// enable add
function onAddFunc(ev) {
  let input = ev.currentTarget.parentElement.querySelector('.add-input');
  let value = input.value;
  console.log('Add: ' + value);
  taskList.addTask(value);
}

let addTaskButton = document.querySelector('.add-button');
addTaskButton.addEventListener('click', onAddFunc);
let addTaskInput = document.querySelector('.add-input');
addTaskInput.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    onAddFunc(e);
  }
});

// enable clear all
let clearAllOpen = document.querySelector(
  '#openTasksList .task-list-action[data-control-action="clear"]');
clearAllOpen.addEventListener('click', e => taskList.clearList('open'));

let clearAllCompleted = document.querySelector(
  '#completedTasksList .task-list-action[data-control-action="clear"]');
clearAllCompleted.addEventListener('click', e =>
  taskList.clearList('completed'),
);
