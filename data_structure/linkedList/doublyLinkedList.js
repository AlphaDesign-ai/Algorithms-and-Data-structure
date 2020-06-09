'use strict';
import { Component } from './component.js';
import { generateNodes } from './handleNode.js';
import Node from '../node/node.js';

const INCREMENT_ONE = 1;

const setDoublyNodePointers = (_this) => {
  _this.next = null;
  _this.prev = null;
};

class DoublyLinkedList extends Component {
  constructor(value) {
    super(true, setDoublyNodePointers);
    this._TYPE = 'doublyLinked';
    value ? this.create(value) : null;
  }

  create(value) {
    if (!value instanceof Array) {
      newNode = new Node(value, this.setNodePointers);
      this.head = newNode;
      this.length = INCREMENT_ONE;
    } else {
      this.head = new Node(value[0], this.setNodePointers);
      const chainedNodeResult = generateNodes(
        value,
        this.head,
        this.setNodePointers
      );
      this.length = chainedNodeResult.count;
      this.tail = chainedNodeResult.endNode;
    }

    return this.head;
  }
}

export default DoublyLinkedList;
