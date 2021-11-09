'use strict';
//quick sort
function partition(
  unsortedList,
  lowerBound = 0,
  upperBound = unsortedList.length - 1
) {
  //declaration of our variable
  let pivot = unsortedList[lowerBound];
  let incrementHigherValueCheck = lowerBound;
  let decrementLowerCheck = upperBound;

  //verify if the `incrementHigherValueCheck` hasn't exceed or cross over to the Boundary
  //`decrementLowerCheck`
  while (incrementHigherValueCheck < decrementLowerCheck) {
    //start the check from the item after the pivot
    do {
      incrementHigherValueCheck++;

      //verify if the `item` at the `current index` isn't greater than the `pivot`
    } while (unsortedList[incrementHigherValueCheck] <= pivot);

    //decrement and check if the `item` at the `current index` isn't less than the `pivot`
    while (unsortedList[decrementLowerCheck] > pivot) {
      decrementLowerCheck--;
    }

    //check if the `incrementHigherValueCheck` is less than `decrementLowerCheck`
    //if so continue with the swap process
    if (incrementHigherValueCheck < decrementLowerCheck) {
      unsortedList.splice(
        decrementLowerCheck,
        1,
        ...unsortedList.splice(
          incrementHigherValueCheck,
          1,
          unsortedList[decrementLowerCheck]
        )
      );
    }
  }

  //if `incrementHigherValueCheck` has crossed the `decrementLowerCheck`
  //swap the pivot with the element at the `decrementLowerCheck`
  unsortedList.splice(
    lowerBound,
    1,
    ...unsortedList.splice(decrementLowerCheck, 1, pivot)
  );

  //return the new index of the pivot element
  return decrementLowerCheck;
}

export function quickSort(
  unsortedList,
  start = 0,
  end = unsortedList.length - 1
) {
  //check if the `lowerBound` is less than the `higherBound`

  if (start < end) {
    //call our `partition()` and recursively call the `quicksort`
    const pivotIndex = partition(unsortedList, start, end);
    //set the pivot item in it position
    quickSort(unsortedList, start, pivotIndex - 1);
    quickSort(unsortedList, pivotIndex + 1, end);
  }
  //return the sortedList;
  return unsortedList;
}
