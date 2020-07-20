import * as helper from './helper.js';

export const packNodeIntoList = function (fn, type) {
  const packer = helper.putIntoList(type instanceof Object ? type : { type });
  if (typeof fn === 'function') packer.mapMethod(fn);
  return packer;
};

export function findDeepestLeaf(node, type, tracker = 0) {
  tracker++;
  if (!node.left && !node.right) return { leaf: node, count: tracker, type };
  if (node.left && node.right) {
    return helper.mergeNode(
      node,
      helper.compareTracker(
        findDeepestLeaf(node.left, 'left', tracker),
        findDeepestLeaf(node.right, 'right', tracker)
      )
    );
  }
  return helper.mergeNode(
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
      return helper.mergeNode(node, leftFind);
    }
    if (rightFind && !rightFind.parent) {
      return helper.mergeNode(node, rightFind);
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
  const getIndex = helper.getElIdxWithVal(inOrder);
  function buildTree(preOrder, track, start, end = preOrder.length) {
    if (start >= end) return null;
    const result = getIndex(preOrder[track.level++], start, end);
    const rootNode = helper.createTree(result.val);
    //recur call to construct sub tree
    rootNode.left = buildTree(preOrder, track, start, result.idx);
    rootNode.right = buildTree(preOrder, track, result.idx + 1, end);
    return rootNode;
  }
  return helper.convertToBinaryTree(buildTree(preOrder, { level: 0 }, 0));
}

export function printAllAncestor(rootNode, node, cb) {
  let isObj = Object(node) === node;
  const extractor = helper.getPropOnlyIf(isObj);
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
  return getAncestor(rootNode, node, isObj, extractor, cb);
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
