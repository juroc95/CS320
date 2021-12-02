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
namespace Lab7 {
  export enum TokenSort {
    number,
    string,
    boolean,
    keyword,
    name,
    paren,
    bracket,
    brace,
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
    // { sort: TokenSort.function, regexp: /^(?:input|output)/ },
    { sort: TokenSort.keyword, regexp: /^var/ },
    { sort: TokenSort.name, regexp: /^[A-Za-z_]\w*/ },
    { sort: TokenSort.paren, regexp: /^[()]/ },
    { sort: TokenSort.bracket, regexp: /^[[\]]/ },
    { sort: TokenSort.brace, regexp: /^[{}]/ },
    { sort: TokenSort.unaryOp, regexp: /^[@-]/ },
    { sort: TokenSort.binaryOp, regexp: /^[<=>&*?:+#,;]/ },
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
            case ')': out.unshift(head); ops.unshift(head); break;
            case '(': {
              while (ops.length > 0 && ops[0]!.text != ')')
                out.unshift(ops.shift()!);
              if (ops.shift()?.text != ')')
                throw new ParseError("mismatched parentheses");
              out.unshift(head);
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
    CallNode<PreExpr1> |
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
          else if (head.text in AtomicType || head.text == '[') {
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
              throw new ParseError("invalid array expression: missing close bracket");
            return new ArrayNode(type, unassociateElements(elements));
          }
          else if (head.text == "input") {
            if (tokens[index++]?.text != '(')
              throw new ParseError("invalid input expression: missing open parenthesis");
            const [type, newIndex] = parseType(tokens.slice(index));
            index += newIndex;
            if (tokens[index++]?.text != ')')
              throw new ParseError("invalid input expression: missing close parenthesis");
            return new InputLeaf(type);
          } else if (tokens[index]?.text == '(') {
            index++;
            if (tokens[index]?.text == ')') {
              index++;
              return new CallNode(head.text, []);
            }
            const args = parse();
            if (tokens[index++]?.text != ')')
              throw new ParseError("invalid function call: missing close parenthesis");
            return new CallNode(head.text, unassociateElements(args));
          }
          return new (/[A-Z]/.test(head.text[0]!) ? ConstLeaf : VarLeaf)(head.text);
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

  const nextClosing = (tokens: Token[], index: number): number => {
    let opens = 1;
    let i: number;
    for (i = index; opens > 0; i++) {
      const current = tokens[i];
      if (current == null)
        throw new ParseError("missing close parenthesis");
      else if (current.text == '(')
        opens++;
      else if (current.text == ')')
        opens--;
    }
    return i-1;
  };

  const parseBlockNode = (tokens: Token[]): [BlockNode<PreExpr3>, number] => {
    let index = 0;
    const stmts: Stmt<PreExpr3>[] = [];
    while (tokens[index]?.text != '}') {
      if (tokens[index] == null)
        throw new ParseError("invalid block statement: missing close brace");
      const [stmt, newIndex] = parseStmt(tokens.slice(index));
      index += newIndex;
      stmts.push(stmt);
      if (tokens[index-1]?.text != '}' && tokens[index++]?.text != ';')
        throw new ParseError("invalid block statement: missing semicolon");
    }
    index++;
    return [new BlockNode(stmts), index];
  };

  const parseStmt = (tokens: Token[]): [Stmt<PreExpr3>, number] => {
    let index = 0;

    const nextSemi = (): number => {
      const end = tokens.map(token => token.text).indexOf(';', index);
      if (end < 0)
        throw new ParseError("missing semicolon");
      return end;
    };

    const parse = (): Stmt<PreExpr3> => {
      const head = tokens[index++];
      if (head == null)
        throw new ParseError("unexpected end of input");
      switch (head.text) {
        case "output": {
          if (tokens[index++]?.text != '(')
            throw new ParseError("invalid output statement: missing open parenthesis");
          const close = nextClosing(tokens, index);
          const expr = parseCompleteExpr(tokens.slice(index, close));
          index = close+1;
          return new OutputNode(expr);
        }
        case "var": {
          if (tokens[index]!.sort != TokenSort.name)
            throw new ParseError("invalid variable declaration");
          const name = tokens[index++]!.text;
          if (tokens[index++]!.text != ':')
            throw new ParseError("invalid variable declaration");
          const [type, newIndex] = parseType(tokens.slice(index));
          index += newIndex;
          if (tokens[index++]?.text != '<' || tokens[index++]?.text != '-')
            throw new ParseError("invalid variable declaration: missing left arrow");
          const end = nextSemi();
          const expr = parseCompleteExpr(tokens.slice(index, end));
          index = end;
          return new VarDeclNode(name, type, expr);
        }
        case "if": {
          if (tokens[index++]?.text != '(')
            throw new ParseError("invalid if statement: missing open parenthesis");
          const close = nextClosing(tokens, index);
          const expr = parseCompleteExpr(tokens.slice(index, close));
          index = close+1;
          const trueBranch = parse();
          let falseBranch: Stmt<PreExpr3> | null;
          if (tokens[index]?.text == ";" && tokens[index+1]?.text == "else") {
            index += 2;
            falseBranch = parse();
          } else if (tokens[index-1]?.text == "}" && tokens[index]?.text == "else") {
            index++;
            falseBranch = parse();
          } else
            falseBranch = null;
          return new IfNode(expr, trueBranch, falseBranch);
        }
        case "while": {
          if (tokens[index++]?.text != '(')
            throw new ParseError("invalid if statement: missing open parenthesis");
          const close = nextClosing(tokens, index);
          const expr = parseCompleteExpr(tokens.slice(index, close));
          index = close+1;
          return new WhileNode(expr, parse());
        }
        case "foreach": {
          if (tokens[index++]?.text != '(')
            throw new ParseError("invalid foreach statement: missing open parenthesis");
          if (tokens[index++]?.text != "var")
            throw new ParseError("invalid foreach statement: missing 'var' keyword");
          if (tokens[index]?.sort != TokenSort.name)
            throw new ParseError("invalid foreach statement: missing loop variable name");
          const name = tokens[index++]!.text;
          if (
            tokens[index++]?.text != '<' ||
            tokens[index++]?.text != '-' ||
            tokens[index++]?.text != '-'
          )
            throw new ParseError("invalid foreach statement: missing <-- operator");
          const close = nextClosing(tokens, index);
          const expr = parseCompleteExpr(tokens.slice(index, close));
          index = close+1;
          return new ForEachNode(name, expr, parse());
        }
        case "return": {
          if (tokens[index]?.text == ';')
            return new ReturnNode<PreExpr3>(null);
          else {
            const end = nextSemi();
            const expr = parseCompleteExpr(tokens.slice(index, end));
            index = end;
            return new ReturnNode(expr);
          }
        }
        case '{': {
          const [stmt, newIndex] = parseBlockNode(tokens.slice(index));
          index += newIndex;
          return stmt;
        }
        default: {
          if (head.sort != TokenSort.name)
            throw new ParseError("invalid statement");
          const name = head.text;
          if (tokens[index]?.text == '<' && tokens[index+1]?.text == '-') {
            index += 2;
            const end = nextSemi();
            const expr = parseCompleteExpr(tokens.slice(index, end));
            index = end;
            return new AssignNode(name, expr);
          } else if (tokens[index]?.text == '(') {
            index--;
            const close = nextClosing(tokens, index+2);
            const [expr, newIndex] = parseExpr(tokens.slice(index, close+1));
            index += newIndex;
            if (expr instanceof CallNode) {
              return expr;
            } else
              throw new ParseError("invalid statement");
          } else
            throw new ParseError("invalid statement");
        }
      }
    };

    return [parse(), index];
  };

  export const parseFuncDecl = (tokens: Token[]): [string, FuncDecl<PreExpr2>, number] => {
    let index = 0;

    if (tokens[index++]?.text != "def")
      throw new ParseError("invalid function declaration: missing 'def' keyword");

    if (tokens[index]?.sort != TokenSort.name)
      throw new ParseError("invalid function declaration: missing function name");
    const funcName = tokens[index++]!.text;

    if (tokens[index++]?.text != '(')
      throw new ParseError("invalid function declaration: missing open parenthesis");

    const params: FuncParam[] = [];

    while (tokens[index]?.text != ')') {
      if (tokens[index]?.sort != TokenSort.name)
        throw new ParseError("invalid parameter: missing name");
      const paramName = tokens[index++]!.text;

      if (tokens[index++]?.text != ':')
        throw new ParseError("invalid parameter: missing colon");

      const [paramType, newIndex] = parseType(tokens.slice(index));
      index += newIndex;

      params.push(new FuncParam(paramName, paramType));
      if (tokens[index]?.text != ')' && tokens[index++]?.text != ',')
        throw new ParseError("invalid parameter list: missing comma");
    }
    index++;

    let returnType: Type | null;
    if (tokens[index]?.text == ':') {
      index++;
      const [type, newIndex] = parseType(tokens.slice(index));
      returnType = type;
      index += newIndex;
    } else
      returnType = null;

    if (tokens[index++]?.text != '{')
      throw new ParseError("invalid function declaration: missing opening brace");

    const [body, newIndex] = parseBlockNode(tokens.slice(index));
    index += newIndex;

    return [funcName, new FuncDecl(params, returnType, body), index];
  };

  export const parseProgram = (input: string): Program<PreExpr2> => {
    let tokens = tokenize(input);
    const prog: Program<PreExpr2> = new Map;
    while (tokens.length > 0) {
      const [funcName, func, index] = parseFuncDecl(tokens);
      if (prog.has(funcName))
        throw new ParseError("duplicate function name " + funcName);
      prog.set(funcName, func);
      tokens = tokens.slice(index);
    }
    return prog;
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
    CallNode<PreExpr2> |
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
    else if (exp instanceof CallNode)
      return new CallNode(
        exp.funcName,
        exp.argArray.map(unassociateTernary)
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
    CallNode<PreExpr3> |
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
    else if (tree instanceof CallNode)
      return new CallNode(
        tree.funcName,
        tree.argArray.map(desugar)
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

  export function expandExpr(env: Env<Value>, tree: PreExpr3): Expr {
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
    else if (tree instanceof CallNode)
      return new CallNode(
        tree.funcName,
        tree.argArray.map(arg => expandExpr(env, arg))
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
    else if (tree instanceof AssignNode)
      return new AssignNode(
        tree.varName,
        expandExpr(env, tree.subtree)
      );
    else if (tree instanceof BlockNode)
      return new BlockNode(
        tree.stmtArray.map(stmt => expandStmt(env, stmt))
      );
    else if (tree instanceof IfNode)
      return new IfNode(
        expandExpr(env, tree.conditional),
        expandStmt(env, tree.trueBranch),
        tree.falseBranch == null ? null : expandStmt(env, tree.falseBranch)
      );
    else if (tree instanceof WhileNode)
      return new WhileNode(
        expandExpr(env, tree.conditional),
        expandStmt(env, tree.body)
      );
    else if (tree instanceof ForEachNode)
      return new ForEachNode(
        tree.varName,
        expandExpr(env, tree.arrayExpr),
        expandStmt(env, tree.body)
      );
    else if (tree instanceof CallNode)
      return new CallNode(
        tree.funcName,
        tree.argArray.map(arg => expandExpr(env, arg))
      );
    else // tree instance of ReturnNode
      return new ReturnNode(
        tree.returnExpr == null ? null : expandExpr(env, tree.returnExpr)
      );
  }

  export function expandProg(env: Env<Value>, prog: Program<PreExpr3>): Program<Expr> {
    const newProg: Program<Expr> = new Map;
    for (const [funcName, func] of prog.entries())
      newProg.set(
        funcName,
        new FuncDecl(
          func.parameterArray,
          func.returnType,
          <BlockNode<PreExpr3>> expandStmt(env, func.body)
        )
      );
    return newProg;
  }
}