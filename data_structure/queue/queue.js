'use strict';
import Ls from '../linkedList/linkedList.js.js';
import CircularLS from '../linkedList/circularSinglyLinkedList.js';
import { StackArray as Stack } from '../stack/index.js';

const log = console.log;

class QueueArray {
  constructor(size) {
    if (!size) {
      throw new Error('Initialising a stack without size');
    }
    this.queue = [];
    this.max = size;
    this.front = -1;
    this.rear = -1;
  }

  enqueue(value) {
    if (!value) {
      return;
    }
    if (this.isFull) {
      throw new Error("Queue can't exceed maxSize");
    }

    if (this.isEmpty) {
      this.front = this.rear = 0;
    } else {
      this.rear++;
    }

    this.queue[this.rear] = value;
    return this.queue.length;
  }

  dequeue() {
    if (this.isEmpty) {
      throw new Error('underFlow queue is empty.');
    }
    if (this.head === this.front) {
      this.head = this.front = -1;
    } else {
      this.rear--;
    }
    return this.queue.pop();
  }

  get peek() {
    if (this.isEmpty) {
      throw new Error('Queue is empty.');
    }
    return this.queue[front];
  }

  get isEmpty() {
    return !this.queue.length;
  }

  get isFull() {
    return this.enqueue.length === this.max;
  }
}

class QueueLs {
  constructor(size) {
    this.front = this.rear = null;
    this.maxsize = size;
    this.queue = new Ls({ needTail: true });
  }

  enqueue(value) {
    //check full
    if (this.isFull) {
      throw new Error("Queue can't exceed maxSize");
    }
    this.queue.append(value);
    //check emptiness
    if (this.isEmpty) {
      this.front = this.rear = this.queue.head;
    } else {
      this.rear = this.queue.tail;
    }

    return this.rear;
  }

  dequeue() {
    //queue empty
    if (this.isEmpty) {
      throw new Error('underFlow queue is empty.');
    }
    const temp = this.queue.shift();
    if (this.head === this.front) {
      this.head = this.front = null;
    } else {
      this.front = temp.next;
    }

    return temp.data;
  }

  get peek() {
    //queue empty
    if (this.isEmpty) {
      throw new Error('Queue is empty.');
    }

    return this.queue.head.data;
  }

  get isEmpty() {
    return !this.front;
  }

  get isFull() {
    return this.maxsize === this.queue.length - 1;
  }

  *[Symbol.iterator]() {
    let temp = this.queue.head;
    while (temp) {
      yield temp.data;
      temp = temp.next;
    }
  }
}

class CircularQueue {
  constructor(size) {
    this.front = this.rear = -1;
    this.max = size;
    this.queue = new Array();
  }

  enqueue(value) {
    if (this.isFull) {
      throw new Error('Queue overflow.');
    }
    if (this.isEmpty) {
      this.front = this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.max;
    }
    this.queue[this.rear] = value;
  }

  dequeue() {
    if (this.isEmpty) {
      throw new Error('Queue underflow');
    }

    if (this.front === this.rear) {
      this.front = this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.max;
    }
  }

  get isFull() {
    return (this.rear + 1) % this.max === this.front;
  }

  get isEmpty() {
    return this.front < 0 && this.rear < 0;
  }

  get peek() {
    return this.queue[this.front];
  }

  display() {
    if (this.isEmpty) {
      return null;
    }
    while (this.front !== this.rear) {
      log(this.queue[this.front]);
      this.front = (this.front + 1) % this.max;
    }
    log(this.queue[this.front]);
  }
}

class CircularQueueLs {
  constructor(size = 5) {
    this.front = this.rear = null;
    this.queue = new CircularLS();
    this.max = size;
  }

  enqueue(value) {
    let size;
    if (this.isFull) {
      throw new Error('Queue overflow');
    }

    this.queue.append(value);
    ({ tail: this.rear, length: size } = this.queue);
    if (!this.front) {
      this.front = this.rear;
    }

    return size;
  }

