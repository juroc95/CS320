declare type StringList = StringListNode | null;
declare class StringListNode {
    readonly head: string;
    readonly tail: StringList;
    constructor(head: string, tail: StringList);
}
declare function fromArray(array: string[]): StringList;
declare function concatenateAll(list: StringList): string;
declare function prependToEach(x: string, list: StringList): StringList;
declare function appendLast(list: StringList, x: string): StringList;
declare function reverse(list: StringList): StringList;
declare function reverse_inner(newlist: StringList, list: StringList): StringList;
declare function removeAll(x: string, list: StringList): StringList;
declare function interleave(list1: StringList, list2: StringList): StringList;
declare namespace Lab3 {
    type AST = NumLeaf | PlusNode | NegateNode;
    class NumLeaf {
        readonly value: number;
        constructor(value: number);
    }
    class PlusNode {
        readonly leftSubtree: AST;
        readonly rightSubtree: AST;
        constructor(leftSubtree: AST, rightSubtree: AST);
    }
    class NegateNode {
        readonly subtree: AST;
        constructor(subtree: AST);
    }
    function interpret(tree: AST): number;
    function astToString(tree: AST): string;
    function nodeCount(tree: AST): number;
    function leafCount(tree: AST): number;
    function maxNum(tree: AST): number;
    function doubleAllLeaves(tree: AST): AST;
    function removeAllNegations(tree: AST): AST;
}
declare namespace Lab4 {
    type PreAST = ConstLeaf | NumLeaf | BoolLeaf | StringLeaf | NegateNode<PreAST> | ToStringNode<PreAST> | PlusNode<PreAST> | TimesNode<PreAST> | AndNode<PreAST> | LessThanNode<PreAST> | ConditionalNode<PreAST>;
    type AST = NumLeaf | BoolLeaf | StringLeaf | NegateNode<AST> | ToStringNode<AST> | PlusNode<AST> | TimesNode<AST> | AndNode<AST> | LessThanNode<AST> | ConditionalNode<AST>;
    class ConstLeaf {
        readonly name: string;
        constructor(name: string);
    }
    class Leaf<V> {
        readonly value: V;
        constructor(value: V);
    }
    class UnaryNode<T> {
        readonly subtree: T;
        constructor(subtree: T);
    }
    class BinaryNode<T> {
        readonly leftSubtree: T;
        readonly rightSubtree: T;
        constructor(leftSubtree: T, rightSubtree: T);
    }
    class NumLeaf extends Leaf<number> {
    }
    class BoolLeaf extends Leaf<boolean> {
    }
    class StringLeaf extends Leaf<string> {
    }
    type Value = NumLeaf | BoolLeaf | StringLeaf;
    class NegateNode<T> extends UnaryNode<T> {
    }
    class ToStringNode<T> extends UnaryNode<T> {
    }
    class PlusNode<T> extends BinaryNode<T> {
    }
    class TimesNode<T> extends BinaryNode<T> {
    }
    class AndNode<T> extends BinaryNode<T> {
    }
    class LessThanNode<T> extends BinaryNode<T> {
    }
    class ConditionalNode<T> {
        readonly conditionSubtree: T;
        readonly trueBranchSubtree: T;
        readonly falseBranchSubtree: T;
        constructor(conditionSubtree: T, trueBranchSubtree: T, falseBranchSubtree: T);
    }
    function astToString(tree: PreAST): string;
    interface Environment {
        lookup(name: string): Value | null;
    }
    function expandNamedConstants(env: Environment, tree: PreAST): AST;
    class InterpreterError extends Error {
    }
    function interpret(tree: AST): Value;
    function removeDoubleNegations(tree: AST): AST;
}
declare namespace Lab5 {
    export enum TokenSort {
        number = 0,
        string = 1,
        boolean = 2,
        constant = 3,
        variable = 4,
        symbol = 5
    }
    export class Token {
        sort: TokenSort;
        text: string;
        constructor(sort: TokenSort, text: string);
    }
    export type TokenList = TokenListNode | null;
    class TokenListNode {
        head: Token;
        tail: TokenList;
        constructor(head: Token, tail: TokenList);
    }
    export function tokenListToString(tokens: TokenList): string;
    export class TokenizingError extends Error {
    }
    export function tokenize(source: string): TokenList;
    export type PreAST = ConstLeaf | VarLeaf | NumLeaf | BoolLeaf | StringLeaf | NegateNode<PreAST> | ToStringNode<PreAST> | PlusNode<PreAST> | TimesNode<PreAST> | AndNode<PreAST> | LessThanNode<PreAST> | EqualNode<PreAST> | GreaterThanNode<PreAST> | ConditionalNode<PreAST>;
    export type AST = ConstLeaf | VarLeaf | NumLeaf | BoolLeaf | StringLeaf | NegateNode<AST> | ToStringNode<AST> | PlusNode<AST> | TimesNode<AST> | LessThanNode<AST> | EqualNode<AST> | GreaterThanNode<AST> | ConditionalNode<AST>;
    export class NameLeaf {
        readonly name: string;
        constructor(name: string);
    }
    export class ValueLeaf<V> {
        readonly value: V;
        constructor(value: V);
    }
    export class UnaryNode<T> {
        readonly subtree: T;
        constructor(subtree: T);
    }
    export class BinaryNode<T> {
        readonly leftSubtree: T;
        readonly rightSubtree: T;
        constructor(leftSubtree: T, rightSubtree: T);
    }
    export class VarLeaf extends NameLeaf {
    }
    export class ConstLeaf extends NameLeaf {
    }
    export class NumLeaf extends ValueLeaf<number> {
    }
    export class BoolLeaf extends ValueLeaf<boolean> {
    }
    export class StringLeaf extends ValueLeaf<string> {
    }
    export type Value = NumLeaf | BoolLeaf | StringLeaf;
    export class NegateNode<T> extends UnaryNode<T> {
    }
    export class ToStringNode<T> extends UnaryNode<T> {
    }
    export class PlusNode<T> extends BinaryNode<T> {
    }
    export class TimesNode<T> extends BinaryNode<T> {
    }
    export class AndNode<T> extends BinaryNode<T> {
    }
    export class LessThanNode<T> extends BinaryNode<T> {
    }
    export class EqualNode<T> extends BinaryNode<T> {
    }
    export class GreaterThanNode<T> extends BinaryNode<T> {
    }
    export class ConditionalNode<T> {
        readonly conditionSubtree: T;
        readonly trueBranchSubtree: T;
        readonly falseBranchSubtree: T;
        constructor(conditionSubtree: T, trueBranchSubtree: T, falseBranchSubtree: T);
    }
    export function astToString(tree: PreAST): string;
    export class ParsingError extends Error {
    }
    class ParseResult {
        tree: PreAST;
        remainingTokens: TokenList;
        constructor(tree: PreAST, remainingTokens: TokenList);
    }
    export function parse(tokens: TokenList): PreAST;
    export function parsePrecedence0(tokens: TokenList): ParseResult | null;
    export function parsePrecedence1(tokens: TokenList): ParseResult | null;
    export function parsePrecedence2(tokens: TokenList): ParseResult | null;
    export function parsePrecedence3(tokens: TokenList): ParseResult | null;
    export function parsePrecedence4(tokens: TokenList): ParseResult | null;
    export function desugar(tree: PreAST): AST;
    export {};
}
declare namespace Lab8 {
    type List<T> = ListNode<T> | null;
    class ListNode<T> {
        readonly head: T;
        readonly tail: List<T>;
        constructor(head: T, tail: List<T>);
    }
    function fromArray<T>(array: readonly T[]): List<T>;
    function iterativeSum(list: List<number>): number;
    function recursiveSum(list: List<number>): number;
    function maximum(list: List<number>): number;
    function concatenateRecursive<T>(list1: List<T>, list2: List<T>): List<T>;
    function foldLeft<T1, T2>(list: List<T1>, initialAccumulatorValue: T2, accumulatingFunc: (elem: T1, accumulator: T2) => T2): T2;
    function foldRight<T1, T2>(list: List<T1>, initialAccumulatorValue: T2, accumulatingFunc: (elem: T1, accumulator: T2) => T2): T2;
    function sumByFoldLeft(list: List<number>): number;
    function maximumByFoldRight(list: List<number>): number;
    function subtractByFoldLeft(list: List<number>): number;
    function subtractByFoldRight(list: List<number>): number;
    function anyEqualTo(lookingFor: number, list: List<number>): boolean;
    function concatenate<T>(list1: List<T>, list2: List<T>): List<T>;
    function removeAll(lookingFor: number, list: List<number>): List<number>;
}
declare namespace Lab6 {
    type Env<T> = Map<string, T>;
    type Type = AtomicType | ArrayType;
    enum AtomicType {
        number = "number",
        boolean = "boolean",
        string = "string"
    }
    class ArrayType {
        readonly elementType: Type;
        constructor(elementType: Type);
    }
    function isAtomicType(type: Type): type is AtomicType;
    function typeToString(type: Type): string;
    function equalTypes(type1: Type, type2: Type): boolean;
    type Expr = VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Expr> | NegateNode<Expr> | ToStringNode<Expr> | PlusNode<Expr> | TimesNode<Expr> | AndNode<Expr> | IndexNode<Expr> | LessThanNode<Expr> | EqualNode<Expr> | ConditionalNode<Expr>;
    type Stmt<T> = OutputNode<T> | VarDeclNode<T> | AssignNode<T>;
    type Program<T> = Stmt<T>[];
    abstract class NameLeaf {
        readonly name: string;
        constructor(name: string);
    }
    abstract class ValueLeaf<V> {
        readonly value: V;
        constructor(value: V);
    }
    abstract class UnaryNode<T> {
        readonly subtree: T;
        constructor(subtree: T);
    }
    abstract class BinaryNode<T> {
        readonly leftSubtree: T;
        readonly rightSubtree: T;
        constructor(leftSubtree: T, rightSubtree: T);
    }
    class VarLeaf extends NameLeaf {
    }
    class InputLeaf {
        readonly inputType: Type;
        constructor(inputType: Type);
    }
    class NumLeaf extends ValueLeaf<number> {
    }
    class BoolLeaf extends ValueLeaf<boolean> {
    }
    class StringLeaf extends ValueLeaf<string> {
    }
    class ArrayNode<T> {
        readonly elementType: Type;
        readonly subtreeArray: T[];
        constructor(elementType: Type, subtreeArray: T[]);
    }
    type Value = NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Value>;
    function isValue(tree: unknown): tree is Value;
    class NegateNode<T> extends UnaryNode<T> {
    }
    class ToStringNode<T> extends UnaryNode<T> {
    }
    class PlusNode<T> extends BinaryNode<T> {
    }
    class TimesNode<T> extends BinaryNode<T> {
    }
    class AndNode<T> extends BinaryNode<T> {
    }
    class LessThanNode<T> extends BinaryNode<T> {
    }
    class EqualNode<T> extends BinaryNode<T> {
    }
    class GreaterThanNode<T> extends BinaryNode<T> {
    }
    class IndexNode<T> extends BinaryNode<T> {
    }
    class ConditionalNode<T> {
        readonly conditionSubtree: T;
        readonly trueBranchSubtree: T;
        readonly falseBranchSubtree: T;
        constructor(conditionSubtree: T, trueBranchSubtree: T, falseBranchSubtree: T);
    }
    class OutputNode<T> extends UnaryNode<T> {
    }
    class VarDeclNode<T> extends UnaryNode<T> {
        readonly varName: string;
        readonly varType: Type;
        constructor(varName: string, varType: Type, subtree: T);
    }
    class AssignNode<T> extends UnaryNode<T> {
        readonly varName: string;
        constructor(varName: string, subtree: T);
    }
    function exprToString(tree: Expr): string;
    function stmtToString(tree: Stmt<Expr>): string;
    function programToString(prog: Program<Expr>): string;
}
declare namespace Lab6 {
    class RuntimeError extends Error {
    }
    interface Runtime {
        input(type: Type): Promise<Value>;
        output(value: Value): void;
    }
    function evaluate(env: Env<Value>, tree: Expr): Promise<Value>;
    function execute(env: Env<Value>, stmt: Stmt<Expr>): Promise<void>;
    function run(prog: Program<Expr>): Promise<void>;
}
declare namespace Lab6 {
    class TypeError extends Error {
    }
    function inferExprType(env: Env<Type>, tree: Expr): Type;
    function typecheckStmt(env: Env<Type>, stmt: Stmt<Expr>): void;
    function typecheckProg(prog: Program<Expr>): void;
}
declare namespace Lab6 {
    enum TokenSort {
        number = 0,
        string = 1,
        boolean = 2,
        function = 3,
        keyword = 4,
        name = 5,
        paren = 6,
        bracket = 7,
        unaryOp = 8,
        binaryOp = 9
    }
    class Token {
        readonly sort: TokenSort;
        readonly text: string;
        constructor(sort: TokenSort, text: string);
        readonly toString: () => string;
    }
    class TokenizingError extends Error {
    }
    function tokenize(source: string): Token[];
    class ParseError extends Error {
    }
    class ConstLeaf extends NameLeaf {
    }
    class CommaNode<T> extends BinaryNode<T> {
    }
    class ConditionalNode1<T> extends BinaryNode<T> {
    }
    class ConditionalNode2<T> extends BinaryNode<T> {
    }
    type PreExpr1 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr1> | NegateNode<PreExpr1> | ToStringNode<PreExpr1> | PlusNode<PreExpr1> | TimesNode<PreExpr1> | AndNode<PreExpr1> | IndexNode<PreExpr1> | LessThanNode<PreExpr1> | EqualNode<PreExpr1> | GreaterThanNode<PreExpr1> | CommaNode<PreExpr1> | ConditionalNode1<PreExpr1> | ConditionalNode2<PreExpr1>;
    type PreExpr2 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr2> | NegateNode<PreExpr2> | ToStringNode<PreExpr2> | PlusNode<PreExpr2> | TimesNode<PreExpr2> | AndNode<PreExpr2> | IndexNode<PreExpr2> | LessThanNode<PreExpr2> | EqualNode<PreExpr2> | GreaterThanNode<PreExpr2> | ConditionalNode<PreExpr2>;
    type PreExpr3 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr3> | NegateNode<PreExpr3> | ToStringNode<PreExpr3> | PlusNode<PreExpr3> | TimesNode<PreExpr3> | AndNode<PreExpr3> | IndexNode<PreExpr3> | LessThanNode<PreExpr3> | EqualNode<PreExpr3> | ConditionalNode<PreExpr3>;
    const parseCompleteExpr: (tokens: readonly Token[]) => PreExpr3;
    const parseProgram: (input: string) => Program<PreExpr2>;
    function expandExpr(env: Env<Value>, tree: PreExpr3): Expr | Stmt<Expr>;
    function expandStmt(env: Env<Value>, tree: Stmt<PreExpr3>): Stmt<Expr>;
}
declare namespace Lab7 {
    type Env<T> = Map<string, T>;
    function deleteSubScope<T>(env: Env<T>, outerScopeVarNames: Set<string>): void;
    type Type = AtomicType | ArrayType;
    enum AtomicType {
        number = "number",
        boolean = "boolean",
        string = "string"
    }
    class ArrayType {
        readonly elementType: Type;
        constructor(elementType: Type);
    }
    function isAtomicType(type: Type): type is AtomicType;
    function typeToString(type: Type): string;
    function equalTypes(type1: Type, type2: Type): boolean;
    type Expr = VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Expr> | NegateNode<Expr> | ToStringNode<Expr> | PlusNode<Expr> | TimesNode<Expr> | AndNode<Expr> | IndexNode<Expr> | LessThanNode<Expr> | EqualNode<Expr> | ConditionalNode<Expr> | CallNode<Expr>;
    type Value = NumLeaf | BoolLeaf | StringLeaf | ArrayNode<Value>;
    type Stmt<T> = OutputNode<T> | VarDeclNode<T> | AssignNode<T> | BlockNode<T> | IfNode<T> | WhileNode<T> | ForEachNode<T> | CallNode<T> | ReturnNode<T>;
    class FuncParam {
        readonly name: string;
        readonly type: Type;
        constructor(name: string, type: Type);
    }
    class FuncDecl<T> {
        readonly parameterArray: FuncParam[];
        readonly returnType: Type | null;
        readonly body: BlockNode<T>;
        constructor(parameterArray: FuncParam[], returnType: Type | null, body: BlockNode<T>);
    }
    type Program<T> = Env<FuncDecl<T>>;
    abstract class NameLeaf {
        readonly name: string;
        constructor(name: string);
    }
    abstract class ValueLeaf<V> {
        readonly value: V;
        constructor(value: V);
    }
    abstract class UnaryNode<T> {
        readonly subtree: T;
        constructor(subtree: T);
    }
    abstract class BinaryNode<T> {
        readonly leftSubtree: T;
        readonly rightSubtree: T;
        constructor(leftSubtree: T, rightSubtree: T);
    }
    class VarLeaf extends NameLeaf {
    }
    class InputLeaf {
        readonly inputType: Type;
        constructor(inputType: Type);
    }
    class NumLeaf extends ValueLeaf<number> {
    }
    class BoolLeaf extends ValueLeaf<boolean> {
    }
    class StringLeaf extends ValueLeaf<string> {
    }
    class ArrayNode<T> {
        readonly elementType: Type;
        readonly subtreeArray: T[];
        constructor(elementType: Type, subtreeArray: T[]);
    }
    function isValue(tree: unknown): tree is Value;
    class NegateNode<T> extends UnaryNode<T> {
    }
    class ToStringNode<T> extends UnaryNode<T> {
    }
    class PlusNode<T> extends BinaryNode<T> {
    }
    class TimesNode<T> extends BinaryNode<T> {
    }
    class AndNode<T> extends BinaryNode<T> {
    }
    class LessThanNode<T> extends BinaryNode<T> {
    }
    class EqualNode<T> extends BinaryNode<T> {
    }
    class GreaterThanNode<T> extends BinaryNode<T> {
    }
    class IndexNode<T> extends BinaryNode<T> {
    }
    class CallNode<T> {
        readonly funcName: string;
        readonly argArray: T[];
        constructor(funcName: string, argArray: T[]);
    }
    class ConditionalNode<T> {
        readonly conditionSubtree: T;
        readonly trueBranchSubtree: T;
        readonly falseBranchSubtree: T;
        constructor(conditionSubtree: T, trueBranchSubtree: T, falseBranchSubtree: T);
    }
    class OutputNode<T> extends UnaryNode<T> {
    }
    class VarDeclNode<T> extends UnaryNode<T> {
        readonly varName: string;
        readonly varType: Type;
        constructor(varName: string, varType: Type, subtree: T);
    }
    class AssignNode<T> extends UnaryNode<T> {
        readonly varName: string;
        constructor(varName: string, subtree: T);
    }
    class BlockNode<T> {
        readonly stmtArray: Stmt<T>[];
        constructor(stmtArray: Stmt<T>[]);
    }
    class IfNode<T> {
        readonly conditional: T;
        readonly trueBranch: Stmt<T>;
        readonly falseBranch: Stmt<T> | null;
        constructor(conditional: T, trueBranch: Stmt<T>, falseBranch: Stmt<T> | null);
    }
    class WhileNode<T> {
        readonly conditional: T;
        readonly body: Stmt<T>;
        constructor(conditional: T, body: Stmt<T>);
    }
    class ForEachNode<T> {
        readonly varName: string;
        readonly arrayExpr: T;
        readonly body: Stmt<T>;
        constructor(varName: string, arrayExpr: T, body: Stmt<T>);
    }
    class ReturnNode<T> {
        readonly returnExpr: T | null;
        constructor(returnExpr: T | null);
    }
    function exprToString(tree: Expr): string;
    function stmtToString(indentLevel: number, tree: Stmt<Expr>): string;
    function programToString(prog: Program<Expr>): string;
}
declare namespace Lab7 {
    class RuntimeError extends Error {
    }
    interface Runtime {
        input(type: Type): Promise<Value>;
        output(value: Value): void;
    }
    function evaluate(prog: Program<Expr>, env: Env<Value>, tree: Expr): Promise<Value>;
    function call(prog: Program<Expr>, env: Env<Value>, funcName: string, argArray: Expr[]): Promise<Value | null>;
    function execute(prog: Program<Expr>, env: Env<Value>, tree: Stmt<Expr>): Promise<void>;
    function run(prog: Program<Expr>): Promise<void>;
}
declare namespace Lab7 {
    class TypeError extends Error {
    }
    function inferExprType(prog: Program<Expr>, env: Env<Type>, tree: Expr): Type;
    function typecheckStmt(prog: Program<Expr>, env: Env<Type>, tree: Stmt<Expr>, expectedReturnType: Type | null): void;
    function inferCallReturnType(prog: Program<Expr>, env: Env<Type>, funcName: string, argArray: Expr[]): Type | null;
    function typecheckProg(prog: Program<Expr>): void;
}
declare namespace Lab7 {
    enum TokenSort {
        number = 0,
        string = 1,
        boolean = 2,
        keyword = 3,
        name = 4,
        paren = 5,
        bracket = 6,
        brace = 7,
        unaryOp = 8,
        binaryOp = 9
    }
    class Token {
        readonly sort: TokenSort;
        readonly text: string;
        constructor(sort: TokenSort, text: string);
        readonly toString: () => string;
    }
    class TokenizingError extends Error {
    }
    function tokenize(source: string): Token[];
    class ParseError extends Error {
    }
    class ConstLeaf extends NameLeaf {
    }
    class CommaNode<T> extends BinaryNode<T> {
    }
    class ConditionalNode1<T> extends BinaryNode<T> {
    }
    class ConditionalNode2<T> extends BinaryNode<T> {
    }
    type PreExpr1 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr1> | NegateNode<PreExpr1> | ToStringNode<PreExpr1> | PlusNode<PreExpr1> | TimesNode<PreExpr1> | AndNode<PreExpr1> | IndexNode<PreExpr1> | LessThanNode<PreExpr1> | EqualNode<PreExpr1> | GreaterThanNode<PreExpr1> | CallNode<PreExpr1> | CommaNode<PreExpr1> | ConditionalNode1<PreExpr1> | ConditionalNode2<PreExpr1>;
    const parseFuncDecl: (tokens: Token[]) => [string, FuncDecl<PreExpr2>, number];
    const parseProgram: (input: string) => Program<PreExpr2>;
    type PreExpr2 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr2> | NegateNode<PreExpr2> | ToStringNode<PreExpr2> | PlusNode<PreExpr2> | TimesNode<PreExpr2> | AndNode<PreExpr2> | IndexNode<PreExpr2> | LessThanNode<PreExpr2> | EqualNode<PreExpr2> | GreaterThanNode<PreExpr2> | CallNode<PreExpr2> | ConditionalNode<PreExpr2>;
    type PreExpr3 = ConstLeaf | VarLeaf | InputLeaf | NumLeaf | BoolLeaf | StringLeaf | ArrayNode<PreExpr3> | NegateNode<PreExpr3> | ToStringNode<PreExpr3> | PlusNode<PreExpr3> | TimesNode<PreExpr3> | AndNode<PreExpr3> | IndexNode<PreExpr3> | LessThanNode<PreExpr3> | EqualNode<PreExpr3> | CallNode<PreExpr3> | ConditionalNode<PreExpr3>;
    const parseCompleteExpr: (tokens: readonly Token[]) => PreExpr3;
    function expandExpr(env: Env<Value>, tree: PreExpr3): Expr;
    function expandStmt(env: Env<Value>, tree: Stmt<PreExpr3>): Stmt<Expr>;
    function expandProg(env: Env<Value>, prog: Program<PreExpr3>): Program<Expr>;
}
declare class ASTTreeElement extends HTMLElement {
    #private;
    constructor();
    render(): SVGGraphicsElement;
    connectedCallback(): void;
}
declare class ASTNodeElement extends ASTTreeElement {
    constructor();
    connectedCallback(): void;
}
declare function clearChildren(element: HTMLElement): void;
declare function render(list: StringList, listElement: HTMLOListElement | HTMLUListElement): void;
declare function update(list: StringList, listElement: HTMLOListElement | HTMLUListElement): void;
declare namespace Lab3 {
    export const update: () => void;
    type Parser<T> = (tokens: string[]) => [T, string[]] | null;
    export const parseParens: Parser<AST>;
    export const parseNegate: Parser<NegateNode>;
    export {};
}
declare namespace Lab4 {
    let tree: PreAST | null;
    const step1: () => void;
    const step2: (tree: PreAST) => void;
}
declare namespace Lab5 {
    const step1: () => void;
}
declare const oldWindowLoad6: (((this: GlobalEventHandlers, ev: Event) => any) & ((this: Window, ev: Event) => any)) | null;
declare namespace Lab6 {
    const step1: () => void;
    const step2: () => void;
    const step3: () => Promise<void>;
    let inputValue: Value | null;
    let inputType: Type | null;
    const runtime: Runtime;
    const submitInput: () => void;
}
declare const oldWindowLoad7: (((this: GlobalEventHandlers, ev: Event) => any) & ((this: Window, ev: Event) => any)) | null;
declare namespace Lab7 {
    const step1: () => void;
    const step2: () => void;
    const step3: () => Promise<void>;
    let inputValue: Value | null;
    let inputType: Type | null;
    const runtime: Runtime;
    const submitInput: () => void;
}
declare const oldWindowLoad8: (((this: GlobalEventHandlers, ev: Event) => any) & ((this: Window, ev: Event) => any)) | null;
declare namespace Lab8 {
    const updateAll: () => void;
}
declare const createElementSVG: <K extends keyof SVGElementTagNameMap>(tag: K) => SVGElementTagNameMap[K];
//# sourceMappingURL=bundle.d.ts.map