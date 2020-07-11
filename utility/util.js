export const gatherNode = function (type) {
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

function compareTracker(node1, node2) {
  return node1.count > node2.count ? node1 : node2;
}

function mergeNode(parent, node) {
  return Object.assign({ parent }, node);
}

export function deepCloneObject(obj) {
  return (function clone(obj, traversedObjects) {
    if (typeof obj !== 'object' || obj == undefined) return obj;

    //detect cycle
    for (let i = 0; i < traversedObjects.length; i++) {
      if (traversedObjects[i] === obj) {
        throw new Error('cannot clone circular object.');
      }
    }

    if (obj instanceof Date) {
      return new Date(obj);
    }

    if (obj instanceof Array) {
      let cloneArray = [];
      for (let item of obj) {
        cloneArray.push(clone(item, traversedObjects.concat(obj)));
      }
      return cloneArray;
    }

    if (obj instanceof Object) {
      var cloneObj = {};
      for (let key in obj) {
        cloneObj[key] = clone(obj[key], traversedObjects.concat(obj));
      }
      return cloneObj;
    }
    throw new Error('Not a cloneable object');
  })(obj, []);
}

export function leafDeepestFind(node, type, tracker = 0) {
  tracker++;
  if (!node.left && !node.right) return { leaf: node, count: tracker, type };
  if (node.left && node.right) {
    return mergeNode(
      node,
      compareTracker(
        leafDeepestFind(node.left, 'left', tracker),
        leafDeepestFind(node.right, 'right', tracker)
      )
    );
  }
  return mergeNode(
    node,
    !node.left
      ? leafDeepestFind(node.right, 'right', tracker)
      : leafDeepestFind(node.left, 'left', tracker)
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
      return mergeNode(node, leftFind);
    }
    if (rightFind && !rightFind.parent) {
      return mergeNode(node, rightFind);
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

export function AreMirrors(tree1, tree2) {
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
