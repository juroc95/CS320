const oldWindowLoad6 = window.onload;
window.onload = event => {
  if (oldWindowLoad6) oldWindowLoad6.bind(window)(event);

  if (document.querySelector("title")?.innerText.startsWith("Lab assignment 6")) {
    const constantsSubmit = <HTMLTableElement> document.getElementById("constants_submit");
    const go = <HTMLElement> document.getElementById("go");
    const input = <HTMLInputElement> document.getElementById("input");
    const inputLabel = <HTMLInputElement> document.getElementById("input_label");
    const inputSubmit = <HTMLInputElement> document.getElementById("input_submit");

    Lab6.inputType = null;

    constantsSubmit.setAttribute("disabled", "disabled");
    go.setAttribute("disabled", "disabled");
    inputLabel.innerText = "Not running.";
    input.setAttribute("disabled", "disabled");
    input.value = "";
    inputSubmit.setAttribute("disabled", "disabled");
  }
};

namespace Lab6 {
  let pageTree: Program<PreExpr3>;
  let pageProgram: Program<Expr>;
  const CONST_ATTR = "data-constant-name";

  export const step1 = () => {
    const source = <HTMLInputElement> document.getElementById("source");
    const parse = <HTMLElement> document.getElementById("parse");
    const parens = <HTMLElement> document.getElementById("parens");
    const constants = <HTMLTableElement> document.getElementById("constants");
    const constantsForm = <HTMLTableElement> document.getElementById("constants_form");
    const constantsSubmit = <HTMLTableElement> document.getElementById("constants_submit");
    const expandedAST = <HTMLElement> document.getElementById("expanded_ast");
    const expandedParens = <HTMLElement> document.getElementById("expanded_parens");
    const typecheck = <HTMLElement> document.getElementById("typecheck");
    const go = <HTMLElement> document.getElementById("go");
    const input = <HTMLInputElement> document.getElementById("input");
    const inputLabel = <HTMLInputElement> document.getElementById("input_label");
    const inputSubmit = <HTMLElement> document.getElementById("input_submit");
    const output = <HTMLElement> document.getElementById("output");

    inputType = null;
    constantsSubmit.setAttribute("disabled", "disabled");
    expandedAST.innerHTML = "";
    expandedParens.innerHTML = "";
    typecheck.innerHTML = "";
    output.innerHTML = "";
    input.setAttribute("disabled", "disabled");
    inputLabel.innerText = "Not running.";
    inputSubmit.setAttribute("disabled", "disabled");
    go.setAttribute("disabled", "disabled");

    try {
      pageTree = parseProgram(source.value);
      parse.innerHTML = renderTree(pageTree).outerHTML;
      parens.innerText = programToString(pageTree);
      const constantNames = allConstantNames(pageTree);
      constants.innerHTML =
        constantNames.size > 0
          ? renderConsts(constantNames)
            .map(row => row.outerHTML)
            .join("")
          : "<tr><td>(no constants in expression)</td></tr>";
      constantsForm.style.visibility = "visible";
      constantsSubmit.removeAttribute("disabled");
    } catch (e) {
      if (e instanceof Error) {
        if (e.constructor == TokenizingError) {
          parse.innerHTML = "tokenizing error: " + e["message"];
          parens.innerText = "";
          constantsForm.style.visibility = "hidden";
        } else if (e.constructor == ParseError) {
          parse.innerHTML = "parse error: " + e["message"];
          parens.innerText = "";
          constantsForm.style.visibility = "hidden";
        } else
          console.error(e);
      }
    }
  };

