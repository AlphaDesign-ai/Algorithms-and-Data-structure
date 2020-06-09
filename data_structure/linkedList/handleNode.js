'use strict';
import Node from '../node/node.js';

const connectNode = (firstNode, secondNode) => {
  firstNode.next = secondNode;
  'prev' in secondNode ? (secondNode.prev = firstNode) : null;
};

export const generateNodes = (item, startNode, setPointer, count) => {
  if (!Object[Symbol.hasInstance](item)) return;
  return (function gen(nodeStarter, prev, item, count) {
    if (count === item.length) {
      return { startNode: nodeStarter, endNode: prev, count: count };
    }
    if (!prev) {
      prev = nodeStarter;
    }
    const newNode = new Node(item[count], setPointer);
    connectNode(prev, newNode);

    return gen(nodeStarter, newNode, item, ++count, setPointer);
  })(startNode, null, [...item], typeof count === 'number' ? count : 0);
};
