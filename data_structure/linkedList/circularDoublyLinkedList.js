'use strict';
import DoublyLinkedList from './doublyLinkedList.js';

class CircularDoublyLinkedList extends DoublyLinkedList {
  constructor(item) {
    super(item);
    if (item) {
      this.connectEnds();
    }
    this.distinct = 1;
  }

  connectEnds() {
    this.tail.next = this.head;
    this.head.prev = this.tail;
  }
}

export default CircularDoublyLinkedList;
