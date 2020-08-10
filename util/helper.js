import * as util from './utility.js';

export function gatherToList(info) {
  let list = null;
  let state = { isGathering: false, isDone: false };
  let method = null;
  let pipeFns = [];

  const setState = util.bindState(function setState(newState) {
    state = util.merge(state, newState); //mutate state
  });

  const mutateList = function (val) {
    if (!list) return (list = [val]);
    list.push(val);
  };

  const clearEnv = function () {
    list = method = null;
    pipeFns = [];
  };

  const cloneState = function connectState() {
    return deepCloneObject(state);
  };
  const checkTruthyInState = util.getTruthInObj(cloneState);

  function pack(val) {
    //list of compose function
    const composer = util.pipe(...pipeFns);
    let evalVal = pipeFns.length ? composer(val) : method ? method(val) : val;
    //verify if val is accepted
    isAccepted(evalVal);
    return this;
  }

  function isAccepted(val) {
    if (!checkTruthyInState('isGathering')) {
      //mutate state
      setState({ isGathering: true });
    }
    if (!checkTruthyInState('isGathering', 'isDone')) {
      mutateList(val);
    }
  }

  function done(clear) {
    //clone the list
    const result = util.shallowCloneObj(list);
    //mutate state
    setState({ isGathering: false, isDone: true });
    //reset back to initial state
    if (clear) resetState();

    return util.mergeSecToFirst(result, util.stripUndefined(info));
  }

  function mapMethod(val) {
    if (!util.isFunction(val)) {
      alertError('Ensure the value being pass is a function');
    }
    method = val;
  }

  function pipeline(...fn) {
    pipeFns.push(...fn);
  }

  function resetState() {
    setState({ isGathering: false, isDone: false });
    clearEnv();
  }

  return Object.freeze({
    pack,
    done,
    mapMethod,
    reset: resetState,
    pipeline,
  });
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
