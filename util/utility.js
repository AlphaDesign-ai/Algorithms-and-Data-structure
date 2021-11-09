export const isArray = typeOf('array');
export const isObject = typeOf('object');
export const isFunction = typeOf('function');
export const isArrayLike = partialRight(_has, 'length');
export const isPrimitive = (v) => Object(v) !== v;
export const isIterable = (v) => Boolean(v[Symbol.iterator]);
export const isTruthy = (val) =>
  isObject(val) ||
  isArray(val) ||
  isFunction(val) ||
  Boolean(val) ||
  Number.isFinite(val) ||
  false;

//Utility
export function getElIdxWithVal(list) {
  return function getIndex(val, start, end) {
    for (; start < end; start++) {
      if (list[start] === val) return { idx: start, val: list[start] };
    }
    return { idx: 0, val: null };
  };
}

export function partial(fn, ...presetArgs) {
  return function apply(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

export function partialRight(fn, ...presetArgs) {
  return function apply(...laterArgs) {
    return fn(...laterArgs, ...presetArgs);
  };
}

export function getPropOnlyIf(predicate) {
  return function getVal(obj, key) {
    return !predicate ? obj && obj[key] : obj;
  };
}

export function stripUndefined(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function compareTracker(node1, node2) {
  return node1.count > node2.count ? node1 : node2;
}

export function mergeNode(parent, node) {
  return Object.assign({ parent }, node);
}

export function createTree(Ctr) {
  return function constructor(...val) {
    return new Ctr(...val);
  };
}

export function convertToBinaryTree(node, Ctr) {
  return Object.setPrototypeOf(node, Ctr.prototype);
}

export function pipe(...fns) {
  if (!fns.length) return;
  return fns.reduce(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
}

export function typeOf(valType) {
  return function typeOf(val) {
    if (valType === 'array') return Array.isArray(val);
    return typeof val === valType;
  };
}

export function shallowCloneObj(obj) {
  if (isArray(obj)) {
    return obj.concat();
  }
  if (isObject(obj)) {
    return Object.assign({}, obj);
  }
  return obj;
}

export function bindState(func, prevS) {
  return function binder(newState) {
    let prevState = typeof prevS === 'function' ? prevS() : prevS;
    return func(mergeState(prevState, newState));
  };
}

export function alertError(msg) {
  throw new Error(msg);
}

export function getTruthInObj(obj) {
  const propGetter = getProp(obj);
  return function isTrue(...arg) {
    return arg.concat().every((v) => propGetter(v));
  };
}

export function getProp(obj) {
  return function getProp(val) {
    switch (typeof obj) {
      case 'function':
        return obj()[val];
      case 'object':
        return obj[val];
      default:
        return val;
    }
  };
}

export function mergeSecToFirst(target, source) {
  return Object.assign(target, source);
}
export function merge(...args) {
  return Object.assign({}, ...args);
}

export function cloneObj(obj, deep = false) {
  return !deep
    ? (!Array.isArray(obj) && { ...obj }) || [...obj]
    : deepCloneObject(obj);
}

export function mergeState(...args) {
  const clonedArgs = deepCloneObject(args);
  // if (Array.isArray(clonedArgs[0])) debugger;
  return Array.isArray(clonedArgs[0])
    ? [].concat(...clonedArgs)
    : Object.assign({}, ...clonedArgs);
}

export function _has(obj, val) {
  return val in obj;
}

export function isFinite(x) {
  return Number.isFinite(x);
}

export function isEmpty(x) {
  return typeof x === 'object' && Object(x) !== x;
}

export const every = (list, cb) => {
  function checkEvery(arr, i, cb, orig = list) {
    if ((i && i >= arr.length) || !arr.join('')) return true;
    return (
      (i in arr ? cb(arr[i], i, orig) : true) &&
      checkEvery(arr, i + 1, cb, orig)
    );
  }
  return checkEvery(list.slice(0), 0, cb);
};

export function identity(val) {
  return val;
}

export function firstDefineMethod(...items) {
  function getTruthy(item, ...others) {
    if (item || !others.length) return item || identity;
    return getTruthy(...others);
  }

  return getTruthy(...items);
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
        cloneArray.push(clone(item, traversedObjects.concat([obj])));
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

export const getNodeAt = (startNode, key, pos) => {
  const traverseNode = (node, key, pos) => {
    if (!Math.max(pos, 0)) return node;
    return traverseNode(node[key], key, --pos) || node;
  };
  return traverseNode(startNode, key, pos);
};
