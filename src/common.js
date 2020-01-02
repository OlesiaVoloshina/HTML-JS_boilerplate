const ESC_BUTTON_KEY = 27;
const ENTER_BUTTON_KEY = 13;

function showBlock(block) {
  block.style.display = '';
}

function hideBlock(block) {
  block.style.display = 'none';
}

function clearBlock(list) {
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }
}

function checkIfClickInsideSelector(target, selector) {
  return target.matches(selector) || target.closest(selector);
}

export {
  showBlock,
  hideBlock,
  clearBlock,
  checkIfClickInsideSelector,
  ENTER_BUTTON_KEY,
  ESC_BUTTON_KEY,
};
