'use strict';
import { Component } from './component.js';
import createChainNode from './handleNode.js';
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
    this.tail = null;

    if (value) {
      this.create(value);
    }
  }

  create(value) {
    if (!value instanceof Array) {
      newNode = new Node(value, this.setNodePointers);
      this.head = newNode;
      this.length = INCREMENT_ONE;
    } else {
      const chainedNodeResult = createChainNode(
        value,
        this._TYPE,
        this.setNodePointers
      );
      this.length = chainedNodeResult.count;
      this.head = chainedNodeResult.startNode;
      this.tail = chainedNodeResult.endNode;
    }

    return this.head;
  }
}

export default DoublyLinkedList;
