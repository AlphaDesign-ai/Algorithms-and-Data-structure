'use strict';
import { Component } from './component.js';
import { generateNodes } from './handleNode.js';
import Node from '../node/node.js';

const setSinglyNodePointers = (_this) => {
  _this.next = null;
};

const SinglyLinkedList = (function () {
  const handleError = (msg) => new Error(msg);
  class SinglyLinkedList extends Component {
    constructor(item, needTail) {
      super(needTail, setSinglyNodePointers);
      this._TYPE = 'singlyLinked';
      item ? this.create(item) : null;
    }

    create(item) {
      if (!item) {
        throw handleError(
          'List has to be initialize with a value or array-like'
        );
      }
      if (!(item instanceof Object)) {
        this.head = new Node(item, this.setNodePointers);

        if ('tail' in this) {
          this.tail = this.head;
        }
      } else {
        this.head = new Node(item[0], this.setNodePointers);
        const chainedNode = generateNodes(
          item,
          this.head,
          this.setNodePointers,
          1
        );
        this.length = chainedNode.count;
        if ('tail' in this) this.tail = chainedNode.endNode;
      }
    }
  }
  return SinglyLinkedList;
})();

export default SinglyLinkedList;
