'use strict';

export default class Node {
  constructor(data, cb) {
    this.data = data;
    cb(this);
  }
}
