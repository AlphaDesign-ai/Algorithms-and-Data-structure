import { BinaryTree } from '../data_structure/binary/binaryTree.js';
import BinarySearch from '../data_structure/binary/binarySearch/binarySearch.js';

export function swap(a, b) {
  return [b, a];
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

export function createTree(val) {
  return new BinaryTree(val);
}

export function convertToBinaryTree(node) {
  return Object.setPrototypeOf(node, BinarySearch.prototype);
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

function pipe(...fns) {
  if (!fns.length) return;
  return fns.reduce(function reducer(fn1, fn2) {
    return function composed(...args) {
      return fn2(fn1(...args));
    };
  });
}

export function putIntoList(info) {
  let list = null;
  let state = { isGathering: false, isDone: false };
  let method = null;
  let pipeFns = [];

  const changeState = bindState(function setState(newState) {
    //mutate state
    state = Object.assign({}, state, newState);
  });
  const accessScope = function scopeVariable() {
    return state;
  };
  const checkTrueState = getTruthInObj(accessScope);

  function pack(val) {
    //list of compose function
    const composer = pipe(...pipeFns);
    let evalVal = pipeFns.length ? composer(val) : method ? method(val) : val;
    //verify if val is accepted
    isAccepted(evalVal);
    return this;
  }

  function isAccepted(val) {
    if (!checkTrueState('isGathering')) {
      //mutate state
      changeState({ isGathering: true });
      //push to the newly created list
      list = Array.of(val);
    } else {
      list.push(val);
    }
    //verify if done
    return checkTrueState('isGathering', 'isDone'); //{isGathering: false, isDone: true}
  }

  function done(clear) {
    //clone the list
    const result = shallowCloneObj(list);
    //mutate state
    changeState({ isGathering: false, isDone: true });
    //reset back to initial state
    if (clear) reset();

    return mergeTwoInFirst(result, stripUndefined(info));
  }

  function mapMethod(val) {
    if (!isFunction(val)) {
      alertError('Ensure the value being pass is a function');
    }
    method = val;
  }

  function pipeline(...fn) {
    pipeFns.push(...fn);
  }

  function reset() {
    changeState({ isGathering: false, isDone: false });
    list = method = null;
  }

  return Object.freeze({
    pack,
    done,
    mapMethod,
    reset,
    pipeline,
  });
}

const isArray = typeOf('array');
const isObject = typeOf('object');
const isFunction = typeOf('function');

function typeOf(valType) {
  return function typeOf(val) {
    if (valType === 'array') return Array.isArray(val);
    return typeof val === valType;
  };
}

function shallowCloneObj(obj) {
  if (isArray(obj)) {
    return obj.concat();
  }
  if (isObject(obj)) {
    return Object.assign({}, obj);
  }
  return obj;
}

function bindState(func) {
  return function binder(val) {
    return func(val);
  };
}

function alertError(msg) {
  throw new Error(msg);
}

function getTruthInObj(obj) {
  const propGetter = getProp(obj);
  return function isTrue(...arg) {
    return arg.concat().every((v) => propGetter(v));
  };
}

function getProp(obj) {
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

function mergeTwoInFirst(target, source) {
  return Object.assign(target, source);
}
