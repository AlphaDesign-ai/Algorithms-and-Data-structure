'use strict';
import LinkedList from './component.js';
import Node from '../node/node.js';
import { partialRight, partial } from '../../util/utility.js';
import { createNode, genChainedNodes } from '../../util/helper.js';
import { isTruthy } from '../../util/utility.js';

const configD = (_this) => {
  _this.next = null;
  _this.prev = null;
};

//DoublyLinkedList

const NodeConstruct = partialRight(Node.of, configD);
const createChainedNode = partial(
  genChainedNodes().configure({
    Node: NodeConstruct,
    isDouble: true,
    count: 0,
  }).start
);

const setUpNode = partialRight(createNode, NodeConstruct, createChainedNode);

class DoublyLinkedList extends LinkedList {
  constructor(item) {
    super(true);
    this._TYPE = 'doublyLinked';
    this.setUp = setUpNode;
    isTruthy(item) && this.append(item);
    return this;
  }
}

export default DoublyLinkedList;
