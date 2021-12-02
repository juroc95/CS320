namespace Lab7 {
  export class TypeError extends Error { }

  export function inferExprType(
    prog: Program<Expr>,
    env: Env<Type>,
    tree: Expr
  ): Type {
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
      return inferExprType(prog, env, tree.subtree);
    } else if (tree instanceof ToStringNode) {
      inferExprType(prog, env, tree.subtree);
      return AtomicType.string;
    } else if (tree instanceof PlusNode) {
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
    } else if (tree instanceof AndNode) {
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
    } else if (tree instanceof LessThanNode) {
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
    } else if (tree instanceof EqualNode) {
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
    } else if (tree instanceof IndexNode) {
      const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
      const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
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
    } else if (tree instanceof ArrayNode) {
      for (const subtree of tree.subtreeArray) {
        const subtreeType = inferExprType(prog, env, subtree);
        if (!equalTypes(subtreeType, tree.elementType))
          throw new TypeError(
            "can't use element of type " +
            typeToString(subtreeType) + " in array of type " +
            typeToString(new ArrayType(tree.elementType))
          );
      }
      return new ArrayType(tree.elementType);
    } else if (tree instanceof CallNode) {
      const retType = inferCallReturnType(prog, env, tree.funcName, tree.argArray);
      if (retType == null)
        throw new TypeError(
          "call to void function " + tree.funcName +
          " used as an expression"
        );
      return retType;
    } else { // if (tree instanceof ConditionalNode)
      const conditionSubtreeType = inferExprType(prog, env, tree.conditionSubtree);
      const trueSubtreeType = inferExprType(prog, env, tree.trueBranchSubtree);
      const falseSubtreeType = inferExprType(prog, env, tree.falseBranchSubtree);
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

  export function typecheckStmt(
    prog: Program<Expr>,
    env: Env<Type>,
    tree: Stmt<Expr>,
    expectedReturnType: Type | null
  ): void {
    if (tree instanceof OutputNode)
      inferExprType(prog, env, tree.subtree);
    else if (tree instanceof VarDeclNode) {
      const subtreeType = inferExprType(prog, env, tree.subtree);
      if (!equalTypes(tree.varType, subtreeType))
        throw new TypeError(
          "bad variable declaration: variable " + tree.varName +
          " with type " + typeToString(tree.varType) +
          " doesn't match expression type " + typeToString(subtreeType)
        );
      if (env.has(tree.varName))
        throw new TypeError(
          "bad variable declaration: variable name " + tree.varName +
          " is already used in the same scope"
        );
      env.set(tree.varName, tree.varType);
    } else if (tree instanceof AssignNode) {
      const expectedType = env.get(tree.varName);
      if (expectedType == null)
        throw new TypeError(
          "undefined variable " + tree.varName
        );
      const subtreeType = inferExprType(prog, env, tree.subtree);
      if (!equalTypes(subtreeType, expectedType))
        throw new TypeError(
          "bad assignment: defined variable " + tree.varName +
          " with type " + typeToString(subtreeType) +
          " doesn't match expression type "
        );
    } else if (tree instanceof BlockNode)
      for (const subtree of tree.stmtArray)
        typecheckStmt(prog, env, subtree, expectedReturnType);
    //////////////////////////////////////////////////////////////////////
    else if (tree instanceof IfNode) {
      const conditionalType = inferExprType(prog, env, tree.conditional);
      if (!equalTypes(conditionalType, AtomicType.boolean))
        throw new TypeError(
          "bad if statement: non-boolean conditional type " +
          typeToString(conditionalType)
        );
      const outerScopeVarNames: Set<string> = new Set(env.keys());
      typecheckStmt(prog, env, tree.trueBranch, expectedReturnType);
      deleteSubScope(env, outerScopeVarNames);
      if (tree.falseBranch != null) {
        typecheckStmt(prog, env, tree.falseBranch, expectedReturnType);
        deleteSubScope(env, outerScopeVarNames);
      }
    //////////////////////////////////////////////////////////////////////
    } else if (tree instanceof WhileNode) {
      const conditionalType = inferExprType(prog, env, tree.conditional);
      if (!equalTypes(conditionalType, AtomicType.boolean))
        throw new TypeError(
          "bad if statement: non-boolean conditional type " +
          typeToString(conditionalType)
        );
      const outerScopeVarNames: Set<string> = new Set(env.keys());
      typecheckStmt(prog, env, tree.body, expectedReturnType);
      deleteSubScope(env, outerScopeVarNames);
    //////////////////////////////////////////////////////////////////////
    } else if (tree instanceof ForEachNode) {
      const varNameType = env.get(tree.varName);
      if (varNameType != null)
        throw new TypeError(
          tree.varName + " is already defined"
        );
      const arrayExprType = inferExprType(prog, env, tree.arrayExpr);
      if (arrayExprType instanceof ArrayType == false) {
        throw new TypeError(
          typeToString(arrayExprType) + " is not an array type"
        );
      }
      const outerScopeVarNames: Set<string> = new Set(env.keys());
      if (arrayExprType instanceof ArrayType) {
        env.set(tree.varName, arrayExprType.elementType);
      }
      typecheckStmt(prog, env, tree.body, expectedReturnType);
      deleteSubScope(env, outerScopeVarNames);
    //////////////////////////////////////////////////////////////////////
    } else if (tree instanceof CallNode)
      inferCallReturnType(prog, env, tree.funcName, tree.argArray);
    else if (tree instanceof ReturnNode) {
      if (tree.returnExpr == null) {
        if (expectedReturnType != null)
          throw new TypeError(
            "bad return: missing a return expression for a non-void function"
          );
      } else if (expectedReturnType == null)
        throw new TypeError(
          "bad return: included a return expression for a void function"
        );
      else {
        const returnType = inferExprType(prog, env, tree.returnExpr);
        if (!equalTypes(returnType, expectedReturnType))
          throw new TypeError(
            "bad return: expected type " + typeToString(expectedReturnType) +
            " but return expression has type " + typeToString(returnType)
          );
      }
    }
  }

  export function inferCallReturnType(
    prog: Program<Expr>,
    env: Env<Type>,
    funcName: string,
    argArray: Expr[]
  ): Type | null {
    const func = prog.get(funcName);

    if (func == null)
      throw new TypeError(
        "call to undefined function " +
        funcName
      );

    if (func.parameterArray.length < argArray.length)
      throw new TypeError(
        "too many arguments passed to function " +
        funcName
      );

    for (const [i, param] of func.parameterArray.entries()) {
      const arg = argArray[i];
      if (arg == null)
        throw new TypeError(
          "missing argument " + param.name +
          " to function " + funcName
        );
      const argType = inferExprType(prog, env, arg);
      if (!equalTypes(param.type, argType))
        throw new TypeError(
          "wrong argument type " + typeToString(argType) +
          " for parameter " + param.name +
          ": " + typeToString(param.type)
        );
    }

    return func.returnType;
  }

  export function typecheckProg(prog: Program<Expr>): void {
    for (const [funcName, func] of prog.entries()) {
      const env: Env<Type> = new Map;
      for (const param of func.parameterArray)
        if (!env.has(param.name))
          env.set(param.name, param.type);
        else
          throw new TypeError(
            "bad definition for function " + funcName +
            ": repeated parameter name " + param.name
          );

      typecheckStmt(prog, env, func.body, func.returnType);
    }
  }
}