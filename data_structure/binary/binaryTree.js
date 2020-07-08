export function BinaryTree(val) {
  this.value = val;
  this.left = null;
  this.right = null;
}

const gatherNode = function (type) {
  const result = [];
  if (type) {
    result.type = type;
  }
  let hasReturned = false;
  return function get(val) {
    if (val != null && !hasReturned) {
      return void result.push(Object(val) === val ? val.value : val);
    } else if (!hasReturned) {
      hasReturned = true;
    }
    return result;
  };
};

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
      const result = gatherNode(type);
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

    let maxChild = leftMax > rightMax ? leftMax : rightMax;
    return nodeVal > maxChild ? nodeVal : maxChild;
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

  deleteTree() {
    return (this._root = null);
  }

  heightOfTree(node = this._root) {
    return (function getTreeHeight(node) {
      if (node == null) return -1;
      let left = getTreeHeight(node.left);
      let right = getTreeHeight(node.right);
      return left > right ? left + 1 : right + 1;
    })(node || this._root);
  }

  findDeepestNode(node = this._root) {
    let temp = node;
    let queue;
    if (!temp) return;
    queue = [];
    queue.push(temp);

    while (queue.length) {
      temp = queue.shift();
      if (temp.left) {
        queue.push(temp.left);
      }

      if (temp.right) {
        queue.push(temp.right);
      }
    }
    return temp;
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

  isExist(node) {
    return Boolean(node);
  }

  traversalInReverse(node = this._root, cb = gatherNode()) {
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
