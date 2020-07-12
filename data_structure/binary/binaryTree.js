import {
  packNodeIntoList,
  findDeepestLeaf,
  findAndKeepParent,
  deepCloneObject,
} from '../../utility/util.js';
export function BinaryTree(val) {
  this.value = val;
  this.left = null;
  this.right = null;
}

export default class Binary {
  static types = [
    'preOrderTraversal',
    'inOrderTraversal',
    'postOrderTraversal',
    'levelOrderTraversal',
  ];

  static insertNode(node, val) {
    if (val > node.value && !node.right) {
      node.right = new BinaryTree(val);
    } else if (val > node.value) {
      this.insertNode(node.right, val);
    }

    if (val <= node.value && !node.left) {
      node.left = new BinaryTree(val);
    } else if (val <= node.value) {
      this.insertNode(node.left, val);
    }
  }

  static binaryNodeParker(binaryTree) {
    const nodeParker = (type) => {
      if (!this.types.includes(type)) {
        type = 'preOrderTraversal';
        console.warn(
          'Invalid traversal type - supported type ' +
            types.join(' ') +
            '. `inOrderTraversal` is use by default'
        );
      }
      const result = packNodeIntoList(type);
      binaryTree[type](result);
      return result();
    };
    return nodeParker;
  }

  static compareTree(tree1, tree2) {
    return (function comparer(node1, node2) {
      if (node1 == node2 || node1.value === node2.value) return true;

      let leftCompare = comparer(node1.left, node2.left);
      let rightCompare = comparer(node1.right, node2.right);
      return leftCompare && rightCompare;
    })(tree1._root, tree2._root);
  }

  static mirrorOfBinaryTree(binaryTree) {
    const tree = deepCloneObject(binaryTree._root || binaryTree.root);
    function mirrorTree(tree) {
      let temp;
      if (tree) {
        mirrorTree(tree.left);
        mirrorTree(tree.right);
        temp = tree.left;
        tree.left = tree.right;
        tree.right = temp;
      }
      return tree;
    }

    return mirrorTree(tree);
  }

  preOrderTraversal(cb = console.log, node = this._root) {
    if (!this.isExist(node)) return;
    cb(node.value);

    if (this.isExist(node.left)) {
      this.preOrderTraversal(cb, node.left);
    }

    if (this.isExist(node.right)) {
      this.preOrderTraversal(cb, node.right);
    }
  }

  inOrderTraversal(cb = console.log, node = this._root) {
    if (!this.isExist(node)) return;
    if (this.isExist(node.left)) {
      this.inOrderTraversal(cb, node.left);
    }

    cb(node.value);

    if (this.isExist(node.right)) {
      this.inOrderTraversal(cb, node.right);
    }
  }

  postOrderTraversal(cb = console.log, node = this._root) {
    if (!this.isExist(node)) return;

    if (this.isExist(node.left)) {
      this.postOrderTraversal(cb, node.left);
    }

    if (this.isExist(node.right)) {
      this.postOrderTraversal(cb, node.right);
    }

    cb(node);
  }

  levelOrderTraversal(cb = console.log) {
    //Breath first search
    let rootNode = this._root,
      queue = [];
    if (!rootNode) return;
    queue.push(rootNode);

    while (queue.length) {
      let temp = queue.shift();
      cb(temp.value);
      if (temp.left) {
        queue.push(temp.left);
      }
      if (temp.right) {
        queue.push(temp.right);
      }
    }
  }

  findMax(node = this._root) {
    if (!node.left && !node.right) return node.value;

    let leftMax = null;
    let rightMax = null;
    let nodeVal = node.value;
    if (node.left) {
      leftMax = this.findMax(node.left);
    }
    if (node.right) {
      rightMax = this.findMax(node.right);
    }

    let maxChild = Math.max(leftMax, rightMax);
    return Math.max(nodeVal, maxChild);
  }

