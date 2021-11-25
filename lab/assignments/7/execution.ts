namespace Lab7 {
  function equalValues(val1: Value, val2: Value): boolean {
    if (val1 instanceof NumLeaf && val2 instanceof NumLeaf)
      return val1.value == val2.value;
    else if (val1 instanceof BoolLeaf && val2 instanceof BoolLeaf)
      return val1.value == val2.value;
    else if (val1 instanceof StringLeaf && val2 instanceof StringLeaf)
      return val1.value == val2.value;
    else if (val1 instanceof ArrayNode && val2 instanceof ArrayNode) {
      if (val1.subtreeArray.length != val2.subtreeArray.length)
        return false;
      for (const [index, val] of val1.subtreeArray.entries())
        if (val != val2.subtreeArray[index])
          return false;
      return true;
    } else
      return false;
  }

  export class RuntimeError extends Error { }

  export interface Runtime {
    input(type: Type): Promise<Value>;
    output(value: Value): void;
  }

  // defined in lib/lab6.ts:
  // export const runtime: Runtime = ...;

  export async function evaluate(
    prog: Program<Expr>,
    env: Env<Value>,
    tree: Expr
  ): Promise<Value> {
    if (tree instanceof VarLeaf) {
      const variableType = env.get(tree.name);
      if (variableType != null)
        return variableType;
      else
        throw new RuntimeError(
          "undefined variable " + tree.name
        );
    }
    else if (tree instanceof InputLeaf)
      return await runtime.input(tree.inputType);
    else if (tree instanceof ValueLeaf)
      return tree;
    else if (tree instanceof ArrayNode) {
      const valueArray: Value[] = new Array(tree.subtreeArray.length);
      for (const [index, subtree] of tree.subtreeArray.entries())
        valueArray[index] = await evaluate(prog, env, subtree);
      return new ArrayNode(tree.elementType, valueArray);
    } else if (tree instanceof NegateNode) {
      const subtreeValue = await evaluate(prog, env, tree.subtree);
      if (subtreeValue instanceof NumLeaf)
        return new NumLeaf(- subtreeValue.value);
      else if (subtreeValue instanceof BoolLeaf)
        return new BoolLeaf(! subtreeValue.value);
      else if (subtreeValue instanceof StringLeaf)
        return new StringLeaf(subtreeValue.value.split('').reverse().join(''));
      else // subtreeValue instanceof ArrayNode<Value>
        return new ArrayNode(
          subtreeValue.elementType,
          subtreeValue.subtreeArray.reverse()
        );
    } else if (tree instanceof ToStringNode) {
      const subtreeValue = await evaluate(prog, env, tree.subtree);
      return new StringLeaf(exprToString(subtreeValue));
    } else if (tree instanceof PlusNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new NumLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
      else if (leftSubtreeValue instanceof StringLeaf && rightSubtreeValue instanceof StringLeaf)
        return new StringLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
      else if (leftSubtreeValue instanceof ArrayNode && rightSubtreeValue instanceof ArrayNode)
        return new ArrayNode(
          leftSubtreeValue.elementType,
          leftSubtreeValue.subtreeArray.concat(rightSubtreeValue.subtreeArray)
        );
      else
        throw new RuntimeError(
          "can't add values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof TimesNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new NumLeaf(leftSubtreeValue.value * rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't multiply values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof AndNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof BoolLeaf && rightSubtreeValue instanceof BoolLeaf)
        return new BoolLeaf(leftSubtreeValue.value && rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't AND values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof LessThanNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new BoolLeaf(leftSubtreeValue.value < rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't compare (<) values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof EqualNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new BoolLeaf(equalValues(leftSubtreeValue, rightSubtreeValue));
      else
        throw new RuntimeError(
          "can't compare (=) values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof IndexNode) {
      const leftSubtreeValue = await evaluate(prog, env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(prog, env, tree.rightSubtree);
      if (leftSubtreeValue instanceof ArrayNode && rightSubtreeValue instanceof NumLeaf) {
        const elementValue = leftSubtreeValue.subtreeArray[rightSubtreeValue.value];
        if (elementValue != null)
          return elementValue;
        else
          throw new RuntimeError(
            "index " + exprToString(rightSubtreeValue) +
            " is out of bounds in " + exprToString(leftSubtreeValue)
          );
      } else
        throw new RuntimeError(
          "can't index with values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof CallNode) {
      const returnValue = await call(prog, env, tree.funcName, tree.argArray);
      if (returnValue == null)
        throw new RuntimeError(
          "call to function " + tree.funcName +
          " failed to return a value"
        );
      return returnValue;
    } else { // if (tree instanceof ConditionalNode)
      const conditionSubtreeValue = await evaluate(prog, env, tree.conditionSubtree);
      const trueSubtreeValue = await evaluate(prog, env, tree.trueBranchSubtree);
      const falseSubtreeValue = await evaluate(prog, env, tree.falseBranchSubtree);
      if (conditionSubtreeValue instanceof BoolLeaf)
        return conditionSubtreeValue.value ? trueSubtreeValue : falseSubtreeValue;
      else
        throw new RuntimeError(
          "can't evaluate conditional with value " +
          exprToString(conditionSubtreeValue)
        );
    }
  }

  export async function call(
    prog: Program<Expr>,
    env: Env<Value>,
    funcName: string,
    argArray: Expr[]
  ): Promise<Value | null> {
    const func = prog.get(funcName);

    if (func == null)
      throw new RuntimeError("undefined function name " + funcName);

    if (func.parameterArray.length < argArray.length)
      throw new RuntimeError(
        "too many arguments passed to function " +
        funcName
      );

    const argEnv: Env<Value> = new Map;
    for (const [i, param] of func.parameterArray.entries()) {
      const argExpr = argArray[i];
      if (argExpr == null)
        throw new RuntimeError(
          "missing argument " + param.name +
          " to function " + funcName
        );
      const argValue = await evaluate(prog, env, argExpr);
      if (argValue != null)
        argEnv.set(param.name, argValue);
      else
        throw new RuntimeError(
          "missing argument " + param.name +
          " to function " + funcName
        );
    }

    try {
      await execute(prog, argEnv, func.body);
    } catch (v: unknown) {
      if (isValue(v))
        return v;
      else if (v != null)
        throw v;
    }

    return null;
  }

  export async function execute(
    prog: Program<Expr>,
    env: Env<Value>,
    tree: Stmt<Expr>
  ): Promise<void> {
    if (tree instanceof OutputNode) {
      const outputValue = await evaluate(prog, env, tree.subtree);
      await runtime.output(outputValue);
    } else if (tree instanceof VarDeclNode) {
      const initialValue = await evaluate(prog, env, tree.subtree);
      env.set(tree.varName, initialValue);
    } else if (tree instanceof AssignNode) {
      const newValue = await evaluate(prog, env, tree.subtree);
      env.set(tree.varName, newValue);
      if (env.has(tree.varName))
        env.set(tree.varName, newValue);
      else
        throw new RuntimeError(
          "assignment to undeclared variable " + tree.varName
        );
    } else if (tree instanceof BlockNode)
      for (const subStmt of tree.stmtArray)
        await execute(prog, env, subStmt);
    /////////////////////////////////////////////////////////////
    else if (tree instanceof IfNode) {
      const conditionalValue = await evaluate(prog, env, tree.conditional);
      if (conditionalValue instanceof BoolLeaf) {
        const outerScopeVarNames: Set<string> = new Set(env.keys());
        if (conditionalValue.value)
          await execute(prog, env, tree.trueBranch);
        else if (tree.falseBranch != null)
          await execute(prog, env, tree.falseBranch);
        deleteSubScope(env, outerScopeVarNames);
      } else
        throw new RuntimeError(
          "non-boolean value used as if conditional: " +
          exprToString(conditionalValue)
        );
    /////////////////////////////////////////////////////////////
    } else if (tree instanceof WhileNode) {
      let conditionalValue = await evaluate(prog, env, tree.conditional);
      if (!(conditionalValue instanceof BoolLeaf))
        throw new RuntimeError(
          "non-boolean value used as while conditional: " +
          exprToString(conditionalValue)
        );
      while (conditionalValue.value) {
        const outerScopeVarNames: Set<string> = new Set(env.keys());
        await execute(prog, env, tree.body);
        conditionalValue = await evaluate(prog, env, tree.conditional);
        if (!(conditionalValue instanceof BoolLeaf))
          throw new RuntimeError(
            "non-boolean value used as while conditional: " +
            exprToString(conditionalValue)
          );
        deleteSubScope(env, outerScopeVarNames);
      }
    /////////////////////////////////////////////////////////////
    } else if (tree instanceof ForEachNode) {
      if (env.has(tree.varName)) {
        throw new RuntimeError(
          tree.varName + " is already in the environment"
        )
      }
      let arrayExprValue = await evaluate(prog, env, tree.arrayExpr);
      if (!(arrayExprValue instanceof ArrayNode)) {
        throw new RuntimeError(
          "non-array value used as foreach array expression: " +
          exprToString(arrayExprValue)
        );
      }
      for (const newValue of arrayExprValue.subtreeArray) {
        const outerScopeVarNames: Set<string> = new Set(env.keys());
        env.set(tree.varName, newValue);
        await execute(prog, env, tree.body);
        arrayExprValue = await evaluate(prog, env, tree.arrayExpr);
        if (!(arrayExprValue instanceof ArrayNode)) {
          throw new RuntimeError(
            "non-array value used as foreach array expression: " +
            exprToString(arrayExprValue)
          );
        }
        deleteSubScope(env, outerScopeVarNames);
      }
    /////////////////////////////////////////////////////////////
    } else if (tree instanceof CallNode) {
      await call(prog, env, tree.funcName, tree.argArray);
    } else if (tree instanceof ReturnNode)
      throw tree.returnExpr == null ?
        null :
        await evaluate(prog, env, tree.returnExpr);
  }

  export async function run(prog: Program<Expr>) {
    const mainFunc = prog.get("main");
    if (mainFunc == null || mainFunc.parameterArray.length != 0)
      throw new RuntimeError("no function main()");
    await execute(prog, new Map, mainFunc.body);
  }
}