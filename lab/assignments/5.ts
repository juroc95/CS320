namespace Lab5 {
  export enum TokenSort {
    number,
    string,
    boolean,
    constant,
    variable,
    symbol
  }

  class TokenPattern {
    sort: TokenSort;
    regexp: RegExp;

    constructor(sort: TokenSort, regexp: RegExp) {
      this.sort = sort;
      this.regexp = regexp;
    }
  }

  // modify this definition
  const tokenPatterns: TokenPattern[] = [
    new TokenPattern(TokenSort.number, /^\d+(?:\.\d+)?/),
    new TokenPattern(TokenSort.string, /^"[^"]*?"/),
    new TokenPattern(TokenSort.boolean, /^(?:true|false)/),
    new TokenPattern(TokenSort.constant, /^[A-Z][A-Z_]*/),
    new TokenPattern(TokenSort.symbol, /^[<=>&*?:()@+-]/),
    new TokenPattern(TokenSort.variable, /^[a-z_][a-z_0-9]*/)
  ];

  export class Token {
    sort: TokenSort;
    text: string;

    constructor(sort: TokenSort, text: string) {
      this.sort = sort;
      this.text = text;
    }
  }

  export type TokenList = TokenListNode | null;

  class TokenListNode {
    head: Token;
    tail: TokenList;

    constructor(head: Token, tail: TokenList) {
      this.head = head;
      this.tail = tail;
    }
  }

  export function tokenListToString(tokens: TokenList): string {
    if (tokens == null) return "";
    return (
      TokenSort[tokens.head.sort] + "('" + tokens.head.text + "')" +
      (tokens.tail == null ?
        "" :
        ", " + tokenListToString(tokens.tail)
      )
    );
  }

  export class TokenizingError extends Error { }

  export function tokenize(source: string): TokenList {
    // remove all whitespace from start of input
    const trimmed = source.trimStart();

    // return empty list for empty input
    if (trimmed == "") return null;

    // try each pattern to find first match, if any
    for (const pattern of tokenPatterns) {
      // RegExpMatchArray contains match data in success case
      const match: RegExpMatchArray | null = trimmed.match(pattern.regexp);
      if (match == null) continue; // match failed

      // extract matched text (safe because match succeeded)
      const tokenText: string = match[0]!;

      // construct the token that was just matched
      const token: Token = new Token(pattern.sort, tokenText.trimEnd());

      // remove the token text from the start of the input
      const restOfInput: string = trimmed.slice(tokenText.length);

      // tokenize the rest of the input
      const restOfTokens: TokenList = tokenize(restOfInput);

      // add the matched token to the token list
      return new TokenListNode(token, restOfTokens);
    }

    // all patterns failed
    throw new TokenizingError("leftover input: " + source);
  }

  export type PreAST =
    ConstLeaf | VarLeaf |
    NumLeaf | BoolLeaf | StringLeaf |
    NegateNode<PreAST> | ToStringNode<PreAST> |
    PlusNode<PreAST> | TimesNode<PreAST> | AndNode<PreAST> |
    LessThanNode<PreAST> | EqualNode<PreAST> | GreaterThanNode<PreAST> |
    ConditionalNode<PreAST>;

  export type AST =
    ConstLeaf | VarLeaf |
    NumLeaf | BoolLeaf | StringLeaf |
    NegateNode<AST> | ToStringNode<AST> |
    PlusNode<AST> | TimesNode<AST> |
    LessThanNode<AST> | EqualNode<AST> | GreaterThanNode<AST> |
    ConditionalNode<AST>;

  export class NameLeaf {
    readonly name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

  export class ValueLeaf<V> {
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

  export class VarLeaf extends NameLeaf { }
  export class ConstLeaf extends NameLeaf { }

  export class NumLeaf extends ValueLeaf<number> { }
  export class BoolLeaf extends ValueLeaf<boolean>{ }
  export class StringLeaf extends ValueLeaf<string> { }

  export type Value = NumLeaf | BoolLeaf | StringLeaf;

  export class NegateNode<T> extends UnaryNode<T> { }
  export class ToStringNode<T> extends UnaryNode<T> { }

  export class PlusNode<T> extends BinaryNode<T> { }
  export class TimesNode<T> extends BinaryNode<T> { }
  export class AndNode<T> extends BinaryNode<T> { }
  export class LessThanNode<T> extends BinaryNode<T> { }
  export class EqualNode<T> extends BinaryNode<T> { }
  export class GreaterThanNode<T> extends BinaryNode<T> { }

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
    else if (tree instanceof NameLeaf)
      return tree.name;
    else if (tree instanceof PlusNode)
      return "(" + astToString(tree.leftSubtree) + " + " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof TimesNode)
      return "(" + astToString(tree.leftSubtree) + " * " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof AndNode)
      return "(" + astToString(tree.leftSubtree) + " & " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof LessThanNode)
      return "(" + astToString(tree.leftSubtree) + " < " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof EqualNode)
      return "(" + astToString(tree.leftSubtree) + " = " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof GreaterThanNode)
      return "(" + astToString(tree.leftSubtree) + " > " + astToString(tree.rightSubtree) + ")";
    else if (tree instanceof NegateNode)
      return "(- " + astToString(tree.subtree) + ")";
    else if (tree instanceof ToStringNode)
      return "(@ " + astToString(tree.subtree) + ")";
    else if (tree instanceof ConditionalNode)
      return "(" + astToString(tree.conditionSubtree) + " ? " + astToString(tree.trueBranchSubtree) + " : " + astToString(tree.falseBranchSubtree) + ")";
    else // if (tree instanceof NumLeaf || tree instanceof BoolLeaf)
      return tree.value.toString();
  }

  export class ParsingError extends Error { }

  class ParseResult {
    tree: PreAST;
    remainingTokens: TokenList;

    constructor(tree: PreAST, remainingTokens: TokenList) {
      this.tree = tree;
      this.remainingTokens = remainingTokens;
    }
  }

  export function parse(tokens: TokenList): PreAST {
    const parseResult = parsePreAST(tokens);

    if (parseResult == null)
      throw new ParsingError("all possibilities failed");

    if (parseResult.remainingTokens != null)
      throw new ParsingError(
        "leftover tokens after parsing: " +
        tokenListToString(parseResult.remainingTokens)
      );

    return parseResult.tree;
  }

  function parsePreAST(tokens: TokenList): ParseResult | null {
    return parsePrecedence0(tokens);
  }

  export function parsePrecedence0(tokens: TokenList): ParseResult | null {
    return (
      parseEqual(tokens) ??
      parsePrecedence1(tokens)
    );
  }

  function parseEqual(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence1(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "=") return null;

    const parsedRightSubtree = parsePrecedence0(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new EqualNode(parsedLeftSubtree.tree, parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  export function parsePrecedence1(tokens: TokenList): ParseResult | null {
    return (
      parseConditional(tokens) ??
      parsePrecedence2(tokens)
    );
  }

  function parseConditional(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence2(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "?") return null;

    const parsedMiddleSubtree = parsePrecedence1(tokensAfterLeftOperand.tail);
    if (parsedMiddleSubtree == null) return null;

    const tokensAfterMiddleOperand = parsedMiddleSubtree.remainingTokens;
    if (tokensAfterMiddleOperand == null) return null;
    if (tokensAfterMiddleOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterMiddleOperand.head.text != ":") return null;

    const parsedRightSubtree = parsePrecedence1(tokensAfterMiddleOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new ConditionalNode(
        parsedLeftSubtree.tree,
        parsedMiddleSubtree.tree,
        parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  export function parsePrecedence2(tokens: TokenList): ParseResult | null {
    return (
      parseAnd(tokens) ??
      parsePrecedence3(tokens)
    );
  }

  function parseAnd(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence3(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "&") return null;

    const parsedRightSubtree = parsePrecedence2(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new AndNode(parsedLeftSubtree.tree, parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  export function parsePrecedence3(tokens: TokenList): ParseResult | null {
    return (
      parseLessThan(tokens) ??
      parseGreaterThan(tokens) ??
      parsePrecedence4(tokens)
    );
  }

  function parseLessThan(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence4(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "<") return null;

    const parsedRightSubtree = parsePrecedence3(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new LessThanNode(parsedLeftSubtree.tree, parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  function parseGreaterThan(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence4(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != ">") return null;

    const parsedRightSubtree = parsePrecedence3(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new GreaterThanNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), 
      parsedRightSubtree.remainingTokens
    );
  }

  export function parsePrecedence4(tokens: TokenList): ParseResult | null {
    return (
      parsePlus(tokens) ??
      parsePrecedence5(tokens)
    );
  }

  function parsePlus(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence5(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "+") return null;

    const parsedRightSubtree = parsePrecedence4(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new PlusNode(parsedLeftSubtree.tree, parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  function parsePrecedence5(tokens: TokenList): ParseResult | null {
    return (
      parseTimes(tokens) ??
      parsePrecedence6(tokens)
    );
  }

  function parseTimes(tokens: TokenList): ParseResult | null {
    const parsedLeftSubtree = parsePrecedence6(tokens);
    if (parsedLeftSubtree == null) return null;

    const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
    if (tokensAfterLeftOperand == null) return null;
    if (tokensAfterLeftOperand.head.sort != TokenSort.symbol) return null;
    if (tokensAfterLeftOperand.head.text != "*") return null;

    const parsedRightSubtree = parsePrecedence5(tokensAfterLeftOperand.tail);
    if (parsedRightSubtree == null) return null;

    return new ParseResult(
      new TimesNode(parsedLeftSubtree.tree, parsedRightSubtree.tree),
      parsedRightSubtree.remainingTokens
    );
  }

  function parsePrecedence6(tokens: TokenList): ParseResult | null {
    return (
      parseNegate(tokens) ??
      parseToString(tokens) ??
      parseAtom(tokens)
    );
  }

  function parseNegate(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.symbol) return null;
    if (tokens.head.text != "-") return null;

    const parsedSubtree: ParseResult | null = parsePreAST(tokens.tail);
    if (parsedSubtree == null) return null;

    return new ParseResult(
      new NegateNode(parsedSubtree.tree),
      parsedSubtree.remainingTokens
    );
  }

  function parseToString(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.symbol) return null;
    if (tokens.head.text != "@") return null;

    const parsedSubtree: ParseResult | null = parsePreAST(tokens.tail);
    if (parsedSubtree == null) return null;

    return new ParseResult(
      new ToStringNode(parsedSubtree.tree),
      parsedSubtree.remainingTokens
    );
  }

  function parseAtom(tokens: TokenList): ParseResult | null {
    return (
      parseNum(tokens) ??
      parseString(tokens) ??
      parseBool(tokens) ??
      parseConst(tokens) ??
      parseVar(tokens) ??
      parseParens(tokens)
    );
  }

  function parseNum(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.number) return null;
    const value: number = parseFloat(tokens.head.text);
    if (!isFinite(value)) return null;
    return new ParseResult(new NumLeaf(value), tokens.tail);
  }

  function parseString(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.string) return null;
    const value: string = tokens.head.text.slice(1,-1);
    return new ParseResult(new StringLeaf(value), tokens.tail);
  }

  function parseBool(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.boolean) return null;
    const value: boolean = tokens.head.text == "true" ? true : false;
    return new ParseResult(new BoolLeaf(value), tokens.tail);
  }

  function parseConst(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.constant) return null;
    const name: string = tokens.head.text;
    return new ParseResult(new ConstLeaf(name), tokens.tail);
  }

  function parseVar(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.variable) return null;
    const name: string = tokens.head.text;
    return new ParseResult(new VarLeaf(name), tokens.tail);
  }

  function parseParens(tokens: TokenList): ParseResult | null {
    if (tokens == null) return null;
    if (tokens.head.sort != TokenSort.symbol) return null;
    if (tokens.head.text != "(") return null;
    const result: ParseResult | null = parsePrecedence0(tokens.tail);
    if (result == null || result.remainingTokens == null) return null;
    if (result.remainingTokens.head.sort != TokenSort.symbol) return null;
    if (result.remainingTokens.head.text != ")") return null;
    return new ParseResult(result.tree, result.remainingTokens.tail);
  }

  export function desugar(tree: PreAST): AST {
    if (tree instanceof ValueLeaf || tree instanceof NameLeaf)
      return tree;
    else if (tree instanceof NegateNode)
      return new NegateNode(desugar(tree.subtree));
    else if (tree instanceof ToStringNode)
      return new ToStringNode(desugar(tree.subtree));
    else if (tree instanceof PlusNode)
      return new PlusNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree)
      );
    else if (tree instanceof TimesNode)
      return new TimesNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree)
      );
    else if (tree instanceof AndNode)
      return new ConditionalNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree),
        desugar(new BoolLeaf(false))
      );
    else if (tree instanceof LessThanNode)
      return new LessThanNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree)
      );
    else if (tree instanceof EqualNode)
      return new EqualNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree)
      );
    else if (tree instanceof GreaterThanNode)
      return new GreaterThanNode(
        desugar(tree.leftSubtree),
        desugar(tree.rightSubtree)
      );
    else // if (tree instanceof ConditionalNode)
      return new ConditionalNode(
        desugar(tree.conditionSubtree),
        desugar(tree.trueBranchSubtree),
        desugar(tree.falseBranchSubtree)
      );
  }
}
