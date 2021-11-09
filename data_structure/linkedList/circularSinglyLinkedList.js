//CircularSinglyLinkedList

import SinglyLinkedList from './linkedList.js';

export default class CircularSinglyLinkedList extends SinglyLinkedList {
  constructor(item) {
    super(item, true);
    if (item) {
      this.connectEnds();
    }
    this.distinct = 0;
  }

  connectEnds() {
    this.tail.next = this.head;
  }
}
