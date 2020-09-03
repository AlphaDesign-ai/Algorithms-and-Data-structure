import * as util from '../utility.js';
import * as helper from '../helper.js';

import { BinaryTree } from '../../data_structure/binary/binaryTree.js';
import BinarySearch from '../../data_structure/binary/binarySearch/binarySearch.js';

export const packNodeIntoList = function (fn, type) {
  const packer = helper.gatherToList(util.isObject(type) ? type : { type });
  if (typeof fn === 'function') packer.mapMethod(fn);
  return packer;
};

export function findDeepestLeaf(node, type, tracker = 0) {
  tracker++;
  if (!node.left && !node.right) return { leaf: node, count: tracker, type };
  if (node.left && node.right) {
    return util.mergeNode(
      node,
      util.compareTracker(
        findDeepestLeaf(node.left, 'left', tracker),
        findDeepestLeaf(node.right, 'right', tracker)
      )
    );
  }
  return util.mergeNode(
    node,
    !node.left
      ? findDeepestLeaf(node.right, 'right', tracker)
      : findDeepestLeaf(node.left, 'left', tracker)
  );
}

export function findAndKeepParent(node, id, val) {
  return (function finder(node, type) {
    if (!node) return null;
    if (id in node && node[id] === val) {
      return { child: node, type };
    }

    const leftFind = finder(node.left, 'left');
    const rightFind = finder(node.right, 'right');
    if (leftFind && !leftFind.parent) {
      return util.mergeNode(node, leftFind);
    }
    if (rightFind && !rightFind.parent) {
      return util.mergeNode(node, rightFind);
    }

    return leftFind || rightFind;
  })(node, 'root');
}

export function DiameterOfTree(node) {
  let left, right;
  if (!node) return 0;
  left = DiameterOfTree(node.left);
  right = DiameterOfTree(node.right);
  return Math.max(left, right) + 1;
}

export function printPathsRecur(node) {
  function pathTracker(node, path = [], pathLen = 0) {
    if (!node) return;
    //append this node to the path array
    path[pathLen] = node.value;
    pathLen++;
    //it's a leaf, so print the path that led to here
    if (!(node.left && node.right)) {
      printArray(path, pathLen);
    } else {
      //otherwise try both subtrees
      pathTracker(node.left, path.concat([]), pathLen);
      pathTracker(node.right, path.concat([]), pathLen);
    }
  }

  function printArray(arr, pathLen) {
    let limit = pathLen;
    while (limit) {
      console.log(arr[pathLen - limit--]);
    }
    console.log('-------------------');
  }

  return pathTracker(node);
}

export function areMirrors(tree1, tree2) {
  function compareTree(tree1, tree2) {
    if (!(tree1 && tree2)) return true;
    if (!(tree1 || tree2)) return false;
    if (tree1.data !== tree2.data) return false;
    return (
      compareTree(tree1.left, tree2.right) &&
      compareTree(tree1.right, tree2.left)
    );
  }

  return compareTree(tree1._root || tree1, tree2._root || tree2);
}

export function LCA(node, a, b) {
  function getLCA(node, alpha = null, beta = null) {
    if (!node) return node;

    if (node === alpha || node === beta) return node;
    let left = getLCA(node.left, alpha, beta);
    let right = getLCA(node.right, alpha, beta);

    return (left && right) || left || right;
  }
  return getLCA(node, a, b);
}

export function checkSumInPath(node, sum) {
  if (!(sum || node)) return true;
  if (!(sum && node)) return false;
  return (
    checkSumInPath(node.left, sum - node.value) ||
    checkSumInPath(node.right, sum - node.value)
  );
}

export function constructTreeIP(inOrder, preOrder) {
  const getIndex = util.getElIdxWithVal(inOrder);
  const createTree = util.createTree(BinaryTree);

  function buildTree(preOrder, track, start, end = preOrder.length) {
    if (start >= end) return null;
    const result = getIndex(preOrder[track.level++], start, end);
    const rootNode = createTree(result.val);
    //recur call to construct sub tree
    rootNode.left = buildTree(preOrder, track, start, result.idx);
    rootNode.right = buildTree(preOrder, track, result.idx + 1, end);
    return rootNode;
  }
  return util.convertToBinaryTree(
    buildTree(preOrder, { level: 0 }, 0),
    BinarySearch
  );
}

