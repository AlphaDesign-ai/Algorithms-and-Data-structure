'use strict';
import createChainNode, { Node } from './handleNode.js';

const INCREMENT_ONE = 1;
const handleError = (msg) => new Error(msg);

export class Component {
  constructor(needTail) {
    this.head = null;
    if (needTail) {
      this.tail = null;
    }
    let count = 0;

    //define the virtual property
    !function () {
      Object.defineProperty(this, 'length', {
        get() {
          return count;
        },
        set(value) {
          if (value < 0) {
            count -= Math.abs(value);
          } else {
            count += value;
          }
        },
      });
    }.call(this);
  }

  getNode(position) {
    let tempNode = this.head;
    if (!tempNode) return tempNode;
    let increment = 1;
    while (!Object.is(tempNode.next, null) && increment < position) {
      tempNode = tempNode.next;
      increment++;
    }
    return tempNode;
  }

  prepend(item) {
    if (item !== 0 && !item) {
      throw handleError('Enter a value to append');
    }

    if (!(item instanceof Array)) {
      const newNode = new Node(item, this._TYPE);

      if (this.head) {
        newNode.next = this.head;
        if (this._TYPE === 'doublyLinked') this.head.prev = newNode;
      }
      if (!this.head && 'tail' in this) {
        this.tail = this.head;
      }
      this.head = newNode;
      this.length = INCREMENT_ONE;
    } else {
      const result = createChainNode(item, this._TYPE);
      const tempNode = this.head;

      this.head = result.startNode;

      if (tempNode) {
        result.endNode.next = tempNode;

        if (this._TYPE !== 'singlyLinked') {
          tempNode.prev = result.endNode;
        }
      }

      if ('tail' in this) {
        this.tail = result.endNode;
      }
      this.length = result.count;
    }
    if (this.distinct) {
      this.head.prev = this.tail;
      this.tail.next = this.head;
    } else if (this.distinct === 0) {
      this.tail.next = this.head;
    }
    this.display(this.printNodeItem);
    return this.length;
  }

  append(item) {
    if (item !== 0 && !item) {
      this.front !== this.rear;
      throw handleError('Enter a value to prepend');
    }

    const lastNode = this.tail || this.getNode(this.length);
    if (!(item instanceof Object)) {
      const newNode = new Node(item, this._TYPE);

      if (!lastNode) {
        this.head = newNode;

        if ('tail' in this) {
          this.tail = newNode;
        }
      } else {
        lastNode.next = newNode;
        if ('tail' in this) {
          this.tail = newNode;
        }

        if (this.distinct) {
          newNode.prev = lastNode;
        }
      }
      this.length = INCREMENT_ONE;
    }
    //check is item is an object
    else if (Array.isArray(item) || item instanceof Object) {
      const result = createChainNode(item, this._TYPE);
      if (!lastNode) {
        this.head = result.startNode;

        if (this.tail === null) {
          this.tail = result.endNode;
        }
      } else {
        lastNode.next = result.startNode;
        if (this.tail || 'tail' in this) {
          this.tail = result.endNode;
        }
      }

      this.length = result.count;
    }
    if (this.distinct || this.distinct === 0) {
      if (this.distinct) {
        this.head.prev = this.tail;
      }
      this.tail.next = this.head;
    }
    return this.length;
  }

  shift() {
    if (!this.head) {
      throw new Error('List is empty.');
    }

    let tempNode = this.head || this.tail;
    if (tempNode === this.head.next || !this.head.next) {
      tempNode = this.head;
      this.head = this.tail = null;
    } else {
      this.head = this.head.next;

      if (this.tail) {
        if (this.distinct) {
          this.head.prev = this.tail;
        }

        if (this.distinct || this.distinct === 0) {
          this.tail.next = this.head;
        }
      }

      if (this.distinct) {
        this.tail.next = this.head;
      }
    }
    this.length = -INCREMENT_ONE;
    return tempNode;
  }

  pop() {
    if (!this.head) {
      throw new Error('List is empty.');
    }
    let tempNode, prevNode;
    if (this.tail === this.head) {
      tempNode = this.tail;
      this.tail = this.head = null;
    } else {
      prevNode =
        (this.tail ? this.tail.prev : null) || this.getNode(this.length - 1);

      if (prevNode === this.head && this.length === 1) {
        tempNode = this.head;
        this.head = null;
      } else {
        this.tail ? (this.tail = prevNode) : null;
        tempNode = prevNode.next;
      }
      prevNode.next = this.distinct || this.distinct === 0 ? this.head : null;
      if (this.distinct && this._TYPE === 'doublyLinked') {
        this.head.prev = prevNode;
      }
    }
    this.length = -1;
    return tempNode;
  }

  insertAtPos(pos, item) {
    //position greater than list length

    if (item !== 0 && !item) {
      throw handleError('Enter a value to insert');
    }

    if (pos > this.length + INCREMENT_ONE) {
      throw handleError('invalid position.');
    }

    //perform append or prepend
    if (pos === INCREMENT_ONE || pos === this.length + INCREMENT_ONE) {
      return this[pos === INCREMENT_ONE ? 'prepend' : 'append'](item);
    }

    const prevNode = this.getNode(pos - INCREMENT_ONE);
    const nextNode = prevNode.next;
    if (item instanceof Object) {
      const chainedNode = createChainNode(item, this._TYPE);
      //perform linking of chain node
      prevNode.next = chainedNode.startNode;
      nextNode.prev = chainedNode.endNode;
      this.length = chainedNode.count;
    } else {
      //item is single
      prevNode.next = new Node(item, this._TYPE);
      prevNode.next.next = nextNode;

      this.length = INCREMENT_ONE;
    }
    if (this._TYPE === 'doublyLinked') {
      prevNode.next.prev = prevNode;
      nextNode.prev = prevNode.next;
    }

    return this.length;
  }

  reverse() {
    let curNode, nextNode, prevNode;
    curNode = this.head;
    nextNode = prevNode = null;
    if ('tail' in this) {
      this.tail = curNode;
    }
    if ('prev' in curNode) {
      prevNode = curNode.prev;
    }
    while (curNode) {
      nextNode = curNode.next;
      curNode.next = prevNode;
      if ('prev' in curNode) {
        curNode.prev = nextNode;
      }
      prevNode = curNode;
      curNode = nextNode;

      if (nextNode === this.head) break;
    }
    this.head = prevNode;
  }

  display(callFn) {
    let tempNode = this.head || (this.tail ? this.tail.next : null);
    while (tempNode) {
      if (callFn) {
        callFn(tempNode);
      } else {
        console.log(tempNode.data);
      }

      if (tempNode === this.tail) {
        return;
      }

      tempNode = tempNode.next;
    }
  }

  removeFromPos(pos) {
    if (pos === undefined || pos > this.length) {
      return -1;
    }

    if (pos === 1 || pos === this.length) {
      return this[pos === 1 ? 'shift' : 'pop']();
    } else {
      const prevNode = this.getNode(pos - 1);
      const removeNode = prevNode.next;
      const nextNode = removeNode.next;

      prevNode.next = nextNode;
      if (this.tail && this._TYPE === 'doublyLinked') {
        nextNode.prev = prevNode;
      }
      this.length = -INCREMENT_ONE;
      return removeNode;
    }
  }

  empty() {
    this.head = null;
    if (this.tail) this.tail = this.head;
    this.length = -this.length;
  }
}
