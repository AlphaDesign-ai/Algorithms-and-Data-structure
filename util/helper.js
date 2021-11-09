//Helper

import {
  bindState,
  pipe,
  isFunction,
  stripUndefined,
  firstDefineMethod,
  cloneObj,
  isPrimitive,
  isArrayLike,
  _has,
} from './utility.js';

export function gatherToList(info) {
  let list = [],
    method = null,
    pipeFns = [];

  let state = { isGathering: false, isDone: false };

  const getState = () => cloneObj(state);
  const getInState = (key) => getState()[key];
  const getList = () => cloneObj(list);
  const getPipeFns = () => cloneObj(pipeFns);

  const setState = bindState((newState) => (state = newState), getState);
  const setList = bindState((newList) => (list = newList), getList);
  const setPipeFns = bindState((newState) => (pipeFns = newState), getPipeFns);

  const addToList = (val) => setList(val);

  const clearEnv = function () {
    (list = []), (method = null), (pipeFns = []);
  };

  function pack(val) {
    const composer = firstDefineMethod(pipe(...getPipeFns()), method);
    return isAccepted() && pipe(composer, addToList)(val) && this;
  }

  function isAccepted() {
    !getInState('isGathering') && setState({ isGathering: true }); //mutate state
    return getInState('isGathering') && !getInState('isDone');
  }

  function done(clear) {
    setState({ isGathering: false, isDone: true });
    //reset back to initial state
    clear && resetState();
    return Object.assign([...getList()], stripUndefined(info));
  }

  function mapMethod(val) {
    if (!isFunction(val)) {
      alertError('Ensure the value being pass is a function');
    }
    method = val;
  }

  const pipeline = (...fns) => setPipeFns(fns);

  const resetState = () =>
    setState({ isGathering: false, isDone: false }) && clearEnv();

  return Object.freeze({
    pack,
    done,
    mapMethod,
    reset: resetState,
    pipeline,
  });
}

export const createNode = (item, Node, chainedNodeGenerator) => {
  if (!item) {
    throw handleError('List has to be initialize with a value or array-like');
  }
  let newNode = null;

  if (isPrimitive(item) || !isArrayLike(item)) newNode = Node(item);
  else {
    newNode = chainedNodeGenerator(item);
  }
  return newNode;
};

const connectNode = (firstNode, secondNode, connectKeys = []) => {
  _has(connectKeys, 0) && firstNode && (firstNode[connectKeys[0]] = secondNode);
  _has(connectKeys, 1) &&
    secondNode &&
    (secondNode[connectKeys[1]] = firstNode);
};

export const genChainedNodes = () => {
  const defConfig = { Node: null, count: 0, isDouble: false };
  let { Node, count, isDouble } = defConfig;
  let output = null;

  const configure = (config = defConfig, call = false, obj = output) => {
    ({ Node, count, isDouble } = Object.assign({}, defConfig, config));
    return (!call && obj) || obj.start();
  };

  const start = function (items) {
    if (!isArrayLike(items)) return;
    return (function chainNode(
      items,
      count,
      startNode = null,
      prevNode = startNode
    ) {
      if (count === items.length) {
        return { startNode, endNode: prevNode, count: count };
      }
      const newNode = new Node(items[count]);
      !startNode && (startNode = newNode);
      connectNode(
        prevNode,
        newNode,
        ['next'][isDouble ? 'concat' : 'valueOf']('prev')
      );
      return chainNode(items, ++count, startNode, newNode);
    })([...items], typeof count === 'number' ? count : 0);
  };
  return (output = Object.freeze({ configure, start }));
};
