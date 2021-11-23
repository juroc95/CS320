// A StringList value is either a StringListNode or null.
// This is like a typedef in C/C++, but explicit about the possibility of null.
// (The | operator also has more power that we'll see later.)
type StringList = StringListNode | null;

// A StringListNode has a head value and a possibly-empty tail list.
// Note that this is different than C++ terminology: the tail is
// *everything but the head element*, not just the last element.
class StringListNode {
  // The readonly modifier means that these fields are only set once,
  // when an object is initialized. They can't be modified later.
  // It's similar to const, but fields of a class use readonly instead of const.
  readonly head: string;
  readonly tail: StringList;

  constructor(head: string, tail: StringList) {
    this.head = head;
    this.tail = tail;
  }
}

// Like in many languages, we write string[] for the type of arrays of strings.
// The StringList here is the function's return type.
function fromArray(array: string[]): StringList {
  let list: StringList = null;

  // This special kind of for loop iterates over each element of an array,
  // assigning the name x to each one in sequence.
  for (const x of array)
    list = new StringListNode(x, list);

  return list;
}

// Concatenate all the strings in the list into a single string.
function concatenateAll(list: StringList): string {
  if (list == null)
    return "";
  else
    return list.head + concatenateAll(list.tail); // + joins strings together
}

// Add some text to the front of each string in the list.
// Remember that we can't modify a list node after initialization,
// so instead we're returning a modified copy of the list.
function prependToEach(x: string, list: StringList): StringList {
  if (list == null)
    return null;
  else
    return new StringListNode(x + list.head, prependToEach(x, list.tail));
}

// Append an element to the end of the list.
function appendLast(list: StringList, x: string): StringList {
  if (list == null)
    return new StringListNode(x, null);
  else
    return new StringListNode(list.head, appendLast(list.tail, x));
}

// Reverse the list. (wrapper)
function reverse(list: StringList): StringList{
  let newlist: StringList = null;
  return reverse_inner(newlist, list);
}
// Reverse the list.
function reverse_inner(newlist: StringList, list: StringList): StringList{
  if(list == null){
    return null;
  }
  newlist = reverse_inner(newlist, list.tail);
  if(newlist == null){
    newlist = new StringListNode(list.head, null);
  }
  else{
    newlist = new StringListNode(newlist.head, appendLast(newlist.tail, list.head));
  }
  return newlist;
}

// Remove *every* occurrence of a string from the list.
function removeAll(x: string, list: StringList): StringList {
  if(list == null){
    return null;
  }
  if(list.head == x){
    return removeAll(x, list.tail);
  }
  else{
    return new StringListNode(list.head, removeAll(x, list.tail));
  }
}

// Alternate elements between two lists.
function interleave(list1: StringList, list2: StringList): StringList{
  if(list1 == null){
    return list2;
  }
  if(list2 == null){
    return list1;
  }
  return new StringListNode(list1.head, interleave(list2, list1.tail));
}