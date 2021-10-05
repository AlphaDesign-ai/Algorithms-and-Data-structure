'use strict';
import { getNodeAt, isTruthy, _has, isFinite } from '../../util/utility.js';

export default class LinkedList {
  constructor(needTail) {
    this.head = null;
    needTail && (this.tail = null);
    !function counterIIFE() {
      let count = 0;
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

  //remove item from the head
  shift() {
    if (!this.head) throw new Error('List is empty.');

    let tempNode = this.head || this.tail;
    this.length = -1;

    if (!tempNode.next) {
      this.head = null;
      if (this._TYPE === 'doublyLinked' || this.tail) this.tail = this.head;
      return tempNode;
    }
    this.head = tempNode.next;

    if (isFinite(this.distinct) && tempNode.next) {
      this.distinct && (this.head.prev = this.tail);
      this.tail && (this.tail.next = this.head);
    }
    return tempNode;
  }

  //remove the tail item
  pop() {
    if (!this.head) throw new Error('List is empty.');
    let tempNode,
      prevNode = getNodeAt(this.head, 'next', this.length - 2);
    tempNode = this.tail || prevNode.next;

    if (this.head === tempNode) {
      this.head = this.tail = null;
    } else {
      if (_has(this, 'tail')) this.tail = prevNode;
      prevNode.next = isFinite(this.distinct) ? this.head : null;
      if (this.distinct && this._TYPE === 'doublyLinked') {
        this.head.prev = prevNode;
      }
    }
    this.length = -1;
    return tempNode;
  }

  prepend(item) {
    if (!isTruthy(item)) throw handleError('Enter a value to append');
    let startNode = null;
    let endNode = null;
    let firstNode = this.head || this.tail;

    startNode = this.setUp(item);
    ({
      startNode: this.head = startNode,
      count: this.length = 1,
      endNode: endNode = startNode,
    } = startNode);

    firstNode && (endNode.next = firstNode);
    if (_has(this, 'tail') && !this.tail) this.tail = endNode || startNode;
    if (this._TYPE === 'doublyLinked') firstNode && (firstNode.prev = endNode);

    if (isFinite(this.distinct)) {
      this.tail.next = this.head;
      this.distinct && (this.head.prev = this.tail);
    }
    return this.length;
  }

  append(item) {
    if (!isTruthy(item)) throw handleError('Enter a value to prepend');
    let startNode = null;
    let endNode = null;
    const lastNode = this.tail || getNodeAt(this.head, 'next', this.length - 1);
    startNode = this.setUp(item);
    ({
      endNode: endNode,
      count: this.length = 1,
      startNode: startNode = startNode,
    } = startNode);

    if (lastNode) lastNode.next = startNode;
    !this.head && (this.head = startNode);

    _has(this, 'tail') && (this.tail = endNode || startNode);
    this._TYPE === 'doublyLinked' && (startNode.prev = lastNode);

    if (isFinite(this.distinct)) {
      let hasTail = _has(this, 'tail');
      if (this.distinct) {
        startNode.prev = lastNode;
        hasTail && (this.head.prev = this.tail);
      }
      hasTail && (this.tail.next = this.head);
    }
    return this.length;
  }

  insert(startIndex, item) {
    if (!isTruthy(item)) throw handleError('Enter a value to insert');
    if ([1, this.length].includes(startIndex) || !this.head) {
      return this[startIndex === 1 ? 'prepend' : 'append'](item);
    }
    const lastNode = getNodeAt(this.head, 'next', startIndex - 1);
    const nextNode = prevNode.next;
    let startNode = null;
    let endNode = null;
    startNode = this.setUp(item);
    ({
      endNode: endNode,
      count: this.length = 1,
      startNode: startNode = startNode,
    } = startNode);

    lastNode.next = startNode;
    if (this._TYPE === 'doublyLinked') {
      startNode.prev = lastNode;
      endNode.next = nextNode;
    }

    return this.length;
  }

  reverse() {
    let curNode, nextNode, prevNode;
    curNode = this.head;
    nextNode = prevNode = null;
    _has(this, 'tail') && (this.tail = curNode);
    _has(curNode, 'prev') && (prevNode = curNode.prev);

    while (curNode) {
      nextNode = curNode.next;
      curNode.next = prevNode;
      _has(curNode, 'prev') && (curNode.prev = nextNode);
      prevNode = curNode;
      curNode = nextNode;
      if (nextNode === this.head) break;
    }
    this.head = prevNode;
  }

  remove(start, end) {
    if (!isTruthy(start) || start > this.length) return -1;

    if ([1, this.length].includes(start)) {
      return this[start === 1 ? 'shift' : 'pop']();
    } else {
      const prevNode = getNodeAt(this.head, 'next', start);
      let removeNodes = prevNode.next;
      if (isFinite(end) && end < this.length) {
        end = !Math.max(end, 0) ? this.length - end : end;
        if (end < start) return;
        removeNodes = getNodeAt(prevNode, 'next', end - start);
      }
      const nextNode = removeNodes.next;
      prevNode.next = nextNode;
      if (this.tail && this._TYPE === 'doublyLinked') {
        nextNode.prev = prevNode;
      }
      this.length = end - start || start;
      return removeNodes;
    }
  }

  empty() {
    this.head = null;
    if (this.tail) this.tail = this.head;
    this.length = -this.length;
  }
}
