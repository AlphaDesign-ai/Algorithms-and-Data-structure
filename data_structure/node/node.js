'use strict';
export default class Node {
  constructor(data, cb) {
    this.data = data;
    //call cb on function detect
    Function[Symbol.hasInstance](cb) ? cb(this) : null;
  }
}

Node.of = (data, setter) => new Node(data, setter);
