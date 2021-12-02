namespace Lab4 {
  const CONST_ATTR = "data-constant-name";
  export let tree: PreAST | null = null;

  export const step1 = () => {
    const source = <HTMLInputElement> document.getElementById("source");
    const parens = <HTMLElement> document.getElementById("parens");
    const ast = <HTMLElement> document.getElementById("ast");
    const constants = <HTMLTableElement> document.getElementById("constants");
    const constantsForm = <HTMLTableElement> document.getElementById("constants_form");
    const expandedAST = <HTMLElement> document.getElementById("expanded_ast");
    const expandedParens = <HTMLElement> document.getElementById("expanded_parens");
    const result = <HTMLElement> document.getElementById("result");
    const astDoubleNeg = <HTMLElement> document.getElementById("ast_double_neg");
    const parensDoubleNeg = <HTMLElement> document.getElementById("parens_double_neg");
    const resultDoubleNeg = <HTMLElement> document.getElementById("result_double_neg");

    tree = parseTree(source.value);
    if (tree == null) {
      ast.innerHTML = "<span>error: invalid input</span>";
      parens.innerHTML = "";
      constantsForm.style.visibility = "hidden";
      constantsForm.setAttribute("disabled", "disabled");
    } else {
      ast.innerHTML = renderTree(tree).outerHTML;
      parens.innerHTML = astToString(tree);
      const constantNames = allConstantNames(tree);
      constants.innerHTML =
        constantNames.size > 0
          ? renderConsts(constantNames)
            .map(row => row.outerHTML)
            .join("")
          : "<tr><td>(no constants in expression)</td></tr>";
      constantsForm.style.visibility = "visible";
      constantsForm.setAttribute("disabled", "enabled");
    }

    expandedAST.innerHTML = "";
    expandedParens.innerHTML = "";
    result.innerHTML = "";
    astDoubleNeg.innerHTML = "";
    parensDoubleNeg.innerHTML = "";
    resultDoubleNeg.innerHTML = "";
  };

  export const step2 = (tree: PreAST) => {
    const expandedAST = <HTMLElement> document.getElementById("expanded_ast");
    const expandedParens = <HTMLElement> document.getElementById("expanded_parens");
    const result = <HTMLElement> document.getElementById("result");
    const astDoubleNeg = <HTMLElement> document.getElementById("ast_double_neg");
    const parensDoubleNeg = <HTMLElement> document.getElementById("parens_double_neg");
    const resultDoubleNeg = <HTMLElement> document.getElementById("result_double_neg");

    const missing: string[] = [];
    let anyMissing = false;
    const env: { [name: string]: Value | null } = {};
    document.querySelectorAll<HTMLInputElement>(`[${CONST_ATTR}]`).forEach(elem => {
      const name = elem.getAttribute(CONST_ATTR)!;
      env[name] = parseValue(elem.value);
      if (env[name] == null) {
        missing.push(name);
        anyMissing = true;
      }
    });

    if (anyMissing) {
      expandedAST.innerHTML = `<span>error: invalid input for ${missing.join(", ")}</span>`;
      expandedParens.innerHTML = "";
      result.innerHTML = "";
      astDoubleNeg.innerHTML = "";
      parensDoubleNeg.innerHTML = "";
      resultDoubleNeg.innerHTML = "";
    } else {
      const expandedTree =
        expandNamedConstants(
          { lookup: name => env[name] ?? null },
          tree!);
      expandedAST.innerHTML = renderTree(expandedTree).outerHTML;
      expandedParens.innerHTML = astToString(expandedTree);

      const optimizedTree = removeDoubleNegations(expandedTree);

      try {
        result.innerText = astToString(interpret(expandedTree));
      } catch (e) {
        if (e instanceof InterpreterError)
          result.innerText = e.message;
      }

      astDoubleNeg.innerHTML = renderTree(optimizedTree).outerHTML;
      parensDoubleNeg.innerHTML = astToString(optimizedTree);

      try {
        resultDoubleNeg.innerHTML = astToString(interpret(optimizedTree));
      } catch (e) {
        if (e instanceof InterpreterError)
          resultDoubleNeg.innerText = e.message;
      }
    }
  };

  const allConstantNames = (tree: PreAST): Set<string> => {
    if (tree instanceof ConstLeaf)
      return new Set([tree.name]);
    else if (tree instanceof UnaryNode)
      return allConstantNames(tree.subtree);
    else if (tree instanceof BinaryNode)
      return new Set([
        ...allConstantNames(tree.leftSubtree),
        ...allConstantNames(tree.rightSubtree),
      ]);
    else if (tree instanceof ConditionalNode)
      return new Set([
        ...allConstantNames(tree.conditionSubtree),
        ...allConstantNames(tree.trueBranchSubtree),
        ...allConstantNames(tree.falseBranchSubtree)
      ]);
    else
      return new Set;
  };

  const parseValue = (source: string): Value | null => {
    const floatVal = parseFloat(source);
    if (isFinite(floatVal))
      return new NumLeaf(floatVal);
    else if (source.startsWith('"') && source.endsWith('"'))
      return new StringLeaf(source.slice(1,-1));
    else if (source == "true")
      return new BoolLeaf(true);
    else if (source == "false")
      return new BoolLeaf(false);
    else
      return null;
  };

  const tokenize = (source: string): string[] | null => {
    if (source == "") return [];
    const match = source.match(/^\s*(?:(?:"[^"]*?")|(?:\d+(?:\.\d+)?)|(?:\b[A-Za-z_][A-Za-z0-9_]*\b)|[<&*?:()@+-])\s*/);
    if (match == null) return null;
    const token = match[0]!;
    const rest = tokenize(source.slice(token.length));
    if (rest == null) return null;
    return [token.trim(), ...rest];
  };

  const parseTree = (source: string): PreAST | null => {
    const tokens = tokenize(source);
    if (tokens == null) return null;
    const parse = parsePreAST(tokens);
    if (parse == null) return null;
    const [tree, tail] = parse;
    if (tail.length != 0) return null;
    return tree;
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
    } else if (tree instanceof ConstLeaf) {
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
    } else if (tree instanceof ConditionalNode) {
      rootElement.setAttribute("data-name", "?:");
      rootElement.appendChild(renderNode(tree.conditionSubtree));
      rootElement.appendChild(renderNode(tree.trueBranchSubtree));
      rootElement.appendChild(renderNode(tree.falseBranchSubtree));
    }

    return rootElement;
  };

  const renderConsts = (names: Set<string>): HTMLElement[] => {
    const header = document.createElement("tr");
    header.innerHTML = "<th>Name</th><th>Value</th>";
    const rows = Array.from(names).map(name => {
      const id = "constant-" + name;
      const row = document.createElement("tr");
      const label =
        row
          .appendChild(document.createElement("td"))
          .appendChild(document.createElement("label"));
      label.setAttribute("for", id);
      label.innerText = name;
      const input =
        row
          .appendChild(document.createElement("td"))
          .appendChild(document.createElement("input"));
      input.setAttribute("type", "text");
      input.setAttribute("id", id);
      input.setAttribute(CONST_ATTR, name);
      return row;
    });
    return [header, ...rows];
  };

  type Parser<T> = (tokens: string[]) => [T, string[]] | null;

  const parsePreAST: Parser<PreAST> = tokens =>
    parseTernary(tokens);

  const parseAtom: Parser<PreAST> = tokens =>
    parseNum(tokens) ??
    parseBool(tokens) ??
    parseString(tokens) ??
    parseParens(tokens) ??
    parseConst(tokens);

  const parseParens: Parser<PreAST> = tokens => {
    const [head, ...tail] = tokens;
    if (head != '(') return null;
    const parse = parsePreAST(tail);
    if (parse == null) return null;
    const [tree, [head1, ...tail1]] = parse;
    if (head1 != ')') return null;
    return [tree, tail1];
  };

  const parseNum: Parser<NumLeaf> = tokens => {
    const [head, ...tail] = tokens;
    if (head == undefined) return null;
    const value = parseFloat(head);
    if (!isFinite(value)) return null;
    return [new NumLeaf(value), tail];
  };

  const parseBool: Parser<BoolLeaf> = tokens => {
    const [head, ...tail] = tokens;
    switch (head) {
      case "true": return [new BoolLeaf(true), tail]; break;
      case "false": return [new BoolLeaf(false), tail]; break;
      default: return null;
    }
  };

  const parseString: Parser<StringLeaf> = tokens => {
    const [head, ...tail] = tokens;
    if (head == undefined || !head.startsWith("\"") || !head.endsWith("\""))
      return null;
    return [new StringLeaf(head.slice(1,-1)), tail];
  };

  const parseConst: Parser<ConstLeaf> = tokens => {
    const [head, ...tail] = tokens;
    if (head == undefined || !/[A-Z][A-Z_]*/.test(head)) return null;
    return [new ConstLeaf(head), tail];
  };

  const parseUnary: Parser<PreAST> = tokens =>
    parseNegate(tokens) ??
    parseToString(tokens) ??
    parseAtom(tokens);

  const parseNegate: Parser<NegateNode<PreAST>> = tokens => {
    const [head, ...tail] = tokens;
    if (head != '-') return null;
    const parse = parseUnary(tail);
    if (parse == null) return null;
    const [tree, tail1] = parse;
    return [new NegateNode(tree), tail1];
  };

  const parseToString: Parser<ToStringNode<PreAST>> = tokens => {
    const [head, ...tail] = tokens;
    if (head != '@') return null;
    const parse = parseUnary(tail);
    if (parse == null) return null;
    const [tree, tail1] = parse;
    return [new ToStringNode(tree), tail1];
  };

  const parseBinary4: Parser<PreAST> = tokens =>
    parseTimes(tokens) ??
    parseUnary(tokens);

  const parseTimes: Parser<TimesNode<PreAST>> = tokens => {
    const parse1 = parseUnary(tokens);
    if (parse1 == null) return null;
    const [tree1, [head, ...tail1]] = parse1;
    if (head != '*') return null;
    const parse2 = parseBinary4(tail1);
    if (parse2 == null) return null;
    const [tree2, tail2] = parse2;
    return [new TimesNode(tree1, tree2), tail2];
  };

  const parseBinary3: Parser<PreAST> = tokens =>
    parsePlus(tokens) ??
    parseBinary4(tokens);

  const parsePlus: Parser<PlusNode<PreAST>> = tokens => {
    const parse1 = parseBinary4(tokens);
    if (parse1 == null) return null;
    const [tree1, [head, ...tail1]] = parse1;
    if (head != '+') return null;
    const parse2 = parseBinary3(tail1);
    if (parse2 == null) return null;
    const [tree2, tail2] = parse2;
    return [new PlusNode(tree1, tree2), tail2];
  };

  const parseBinary2: Parser<PreAST> = tokens =>
    parseLessThan(tokens) ??
    parseBinary3(tokens);

  const parseLessThan: Parser<LessThanNode<PreAST>> = tokens => {
    const parse1 = parseBinary3(tokens);
    if (parse1 == null) return null;
    const [tree1, [head, ...tail1]] = parse1;
    if (head != '<') return null;
    const parse2 = parseBinary2(tail1);
    if (parse2 == null) return null;
    const [tree2, tail2] = parse2;
    return [new LessThanNode(tree1, tree2), tail2];
  };

  const parseBinary1: Parser<PreAST> = tokens =>
    parseAnd(tokens) ??
    parseBinary2(tokens);

  const parseAnd: Parser<AndNode<PreAST>> = tokens => {
    const parse1 = parseBinary2(tokens);
    if (parse1 == null) return null;
    const [tree1, [head, ...tail1]] = parse1;
    if (head != '&') return null;
    const parse2 = parseBinary1(tail1);
    if (parse2 == null) return null;
    const [tree2, tail2] = parse2;
    return [new AndNode(tree1, tree2), tail2];
  };

  const parseTernary: Parser<PreAST> = tokens =>
    parseConditional(tokens) ??
    parseBinary1(tokens);

  const parseConditional: Parser<ConditionalNode<PreAST>> = tokens => {
    const parse1 = parseBinary1(tokens);
    if (parse1 == null) return null;
    const [tree1, [head1, ...tail1]] = parse1;
    if (head1 != '?') return null;
    const parse2 = parseTernary(tail1);
    if (parse2 == null) return null;
    const [tree2, [head2, ...tail2]] = parse2;
    if (head2 != ':') return null;
    const parse3 = parseTernary(tail2);
    if (parse3 == null) return null;
    const [tree3, tail3] = parse3;
    return [new ConditionalNode(tree1, tree2, tree3), tail3];
  };
}