'use strict';
export default class Node {
  constructor(data, cb) {
    this.data = data;
    Function[Symbol.hasInstance](cb) ? cb(this) : null;
  }
}

Node.of = (data, setter) => new Node(data, setter);
