'use strict';
import { Component } from './component.js';
import createChainNode from './handleNode.js';
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
      value ? this.create(item) : null;
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
        let tail;
        ({
          startNode: this.head,
          count: this.length,
          endNode: tail,
        } = createChainNode(item, this._TYPE, this.setNodePointers));
        if ('tail' in this) {
          this.tail = tail;
        }
      }

      this.display(this.printNodeItem);
    }
  }
  return SinglyLinkedList;
})();

export default SinglyLinkedList;

