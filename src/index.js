import './style.css';

import { Selector } from './selector';
import { Tasklist } from './tasklist';

const MY_LIST_ID = 'myList';

const SEARCH_INPUT_SELECTOR = '.search-input';
const SEARCH_BUTTON_SELECTOR = '.search-button';

const ADD_INPUT_SELECTOR = '.add-input';
const ADD_BUTTON_SELECTOR = '.add-button';

const CLEAR_ALL_SELECTOR = '.task-list-action[data-control-action="clear"]';

const openTasksListBlock = document.getElementById('openTasksList');
const completedTasksListBlock = document.getElementById('completedTasksList');

let taskList = new Tasklist(
  MY_LIST_ID,
  openTasksListBlock,
  completedTasksListBlock,
);
// load data from storage
taskList.loadData();

// enable search
function onSearchFunc(ev) {
  let value = ev.currentTarget.parentElement.querySelector(
    SEARCH_INPUT_SELECTOR,
  ).value;
  taskList.filter(value);
}
let searchButton = document.querySelector(SEARCH_BUTTON_SELECTOR);
searchButton.addEventListener('click', onSearchFunc);
let searchInput = document.querySelector(SEARCH_INPUT_SELECTOR);
searchInput.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    onSearchFunc(e);
  }
});

// enable add
function onAddFunc(ev) {
  let input = ev.currentTarget.parentElement.querySelector(ADD_INPUT_SELECTOR);
  let value = input.value;
  if (value) {
    // add new task
    taskList.addTask(value);
    // clear field
    //input.value = null;
    // clear search field when adding new element
    document.querySelector(SEARCH_INPUT_SELECTOR).value = null;
  }
}
let addTaskButton = document.querySelector(ADD_BUTTON_SELECTOR);
addTaskButton.addEventListener('click', onAddFunc);
let addTaskInput = document.querySelector(ADD_INPUT_SELECTOR);
addTaskInput.addEventListener('keyup', e => {
  if (e.keyCode === 13) {
    onAddFunc(e);
  }
});

// enable clear all
let clearAllOpen = openTasksListBlock.querySelector(CLEAR_ALL_SELECTOR);
clearAllOpen.addEventListener('click', e => taskList.clearList('open'));

let clearAllCompleted = completedTasksListBlock.querySelector(
  CLEAR_ALL_SELECTOR,
);
clearAllCompleted.addEventListener('click', e =>
  taskList.clearList('completed'),
);

// enable sort
taskList.addSortOption('creation-date-asc', (one, two) => {
  return one.creationDate.getTime() > two.creationDate.getTime() ? 1 : -1;
});
taskList.addSortOption('creation-date-desc', (one, two) => {
  return two.creationDate.getTime() > one.creationDate.getTime() ? 1 : -1;
});
taskList.addSortOption('due-date-asc', (one, two) => {
  return one.dueDate.getTime() > two.dueDate.getTime() ? 1 : -1;
});
taskList.addSortOption('due-date-desc', (one, two) => {
  return two.dueDate.getTime() > one.dueDate.getTime() ? 1 : -1;
});

taskList.addSortOption('task-name-asc', (one, two) => {
  return one.name.localeCompare(two.name);
});
taskList.addSortOption('task-name-desc', (one, two) => {
  return two.name.localeCompare(one.name);
});

let openTasksSort = new Selector(document.getElementById('openTasksSort'));
let completedTasksSort = new Selector(
  document.getElementById('completedTasksSort'),
);

// clear search when sort option is changed
document.addEventListener('selection-changed', e => {
  document.querySelector(SEARCH_INPUT_SELECTOR).value = null;
});
