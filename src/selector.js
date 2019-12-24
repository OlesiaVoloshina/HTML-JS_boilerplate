import { hideBlock, showBlock } from './common';
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
        if (ev.target.classList.contains('dropdown-item')) {
          target = ev.target;
        } else {
          target = ev.target.closest('.dropdown-item');
        }
        if (target) {
          this.selectOption(target);
        }
      }
    });
  }

  selectOption(optionElement) {
    // unselect others
    for (let option of this.getAllOptions()) {
      option.removeAttribute('data-option-selected');
    }
    // select current
    optionElement.setAttribute('data-option-selected', true);
    // send event that some option was selected
    let event = new CustomEvent('selection-changed', {
      detail: {
        selectedOption: optionElement.getAttribute('data-option-id'),
      },
    });
    optionElement.dispatchEvent(event);

    // collapse menu
    this.collapse();
  }

  collapse() {
    for (let option of this.getAllOptions()) {
      console.log('Option: ' + option);
      if (option.getAttribute('data-option-selected')) {
        this.selectedOption = option.getAttribute('data-option-selected');
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
    return this.selectorBlock.querySelectorAll('[data-option-id]');
  }

  getSelectedOption() {
    return this.selectedOption;
  }
}

export { Selector };
