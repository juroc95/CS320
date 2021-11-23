namespace Lab4 {
  export type PreAST =
    ConstLeaf |
    NumLeaf | BoolLeaf | StringLeaf |
    NegateNode<PreAST> | ToStringNode<PreAST> |
    PlusNode<PreAST> | TimesNode<PreAST> | AndNode<PreAST> |
    LessThanNode<PreAST> |
    ConditionalNode<PreAST>;

  export type AST =
    NumLeaf | BoolLeaf | StringLeaf |
    NegateNode<AST> | ToStringNode<AST> |
    PlusNode<AST> | TimesNode<AST> | AndNode<AST> |
    LessThanNode<AST> |
    ConditionalNode<AST>;

  export class ConstLeaf {
    readonly name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

  export class Leaf<V> {
    readonly value: V;

    constructor(value: V) {
      this.value = value;
    }
  }

  export class UnaryNode<T> {
    readonly subtree: T;

    constructor(subtree: T) {
      this.subtree = subtree;
    }
  }

  export class BinaryNode<T> {
    readonly leftSubtree: T;
    readonly rightSubtree: T;

    constructor(leftSubtree: T, rightSubtree: T) {
      this.leftSubtree = leftSubtree;
      this.rightSubtree = rightSubtree;
    }
  }

  export class NumLeaf extends Leaf<number> { }
  export class BoolLeaf extends Leaf<boolean>{ }
  export class StringLeaf extends Leaf<string> { }

  export type Value = NumLeaf | BoolLeaf | StringLeaf;

  export class NegateNode<T> extends UnaryNode<T> { }
  export class ToStringNode<T> extends UnaryNode<T> { }

  export class PlusNode<T> extends BinaryNode<T> { }
  export class TimesNode<T> extends BinaryNode<T> { }
  export class AndNode<T> extends BinaryNode<T> { }
  export class LessThanNode<T> extends BinaryNode<T> { }

  export class ConditionalNode<T> {
    readonly conditionSubtree: T;
    readonly trueBranchSubtree: T;
    readonly falseBranchSubtree: T;

    constructor(conditionSubtree: T, trueBranchSubtree: T, falseBranchSubtree: T) {
      this.conditionSubtree = conditionSubtree;
      this.trueBranchSubtree = trueBranchSubtree;
      this.falseBranchSubtree = falseBranchSubtree;
    }
  }

  export function astToString(tree: PreAST): string {
    if (tree instanceof StringLeaf)
      return "\"" + tree.value + "\"";
    else if (tree instanceof ConstLeaf)
      return tree.name;
    else if (tree instanceof PlusNode)
      return "(" + astToString(tree.leftSubtree) + " + " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof TimesNode)
      return "(" + astToString(tree.leftSubtree) + " * " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof AndNode)
      return "(" + astToString(tree.leftSubtree) + " & " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof LessThanNode)
      return "(" + astToString(tree.leftSubtree) + " < " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof NegateNode)
      return "(- " + astToString(tree.subtree) + ")";
    else if (tree instanceof ToStringNode)
      return "(@ " + astToString(tree.subtree) + ")";
    else if (tree instanceof ConditionalNode)
      return "(" + astToString(tree.conditionSubtree) + " ? " + astToString(tree.trueBranchSubtree) + " : " + astToString(tree.falseBranchSubtree) + ")";
    else // if (tree instanceof NumLeaf || tree instanceof BoolLeaf)
      return tree.value.toString();
  }

  export interface Environment {
    lookup(name: string): Value | null;
  }

  export function expandNamedConstants(env: Environment, tree: PreAST): AST {
    if (tree instanceof ConstLeaf)
      return env.lookup(tree.name)!;
    else if (tree instanceof NegateNode)
      return new NegateNode(
        expandNamedConstants(env, tree.subtree)
      );
    else if (tree instanceof ToStringNode)
      return new ToStringNode(
        expandNamedConstants(env, tree.subtree)
      );
    else if (tree instanceof PlusNode)
      return new PlusNode(
        expandNamedConstants(env, tree.leftSubtree),
        expandNamedConstants(env, tree.rightSubtree)
      );
    else if (tree instanceof TimesNode)
      return new TimesNode(
        expandNamedConstants(env, tree.leftSubtree),
        expandNamedConstants(env, tree.rightSubtree)
      );
    else if (tree instanceof AndNode)
      return new AndNode(
        expandNamedConstants(env, tree.leftSubtree),
        expandNamedConstants(env, tree.rightSubtree)
      );
    else if (tree instanceof LessThanNode)
      return new LessThanNode(
        expandNamedConstants(env, tree.leftSubtree),
        expandNamedConstants(env, tree.rightSubtree)
      );
    else if (tree instanceof ConditionalNode)
      return new ConditionalNode(
        expandNamedConstants(env, tree.conditionSubtree),
        expandNamedConstants(env, tree.trueBranchSubtree),
        expandNamedConstants(env, tree.falseBranchSubtree)
      );
    else
      return tree;
  }

  export class InterpreterError extends Error { }

  export function interpret(tree: AST): Value {
    if (tree instanceof NegateNode) {
      const result: Value = interpret(tree.subtree);

      if (result instanceof NumLeaf)
        return new NumLeaf(-result.value);
      else if (result instanceof BoolLeaf)
        return new BoolLeaf(!result.value);
      else
        return new StringLeaf(result.value.split("").reverse().join("")); // reverse string
    } else if (tree instanceof ToStringNode) {
      const result: Value = interpret(tree.subtree);

      if (result instanceof NumLeaf || result instanceof BoolLeaf)
        return new StringLeaf(result.value.toString());
      else
        throw new InterpreterError(
          "invalid use of @ operator with operand " +
          astToString(result)
        );
    } else if (tree instanceof PlusNode) {
      const leftResult: Value = interpret(tree.leftSubtree);
      const rightResult: Value = interpret(tree.rightSubtree);

      if (leftResult instanceof StringLeaf && rightResult instanceof StringLeaf)
        return new StringLeaf(leftResult.value + rightResult.value);
      else if (leftResult instanceof NumLeaf && rightResult instanceof NumLeaf)
        return new NumLeaf(leftResult.value + rightResult.value);
      else
        throw new InterpreterError(
          "invalid use of + operator with left operand " +
          astToString(leftResult) +
          " and right operand " +
          astToString(rightResult)
        );
    } else if (tree instanceof TimesNode) {
      const leftResult: Value = interpret(tree.leftSubtree);
      const rightResult: Value = interpret(tree.rightSubtree);

      if (leftResult instanceof NumLeaf && rightResult instanceof NumLeaf)
        return new NumLeaf(leftResult.value * rightResult.value);
      else if (leftResult instanceof NumLeaf && rightResult instanceof StringLeaf) {
        if (leftResult.value >= 0 && Number.isInteger(leftResult.value) == true) {
          let x: string = "";
          let i: number;
          for (i = 0; i < leftResult.value; ++i) {
            x = x + rightResult.value;
          }
          return new StringLeaf(x);
        }
        else{
          throw new InterpreterError(
            "invalid use of * operator with left operand " +
            astToString(leftResult) +
            " and right operand " +
            astToString(rightResult)
          );
        }
      } else
        throw new InterpreterError(
          "invalid use of * operator with left operand " +
          astToString(leftResult) +
          " and right operand " +
          astToString(rightResult)
        );
    } else if (tree instanceof AndNode) {
      const leftResult: Value = interpret(tree.leftSubtree);
      const rightResult: Value = interpret(tree.rightSubtree);

      if (leftResult instanceof BoolLeaf && rightResult instanceof BoolLeaf)
        return new BoolLeaf(leftResult.value && rightResult.value);
      else
        throw new InterpreterError(
          "invalid use of & operator with left operand " +
          astToString(leftResult) +
          " and right operand " +
          astToString(rightResult)
        );
    } else if (tree instanceof LessThanNode) {
      const leftResult: Value = interpret(tree.leftSubtree);
      const rightResult: Value = interpret(tree.rightSubtree);

      if (leftResult instanceof NumLeaf && rightResult instanceof NumLeaf) {
        if (leftResult.value < rightResult.value) {
          return new BoolLeaf(true);
        }
        else {
          return new BoolLeaf(false);
        }
      } 
      else if (leftResult instanceof BoolLeaf && rightResult instanceof BoolLeaf) {
        if (leftResult.value == false && rightResult.value == true) {
          return new BoolLeaf(true);
        }
        else {
          return new BoolLeaf(false);
        }
      }
      else if (leftResult instanceof StringLeaf && rightResult instanceof StringLeaf) {
        if (leftResult.value.length < rightResult.value.length) {
          return new BoolLeaf(true);
        }
        else {
          return new BoolLeaf(false);
        }
      }
      else {
        throw new InterpreterError(
          "invalid use of < operator with left operand " +
          astToString(leftResult) +
          " and right operand " +
          astToString(rightResult)
        );
      }
    } else if (tree instanceof ConditionalNode) {
      const conditionResult: Value = interpret(tree.conditionSubtree);

      if (conditionResult instanceof BoolLeaf) {
        if (conditionResult.value)
          return interpret(tree.trueBranchSubtree);
        else
          return interpret(tree.falseBranchSubtree);
      } else
        throw new InterpreterError(
          "invalid use of ?: operator with first operand " +
          astToString(conditionResult)
        );
    } else // tree instanceof Value
      return tree;
  }

  export function removeDoubleNegations(tree: AST): AST {
    if (tree instanceof NumLeaf) {
      return new NumLeaf(tree.value);
    }
    else if (tree instanceof BoolLeaf) {
      return new BoolLeaf(tree.value);
    }
    else if (tree instanceof StringLeaf) {
      return new StringLeaf(tree.value);
    }
    else if (tree instanceof NegateNode) {
      if (tree.subtree instanceof NegateNode) {
        return removeDoubleNegations(tree.subtree.subtree);
      }
      else {
        return new NegateNode(removeDoubleNegations(tree.subtree));
      }
    }
    else if (tree instanceof ToStringNode) {
      return new ToStringNode(removeDoubleNegations(tree.subtree));
    }
    else if (tree instanceof PlusNode) {
      return new PlusNode(removeDoubleNegations(tree.leftSubtree), removeDoubleNegations(tree.rightSubtree));
    }
    else if (tree instanceof TimesNode) {
      return new TimesNode(removeDoubleNegations(tree.leftSubtree), removeDoubleNegations(tree.rightSubtree));
    }
    else if (tree instanceof AndNode) {
      return new AndNode(removeDoubleNegations(tree.leftSubtree), removeDoubleNegations(tree.rightSubtree));
    }
    else if (tree instanceof LessThanNode) {
      return new LessThanNode(removeDoubleNegations(tree.leftSubtree), removeDoubleNegations(tree.rightSubtree));
    }
    else {
      return new ConditionalNode(removeDoubleNegations(tree.conditionSubtree), removeDoubleNegations(tree.trueBranchSubtree), removeDoubleNegations(tree.falseBranchSubtree));
    }
  }
}
