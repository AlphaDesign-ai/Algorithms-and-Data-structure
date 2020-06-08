'use strict';

const setup = function (cb) {
  cb.call(this);
};

export default class Node {
  constructor(data, cb) {
    this.data = data;
    setup.call(this, cb);
  }

  printNodeItem(item) {
    console.log(item.data);
  }
}
