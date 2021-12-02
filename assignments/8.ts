namespace Lab8 {
  export type List<T> = ListNode<T> | null;

  export class ListNode<T> {
    constructor(
      readonly head: T,
      readonly tail: List<T>
    ) {
      this.head = head;
      this.tail = tail;
    }
  }

  // fromArray([0,1,2]) =
  //   new ListNode(0, new ListNode(1, new ListNode(2, null)))
  export function fromArray<T>(array: readonly T[]): List<T> {
    let list: List<T> = null;
    const elems: T[] = Array.from(array); // copy array

    // pop removes an element from the end of an array
    for (let elem = elems.pop(); elem != null; elem = elems.pop())
      list = new ListNode(elem, list);

    return list;
  }

  // iterativeSum(fromArray([0,1,2,3])) =
  //   ((0 + 1) + 2) + 3
  export function iterativeSum(list: List<number>): number {
    let total = 0;
    while (list != null) {
      total += list.head;
      list = list.tail;
    }
    return total;
  }

  // recursiveSum(fromArray([0,1,2,3])) =
  //   0 + (1 + (2 + 3))
  export function recursiveSum(list: List<number>): number {
    if (list == null)
      return 0;
    else
      return list.head + recursiveSum(list.tail);
  }

  // maximum(fromArray([0,1,2,3])) =
  //   max(max(max(max(-Infinity, 0), 1), 2), 3)
  export function maximum(list: List<number>): number {
    let max = -Infinity; // this is a valid floating-point value!
    while (list != null) {
      max = Math.max(list.head, max);
      list = list.tail;
    }
    return max;
  }

  // concatenate(fromArray([0,1,2]), list2) =
  //   new ListNode(0, new ListNode(1, new ListNode(2, list2)))
  export function concatenateRecursive<T>(list1: List<T>, list2: List<T>): List<T> {
    if (list1 == null)
      return list2;
    else
      return new ListNode(
        list1.head,
        concatenateRecursive(list1.tail, list2)
      );
  }

  // foldLeft(fromArray([0,1,2,3]), acc, f) =
  //   f(f(f(f(acc, 0), 1), 2), 3)
  export function foldLeft<T1,T2>(
    list: List<T1>,
    initialAccumulatorValue: T2,
    accumulatingFunc: (elem: T1, accumulator: T2) => T2
  ): T2 {
    let accumulator: T2 = initialAccumulatorValue;
    while (list != null) {
      accumulator = accumulatingFunc(list.head, accumulator);
      list = list.tail;
    }
    return accumulator;
  }

  // foldRight(fromArray([0,1,2,3]), acc, f) =
  //   f(0, f(1, f(2, f(3, acc))))
  export function foldRight<T1,T2>(
    list: List<T1>,
    initialAccumulatorValue: T2,
    accumulatingFunc: (elem: T1, accumulator: T2) => T2
  ): T2 {
    if (list == null)
      return initialAccumulatorValue;
    else {
      const accumulator = foldRight(list.tail, initialAccumulatorValue, accumulatingFunc);
      return accumulatingFunc(list.head, accumulator);
    }
  }

  function add(x: number, y: number): number {
    return x + y;
  }

  export function sumByFoldLeft(list: List<number>): number {
    return foldLeft<number, number>(list, 0, add);
  }

  export function maximumByFoldRight(list: List<number>): number {
    return foldRight<number, number>(
      list,
      -Infinity,
      function (elem, max) {
        return Math.max(elem, max);
      }
    );
  }

  export function subtractByFoldLeft(list: List<number>): number {
    return foldLeft<number, number>(
      list,
      0,
      function (x, y) {
        return x - y;
      }
    );
  }

  export function subtractByFoldRight(list: List<number>): number {
    return foldRight<number, number>(
      list,
      0,
      function (x, y) {
        return x - y;
      }
    );
  }

  export function anyEqualTo(lookingFor: number, list: List<number>): boolean {
    return foldLeft<number, boolean>(
      list,
      false,
      function (x, y) {
        if (x == lookingFor) 
          y = true;
        return y;
      }
    );
  }

  export function concatenate<T>(list1: List<T>, list2: List<T>): List<T> {
    return foldRight<T, List<T>>(
      list1,
      list2,
      function (x, y) {
        return new ListNode(x, y);
      }
    );
  }

  export function removeAll(lookingFor: number, list: List<number>): List<number> {
    return foldRight<number, List<number>>(
      list,
      null,
      function (x, y) {
        if (x == lookingFor) {
          return y;
        }
        else {
          return new ListNode(x, y);
        }
      }
    );
  }
}