  export const step2 = () => {
    const expandedAST = <HTMLElement> document.getElementById("expanded_ast");
    const expandedParens = <HTMLElement> document.getElementById("expanded_parens");
    const typecheck = <HTMLElement> document.getElementById("typecheck");
    const go = <HTMLElement> document.getElementById("go");
    const input = <HTMLInputElement> document.getElementById("input");
    const inputLabel = <HTMLInputElement> document.getElementById("input_label");
    const inputSubmit = <HTMLElement> document.getElementById("input_submit");
    const output = <HTMLElement> document.getElementById("output");

    inputType = null;
    input.setAttribute("disabled", "disabled");
    inputLabel.innerText = "Not running.";
    inputSubmit.setAttribute("disabled", "disabled");
    output.innerHTML = "";

    try {
      const env: Env<Value> = new Map;
      document.querySelectorAll<HTMLInputElement>(`[${CONST_ATTR}]`).forEach(elem => {
        const name = elem.getAttribute(CONST_ATTR)!;
        const value = parseCompleteExpr(tokenize(elem.value));
        if (!isValue(value))
          throw new ParseError(`invalid value for ${name}: ${exprToString(value)}`);
        env.set(name, value);
      });

      pageProgram = <Program<Expr>> pageTree.map(subtree => expandStmt(env, subtree));

      expandedAST.innerHTML = renderTree(pageProgram).outerHTML;
      expandedParens.innerHTML = programToString(pageProgram);
      go.removeAttribute("disabled");
      typecheckProg(pageProgram);
      typecheck.innerHTML = "OK!";
    } catch (e) {
      if (e instanceof Error) {
        if (e.constructor == ParseError) {
          expandedAST.innerHTML = "parse error: " + e["message"];
          expandedParens.innerHTML = "";
          typecheck.innerHTML = "";
          go.setAttribute("disabled", "disabled");
        } else if (e.constructor == TypeError)
          typecheck.innerHTML = "type error: " + e["message"];
        else
          console.error(e);
      }
    }
  };

  export const step3 = async () => {
    const inputLabel = <HTMLElement> document.getElementById("input_label");
    const go = <HTMLElement> document.getElementById("go");
    const output = <HTMLElement> document.getElementById("output");

    inputType = null;
    output.innerText = "";

    go.setAttribute("disabled", "disabled");

    try {
      await run(pageProgram);
      go.removeAttribute("disabled");
    } catch (e) {
      if (e instanceof Error) {
        if (e.constructor == RuntimeError) {
          go.removeAttribute("disabled");
          output.innerText += "\nRuntime error: " + e["message"];
        } else if (e.constructor != InterruptError)
          console.error(e);
      }
    } finally {
      inputLabel.innerText = "Not running.";
    }
  };

  const wait =
    async (time: number): Promise<void> =>
      new Promise(handler => setTimeout(handler, time));

  export let inputValue: Value | null = null;
  export let inputType: Type | null = null;

  class InterruptError extends Error { }

  export const runtime: Runtime = {
    input: async type => {
      const input = <HTMLInputElement> document.getElementById("input");
      const inputLabel = <HTMLElement> document.getElementById("input_label");
      const inputSubmit = <HTMLElement> document.getElementById("input_submit");
      inputLabel.innerText = `Enter input of type ${typeToString(type)}: `;
      input.removeAttribute("disabled");
      inputSubmit.removeAttribute("disabled");
      inputType = type;
      while (inputValue == null) {
        await wait(100);
        if (inputType == null)
          throw new InterruptError;
      }
      inputType = null;
      inputLabel.innerText = "Executing...";
      input.setAttribute("disabled", "disabled");
      input.value = "";
      inputSubmit.setAttribute("disabled", "disabled");
      const value = inputValue;
      inputValue = null;
      return value;
    },

    output: value => {
      const output = <HTMLInputElement> document.getElementById("output");
      output.innerText += "\n" + exprToString(value);
    }
  };

  export const submitInput = () => {
    const input = <HTMLInputElement> document.getElementById("input");
    const output = <HTMLInputElement> document.getElementById("output");
    try {
      const expr = parseCompleteExpr(tokenize(input.value));
      if (isValue(expr) && equalTypes(inferExprType(new Map, expr), inputType!)) {
        inputValue = expr;
      } else
        output.innerText += "\nInvalid input, try again.";
    } catch (e) {
      output.innerText += "\nInvalid input, try again.";
    }
  };

