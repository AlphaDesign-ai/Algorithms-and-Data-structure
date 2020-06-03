'use strict';
import { Component } from './component.js';
import createChainNode, { Node } from './handleNode.js';

const SinglyLinkedList = (function () {
  const handleError = (msg) => new Error(msg);

  class SinglyLinkedList extends Component {
    constructor({ item, needTail } = {}) {
      super(needTail);
      this._TYPE = 'singlyLinked';

      if (item) {
        this.create(item);
      }
    }

    create(item) {
      if (!item) {
        throw handleError(
          'List has to be initialize with a value or array-like'
        );
      }
      if (!(item instanceof Object)) {
        this.head = new Node(item, this._TYPE);

        if ('tail' in this) {
          this.tail = this.head;
        }
      } else {
        let tail;
        ({
          startNode: this.head,
          count: this.length,
          endNode: tail,
        } = createChainNode(item, this._TYPE));
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

// const link = new SinglyLinkedList({ item: [1, 2, 3, 4], needTail: true });
// globalThis.link = link;
