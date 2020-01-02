import { hideBlock, showBlock, clearBlock } from './common';
import { Task, TASK_ITEM_INPUT_SELECTOR } from './task';

class Tasklist {
  constructor(id, openTasksListBlock, completedTasksListBlock) {
    this.id = id;
    this.openTasksListBlock = openTasksListBlock;
    this.completedTasksListBlock = completedTasksListBlock;
    this.allTasks = [];
    this.sortOpen = null;
    this.sortCompleted = null;
    this.sorters = new Map();

    // handle clicks on task items
    let handleTaskClickFunc = event => {
      let target = event.target;
      let task = this.findTaskByBlock(target);
      // click outside task block
      if (!task) {
        return;
      }
      // handle click on checkbox
      if (this.checkIfClickInsideClass(target, 'custom-checkbox')) {
        this.toggleTaskCompletion(task);
      } else if (this.checkIfClickInsideClass(target, 'task-item-delete')) {
        this.deleteTask(task);
      } else if (task) {
        // switch edit mode
        task.controlsShown ? task.hideControls() : task.showControls();
      }
    };
    openTasksListBlock.addEventListener('click', handleTaskClickFunc);
    completedTasksListBlock.addEventListener('click', handleTaskClickFunc);

    // handle inputs on tasks edit fields
    let handleTaskKeyEventsFunc = event => {
      if (event.keyCode === 13 || event.keyCode === 27) {
        let target = event.target;
        let task = this.findTaskByBlock(target);
        if (event.keyCode === 27) {
          // Escape - just hide controls
          task.hideControls();
        } else {
          // if Enter - update task name (from input to name)
          task.updateTaskName();
          // update list (it may require new filtering/sorting), save new data
          this.onListContentsChanged();
        }
      }
    };
    openTasksListBlock.addEventListener('keyup', handleTaskClickFunc);
    completedTasksListBlock.addEventListener('keyup', handleTaskClickFunc);
  }
  // check if we clicked on element with selected class or its contents
  checkIfClickInsideClass(target, className) {
    return (
      target.classList.contains(className) || target.closest('.' + className)
    );
  }
  // find task by inner element
  findTaskByBlock(block) {
    let taskBlock = block.closest('.task-item');
    if (!taskBlock) {
      return null;
    }
    return this.allTasks.find(task => task.id === taskBlock.id);
  }
  // filter by search field value and hide some elements
  filter(filter) {
    for (let task of this.allTasks) {
      if (task.taskBlock) {
        if (!filter) {
          showBlock(task.taskBlock);
        } else {
          if (task.name.includes(filter)) {
            showBlock(task.taskBlock);
          } else {
            hideBlock(task.taskBlock);
          }
        }
      }
    }
  }
  generateListContents() {
    // clear contents
    let openTasksContainer = this.openTasksListBlock.querySelector(
      '.task-list-contents',
    );
    let completedTasksContainer = this.completedTasksListBlock.querySelector(
      '.task-list-contents',
    );
    clearBlock(openTasksContainer);
    clearBlock(completedTasksContainer);
    // split all tasks into two lists
    let openTasks = [];
    let completedTasks = [];
    for (let task of this.allTasks) {
      let targetList = task.isCompleted() ? completedTasks : openTasks;
      targetList.push(task);
    }
    // then sort each list according sort conditions
    if (this.sortOpen && this.sorters[this.sortOpen]) {
      openTasks = openTasks.sort(this.sorters[this.sortOpen]);
    }
    if (this.sortCompleted && this.sorters[this.sortCompleted]) {
      completedTasks = completedTasks.sort(this.sorters[this.sortCompleted]);
    }
    // make task blocks
    for (let openTask of openTasks) {
      let taskBlock = openTask.createTaskBlock();
      openTasksContainer.append(taskBlock);
      openTask.hideControls();
    }
    for (let completedTask of completedTasks) {
      let taskBlock = completedTask.createTaskBlock();
      completedTasksContainer.append(taskBlock);
      completedTask.hideControls();
    }
  }
  // add sort
  addSortOption(sortOption, sorter) {
    this.sorters[sortOption] = sorter;
  }
  // load data from storage
  loadData() {
    let storedListData = localStorage.getItem(this.id + '_tasks');
    if (storedListData) {
      let allTasksArray = JSON.parse(storedListData);
      for (let serializedTask of allTasksArray) {
        this.allTasks.push(Task.restoreFromJson(serializedTask));
      }
    }
    // redraw list with new data
    this.generateListContents();
  }
  // save data into storage
  saveTasksData() {
    localStorage.setItem(this.id + '_tasks', JSON.stringify(this.allTasks));
  }
  // edit task name
  editTask(task, name) {
    task.name = name;
    this.onListContentsChanged();
  }
  // add new task into list
  addTask(name) {
    let task = new Task(name);
    this.allTasks.push(task);
    this.onListContentsChanged();
  }

  // add new task into list
  deleteTask(task) {
    let idx = this.allTasks.indexOf(task);
    if (idx >= 0) {
      this.allTasks.splice(idx, 1);
      this.onListContentsChanged();
    }
  }
  // toggle task state
  toggleTaskCompletion(task) {
    task.toggleCompletion();
    this.onListContentsChanged();
  }
  // clear list
  clearList(state) {
    this.allTasks = this.allTasks.filter(task => {
      // clear all
      if (state == null) {
        return false;
      }
      // clear according selected state
      return state !== task.state;
    });
    this.onListContentsChanged();
  }

  onListContentsChanged() {
    this.generateListContents();
    this.saveTasksData();
  }
}

export { Tasklist };
