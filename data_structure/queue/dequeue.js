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

export default Dequeue;
