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
export { showBlock, hideBlock, clearBlock };
