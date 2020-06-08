'use strict';
import { Node } from '../node/node.js';

export default function (items, type, setNodePointers) {
  if (!Object[Symbol.hasInstance](items)) return;

  const chainedResult = { count: 1 };

  //define the start node
  Object.defineProperty(chainedResult, 'startNode', {
    value: new Node(items.shift(), setNodePointers),
    configurable: true,
    enumerable: true,
    writable: false,
  });

  //generate chained node
  return (function generateChainNode(prev) {
    if (!items.length) {
      chainedResult.endNode = prev;
      return chainedResult;
    }
    const newNode = new Node(items.shift(), setNodePointers);
    prev.next = newNode;
    if (type === 'doublyLinked') {
      newNode.prev = prev;
    }
    chainedResult.count += 1;

    return generateChainNode(newNode);
  })(chainedResult.startNode);
}
