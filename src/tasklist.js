import {
  hideBlock,
  showBlock,
  clearBlock,
  checkIfClickInsideSelector,
  ENTER_BUTTON_KEY,
  ESC_BUTTON_KEY,
} from './common';
import { Task } from './task';

const TASK_ITEM_SELECTOR = '.task-item';
const TASK_LIST_CONTENTS_SELECTOR = '.task-list-contents';

class Tasklist {
  constructor(id, openTasksListBlock, completedTasksListBlock) {
    this.id = id;
    this.openTasksListBlock = openTasksListBlock;
    this.completedTasksListBlock = completedTasksListBlock;
    this.allTasks = [];
    this.sortOpen = null;
    this.sortCompleted = null;
    this.sorters = new Map();

    // handle double-click on task items - toggle edit mode
    let handleTaskDblClickFunc = event => {
      let target = event.target;
      let task = this.findTaskByBlock(target);
      // switch edit mode
      if (task) {
        task.editMode ? task.hideEditForm() : task.showEditForm();
      }
    };

    // handle single click on task items
    let handleTaskClickFunc = event => {
      let target = event.target;
      let task = this.findTaskByBlock(target);
      // click outside task block
      if (!task) {
        return;
      }
      // handle click on checkbox
      if (
        checkIfClickInsideSelector(target, task.changeStateButtonSelector())
      ) {
        this.toggleTaskCompletion(task);
      } else if (
        checkIfClickInsideSelector(target, task.deleteButtonSelector())
      ) {
        this.deleteTask(task);
      }
    };
    // handle hovers
    let hoverFunc = event => {
      let target = event.target;
      let task = this.findTaskByBlock(target);
      // switch edit mode
      if (task) {
        task.showControls();
      }
    };
    let unhoverFunc = event => {
      let target = event.target;
      let task = this.findTaskByBlock(target);
      // switch edit mode
      if (task) {
        task.hideControls();
      }
    };

    openTasksListBlock.addEventListener('click', handleTaskClickFunc);
    completedTasksListBlock.addEventListener('click', handleTaskClickFunc);

    openTasksListBlock.addEventListener('dblclick', handleTaskDblClickFunc);
    completedTasksListBlock.addEventListener(
      'dblclick',
      handleTaskDblClickFunc,
    );
    // handle hovers
    openTasksListBlock.addEventListener('mouseover', hoverFunc);
    openTasksListBlock.addEventListener('mouseout', unhoverFunc);
    completedTasksListBlock.addEventListener('mouseover', hoverFunc);
    completedTasksListBlock.addEventListener('mouseout', unhoverFunc);

    // handle inputs on tasks edit fields
    let handleTaskKeyEventsFunc = event => {
      if (
        event.keyCode === ENTER_BUTTON_KEY ||
        event.keyCode === ESC_BUTTON_KEY
      ) {
        let target = event.target;
        let task = this.findTaskByBlock(target);
        if (task == null) {
          return;
        }
        if (event.keyCode === ESC_BUTTON_KEY) {
          // Escape - just hide edit form
          task.hideEditForm();
        } else {
          // if Enter - update task name (from input to name)
          task.updateTaskName();
          // update list (it may require new filtering/sorting), save new data
          this.onListContentsChanged();
        }
      }
    };
    openTasksListBlock.addEventListener('keyup', handleTaskKeyEventsFunc);
    completedTasksListBlock.addEventListener('keyup', handleTaskKeyEventsFunc);

    openTasksListBlock.addEventListener('selection-changed', e => {
      this.sortOpen = e.detail.selectedOption;
      this.generateListContents();
    });
    completedTasksListBlock.addEventListener('selection-changed', e => {
      this.sortCompleted = e.detail.selectedOption;
      this.generateListContents();
    });
  }

  // find task by inner element
  findTaskByBlock(block) {
    let taskBlock = block.closest(TASK_ITEM_SELECTOR);
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
      TASK_LIST_CONTENTS_SELECTOR,
    );
    let completedTasksContainer = this.completedTasksListBlock.querySelector(
      TASK_LIST_CONTENTS_SELECTOR,
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
  // add new task into list
  addTask(name) {
    let task = new Task(name);
    this.allTasks.push(task);
    this.onListContentsChanged();
  }
  // remove task from list
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
  // redraw list and save task data
  onListContentsChanged() {
    this.generateListContents();
    this.saveTasksData();
  }
}

export { Tasklist };
