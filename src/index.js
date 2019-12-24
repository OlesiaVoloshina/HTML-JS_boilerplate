import { Selector } from './selector';
import { Tasklist } from './tasklist';

let openTasksSelector = new Selector(document.getElementById('openTasksSort'));

let completedTasksSelector = new Selector(
  document.getElementById('completedTasksSort'),
);

let taskList = new Tasklist(
  'myList',
  document.getElementById('openTasksList'),
  document.getElementById('completedTasksList')
);

// enable search
let searchButton = document.querySelector('.search-button');
searchButton.addEventListener('click', ev => {
  let value = ev.currentTarget.parentElement.querySelector('.search-input')
    .value;
  console.log('Filter: ' + value);
  taskList.filter(value);
});
// enable add
let addTaskButton = document.querySelector('.add-button');
addTaskButton.addEventListener('click', ev => {
  let value = ev.currentTarget.parentElement.querySelector('.add-input').value;
  console.log('Add: ' + value);
  taskList.addTask(value);
});
