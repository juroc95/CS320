namespace Lab6 {
  export class TypeError extends Error { }

  export function inferExprType(env: Env<Type>, tree: Expr): Type {
    if (tree instanceof VarLeaf) {
      const variableType = env.get(tree.name);
      if (variableType != null)
        return variableType;
      else
        throw new TypeError(
          "undefined variable " + tree.name
        );
    }
    else if (tree instanceof InputLeaf)
      return tree.inputType;
    else if (tree instanceof NumLeaf)
      return AtomicType.number;
    else if (tree instanceof BoolLeaf)
      return AtomicType.boolean;
    else if (tree instanceof StringLeaf)
      return AtomicType.string;
    else if (tree instanceof NegateNode) {
      return inferExprType(env, tree.subtree);
    } else if (tree instanceof ToStringNode) {
      inferExprType(env, tree.subtree);
      return AtomicType.string;
    } else if (tree instanceof PlusNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        equalTypes(leftSubtreeType, AtomicType.number) &&
        equalTypes(rightSubtreeType, AtomicType.number)
      )
        return AtomicType.number;
      else if (
        equalTypes(leftSubtreeType, AtomicType.string) &&
        equalTypes(rightSubtreeType, AtomicType.string)
      )
        return AtomicType.string;
      else if (
        leftSubtreeType instanceof ArrayType &&
        rightSubtreeType instanceof ArrayType &&
        equalTypes(leftSubtreeType.elementType, rightSubtreeType.elementType)
      )
        return leftSubtreeType;
      else
        throw new TypeError(
          "can't add expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    } else if (tree instanceof TimesNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        equalTypes(leftSubtreeType, AtomicType.number) &&
        equalTypes(rightSubtreeType, AtomicType.number)
      )
        return AtomicType.number;
      else
        throw new TypeError(
          "can't multiply expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    /////////////////////////////////////////////////////////////////
    } else if (tree instanceof AndNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        equalTypes(leftSubtreeType, AtomicType.boolean) &&
        equalTypes(rightSubtreeType, AtomicType.boolean)
      )
        return AtomicType.boolean;
      else
        throw new TypeError(
          "can't and expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    /////////////////////////////////////////////////////////////////
    } else if (tree instanceof LessThanNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        equalTypes(leftSubtreeType, AtomicType.number) &&
        equalTypes(rightSubtreeType, AtomicType.number)
      )
        return AtomicType.boolean;
      else
        throw new TypeError(
          "can't less than expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    /////////////////////////////////////////////////////////////////
    } else if (tree instanceof EqualNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        equalTypes(leftSubtreeType, rightSubtreeType)
      )
        return AtomicType.boolean;
      else
        throw new TypeError(
          "can't equal expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    /////////////////////////////////////////////////////////////////
    } else if (tree instanceof IndexNode) {
      const leftSubtreeType = inferExprType(env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(env, tree.rightSubtree);
      if (
        leftSubtreeType instanceof ArrayType &&
        equalTypes(rightSubtreeType, AtomicType.number)
      )
        return leftSubtreeType.elementType;
      else
        throw new TypeError(
          "can't index expressions with types " +
          typeToString(leftSubtreeType) + " and " +
          typeToString(rightSubtreeType)
        );
    /////////////////////////////////////////////////////////////////
    } else if (tree instanceof ArrayNode) {
      for (const subtree of tree.subtreeArray) {
        const subtreeType = inferExprType(env, subtree);
        if (!equalTypes(subtreeType, tree.elementType))
          throw new TypeError(
            "can't use element of type " +
            typeToString(subtreeType) + " in array of type " +
            typeToString(new ArrayType(tree.elementType))
          );
      }
      return new ArrayType(tree.elementType);
    } else { // if (tree instanceof ConditionalNode)
      const conditionSubtreeType = inferExprType(env, tree.conditionSubtree);
      const trueSubtreeType = inferExprType(env, tree.trueBranchSubtree);
      const falseSubtreeType = inferExprType(env, tree.falseBranchSubtree);
      if (
        equalTypes(conditionSubtreeType, AtomicType.boolean) &&
        equalTypes(trueSubtreeType, falseSubtreeType)
      )
        return trueSubtreeType;
      else
        throw new TypeError(
          "can't do conditional expression with types " +
          typeToString(conditionSubtreeType) + ", " +
          typeToString(trueSubtreeType) + ", and " +
          typeToString(falseSubtreeType)
        );
    }
  }

  export function typecheckStmt(env: Env<Type>, stmt: Stmt<Expr>): void {
    if (stmt instanceof OutputNode)
      inferExprType(env, stmt.subtree);
    else if (stmt instanceof VarDeclNode) {
      const subtreeType = inferExprType(env, stmt.subtree);
      if (!equalTypes(stmt.varType, subtreeType))
        throw new TypeError(
          "bad variable declaration: variable " + stmt.varName +
          " with type " + typeToString(stmt.varType) +
          " doesn't match expression type " + typeToString(subtreeType)
        );
      env.set(stmt.varName, stmt.varType);
    } else { // if stmt instanceof AssignNode
      const expectedType = env.get(stmt.varName);
      if (expectedType == null)
        throw new TypeError(
          "undefined variable " + stmt.varName
        );
      const subtreeType = inferExprType(env, stmt.subtree);
      if (!equalTypes(subtreeType, expectedType))
        throw new TypeError(
          "bad assignment: defined variable " + stmt.varName +
          " with type " + typeToString(subtreeType) +
          " doesn't match expression type "
        );
    }
  }

  export function typecheckProg(prog: Program<Expr>): void {
    const env: Env<Type> = new Map;
    for (const stmt of prog)
      typecheckStmt(env, stmt);
  }
}