  find(data) {
    let node = this._root;
    const finder = (node, data) => {
      if (node == null) return false;
      if (node.value == data) return true;
      return finder(node.left, data) || finder(node.right, data);
    };

    return finder(node, data);
  }

  size(node = this._root) {
    return (function getSize(node) {
      if (node == null) return 0;
      return getSize(node.left) + 1 + getSize(node.right);
    })(node || this._root);
  }

  delete(val) {
    const deepestNode = leafDeepestFind(this._root, 'root');
    const leafNode = deepestNode.leaf;
    let removeNode = { child: this._root, parent: null };
    deepestNode.parent[deepestNode.type] = null;
    //perform remove and swapping
    if (this._root.value !== val) {
      removeNode = findAndKeepParent(this._root, 'value', val);
      removeNode.parent[removeNode.type] = leafNode;
    } else {
      this._root = leafNode;
    }
    leafNode.left = removeNode.child.left;
    leafNode.right = removeNode.child.right;
  }

  deleteTree() {
    return (this._root = null);
  }

  heightOfTree(node = this._root) {
    return (function getTreeHeight(node) {
      if (node == null) return -1;
      let left = getTreeHeight(node.left);
      let right = getTreeHeight(node.right);
      return Math.max(left, right) + 1;
    })(node || this._root);
  }

  findDeepestNode(node = this._root) {
    return findDeepestLeaf(node, -1).leaf.value;
  }

  NumberOfLeaves(node) {
    return (function getNLeaves(node) {
      if (!node || (!node.left && !node.right)) return 1;
      else if ((!node.left && node.right) || (node.left && !node.right))
        return 0;
      let leftCount = getNLeaves(node.left, 0);
      let rightCount = getNLeaves(node.right, 0);
      return leftCount + rightCount;
    })(node || this._root, 0);
  }

  NumberOfFullNode(node) {
    return (function getFullNodeN(node, count) {
      if (!node || (!node.left && node.right) || (node.left && !node.right))
        return count;
      if (node.left && node.right) count++;
      let leftCount = getFullNodeN(node.left, count);
      let fullCount = getFullNodeN(node.right, leftCount);
      return fullCount;
    })(node || this._root, 0);
  }

  findHalfNode(node = this._root) {
    return (function getHalfNode(node, count) {
      if (!node) return count;
      if ((!node.left && node.right) || (node.left && !node.right)) count++;
      let leftHalf = getHalfNode(node.left, count);
      let fullHalf = getHalfNode(node.right, leftHalf);
      return fullHalf;
    })(node || this._root, 0);
  }

  findLevelWithMaxSum(node = this._root) {
    function findMaxLevel(
      node,
      level = 0,
      tracker = { levels: {}, max: 0, maxLevel: 0 }
    ) {
      if (!node) return tracker.max;
      if (level in tracker.levels) {
        tracker.levels[level].push(node.value);
      } else {
        tracker.levels[level] = [node.value];
      }
      const curMax = tracker.levels[level].reduce(sum, 0);
      tracker.max = Math.max(tracker.max, curMax);
      tracker.maxLevel = Object.is(curMax, tracker.max)
        ? level
        : tracker.maxLevel;
      findMaxLevel(node.left, level + 1, tracker);
      findMaxLevel(node.right, level + 1, tracker);

      return tracker.maxLevel;
    }

    return findMaxLevel(node);
  }

  isExist(node) {
    return Boolean(node);
  }

  traversalInReverse(node = this._root, cb = packNodeIntoList()) {
    let queue = [];
    let stack = [];
    let temp = node || this._root;
    if (!temp) return;
    queue.push(temp);
    while (queue.length) {
      temp = queue.shift();
      if (temp.right) queue.push(temp.right);
      if (temp.left) queue.push(temp.left);
      stack.push(temp);
    }

    do {
      cb(stack.pop());
    } while (stack.length);
    return cb();
  }
}