  dequeue() {
    let removeNode;
    if (this.isEmpty) {
      throw new Error('Queue underflow.');
    }

    removeNode = this.front;
    if (this.front === this.rear) {
      this.front = this.rear = null;
    } else if (this.front.next) {
      this.front = this.front.next;
    }

    this.queue.shift();
    return removeNode.data;
  }

  get isFull() {
    return this.queue.length === this.max;
  }

  get isEmpty() {
    return !this.queue.head;
  }

  get peek() {
    return this.front ? this.front.data : null;
  }

  display() {
    this.queue.display();
  }
}

function dataExchange({ mode = 1, enqStk, deqStk } = {}) {
  let result;
  const me = () => {
    while ((mode ? enqStk : deqStk).stack.length > 0) {
      if (mode) {
        deqStk.push(enqStk.pop());
        continue;
      }
      enqStk.push(deqStk.pop());
    }

    if (mode) {
      result = deqStk.pop();
      mode = 0;
      return me();
    }
  };
  me();
  return result;
}

class QueueStk {
  constructor(size) {
    this.enqueueStk = new Stack(size);
    this.dequeueStk = new Stack(size);
    this.count = 0;
  }

  enqueue(value) {
    if (this.isFull) {
      throw new Error('Queue overflow.');
    }

    this.enqueueStk.push(value);
    return ++this.count;
  }

  dequeue() {
    let result;
    try {
      result = dataExchange({
        mode: 1,
        enqStk: this.enqueueStk,
        deqStk: this.dequeueStk,
      });
    } catch (err) {
      throw new Error('Queue underflow.');
    }

    return result;
  }

  get isFull() {
    return this.count === this.enqueueStk.maxSize;
  }

  get isEmpty() {
    return this.top1 < 0;
  }

  display() {
    this.enqueueStk.display();
  }

  peek() {
    if (this.isEmpty) {
      throw new Error('Queue underflow.');
    }
    return this.enqueueStk.stack[0];
  }
}

class Dequeue {
  constructor(size) {
    if (!size) {
      throw new Error('Initialising a stack without size');
    }
    this.max = size;
    this.queue = [];
    this.front = this.rear = -1;
  }

  enqueueFront(value) {
    if (this.isFull) {
      throw new Error("Queue can't exceed maxSize");
    }

    if (this.isEmpty) {
      this.front = this.rear = 0;
    } else {
      this.front = (this.front - 1 + this.max) % this.max;
    }
    this.queue[this.front] = value;
    return this.queue.length;
  }

  enqueueRear(value) {
    if (this.isFull) {
      throw new Error("Queue can't exceed maxSize");
    }

    if (this.isEmpty) {
      this.front = this.rear = 0;
    } else {
      this.rear = (this.rear + 1 + this.max) % this.max;
    }
    this.queue[this.rear] = value;
  }

  dequeueFront() {
    if (this.isEmpty) {
      throw new Error('Underflow condition.');
    }
    let index, temp;

    index = this.front;
    if (this.front === this.rear) {
      this.front = this.rear = -1;
    } else {
      this.front = (this.front + 1 + this.max) % this.max;
    }
    temp = this.queue[index];
    return (this.queue[index] = null), temp;
  }

  dequeueRear() {
    if (this.isEmpty) {
      throw new Error('Underflow condition.');
    }
    let index, temp;

    index = this.rear;
    if (this.front === this.rear) {
      this.front = this.rear = -1;
    } else {
      this.rear = (this.rear - 1 + this.max) % this.max;
    }
    temp = this.queue[index];
    return (this.queue[index] = null), temp;
  }

  get isEmpty() {
    return this.front < 0;
  }

  get isFull() {
    return (
      this.front === this.rear + 1 || (this.rear + 1) % this.max === this.front
    );
  }
  reverse() {
    const stack = new Stack(this.max);
    while (!this.isEmpty) {
      stack.push(this.dequeueRear());
    }
    while (!stack.isEmpty && this.rear < this.max) {
      this.enqueueRear(stack.pop());
    }
    return this.queue;
  }

  display() {
    if (this.isEmpty) {
      return null;
    }
    let temp = this.front;
    while (temp !== this.rear) {
      log(this.queue[temp]);
      temp = (temp + 1) % this.max;
    }
    log(this.queue[temp]);
  }
}
