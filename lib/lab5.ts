namespace Lab5 {

  export const step1 = () => {
    const source = <HTMLInputElement> document.getElementById("source");
    const tokensElem = <HTMLElement> document.getElementById("tokens");
    const ast = <HTMLElement> document.getElementById("parse");
    const parens = <HTMLElement> document.getElementById("parens");
    const desugared = <HTMLElement> document.getElementById("desugared");
    const desugaredParens = <HTMLElement> document.getElementById("desugared_parens");

    try {
      const tokens = tokenize(source.value);
      tokensElem.innerText = tokenListToString(tokens);
      const tree = parse(tokens);
      ast.innerHTML = renderTree(tree).outerHTML;
      parens.innerText = astToString(tree);
      const tree1 = desugar(tree);
      desugared.innerHTML = renderTree(tree1).outerHTML;
      desugaredParens.innerText = astToString(tree1);
    } catch (e) {
      parens.innerText = "";
      desugared.innerText = "";
      desugaredParens.innerText = "";
      if (e instanceof Error) {
        if (e.constructor == TokenizingError) {
          tokensElem.innerText = "tokenizing error, " + e["message"]!;
          ast.innerText = "";
        } else if (e.constructor == ParsingError) {
          ast.innerText = "parsing error, " + e["message"]!;
        }
      } else
        throw e;
    }
  };

  const renderTree = (tree: PreAST): HTMLElement => {
    const treeElement = document.createElement("ast-tree");
    treeElement.appendChild(renderNode(tree));
    return treeElement;
  };

  const renderNode = (tree: PreAST): HTMLElement => {
    const rootElement = document.createElement("ast-node");
    if (tree instanceof NumLeaf) {
      rootElement.setAttribute("data-name", tree.value.toString());
    } else if (tree instanceof BoolLeaf) {
      rootElement.setAttribute("data-name", tree.value.toString());
    } else if (tree instanceof StringLeaf) {
      rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
    } else if (tree instanceof NameLeaf) {
      rootElement.setAttribute("data-name", tree.name);
    } else if (tree instanceof NegateNode) {
      rootElement.setAttribute("data-name", "-");
      rootElement.appendChild(renderNode(tree.subtree));
    } else if (tree instanceof ToStringNode) {
      rootElement.setAttribute("data-name", "@");
      rootElement.appendChild(renderNode(tree.subtree));
    } else if (tree instanceof PlusNode) {
      rootElement.setAttribute("data-name", "+");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof TimesNode) {
      rootElement.setAttribute("data-name", "*");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof AndNode) {
      rootElement.setAttribute("data-name", "&");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof LessThanNode) {
      rootElement.setAttribute("data-name", "<");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof EqualNode) {
      rootElement.setAttribute("data-name", "=");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof GreaterThanNode) {
      rootElement.setAttribute("data-name", ">");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof ConditionalNode) {
      rootElement.setAttribute("data-name", "?:");
      rootElement.appendChild(renderNode(tree.conditionSubtree));
      rootElement.appendChild(renderNode(tree.trueBranchSubtree));
      rootElement.appendChild(renderNode(tree.falseBranchSubtree));
    }

    return rootElement;
  };

}
