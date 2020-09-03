function ThreadedBinaryTree(data) {
  this.left = null;
  this.lTag = 0;
  this.value = data;
  this.rTag = 1;
  this.right = null;
}

export function inOrderSuccessor(node) {
  let position = null;
  if (node.rTag === 0) return node.right;
  else {
    position = node.right;
    while (position.lTag === 1) {
      position = position.left;
    }
    return position;
  }
}
