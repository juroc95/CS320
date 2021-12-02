namespace Lab6 {
  export type Env<T> = Map<string, T>;

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
    ConditionalNode<Expr>;

  export type Stmt<T> =
    OutputNode<T> |
    VarDeclNode<T> | AssignNode<T>;

  export type Program<T> = Stmt<T>[]

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
    constructor(readonly leftSubtree: T, readonly rightSubtree: T) {
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
    constructor(readonly elementType: Type, readonly subtreeArray: T[]) {
      this.elementType = elementType;
      this.subtreeArray = subtreeArray;
    }
  }

  export type Value = NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Value>;

  export function isValue(tree: unknown): tree is Value {
    if (tree instanceof ValueLeaf)
      return true;
    else if (tree instanceof ArrayNode) {
      let allElementsAreValues = true;
      for (const subtree of tree.subtreeArray)
        if (!isValue(subtree)) {
          allElementsAreValues = false;
          break;
        }
      return allElementsAreValues;
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

  export class ConditionalNode<T> {
    constructor(readonly conditionSubtree: T, readonly trueBranchSubtree: T, readonly falseBranchSubtree: T) {
      this.conditionSubtree = conditionSubtree;
      this.trueBranchSubtree = trueBranchSubtree;
      this.falseBranchSubtree = falseBranchSubtree;
    }
  }

  export class OutputNode<T> extends UnaryNode<T> { }

  export class VarDeclNode<T> extends UnaryNode<T> {
    constructor(readonly varName: string, readonly varType: Type, subtree: T) {
      super(subtree);
      this.varName = varName;
      this.varType = varType;
    }
  }

  export class AssignNode<T> extends UnaryNode<T> {
    constructor(readonly varName: string, subtree: T) {
      super(subtree);
      this.varName = varName;
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
    else // if (tree instanceof NumLeaf || tree instanceof BoolLeaf)
      return tree.value.toString();
  }

  export function stmtToString(tree: Stmt<Expr>): string {
    if (tree instanceof OutputNode)
      return "output(" + exprToString(tree.subtree) + ")";
    else if (tree instanceof VarDeclNode)
      return "var " + tree.varName + ": " + typeToString(tree.varType) + " <- " + exprToString(tree.subtree);
    else // tree instanceof AssignNode
      return tree.varName + " <- " + exprToString(tree.subtree);
  }

  export function programToString(prog: Program<Expr>): string {
    let output: string = "";
    for (const stmt of prog)
      output += stmtToString(stmt) + ";\n";
    return output;
  }
}
