'use strict';
import { Component } from './component.js';
import createChainNode, { Node } from './handleNode.js';

const INCREMENT_ONE = 1;

class DoublyLinkedList extends Component {
  constructor(value) {
    super();
    this._TYPE = 'doublyLinked';
    this.tail = null;

    if (value) {
      this.create(value);
    }
  }

  create(value) {
    if (!value instanceof Array) {
      newNode = new Node(value, this._TYPE);
      this.head = newNode;
      this.length = INCREMENT_ONE;
    } else {
      const chainedNodeResult = createChainNode(value, this._TYPE);
      this.length = chainedNodeResult.count;
      this.head = chainedNodeResult.startNode;
      this.tail = chainedNodeResult.endNode;
    }

    return this.head;
  }
}

export default DoublyLinkedList;
