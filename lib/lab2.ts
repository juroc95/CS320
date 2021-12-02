window.onload = _ => {
  if (document.querySelector("title")?.innerText.startsWith("Lab assignment 2")) {
    const list1In: HTMLInputElement = document.getElementById("list1") as HTMLInputElement;
    const list1Out: HTMLOListElement = document.getElementById("list1out") as HTMLOListElement;
    const concatenateOut: HTMLSpanElement = document.getElementById("concatenated") as HTMLSpanElement;
    const prependIn: HTMLInputElement = document.getElementById("prepend") as HTMLInputElement;
    const prependOut: HTMLOListElement = document.getElementById("prepended") as HTMLOListElement;
    const reverseOut: HTMLOListElement = document.getElementById("reversed") as HTMLOListElement;
    const removeIn: HTMLInputElement = document.getElementById("remove") as HTMLInputElement;
    const removeOut: HTMLOListElement = document.getElementById("removed") as HTMLOListElement;
    const interleaveIn: HTMLInputElement = document.getElementById("interleave") as HTMLInputElement;
    const interleaveOut: HTMLOListElement = document.getElementById("interleaved") as HTMLOListElement;

    const listValue = (list: HTMLInputElement) =>
      list.value ? fromArray(list.value.split(/\s*,\s*/).reverse()) : null;

    const updateAll = () => {
      const list1 = listValue(list1In);
      update(list1, list1Out);
      concatenateOut.innerText = concatenateAll(list1);
      update(prependToEach(prependIn.value, list1), prependOut);
      update(reverse(list1), reverseOut);
      update(removeAll(removeIn.value, list1), removeOut);
      update(interleave(list1, listValue(interleaveIn)), interleaveOut);
    }

    updateAll();

    list1In.oninput = updateAll;

    prependIn.oninput = _ => {
      update(prependToEach(prependIn.value, listValue(list1In)), prependOut);
    }

    removeIn.oninput = _ => {
      update(removeAll(removeIn.value, listValue(list1In)), removeOut);
    }

    interleaveIn.oninput = _ => {
      update(interleave(listValue(list1In), listValue(interleaveIn)), interleaveOut);
    }
  }
}

function clearChildren(element: HTMLElement) {
  while (element.firstChild)
    element.removeChild(element.firstChild);
}

function render(list: StringList, listElement: HTMLOListElement | HTMLUListElement): void {
  if (list != null) {
    const stringElement = document.createElement("li");
    stringElement.innerText = list.head;
    listElement.appendChild(stringElement);
    render(list.tail, listElement);
  }
}

function update(list: StringList, listElement: HTMLOListElement | HTMLUListElement): void {
    clearChildren(listElement);
    render(list, listElement);
}
