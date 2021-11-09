'use strict';
import { _has } from '../../util/utility.js';

export default (function () {
  //TreeNode instantiation
  function TreeNode(val) {
    this.value = val;
    this.firstChild = null;
    this.nextSibling = null;
  }

  //Traverse through the tree levels using the `FirstChild`
  const traverseLevel = (tree, config, level = config.shift()) => {
    if (!level) return traverseChild(tree, config.length ? [...config] : null);
    return traverseLevel(tree.firstChild, config, level - 1);
  };

  const traverseChild = (node, config = []) => {
    const traverseNode = (node, pos, config) => {
      if (!node.nextSibling || pos === 1) {
        return config && config.length
          ? traverseLevel(node, [...config])
          : node;
      }
      return traverseNode(node.nextSibling, pos - 1, config);
    };
    return traverseNode(node, !config ? Infinity : config.shift(), config);
  };

  const Tree = function (data) {
    if (!this) return TreeNode.of(data);
    return (data && this.insert(data)) || this;
  };

  Tree.prototype.insert = function (val, config = []) {
    if (val == undefined) {
      throw TypeError('instantiate tree with a non-empty value.');
    }
    if (!_has(this, '_root')) {
      this._root = Tree.of(val);
    } else if (!this._root.firstChild) {
      this._root.firstChild = Tree.of(val);
    } else {
      const tree = traverseLevel(this._root, [...config]);
      tree[!(config.length % 2) ? 'firstChild' : 'nextSibling'] = Tree.of(val);
    }
    return this;
  };

  Tree.findDepthInGenericTree = function (treeArray) {
    function findDepth(parents, size = parents.length) {
      let maxDepth = -1;
      for (let i = 0; i < size; i++) {
        let currentDepth = 0,
          adjuster = i;
        while (parents[adjuster] !== -1) {
          currentDepth++;
          adjuster = parents[adjuster];
        }

        if (currentDepth > maxDepth) {
          maxDepth = currentDepth;
        }
      }

      return maxDepth;
    }
    return findDepth(treeArray);
  };

  Tree.prototype.siblingCount = function (node = this._root.firstChild) {
    let count = 0;
    while (node) {
      count++;
      node = node.nextSibling;
    }
    return count;
  };

  Tree.prototype.childCount = function (node = this._root) {
    let count = 0;
    node = node.firstChild;
    while (node) {
      count++;
      node = node.nextSibling;
    }
    return count;
  };

  Tree.prototype.findSum = function (node = this._root) {
    if (!node) return 0;
    return (
      node.value +
      this.findSum(node.firstChild) +
      this.findSum(node.nextSibling)
    );
  };

  Tree.of = function (val) {
    return new TreeNode(val);
  };

  return Tree;
})();
