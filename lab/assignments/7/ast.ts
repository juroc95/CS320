namespace Lab7 {
  export type Env<T> = Map<string, T>;

  export function deleteSubScope<T>(
    env: Env<T>,
    outerScopeVarNames: Set<string>
  ) {
    for (const varName of env.keys())
      if (!outerScopeVarNames.has(varName))
        env.delete(varName);
  }

  export type Type = AtomicType | ArrayType;

  export enum AtomicType {
    number = "number",
    boolean = "boolean",
    string = "string"
  }

  export class ArrayType {
    constructor(readonly elementType: Type) {
      this.elementType = elementType;
    }
  }

  export function isAtomicType(type: Type): type is AtomicType {
    return !(type instanceof ArrayType);
  }

  export function typeToString(type: Type): string {
    if (type instanceof ArrayType)
      return "[]" + typeToString(type.elementType);
    else // if (isAtomic(type))
      return type;
  }

  export function equalTypes(type1: Type, type2: Type): boolean {
    if (isAtomicType(type1) && isAtomicType(type2))
      return type1 == type2;
    else if (type1 instanceof ArrayType && type2 instanceof ArrayType)
      return equalTypes(type1.elementType, type2.elementType);
    else
      return false;
  }

  export type Expr =
    VarLeaf | InputLeaf |
    NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Expr> |
    NegateNode<Expr> | ToStringNode<Expr> |
    PlusNode<Expr> | TimesNode<Expr> |
    AndNode<Expr> | IndexNode<Expr> |
    LessThanNode<Expr> | EqualNode<Expr> |
    ConditionalNode<Expr> | CallNode<Expr>;

  export type Value = NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Value>;

  export type Stmt<T> =
    OutputNode<T> |
    VarDeclNode<T> | AssignNode<T> |
    BlockNode<T> | IfNode<T> | WhileNode<T> |
    ForEachNode<T> |
    CallNode<T> |
    ReturnNode<T>;

  export class FuncParam {
    constructor(
      readonly name: string,
      readonly type: Type
    ) {
      this.name = name;
      this.type = type;
    }
  }

  export class FuncDecl<T> {
    constructor(
      readonly parameterArray: FuncParam[],
      readonly returnType: Type | null,
      readonly body: BlockNode<T>
    ) {
      this.parameterArray = parameterArray;
      this.returnType = returnType;
      this.body = body;
    }
  }

  export type Program<T> = Env<FuncDecl<T>>;

  export abstract class NameLeaf {
    constructor(readonly name: string) {
      this.name = name;
    }
  }

  export abstract class ValueLeaf<V> {
    constructor(readonly value: V) {
      this.value = value;
    }
  }

  export abstract class UnaryNode<T> {
    constructor(readonly subtree: T) {
      this.subtree = subtree;
    }
  }

  export abstract class BinaryNode<T> {
    constructor(
      readonly leftSubtree: T,
      readonly rightSubtree: T
    ) {
      this.leftSubtree = leftSubtree;
      this.rightSubtree = rightSubtree;
    }
  }

  export class VarLeaf extends NameLeaf { }

  export class InputLeaf {
    constructor(readonly inputType: Type) {
      this.inputType = inputType;
    }
  }

  export class NumLeaf extends ValueLeaf<number> { }
  export class BoolLeaf extends ValueLeaf<boolean> { }
  export class StringLeaf extends ValueLeaf<string> { }

  export class ArrayNode<T> {
    constructor(
      readonly elementType: Type,
      readonly subtreeArray: T[]
    ) {
      this.elementType = elementType;
      this.subtreeArray = subtreeArray;
    }
  }

  export function isValue(tree: unknown): tree is Value {
    if (tree instanceof ValueLeaf)
      return true;
    else if (tree instanceof ArrayNode) {
      for (const subtree of tree.subtreeArray)
        if (!isValue(subtree)) return false;
      return true;
    } else
      return false;
  }

  export class NegateNode<T> extends UnaryNode<T> { }
  export class ToStringNode<T> extends UnaryNode<T> { }

  export class PlusNode<T> extends BinaryNode<T> { }
  export class TimesNode<T> extends BinaryNode<T> { }
  export class AndNode<T> extends BinaryNode<T> { }
  export class LessThanNode<T> extends BinaryNode<T> { }
  export class EqualNode<T> extends BinaryNode<T> { }
  export class GreaterThanNode<T> extends BinaryNode<T> { }
  export class IndexNode<T> extends BinaryNode<T> { }

  export class CallNode<T> {
    constructor(
      readonly funcName: string,
      readonly argArray: T[]
    ) {
      this.funcName = funcName;
      this.argArray = argArray;
    }
  }

  export class ConditionalNode<T> {
    constructor(
      readonly conditionSubtree: T,
      readonly trueBranchSubtree: T,
      readonly falseBranchSubtree: T
    ) {
      this.conditionSubtree = conditionSubtree;
      this.trueBranchSubtree = trueBranchSubtree;
      this.falseBranchSubtree = falseBranchSubtree;
    }
  }

  export class OutputNode<T> extends UnaryNode<T> { }

  export class VarDeclNode<T> extends UnaryNode<T> {
    constructor(
      readonly varName: string,
      readonly varType: Type,
      subtree: T
    ) {
      super(subtree);
      this.varName = varName;
      this.varType = varType;
    }
  }

  export class AssignNode<T> extends UnaryNode<T> {
    constructor(
      readonly varName: string,
      subtree: T
    ) {
      super(subtree);
      this.varName = varName;
    }
  }

  export class BlockNode<T> {
    constructor(readonly stmtArray: Stmt<T>[]) {
      this.stmtArray = stmtArray;
    }
  }

  export class IfNode<T> {
    constructor(
      readonly conditional: T,
      readonly trueBranch: Stmt<T>,
      readonly falseBranch: Stmt<T> | null
    ) {
      this.trueBranch = trueBranch;
      this.falseBranch = falseBranch;
    }
  }

  export class WhileNode<T> {
    constructor(
      readonly conditional: T,
      readonly body: Stmt<T>
    ) {
      this.conditional = conditional;
      this.body = body;
    }
  }

  export class ForEachNode<T> {
    constructor (
      readonly varName: string,
      readonly arrayExpr: T,
      readonly body: Stmt<T>
    ) {
      this.varName = varName;
      this.arrayExpr = arrayExpr;
      this.body = body;
    }
  }

  export class ReturnNode<T> {
    constructor(readonly returnExpr: T | null) {
      this.returnExpr = returnExpr;
    }
  }

  export function exprToString(tree: Expr): string {
    if (tree instanceof StringLeaf)
      return "\"" + tree.value + "\"";
    else if (tree instanceof NameLeaf)
      return tree.name;
    else if (tree instanceof InputLeaf)
      return "input(" + typeToString(tree.inputType) + ")";
    else if (tree instanceof ArrayNode)
      return (
        typeToString(tree.elementType) + "[" +
        tree.subtreeArray.map(exprToString).join(", ") + "]"
      );
    else if (tree instanceof PlusNode)
      return "(" + exprToString(tree.leftSubtree) + " + " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof TimesNode)
      return "(" + exprToString(tree.leftSubtree) + " * " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof AndNode)
      return "(" + exprToString(tree.leftSubtree) + " & " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof LessThanNode)
      return "(" + exprToString(tree.leftSubtree) + " < " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof EqualNode)
      return "(" + exprToString(tree.leftSubtree) + " = " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof GreaterThanNode)
      return "(" + exprToString(tree.leftSubtree) + " > " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof IndexNode)
      return "(" + exprToString(tree.leftSubtree) + " # " + exprToString(tree.rightSubtree) + ")";
    else if (tree instanceof NegateNode)
      return "(- " + exprToString(tree.subtree) + ")";
    else if (tree instanceof ToStringNode)
      return "(@ " + exprToString(tree.subtree) + ")";
    else if (tree instanceof ConditionalNode)
      return "(" + exprToString(tree.conditionSubtree) + " ? " + exprToString(tree.trueBranchSubtree) + " : " + exprToString(tree.falseBranchSubtree) + ")";
    else if (tree instanceof CallNode) {
      let argString = "";
      for (const arg of tree.argArray)
        argString += exprToString(arg);
      return tree.funcName + "(" + argString + ")";
    } else // if (tree instanceof NumLeaf || tree instanceof BoolLeaf)
      return tree.value.toString();
  }

  const INDENT_LEVEL_SPACES = 2;
  function indent(level: number, str: string): string {
    let output = "";
    for (let i = 0; i < level; i++)
      for (let j = 0; j < INDENT_LEVEL_SPACES; j++)
        output += ' ';
    return output + str;
  }

  export function stmtToString(indentLevel: number, tree: Stmt<Expr>): string {
    if (tree instanceof OutputNode)
      return indent(
        indentLevel,
        "output(" + exprToString(tree.subtree) + ")"
      );
    else if (tree instanceof VarDeclNode)
      return indent(
        indentLevel,
        "var " + tree.varName + ": " +
          typeToString(tree.varType) + " <- " +
          exprToString(tree.subtree)
      );
    else if (tree instanceof AssignNode)
      return indent(
        indentLevel,
        tree.varName + " <- " + exprToString(tree.subtree)
      );
    else if (tree instanceof BlockNode) {
      let output: string = indent(indentLevel, "{\n");
      for (const stmt of tree.stmtArray)
        output += stmtToString(indentLevel + 1, stmt) + ";\n";
      return output + indent(indentLevel, "}");
    } else if (tree instanceof IfNode) {
      const trueOutput: string =
        indent(indentLevel, "if (") + exprToString(tree.conditional) + ")\n" +
        stmtToString(indentLevel + 1, tree.trueBranch);
      if (tree.falseBranch == null)
        return trueOutput;
      else
        return (
          trueOutput + "\n" +
          indent(indentLevel, "else\n") +
          stmtToString(indentLevel + 1, tree.falseBranch)
        );
    } else if (tree instanceof WhileNode)
      return (
        indent(
          indentLevel,
          "while (" + exprToString(tree.conditional) + ")\n"
        ) +
        stmtToString(indentLevel + 1, tree.body)
      );
    else if (tree instanceof ForEachNode)
      return (
        indent(
          indentLevel,
          "foreach (var " + tree.varName + " <-- " +
            exprToString(tree.arrayExpr) + ")\n"
        ) +
        stmtToString(indentLevel + 1, tree.body)
      );
    else if (tree instanceof CallNode) {
      let argString = "";
      for (const arg of tree.argArray)
        argString += exprToString(arg);
      return indent(indentLevel, tree.funcName + "(" + argString + ")");
    } else // tree instanceof ReturnNode
      return indent(
        indentLevel,
        tree.returnExpr == null ? "return" : ("return " + exprToString(tree.returnExpr))
      );
  }

  export function programToString(prog: Program<Expr>): string {
    let output: string = "";
    for (const [funcName, func] of prog.entries()) {
      output += funcName + "(";
      for (const param of func.parameterArray)
        output += param.name + ": " + typeToString(param.type) + ", ";
      if (func.parameterArray.length > 0)
        output = output.slice(0,-2);
      output += ")\n";
      output += stmtToString(0, func.body) + '\n\n';
    }
    return output;
  }
}