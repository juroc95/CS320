const oldWindowLoad8 = window.onload;
window.onload = event => {
  if (oldWindowLoad8) oldWindowLoad8.bind(window)(event);

  if (document.querySelector("title")?.innerText.startsWith("Lab assignment 8")) {
    Lab8.updateAll();
    for (const elem of Array.from(document.getElementsByTagName("input")))
      elem.oninput = () => Lab8.updateAll();
  }
};

namespace Lab8 {
  class ParseError extends Error { }

  const parseNum = (x: string) => {
    const num = parseFloat(x);
    if (isFinite(num)) return num;
    else throw new ParseError("invalid number: " + x);
  };

  const listValue = (list: HTMLInputElement) => {
    const splits = list.value.split(/\s*,\s*/);
    if (splits[splits.length-1] === "")
      splits.pop();
    return list.value ? Lab8.fromArray(splits.map(parseNum)) : null;
  };

  export const updateAll = () => {
    const html_list1 = <HTMLInputElement> document.getElementById("list1")!;
    const html_list1out = document.getElementById("list1out")!;
    const html_iterativeSum = document.getElementById("iterativeSum")!;
    const html_recursiveSum = document.getElementById("recursiveSum")!;
    const html_maximum = document.getElementById("maximum")!;
    const html_concatenate_list = <HTMLInputElement> document.getElementById("concatenate_list")!;
    const html_concatenated = document.getElementById("concatenated")!;
    const html_sumByFoldLeft = document.getElementById("sumByFoldLeft")!;
    const html_maximumByFoldRight = document.getElementById("maximumByFoldRight")!;
    const html_subtractByFoldLeft = document.getElementById("subtractByFoldLeft")!;
    const html_subtractByFoldRight = document.getElementById("subtractByFoldRight")!;
    const html_lookingFor = <HTMLInputElement> document.getElementById("lookingFor")!;
    const html_found = document.getElementById("found")!;
    const html_concatenateByFold = document.getElementById("concatenateByFold")!;
    const html_remove = <HTMLInputElement> document.getElementById("remove")!;
    const html_removed = document.getElementById("removed")!;

    try {
      const list1 = listValue(html_list1);
      html_list1out.innerHTML = render(list1);
      html_iterativeSum.innerText = Lab8.iterativeSum(list1).toString();
      html_recursiveSum.innerText = Lab8.recursiveSum(list1).toString();
      html_maximum.innerText = Lab8.maximum(list1).toString();

      try {
        const list2 = listValue(html_concatenate_list);
        html_concatenated.innerHTML = render(concatenateRecursive(list1,list2));
        html_concatenateByFold.innerHTML = render(concatenate(list1,list2));
      } catch (e: unknown) {
        if (e instanceof Error && e.constructor == ParseError) {
          html_concatenated.innerHTML = "";
          html_concatenateByFold.innerHTML = "";
        } else
          throw e;
      }

      html_sumByFoldLeft.innerText = Lab8.sumByFoldLeft(list1).toString();
      html_maximumByFoldRight.innerText = Lab8.maximumByFoldRight(list1).toString();
      html_subtractByFoldLeft.innerText = Lab8.subtractByFoldLeft(list1).toString();
      html_subtractByFoldRight.innerText = Lab8.subtractByFoldRight(list1).toString();

      try {
        const value = parseNum(html_lookingFor.value);
        html_found.innerText = Lab8.anyEqualTo(value, list1).toString();
      } catch (e: unknown) {
        if (e instanceof Error && e.constructor == ParseError)
          html_found.innerText = "";
        else
          throw e;
      }

      try {
        const value = parseNum(html_remove.value);
        html_removed.innerHTML = render(Lab8.removeAll(value, list1));
      } catch (e: unknown) {
        if (e instanceof Error && e.constructor == ParseError)
          html_removed.innerText = "";
        else
          throw e;
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.constructor == ParseError) {
        html_list1out.innerHTML = "";
        html_iterativeSum.innerHTML = "";
        html_recursiveSum.innerHTML = "";
        html_maximum.innerHTML = "";
        html_concatenated.innerHTML = "";
        html_sumByFoldLeft.innerHTML = "";
        html_maximumByFoldRight.innerHTML = "";
        html_subtractByFoldLeft.innerHTML = "";
        html_subtractByFoldRight.innerHTML = "";
        html_found.innerHTML = "";
        html_concatenateByFold.innerHTML = "";
        html_removed.innerHTML = "";
      } else
        throw e;
    }
  };

  const render = (list: Lab8.List<number>): string =>
    (list == null) ?
      "" :
      ("<li>" + list.head.toString() + "</li>" + render(list.tail));
}