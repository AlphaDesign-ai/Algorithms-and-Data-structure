//Merge Sort
function mergeSort(
  unsortedListA,
  unsortedListB,
  unsortedListSizeA = unsortedListA.length,
  unsortedListSizeB = unsortedListB.length
) {
  //declaration of the index of the current element in each array or position
  let currentIndexOfUnsortedListA,
    currentIndexOfUnsortedListB,
    CurrentIndexOfTheMergedSortArray,
    MergedSortArray = [];

  //initializing the variable an initial value;
  currentIndexOfUnsortedListA =
    currentIndexOfUnsortedListB =
    CurrentIndexOfTheMergedSortArray =
      0;

  //checking to see if any of the list have been fully check and compared

  while (
    currentIndexOfUnsortedListA < unsortedListSizeA &&
    currentIndexOfUnsortedListB < unsortedListSizeB
  ) {
    //comparing the value of the current index with one another

    if (
      unsortedListA[currentIndexOfUnsortedListA] >
      unsortedListB[currentIndexOfUnsortedListB]
    ) {
      //if the current element from the first list is greater than the other
      MergedSortArray[CurrentIndexOfTheMergedSortArray++] =
        unsortedListB[currentIndexOfUnsortedListB++];
    } else {
      //if the current element from the second list is greater than the other
      MergedSortArray[CurrentIndexOfTheMergedSortArray++] =
        unsortedListA[currentIndexOfUnsortedListA++];
    }
  }

  return MergedSortArray.concat(
    unsortedListA.slice(currentIndexOfUnsortedListA),
    unsortedListB.slice(currentIndexOfUnsortedListB)
  );
}

function mergeSorting(
  unSortedList,
  middleIndex = Math.trunc(unSortedList.length / 2)
) {
  //base case check is the length of the list is small
  if (!(unSortedList.length - 1)) {
    return unSortedList;
  }

  //if the list is still big then break down and merge each element
  return mergeSort(
    mergeSorting(unSortedList.slice(0, middleIndex)),
    mergeSorting(unSortedList.slice(middleIndex))
  );
}

export default mergeSorting;
