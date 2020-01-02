import { hideBlock, showBlock } from './common';

const TASK_TEMPLATE_BLOCK_ID = 'task-item-template';
const TASK_ITEM_NAME_SELECTOR = '.task-item-name';
const TASK_ITEM_INPUT_SELECTOR = '.task-item-input';
const TASK_CHECKBOX_SELECTOR = '.custom-checkbox > .fa';
const TASK_ITEM_CREATION_DATE_SELECTOR = '.task-item-creation-date';
const TASK_ITEM_DUE_DATE_SELECTOR = '.task-item-due-date';
const TASK_ITEM_CONTROLS_SELECTOR = '.task-item-controls';
const TASK_ITEM_DELETE_BUTTON_SELECTOR = '.task-item-delete';

const TASK_SELECTOR_OPEN_STATE_CLASS = 'fa-square-o';
const TASK_SELECTOR_COMPLETED_STATE_CLASS = 'fa-check-square';

// class for single task
class Task {
  // create task from scratch
  constructor(name) {
    this.name = name;
    this.creationDate = new Date();
    this.state = 'open';
    this.editMode = false;
    this.controlsShown = false;
    this.id = 'task_' + Math.random();
  }
  // restore task data from JSON serialized object
  static restoreFromJson(jsonObj) {
    let task = new Task(jsonObj.name);
    task.state = jsonObj.state;
    task.creationDate = new Date(jsonObj.creationDate);
    if (jsonObj.dueDate) {
      task.dueDate = new Date(jsonObj.dueDate);
    }
    task.id = jsonObj.id;
    return task;
  }
  // switch task state from open to completed and vise versa
  toggleCompletion() {
    if (!this.isCompleted()) {
      this.dueDate = new Date();
      this.state = 'completed';
    } else {
      this.dueDate = null;
      this.state = 'open';
    }
  }
  // check if task is completed
  isCompleted() {
    return this.state === 'completed';
  }
  // create HTML block for this task
  createTaskBlock() {
    // clone node from hidden template
    let templateBlock = document.getElementById(TASK_TEMPLATE_BLOCK_ID);
    let clonedTaskBlock = templateBlock.firstElementChild.cloneNode(true);
    this.taskBlock = clonedTaskBlock;

    // fill checkbox state
    let checkbox = clonedTaskBlock.querySelector(TASK_CHECKBOX_SELECTOR);
    let checkBoxClass = this.isCompleted()
      ? TASK_SELECTOR_COMPLETED_STATE_CLASS
      : TASK_SELECTOR_OPEN_STATE_CLASS;
    checkbox.classList.add(checkBoxClass);

    // fill task name
    let taskNameBlock = clonedTaskBlock.querySelector(TASK_ITEM_NAME_SELECTOR);
    taskNameBlock.textContent = this.name;
    let taskNameInput = clonedTaskBlock.querySelector(TASK_ITEM_INPUT_SELECTOR);
    taskNameInput.value = this.name;
    hideBlock(taskNameInput);

    // fill creation date
    let creationDateBlock = clonedTaskBlock.querySelector(
      TASK_ITEM_CREATION_DATE_SELECTOR,
    );
    creationDateBlock.textContent = this.creationDate.toLocaleTimeString();

    // fill due date
    let dueDateBlock = clonedTaskBlock.querySelector(
      TASK_ITEM_DUE_DATE_SELECTOR,
    );
    if (this.isCompleted()) {
      dueDateBlock.textContent = this.dueDate.toLocaleTimeString();
    } else {
      hideBlock(dueDateBlock);
    }
    // link HTML block with current task object using IDs
    clonedTaskBlock.id = this.id;
    return this.taskBlock;
  }
  // show controls - edit form and delete button on control panel
  showEditForm() {
    this.editMode = true;
    // show input and focus on it
    let input = this.taskBlock.querySelector(TASK_ITEM_INPUT_SELECTOR);
    showBlock(input);
    input.focus();
    // hide label with task name
    hideBlock(this.taskBlock.querySelector(TASK_ITEM_NAME_SELECTOR));
  }
  // hide control panel
  hideEditForm() {
    this.editMode = false;
    let input = this.taskBlock.querySelector(TASK_ITEM_INPUT_SELECTOR);
    // restore actual task name
    input.value = this.name;
    hideBlock(input);
    showBlock(this.taskBlock.querySelector(TASK_ITEM_NAME_SELECTOR));
  }
  // show controls - delete button on control panel
  showControls() {
    this.controlsShown = true;
    // show delete button
    showBlock(this.taskBlock.querySelector(TASK_ITEM_CONTROLS_SELECTOR));
  }
  // hide control panel
  hideControls() {
    this.controlsShown = false;
    hideBlock(this.taskBlock.querySelector(TASK_ITEM_CONTROLS_SELECTOR));
  }

  // update name - copy value from input field to task
  updateTaskName() {
    if (this.taskBlock) {
      let input = this.taskBlock.querySelector(TASK_ITEM_INPUT_SELECTOR);
      if (input.value) {
        this.name = input.value;
      }
    }
  }

  // return selector for change state control
  changeStateButtonSelector() {
    return TASK_CHECKBOX_SELECTOR;
  }

  // return selector for delete action control
  deleteButtonSelector() {
    return TASK_ITEM_DELETE_BUTTON_SELECTOR;
  }
}

export { Task, TASK_ITEM_INPUT_SELECTOR };