  const renderTree = (tree: PreExpr2 | Stmt<PreExpr2> | Program<PreExpr2>): HTMLElement => {
    const treeElement = document.createElement("ast-tree");
    treeElement.appendChild(renderNode(tree));
    return treeElement;
  };

  // helps catch missing cases at compile-time
  const assertNever = <T> (_: never): T => {
    throw new Error("missing case in type narrowing");
  };

  const renderNode = (tree: PreExpr2 | Stmt<PreExpr2> | Program<PreExpr2>): HTMLElement => {
    const rootElement = document.createElement("ast-node");
    if (tree instanceof NumLeaf) {
      rootElement.setAttribute("data-name", tree.value.toString());
    } else if (tree instanceof BoolLeaf) {
      rootElement.setAttribute("data-name", tree.value.toString());
    } else if (tree instanceof StringLeaf) {
      rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
    } else if (tree instanceof NameLeaf) {
      rootElement.setAttribute("data-name", tree.name);
    } else if (tree instanceof InputLeaf) {
      rootElement.setAttribute("data-name", "input(" + typeToString(tree.inputType) + ")");
    } else if (tree instanceof ArrayNode) {
      const elemString = tree.subtreeArray.length > 0 ? "[...]" : "[]";
      rootElement.setAttribute("data-name", typeToString(tree.elementType) + elemString);
      for (const subtree of tree.subtreeArray)
        rootElement.appendChild(renderNode(subtree));
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
    } else if (tree instanceof IndexNode) {
      rootElement.setAttribute("data-name", "#");
      rootElement.appendChild(renderNode(tree.leftSubtree));
      rootElement.appendChild(renderNode(tree.rightSubtree));
    } else if (tree instanceof ConditionalNode) {
      rootElement.setAttribute("data-name", "?:");
      rootElement.appendChild(renderNode(tree.conditionSubtree));
      rootElement.appendChild(renderNode(tree.trueBranchSubtree));
      rootElement.appendChild(renderNode(tree.falseBranchSubtree));
    } else if (tree instanceof OutputNode) {
      rootElement.setAttribute("data-name", "output(...)");
      rootElement.appendChild(renderNode(tree.subtree));
    } else if (tree instanceof VarDeclNode) {
      rootElement.setAttribute("data-name", `var ${tree.varName} : ${typeToString(tree.varType)} <- ...`);
      rootElement.appendChild(renderNode(tree.subtree));
    } else if (tree instanceof AssignNode) {
      rootElement.setAttribute("data-name", `${tree.varName} <- ...`);
      rootElement.appendChild(renderNode(tree.subtree));
    } else if (Array.isArray(tree)) {
      rootElement.setAttribute("data-name", "Program");
      for (const subtree of tree)
        rootElement.appendChild(renderNode(subtree));
    } else
      assertNever(tree);

    return rootElement;
  };

  const union = <T> (...sets: Set<T>[]): Set<T> =>
    sets.reduce(
      (set1, set2) => new Set([...set1, ...set2]),
      new Set<T>()
    );

  const allConstantNames = (tree: PreExpr3 | Program<PreExpr3>): Set<string> => {
    if (tree instanceof ConstLeaf)
      return new Set([tree.name]);
    if (tree instanceof ArrayNode)
      return union(...tree.subtreeArray.map(allConstantNames));
    else if (tree instanceof UnaryNode)
      return allConstantNames(tree.subtree);
    else if (tree instanceof BinaryNode)
      return union(
        allConstantNames(tree.leftSubtree),
        allConstantNames(tree.rightSubtree)
      );
    else if (tree instanceof ConditionalNode)
      return union(
        allConstantNames(tree.conditionSubtree),
        allConstantNames(tree.trueBranchSubtree),
        allConstantNames(tree.falseBranchSubtree)
      );
    else if (Array.isArray(tree))
      return union(...tree.map(allConstantNames));
    else
      return new Set;
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
}