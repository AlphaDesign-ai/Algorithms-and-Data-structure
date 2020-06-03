'use strict';
import SinglyLinkedList from './linkedList.js';

export default class CircularSinglyLinkedList extends SinglyLinkedList {
  constructor(item) {
    super({ item, needTail: true });
    if (item) {
      this.connectEnds();
    }
    this.distinct = 0;
  }

  connectEnds() {
    this.tail.next = this.head;
  }
}