export function printAllAncestor(rootNode, node, cb) {
  let predicate = Object(node) === node;
  const extractor = util.getPropOnlyIf(predicate);
  function getAncestor(rootNode, node, isObj, extractor, cb = console.log) {
    if (!rootNode) return false;
    let leftCompare = extractor(rootNode.left, 'value') === node;
    let rightCompare = extractor(rootNode.right, 'value') === node;
    if (
      leftCompare ||
      rightCompare ||
      getAncestor(rootNode.left, node, isObj, extractor, cb) ||
      getAncestor(rootNode.right, node, isObj, extractor, cb)
    ) {
      return cb(!isObj ? rootNode.value : rootNode), true;
    }
    return false;
  }
  return getAncestor(rootNode, node, predicate, extractor, cb);
}

export function zigzagTraversal(node, cb) {
  let temp;
  let ltr = 1;
  if (!node) return;
  let currentLevel = [];
  let nextLevel = [];
  currentLevel.push(node);
  while (currentLevel.length) {
    temp = currentLevel.pop();
    if (temp) {
      cb(temp.value);
      if (ltr) {
        if (temp.left) nextLevel.push(temp.left);
        if (temp.right) nextLevel.push(temp.right);
      } else {
        if (temp.right) nextLevel.push(temp.right);
        if (temp.left) nextLevel.push(temp.left);
      }
    }

    if (!currentLevel.length) {
      ltr = 1 - ltr;
      [currentLevel, nextLevel] = [nextLevel, currentLevel];
    }
  }
}

export function verticalSumInBinaryTree(node) {
  let result = new Map();
  function verticalSum(node, column, result) {
    if (node == null) return;
    verticalSum(node.left, column - 1, result);
    if (result.has(column)) {
      result.set(column, node.value + result.get(column));
    } else {
      result.set(column, node.value);
    }
    verticalSum(node.right, column + 1, result);
  }

  return verticalSum(node, 0, result), [...result.values()];
}

export function buildTreeFromPreOrderID(nodeTypeIndicator) {
  function buildTree(nodeType, counter) {
    if (nodeType.length <= 1) return null;
    let count = counter.count++;
    let newNode = new BinaryTree(nodeType[count]);
    if (nodeType[count] === 'L') return newNode;
    newNode.left = buildTree(nodeType, counter);
    newNode.right = buildTree(nodeType, counter);
    return newNode;
  }

  return buildTree(nodeTypeIndicator, { count: 0 });
}

export function fillNextSibling(rootNode) {
  function setSibling(node) {
    if (!node) return null;
    !node.nextSibling && (node.nextSibling = null);
    if (node.left) node.left.nextSibling = node.right || null;
    if (node.right) {
      node.right.nextSibling = node.nextSibling ? node.nextSibling : null;
    }

    fillNextSibling(node.left);
    fillNextSibling(node.right);
  }
  return setSibling(rootNode), rootNode;
}

export function isIsomorphic(tree1, tree2) {
  function check4Isomorphism(node1, node2) {
    if ([node1, node2].every(util.isEmpty)) {
      return true;
    }
    if ([node1, node2].some(util.isEmpty)) {
      return false;
    }
    return (
      check4Isomorphism(node1.left, node2.left) &&
      check4Isomorphism(node1.right, node2.right)
    );
  }

  return check4Isomorphism(tree1._root || tree1, tree2._root || tree2);
}

export function quasiIsomorphic(tree1, tree2) {
  function check4QuasiIsomorphism(node1, node2) {
    if ([node1, node2].every(util.isEmpty)) {
      return true;
    }
    if ([node1, node2].some(util.isEmpty)) {
      return false;
    }
    return (
      (check4QuasiIsomorphism(node1.left, node2.left) &&
        check4QuasiIsomorphism(node1.right, node2.right)) ||
      (check4QuasiIsomorphism(node1.left, node2.right) &&
        check4QuasiIsomorphism(node1.right, node2.left))
    );
  }
  return check4QuasiIsomorphism(tree1._root || tree1, tree2._root || tree2);
}

function K_aryTreeNode(data) {
  this.value = data;
  this.child = [];
}

export function buildK_aryTree(list, kTreeType) {
  function buildTree(list, k, n, level) {
    if (n <= 0) return null;
    const newNode = new K_aryTreeNode(list[level.i]);
    for (let i = 0; i < k; i++) {
      if (k * level.i + i < n) {
        level.i++;
        newNode.child[i] = buildTree(list, k, n, level);
      } else {
        newNode.child[i] = null;
      }
    }
    return newNode;
  }
  return buildTree(list, kTreeType, list.length, { i: 0 });
}
