'use strict';

let TreeNode = function (data) {
  if (!this) {
    return TreeNode.of(data);
  } else {
    this.value = null;
    if (data != null) {
      this.value = data;
    }
    this.firstChild = null;
    this.nextSibling = null;
  }
};

TreeNode.of = function (val) {
  return new TreeNode(val);
};

function findSum(node) {
  if (!node) return 0;
  return (
    node.value + findAndCheck(node.firstChild) + findAndCheck(node.nextSibling)
  );
}
