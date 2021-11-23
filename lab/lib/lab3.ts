namespace Lab3 {
  export const update = () => {
    const source = <HTMLInputElement> document.getElementById("source");
    const parens = <HTMLElement> document.getElementById("parens");
    const result = <HTMLElement> document.getElementById("result");
    const ast = <HTMLElement> document.getElementById("ast");
    const nodeCountElem = <HTMLElement> document.getElementById("nodeCount");
    const leafCountElem = <HTMLElement> document.getElementById("leafCount");
    const maxNumElem = <HTMLElement> document.getElementById("maxNum");
    const doubleAllLeavesElem = <HTMLElement> document.getElementById("doubleAllLeaves");
    const doubleAllLeavesStrElem = <HTMLElement> document.getElementById("doubleAllLeavesStr");
    const removeAllNegationsElem = <HTMLElement> document.getElementById("removeAllNegations");
    const removeAllNegationsStrElem = <HTMLElement> document.getElementById("removeAllNegationsStr");

    const tree = parseTree(source.value);
    if (tree == null) {
      ast.innerHTML = "<span>error: invalid input</span>";
      parens.innerHTML = "";
      result.innerHTML = "";
      nodeCountElem.innerHTML = "";
      leafCountElem.innerHTML = "";
      maxNumElem.innerHTML = "";
      doubleAllLeavesElem.innerHTML = "";
      doubleAllLeavesStrElem.innerHTML = "";
      removeAllNegationsElem.innerHTML = "";
      removeAllNegationsStrElem.innerHTML = "";
    } else {
      ast.innerHTML = renderTree(tree).outerHTML;
      parens.innerHTML = astToString(tree);
      result.innerHTML = interpret(tree).toString();
      nodeCountElem.innerHTML = nodeCount(tree).toString();
      leafCountElem.innerHTML = leafCount(tree).toString();
      maxNumElem.innerHTML = maxNum(tree).toString();
      doubleAllLeavesElem.innerHTML = renderTree(doubleAllLeaves(tree)).outerHTML;
      doubleAllLeavesStrElem.innerHTML = astToString(doubleAllLeaves(tree));
      removeAllNegationsElem.innerHTML = renderTree(removeAllNegations(tree)).outerHTML;
      removeAllNegationsStrElem.innerHTML = astToString(removeAllNegations(tree));
    }
  }

  const renderTree = (tree: AST): HTMLElement => {
    const treeElement = document.createElement("ast-tree");
    treeElement.appendChild(renderNode(tree));
    return treeElement;
  }

  const renderNode = (tree: AST): HTMLElement => {
    const rootElement = document.createElement("ast-node");
    if (tree instanceof NumLeaf) {
      rootElement.setAttribute("data-name", tree.value.toString())
    } else if (tree instanceof PlusNode) {
      rootElement.setAttribute("data-name", "+");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof NegateNode) {
      rootElement.setAttribute("data-name", "-");
      rootElement.appendChild(renderNode(tree.subtree));
    }

    return rootElement;
  };

  const parseTree = (source: string): AST | null => {
    const tokens =
      Array.from(
        source.trim().matchAll(/(\d+(\.\d+)?)|[\w\(\)\+-]/g),
        (match, _) => match[0]!);
    const parse = parseNode(tokens);
    if (parse == null) return null;
    const [tree, tail] = parse;
    if (tail.length != 0) return null;
    return tree;
  }

  type Parser<T> = (tokens: string[]) => [T, string[]] | null;

  const parseNode: Parser<AST> = tokens =>
    parsePlus(tokens) ?? parseNegate(tokens) ?? parseAtom(tokens);

  const parseAtom: Parser<AST> = tokens =>
    parseNum(tokens) ?? parseParens(tokens);

  export const parseParens: Parser<AST> = tokens => {
    const [head, ...tail] = tokens;
    if (head != '(') return null;
    const parse = parseNode(tail);
    if (parse == null) return null;
    const [tree, [head2, ...tail2]] = parse;
    if (head2 !== ')') return null;
    return [tree, tail2];
  }

  const parseNum: Parser<NumLeaf> = tokens => {
    const [head, ...tail] = tokens;
    if (head == undefined) return null;
    const value = parseFloat(head);
    if (!isFinite(value)) return null;
    return [new NumLeaf(value), tail];
  }

  export const parseNegate: Parser<NegateNode> = tokens => {
    const [head, ...tail] = tokens;
    if (head != '-') return null;
    const parse = parseNegate(tail) ?? parseAtom(tail);
    if (parse == null) return null;
    const [tree, tail2] = parse;
    return [new NegateNode(tree), tail2];
  }

  const parsePlus: Parser<PlusNode> = tokens => {
    const parse1 = parseNegate(tokens) ?? parseAtom(tokens);
    if (parse1 == null) return null;
    const [tree1, [head, ...tail1]] = parse1;
    if (head != '+') return null;
    const parse2 = parsePlus(tail1) ?? parseNegate(tail1) ?? parseAtom(tail1);
    if (parse2 == null) return null;
    const [tree2, tail2] = parse2;
    return [new PlusNode(tree1, tree2), tail2];
  }
}
