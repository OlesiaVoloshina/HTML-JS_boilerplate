import { hideBlock, showBlock } from './common';

const DROPDOWN_ITEM_SELECTOR = '.dropdown-item';
const SELECTED_OPTION_ATTR = 'data-option-selected';
const DATA_OPTION_ATTR = 'data-option-id';
// Sort Selector
class Selector {
  // constructor - send root of selection block
  constructor(selectorBlock) {
    this.selectorBlock = selectorBlock;
    // hide drop-down list
    this.collapse();
    // attach click listener
    selectorBlock.addEventListener('click', ev => {
      if (!this.open) {
        this.expand();
      } else {
        let target;
        if (ev.target.matches(DROPDOWN_ITEM_SELECTOR)) {
          target = ev.target;
        } else {
          target = ev.target.closest(DROPDOWN_ITEM_SELECTOR);
        }
        if (target) {
          this.selectOption(target);
        }
      }
    });
    // load data from local storage
    this.loadData();
  }

  selectOption(optionElement) {
    // unselect others
    for (let option of this.getAllOptions()) {
      option.removeAttribute(SELECTED_OPTION_ATTR);
    }
    // select current
    optionElement.setAttribute(SELECTED_OPTION_ATTR, true);
    this.selectedOption = optionElement.getAttribute(DATA_OPTION_ATTR);
    // send event that some option was selected
    let event = new CustomEvent('selection-changed', {
      bubbles: true,
      detail: {
        selectedOption: this.selectedOption,
      },
    });
    optionElement.dispatchEvent(event);
    this.saveData();
    // collapse menu
    this.collapse();
  }

  collapse() {
    for (let option of this.getAllOptions()) {
      if (option.getAttribute(SELECTED_OPTION_ATTR)) {
        showBlock(option);
      } else {
        hideBlock(option);
      }
    }
    this.open = false;
  }

  expand() {
    for (let option of this.getAllOptions()) {
      showBlock(option);
    }
    this.open = true;
  }

  getAllOptions() {
    return this.selectorBlock.querySelectorAll('[' + DATA_OPTION_ATTR + ']');
  }

  // load data from storage
  loadData() {
    let storedSortData = localStorage.getItem(this.selectorBlock.id + '_sort');
    if (storedSortData) {
      // find selector by data-option-id value
      let sortOptionElement = this.selectorBlock.querySelector(
        '[' + DATA_OPTION_ATTR + '="' + storedSortData + '"]',
      );
      if (sortOptionElement) {
        this.selectOption(sortOptionElement);
      }
    }
  }
  // save data into storage
  saveData() {
    localStorage.setItem(this.selectorBlock.id + '_sort', this.selectedOption);
  }
}

export { Selector };
