'use strict';

class HeapSort {
  constructor(heapList, heapTreeType) {
    this.heapList = heapList;
    this.heapListSize = this.heapList.length;
    this.heapTreeType = heapTreeType;
  }

  compareNode(firstNodePosition, secondNodePosition) {
    //base on the type perform this set of operation
    return this.heapTreeType
      ? this.heapList[firstNodePosition] > this.heapList[secondNodePosition]
      : this.heapList[firstNodePosition] < this.heapList[secondNodePosition];
  }

  swapNode(firstNodePosition, secondNodePosition, heapSwapType) {
    //swap node position
    this.heapList.splice(
      firstNodePosition,
      1,
      ...this.heapList.splice(
        secondNodePosition,
        1,
        this.heapList[firstNodePosition]
      )
    );
    // mainly specific for `min` heap
    if (heapSwapType) {
      [this.heapList[this.heapListSize - 1]] = this.heapList.splice(
        secondNodePosition,
        1
      );
    }
  }

  adjustNode(currentNodePosition, heapListSize) {
    //initial value for the compute is set to `undefined` by default
    let compareNode;
    //`compare value` is being compute
    compareNode = this.getCompareNode(currentNodePosition, heapListSize);
    //verify if `currentNodePosition` has aby descendant
    if (compareNode && compareNode.length) {
      //get `compareNode`
      compareNode = this.getHeapCompareNode(compareNode);
      //compare the `compare node` with it `parentNode`
      if (this.compareNode(currentNodePosition - 1, compareNode - 1)) {
        //perform a swap operation between the two nodes
        this.swapNode(currentNodePosition - 1, compareNode - 1);
        //repeat the operation for `nth` number of time
        this.adjustNode(compareNode, heapListSize);
      }
    }
  }

  getHeapCompareNode(compareNode) {
    //get `compareNode`
    return Object.is(compareNode.length, 2) &&
      this.compareNode(compareNode[0] - 1, compareNode[1] - 1)
      ? compareNode[1]
      : compareNode[0];
  }

  getNodeParent(currentNodePosition) {
    //get the parent Node
    return Math.trunc(currentNodePosition / 2);
  }

  getCompareNode(currentNodePosition, currentHeapSize) {
    //compute the value of the left child
    let leftNode = currentNodePosition * 2;
    //verify if the `currentNode` & `leftChildNode` is les than `currentHeapSize`
    return currentNodePosition <= currentHeapSize
      ? [leftNode, leftNode + 1].filter(
          (currentNodePosition) => currentNodePosition <= currentHeapSize
        )
      : null;
  }

  heapify(heapNode = this.heapListSize, heapListSize = heapNode) {
    if (!heapNode) return this.heapList;
    //adjust the node base on heapify
    this.adjustNode(heapNode, heapListSize);
    //repeat the process for `nth` number of time
    return this.heapify(--heapNode, heapListSize);
  }

  heapTree(currentNodePosition = 0, countHeapNode = this.heapListSize) {
    //declaration of parentNode alongside childNode
    let parentNode,
      swapNode = currentNodePosition;
    //check if count hasn't deduce to 0
    if (countHeapNode) {
      //check if the node ancestors isn't 0 and compare
      while (
        (parentNode = this.getNodeParent(swapNode + 1)) &&
        this.compareNode(parentNode - 1, swapNode)
      ) {
        //perform a swap of node
        this.swapNode(parentNode - 1, swapNode);
        //current swap node
        swapNode = parentNode - 1;
      }
      //call for `nth` time depending on the nodeList size
      this.heapTree(currentNodePosition + 1, --countHeapNode);
    }
  }

  sortHeap(countHeapNode = this.heapListSize) {
    if (!countHeapNode) return this.heapList;
    //remove the root and arrange base on the `heapType`
    this.swapNode(0, countHeapNode - 1, this.heapTreeType);
    //check if the tree still abide to the heap tree
    this.adjustNode(1, --countHeapNode);
    //repeat the operation for `nth` number of time
    return this.sortHeap(countHeapNode);
  }
}

export default HeapSort;
