/*
This is a hand-written optimized parser for our new expanded language.
It should theoretically run in O(n) time, although I haven't profiled it.
The code is pretty sloppy, and you're not expected to read it!
Feel free to ask if you're interested in how it works, though.

Here's a sketch of the algorithm:

  1. Tokenize with regexes, as in lab 5.

  2. Handle precedence and associativity with the shunting-yard algorithm.
     (See https://en.wikipedia.org/wiki/Shunting-yard_algorithm.)
     The symbols ',', '?', and ':' are treated as right-associative binary
     operators in this step.

  3. Parse with recursive descent.
     The shunting-yard algorithm ensures that the parsing code never needs
     to backtrack. When parsing array notation (type[elem1, elem2, ...]),
     the part inside the brackets is parsed as a chain of comma operators,
     then "unassociated" to a TypeScript array.

  4. Traverse the AST to fix up conditional nodes.
     Step 3 outputs an AST where conditional nodes are represented
     with two different binary operators, '?' and ':'. This step
     "unassociates" pairs of these operators into ternary conditional nodes.

  5. Replace named constants with given values, as in lab 4.

*/
namespace Lab6 {
  export enum TokenSort {
    number,
    string,
    boolean,
    function,
    keyword,
    name,
    paren,
    bracket,
    unaryOp,
    binaryOp
  }

  type TokenPattern = {
    readonly sort: TokenSort,
    readonly regexp: RegExp
  };

