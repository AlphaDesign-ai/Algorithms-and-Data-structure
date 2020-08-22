export const isArray = typeOf('array');
export const isObject = typeOf('object');
export const isFunction = typeOf('function');

export function getElIdxWithVal(list) {
  return function getIndex(val, start, end) {
    for (; start < end; start++) {
      if (list[start] === val) return { idx: start, val: list[start] };
    }
    return { idx: 0, val: null };
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

export function bindState(func) {
  return function binder(val) {
    return func(val);
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

export function _has(obj, val) {
  return val in obj;
}

export function isFinite(x) {
  return Number.isFinite(x);
}
