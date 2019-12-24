import { hideBlock, showBlock, clearBlock } from './common';

const templateBlockId = 'task-item-template';

class Task {
  constructor(name) {
    this.name = name;
    this.creationDate = new Date();
    this.state = 'open';
    this.controlsShown = false;
  }
  complete() {
    this.dueDate = new Date();
    this.state = 'completed';
  }
  isCompleted() {
    return this.state === 'completed';
  }

  createTaskBlock() {
    let templateBlock = document.getElementById(templateBlockId);

    let clonedTaskBlock = templateBlock.firstElementChild.cloneNode(true);

    console.log('Cloned: ' + clonedTaskBlock);
    this.taskBlock = clonedTaskBlock;

    // fill checkbox state
    let checkbox = clonedTaskBlock.querySelector('.custom-checkbox');
    let checkBoxClass = this.isCompleted() ? 'fa-check-square' : 'fa-square-o';
    checkbox.classList.add(checkBoxClass);

    // fill task name
    let taskNameBlock = clonedTaskBlock.querySelector('.task-item-name');
    console.log('Task name: ' + taskNameBlock);
    taskNameBlock.textContent = this.name;
    let taskNameInput = clonedTaskBlock.querySelector('.task-item-input');
    console.log('Task input: ' + taskNameInput);
    taskNameInput.value = this.name;
    hideBlock(taskNameInput);

    // fill dates
    let creationDateBlock = clonedTaskBlock.querySelector(
      '.task-item-creation-date',
    );
    console.log('Creation: ' + creationDateBlock);
    creationDateBlock.textContent = this.creationDate.toLocaleString();

    let dueDateBlock = clonedTaskBlock.querySelector('.task-item-due-date');
    console.log('Due: ' + dueDateBlock);
    if (this.isCompleted()) {
      dueDateBlock.textContent = this.dueDate.toLocaleString();
    } else {
      hideBlock(dueDateBlock);
    }
    // hide controls block
    this.hideControls();
    return this.taskBlock;
  }
  // show control panel
  showControls() {
    this.controlsShown = true;
    showBlock(this.taskBlock.querySelector('.task-item-controls'));
  }
  // hide control panel
  hideControls() {
    this.controlsShown = false;
    showBlock(this.taskBlock.querySelector('.task-item-controls'));
  }
}

class Tasklist {
  constructor(id, openTasksListBlock, completedTasksListBlock) {
    this.id = id;
    this.openTasksListBlock = openTasksListBlock;
    this.completedTasksListBlock = completedTasksListBlock;
    this.allTasks = [];
    this.openTasks = [];
    this.completedTasks = [];
    this.sortOpen = null;
    this.sortCompleted = null;
    this.sorters = new Map();
  }
  filter(filter) {
    for (let task of this.allTasks) {
      if (task.taskBlock) {
        if (!filter) {
          showBlock(task.taskBlock);
        } else {
          if (task.name.contains(this.filter)) {
            showBlock(task.taskBlock);
          } else {
            hideBlock(task.taskBlock);
          }
        }
      }
    }
  }
  generateListContents() {
    for (let task of this.allTasks) {
      let targetList = task.isCompleted()
        ? this.completedTasks
        : this.openTasks;
      targetList.push(task);
    }
    // then sort lists according sort conditions
    if (this.sortOpen && this.sorters[this.sortOpen]) {
      this.openTasks = this.openTasks.sort(this.sorters[this.sortOpen]);
    }
    if (this.sortCompleted && this.sorters[this.sortCompleted]) {
      this.completedTasks = this.completedTasks.sort(
        this.sorters[this.sortCompleted],
      );
    }
    // make task blocks
    let openTasksContainer = this.openTasksListBlock.querySelector(
      '.task-list-contents',
    );
    clearBlock(openTasksContainer);
    for (let openTask of this.openTasks) {
      let taskBlock = openTask.createTaskBlock();
      openTasksContainer.append(taskBlock);
    }
    let completedTasksContainer = this.completedTasksListBlock.querySelector(
      '.task-list-contents',
    );
    clearBlock(completedTasksContainer);
    for (let completedTask of this.openTasks) {
      let taskBlock = completedTask.createTaskBlock();
      completedTasksContainer.append(taskBlock);
    }
  }
  // add sort
  addSortOption(sortOption, sorter) {
    this.sorters[sortOption] = sorter;
  }
  // load data from storage
  loadData() {
    let storedListData = localStorage.getItem(this.id + '_tasks');
    let storedSelectorsData = localStorage.getItem(this.id + '_selectors');
    if (storedListData) {
      this.allTasks = JSON.parse(storedListData);
    }
    if (storedSelectorsData) {
      let selectorsData = JSON.parse(storedSelectorsData);
      this.filter = selectorsData.filter;
      this.sortOpen = selectorsData.sortOpen;
      this.sortCompleted = selectorsData.sortCompleted;
    }
  }
  // save data into storage
  saveTasksData() {
    localStorage.setItem(this.id + '_tasks', JSON.stringify(this.allTasks));
  }
  // add new task into list
  addTask(name) {
    let task = new Task(name);
    this.allTasks.push(task);
    // redraw lists
    this.generateListContents();
    // save data
    this.saveTasksData();
  }
}

export { Tasklist, Task };
