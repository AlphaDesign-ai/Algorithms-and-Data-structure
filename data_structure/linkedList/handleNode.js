'use strict';

export class Node {
  constructor(data, type) {
    this.data = data;
    this[type]();
  }

  singlyLinked() {
    this.next = null;
  }

  doublyLinked() {
    this.singlyLinked();
    this.prev = null;
  }

  printNodeItem(item) {
    console.log(item.data);
  }
}
export default function (item, type) {
  if (!Object[Symbol.hasInstance](item)) return;

  const chainedResult = { count: 1 };

  //define the start node
  Object.defineProperty(chainedResult, 'startNode', {
    value: new Node(item.shift(), type),
    configurable: true,
    enumerable: true,
    writable: false,
  });

  //generate chained node
  return (function generateChainNode(prev) {
    if (!item.length) {
      chainedResult.endNode = prev;
      return chainedResult;
    }
    const newNode = new Node(item.shift(), type);
    prev.next = newNode;
    if (type === 'doublyLinked') {
      newNode.prev = prev;
    }
    chainedResult.count += 1;

    return generateChainNode(newNode);
  })(chainedResult.startNode);
}
