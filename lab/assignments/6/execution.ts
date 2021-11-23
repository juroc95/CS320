namespace Lab6 {
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
        if (!equalValues(val, val2.subtreeArray[index]!))
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

  export async function evaluate(env: Env<Value>, tree: Expr): Promise<Value> {
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
        valueArray[index] = await evaluate(env, subtree);
      return new ArrayNode(tree.elementType, valueArray);
    } else if (tree instanceof NegateNode) {
      const subtreeValue = await evaluate(env, tree.subtree);
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
      const subtreeValue = await evaluate(env, tree.subtree);
      return new StringLeaf(exprToString(subtreeValue));
    } else if (tree instanceof PlusNode) {
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
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
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new NumLeaf(leftSubtreeValue.value * rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't multiply values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof AndNode) {
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
      if (leftSubtreeValue instanceof BoolLeaf && rightSubtreeValue instanceof BoolLeaf)
        return new BoolLeaf(leftSubtreeValue.value && rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't AND values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof LessThanNode) {
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
      if (leftSubtreeValue instanceof NumLeaf && rightSubtreeValue instanceof NumLeaf)
        return new BoolLeaf(leftSubtreeValue.value < rightSubtreeValue.value);
      else
        throw new RuntimeError(
          "can't compare (<) values " +
          exprToString(leftSubtreeValue) + " and " +
          exprToString(rightSubtreeValue)
        );
    } else if (tree instanceof EqualNode) {
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
      return new BoolLeaf(equalValues(leftSubtreeValue, rightSubtreeValue));
    } else if (tree instanceof IndexNode) {
      const leftSubtreeValue = await evaluate(env, tree.leftSubtree);
      const rightSubtreeValue = await evaluate(env, tree.rightSubtree);
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
    } else { // if (tree instanceof ConditionalNode)
      const conditionSubtreeValue = await evaluate(env, tree.conditionSubtree);
      const trueSubtreeValue = await evaluate(env, tree.trueBranchSubtree);
      const falseSubtreeValue = await evaluate(env, tree.falseBranchSubtree);
      if (conditionSubtreeValue instanceof BoolLeaf)
        return conditionSubtreeValue.value ? trueSubtreeValue : falseSubtreeValue;
      else
        throw new RuntimeError(
          "can't evaluate conditional with value " +
          exprToString(conditionSubtreeValue)
        );
    }
  }

  export async function execute(env: Env<Value>, stmt: Stmt<Expr>) {
    const subtreeValue = await evaluate(env, stmt.subtree);
    if (stmt instanceof OutputNode)
      runtime.output(subtreeValue);
    else if (stmt instanceof VarDeclNode)
      env.set(stmt.varName, subtreeValue);
    else { // stmt instanceof AssignNode
      if (env.has(stmt.varName))
        env.set(stmt.varName, subtreeValue);
      else
        throw new RuntimeError(
          "assignment to undeclared variable " + stmt.varName
        );
    }
  }

  export async function run(prog: Program<Expr>) {
    const env: Env<Value> = new Map;
    for (const stmt of prog)
      await execute(env, stmt);
  }
}