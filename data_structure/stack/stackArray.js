'use strict';

export class StackArray {
  constructor(size) {
    this.top = -1;
    this.maxSize = size;
    this.stack = [];
  }

  push(item) {
    if (this.top === this.maxSize - 1) {
      throw new Error('Stack overflow.');
    }
    this.stack[++this.top] = item;
  }

  pop() {
    if (this.isEmpty) {
      throw new Error('Underflow stack.');
    }
    return this.top--, this.stack.pop();
  }

  get peek() {
    if (this.isEmpty) {
    }
    return this.stack[this.top];
  }

  display() {
    this.stack.forEach((el) => console.log(el));
  }

  get isEmpty() {
    return this.top < 0;
  }
}
