import Binary, { BinaryTree } from '../binaryTree.js';

export default class BinarySearch extends Binary {
  constructor(val) {
    super();
    this._root = null;
    if (val) {
      this.insert(val);
    }
  }

  insert(val) {
    if (!this._root) {
      return (this._root = new BinaryTree(val));
    }
    return super.constructor.insertNode(this._root, val), this._root;
  }

  toArray(type = 0) {
    if (typeof type !== 'number') throw new TypeError('Excepted an integer');

    return super.constructor.binaryNodeParker(this)(
      super.constructor.types[type % 4]
    );
  }
}