  const tokenPatterns: TokenPattern[] = [
    { sort: TokenSort.number, regexp: /^\d+(?:\.\d+)?/ },
    { sort: TokenSort.string, regexp: /^"[^"]*?"/ },
    { sort: TokenSort.boolean, regexp: /^(?:true|false)/ },
    { sort: TokenSort.function, regexp: /^(?:input|output)/ },
    { sort: TokenSort.keyword, regexp: /^var/ },
    { sort: TokenSort.name, regexp: /^[A-Za-z_]\w*/ },
    { sort: TokenSort.paren, regexp: /^[()]/ },
    { sort: TokenSort.bracket, regexp: /^[[\]]/ },
    { sort: TokenSort.unaryOp, regexp: /^[@-]/ },
    { sort: TokenSort.binaryOp, regexp: /^[<=>&*?:+#,]/ },
  ];

  export class Token {
    constructor(readonly sort: TokenSort, readonly text: string) {
      this.sort = sort;
      this.text = text;
    }

    readonly toString = () => `${TokenSort[this.sort]}('${this.text}')`;
  }

  export class TokenizingError extends Error { }

  export function tokenize(source: string): Token[] {
    const trimmed = source.trimStart();
    if (trimmed == "") return [];
    for (const { sort, regexp } of tokenPatterns) {
      const match = trimmed.match(regexp);
      if (match == null) continue;
      const tokenText = match[0]!;
      const token = new Token(sort, tokenText.trimEnd());
      const restOfInput = trimmed.slice(tokenText.length);
      const restOfTokens = tokenize(restOfInput);
      return [token].concat(restOfTokens);
    }
    throw new TokenizingError("leftover input: " + source);
  }

  enum Assoc { left, right }

  type Fixity = { assoc: Assoc, prec: number }

  const fixity = (token: Token): Fixity => {
    switch(token.text) {
      case ',': return { assoc: Assoc.right, prec: 0 };
      case '=': return { assoc: Assoc.right, prec: 1 };
      case '?':
      case ':': return { assoc: Assoc.right, prec: 2 };
      case '&': return { assoc: Assoc.right, prec: 3 };
      case '<':
      case '>': return { assoc: Assoc.right, prec: 4 };
      case '+': return { assoc: Assoc.right, prec: 5 };
      case '*': return { assoc: Assoc.right, prec: 6 };
      case '#': return { assoc: Assoc.left,  prec: 7 };
      default: throw new Error("parser bug");
    }
  };

  export class ParseError extends Error { }

  /*
  This is the variant of the shunting-yard algorithm that outputs prefix
  notation, extended to also handle our language's syntax for arrays.
  */
  const shunt = (tokens: readonly Token[]): Token[] => {
    const input: Token[] = Array.from(tokens);
    const ops: Token[] = [];
    const out: Token[] = [];

    while (input.length > 0) {
      const head = input.pop()!;
      switch (head.sort) {

        case TokenSort.paren: {
          switch (head.text) {
            case ')': ops.unshift(head); break;
            case '(': {
              while (ops.length > 0 && ops[0]!.text != ')')
                out.unshift(ops.shift()!);
              if (ops.shift()?.text != ')')
                throw new ParseError("mismatched parentheses");
              break;
            }
          }
          break;
        }

        case TokenSort.bracket: {
          switch (head.text) {
            case ']': out.unshift(head); ops.unshift(head); break;
            case '[': {
              while (ops.length > 0 && ops[0]!.text != ']')
                out.unshift(ops.shift()!);
              if (ops.shift()?.text != ']')
                throw new ParseError("mismatched brackets");
              out.unshift(head);
            }
          }
          break;
        }

        case TokenSort.binaryOp: {
          const shouldPopOperator = (op: Token): boolean => {
            if (op.text == '(') return true;
            else if (op.sort == TokenSort.binaryOp) {
              const f1 = fixity(head);
              const f2 = fixity(op);
              return (
                f2.prec > f1.prec ||
                (f2.prec == f1.prec && f2.assoc == Assoc.right)
              );
            }
            else return false;
          };

          while (ops.length > 0 && shouldPopOperator(ops[0]!))
            out.unshift(ops.shift()!);
          ops.unshift(head);
          break;
        }

        default: out.unshift(head); break;
      }
    }

    while (ops.length > 0) {
      if (ops[0]!.sort == TokenSort.paren)
        throw new ParseError("mismatched parentheses");
      out.unshift(ops.shift()!);
    }

    return out;
  };

  export class ConstLeaf extends NameLeaf { }
  export class CommaNode<T> extends BinaryNode<T> { }
  export class ConditionalNode1<T> extends BinaryNode<T> { }
  export class ConditionalNode2<T> extends BinaryNode<T> { }

  export type PreExpr1 =
    ConstLeaf | VarLeaf | InputLeaf |
    NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr1> |
    NegateNode<PreExpr1> | ToStringNode<PreExpr1> |
    PlusNode<PreExpr1> | TimesNode<PreExpr1> |
    AndNode<PreExpr1> | IndexNode<PreExpr1> |
    LessThanNode<PreExpr1> | EqualNode<PreExpr1> | GreaterThanNode<PreExpr1> |
    CommaNode<PreExpr1> | ConditionalNode1<PreExpr1> | ConditionalNode2<PreExpr1>;

  const unaryOp = (op: string, exp: PreExpr1): PreExpr1 => {
    switch (op) {
      case '@': return new ToStringNode(exp);
      case '-': return new NegateNode(exp);
      default: throw new Error("parser bug");
    }
  };

  const binaryOp = (op: string, exp1: PreExpr1, exp2: PreExpr1): PreExpr1 => {
    switch (op) {
      case '<': return new LessThanNode(exp1, exp2);
      case '=': return new EqualNode(exp1, exp2);
      case '>': return new GreaterThanNode(exp1, exp2);
      case '&': return new AndNode(exp1, exp2);
      case '*': return new TimesNode(exp1, exp2);
      case '?': return new ConditionalNode1(exp1, exp2);
      case ':': return new ConditionalNode2(exp1, exp2);
      case '+': return new PlusNode(exp1, exp2);
      case '#': return new IndexNode(exp1, exp2);
      case ',': return new CommaNode(exp1, exp2);
      default: throw new ParseError("parser bug");
    }
  };

  const parseType = (tokens: readonly Token[]): [Type, number] => {
    let index = 0;
    let dimensions = 0;
    for (; tokens[index]?.text == '[' && tokens[index+1]?.text == ']'; index += 2)
      dimensions++;
    const head = tokens[index++];
    if (head?.sort != TokenSort.name || !(head.text in AtomicType))
      throw new ParseError("invalid type");
    let type: Type = AtomicType[head.text as keyof typeof AtomicType];
    for (let i = 0; i < dimensions; i++)
      type = new ArrayType(type);
    return [type, index];
  };

  const parseExpr = (tokens: readonly Token[]): [PreExpr1, number] => {
    let index = 0;
    const parse = (): PreExpr1 => {
      const head = tokens[index++];
      if (!head) throw new ParseError("unexpected end of input");
      switch (head.sort) {
        case TokenSort.number:
          return new NumLeaf(parseFloat(head.text));
        case TokenSort.boolean:
          return new BoolLeaf(head.text == "true");
        case TokenSort.string:
          return new StringLeaf(head.text.slice(1,-1));
        case TokenSort.bracket:
        case TokenSort.name: {
          if (head.text == ']')
            throw new ParseError("unmatched close bracket");
          if (head.text in AtomicType || head.text == '[') {
            const [type, newIndex] = parseType(tokens.slice(--index));
            index += newIndex;
            if (tokens[index++]?.text != '[')
              throw new ParseError("invalid array expression");
            if (tokens[index]?.text == ']') {
              index++;
              return new ArrayNode(type, []);
            }
            const elements = parse();
            if (tokens[index++]?.text != ']')
              throw new ParseError("invalid array expression");
            return new ArrayNode(type, unassociateElements(elements));
          }
          return new (/[A-Z]/.test(head.text[0]!) ? ConstLeaf : VarLeaf)(head.text);
        }
        case TokenSort.function: {
          switch (head.text) {
            case "input": {
              const [type, newIndex] = parseType(tokens.slice(index));
              index += newIndex;
              return new InputLeaf(type);
            }
            default: throw new ParseError("parser bug");
          }
        }
        case TokenSort.unaryOp:
          return unaryOp(head.text, parse());
        case TokenSort.binaryOp:
          return binaryOp(head.text, parse(), parse());
        default:
          throw new ParseError("parser bug");
      }
    };
    return [parse(), index];
  };

  const unassociateElements = (exp: PreExpr1): PreExpr1[] => {
    if (exp instanceof CommaNode)
      return [exp.leftSubtree].concat(unassociateElements(exp.rightSubtree));
    else
      return [exp];
  };

  export type PreExpr2 =
    ConstLeaf | VarLeaf | InputLeaf |
    NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr2> |
    NegateNode<PreExpr2> | ToStringNode<PreExpr2> |
    PlusNode<PreExpr2> | TimesNode<PreExpr2> |
    AndNode<PreExpr2> | IndexNode<PreExpr2> |
    LessThanNode<PreExpr2> | EqualNode<PreExpr2> | GreaterThanNode<PreExpr2> |
    ConditionalNode<PreExpr2>;

  const unassociateTernary = (exp: PreExpr1): PreExpr2 => {
    if (exp instanceof NegateNode)
      return new NegateNode(
        unassociateTernary(exp.subtree)
      );
    else if (exp instanceof ToStringNode)
      return new ToStringNode(
        unassociateTernary(exp.subtree)
      );
    else if (exp instanceof PlusNode)
      return new PlusNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof TimesNode)
      return new TimesNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof AndNode)
      return new AndNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof IndexNode)
      return new IndexNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof LessThanNode)
      return new LessThanNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof EqualNode)
      return new EqualNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof GreaterThanNode)
      return new GreaterThanNode(
        unassociateTernary(exp.leftSubtree),
        unassociateTernary(exp.rightSubtree)
      );
    else if (exp instanceof ConditionalNode1) {
      if (exp.rightSubtree instanceof ConditionalNode2)
        return new ConditionalNode(
          unassociateTernary(exp.leftSubtree),
          unassociateTernary(exp.rightSubtree.leftSubtree),
          unassociateTernary(exp.rightSubtree.rightSubtree)
        );
      else
        throw new ParseError("mismatched ?:");
    } else if (exp instanceof ConditionalNode2)
      throw new ParseError("mismatched ?:");
    else if (exp instanceof ArrayNode)
      return new ArrayNode(
        exp.elementType,
        exp.subtreeArray.map(unassociateTernary)
      );
    else
      return exp;
  };

  export type PreExpr3 =
    ConstLeaf | VarLeaf | InputLeaf |
    NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr3> |
    NegateNode<PreExpr3> | ToStringNode<PreExpr3> |
    PlusNode<PreExpr3> | TimesNode<PreExpr3> | AndNode<PreExpr3> |
    IndexNode<PreExpr3> |
    LessThanNode<PreExpr3> | EqualNode<PreExpr3> |
    ConditionalNode<PreExpr3>;

  const desugar = (tree: PreExpr2): PreExpr3 => {
    if (tree instanceof ArrayNode)
      return new ArrayNode(tree.elementType, tree.subtreeArray.map(desugar));
    else if (tree instanceof NegateNode)
      return new NegateNode(desugar(tree.subtree));
    else if (tree instanceof ToStringNode)
      return new ToStringNode(desugar(tree.subtree));
    else if (tree instanceof PlusNode)
      return new PlusNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
    else if (tree instanceof TimesNode)
      return new TimesNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
    else if (tree instanceof AndNode)
      return new AndNode(tree.leftSubtree, tree.rightSubtree);
    else if (tree instanceof IndexNode)
      return new IndexNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
    else if (tree instanceof LessThanNode)
      return new LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
    else if (tree instanceof EqualNode)
      return new EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
    else if (tree instanceof GreaterThanNode)
      return new AndNode(
        new NegateNode(
          new LessThanNode(
            desugar(tree.leftSubtree),
            desugar(tree.rightSubtree)
          )
        ),
        new NegateNode(
          new EqualNode(
            desugar(tree.leftSubtree),
            desugar(tree.rightSubtree)
          )
        )
      );
    else if (tree instanceof ConditionalNode)
      return new ConditionalNode(
        desugar(tree.conditionSubtree),
        desugar(tree.trueBranchSubtree),
        desugar(tree.falseBranchSubtree)
      );
    else
      return tree;
  };

  export const parseCompleteExpr = (tokens: readonly Token[]): PreExpr3 => {
    const shunted = shunt(tokens);
    const [expr, index] = parseExpr(shunted);
    if (index < shunted.length)
      throw new ParseError("leftover tokens: " + tokens.slice(index).join(", "));
    return desugar(unassociateTernary(expr));
  };

  const parseStmt = (tokens: Token[]): Stmt<PreExpr3> => {
    switch (tokens[0]!.text) {
      case "output": {
        if (tokens[1]!.text != '(' || tokens[tokens.length-1]!.text != ')')
          throw new ParseError("invalid output statement");
        const expr = parseCompleteExpr(tokens.slice(2, -1));
        return new OutputNode(expr);
      }
      case "var": {
        if (tokens[1]!.sort != TokenSort.name)
          throw new ParseError("invalid variable declaration");
        const name = tokens[1]!.text;
        if (tokens[2]!.text != ':')
          throw new ParseError("invalid variable declaration");
        const [type, index] = parseType(tokens.slice(3));
        if (tokens[3+index]!.text != '<' || tokens[4+index]!.text != '-')
          throw new ParseError("invalid variable declaration");
        const expr = parseCompleteExpr(tokens.slice(5+index));
        return new VarDeclNode(name, type, expr);
      }
      default: {
        if (tokens[0]!.sort != TokenSort.name)
          throw new ParseError("invalid statement");
        const name = tokens[0]!.text;
        if (tokens[1]!.text != '<' || tokens[2]!.text != '-')
          throw new ParseError("invalid variable assignment");
        const expr = parseCompleteExpr(tokens.slice(3));
        return new AssignNode(name, expr);
      }
    }
  };

  export const parseProgram = (input: string): Program<PreExpr2> => {
    const lines = input.trim().split(/\s*;\s*/);
    if (lines[lines.length-1] === '') lines.pop();
    return lines.map(tokenize).map(parseStmt);
  };

  export function expandExpr(env: Env<Value>, tree: PreExpr3): Expr | Stmt<Expr> {
    if (tree instanceof ConstLeaf)
      return env.get(tree.name)!;
    else if (tree instanceof NegateNode)
      return new NegateNode(
        expandExpr(env, tree.subtree)
      );
    else if (tree instanceof ToStringNode)
      return new ToStringNode(
        expandExpr(env, tree.subtree)
      );
    else if (tree instanceof PlusNode)
      return new PlusNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof TimesNode)
      return new TimesNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof AndNode)
      return new AndNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof LessThanNode)
      return new LessThanNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof EqualNode)
      return new EqualNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof IndexNode)
      return new IndexNode(
        expandExpr(env, tree.leftSubtree),
        expandExpr(env, tree.rightSubtree)
      );
    else if (tree instanceof ConditionalNode)
      return new ConditionalNode(
        expandExpr(env, tree.conditionSubtree),
        expandExpr(env, tree.trueBranchSubtree),
        expandExpr(env, tree.falseBranchSubtree)
      );
    else if (tree instanceof ArrayNode)
      return new ArrayNode(
        tree.elementType,
        tree.subtreeArray.map(subtree => expandExpr(env, subtree))
      );
    else
      return tree;
  }

  export function expandStmt(env: Env<Value>, tree: Stmt<PreExpr3>): Stmt<Expr> {
    if (tree instanceof OutputNode)
      return new OutputNode(expandExpr(env, tree.subtree));
    else if (tree instanceof VarDeclNode)
      return new VarDeclNode(
        tree.varName,
        tree.varType,
        expandExpr(env, tree.subtree)
      );
    else // tree instanceof AssignNode
      return new AssignNode(
        tree.varName,
        expandExpr(env, tree.subtree)
      );
  }
}
