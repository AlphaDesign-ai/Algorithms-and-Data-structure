'use strict';
import { Component } from './component.js';
import createChainNode from './handleNode.js';
import Node from '../node/node.js';

const INCREMENT_ONE = 1;

function this.createNode() {
  this.next = null;
  this.prev = null;
}

class DoublyLinkedList extends Component {
  constructor(value) {
    super(true, createDoublyNode);
    this._TYPE = 'doublyLinked';
    this.tail = null;

    if (value) {
      this.create(value);
    }
  }

  create(value) {
    if (!value instanceof Array) {
      newNode = new Node(value, this.createNode);
      this.head = newNode;
      this.length = INCREMENT_ONE;
    } else {
      const chainedNodeResult = createChainNode(
        value,
        this._TYPE,
        this.createNode
      );
      this.length = chainedNodeResult.count;
      this.head = chainedNodeResult.startNode;
      this.tail = chainedNodeResult.endNode;
    }

    return this.head;
  }
}

export default DoublyLinkedList;
