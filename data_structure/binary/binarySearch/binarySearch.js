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
    return BinarySearch.insertNode(this._root, val), this._root;
  }

  toArray(type = 0) {
    if (typeof type !== 'number') throw new TypeError('Excepted an integer');
    return BinarySearch.binaryNodeParker(this)(type % 4);
  }
}
