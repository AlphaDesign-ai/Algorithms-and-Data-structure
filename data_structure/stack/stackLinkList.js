'use strict';
import Ls from '../linkedList/linkedList';

//stack algorithm implementation using linkedList
class StackLinkedList {
  constructor(size) {
    this.top = -1;
    this.maxSize = size;
    this.stack = new Ls();
  }

  push(item) {
    if (this.top === this.maxSize - 1) {
      throw new Error('Stack overflow.');
    }
    return this.stack.prepend(item), ++this.top;
  }

  pop() {
    if (this.isEmpty) {
      throw new Error('Underflow stack.');
    }
    return this.top--, this.stack.shift();
  }

  peek() {
    if (this.isEmpty) {
    }
    return this.stack.head;
  }

  display() {
    this.stack.display();
  }

  get isEmpty() {
    return this.top < 0;
  }

  isFull() {
    return this.top === this.maxSize - 1;
  }
}

export { StackLinkedList as default };
