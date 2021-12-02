"use strict";
// A StringListNode has a head value and a possibly-empty tail list.
// Note that this is different than C++ terminology: the tail is
// *everything but the head element*, not just the last element.
class StringListNode {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
}
// Like in many languages, we write string[] for the type of arrays of strings.
// The StringList here is the function's return type.
function fromArray(array) {
    let list = null;
    // This special kind of for loop iterates over each element of an array,
    // assigning the name x to each one in sequence.
    for (const x of array)
        list = new StringListNode(x, list);
    return list;
}
// Concatenate all the strings in the list into a single string.
function concatenateAll(list) {
    if (list == null)
        return "";
    else
        return list.head + concatenateAll(list.tail); // + joins strings together
}
// Add some text to the front of each string in the list.
// Remember that we can't modify a list node after initialization,
// so instead we're returning a modified copy of the list.
function prependToEach(x, list) {
    if (list == null)
        return null;
    else
        return new StringListNode(x + list.head, prependToEach(x, list.tail));
}
// Append an element to the end of the list.
function appendLast(list, x) {
    if (list == null)
        return new StringListNode(x, null);
    else
        return new StringListNode(list.head, appendLast(list.tail, x));
}
// Reverse the list. (wrapper)
function reverse(list) {
    let newlist = null;
    return reverse_inner(newlist, list);
}
// Reverse the list.
function reverse_inner(newlist, list) {
    if (list == null) {
        return null;
    }
    newlist = reverse_inner(newlist, list.tail);
    if (newlist == null) {
        newlist = new StringListNode(list.head, null);
    }
    else {
        newlist = new StringListNode(newlist.head, appendLast(newlist.tail, list.head));
    }
    return newlist;
}
// Remove *every* occurrence of a string from the list.
function removeAll(x, list) {
    if (list == null) {
        return null;
    }
    if (list.head == x) {
        return removeAll(x, list.tail);
    }
    else {
        return new StringListNode(list.head, removeAll(x, list.tail));
    }
}
// Alternate elements between two lists.
function interleave(list1, list2) {
    if (list1 == null) {
        return list2;
    }
    if (list2 == null) {
        return list1;
    }
    return new StringListNode(list1.head, interleave(list2, list1.tail));
}
var Lab3;
(function (Lab3) {
    class NumLeaf {
        constructor(value) {
            this.value = value;
        }
    }
    Lab3.NumLeaf = NumLeaf;
    class PlusNode {
        constructor(leftSubtree, rightSubtree) {
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
        }
    }
    Lab3.PlusNode = PlusNode;
    class NegateNode {
        constructor(subtree) {
            this.subtree = subtree;
        }
    }
    Lab3.NegateNode = NegateNode;
    function interpret(tree) {
        if (tree instanceof PlusNode)
            return interpret(tree.leftSubtree) + interpret(tree.rightSubtree);
        else if (tree instanceof NegateNode)
            return -interpret(tree.subtree);
        else
            return tree.value;
    }
    Lab3.interpret = interpret;
    function astToString(tree) {
        if (tree instanceof NumLeaf)
            return tree.value.toString();
        else if (tree instanceof PlusNode)
            return "(" + astToString(tree.leftSubtree) + " + " + astToString(tree.rightSubtree) + ")";
        else
            return "(- " + astToString(tree.subtree) + ")";
    }
    Lab3.astToString = astToString;
    function nodeCount(tree) {
        if (tree instanceof NumLeaf)
            return 1;
        else if (tree instanceof NegateNode)
            return 1 + nodeCount(tree.subtree);
        else
            return 1 + nodeCount(tree.leftSubtree) + nodeCount(tree.rightSubtree);
    }
    Lab3.nodeCount = nodeCount;
    function leafCount(tree) {
        if (tree instanceof NumLeaf) {
            return 1;
        }
        else if (tree instanceof NegateNode) {
            return leafCount(tree.subtree);
        }
        else {
            return leafCount(tree.leftSubtree) + leafCount(tree.rightSubtree);
        }
    }
    Lab3.leafCount = leafCount;
    function maxNum(tree) {
        if (tree instanceof NumLeaf) {
            return tree.value;
        }
        else if (tree instanceof NegateNode) {
            return maxNum(tree.subtree);
        }
        else {
            return maxNum(tree.rightSubtree);
        }
    }
    Lab3.maxNum = maxNum;
    function doubleAllLeaves(tree) {
        if (tree instanceof NumLeaf) {
            return new NumLeaf(tree.value * 2);
        }
        else if (tree instanceof NegateNode) {
            return new NegateNode(doubleAllLeaves(tree.subtree));
        }
        else {
            return new PlusNode(doubleAllLeaves(tree.leftSubtree), doubleAllLeaves(tree.rightSubtree));
        }
    }
    Lab3.doubleAllLeaves = doubleAllLeaves;
    function removeAllNegations(tree) {
        if (tree instanceof NumLeaf) {
            return new NumLeaf(tree.value);
        }
        else if (tree instanceof NegateNode) {
            return removeAllNegations(tree.subtree);
        }
        else {
            return new PlusNode(removeAllNegations(tree.leftSubtree), removeAllNegations(tree.rightSubtree));
        }
    }
    Lab3.removeAllNegations = removeAllNegations;
})(Lab3 || (Lab3 = {}));
var Lab4;
(function (Lab4) {
    class ConstLeaf {
        constructor(name) {
            this.name = name;
        }
    }
    Lab4.ConstLeaf = ConstLeaf;
    class Leaf {
        constructor(value) {
            this.value = value;
        }
    }
    Lab4.Leaf = Leaf;
    class UnaryNode {
        constructor(subtree) {
            this.subtree = subtree;
        }
    }
    Lab4.UnaryNode = UnaryNode;
    class BinaryNode {
        constructor(leftSubtree, rightSubtree) {
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
        }
    }
    Lab4.BinaryNode = BinaryNode;
    class NumLeaf extends Leaf {
    }
    Lab4.NumLeaf = NumLeaf;
    class BoolLeaf extends Leaf {
    }
    Lab4.BoolLeaf = BoolLeaf;
    class StringLeaf extends Leaf {
    }
    Lab4.StringLeaf = StringLeaf;
    class NegateNode extends UnaryNode {
    }
    Lab4.NegateNode = NegateNode;
    class ToStringNode extends UnaryNode {
    }
    Lab4.ToStringNode = ToStringNode;
    class PlusNode extends BinaryNode {
    }
    Lab4.PlusNode = PlusNode;
    class TimesNode extends BinaryNode {
    }
    Lab4.TimesNode = TimesNode;
    class AndNode extends BinaryNode {
    }
    Lab4.AndNode = AndNode;
    class LessThanNode extends BinaryNode {
    }
    Lab4.LessThanNode = LessThanNode;
    class ConditionalNode {
        constructor(conditionSubtree, trueBranchSubtree, falseBranchSubtree) {
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
        }
    }
    Lab4.ConditionalNode = ConditionalNode;
    function astToString(tree) {
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
    Lab4.astToString = astToString;
    function expandNamedConstants(env, tree) {
        if (tree instanceof ConstLeaf)
            return env.lookup(tree.name);
        else if (tree instanceof NegateNode)
            return new NegateNode(expandNamedConstants(env, tree.subtree));
        else if (tree instanceof ToStringNode)
            return new ToStringNode(expandNamedConstants(env, tree.subtree));
        else if (tree instanceof PlusNode)
            return new PlusNode(expandNamedConstants(env, tree.leftSubtree), expandNamedConstants(env, tree.rightSubtree));
        else if (tree instanceof TimesNode)
            return new TimesNode(expandNamedConstants(env, tree.leftSubtree), expandNamedConstants(env, tree.rightSubtree));
        else if (tree instanceof AndNode)
            return new AndNode(expandNamedConstants(env, tree.leftSubtree), expandNamedConstants(env, tree.rightSubtree));
        else if (tree instanceof LessThanNode)
            return new LessThanNode(expandNamedConstants(env, tree.leftSubtree), expandNamedConstants(env, tree.rightSubtree));
        else if (tree instanceof ConditionalNode)
            return new ConditionalNode(expandNamedConstants(env, tree.conditionSubtree), expandNamedConstants(env, tree.trueBranchSubtree), expandNamedConstants(env, tree.falseBranchSubtree));
        else
            return tree;
    }
    Lab4.expandNamedConstants = expandNamedConstants;
    class InterpreterError extends Error {
    }
    Lab4.InterpreterError = InterpreterError;
    function interpret(tree) {
        if (tree instanceof NegateNode) {
            const result = interpret(tree.subtree);
            if (result instanceof NumLeaf)
                return new NumLeaf(-result.value);
            else if (result instanceof BoolLeaf)
                return new BoolLeaf(!result.value);
            else
                return new StringLeaf(result.value.split("").reverse().join("")); // reverse string
        }
        else if (tree instanceof ToStringNode) {
            const result = interpret(tree.subtree);
            if (result instanceof NumLeaf || result instanceof BoolLeaf)
                return new StringLeaf(result.value.toString());
            else
                throw new InterpreterError("invalid use of @ operator with operand " +
                    astToString(result));
        }
        else if (tree instanceof PlusNode) {
            const leftResult = interpret(tree.leftSubtree);
            const rightResult = interpret(tree.rightSubtree);
            if (leftResult instanceof StringLeaf && rightResult instanceof StringLeaf)
                return new StringLeaf(leftResult.value + rightResult.value);
            else if (leftResult instanceof NumLeaf && rightResult instanceof NumLeaf)
                return new NumLeaf(leftResult.value + rightResult.value);
            else
                throw new InterpreterError("invalid use of + operator with left operand " +
                    astToString(leftResult) +
                    " and right operand " +
                    astToString(rightResult));
        }
        else if (tree instanceof TimesNode) {
            const leftResult = interpret(tree.leftSubtree);
            const rightResult = interpret(tree.rightSubtree);
            if (leftResult instanceof NumLeaf && rightResult instanceof NumLeaf)
                return new NumLeaf(leftResult.value * rightResult.value);
            else if (leftResult instanceof NumLeaf && rightResult instanceof StringLeaf) {
                if (leftResult.value >= 0 && Number.isInteger(leftResult.value) == true) {
                    let x = "";
                    let i;
                    for (i = 0; i < leftResult.value; ++i) {
                        x = x + rightResult.value;
                    }
                    return new StringLeaf(x);
                }
                else {
                    throw new InterpreterError("invalid use of * operator with left operand " +
                        astToString(leftResult) +
                        " and right operand " +
                        astToString(rightResult));
                }
            }
            else
                throw new InterpreterError("invalid use of * operator with left operand " +
                    astToString(leftResult) +
                    " and right operand " +
                    astToString(rightResult));
        }
        else if (tree instanceof AndNode) {
            const leftResult = interpret(tree.leftSubtree);
            const rightResult = interpret(tree.rightSubtree);
            if (leftResult instanceof BoolLeaf && rightResult instanceof BoolLeaf)
                return new BoolLeaf(leftResult.value && rightResult.value);
            else
                throw new InterpreterError("invalid use of & operator with left operand " +
                    astToString(leftResult) +
                    " and right operand " +
                    astToString(rightResult));
        }
        else if (tree instanceof LessThanNode) {
            const leftResult = interpret(tree.leftSubtree);
            const rightResult = interpret(tree.rightSubtree);
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
                throw new InterpreterError("invalid use of < operator with left operand " +
                    astToString(leftResult) +
                    " and right operand " +
                    astToString(rightResult));
            }
        }
        else if (tree instanceof ConditionalNode) {
            const conditionResult = interpret(tree.conditionSubtree);
            if (conditionResult instanceof BoolLeaf) {
                if (conditionResult.value)
                    return interpret(tree.trueBranchSubtree);
                else
                    return interpret(tree.falseBranchSubtree);
            }
            else
                throw new InterpreterError("invalid use of ?: operator with first operand " +
                    astToString(conditionResult));
        }
        else // tree instanceof Value
            return tree;
    }
    Lab4.interpret = interpret;
    function removeDoubleNegations(tree) {
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
    Lab4.removeDoubleNegations = removeDoubleNegations;
})(Lab4 || (Lab4 = {}));
var Lab5;
(function (Lab5) {
    let TokenSort;
    (function (TokenSort) {
        TokenSort[TokenSort["number"] = 0] = "number";
        TokenSort[TokenSort["string"] = 1] = "string";
        TokenSort[TokenSort["boolean"] = 2] = "boolean";
        TokenSort[TokenSort["constant"] = 3] = "constant";
        TokenSort[TokenSort["variable"] = 4] = "variable";
        TokenSort[TokenSort["symbol"] = 5] = "symbol";
    })(TokenSort = Lab5.TokenSort || (Lab5.TokenSort = {}));
    class TokenPattern {
        constructor(sort, regexp) {
            this.sort = sort;
            this.regexp = regexp;
        }
    }
    // modify this definition
    const tokenPatterns = [
        new TokenPattern(TokenSort.number, /^\d+(?:\.\d+)?/),
        new TokenPattern(TokenSort.string, /^"[^"]*?"/),
        new TokenPattern(TokenSort.boolean, /^(?:true|false)/),
        new TokenPattern(TokenSort.constant, /^[A-Z][A-Z_]*/),
        new TokenPattern(TokenSort.symbol, /^[<=>&*?:()@+-]/),
        new TokenPattern(TokenSort.variable, /^[a-z_][a-z_0-9]*/)
    ];
    class Token {
        constructor(sort, text) {
            this.sort = sort;
            this.text = text;
        }
    }
    Lab5.Token = Token;
    class TokenListNode {
        constructor(head, tail) {
            this.head = head;
            this.tail = tail;
        }
    }
    function tokenListToString(tokens) {
        if (tokens == null)
            return "";
        return (TokenSort[tokens.head.sort] + "('" + tokens.head.text + "')" +
            (tokens.tail == null ?
                "" :
                ", " + tokenListToString(tokens.tail)));
    }
    Lab5.tokenListToString = tokenListToString;
    class TokenizingError extends Error {
    }
    Lab5.TokenizingError = TokenizingError;
    function tokenize(source) {
        // remove all whitespace from start of input
        const trimmed = source.trimStart();
        // return empty list for empty input
        if (trimmed == "")
            return null;
        // try each pattern to find first match, if any
        for (const pattern of tokenPatterns) {
            // RegExpMatchArray contains match data in success case
            const match = trimmed.match(pattern.regexp);
            if (match == null)
                continue; // match failed
            // extract matched text (safe because match succeeded)
            const tokenText = match[0];
            // construct the token that was just matched
            const token = new Token(pattern.sort, tokenText.trimEnd());
            // remove the token text from the start of the input
            const restOfInput = trimmed.slice(tokenText.length);
            // tokenize the rest of the input
            const restOfTokens = tokenize(restOfInput);
            // add the matched token to the token list
            return new TokenListNode(token, restOfTokens);
        }
        // all patterns failed
        throw new TokenizingError("leftover input: " + source);
    }
    Lab5.tokenize = tokenize;
    class NameLeaf {
        constructor(name) {
            this.name = name;
        }
    }
    Lab5.NameLeaf = NameLeaf;
    class ValueLeaf {
        constructor(value) {
            this.value = value;
        }
    }
    Lab5.ValueLeaf = ValueLeaf;
    class UnaryNode {
        constructor(subtree) {
            this.subtree = subtree;
        }
    }
    Lab5.UnaryNode = UnaryNode;
    class BinaryNode {
        constructor(leftSubtree, rightSubtree) {
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
        }
    }
    Lab5.BinaryNode = BinaryNode;
    class VarLeaf extends NameLeaf {
    }
    Lab5.VarLeaf = VarLeaf;
    class ConstLeaf extends NameLeaf {
    }
    Lab5.ConstLeaf = ConstLeaf;
    class NumLeaf extends ValueLeaf {
    }
    Lab5.NumLeaf = NumLeaf;
    class BoolLeaf extends ValueLeaf {
    }
    Lab5.BoolLeaf = BoolLeaf;
    class StringLeaf extends ValueLeaf {
    }
    Lab5.StringLeaf = StringLeaf;
    class NegateNode extends UnaryNode {
    }
    Lab5.NegateNode = NegateNode;
    class ToStringNode extends UnaryNode {
    }
    Lab5.ToStringNode = ToStringNode;
    class PlusNode extends BinaryNode {
    }
    Lab5.PlusNode = PlusNode;
    class TimesNode extends BinaryNode {
    }
    Lab5.TimesNode = TimesNode;
    class AndNode extends BinaryNode {
    }
    Lab5.AndNode = AndNode;
    class LessThanNode extends BinaryNode {
    }
    Lab5.LessThanNode = LessThanNode;
    class EqualNode extends BinaryNode {
    }
    Lab5.EqualNode = EqualNode;
    class GreaterThanNode extends BinaryNode {
    }
    Lab5.GreaterThanNode = GreaterThanNode;
    class ConditionalNode {
        constructor(conditionSubtree, trueBranchSubtree, falseBranchSubtree) {
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
        }
    }
    Lab5.ConditionalNode = ConditionalNode;
    function astToString(tree) {
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
    Lab5.astToString = astToString;
    class ParsingError extends Error {
    }
    Lab5.ParsingError = ParsingError;
    class ParseResult {
        constructor(tree, remainingTokens) {
            this.tree = tree;
            this.remainingTokens = remainingTokens;
        }
    }
    function parse(tokens) {
        const parseResult = parsePreAST(tokens);
        if (parseResult == null)
            throw new ParsingError("all possibilities failed");
        if (parseResult.remainingTokens != null)
            throw new ParsingError("leftover tokens after parsing: " +
                tokenListToString(parseResult.remainingTokens));
        return parseResult.tree;
    }
    Lab5.parse = parse;
    function parsePreAST(tokens) {
        return parsePrecedence0(tokens);
    }
    function parsePrecedence0(tokens) {
        var _a;
        return ((_a = parseEqual(tokens)) !== null && _a !== void 0 ? _a : parsePrecedence1(tokens));
    }
    Lab5.parsePrecedence0 = parsePrecedence0;
    function parseEqual(tokens) {
        const parsedLeftSubtree = parsePrecedence1(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "=")
            return null;
        const parsedRightSubtree = parsePrecedence0(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new EqualNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence1(tokens) {
        var _a;
        return ((_a = parseConditional(tokens)) !== null && _a !== void 0 ? _a : parsePrecedence2(tokens));
    }
    Lab5.parsePrecedence1 = parsePrecedence1;
    function parseConditional(tokens) {
        const parsedLeftSubtree = parsePrecedence2(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "?")
            return null;
        const parsedMiddleSubtree = parsePrecedence1(tokensAfterLeftOperand.tail);
        if (parsedMiddleSubtree == null)
            return null;
        const tokensAfterMiddleOperand = parsedMiddleSubtree.remainingTokens;
        if (tokensAfterMiddleOperand == null)
            return null;
        if (tokensAfterMiddleOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterMiddleOperand.head.text != ":")
            return null;
        const parsedRightSubtree = parsePrecedence1(tokensAfterMiddleOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new ConditionalNode(parsedLeftSubtree.tree, parsedMiddleSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence2(tokens) {
        var _a;
        return ((_a = parseAnd(tokens)) !== null && _a !== void 0 ? _a : parsePrecedence3(tokens));
    }
    Lab5.parsePrecedence2 = parsePrecedence2;
    function parseAnd(tokens) {
        const parsedLeftSubtree = parsePrecedence3(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "&")
            return null;
        const parsedRightSubtree = parsePrecedence2(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new AndNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence3(tokens) {
        var _a, _b;
        return ((_b = (_a = parseLessThan(tokens)) !== null && _a !== void 0 ? _a : parseGreaterThan(tokens)) !== null && _b !== void 0 ? _b : parsePrecedence4(tokens));
    }
    Lab5.parsePrecedence3 = parsePrecedence3;
    function parseLessThan(tokens) {
        const parsedLeftSubtree = parsePrecedence4(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "<")
            return null;
        const parsedRightSubtree = parsePrecedence3(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new LessThanNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parseGreaterThan(tokens) {
        const parsedLeftSubtree = parsePrecedence4(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != ">")
            return null;
        const parsedRightSubtree = parsePrecedence3(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new GreaterThanNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence4(tokens) {
        var _a;
        return ((_a = parsePlus(tokens)) !== null && _a !== void 0 ? _a : parsePrecedence5(tokens));
    }
    Lab5.parsePrecedence4 = parsePrecedence4;
    function parsePlus(tokens) {
        const parsedLeftSubtree = parsePrecedence5(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "+")
            return null;
        const parsedRightSubtree = parsePrecedence4(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new PlusNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence5(tokens) {
        var _a;
        return ((_a = parseTimes(tokens)) !== null && _a !== void 0 ? _a : parsePrecedence6(tokens));
    }
    function parseTimes(tokens) {
        const parsedLeftSubtree = parsePrecedence6(tokens);
        if (parsedLeftSubtree == null)
            return null;
        const tokensAfterLeftOperand = parsedLeftSubtree.remainingTokens;
        if (tokensAfterLeftOperand == null)
            return null;
        if (tokensAfterLeftOperand.head.sort != TokenSort.symbol)
            return null;
        if (tokensAfterLeftOperand.head.text != "*")
            return null;
        const parsedRightSubtree = parsePrecedence5(tokensAfterLeftOperand.tail);
        if (parsedRightSubtree == null)
            return null;
        return new ParseResult(new TimesNode(parsedLeftSubtree.tree, parsedRightSubtree.tree), parsedRightSubtree.remainingTokens);
    }
    function parsePrecedence6(tokens) {
        var _a, _b;
        return ((_b = (_a = parseNegate(tokens)) !== null && _a !== void 0 ? _a : parseToString(tokens)) !== null && _b !== void 0 ? _b : parseAtom(tokens));
    }
    function parseNegate(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.symbol)
            return null;
        if (tokens.head.text != "-")
            return null;
        const parsedSubtree = parsePreAST(tokens.tail);
        if (parsedSubtree == null)
            return null;
        return new ParseResult(new NegateNode(parsedSubtree.tree), parsedSubtree.remainingTokens);
    }
    function parseToString(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.symbol)
            return null;
        if (tokens.head.text != "@")
            return null;
        const parsedSubtree = parsePreAST(tokens.tail);
        if (parsedSubtree == null)
            return null;
        return new ParseResult(new ToStringNode(parsedSubtree.tree), parsedSubtree.remainingTokens);
    }
    function parseAtom(tokens) {
        var _a, _b, _c, _d, _e;
        return ((_e = (_d = (_c = (_b = (_a = parseNum(tokens)) !== null && _a !== void 0 ? _a : parseString(tokens)) !== null && _b !== void 0 ? _b : parseBool(tokens)) !== null && _c !== void 0 ? _c : parseConst(tokens)) !== null && _d !== void 0 ? _d : parseVar(tokens)) !== null && _e !== void 0 ? _e : parseParens(tokens));
    }
    function parseNum(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.number)
            return null;
        const value = parseFloat(tokens.head.text);
        if (!isFinite(value))
            return null;
        return new ParseResult(new NumLeaf(value), tokens.tail);
    }
    function parseString(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.string)
            return null;
        const value = tokens.head.text.slice(1, -1);
        return new ParseResult(new StringLeaf(value), tokens.tail);
    }
    function parseBool(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.boolean)
            return null;
        const value = tokens.head.text == "true" ? true : false;
        return new ParseResult(new BoolLeaf(value), tokens.tail);
    }
    function parseConst(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.constant)
            return null;
        const name = tokens.head.text;
        return new ParseResult(new ConstLeaf(name), tokens.tail);
    }
    function parseVar(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.variable)
            return null;
        const name = tokens.head.text;
        return new ParseResult(new VarLeaf(name), tokens.tail);
    }
    function parseParens(tokens) {
        if (tokens == null)
            return null;
        if (tokens.head.sort != TokenSort.symbol)
            return null;
        if (tokens.head.text != "(")
            return null;
        const result = parsePrecedence0(tokens.tail);
        if (result == null || result.remainingTokens == null)
            return null;
        if (result.remainingTokens.head.sort != TokenSort.symbol)
            return null;
        if (result.remainingTokens.head.text != ")")
            return null;
        return new ParseResult(result.tree, result.remainingTokens.tail);
    }
    function desugar(tree) {
        if (tree instanceof ValueLeaf || tree instanceof NameLeaf)
            return tree;
        else if (tree instanceof NegateNode)
            return new NegateNode(desugar(tree.subtree));
        else if (tree instanceof ToStringNode)
            return new ToStringNode(desugar(tree.subtree));
        else if (tree instanceof PlusNode)
            return new PlusNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof TimesNode)
            return new TimesNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof AndNode)
            return new ConditionalNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree), desugar(new BoolLeaf(false)));
        else if (tree instanceof LessThanNode)
            return new LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof EqualNode)
            return new EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof GreaterThanNode)
            return new GreaterThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else // if (tree instanceof ConditionalNode)
            return new ConditionalNode(desugar(tree.conditionSubtree), desugar(tree.trueBranchSubtree), desugar(tree.falseBranchSubtree));
    }
    Lab5.desugar = desugar;
})(Lab5 || (Lab5 = {}));
var Lab8;
(function (Lab8) {
    class ListNode {
        constructor(head, tail) {
            this.head = head;
            this.tail = tail;
            this.head = head;
            this.tail = tail;
        }
    }
    Lab8.ListNode = ListNode;
    // fromArray([0,1,2]) =
    //   new ListNode(0, new ListNode(1, new ListNode(2, null)))
    function fromArray(array) {
        let list = null;
        const elems = Array.from(array); // copy array
        // pop removes an element from the end of an array
        for (let elem = elems.pop(); elem != null; elem = elems.pop())
            list = new ListNode(elem, list);
        return list;
    }
    Lab8.fromArray = fromArray;
    // iterativeSum(fromArray([0,1,2,3])) =
    //   ((0 + 1) + 2) + 3
    function iterativeSum(list) {
        let total = 0;
        while (list != null) {
            total += list.head;
            list = list.tail;
        }
        return total;
    }
    Lab8.iterativeSum = iterativeSum;
    // recursiveSum(fromArray([0,1,2,3])) =
    //   0 + (1 + (2 + 3))
    function recursiveSum(list) {
        if (list == null)
            return 0;
        else
            return list.head + recursiveSum(list.tail);
    }
    Lab8.recursiveSum = recursiveSum;
    // maximum(fromArray([0,1,2,3])) =
    //   max(max(max(max(-Infinity, 0), 1), 2), 3)
    function maximum(list) {
        let max = -Infinity; // this is a valid floating-point value!
        while (list != null) {
            max = Math.max(list.head, max);
            list = list.tail;
        }
        return max;
    }
    Lab8.maximum = maximum;
    // concatenate(fromArray([0,1,2]), list2) =
    //   new ListNode(0, new ListNode(1, new ListNode(2, list2)))
    function concatenateRecursive(list1, list2) {
        if (list1 == null)
            return list2;
        else
            return new ListNode(list1.head, concatenateRecursive(list1.tail, list2));
    }
    Lab8.concatenateRecursive = concatenateRecursive;
    // foldLeft(fromArray([0,1,2,3]), acc, f) =
    //   f(f(f(f(acc, 0), 1), 2), 3)
    function foldLeft(list, initialAccumulatorValue, accumulatingFunc) {
        let accumulator = initialAccumulatorValue;
        while (list != null) {
            accumulator = accumulatingFunc(list.head, accumulator);
            list = list.tail;
        }
        return accumulator;
    }
    Lab8.foldLeft = foldLeft;
    // foldRight(fromArray([0,1,2,3]), acc, f) =
    //   f(0, f(1, f(2, f(3, acc))))
    function foldRight(list, initialAccumulatorValue, accumulatingFunc) {
        if (list == null)
            return initialAccumulatorValue;
        else {
            const accumulator = foldRight(list.tail, initialAccumulatorValue, accumulatingFunc);
            return accumulatingFunc(list.head, accumulator);
        }
    }
    Lab8.foldRight = foldRight;
    function add(x, y) {
        return x + y;
    }
    function sumByFoldLeft(list) {
        return foldLeft(list, 0, add);
    }
    Lab8.sumByFoldLeft = sumByFoldLeft;
    function maximumByFoldRight(list) {
        return foldRight(list, -Infinity, function (elem, max) {
            return Math.max(elem, max);
        });
    }
    Lab8.maximumByFoldRight = maximumByFoldRight;
    function subtractByFoldLeft(list) {
        return foldLeft(list, 0, function (x, y) {
            return x - y;
        });
    }
    Lab8.subtractByFoldLeft = subtractByFoldLeft;
    function subtractByFoldRight(list) {
        return foldRight(list, 0, function (x, y) {
            return x - y;
        });
    }
    Lab8.subtractByFoldRight = subtractByFoldRight;
    function anyEqualTo(lookingFor, list) {
        return foldLeft(list, false, function (x, y) {
            if (x == lookingFor)
                y = true;
            return y;
        });
    }
    Lab8.anyEqualTo = anyEqualTo;
    function concatenate(list1, list2) {
        return foldRight(list1, list2, function (x, y) {
            return new ListNode(x, y);
        });
    }
    Lab8.concatenate = concatenate;
    function removeAll(lookingFor, list) {
        return foldRight(list, null, function (x, y) {
            if (x == lookingFor) {
                return y;
            }
            else {
                return new ListNode(x, y);
            }
        });
    }
    Lab8.removeAll = removeAll;
})(Lab8 || (Lab8 = {}));
var Lab6;
(function (Lab6) {
    let AtomicType;
    (function (AtomicType) {
        AtomicType["number"] = "number";
        AtomicType["boolean"] = "boolean";
        AtomicType["string"] = "string";
    })(AtomicType = Lab6.AtomicType || (Lab6.AtomicType = {}));
    class ArrayType {
        constructor(elementType) {
            this.elementType = elementType;
            this.elementType = elementType;
        }
    }
    Lab6.ArrayType = ArrayType;
    function isAtomicType(type) {
        return !(type instanceof ArrayType);
    }
    Lab6.isAtomicType = isAtomicType;
    function typeToString(type) {
        if (type instanceof ArrayType)
            return "[]" + typeToString(type.elementType);
        else // if (isAtomic(type))
            return type;
    }
    Lab6.typeToString = typeToString;
    function equalTypes(type1, type2) {
        if (isAtomicType(type1) && isAtomicType(type2))
            return type1 == type2;
        else if (type1 instanceof ArrayType && type2 instanceof ArrayType)
            return equalTypes(type1.elementType, type2.elementType);
        else
            return false;
    }
    Lab6.equalTypes = equalTypes;
    class NameLeaf {
        constructor(name) {
            this.name = name;
            this.name = name;
        }
    }
    Lab6.NameLeaf = NameLeaf;
    class ValueLeaf {
        constructor(value) {
            this.value = value;
            this.value = value;
        }
    }
    Lab6.ValueLeaf = ValueLeaf;
    class UnaryNode {
        constructor(subtree) {
            this.subtree = subtree;
            this.subtree = subtree;
        }
    }
    Lab6.UnaryNode = UnaryNode;
    class BinaryNode {
        constructor(leftSubtree, rightSubtree) {
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
        }
    }
    Lab6.BinaryNode = BinaryNode;
    class VarLeaf extends NameLeaf {
    }
    Lab6.VarLeaf = VarLeaf;
    class InputLeaf {
        constructor(inputType) {
            this.inputType = inputType;
            this.inputType = inputType;
        }
    }
    Lab6.InputLeaf = InputLeaf;
    class NumLeaf extends ValueLeaf {
    }
    Lab6.NumLeaf = NumLeaf;
    class BoolLeaf extends ValueLeaf {
    }
    Lab6.BoolLeaf = BoolLeaf;
    class StringLeaf extends ValueLeaf {
    }
    Lab6.StringLeaf = StringLeaf;
    class ArrayNode {
        constructor(elementType, subtreeArray) {
            this.elementType = elementType;
            this.subtreeArray = subtreeArray;
            this.elementType = elementType;
            this.subtreeArray = subtreeArray;
        }
    }
    Lab6.ArrayNode = ArrayNode;
    function isValue(tree) {
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
        }
        else
            return false;
    }
    Lab6.isValue = isValue;
    class NegateNode extends UnaryNode {
    }
    Lab6.NegateNode = NegateNode;
    class ToStringNode extends UnaryNode {
    }
    Lab6.ToStringNode = ToStringNode;
    class PlusNode extends BinaryNode {
    }
    Lab6.PlusNode = PlusNode;
    class TimesNode extends BinaryNode {
    }
    Lab6.TimesNode = TimesNode;
    class AndNode extends BinaryNode {
    }
    Lab6.AndNode = AndNode;
    class LessThanNode extends BinaryNode {
    }
    Lab6.LessThanNode = LessThanNode;
    class EqualNode extends BinaryNode {
    }
    Lab6.EqualNode = EqualNode;
    class GreaterThanNode extends BinaryNode {
    }
    Lab6.GreaterThanNode = GreaterThanNode;
    class IndexNode extends BinaryNode {
    }
    Lab6.IndexNode = IndexNode;
    class ConditionalNode {
        constructor(conditionSubtree, trueBranchSubtree, falseBranchSubtree) {
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
        }
    }
    Lab6.ConditionalNode = ConditionalNode;
    class OutputNode extends UnaryNode {
    }
    Lab6.OutputNode = OutputNode;
    class VarDeclNode extends UnaryNode {
        constructor(varName, varType, subtree) {
            super(subtree);
            this.varName = varName;
            this.varType = varType;
            this.varName = varName;
            this.varType = varType;
        }
    }
    Lab6.VarDeclNode = VarDeclNode;
    class AssignNode extends UnaryNode {
        constructor(varName, subtree) {
            super(subtree);
            this.varName = varName;
            this.varName = varName;
        }
    }
    Lab6.AssignNode = AssignNode;
    function exprToString(tree) {
        if (tree instanceof StringLeaf)
            return "\"" + tree.value + "\"";
        else if (tree instanceof NameLeaf)
            return tree.name;
        else if (tree instanceof InputLeaf)
            return "input(" + typeToString(tree.inputType) + ")";
        else if (tree instanceof ArrayNode)
            return (typeToString(tree.elementType) + "[" +
                tree.subtreeArray.map(exprToString).join(", ") + "]");
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
    Lab6.exprToString = exprToString;
    function stmtToString(tree) {
        if (tree instanceof OutputNode)
            return "output(" + exprToString(tree.subtree) + ")";
        else if (tree instanceof VarDeclNode)
            return "var " + tree.varName + ": " + typeToString(tree.varType) + " <- " + exprToString(tree.subtree);
        else // tree instanceof AssignNode
            return tree.varName + " <- " + exprToString(tree.subtree);
    }
    Lab6.stmtToString = stmtToString;
    function programToString(prog) {
        let output = "";
        for (const stmt of prog)
            output += stmtToString(stmt) + ";\n";
        return output;
    }
    Lab6.programToString = programToString;
})(Lab6 || (Lab6 = {}));
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Lab6;
(function (Lab6) {
    function equalValues(val1, val2) {
        if (val1 instanceof Lab6.NumLeaf && val2 instanceof Lab6.NumLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab6.BoolLeaf && val2 instanceof Lab6.BoolLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab6.StringLeaf && val2 instanceof Lab6.StringLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab6.ArrayNode && val2 instanceof Lab6.ArrayNode) {
            if (val1.subtreeArray.length != val2.subtreeArray.length)
                return false;
            for (const [index, val] of val1.subtreeArray.entries())
                if (!equalValues(val, val2.subtreeArray[index]))
                    return false;
            return true;
        }
        else
            return false;
    }
    class RuntimeError extends Error {
    }
    Lab6.RuntimeError = RuntimeError;
    // defined in lib/lab6.ts:
    // export const runtime: Runtime = ...;
    function evaluate(env, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tree instanceof Lab6.VarLeaf) {
                const variableType = env.get(tree.name);
                if (variableType != null)
                    return variableType;
                else
                    throw new RuntimeError("undefined variable " + tree.name);
            }
            else if (tree instanceof Lab6.InputLeaf)
                return yield Lab6.runtime.input(tree.inputType);
            else if (tree instanceof Lab6.ValueLeaf)
                return tree;
            else if (tree instanceof Lab6.ArrayNode) {
                const valueArray = new Array(tree.subtreeArray.length);
                for (const [index, subtree] of tree.subtreeArray.entries())
                    valueArray[index] = yield evaluate(env, subtree);
                return new Lab6.ArrayNode(tree.elementType, valueArray);
            }
            else if (tree instanceof Lab6.NegateNode) {
                const subtreeValue = yield evaluate(env, tree.subtree);
                if (subtreeValue instanceof Lab6.NumLeaf)
                    return new Lab6.NumLeaf(-subtreeValue.value);
                else if (subtreeValue instanceof Lab6.BoolLeaf)
                    return new Lab6.BoolLeaf(!subtreeValue.value);
                else if (subtreeValue instanceof Lab6.StringLeaf)
                    return new Lab6.StringLeaf(subtreeValue.value.split('').reverse().join(''));
                else // subtreeValue instanceof ArrayNode<Value>
                    return new Lab6.ArrayNode(subtreeValue.elementType, subtreeValue.subtreeArray.reverse());
            }
            else if (tree instanceof Lab6.ToStringNode) {
                const subtreeValue = yield evaluate(env, tree.subtree);
                return new Lab6.StringLeaf(Lab6.exprToString(subtreeValue));
            }
            else if (tree instanceof Lab6.PlusNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab6.NumLeaf && rightSubtreeValue instanceof Lab6.NumLeaf)
                    return new Lab6.NumLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
                else if (leftSubtreeValue instanceof Lab6.StringLeaf && rightSubtreeValue instanceof Lab6.StringLeaf)
                    return new Lab6.StringLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
                else if (leftSubtreeValue instanceof Lab6.ArrayNode && rightSubtreeValue instanceof Lab6.ArrayNode)
                    return new Lab6.ArrayNode(leftSubtreeValue.elementType, leftSubtreeValue.subtreeArray.concat(rightSubtreeValue.subtreeArray));
                else
                    throw new RuntimeError("can't add values " +
                        Lab6.exprToString(leftSubtreeValue) + " and " +
                        Lab6.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab6.TimesNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab6.NumLeaf && rightSubtreeValue instanceof Lab6.NumLeaf)
                    return new Lab6.NumLeaf(leftSubtreeValue.value * rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't multiply values " +
                        Lab6.exprToString(leftSubtreeValue) + " and " +
                        Lab6.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab6.AndNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab6.BoolLeaf && rightSubtreeValue instanceof Lab6.BoolLeaf)
                    return new Lab6.BoolLeaf(leftSubtreeValue.value && rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't AND values " +
                        Lab6.exprToString(leftSubtreeValue) + " and " +
                        Lab6.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab6.LessThanNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab6.NumLeaf && rightSubtreeValue instanceof Lab6.NumLeaf)
                    return new Lab6.BoolLeaf(leftSubtreeValue.value < rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't compare (<) values " +
                        Lab6.exprToString(leftSubtreeValue) + " and " +
                        Lab6.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab6.EqualNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                return new Lab6.BoolLeaf(equalValues(leftSubtreeValue, rightSubtreeValue));
            }
            else if (tree instanceof Lab6.IndexNode) {
                const leftSubtreeValue = yield evaluate(env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab6.ArrayNode && rightSubtreeValue instanceof Lab6.NumLeaf) {
                    const elementValue = leftSubtreeValue.subtreeArray[rightSubtreeValue.value];
                    if (elementValue != null)
                        return elementValue;
                    else
                        throw new RuntimeError("index " + Lab6.exprToString(rightSubtreeValue) +
                            " is out of bounds in " + Lab6.exprToString(leftSubtreeValue));
                }
                else
                    throw new RuntimeError("can't index with values " +
                        Lab6.exprToString(leftSubtreeValue) + " and " +
                        Lab6.exprToString(rightSubtreeValue));
            }
            else { // if (tree instanceof ConditionalNode)
                const conditionSubtreeValue = yield evaluate(env, tree.conditionSubtree);
                const trueSubtreeValue = yield evaluate(env, tree.trueBranchSubtree);
                const falseSubtreeValue = yield evaluate(env, tree.falseBranchSubtree);
                if (conditionSubtreeValue instanceof Lab6.BoolLeaf)
                    return conditionSubtreeValue.value ? trueSubtreeValue : falseSubtreeValue;
                else
                    throw new RuntimeError("can't evaluate conditional with value " +
                        Lab6.exprToString(conditionSubtreeValue));
            }
        });
    }
    Lab6.evaluate = evaluate;
    function execute(env, stmt) {
        return __awaiter(this, void 0, void 0, function* () {
            const subtreeValue = yield evaluate(env, stmt.subtree);
            if (stmt instanceof Lab6.OutputNode)
                Lab6.runtime.output(subtreeValue);
            else if (stmt instanceof Lab6.VarDeclNode)
                env.set(stmt.varName, subtreeValue);
            else { // stmt instanceof AssignNode
                if (env.has(stmt.varName))
                    env.set(stmt.varName, subtreeValue);
                else
                    throw new RuntimeError("assignment to undeclared variable " + stmt.varName);
            }
        });
    }
    Lab6.execute = execute;
    function run(prog) {
        return __awaiter(this, void 0, void 0, function* () {
            const env = new Map;
            for (const stmt of prog)
                yield execute(env, stmt);
        });
    }
    Lab6.run = run;
})(Lab6 || (Lab6 = {}));
var Lab6;
(function (Lab6) {
    class TypeError extends Error {
    }
    Lab6.TypeError = TypeError;
    function inferExprType(env, tree) {
        if (tree instanceof Lab6.VarLeaf) {
            const variableType = env.get(tree.name);
            if (variableType != null)
                return variableType;
            else
                throw new TypeError("undefined variable " + tree.name);
        }
        else if (tree instanceof Lab6.InputLeaf)
            return tree.inputType;
        else if (tree instanceof Lab6.NumLeaf)
            return Lab6.AtomicType.number;
        else if (tree instanceof Lab6.BoolLeaf)
            return Lab6.AtomicType.boolean;
        else if (tree instanceof Lab6.StringLeaf)
            return Lab6.AtomicType.string;
        else if (tree instanceof Lab6.NegateNode) {
            return inferExprType(env, tree.subtree);
        }
        else if (tree instanceof Lab6.ToStringNode) {
            inferExprType(env, tree.subtree);
            return Lab6.AtomicType.string;
        }
        else if (tree instanceof Lab6.PlusNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (Lab6.equalTypes(leftSubtreeType, Lab6.AtomicType.number) &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.number))
                return Lab6.AtomicType.number;
            else if (Lab6.equalTypes(leftSubtreeType, Lab6.AtomicType.string) &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.string))
                return Lab6.AtomicType.string;
            else if (leftSubtreeType instanceof Lab6.ArrayType &&
                rightSubtreeType instanceof Lab6.ArrayType &&
                Lab6.equalTypes(leftSubtreeType.elementType, rightSubtreeType.elementType))
                return leftSubtreeType;
            else
                throw new TypeError("can't add expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab6.TimesNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (Lab6.equalTypes(leftSubtreeType, Lab6.AtomicType.number) &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.number))
                return Lab6.AtomicType.number;
            else
                throw new TypeError("can't multiply expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
            /////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab6.AndNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (Lab6.equalTypes(leftSubtreeType, Lab6.AtomicType.boolean) &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.boolean))
                return Lab6.AtomicType.boolean;
            else
                throw new TypeError("can't and expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
            /////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab6.LessThanNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (Lab6.equalTypes(leftSubtreeType, Lab6.AtomicType.number) &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.number))
                return Lab6.AtomicType.boolean;
            else
                throw new TypeError("can't less than expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
            /////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab6.EqualNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (Lab6.equalTypes(leftSubtreeType, rightSubtreeType))
                return Lab6.AtomicType.boolean;
            else
                throw new TypeError("can't equal expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
            /////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab6.IndexNode) {
            const leftSubtreeType = inferExprType(env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(env, tree.rightSubtree);
            if (leftSubtreeType instanceof Lab6.ArrayType &&
                Lab6.equalTypes(rightSubtreeType, Lab6.AtomicType.number))
                return leftSubtreeType.elementType;
            else
                throw new TypeError("can't index expressions with types " +
                    Lab6.typeToString(leftSubtreeType) + " and " +
                    Lab6.typeToString(rightSubtreeType));
            /////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab6.ArrayNode) {
            for (const subtree of tree.subtreeArray) {
                const subtreeType = inferExprType(env, subtree);
                if (!Lab6.equalTypes(subtreeType, tree.elementType))
                    throw new TypeError("can't use element of type " +
                        Lab6.typeToString(subtreeType) + " in array of type " +
                        Lab6.typeToString(new Lab6.ArrayType(tree.elementType)));
            }
            return new Lab6.ArrayType(tree.elementType);
        }
        else { // if (tree instanceof ConditionalNode)
            const conditionSubtreeType = inferExprType(env, tree.conditionSubtree);
            const trueSubtreeType = inferExprType(env, tree.trueBranchSubtree);
            const falseSubtreeType = inferExprType(env, tree.falseBranchSubtree);
            if (Lab6.equalTypes(conditionSubtreeType, Lab6.AtomicType.boolean) &&
                Lab6.equalTypes(trueSubtreeType, falseSubtreeType))
                return trueSubtreeType;
            else
                throw new TypeError("can't do conditional expression with types " +
                    Lab6.typeToString(conditionSubtreeType) + ", " +
                    Lab6.typeToString(trueSubtreeType) + ", and " +
                    Lab6.typeToString(falseSubtreeType));
        }
    }
    Lab6.inferExprType = inferExprType;
    function typecheckStmt(env, stmt) {
        if (stmt instanceof Lab6.OutputNode)
            inferExprType(env, stmt.subtree);
        else if (stmt instanceof Lab6.VarDeclNode) {
            const subtreeType = inferExprType(env, stmt.subtree);
            if (!Lab6.equalTypes(stmt.varType, subtreeType))
                throw new TypeError("bad variable declaration: variable " + stmt.varName +
                    " with type " + Lab6.typeToString(stmt.varType) +
                    " doesn't match expression type " + Lab6.typeToString(subtreeType));
            env.set(stmt.varName, stmt.varType);
        }
        else { // if stmt instanceof AssignNode
            const expectedType = env.get(stmt.varName);
            if (expectedType == null)
                throw new TypeError("undefined variable " + stmt.varName);
            const subtreeType = inferExprType(env, stmt.subtree);
            if (!Lab6.equalTypes(subtreeType, expectedType))
                throw new TypeError("bad assignment: defined variable " + stmt.varName +
                    " with type " + Lab6.typeToString(subtreeType) +
                    " doesn't match expression type ");
        }
    }
    Lab6.typecheckStmt = typecheckStmt;
    function typecheckProg(prog) {
        const env = new Map;
        for (const stmt of prog)
            typecheckStmt(env, stmt);
    }
    Lab6.typecheckProg = typecheckProg;
})(Lab6 || (Lab6 = {}));
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
var Lab6;
(function (Lab6) {
    let TokenSort;
    (function (TokenSort) {
        TokenSort[TokenSort["number"] = 0] = "number";
        TokenSort[TokenSort["string"] = 1] = "string";
        TokenSort[TokenSort["boolean"] = 2] = "boolean";
        TokenSort[TokenSort["function"] = 3] = "function";
        TokenSort[TokenSort["keyword"] = 4] = "keyword";
        TokenSort[TokenSort["name"] = 5] = "name";
        TokenSort[TokenSort["paren"] = 6] = "paren";
        TokenSort[TokenSort["bracket"] = 7] = "bracket";
        TokenSort[TokenSort["unaryOp"] = 8] = "unaryOp";
        TokenSort[TokenSort["binaryOp"] = 9] = "binaryOp";
    })(TokenSort = Lab6.TokenSort || (Lab6.TokenSort = {}));
    const tokenPatterns = [
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
    class Token {
        constructor(sort, text) {
            this.sort = sort;
            this.text = text;
            this.toString = () => `${TokenSort[this.sort]}('${this.text}')`;
            this.sort = sort;
            this.text = text;
        }
    }
    Lab6.Token = Token;
    class TokenizingError extends Error {
    }
    Lab6.TokenizingError = TokenizingError;
    function tokenize(source) {
        const trimmed = source.trimStart();
        if (trimmed == "")
            return [];
        for (const { sort, regexp } of tokenPatterns) {
            const match = trimmed.match(regexp);
            if (match == null)
                continue;
            const tokenText = match[0];
            const token = new Token(sort, tokenText.trimEnd());
            const restOfInput = trimmed.slice(tokenText.length);
            const restOfTokens = tokenize(restOfInput);
            return [token].concat(restOfTokens);
        }
        throw new TokenizingError("leftover input: " + source);
    }
    Lab6.tokenize = tokenize;
    let Assoc;
    (function (Assoc) {
        Assoc[Assoc["left"] = 0] = "left";
        Assoc[Assoc["right"] = 1] = "right";
    })(Assoc || (Assoc = {}));
    const fixity = (token) => {
        switch (token.text) {
            case ',': return { assoc: Assoc.right, prec: 0 };
            case '=': return { assoc: Assoc.right, prec: 1 };
            case '?':
            case ':': return { assoc: Assoc.right, prec: 2 };
            case '&': return { assoc: Assoc.right, prec: 3 };
            case '<':
            case '>': return { assoc: Assoc.right, prec: 4 };
            case '+': return { assoc: Assoc.right, prec: 5 };
            case '*': return { assoc: Assoc.right, prec: 6 };
            case '#': return { assoc: Assoc.left, prec: 7 };
            default: throw new Error("parser bug");
        }
    };
    class ParseError extends Error {
    }
    Lab6.ParseError = ParseError;
    /*
    This is the variant of the shunting-yard algorithm that outputs prefix
    notation, extended to also handle our language's syntax for arrays.
    */
    const shunt = (tokens) => {
        var _a, _b;
        const input = Array.from(tokens);
        const ops = [];
        const out = [];
        while (input.length > 0) {
            const head = input.pop();
            switch (head.sort) {
                case TokenSort.paren: {
                    switch (head.text) {
                        case ')':
                            ops.unshift(head);
                            break;
                        case '(': {
                            while (ops.length > 0 && ops[0].text != ')')
                                out.unshift(ops.shift());
                            if (((_a = ops.shift()) === null || _a === void 0 ? void 0 : _a.text) != ')')
                                throw new ParseError("mismatched parentheses");
                            break;
                        }
                    }
                    break;
                }
                case TokenSort.bracket: {
                    switch (head.text) {
                        case ']':
                            out.unshift(head);
                            ops.unshift(head);
                            break;
                        case '[': {
                            while (ops.length > 0 && ops[0].text != ']')
                                out.unshift(ops.shift());
                            if (((_b = ops.shift()) === null || _b === void 0 ? void 0 : _b.text) != ']')
                                throw new ParseError("mismatched brackets");
                            out.unshift(head);
                        }
                    }
                    break;
                }
                case TokenSort.binaryOp: {
                    const shouldPopOperator = (op) => {
                        if (op.text == '(')
                            return true;
                        else if (op.sort == TokenSort.binaryOp) {
                            const f1 = fixity(head);
                            const f2 = fixity(op);
                            return (f2.prec > f1.prec ||
                                (f2.prec == f1.prec && f2.assoc == Assoc.right));
                        }
                        else
                            return false;
                    };
                    while (ops.length > 0 && shouldPopOperator(ops[0]))
                        out.unshift(ops.shift());
                    ops.unshift(head);
                    break;
                }
                default:
                    out.unshift(head);
                    break;
            }
        }
        while (ops.length > 0) {
            if (ops[0].sort == TokenSort.paren)
                throw new ParseError("mismatched parentheses");
            out.unshift(ops.shift());
        }
        return out;
    };
    class ConstLeaf extends Lab6.NameLeaf {
    }
    Lab6.ConstLeaf = ConstLeaf;
    class CommaNode extends Lab6.BinaryNode {
    }
    Lab6.CommaNode = CommaNode;
    class ConditionalNode1 extends Lab6.BinaryNode {
    }
    Lab6.ConditionalNode1 = ConditionalNode1;
    class ConditionalNode2 extends Lab6.BinaryNode {
    }
    Lab6.ConditionalNode2 = ConditionalNode2;
    const unaryOp = (op, exp) => {
        switch (op) {
            case '@': return new Lab6.ToStringNode(exp);
            case '-': return new Lab6.NegateNode(exp);
            default: throw new Error("parser bug");
        }
    };
    const binaryOp = (op, exp1, exp2) => {
        switch (op) {
            case '<': return new Lab6.LessThanNode(exp1, exp2);
            case '=': return new Lab6.EqualNode(exp1, exp2);
            case '>': return new Lab6.GreaterThanNode(exp1, exp2);
            case '&': return new Lab6.AndNode(exp1, exp2);
            case '*': return new Lab6.TimesNode(exp1, exp2);
            case '?': return new ConditionalNode1(exp1, exp2);
            case ':': return new ConditionalNode2(exp1, exp2);
            case '+': return new Lab6.PlusNode(exp1, exp2);
            case '#': return new Lab6.IndexNode(exp1, exp2);
            case ',': return new CommaNode(exp1, exp2);
            default: throw new ParseError("parser bug");
        }
    };
    const parseType = (tokens) => {
        var _a, _b;
        let index = 0;
        let dimensions = 0;
        for (; ((_a = tokens[index]) === null || _a === void 0 ? void 0 : _a.text) == '[' && ((_b = tokens[index + 1]) === null || _b === void 0 ? void 0 : _b.text) == ']'; index += 2)
            dimensions++;
        const head = tokens[index++];
        if ((head === null || head === void 0 ? void 0 : head.sort) != TokenSort.name || !(head.text in Lab6.AtomicType))
            throw new ParseError("invalid type");
        let type = Lab6.AtomicType[head.text];
        for (let i = 0; i < dimensions; i++)
            type = new Lab6.ArrayType(type);
        return [type, index];
    };
    const parseExpr = (tokens) => {
        let index = 0;
        const parse = () => {
            var _a, _b, _c;
            const head = tokens[index++];
            if (!head)
                throw new ParseError("unexpected end of input");
            switch (head.sort) {
                case TokenSort.number:
                    return new Lab6.NumLeaf(parseFloat(head.text));
                case TokenSort.boolean:
                    return new Lab6.BoolLeaf(head.text == "true");
                case TokenSort.string:
                    return new Lab6.StringLeaf(head.text.slice(1, -1));
                case TokenSort.bracket:
                case TokenSort.name: {
                    if (head.text == ']')
                        throw new ParseError("unmatched close bracket");
                    if (head.text in Lab6.AtomicType || head.text == '[') {
                        const [type, newIndex] = parseType(tokens.slice(--index));
                        index += newIndex;
                        if (((_a = tokens[index++]) === null || _a === void 0 ? void 0 : _a.text) != '[')
                            throw new ParseError("invalid array expression");
                        if (((_b = tokens[index]) === null || _b === void 0 ? void 0 : _b.text) == ']') {
                            index++;
                            return new Lab6.ArrayNode(type, []);
                        }
                        const elements = parse();
                        if (((_c = tokens[index++]) === null || _c === void 0 ? void 0 : _c.text) != ']')
                            throw new ParseError("invalid array expression");
                        return new Lab6.ArrayNode(type, unassociateElements(elements));
                    }
                    return new (/[A-Z]/.test(head.text[0]) ? ConstLeaf : Lab6.VarLeaf)(head.text);
                }
                case TokenSort.function: {
                    switch (head.text) {
                        case "input": {
                            const [type, newIndex] = parseType(tokens.slice(index));
                            index += newIndex;
                            return new Lab6.InputLeaf(type);
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
    const unassociateElements = (exp) => {
        if (exp instanceof CommaNode)
            return [exp.leftSubtree].concat(unassociateElements(exp.rightSubtree));
        else
            return [exp];
    };
    const unassociateTernary = (exp) => {
        if (exp instanceof Lab6.NegateNode)
            return new Lab6.NegateNode(unassociateTernary(exp.subtree));
        else if (exp instanceof Lab6.ToStringNode)
            return new Lab6.ToStringNode(unassociateTernary(exp.subtree));
        else if (exp instanceof Lab6.PlusNode)
            return new Lab6.PlusNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.TimesNode)
            return new Lab6.TimesNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.AndNode)
            return new Lab6.AndNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.IndexNode)
            return new Lab6.IndexNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.LessThanNode)
            return new Lab6.LessThanNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.EqualNode)
            return new Lab6.EqualNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab6.GreaterThanNode)
            return new Lab6.GreaterThanNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof ConditionalNode1) {
            if (exp.rightSubtree instanceof ConditionalNode2)
                return new Lab6.ConditionalNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree.leftSubtree), unassociateTernary(exp.rightSubtree.rightSubtree));
            else
                throw new ParseError("mismatched ?:");
        }
        else if (exp instanceof ConditionalNode2)
            throw new ParseError("mismatched ?:");
        else if (exp instanceof Lab6.ArrayNode)
            return new Lab6.ArrayNode(exp.elementType, exp.subtreeArray.map(unassociateTernary));
        else
            return exp;
    };
    const desugar = (tree) => {
        if (tree instanceof Lab6.ArrayNode)
            return new Lab6.ArrayNode(tree.elementType, tree.subtreeArray.map(desugar));
        else if (tree instanceof Lab6.NegateNode)
            return new Lab6.NegateNode(desugar(tree.subtree));
        else if (tree instanceof Lab6.ToStringNode)
            return new Lab6.ToStringNode(desugar(tree.subtree));
        else if (tree instanceof Lab6.PlusNode)
            return new Lab6.PlusNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab6.TimesNode)
            return new Lab6.TimesNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab6.AndNode)
            return new Lab6.AndNode(tree.leftSubtree, tree.rightSubtree);
        else if (tree instanceof Lab6.IndexNode)
            return new Lab6.IndexNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab6.LessThanNode)
            return new Lab6.LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab6.EqualNode)
            return new Lab6.EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab6.GreaterThanNode)
            return new Lab6.AndNode(new Lab6.NegateNode(new Lab6.LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree))), new Lab6.NegateNode(new Lab6.EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree))));
        else if (tree instanceof Lab6.ConditionalNode)
            return new Lab6.ConditionalNode(desugar(tree.conditionSubtree), desugar(tree.trueBranchSubtree), desugar(tree.falseBranchSubtree));
        else
            return tree;
    };
    Lab6.parseCompleteExpr = (tokens) => {
        const shunted = shunt(tokens);
        const [expr, index] = parseExpr(shunted);
        if (index < shunted.length)
            throw new ParseError("leftover tokens: " + tokens.slice(index).join(", "));
        return desugar(unassociateTernary(expr));
    };
    const parseStmt = (tokens) => {
        switch (tokens[0].text) {
            case "output": {
                if (tokens[1].text != '(' || tokens[tokens.length - 1].text != ')')
                    throw new ParseError("invalid output statement");
                const expr = Lab6.parseCompleteExpr(tokens.slice(2, -1));
                return new Lab6.OutputNode(expr);
            }
            case "var": {
                if (tokens[1].sort != TokenSort.name)
                    throw new ParseError("invalid variable declaration");
                const name = tokens[1].text;
                if (tokens[2].text != ':')
                    throw new ParseError("invalid variable declaration");
                const [type, index] = parseType(tokens.slice(3));
                if (tokens[3 + index].text != '<' || tokens[4 + index].text != '-')
                    throw new ParseError("invalid variable declaration");
                const expr = Lab6.parseCompleteExpr(tokens.slice(5 + index));
                return new Lab6.VarDeclNode(name, type, expr);
            }
            default: {
                if (tokens[0].sort != TokenSort.name)
                    throw new ParseError("invalid statement");
                const name = tokens[0].text;
                if (tokens[1].text != '<' || tokens[2].text != '-')
                    throw new ParseError("invalid variable assignment");
                const expr = Lab6.parseCompleteExpr(tokens.slice(3));
                return new Lab6.AssignNode(name, expr);
            }
        }
    };
    Lab6.parseProgram = (input) => {
        const lines = input.trim().split(/\s*;\s*/);
        if (lines[lines.length - 1] === '')
            lines.pop();
        return lines.map(tokenize).map(parseStmt);
    };
    function expandExpr(env, tree) {
        if (tree instanceof ConstLeaf)
            return env.get(tree.name);
        else if (tree instanceof Lab6.NegateNode)
            return new Lab6.NegateNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab6.ToStringNode)
            return new Lab6.ToStringNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab6.PlusNode)
            return new Lab6.PlusNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.TimesNode)
            return new Lab6.TimesNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.AndNode)
            return new Lab6.AndNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.LessThanNode)
            return new Lab6.LessThanNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.EqualNode)
            return new Lab6.EqualNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.IndexNode)
            return new Lab6.IndexNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab6.ConditionalNode)
            return new Lab6.ConditionalNode(expandExpr(env, tree.conditionSubtree), expandExpr(env, tree.trueBranchSubtree), expandExpr(env, tree.falseBranchSubtree));
        else if (tree instanceof Lab6.ArrayNode)
            return new Lab6.ArrayNode(tree.elementType, tree.subtreeArray.map(subtree => expandExpr(env, subtree)));
        else
            return tree;
    }
    Lab6.expandExpr = expandExpr;
    function expandStmt(env, tree) {
        if (tree instanceof Lab6.OutputNode)
            return new Lab6.OutputNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab6.VarDeclNode)
            return new Lab6.VarDeclNode(tree.varName, tree.varType, expandExpr(env, tree.subtree));
        else // tree instanceof AssignNode
            return new Lab6.AssignNode(tree.varName, expandExpr(env, tree.subtree));
    }
    Lab6.expandStmt = expandStmt;
})(Lab6 || (Lab6 = {}));
var Lab7;
(function (Lab7) {
    function deleteSubScope(env, outerScopeVarNames) {
        for (const varName of env.keys())
            if (!outerScopeVarNames.has(varName))
                env.delete(varName);
    }
    Lab7.deleteSubScope = deleteSubScope;
    let AtomicType;
    (function (AtomicType) {
        AtomicType["number"] = "number";
        AtomicType["boolean"] = "boolean";
        AtomicType["string"] = "string";
    })(AtomicType = Lab7.AtomicType || (Lab7.AtomicType = {}));
    class ArrayType {
        constructor(elementType) {
            this.elementType = elementType;
            this.elementType = elementType;
        }
    }
    Lab7.ArrayType = ArrayType;
    function isAtomicType(type) {
        return !(type instanceof ArrayType);
    }
    Lab7.isAtomicType = isAtomicType;
    function typeToString(type) {
        if (type instanceof ArrayType)
            return "[]" + typeToString(type.elementType);
        else // if (isAtomic(type))
            return type;
    }
    Lab7.typeToString = typeToString;
    function equalTypes(type1, type2) {
        if (isAtomicType(type1) && isAtomicType(type2))
            return type1 == type2;
        else if (type1 instanceof ArrayType && type2 instanceof ArrayType)
            return equalTypes(type1.elementType, type2.elementType);
        else
            return false;
    }
    Lab7.equalTypes = equalTypes;
    class FuncParam {
        constructor(name, type) {
            this.name = name;
            this.type = type;
            this.name = name;
            this.type = type;
        }
    }
    Lab7.FuncParam = FuncParam;
    class FuncDecl {
        constructor(parameterArray, returnType, body) {
            this.parameterArray = parameterArray;
            this.returnType = returnType;
            this.body = body;
            this.parameterArray = parameterArray;
            this.returnType = returnType;
            this.body = body;
        }
    }
    Lab7.FuncDecl = FuncDecl;
    class NameLeaf {
        constructor(name) {
            this.name = name;
            this.name = name;
        }
    }
    Lab7.NameLeaf = NameLeaf;
    class ValueLeaf {
        constructor(value) {
            this.value = value;
            this.value = value;
        }
    }
    Lab7.ValueLeaf = ValueLeaf;
    class UnaryNode {
        constructor(subtree) {
            this.subtree = subtree;
            this.subtree = subtree;
        }
    }
    Lab7.UnaryNode = UnaryNode;
    class BinaryNode {
        constructor(leftSubtree, rightSubtree) {
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
            this.leftSubtree = leftSubtree;
            this.rightSubtree = rightSubtree;
        }
    }
    Lab7.BinaryNode = BinaryNode;
    class VarLeaf extends NameLeaf {
    }
    Lab7.VarLeaf = VarLeaf;
    class InputLeaf {
        constructor(inputType) {
            this.inputType = inputType;
            this.inputType = inputType;
        }
    }
    Lab7.InputLeaf = InputLeaf;
    class NumLeaf extends ValueLeaf {
    }
    Lab7.NumLeaf = NumLeaf;
    class BoolLeaf extends ValueLeaf {
    }
    Lab7.BoolLeaf = BoolLeaf;
    class StringLeaf extends ValueLeaf {
    }
    Lab7.StringLeaf = StringLeaf;
    class ArrayNode {
        constructor(elementType, subtreeArray) {
            this.elementType = elementType;
            this.subtreeArray = subtreeArray;
            this.elementType = elementType;
            this.subtreeArray = subtreeArray;
        }
    }
    Lab7.ArrayNode = ArrayNode;
    function isValue(tree) {
        if (tree instanceof ValueLeaf)
            return true;
        else if (tree instanceof ArrayNode) {
            for (const subtree of tree.subtreeArray)
                if (!isValue(subtree))
                    return false;
            return true;
        }
        else
            return false;
    }
    Lab7.isValue = isValue;
    class NegateNode extends UnaryNode {
    }
    Lab7.NegateNode = NegateNode;
    class ToStringNode extends UnaryNode {
    }
    Lab7.ToStringNode = ToStringNode;
    class PlusNode extends BinaryNode {
    }
    Lab7.PlusNode = PlusNode;
    class TimesNode extends BinaryNode {
    }
    Lab7.TimesNode = TimesNode;
    class AndNode extends BinaryNode {
    }
    Lab7.AndNode = AndNode;
    class LessThanNode extends BinaryNode {
    }
    Lab7.LessThanNode = LessThanNode;
    class EqualNode extends BinaryNode {
    }
    Lab7.EqualNode = EqualNode;
    class GreaterThanNode extends BinaryNode {
    }
    Lab7.GreaterThanNode = GreaterThanNode;
    class IndexNode extends BinaryNode {
    }
    Lab7.IndexNode = IndexNode;
    class CallNode {
        constructor(funcName, argArray) {
            this.funcName = funcName;
            this.argArray = argArray;
            this.funcName = funcName;
            this.argArray = argArray;
        }
    }
    Lab7.CallNode = CallNode;
    class ConditionalNode {
        constructor(conditionSubtree, trueBranchSubtree, falseBranchSubtree) {
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
            this.conditionSubtree = conditionSubtree;
            this.trueBranchSubtree = trueBranchSubtree;
            this.falseBranchSubtree = falseBranchSubtree;
        }
    }
    Lab7.ConditionalNode = ConditionalNode;
    class OutputNode extends UnaryNode {
    }
    Lab7.OutputNode = OutputNode;
    class VarDeclNode extends UnaryNode {
        constructor(varName, varType, subtree) {
            super(subtree);
            this.varName = varName;
            this.varType = varType;
            this.varName = varName;
            this.varType = varType;
        }
    }
    Lab7.VarDeclNode = VarDeclNode;
    class AssignNode extends UnaryNode {
        constructor(varName, subtree) {
            super(subtree);
            this.varName = varName;
            this.varName = varName;
        }
    }
    Lab7.AssignNode = AssignNode;
    class BlockNode {
        constructor(stmtArray) {
            this.stmtArray = stmtArray;
            this.stmtArray = stmtArray;
        }
    }
    Lab7.BlockNode = BlockNode;
    class IfNode {
        constructor(conditional, trueBranch, falseBranch) {
            this.conditional = conditional;
            this.trueBranch = trueBranch;
            this.falseBranch = falseBranch;
            this.trueBranch = trueBranch;
            this.falseBranch = falseBranch;
        }
    }
    Lab7.IfNode = IfNode;
    class WhileNode {
        constructor(conditional, body) {
            this.conditional = conditional;
            this.body = body;
            this.conditional = conditional;
            this.body = body;
        }
    }
    Lab7.WhileNode = WhileNode;
    class ForEachNode {
        constructor(varName, arrayExpr, body) {
            this.varName = varName;
            this.arrayExpr = arrayExpr;
            this.body = body;
            this.varName = varName;
            this.arrayExpr = arrayExpr;
            this.body = body;
        }
    }
    Lab7.ForEachNode = ForEachNode;
    class ReturnNode {
        constructor(returnExpr) {
            this.returnExpr = returnExpr;
            this.returnExpr = returnExpr;
        }
    }
    Lab7.ReturnNode = ReturnNode;
    function exprToString(tree) {
        if (tree instanceof StringLeaf)
            return "\"" + tree.value + "\"";
        else if (tree instanceof NameLeaf)
            return tree.name;
        else if (tree instanceof InputLeaf)
            return "input(" + typeToString(tree.inputType) + ")";
        else if (tree instanceof ArrayNode)
            return (typeToString(tree.elementType) + "[" +
                tree.subtreeArray.map(exprToString).join(", ") + "]");
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
        }
        else // if (tree instanceof NumLeaf || tree instanceof BoolLeaf)
            return tree.value.toString();
    }
    Lab7.exprToString = exprToString;
    const INDENT_LEVEL_SPACES = 2;
    function indent(level, str) {
        let output = "";
        for (let i = 0; i < level; i++)
            for (let j = 0; j < INDENT_LEVEL_SPACES; j++)
                output += ' ';
        return output + str;
    }
    function stmtToString(indentLevel, tree) {
        if (tree instanceof OutputNode)
            return indent(indentLevel, "output(" + exprToString(tree.subtree) + ")");
        else if (tree instanceof VarDeclNode)
            return indent(indentLevel, "var " + tree.varName + ": " +
                typeToString(tree.varType) + " <- " +
                exprToString(tree.subtree));
        else if (tree instanceof AssignNode)
            return indent(indentLevel, tree.varName + " <- " + exprToString(tree.subtree));
        else if (tree instanceof BlockNode) {
            let output = indent(indentLevel, "{\n");
            for (const stmt of tree.stmtArray)
                output += stmtToString(indentLevel + 1, stmt) + ";\n";
            return output + indent(indentLevel, "}");
        }
        else if (tree instanceof IfNode) {
            const trueOutput = indent(indentLevel, "if (") + exprToString(tree.conditional) + ")\n" +
                stmtToString(indentLevel + 1, tree.trueBranch);
            if (tree.falseBranch == null)
                return trueOutput;
            else
                return (trueOutput + "\n" +
                    indent(indentLevel, "else\n") +
                    stmtToString(indentLevel + 1, tree.falseBranch));
        }
        else if (tree instanceof WhileNode)
            return (indent(indentLevel, "while (" + exprToString(tree.conditional) + ")\n") +
                stmtToString(indentLevel + 1, tree.body));
        else if (tree instanceof ForEachNode)
            return (indent(indentLevel, "foreach (var " + tree.varName + " <-- " +
                exprToString(tree.arrayExpr) + ")\n") +
                stmtToString(indentLevel + 1, tree.body));
        else if (tree instanceof CallNode) {
            let argString = "";
            for (const arg of tree.argArray)
                argString += exprToString(arg);
            return indent(indentLevel, tree.funcName + "(" + argString + ")");
        }
        else // tree instanceof ReturnNode
            return indent(indentLevel, tree.returnExpr == null ? "return" : ("return " + exprToString(tree.returnExpr)));
    }
    Lab7.stmtToString = stmtToString;
    function programToString(prog) {
        let output = "";
        for (const [funcName, func] of prog.entries()) {
            output += funcName + "(";
            for (const param of func.parameterArray)
                output += param.name + ": " + typeToString(param.type) + ", ";
            if (func.parameterArray.length > 0)
                output = output.slice(0, -2);
            output += ")\n";
            output += stmtToString(0, func.body) + '\n\n';
        }
        return output;
    }
    Lab7.programToString = programToString;
})(Lab7 || (Lab7 = {}));
var Lab7;
(function (Lab7) {
    function equalValues(val1, val2) {
        if (val1 instanceof Lab7.NumLeaf && val2 instanceof Lab7.NumLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab7.BoolLeaf && val2 instanceof Lab7.BoolLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab7.StringLeaf && val2 instanceof Lab7.StringLeaf)
            return val1.value == val2.value;
        else if (val1 instanceof Lab7.ArrayNode && val2 instanceof Lab7.ArrayNode) {
            if (val1.subtreeArray.length != val2.subtreeArray.length)
                return false;
            for (const [index, val] of val1.subtreeArray.entries())
                if (val != val2.subtreeArray[index])
                    return false;
            return true;
        }
        else
            return false;
    }
    class RuntimeError extends Error {
    }
    Lab7.RuntimeError = RuntimeError;
    // defined in lib/lab6.ts:
    // export const runtime: Runtime = ...;
    function evaluate(prog, env, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tree instanceof Lab7.VarLeaf) {
                const variableType = env.get(tree.name);
                if (variableType != null)
                    return variableType;
                else
                    throw new RuntimeError("undefined variable " + tree.name);
            }
            else if (tree instanceof Lab7.InputLeaf)
                return yield Lab7.runtime.input(tree.inputType);
            else if (tree instanceof Lab7.ValueLeaf)
                return tree;
            else if (tree instanceof Lab7.ArrayNode) {
                const valueArray = new Array(tree.subtreeArray.length);
                for (const [index, subtree] of tree.subtreeArray.entries())
                    valueArray[index] = yield evaluate(prog, env, subtree);
                return new Lab7.ArrayNode(tree.elementType, valueArray);
            }
            else if (tree instanceof Lab7.NegateNode) {
                const subtreeValue = yield evaluate(prog, env, tree.subtree);
                if (subtreeValue instanceof Lab7.NumLeaf)
                    return new Lab7.NumLeaf(-subtreeValue.value);
                else if (subtreeValue instanceof Lab7.BoolLeaf)
                    return new Lab7.BoolLeaf(!subtreeValue.value);
                else if (subtreeValue instanceof Lab7.StringLeaf)
                    return new Lab7.StringLeaf(subtreeValue.value.split('').reverse().join(''));
                else // subtreeValue instanceof ArrayNode<Value>
                    return new Lab7.ArrayNode(subtreeValue.elementType, subtreeValue.subtreeArray.reverse());
            }
            else if (tree instanceof Lab7.ToStringNode) {
                const subtreeValue = yield evaluate(prog, env, tree.subtree);
                return new Lab7.StringLeaf(Lab7.exprToString(subtreeValue));
            }
            else if (tree instanceof Lab7.PlusNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.NumLeaf && rightSubtreeValue instanceof Lab7.NumLeaf)
                    return new Lab7.NumLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
                else if (leftSubtreeValue instanceof Lab7.StringLeaf && rightSubtreeValue instanceof Lab7.StringLeaf)
                    return new Lab7.StringLeaf(leftSubtreeValue.value + rightSubtreeValue.value);
                else if (leftSubtreeValue instanceof Lab7.ArrayNode && rightSubtreeValue instanceof Lab7.ArrayNode)
                    return new Lab7.ArrayNode(leftSubtreeValue.elementType, leftSubtreeValue.subtreeArray.concat(rightSubtreeValue.subtreeArray));
                else
                    throw new RuntimeError("can't add values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.TimesNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.NumLeaf && rightSubtreeValue instanceof Lab7.NumLeaf)
                    return new Lab7.NumLeaf(leftSubtreeValue.value * rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't multiply values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.AndNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.BoolLeaf && rightSubtreeValue instanceof Lab7.BoolLeaf)
                    return new Lab7.BoolLeaf(leftSubtreeValue.value && rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't AND values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.LessThanNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.NumLeaf && rightSubtreeValue instanceof Lab7.NumLeaf)
                    return new Lab7.BoolLeaf(leftSubtreeValue.value < rightSubtreeValue.value);
                else
                    throw new RuntimeError("can't compare (<) values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.EqualNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.NumLeaf && rightSubtreeValue instanceof Lab7.NumLeaf)
                    return new Lab7.BoolLeaf(equalValues(leftSubtreeValue, rightSubtreeValue));
                else
                    throw new RuntimeError("can't compare (=) values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.IndexNode) {
                const leftSubtreeValue = yield evaluate(prog, env, tree.leftSubtree);
                const rightSubtreeValue = yield evaluate(prog, env, tree.rightSubtree);
                if (leftSubtreeValue instanceof Lab7.ArrayNode && rightSubtreeValue instanceof Lab7.NumLeaf) {
                    const elementValue = leftSubtreeValue.subtreeArray[rightSubtreeValue.value];
                    if (elementValue != null)
                        return elementValue;
                    else
                        throw new RuntimeError("index " + Lab7.exprToString(rightSubtreeValue) +
                            " is out of bounds in " + Lab7.exprToString(leftSubtreeValue));
                }
                else
                    throw new RuntimeError("can't index with values " +
                        Lab7.exprToString(leftSubtreeValue) + " and " +
                        Lab7.exprToString(rightSubtreeValue));
            }
            else if (tree instanceof Lab7.CallNode) {
                const returnValue = yield call(prog, env, tree.funcName, tree.argArray);
                if (returnValue == null)
                    throw new RuntimeError("call to function " + tree.funcName +
                        " failed to return a value");
                return returnValue;
            }
            else { // if (tree instanceof ConditionalNode)
                const conditionSubtreeValue = yield evaluate(prog, env, tree.conditionSubtree);
                const trueSubtreeValue = yield evaluate(prog, env, tree.trueBranchSubtree);
                const falseSubtreeValue = yield evaluate(prog, env, tree.falseBranchSubtree);
                if (conditionSubtreeValue instanceof Lab7.BoolLeaf)
                    return conditionSubtreeValue.value ? trueSubtreeValue : falseSubtreeValue;
                else
                    throw new RuntimeError("can't evaluate conditional with value " +
                        Lab7.exprToString(conditionSubtreeValue));
            }
        });
    }
    Lab7.evaluate = evaluate;
    function call(prog, env, funcName, argArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const func = prog.get(funcName);
            if (func == null)
                throw new RuntimeError("undefined function name " + funcName);
            if (func.parameterArray.length < argArray.length)
                throw new RuntimeError("too many arguments passed to function " +
                    funcName);
            const argEnv = new Map;
            for (const [i, param] of func.parameterArray.entries()) {
                const argExpr = argArray[i];
                if (argExpr == null)
                    throw new RuntimeError("missing argument " + param.name +
                        " to function " + funcName);
                const argValue = yield evaluate(prog, env, argExpr);
                if (argValue != null)
                    argEnv.set(param.name, argValue);
                else
                    throw new RuntimeError("missing argument " + param.name +
                        " to function " + funcName);
            }
            try {
                yield execute(prog, argEnv, func.body);
            }
            catch (v) {
                if (Lab7.isValue(v))
                    return v;
                else if (v != null)
                    throw v;
            }
            return null;
        });
    }
    Lab7.call = call;
    function execute(prog, env, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tree instanceof Lab7.OutputNode) {
                const outputValue = yield evaluate(prog, env, tree.subtree);
                yield Lab7.runtime.output(outputValue);
            }
            else if (tree instanceof Lab7.VarDeclNode) {
                const initialValue = yield evaluate(prog, env, tree.subtree);
                env.set(tree.varName, initialValue);
            }
            else if (tree instanceof Lab7.AssignNode) {
                const newValue = yield evaluate(prog, env, tree.subtree);
                env.set(tree.varName, newValue);
                if (env.has(tree.varName))
                    env.set(tree.varName, newValue);
                else
                    throw new RuntimeError("assignment to undeclared variable " + tree.varName);
            }
            else if (tree instanceof Lab7.BlockNode)
                for (const subStmt of tree.stmtArray)
                    yield execute(prog, env, subStmt);
            /////////////////////////////////////////////////////////////
            else if (tree instanceof Lab7.IfNode) {
                const conditionalValue = yield evaluate(prog, env, tree.conditional);
                if (conditionalValue instanceof Lab7.BoolLeaf) {
                    const outerScopeVarNames = new Set(env.keys());
                    if (conditionalValue.value)
                        yield execute(prog, env, tree.trueBranch);
                    else if (tree.falseBranch != null)
                        yield execute(prog, env, tree.falseBranch);
                    Lab7.deleteSubScope(env, outerScopeVarNames);
                }
                else
                    throw new RuntimeError("non-boolean value used as if conditional: " +
                        Lab7.exprToString(conditionalValue));
                /////////////////////////////////////////////////////////////
            }
            else if (tree instanceof Lab7.WhileNode) {
                let conditionalValue = yield evaluate(prog, env, tree.conditional);
                if (!(conditionalValue instanceof Lab7.BoolLeaf))
                    throw new RuntimeError("non-boolean value used as while conditional: " +
                        Lab7.exprToString(conditionalValue));
                while (conditionalValue.value) {
                    const outerScopeVarNames = new Set(env.keys());
                    yield execute(prog, env, tree.body);
                    conditionalValue = yield evaluate(prog, env, tree.conditional);
                    if (!(conditionalValue instanceof Lab7.BoolLeaf))
                        throw new RuntimeError("non-boolean value used as while conditional: " +
                            Lab7.exprToString(conditionalValue));
                    Lab7.deleteSubScope(env, outerScopeVarNames);
                }
                /////////////////////////////////////////////////////////////
            }
            else if (tree instanceof Lab7.ForEachNode) {
                if (env.has(tree.varName)) {
                    throw new RuntimeError(tree.varName + " is already in the environment");
                }
                let arrayExprValue = yield evaluate(prog, env, tree.arrayExpr);
                if (!(arrayExprValue instanceof Lab7.ArrayNode)) {
                    throw new RuntimeError("non-array value used as foreach array expression: " +
                        Lab7.exprToString(arrayExprValue));
                }
                for (const newValue of arrayExprValue.subtreeArray) {
                    const outerScopeVarNames = new Set(env.keys());
                    env.set(tree.varName, newValue);
                    yield execute(prog, env, tree.body);
                    arrayExprValue = yield evaluate(prog, env, tree.arrayExpr);
                    if (!(arrayExprValue instanceof Lab7.ArrayNode)) {
                        throw new RuntimeError("non-array value used as foreach array expression: " +
                            Lab7.exprToString(arrayExprValue));
                    }
                    Lab7.deleteSubScope(env, outerScopeVarNames);
                }
                /////////////////////////////////////////////////////////////
            }
            else if (tree instanceof Lab7.CallNode) {
                yield call(prog, env, tree.funcName, tree.argArray);
            }
            else if (tree instanceof Lab7.ReturnNode)
                throw tree.returnExpr == null ?
                    null :
                    yield evaluate(prog, env, tree.returnExpr);
        });
    }
    Lab7.execute = execute;
    function run(prog) {
        return __awaiter(this, void 0, void 0, function* () {
            const mainFunc = prog.get("main");
            if (mainFunc == null || mainFunc.parameterArray.length != 0)
                throw new RuntimeError("no function main()");
            yield execute(prog, new Map, mainFunc.body);
        });
    }
    Lab7.run = run;
})(Lab7 || (Lab7 = {}));
var Lab7;
(function (Lab7) {
    class TypeError extends Error {
    }
    Lab7.TypeError = TypeError;
    function inferExprType(prog, env, tree) {
        if (tree instanceof Lab7.VarLeaf) {
            const variableType = env.get(tree.name);
            if (variableType != null)
                return variableType;
            else
                throw new TypeError("undefined variable " + tree.name);
        }
        else if (tree instanceof Lab7.InputLeaf)
            return tree.inputType;
        else if (tree instanceof Lab7.NumLeaf)
            return Lab7.AtomicType.number;
        else if (tree instanceof Lab7.BoolLeaf)
            return Lab7.AtomicType.boolean;
        else if (tree instanceof Lab7.StringLeaf)
            return Lab7.AtomicType.string;
        else if (tree instanceof Lab7.NegateNode) {
            return inferExprType(prog, env, tree.subtree);
        }
        else if (tree instanceof Lab7.ToStringNode) {
            inferExprType(prog, env, tree.subtree);
            return Lab7.AtomicType.string;
        }
        else if (tree instanceof Lab7.PlusNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (Lab7.equalTypes(leftSubtreeType, Lab7.AtomicType.number) &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.number))
                return Lab7.AtomicType.number;
            else if (Lab7.equalTypes(leftSubtreeType, Lab7.AtomicType.string) &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.string))
                return Lab7.AtomicType.string;
            else if (leftSubtreeType instanceof Lab7.ArrayType &&
                rightSubtreeType instanceof Lab7.ArrayType &&
                Lab7.equalTypes(leftSubtreeType.elementType, rightSubtreeType.elementType))
                return leftSubtreeType;
            else
                throw new TypeError("can't add expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.TimesNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (Lab7.equalTypes(leftSubtreeType, Lab7.AtomicType.number) &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.number))
                return Lab7.AtomicType.number;
            else
                throw new TypeError("can't multiply expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.AndNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (Lab7.equalTypes(leftSubtreeType, Lab7.AtomicType.boolean) &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.boolean))
                return Lab7.AtomicType.boolean;
            else
                throw new TypeError("can't and expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.LessThanNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (Lab7.equalTypes(leftSubtreeType, Lab7.AtomicType.number) &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.number))
                return Lab7.AtomicType.boolean;
            else
                throw new TypeError("can't less than expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.EqualNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (Lab7.equalTypes(leftSubtreeType, rightSubtreeType))
                return Lab7.AtomicType.boolean;
            else
                throw new TypeError("can't equal expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.IndexNode) {
            const leftSubtreeType = inferExprType(prog, env, tree.leftSubtree);
            const rightSubtreeType = inferExprType(prog, env, tree.rightSubtree);
            if (leftSubtreeType instanceof Lab7.ArrayType &&
                Lab7.equalTypes(rightSubtreeType, Lab7.AtomicType.number))
                return leftSubtreeType.elementType;
            else
                throw new TypeError("can't index expressions with types " +
                    Lab7.typeToString(leftSubtreeType) + " and " +
                    Lab7.typeToString(rightSubtreeType));
        }
        else if (tree instanceof Lab7.ArrayNode) {
            for (const subtree of tree.subtreeArray) {
                const subtreeType = inferExprType(prog, env, subtree);
                if (!Lab7.equalTypes(subtreeType, tree.elementType))
                    throw new TypeError("can't use element of type " +
                        Lab7.typeToString(subtreeType) + " in array of type " +
                        Lab7.typeToString(new Lab7.ArrayType(tree.elementType)));
            }
            return new Lab7.ArrayType(tree.elementType);
        }
        else if (tree instanceof Lab7.CallNode) {
            const retType = inferCallReturnType(prog, env, tree.funcName, tree.argArray);
            if (retType == null)
                throw new TypeError("call to void function " + tree.funcName +
                    " used as an expression");
            return retType;
        }
        else { // if (tree instanceof ConditionalNode)
            const conditionSubtreeType = inferExprType(prog, env, tree.conditionSubtree);
            const trueSubtreeType = inferExprType(prog, env, tree.trueBranchSubtree);
            const falseSubtreeType = inferExprType(prog, env, tree.falseBranchSubtree);
            if (Lab7.equalTypes(conditionSubtreeType, Lab7.AtomicType.boolean) &&
                Lab7.equalTypes(trueSubtreeType, falseSubtreeType))
                return trueSubtreeType;
            else
                throw new TypeError("can't do conditional expression with types " +
                    Lab7.typeToString(conditionSubtreeType) + ", " +
                    Lab7.typeToString(trueSubtreeType) + ", and " +
                    Lab7.typeToString(falseSubtreeType));
        }
    }
    Lab7.inferExprType = inferExprType;
    function typecheckStmt(prog, env, tree, expectedReturnType) {
        if (tree instanceof Lab7.OutputNode)
            inferExprType(prog, env, tree.subtree);
        else if (tree instanceof Lab7.VarDeclNode) {
            const subtreeType = inferExprType(prog, env, tree.subtree);
            if (!Lab7.equalTypes(tree.varType, subtreeType))
                throw new TypeError("bad variable declaration: variable " + tree.varName +
                    " with type " + Lab7.typeToString(tree.varType) +
                    " doesn't match expression type " + Lab7.typeToString(subtreeType));
            if (env.has(tree.varName))
                throw new TypeError("bad variable declaration: variable name " + tree.varName +
                    " is already used in the same scope");
            env.set(tree.varName, tree.varType);
        }
        else if (tree instanceof Lab7.AssignNode) {
            const expectedType = env.get(tree.varName);
            if (expectedType == null)
                throw new TypeError("undefined variable " + tree.varName);
            const subtreeType = inferExprType(prog, env, tree.subtree);
            if (!Lab7.equalTypes(subtreeType, expectedType))
                throw new TypeError("bad assignment: defined variable " + tree.varName +
                    " with type " + Lab7.typeToString(subtreeType) +
                    " doesn't match expression type ");
        }
        else if (tree instanceof Lab7.BlockNode)
            for (const subtree of tree.stmtArray)
                typecheckStmt(prog, env, subtree, expectedReturnType);
        //////////////////////////////////////////////////////////////////////
        else if (tree instanceof Lab7.IfNode) {
            const conditionalType = inferExprType(prog, env, tree.conditional);
            if (!Lab7.equalTypes(conditionalType, Lab7.AtomicType.boolean))
                throw new TypeError("bad if statement: non-boolean conditional type " +
                    Lab7.typeToString(conditionalType));
            const outerScopeVarNames = new Set(env.keys());
            typecheckStmt(prog, env, tree.trueBranch, expectedReturnType);
            Lab7.deleteSubScope(env, outerScopeVarNames);
            if (tree.falseBranch != null) {
                typecheckStmt(prog, env, tree.falseBranch, expectedReturnType);
                Lab7.deleteSubScope(env, outerScopeVarNames);
            }
            //////////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab7.WhileNode) {
            const conditionalType = inferExprType(prog, env, tree.conditional);
            if (!Lab7.equalTypes(conditionalType, Lab7.AtomicType.boolean))
                throw new TypeError("bad if statement: non-boolean conditional type " +
                    Lab7.typeToString(conditionalType));
            const outerScopeVarNames = new Set(env.keys());
            typecheckStmt(prog, env, tree.body, expectedReturnType);
            Lab7.deleteSubScope(env, outerScopeVarNames);
            //////////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab7.ForEachNode) {
            const varNameType = env.get(tree.varName);
            if (varNameType != null)
                throw new TypeError(tree.varName + " is already defined");
            const arrayExprType = inferExprType(prog, env, tree.arrayExpr);
            if (arrayExprType instanceof Lab7.ArrayType == false) {
                throw new TypeError(Lab7.typeToString(arrayExprType) + " is not an array type");
            }
            const outerScopeVarNames = new Set(env.keys());
            if (arrayExprType instanceof Lab7.ArrayType) {
                env.set(tree.varName, arrayExprType.elementType);
            }
            typecheckStmt(prog, env, tree.body, expectedReturnType);
            Lab7.deleteSubScope(env, outerScopeVarNames);
            //////////////////////////////////////////////////////////////////////
        }
        else if (tree instanceof Lab7.CallNode)
            inferCallReturnType(prog, env, tree.funcName, tree.argArray);
        else if (tree instanceof Lab7.ReturnNode) {
            if (tree.returnExpr == null) {
                if (expectedReturnType != null)
                    throw new TypeError("bad return: missing a return expression for a non-void function");
            }
            else if (expectedReturnType == null)
                throw new TypeError("bad return: included a return expression for a void function");
            else {
                const returnType = inferExprType(prog, env, tree.returnExpr);
                if (!Lab7.equalTypes(returnType, expectedReturnType))
                    throw new TypeError("bad return: expected type " + Lab7.typeToString(expectedReturnType) +
                        " but return expression has type " + Lab7.typeToString(returnType));
            }
        }
    }
    Lab7.typecheckStmt = typecheckStmt;
    function inferCallReturnType(prog, env, funcName, argArray) {
        const func = prog.get(funcName);
        if (func == null)
            throw new TypeError("call to undefined function " +
                funcName);
        if (func.parameterArray.length < argArray.length)
            throw new TypeError("too many arguments passed to function " +
                funcName);
        for (const [i, param] of func.parameterArray.entries()) {
            const arg = argArray[i];
            if (arg == null)
                throw new TypeError("missing argument " + param.name +
                    " to function " + funcName);
            const argType = inferExprType(prog, env, arg);
            if (!Lab7.equalTypes(param.type, argType))
                throw new TypeError("wrong argument type " + Lab7.typeToString(argType) +
                    " for parameter " + param.name +
                    ": " + Lab7.typeToString(param.type));
        }
        return func.returnType;
    }
    Lab7.inferCallReturnType = inferCallReturnType;
    function typecheckProg(prog) {
        for (const [funcName, func] of prog.entries()) {
            const env = new Map;
            for (const param of func.parameterArray)
                if (!env.has(param.name))
                    env.set(param.name, param.type);
                else
                    throw new TypeError("bad definition for function " + funcName +
                        ": repeated parameter name " + param.name);
            typecheckStmt(prog, env, func.body, func.returnType);
        }
    }
    Lab7.typecheckProg = typecheckProg;
})(Lab7 || (Lab7 = {}));
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
var Lab7;
(function (Lab7) {
    let TokenSort;
    (function (TokenSort) {
        TokenSort[TokenSort["number"] = 0] = "number";
        TokenSort[TokenSort["string"] = 1] = "string";
        TokenSort[TokenSort["boolean"] = 2] = "boolean";
        TokenSort[TokenSort["keyword"] = 3] = "keyword";
        TokenSort[TokenSort["name"] = 4] = "name";
        TokenSort[TokenSort["paren"] = 5] = "paren";
        TokenSort[TokenSort["bracket"] = 6] = "bracket";
        TokenSort[TokenSort["brace"] = 7] = "brace";
        TokenSort[TokenSort["unaryOp"] = 8] = "unaryOp";
        TokenSort[TokenSort["binaryOp"] = 9] = "binaryOp";
    })(TokenSort = Lab7.TokenSort || (Lab7.TokenSort = {}));
    const tokenPatterns = [
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
    class Token {
        constructor(sort, text) {
            this.sort = sort;
            this.text = text;
            this.toString = () => `${TokenSort[this.sort]}('${this.text}')`;
            this.sort = sort;
            this.text = text;
        }
    }
    Lab7.Token = Token;
    class TokenizingError extends Error {
    }
    Lab7.TokenizingError = TokenizingError;
    function tokenize(source) {
        const trimmed = source.trimStart();
        if (trimmed == "")
            return [];
        for (const { sort, regexp } of tokenPatterns) {
            const match = trimmed.match(regexp);
            if (match == null)
                continue;
            const tokenText = match[0];
            const token = new Token(sort, tokenText.trimEnd());
            const restOfInput = trimmed.slice(tokenText.length);
            const restOfTokens = tokenize(restOfInput);
            return [token].concat(restOfTokens);
        }
        throw new TokenizingError("leftover input: " + source);
    }
    Lab7.tokenize = tokenize;
    let Assoc;
    (function (Assoc) {
        Assoc[Assoc["left"] = 0] = "left";
        Assoc[Assoc["right"] = 1] = "right";
    })(Assoc || (Assoc = {}));
    const fixity = (token) => {
        switch (token.text) {
            case ',': return { assoc: Assoc.right, prec: 0 };
            case '=': return { assoc: Assoc.right, prec: 1 };
            case '?':
            case ':': return { assoc: Assoc.right, prec: 2 };
            case '&': return { assoc: Assoc.right, prec: 3 };
            case '<':
            case '>': return { assoc: Assoc.right, prec: 4 };
            case '+': return { assoc: Assoc.right, prec: 5 };
            case '*': return { assoc: Assoc.right, prec: 6 };
            case '#': return { assoc: Assoc.left, prec: 7 };
            default: throw new Error("parser bug");
        }
    };
    class ParseError extends Error {
    }
    Lab7.ParseError = ParseError;
    /*
    This is the variant of the shunting-yard algorithm that outputs prefix
    notation, extended to also handle our language's syntax for arrays.
    */
    const shunt = (tokens) => {
        var _a, _b;
        const input = Array.from(tokens);
        const ops = [];
        const out = [];
        while (input.length > 0) {
            const head = input.pop();
            switch (head.sort) {
                case TokenSort.paren: {
                    switch (head.text) {
                        case ')':
                            out.unshift(head);
                            ops.unshift(head);
                            break;
                        case '(': {
                            while (ops.length > 0 && ops[0].text != ')')
                                out.unshift(ops.shift());
                            if (((_a = ops.shift()) === null || _a === void 0 ? void 0 : _a.text) != ')')
                                throw new ParseError("mismatched parentheses");
                            out.unshift(head);
                            break;
                        }
                    }
                    break;
                }
                case TokenSort.bracket: {
                    switch (head.text) {
                        case ']':
                            out.unshift(head);
                            ops.unshift(head);
                            break;
                        case '[': {
                            while (ops.length > 0 && ops[0].text != ']')
                                out.unshift(ops.shift());
                            if (((_b = ops.shift()) === null || _b === void 0 ? void 0 : _b.text) != ']')
                                throw new ParseError("mismatched brackets");
                            out.unshift(head);
                        }
                    }
                    break;
                }
                case TokenSort.binaryOp: {
                    const shouldPopOperator = (op) => {
                        if (op.text == '(')
                            return true;
                        else if (op.sort == TokenSort.binaryOp) {
                            const f1 = fixity(head);
                            const f2 = fixity(op);
                            return (f2.prec > f1.prec ||
                                (f2.prec == f1.prec && f2.assoc == Assoc.right));
                        }
                        else
                            return false;
                    };
                    while (ops.length > 0 && shouldPopOperator(ops[0]))
                        out.unshift(ops.shift());
                    ops.unshift(head);
                    break;
                }
                default:
                    out.unshift(head);
                    break;
            }
        }
        while (ops.length > 0) {
            if (ops[0].sort == TokenSort.paren)
                throw new ParseError("mismatched parentheses");
            out.unshift(ops.shift());
        }
        return out;
    };
    class ConstLeaf extends Lab7.NameLeaf {
    }
    Lab7.ConstLeaf = ConstLeaf;
    class CommaNode extends Lab7.BinaryNode {
    }
    Lab7.CommaNode = CommaNode;
    class ConditionalNode1 extends Lab7.BinaryNode {
    }
    Lab7.ConditionalNode1 = ConditionalNode1;
    class ConditionalNode2 extends Lab7.BinaryNode {
    }
    Lab7.ConditionalNode2 = ConditionalNode2;
    const unaryOp = (op, exp) => {
        switch (op) {
            case '@': return new Lab7.ToStringNode(exp);
            case '-': return new Lab7.NegateNode(exp);
            default: throw new Error("parser bug");
        }
    };
    const binaryOp = (op, exp1, exp2) => {
        switch (op) {
            case '<': return new Lab7.LessThanNode(exp1, exp2);
            case '=': return new Lab7.EqualNode(exp1, exp2);
            case '>': return new Lab7.GreaterThanNode(exp1, exp2);
            case '&': return new Lab7.AndNode(exp1, exp2);
            case '*': return new Lab7.TimesNode(exp1, exp2);
            case '?': return new ConditionalNode1(exp1, exp2);
            case ':': return new ConditionalNode2(exp1, exp2);
            case '+': return new Lab7.PlusNode(exp1, exp2);
            case '#': return new Lab7.IndexNode(exp1, exp2);
            case ',': return new CommaNode(exp1, exp2);
            default: throw new ParseError("parser bug");
        }
    };
    const parseType = (tokens) => {
        var _a, _b;
        let index = 0;
        let dimensions = 0;
        for (; ((_a = tokens[index]) === null || _a === void 0 ? void 0 : _a.text) == '[' && ((_b = tokens[index + 1]) === null || _b === void 0 ? void 0 : _b.text) == ']'; index += 2)
            dimensions++;
        const head = tokens[index++];
        if ((head === null || head === void 0 ? void 0 : head.sort) != TokenSort.name || !(head.text in Lab7.AtomicType))
            throw new ParseError("invalid type");
        let type = Lab7.AtomicType[head.text];
        for (let i = 0; i < dimensions; i++)
            type = new Lab7.ArrayType(type);
        return [type, index];
    };
    const parseExpr = (tokens) => {
        let index = 0;
        const parse = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const head = tokens[index++];
            if (!head)
                throw new ParseError("unexpected end of input");
            switch (head.sort) {
                case TokenSort.number:
                    return new Lab7.NumLeaf(parseFloat(head.text));
                case TokenSort.boolean:
                    return new Lab7.BoolLeaf(head.text == "true");
                case TokenSort.string:
                    return new Lab7.StringLeaf(head.text.slice(1, -1));
                case TokenSort.bracket:
                case TokenSort.name: {
                    if (head.text == ']')
                        throw new ParseError("unmatched close bracket");
                    else if (head.text in Lab7.AtomicType || head.text == '[') {
                        const [type, newIndex] = parseType(tokens.slice(--index));
                        index += newIndex;
                        if (((_a = tokens[index++]) === null || _a === void 0 ? void 0 : _a.text) != '[')
                            throw new ParseError("invalid array expression");
                        if (((_b = tokens[index]) === null || _b === void 0 ? void 0 : _b.text) == ']') {
                            index++;
                            return new Lab7.ArrayNode(type, []);
                        }
                        const elements = parse();
                        if (((_c = tokens[index++]) === null || _c === void 0 ? void 0 : _c.text) != ']')
                            throw new ParseError("invalid array expression: missing close bracket");
                        return new Lab7.ArrayNode(type, unassociateElements(elements));
                    }
                    else if (head.text == "input") {
                        if (((_d = tokens[index++]) === null || _d === void 0 ? void 0 : _d.text) != '(')
                            throw new ParseError("invalid input expression: missing open parenthesis");
                        const [type, newIndex] = parseType(tokens.slice(index));
                        index += newIndex;
                        if (((_e = tokens[index++]) === null || _e === void 0 ? void 0 : _e.text) != ')')
                            throw new ParseError("invalid input expression: missing close parenthesis");
                        return new Lab7.InputLeaf(type);
                    }
                    else if (((_f = tokens[index]) === null || _f === void 0 ? void 0 : _f.text) == '(') {
                        index++;
                        if (((_g = tokens[index]) === null || _g === void 0 ? void 0 : _g.text) == ')') {
                            index++;
                            return new Lab7.CallNode(head.text, []);
                        }
                        const args = parse();
                        if (((_h = tokens[index++]) === null || _h === void 0 ? void 0 : _h.text) != ')')
                            throw new ParseError("invalid function call: missing close parenthesis");
                        return new Lab7.CallNode(head.text, unassociateElements(args));
                    }
                    return new (/[A-Z]/.test(head.text[0]) ? ConstLeaf : Lab7.VarLeaf)(head.text);
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
    const nextClosing = (tokens, index) => {
        let opens = 1;
        let i;
        for (i = index; opens > 0; i++) {
            const current = tokens[i];
            if (current == null)
                throw new ParseError("missing close parenthesis");
            else if (current.text == '(')
                opens++;
            else if (current.text == ')')
                opens--;
        }
        return i - 1;
    };
    const parseBlockNode = (tokens) => {
        var _a, _b, _c;
        let index = 0;
        const stmts = [];
        while (((_a = tokens[index]) === null || _a === void 0 ? void 0 : _a.text) != '}') {
            if (tokens[index] == null)
                throw new ParseError("invalid block statement: missing close brace");
            const [stmt, newIndex] = parseStmt(tokens.slice(index));
            index += newIndex;
            stmts.push(stmt);
            if (((_b = tokens[index - 1]) === null || _b === void 0 ? void 0 : _b.text) != '}' && ((_c = tokens[index++]) === null || _c === void 0 ? void 0 : _c.text) != ';')
                throw new ParseError("invalid block statement: missing semicolon");
        }
        index++;
        return [new Lab7.BlockNode(stmts), index];
    };
    const parseStmt = (tokens) => {
        let index = 0;
        const nextSemi = () => {
            const end = tokens.map(token => token.text).indexOf(';', index);
            if (end < 0)
                throw new ParseError("missing semicolon");
            return end;
        };
        const parse = () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            const head = tokens[index++];
            if (head == null)
                throw new ParseError("unexpected end of input");
            switch (head.text) {
                case "output": {
                    if (((_a = tokens[index++]) === null || _a === void 0 ? void 0 : _a.text) != '(')
                        throw new ParseError("invalid output statement: missing open parenthesis");
                    const close = nextClosing(tokens, index);
                    const expr = Lab7.parseCompleteExpr(tokens.slice(index, close));
                    index = close + 1;
                    return new Lab7.OutputNode(expr);
                }
                case "var": {
                    if (tokens[index].sort != TokenSort.name)
                        throw new ParseError("invalid variable declaration");
                    const name = tokens[index++].text;
                    if (tokens[index++].text != ':')
                        throw new ParseError("invalid variable declaration");
                    const [type, newIndex] = parseType(tokens.slice(index));
                    index += newIndex;
                    if (((_b = tokens[index++]) === null || _b === void 0 ? void 0 : _b.text) != '<' || ((_c = tokens[index++]) === null || _c === void 0 ? void 0 : _c.text) != '-')
                        throw new ParseError("invalid variable declaration: missing left arrow");
                    const end = nextSemi();
                    const expr = Lab7.parseCompleteExpr(tokens.slice(index, end));
                    index = end;
                    return new Lab7.VarDeclNode(name, type, expr);
                }
                case "if": {
                    if (((_d = tokens[index++]) === null || _d === void 0 ? void 0 : _d.text) != '(')
                        throw new ParseError("invalid if statement: missing open parenthesis");
                    const close = nextClosing(tokens, index);
                    const expr = Lab7.parseCompleteExpr(tokens.slice(index, close));
                    index = close + 1;
                    const trueBranch = parse();
                    let falseBranch;
                    if (((_e = tokens[index]) === null || _e === void 0 ? void 0 : _e.text) == ";" && ((_f = tokens[index + 1]) === null || _f === void 0 ? void 0 : _f.text) == "else") {
                        index += 2;
                        falseBranch = parse();
                    }
                    else if (((_g = tokens[index - 1]) === null || _g === void 0 ? void 0 : _g.text) == "}" && ((_h = tokens[index]) === null || _h === void 0 ? void 0 : _h.text) == "else") {
                        index++;
                        falseBranch = parse();
                    }
                    else
                        falseBranch = null;
                    return new Lab7.IfNode(expr, trueBranch, falseBranch);
                }
                case "while": {
                    if (((_j = tokens[index++]) === null || _j === void 0 ? void 0 : _j.text) != '(')
                        throw new ParseError("invalid if statement: missing open parenthesis");
                    const close = nextClosing(tokens, index);
                    const expr = Lab7.parseCompleteExpr(tokens.slice(index, close));
                    index = close + 1;
                    return new Lab7.WhileNode(expr, parse());
                }
                case "foreach": {
                    if (((_k = tokens[index++]) === null || _k === void 0 ? void 0 : _k.text) != '(')
                        throw new ParseError("invalid foreach statement: missing open parenthesis");
                    if (((_l = tokens[index++]) === null || _l === void 0 ? void 0 : _l.text) != "var")
                        throw new ParseError("invalid foreach statement: missing 'var' keyword");
                    if (((_m = tokens[index]) === null || _m === void 0 ? void 0 : _m.sort) != TokenSort.name)
                        throw new ParseError("invalid foreach statement: missing loop variable name");
                    const name = tokens[index++].text;
                    if (((_o = tokens[index++]) === null || _o === void 0 ? void 0 : _o.text) != '<' ||
                        ((_p = tokens[index++]) === null || _p === void 0 ? void 0 : _p.text) != '-' ||
                        ((_q = tokens[index++]) === null || _q === void 0 ? void 0 : _q.text) != '-')
                        throw new ParseError("invalid foreach statement: missing <-- operator");
                    const close = nextClosing(tokens, index);
                    const expr = Lab7.parseCompleteExpr(tokens.slice(index, close));
                    index = close + 1;
                    return new Lab7.ForEachNode(name, expr, parse());
                }
                case "return": {
                    if (((_r = tokens[index]) === null || _r === void 0 ? void 0 : _r.text) == ';')
                        return new Lab7.ReturnNode(null);
                    else {
                        const end = nextSemi();
                        const expr = Lab7.parseCompleteExpr(tokens.slice(index, end));
                        index = end;
                        return new Lab7.ReturnNode(expr);
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
                    if (((_s = tokens[index]) === null || _s === void 0 ? void 0 : _s.text) == '<' && ((_t = tokens[index + 1]) === null || _t === void 0 ? void 0 : _t.text) == '-') {
                        index += 2;
                        const end = nextSemi();
                        const expr = Lab7.parseCompleteExpr(tokens.slice(index, end));
                        index = end;
                        return new Lab7.AssignNode(name, expr);
                    }
                    else if (((_u = tokens[index]) === null || _u === void 0 ? void 0 : _u.text) == '(') {
                        index--;
                        const close = nextClosing(tokens, index + 2);
                        const [expr, newIndex] = parseExpr(tokens.slice(index, close + 1));
                        index += newIndex;
                        if (expr instanceof Lab7.CallNode) {
                            return expr;
                        }
                        else
                            throw new ParseError("invalid statement");
                    }
                    else
                        throw new ParseError("invalid statement");
                }
            }
        };
        return [parse(), index];
    };
    Lab7.parseFuncDecl = (tokens) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        let index = 0;
        if (((_a = tokens[index++]) === null || _a === void 0 ? void 0 : _a.text) != "def")
            throw new ParseError("invalid function declaration: missing 'def' keyword");
        if (((_b = tokens[index]) === null || _b === void 0 ? void 0 : _b.sort) != TokenSort.name)
            throw new ParseError("invalid function declaration: missing function name");
        const funcName = tokens[index++].text;
        if (((_c = tokens[index++]) === null || _c === void 0 ? void 0 : _c.text) != '(')
            throw new ParseError("invalid function declaration: missing open parenthesis");
        const params = [];
        while (((_d = tokens[index]) === null || _d === void 0 ? void 0 : _d.text) != ')') {
            if (((_e = tokens[index]) === null || _e === void 0 ? void 0 : _e.sort) != TokenSort.name)
                throw new ParseError("invalid parameter: missing name");
            const paramName = tokens[index++].text;
            if (((_f = tokens[index++]) === null || _f === void 0 ? void 0 : _f.text) != ':')
                throw new ParseError("invalid parameter: missing colon");
            const [paramType, newIndex] = parseType(tokens.slice(index));
            index += newIndex;
            params.push(new Lab7.FuncParam(paramName, paramType));
            if (((_g = tokens[index]) === null || _g === void 0 ? void 0 : _g.text) != ')' && ((_h = tokens[index++]) === null || _h === void 0 ? void 0 : _h.text) != ',')
                throw new ParseError("invalid parameter list: missing comma");
        }
        index++;
        let returnType;
        if (((_j = tokens[index]) === null || _j === void 0 ? void 0 : _j.text) == ':') {
            index++;
            const [type, newIndex] = parseType(tokens.slice(index));
            returnType = type;
            index += newIndex;
        }
        else
            returnType = null;
        if (((_k = tokens[index++]) === null || _k === void 0 ? void 0 : _k.text) != '{')
            throw new ParseError("invalid function declaration: missing opening brace");
        const [body, newIndex] = parseBlockNode(tokens.slice(index));
        index += newIndex;
        return [funcName, new Lab7.FuncDecl(params, returnType, body), index];
    };
    Lab7.parseProgram = (input) => {
        let tokens = tokenize(input);
        const prog = new Map;
        while (tokens.length > 0) {
            const [funcName, func, index] = Lab7.parseFuncDecl(tokens);
            if (prog.has(funcName))
                throw new ParseError("duplicate function name " + funcName);
            prog.set(funcName, func);
            tokens = tokens.slice(index);
        }
        return prog;
    };
    const unassociateElements = (exp) => {
        if (exp instanceof CommaNode)
            return [exp.leftSubtree].concat(unassociateElements(exp.rightSubtree));
        else
            return [exp];
    };
    const unassociateTernary = (exp) => {
        if (exp instanceof Lab7.NegateNode)
            return new Lab7.NegateNode(unassociateTernary(exp.subtree));
        else if (exp instanceof Lab7.ToStringNode)
            return new Lab7.ToStringNode(unassociateTernary(exp.subtree));
        else if (exp instanceof Lab7.PlusNode)
            return new Lab7.PlusNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.TimesNode)
            return new Lab7.TimesNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.AndNode)
            return new Lab7.AndNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.IndexNode)
            return new Lab7.IndexNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.LessThanNode)
            return new Lab7.LessThanNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.EqualNode)
            return new Lab7.EqualNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof Lab7.GreaterThanNode)
            return new Lab7.GreaterThanNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree));
        else if (exp instanceof ConditionalNode1) {
            if (exp.rightSubtree instanceof ConditionalNode2)
                return new Lab7.ConditionalNode(unassociateTernary(exp.leftSubtree), unassociateTernary(exp.rightSubtree.leftSubtree), unassociateTernary(exp.rightSubtree.rightSubtree));
            else
                throw new ParseError("mismatched ?:");
        }
        else if (exp instanceof ConditionalNode2)
            throw new ParseError("mismatched ?:");
        else if (exp instanceof Lab7.ArrayNode)
            return new Lab7.ArrayNode(exp.elementType, exp.subtreeArray.map(unassociateTernary));
        else if (exp instanceof Lab7.CallNode)
            return new Lab7.CallNode(exp.funcName, exp.argArray.map(unassociateTernary));
        else
            return exp;
    };
    const desugar = (tree) => {
        if (tree instanceof Lab7.ArrayNode)
            return new Lab7.ArrayNode(tree.elementType, tree.subtreeArray.map(desugar));
        else if (tree instanceof Lab7.NegateNode)
            return new Lab7.NegateNode(desugar(tree.subtree));
        else if (tree instanceof Lab7.ToStringNode)
            return new Lab7.ToStringNode(desugar(tree.subtree));
        else if (tree instanceof Lab7.PlusNode)
            return new Lab7.PlusNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab7.TimesNode)
            return new Lab7.TimesNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab7.AndNode)
            return new Lab7.AndNode(tree.leftSubtree, tree.rightSubtree);
        else if (tree instanceof Lab7.IndexNode)
            return new Lab7.IndexNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab7.LessThanNode)
            return new Lab7.LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab7.EqualNode)
            return new Lab7.EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree));
        else if (tree instanceof Lab7.GreaterThanNode)
            return new Lab7.AndNode(new Lab7.NegateNode(new Lab7.LessThanNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree))), new Lab7.NegateNode(new Lab7.EqualNode(desugar(tree.leftSubtree), desugar(tree.rightSubtree))));
        else if (tree instanceof Lab7.ConditionalNode)
            return new Lab7.ConditionalNode(desugar(tree.conditionSubtree), desugar(tree.trueBranchSubtree), desugar(tree.falseBranchSubtree));
        else if (tree instanceof Lab7.CallNode)
            return new Lab7.CallNode(tree.funcName, tree.argArray.map(desugar));
        else
            return tree;
    };
    Lab7.parseCompleteExpr = (tokens) => {
        const shunted = shunt(tokens);
        const [expr, index] = parseExpr(shunted);
        if (index < shunted.length)
            throw new ParseError("leftover tokens: " + tokens.slice(index).join(", "));
        return desugar(unassociateTernary(expr));
    };
    function expandExpr(env, tree) {
        if (tree instanceof ConstLeaf)
            return env.get(tree.name);
        else if (tree instanceof Lab7.NegateNode)
            return new Lab7.NegateNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab7.ToStringNode)
            return new Lab7.ToStringNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab7.PlusNode)
            return new Lab7.PlusNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.TimesNode)
            return new Lab7.TimesNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.AndNode)
            return new Lab7.AndNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.LessThanNode)
            return new Lab7.LessThanNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.EqualNode)
            return new Lab7.EqualNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.IndexNode)
            return new Lab7.IndexNode(expandExpr(env, tree.leftSubtree), expandExpr(env, tree.rightSubtree));
        else if (tree instanceof Lab7.ConditionalNode)
            return new Lab7.ConditionalNode(expandExpr(env, tree.conditionSubtree), expandExpr(env, tree.trueBranchSubtree), expandExpr(env, tree.falseBranchSubtree));
        else if (tree instanceof Lab7.ArrayNode)
            return new Lab7.ArrayNode(tree.elementType, tree.subtreeArray.map(subtree => expandExpr(env, subtree)));
        else if (tree instanceof Lab7.CallNode)
            return new Lab7.CallNode(tree.funcName, tree.argArray.map(arg => expandExpr(env, arg)));
        else
            return tree;
    }
    Lab7.expandExpr = expandExpr;
    function expandStmt(env, tree) {
        if (tree instanceof Lab7.OutputNode)
            return new Lab7.OutputNode(expandExpr(env, tree.subtree));
        else if (tree instanceof Lab7.VarDeclNode)
            return new Lab7.VarDeclNode(tree.varName, tree.varType, expandExpr(env, tree.subtree));
        else if (tree instanceof Lab7.AssignNode)
            return new Lab7.AssignNode(tree.varName, expandExpr(env, tree.subtree));
        else if (tree instanceof Lab7.BlockNode)
            return new Lab7.BlockNode(tree.stmtArray.map(stmt => expandStmt(env, stmt)));
        else if (tree instanceof Lab7.IfNode)
            return new Lab7.IfNode(expandExpr(env, tree.conditional), expandStmt(env, tree.trueBranch), tree.falseBranch == null ? null : expandStmt(env, tree.falseBranch));
        else if (tree instanceof Lab7.WhileNode)
            return new Lab7.WhileNode(expandExpr(env, tree.conditional), expandStmt(env, tree.body));
        else if (tree instanceof Lab7.ForEachNode)
            return new Lab7.ForEachNode(tree.varName, expandExpr(env, tree.arrayExpr), expandStmt(env, tree.body));
        else if (tree instanceof Lab7.CallNode)
            return new Lab7.CallNode(tree.funcName, tree.argArray.map(arg => expandExpr(env, arg)));
        else // tree instance of ReturnNode
            return new Lab7.ReturnNode(tree.returnExpr == null ? null : expandExpr(env, tree.returnExpr));
    }
    Lab7.expandStmt = expandStmt;
    function expandProg(env, prog) {
        const newProg = new Map;
        for (const [funcName, func] of prog.entries())
            newProg.set(funcName, new Lab7.FuncDecl(func.parameterArray, func.returnType, expandStmt(env, func.body)));
        return newProg;
    }
    Lab7.expandProg = expandProg;
})(Lab7 || (Lab7 = {}));
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ASTTreeElement_shadowRoot, _ASTTreeElement_BRANCH_MARGIN_PIXELS, _ASTTreeElement_EDGE_HEIGHT_LINES;
class ASTTreeElement extends HTMLElement {
    constructor() {
        super();
        _ASTTreeElement_shadowRoot.set(this, void 0);
        __classPrivateFieldSet(this, _ASTTreeElement_shadowRoot, this.attachShadow({ mode: "open" }), "f");
        const template = document.createElement("template");
        template.innerHTML = `
      <div>
        <svg id="ast-frame"></svg>
        <slot></slot>
      </div>
    `;
        __classPrivateFieldGet(this, _ASTTreeElement_shadowRoot, "f").appendChild(template.content.cloneNode(true));
    }
    render() {
        var _b;
        const frame = __classPrivateFieldGet(this, _ASTTreeElement_shadowRoot, "f").querySelector("#ast-frame");
        const positionGroup = frame.appendChild(createElementSVG("g"));
        const rootSVG = positionGroup.appendChild(createElementSVG("text"));
        rootSVG.innerHTML = (_b = this.getAttribute("data-name")) !== null && _b !== void 0 ? _b : "";
        const rootBox = rootSVG.getBBox();
        const height = rootBox.height * __classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_EDGE_HEIGHT_LINES);
        positionGroup.setAttribute("transform", `translate(0 ${rootBox.height.toString()})`);
        rootSVG.setAttribute("stroke", "black");
        rootSVG.setAttribute("stroke-width", "0.25");
        const subtrees = Array.from(this.querySelectorAll(":scope > ast-node"), subtree => {
            const outerGroup = positionGroup.appendChild(createElementSVG("g"));
            outerGroup.appendChild(subtree.render());
            return outerGroup;
        });
        const maxSubtreeHeight = subtrees.length == 0 ?
            0 :
            Math.max(...subtrees.map(subtree => subtree.getBBox().height));
        frame.setAttribute("height", (1.1 * (rootBox.height + height + maxSubtreeHeight)).toString());
        let width = 0;
        for (const subtree of subtrees) {
            subtree.setAttribute("transform", `translate(${width.toString()} ${height.toString()})`);
            width += __classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS) + subtree.getBBox().width;
        }
        width = __classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS) + Math.max(width, rootBox.width);
        const origin = {
            x: (width - __classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS)) / 2,
            y: rootBox.height
        };
        frame.setAttribute("width", width.toString());
        const rootX = subtrees.length > 0 ?
            origin.x - (rootBox.width / 2) :
            __classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS) / 2;
        rootSVG.setAttribute("x", rootX.toString());
        let subtreeX = 0;
        for (const subtree of subtrees) {
            const subtreeWidth = subtree.getBBox().width;
            subtreeX += (__classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS) + subtreeWidth) / 2;
            const line = frame.appendChild(createElementSVG("line"));
            line.setAttribute("x1", origin.x.toString());
            line.setAttribute("y1", origin.y.toString());
            line.setAttribute("x2", subtreeX.toString());
            line.setAttribute("y2", (height + rootBox.height).toString());
            line.style.stroke = "black";
            subtreeX += (__classPrivateFieldGet(ASTTreeElement, _a, "f", _ASTTreeElement_BRANCH_MARGIN_PIXELS) + subtreeWidth) / 2;
        }
        return frame;
    }
    connectedCallback() {
        // stupid hack
        window.setTimeout(() => this.render(), 0);
    }
}
_a = ASTTreeElement, _ASTTreeElement_shadowRoot = new WeakMap();
_ASTTreeElement_BRANCH_MARGIN_PIXELS = { value: 20 };
_ASTTreeElement_EDGE_HEIGHT_LINES = { value: 2 };
class ASTNodeElement extends ASTTreeElement {
    constructor() { super(); }
    connectedCallback() { }
}
customElements.define("ast-tree", ASTTreeElement);
customElements.define("ast-node", ASTNodeElement);
window.onload = _ => {
    var _a;
    if ((_a = document.querySelector("title")) === null || _a === void 0 ? void 0 : _a.innerText.startsWith("Lab assignment 2")) {
        const list1In = document.getElementById("list1");
        const list1Out = document.getElementById("list1out");
        const concatenateOut = document.getElementById("concatenated");
        const prependIn = document.getElementById("prepend");
        const prependOut = document.getElementById("prepended");
        const reverseOut = document.getElementById("reversed");
        const removeIn = document.getElementById("remove");
        const removeOut = document.getElementById("removed");
        const interleaveIn = document.getElementById("interleave");
        const interleaveOut = document.getElementById("interleaved");
        const listValue = (list) => list.value ? fromArray(list.value.split(/\s*,\s*/).reverse()) : null;
        const updateAll = () => {
            const list1 = listValue(list1In);
            update(list1, list1Out);
            concatenateOut.innerText = concatenateAll(list1);
            update(prependToEach(prependIn.value, list1), prependOut);
            update(reverse(list1), reverseOut);
            update(removeAll(removeIn.value, list1), removeOut);
            update(interleave(list1, listValue(interleaveIn)), interleaveOut);
        };
        updateAll();
        list1In.oninput = updateAll;
        prependIn.oninput = _ => {
            update(prependToEach(prependIn.value, listValue(list1In)), prependOut);
        };
        removeIn.oninput = _ => {
            update(removeAll(removeIn.value, listValue(list1In)), removeOut);
        };
        interleaveIn.oninput = _ => {
            update(interleave(listValue(list1In), listValue(interleaveIn)), interleaveOut);
        };
    }
};
function clearChildren(element) {
    while (element.firstChild)
        element.removeChild(element.firstChild);
}
function render(list, listElement) {
    if (list != null) {
        const stringElement = document.createElement("li");
        stringElement.innerText = list.head;
        listElement.appendChild(stringElement);
        render(list.tail, listElement);
    }
}
function update(list, listElement) {
    clearChildren(listElement);
    render(list, listElement);
}
var Lab3;
(function (Lab3) {
    Lab3.update = () => {
        const source = document.getElementById("source");
        const parens = document.getElementById("parens");
        const result = document.getElementById("result");
        const ast = document.getElementById("ast");
        const nodeCountElem = document.getElementById("nodeCount");
        const leafCountElem = document.getElementById("leafCount");
        const maxNumElem = document.getElementById("maxNum");
        const doubleAllLeavesElem = document.getElementById("doubleAllLeaves");
        const doubleAllLeavesStrElem = document.getElementById("doubleAllLeavesStr");
        const removeAllNegationsElem = document.getElementById("removeAllNegations");
        const removeAllNegationsStrElem = document.getElementById("removeAllNegationsStr");
        const tree = parseTree(source.value);
        if (tree == null) {
            ast.innerHTML = "<span>error: invalid input</span>";
            parens.innerHTML = "";
            result.innerHTML = "";
            nodeCountElem.innerHTML = "";
            leafCountElem.innerHTML = "";
            maxNumElem.innerHTML = "";
            doubleAllLeavesElem.innerHTML = "";
            doubleAllLeavesStrElem.innerHTML = "";
            removeAllNegationsElem.innerHTML = "";
            removeAllNegationsStrElem.innerHTML = "";
        }
        else {
            ast.innerHTML = renderTree(tree).outerHTML;
            parens.innerHTML = Lab3.astToString(tree);
            result.innerHTML = Lab3.interpret(tree).toString();
            nodeCountElem.innerHTML = Lab3.nodeCount(tree).toString();
            leafCountElem.innerHTML = Lab3.leafCount(tree).toString();
            maxNumElem.innerHTML = Lab3.maxNum(tree).toString();
            doubleAllLeavesElem.innerHTML = renderTree(Lab3.doubleAllLeaves(tree)).outerHTML;
            doubleAllLeavesStrElem.innerHTML = Lab3.astToString(Lab3.doubleAllLeaves(tree));
            removeAllNegationsElem.innerHTML = renderTree(Lab3.removeAllNegations(tree)).outerHTML;
            removeAllNegationsStrElem.innerHTML = Lab3.astToString(Lab3.removeAllNegations(tree));
        }
    };
    const renderTree = (tree) => {
        const treeElement = document.createElement("ast-tree");
        treeElement.appendChild(renderNode(tree));
        return treeElement;
    };
    const renderNode = (tree) => {
        const rootElement = document.createElement("ast-node");
        if (tree instanceof Lab3.NumLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab3.PlusNode) {
            rootElement.setAttribute("data-name", "+");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab3.NegateNode) {
            rootElement.setAttribute("data-name", "-");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        return rootElement;
    };
    const parseTree = (source) => {
        const tokens = Array.from(source.trim().matchAll(/(\d+(\.\d+)?)|[\w\(\)\+-]/g), (match, _) => match[0]);
        const parse = parseNode(tokens);
        if (parse == null)
            return null;
        const [tree, tail] = parse;
        if (tail.length != 0)
            return null;
        return tree;
    };
    const parseNode = tokens => { var _a, _b; return (_b = (_a = parsePlus(tokens)) !== null && _a !== void 0 ? _a : Lab3.parseNegate(tokens)) !== null && _b !== void 0 ? _b : parseAtom(tokens); };
    const parseAtom = tokens => { var _a; return (_a = parseNum(tokens)) !== null && _a !== void 0 ? _a : Lab3.parseParens(tokens); };
    Lab3.parseParens = tokens => {
        const [head, ...tail] = tokens;
        if (head != '(')
            return null;
        const parse = parseNode(tail);
        if (parse == null)
            return null;
        const [tree, [head2, ...tail2]] = parse;
        if (head2 !== ')')
            return null;
        return [tree, tail2];
    };
    const parseNum = tokens => {
        const [head, ...tail] = tokens;
        if (head == undefined)
            return null;
        const value = parseFloat(head);
        if (!isFinite(value))
            return null;
        return [new Lab3.NumLeaf(value), tail];
    };
    Lab3.parseNegate = tokens => {
        var _a;
        const [head, ...tail] = tokens;
        if (head != '-')
            return null;
        const parse = (_a = Lab3.parseNegate(tail)) !== null && _a !== void 0 ? _a : parseAtom(tail);
        if (parse == null)
            return null;
        const [tree, tail2] = parse;
        return [new Lab3.NegateNode(tree), tail2];
    };
    const parsePlus = tokens => {
        var _a, _b, _c;
        const parse1 = (_a = Lab3.parseNegate(tokens)) !== null && _a !== void 0 ? _a : parseAtom(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head, ...tail1]] = parse1;
        if (head != '+')
            return null;
        const parse2 = (_c = (_b = parsePlus(tail1)) !== null && _b !== void 0 ? _b : Lab3.parseNegate(tail1)) !== null && _c !== void 0 ? _c : parseAtom(tail1);
        if (parse2 == null)
            return null;
        const [tree2, tail2] = parse2;
        return [new Lab3.PlusNode(tree1, tree2), tail2];
    };
})(Lab3 || (Lab3 = {}));
var Lab4;
(function (Lab4) {
    const CONST_ATTR = "data-constant-name";
    Lab4.tree = null;
    Lab4.step1 = () => {
        const source = document.getElementById("source");
        const parens = document.getElementById("parens");
        const ast = document.getElementById("ast");
        const constants = document.getElementById("constants");
        const constantsForm = document.getElementById("constants_form");
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const result = document.getElementById("result");
        const astDoubleNeg = document.getElementById("ast_double_neg");
        const parensDoubleNeg = document.getElementById("parens_double_neg");
        const resultDoubleNeg = document.getElementById("result_double_neg");
        Lab4.tree = parseTree(source.value);
        if (Lab4.tree == null) {
            ast.innerHTML = "<span>error: invalid input</span>";
            parens.innerHTML = "";
            constantsForm.style.visibility = "hidden";
            constantsForm.setAttribute("disabled", "disabled");
        }
        else {
            ast.innerHTML = renderTree(Lab4.tree).outerHTML;
            parens.innerHTML = Lab4.astToString(Lab4.tree);
            const constantNames = allConstantNames(Lab4.tree);
            constants.innerHTML =
                constantNames.size > 0
                    ? renderConsts(constantNames)
                        .map(row => row.outerHTML)
                        .join("")
                    : "<tr><td>(no constants in expression)</td></tr>";
            constantsForm.style.visibility = "visible";
            constantsForm.setAttribute("disabled", "enabled");
        }
        expandedAST.innerHTML = "";
        expandedParens.innerHTML = "";
        result.innerHTML = "";
        astDoubleNeg.innerHTML = "";
        parensDoubleNeg.innerHTML = "";
        resultDoubleNeg.innerHTML = "";
    };
    Lab4.step2 = (tree) => {
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const result = document.getElementById("result");
        const astDoubleNeg = document.getElementById("ast_double_neg");
        const parensDoubleNeg = document.getElementById("parens_double_neg");
        const resultDoubleNeg = document.getElementById("result_double_neg");
        const missing = [];
        let anyMissing = false;
        const env = {};
        document.querySelectorAll(`[${CONST_ATTR}]`).forEach(elem => {
            const name = elem.getAttribute(CONST_ATTR);
            env[name] = parseValue(elem.value);
            if (env[name] == null) {
                missing.push(name);
                anyMissing = true;
            }
        });
        if (anyMissing) {
            expandedAST.innerHTML = `<span>error: invalid input for ${missing.join(", ")}</span>`;
            expandedParens.innerHTML = "";
            result.innerHTML = "";
            astDoubleNeg.innerHTML = "";
            parensDoubleNeg.innerHTML = "";
            resultDoubleNeg.innerHTML = "";
        }
        else {
            const expandedTree = Lab4.expandNamedConstants({ lookup: name => { var _a; return (_a = env[name]) !== null && _a !== void 0 ? _a : null; } }, tree);
            expandedAST.innerHTML = renderTree(expandedTree).outerHTML;
            expandedParens.innerHTML = Lab4.astToString(expandedTree);
            const optimizedTree = Lab4.removeDoubleNegations(expandedTree);
            try {
                result.innerText = Lab4.astToString(Lab4.interpret(expandedTree));
            }
            catch (e) {
                if (e instanceof Lab4.InterpreterError)
                    result.innerText = e.message;
            }
            astDoubleNeg.innerHTML = renderTree(optimizedTree).outerHTML;
            parensDoubleNeg.innerHTML = Lab4.astToString(optimizedTree);
            try {
                resultDoubleNeg.innerHTML = Lab4.astToString(Lab4.interpret(optimizedTree));
            }
            catch (e) {
                if (e instanceof Lab4.InterpreterError)
                    resultDoubleNeg.innerText = e.message;
            }
        }
    };
    const allConstantNames = (tree) => {
        if (tree instanceof Lab4.ConstLeaf)
            return new Set([tree.name]);
        else if (tree instanceof Lab4.UnaryNode)
            return allConstantNames(tree.subtree);
        else if (tree instanceof Lab4.BinaryNode)
            return new Set([
                ...allConstantNames(tree.leftSubtree),
                ...allConstantNames(tree.rightSubtree),
            ]);
        else if (tree instanceof Lab4.ConditionalNode)
            return new Set([
                ...allConstantNames(tree.conditionSubtree),
                ...allConstantNames(tree.trueBranchSubtree),
                ...allConstantNames(tree.falseBranchSubtree)
            ]);
        else
            return new Set;
    };
    const parseValue = (source) => {
        const floatVal = parseFloat(source);
        if (isFinite(floatVal))
            return new Lab4.NumLeaf(floatVal);
        else if (source.startsWith('"') && source.endsWith('"'))
            return new Lab4.StringLeaf(source.slice(1, -1));
        else if (source == "true")
            return new Lab4.BoolLeaf(true);
        else if (source == "false")
            return new Lab4.BoolLeaf(false);
        else
            return null;
    };
    const tokenize = (source) => {
        if (source == "")
            return [];
        const match = source.match(/^\s*(?:(?:"[^"]*?")|(?:\d+(?:\.\d+)?)|(?:\b[A-Za-z_][A-Za-z0-9_]*\b)|[<&*?:()@+-])\s*/);
        if (match == null)
            return null;
        const token = match[0];
        const rest = tokenize(source.slice(token.length));
        if (rest == null)
            return null;
        return [token.trim(), ...rest];
    };
    const parseTree = (source) => {
        const tokens = tokenize(source);
        if (tokens == null)
            return null;
        const parse = parsePreAST(tokens);
        if (parse == null)
            return null;
        const [tree, tail] = parse;
        if (tail.length != 0)
            return null;
        return tree;
    };
    const renderTree = (tree) => {
        const treeElement = document.createElement("ast-tree");
        treeElement.appendChild(renderNode(tree));
        return treeElement;
    };
    const renderNode = (tree) => {
        const rootElement = document.createElement("ast-node");
        if (tree instanceof Lab4.NumLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab4.BoolLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab4.StringLeaf) {
            rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
        }
        else if (tree instanceof Lab4.ConstLeaf) {
            rootElement.setAttribute("data-name", tree.name);
        }
        else if (tree instanceof Lab4.NegateNode) {
            rootElement.setAttribute("data-name", "-");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab4.ToStringNode) {
            rootElement.setAttribute("data-name", "@");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab4.PlusNode) {
            rootElement.setAttribute("data-name", "+");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab4.TimesNode) {
            rootElement.setAttribute("data-name", "*");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab4.AndNode) {
            rootElement.setAttribute("data-name", "&");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab4.LessThanNode) {
            rootElement.setAttribute("data-name", "<");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab4.ConditionalNode) {
            rootElement.setAttribute("data-name", "?:");
            rootElement.appendChild(renderNode(tree.conditionSubtree));
            rootElement.appendChild(renderNode(tree.trueBranchSubtree));
            rootElement.appendChild(renderNode(tree.falseBranchSubtree));
        }
        return rootElement;
    };
    const renderConsts = (names) => {
        const header = document.createElement("tr");
        header.innerHTML = "<th>Name</th><th>Value</th>";
        const rows = Array.from(names).map(name => {
            const id = "constant-" + name;
            const row = document.createElement("tr");
            const label = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("label"));
            label.setAttribute("for", id);
            label.innerText = name;
            const input = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("input"));
            input.setAttribute("type", "text");
            input.setAttribute("id", id);
            input.setAttribute(CONST_ATTR, name);
            return row;
        });
        return [header, ...rows];
    };
    const parsePreAST = tokens => parseTernary(tokens);
    const parseAtom = tokens => {
        var _a, _b, _c, _d;
        return (_d = (_c = (_b = (_a = parseNum(tokens)) !== null && _a !== void 0 ? _a : parseBool(tokens)) !== null && _b !== void 0 ? _b : parseString(tokens)) !== null && _c !== void 0 ? _c : parseParens(tokens)) !== null && _d !== void 0 ? _d : parseConst(tokens);
    };
    const parseParens = tokens => {
        const [head, ...tail] = tokens;
        if (head != '(')
            return null;
        const parse = parsePreAST(tail);
        if (parse == null)
            return null;
        const [tree, [head1, ...tail1]] = parse;
        if (head1 != ')')
            return null;
        return [tree, tail1];
    };
    const parseNum = tokens => {
        const [head, ...tail] = tokens;
        if (head == undefined)
            return null;
        const value = parseFloat(head);
        if (!isFinite(value))
            return null;
        return [new Lab4.NumLeaf(value), tail];
    };
    const parseBool = tokens => {
        const [head, ...tail] = tokens;
        switch (head) {
            case "true":
                return [new Lab4.BoolLeaf(true), tail];
                break;
            case "false":
                return [new Lab4.BoolLeaf(false), tail];
                break;
            default: return null;
        }
    };
    const parseString = tokens => {
        const [head, ...tail] = tokens;
        if (head == undefined || !head.startsWith("\"") || !head.endsWith("\""))
            return null;
        return [new Lab4.StringLeaf(head.slice(1, -1)), tail];
    };
    const parseConst = tokens => {
        const [head, ...tail] = tokens;
        if (head == undefined || !/[A-Z][A-Z_]*/.test(head))
            return null;
        return [new Lab4.ConstLeaf(head), tail];
    };
    const parseUnary = tokens => {
        var _a, _b;
        return (_b = (_a = parseNegate(tokens)) !== null && _a !== void 0 ? _a : parseToString(tokens)) !== null && _b !== void 0 ? _b : parseAtom(tokens);
    };
    const parseNegate = tokens => {
        const [head, ...tail] = tokens;
        if (head != '-')
            return null;
        const parse = parseUnary(tail);
        if (parse == null)
            return null;
        const [tree, tail1] = parse;
        return [new Lab4.NegateNode(tree), tail1];
    };
    const parseToString = tokens => {
        const [head, ...tail] = tokens;
        if (head != '@')
            return null;
        const parse = parseUnary(tail);
        if (parse == null)
            return null;
        const [tree, tail1] = parse;
        return [new Lab4.ToStringNode(tree), tail1];
    };
    const parseBinary4 = tokens => {
        var _a;
        return (_a = parseTimes(tokens)) !== null && _a !== void 0 ? _a : parseUnary(tokens);
    };
    const parseTimes = tokens => {
        const parse1 = parseUnary(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head, ...tail1]] = parse1;
        if (head != '*')
            return null;
        const parse2 = parseBinary4(tail1);
        if (parse2 == null)
            return null;
        const [tree2, tail2] = parse2;
        return [new Lab4.TimesNode(tree1, tree2), tail2];
    };
    const parseBinary3 = tokens => {
        var _a;
        return (_a = parsePlus(tokens)) !== null && _a !== void 0 ? _a : parseBinary4(tokens);
    };
    const parsePlus = tokens => {
        const parse1 = parseBinary4(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head, ...tail1]] = parse1;
        if (head != '+')
            return null;
        const parse2 = parseBinary3(tail1);
        if (parse2 == null)
            return null;
        const [tree2, tail2] = parse2;
        return [new Lab4.PlusNode(tree1, tree2), tail2];
    };
    const parseBinary2 = tokens => {
        var _a;
        return (_a = parseLessThan(tokens)) !== null && _a !== void 0 ? _a : parseBinary3(tokens);
    };
    const parseLessThan = tokens => {
        const parse1 = parseBinary3(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head, ...tail1]] = parse1;
        if (head != '<')
            return null;
        const parse2 = parseBinary2(tail1);
        if (parse2 == null)
            return null;
        const [tree2, tail2] = parse2;
        return [new Lab4.LessThanNode(tree1, tree2), tail2];
    };
    const parseBinary1 = tokens => {
        var _a;
        return (_a = parseAnd(tokens)) !== null && _a !== void 0 ? _a : parseBinary2(tokens);
    };
    const parseAnd = tokens => {
        const parse1 = parseBinary2(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head, ...tail1]] = parse1;
        if (head != '&')
            return null;
        const parse2 = parseBinary1(tail1);
        if (parse2 == null)
            return null;
        const [tree2, tail2] = parse2;
        return [new Lab4.AndNode(tree1, tree2), tail2];
    };
    const parseTernary = tokens => {
        var _a;
        return (_a = parseConditional(tokens)) !== null && _a !== void 0 ? _a : parseBinary1(tokens);
    };
    const parseConditional = tokens => {
        const parse1 = parseBinary1(tokens);
        if (parse1 == null)
            return null;
        const [tree1, [head1, ...tail1]] = parse1;
        if (head1 != '?')
            return null;
        const parse2 = parseTernary(tail1);
        if (parse2 == null)
            return null;
        const [tree2, [head2, ...tail2]] = parse2;
        if (head2 != ':')
            return null;
        const parse3 = parseTernary(tail2);
        if (parse3 == null)
            return null;
        const [tree3, tail3] = parse3;
        return [new Lab4.ConditionalNode(tree1, tree2, tree3), tail3];
    };
})(Lab4 || (Lab4 = {}));
var Lab5;
(function (Lab5) {
    Lab5.step1 = () => {
        const source = document.getElementById("source");
        const tokensElem = document.getElementById("tokens");
        const ast = document.getElementById("parse");
        const parens = document.getElementById("parens");
        const desugared = document.getElementById("desugared");
        const desugaredParens = document.getElementById("desugared_parens");
        try {
            const tokens = Lab5.tokenize(source.value);
            tokensElem.innerText = Lab5.tokenListToString(tokens);
            const tree = Lab5.parse(tokens);
            ast.innerHTML = renderTree(tree).outerHTML;
            parens.innerText = Lab5.astToString(tree);
            const tree1 = Lab5.desugar(tree);
            desugared.innerHTML = renderTree(tree1).outerHTML;
            desugaredParens.innerText = Lab5.astToString(tree1);
        }
        catch (e) {
            parens.innerText = "";
            desugared.innerText = "";
            desugaredParens.innerText = "";
            if (e instanceof Error) {
                if (e.constructor == Lab5.TokenizingError) {
                    tokensElem.innerText = "tokenizing error, " + e["message"];
                    ast.innerText = "";
                }
                else if (e.constructor == Lab5.ParsingError) {
                    ast.innerText = "parsing error, " + e["message"];
                }
            }
            else
                throw e;
        }
    };
    const renderTree = (tree) => {
        const treeElement = document.createElement("ast-tree");
        treeElement.appendChild(renderNode(tree));
        return treeElement;
    };
    const renderNode = (tree) => {
        const rootElement = document.createElement("ast-node");
        if (tree instanceof Lab5.NumLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab5.BoolLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab5.StringLeaf) {
            rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
        }
        else if (tree instanceof Lab5.NameLeaf) {
            rootElement.setAttribute("data-name", tree.name);
        }
        else if (tree instanceof Lab5.NegateNode) {
            rootElement.setAttribute("data-name", "-");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab5.ToStringNode) {
            rootElement.setAttribute("data-name", "@");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab5.PlusNode) {
            rootElement.setAttribute("data-name", "+");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.TimesNode) {
            rootElement.setAttribute("data-name", "*");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.AndNode) {
            rootElement.setAttribute("data-name", "&");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.LessThanNode) {
            rootElement.setAttribute("data-name", "<");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.EqualNode) {
            rootElement.setAttribute("data-name", "=");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.GreaterThanNode) {
            rootElement.setAttribute("data-name", ">");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab5.ConditionalNode) {
            rootElement.setAttribute("data-name", "?:");
            rootElement.appendChild(renderNode(tree.conditionSubtree));
            rootElement.appendChild(renderNode(tree.trueBranchSubtree));
            rootElement.appendChild(renderNode(tree.falseBranchSubtree));
        }
        return rootElement;
    };
})(Lab5 || (Lab5 = {}));
const oldWindowLoad6 = window.onload;
window.onload = event => {
    var _a;
    if (oldWindowLoad6)
        oldWindowLoad6.bind(window)(event);
    if ((_a = document.querySelector("title")) === null || _a === void 0 ? void 0 : _a.innerText.startsWith("Lab assignment 6")) {
        const constantsSubmit = document.getElementById("constants_submit");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        Lab6.inputType = null;
        constantsSubmit.setAttribute("disabled", "disabled");
        go.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        input.setAttribute("disabled", "disabled");
        input.value = "";
        inputSubmit.setAttribute("disabled", "disabled");
    }
};
var Lab6;
(function (Lab6) {
    let pageTree;
    let pageProgram;
    const CONST_ATTR = "data-constant-name";
    Lab6.step1 = () => {
        const source = document.getElementById("source");
        const parse = document.getElementById("parse");
        const parens = document.getElementById("parens");
        const constants = document.getElementById("constants");
        const constantsForm = document.getElementById("constants_form");
        const constantsSubmit = document.getElementById("constants_submit");
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const typecheck = document.getElementById("typecheck");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        const output = document.getElementById("output");
        Lab6.inputType = null;
        constantsSubmit.setAttribute("disabled", "disabled");
        expandedAST.innerHTML = "";
        expandedParens.innerHTML = "";
        typecheck.innerHTML = "";
        output.innerHTML = "";
        input.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        inputSubmit.setAttribute("disabled", "disabled");
        go.setAttribute("disabled", "disabled");
        try {
            pageTree = Lab6.parseProgram(source.value);
            parse.innerHTML = renderTree(pageTree).outerHTML;
            parens.innerText = Lab6.programToString(pageTree);
            const constantNames = allConstantNames(pageTree);
            constants.innerHTML =
                constantNames.size > 0
                    ? renderConsts(constantNames)
                        .map(row => row.outerHTML)
                        .join("")
                    : "<tr><td>(no constants in expression)</td></tr>";
            constantsForm.style.visibility = "visible";
            constantsSubmit.removeAttribute("disabled");
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab6.TokenizingError) {
                    parse.innerHTML = "tokenizing error: " + e["message"];
                    parens.innerText = "";
                    constantsForm.style.visibility = "hidden";
                }
                else if (e.constructor == Lab6.ParseError) {
                    parse.innerHTML = "parse error: " + e["message"];
                    parens.innerText = "";
                    constantsForm.style.visibility = "hidden";
                }
                else
                    console.error(e);
            }
        }
    };
    Lab6.step2 = () => {
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const typecheck = document.getElementById("typecheck");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        const output = document.getElementById("output");
        Lab6.inputType = null;
        input.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        inputSubmit.setAttribute("disabled", "disabled");
        output.innerHTML = "";
        try {
            const env = new Map;
            document.querySelectorAll(`[${CONST_ATTR}]`).forEach(elem => {
                const name = elem.getAttribute(CONST_ATTR);
                const value = Lab6.parseCompleteExpr(Lab6.tokenize(elem.value));
                if (!Lab6.isValue(value))
                    throw new Lab6.ParseError(`invalid value for ${name}: ${Lab6.exprToString(value)}`);
                env.set(name, value);
            });
            pageProgram = pageTree.map(subtree => Lab6.expandStmt(env, subtree));
            expandedAST.innerHTML = renderTree(pageProgram).outerHTML;
            expandedParens.innerHTML = Lab6.programToString(pageProgram);
            go.removeAttribute("disabled");
            Lab6.typecheckProg(pageProgram);
            typecheck.innerHTML = "OK!";
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab6.ParseError) {
                    expandedAST.innerHTML = "parse error: " + e["message"];
                    expandedParens.innerHTML = "";
                    typecheck.innerHTML = "";
                    go.setAttribute("disabled", "disabled");
                }
                else if (e.constructor == Lab6.TypeError)
                    typecheck.innerHTML = "type error: " + e["message"];
                else
                    console.error(e);
            }
        }
    };
    Lab6.step3 = () => __awaiter(this, void 0, void 0, function* () {
        const inputLabel = document.getElementById("input_label");
        const go = document.getElementById("go");
        const output = document.getElementById("output");
        Lab6.inputType = null;
        output.innerText = "";
        go.setAttribute("disabled", "disabled");
        try {
            yield Lab6.run(pageProgram);
            go.removeAttribute("disabled");
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab6.RuntimeError) {
                    go.removeAttribute("disabled");
                    output.innerText += "\nRuntime error: " + e["message"];
                }
                else if (e.constructor != InterruptError)
                    console.error(e);
            }
        }
        finally {
            inputLabel.innerText = "Not running.";
        }
    });
    const wait = (time) => __awaiter(this, void 0, void 0, function* () { return new Promise(handler => setTimeout(handler, time)); });
    Lab6.inputValue = null;
    Lab6.inputType = null;
    class InterruptError extends Error {
    }
    Lab6.runtime = {
        input: (type) => __awaiter(this, void 0, void 0, function* () {
            const input = document.getElementById("input");
            const inputLabel = document.getElementById("input_label");
            const inputSubmit = document.getElementById("input_submit");
            inputLabel.innerText = `Enter input of type ${Lab6.typeToString(type)}: `;
            input.removeAttribute("disabled");
            inputSubmit.removeAttribute("disabled");
            Lab6.inputType = type;
            while (Lab6.inputValue == null) {
                yield wait(100);
                if (Lab6.inputType == null)
                    throw new InterruptError;
            }
            Lab6.inputType = null;
            inputLabel.innerText = "Executing...";
            input.setAttribute("disabled", "disabled");
            input.value = "";
            inputSubmit.setAttribute("disabled", "disabled");
            const value = Lab6.inputValue;
            Lab6.inputValue = null;
            return value;
        }),
        output: value => {
            const output = document.getElementById("output");
            output.innerText += "\n" + Lab6.exprToString(value);
        }
    };
    Lab6.submitInput = () => {
        const input = document.getElementById("input");
        const output = document.getElementById("output");
        try {
            const expr = Lab6.parseCompleteExpr(Lab6.tokenize(input.value));
            if (Lab6.isValue(expr) && Lab6.equalTypes(Lab6.inferExprType(new Map, expr), Lab6.inputType)) {
                Lab6.inputValue = expr;
            }
            else
                output.innerText += "\nInvalid input, try again.";
        }
        catch (e) {
            output.innerText += "\nInvalid input, try again.";
        }
    };
    const renderTree = (tree) => {
        const treeElement = document.createElement("ast-tree");
        treeElement.appendChild(renderNode(tree));
        return treeElement;
    };
    // helps catch missing cases at compile-time
    const assertNever = (_) => {
        throw new Error("missing case in type narrowing");
    };
    const renderNode = (tree) => {
        const rootElement = document.createElement("ast-node");
        if (tree instanceof Lab6.NumLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab6.BoolLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab6.StringLeaf) {
            rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
        }
        else if (tree instanceof Lab6.NameLeaf) {
            rootElement.setAttribute("data-name", tree.name);
        }
        else if (tree instanceof Lab6.InputLeaf) {
            rootElement.setAttribute("data-name", "input(" + Lab6.typeToString(tree.inputType) + ")");
        }
        else if (tree instanceof Lab6.ArrayNode) {
            const elemString = tree.subtreeArray.length > 0 ? "[...]" : "[]";
            rootElement.setAttribute("data-name", Lab6.typeToString(tree.elementType) + elemString);
            for (const subtree of tree.subtreeArray)
                rootElement.appendChild(renderNode(subtree));
        }
        else if (tree instanceof Lab6.NegateNode) {
            rootElement.setAttribute("data-name", "-");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab6.ToStringNode) {
            rootElement.setAttribute("data-name", "@");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab6.PlusNode) {
            rootElement.setAttribute("data-name", "+");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.TimesNode) {
            rootElement.setAttribute("data-name", "*");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.AndNode) {
            rootElement.setAttribute("data-name", "&");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.LessThanNode) {
            rootElement.setAttribute("data-name", "<");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.EqualNode) {
            rootElement.setAttribute("data-name", "=");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.GreaterThanNode) {
            rootElement.setAttribute("data-name", ">");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.IndexNode) {
            rootElement.setAttribute("data-name", "#");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab6.ConditionalNode) {
            rootElement.setAttribute("data-name", "?:");
            rootElement.appendChild(renderNode(tree.conditionSubtree));
            rootElement.appendChild(renderNode(tree.trueBranchSubtree));
            rootElement.appendChild(renderNode(tree.falseBranchSubtree));
        }
        else if (tree instanceof Lab6.OutputNode) {
            rootElement.setAttribute("data-name", "output(...)");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab6.VarDeclNode) {
            rootElement.setAttribute("data-name", `var ${tree.varName} : ${Lab6.typeToString(tree.varType)} <- ...`);
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab6.AssignNode) {
            rootElement.setAttribute("data-name", `${tree.varName} <- ...`);
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (Array.isArray(tree)) {
            rootElement.setAttribute("data-name", "Program");
            for (const subtree of tree)
                rootElement.appendChild(renderNode(subtree));
        }
        else
            assertNever(tree);
        return rootElement;
    };
    const union = (...sets) => sets.reduce((set1, set2) => new Set([...set1, ...set2]), new Set());
    const allConstantNames = (tree) => {
        if (tree instanceof Lab6.ConstLeaf)
            return new Set([tree.name]);
        if (tree instanceof Lab6.ArrayNode)
            return union(...tree.subtreeArray.map(allConstantNames));
        else if (tree instanceof Lab6.UnaryNode)
            return allConstantNames(tree.subtree);
        else if (tree instanceof Lab6.BinaryNode)
            return union(allConstantNames(tree.leftSubtree), allConstantNames(tree.rightSubtree));
        else if (tree instanceof Lab6.ConditionalNode)
            return union(allConstantNames(tree.conditionSubtree), allConstantNames(tree.trueBranchSubtree), allConstantNames(tree.falseBranchSubtree));
        else if (Array.isArray(tree))
            return union(...tree.map(allConstantNames));
        else
            return new Set;
    };
    const renderConsts = (names) => {
        const header = document.createElement("tr");
        header.innerHTML = "<th>Name</th><th>Value</th>";
        const rows = Array.from(names).map(name => {
            const id = "constant-" + name;
            const row = document.createElement("tr");
            const label = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("label"));
            label.setAttribute("for", id);
            label.innerText = name;
            const input = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("input"));
            input.setAttribute("type", "text");
            input.setAttribute("id", id);
            input.setAttribute(CONST_ATTR, name);
            return row;
        });
        return [header, ...rows];
    };
})(Lab6 || (Lab6 = {}));
const oldWindowLoad7 = window.onload;
window.onload = event => {
    var _a;
    if (oldWindowLoad7)
        oldWindowLoad7.bind(window)(event);
    if ((_a = document.querySelector("title")) === null || _a === void 0 ? void 0 : _a.innerText.startsWith("Lab assignment 7")) {
        const constantsSubmit = document.getElementById("constants_submit");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        Lab7.inputType = null;
        constantsSubmit.setAttribute("disabled", "disabled");
        go.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        input.setAttribute("disabled", "disabled");
        input.value = "";
        inputSubmit.setAttribute("disabled", "disabled");
    }
};
var Lab7;
(function (Lab7) {
    let pageTree;
    let pageProgram;
    const CONST_ATTR = "data-constant-name";
    Lab7.step1 = () => {
        const source = document.getElementById("source");
        const parse = document.getElementById("parse");
        const parens = document.getElementById("parens");
        const constants = document.getElementById("constants");
        const constantsForm = document.getElementById("constants_form");
        const constantsSubmit = document.getElementById("constants_submit");
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const typecheck = document.getElementById("typecheck");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        const output = document.getElementById("output");
        Lab7.inputType = null;
        constantsSubmit.setAttribute("disabled", "disabled");
        expandedAST.innerHTML = "";
        expandedParens.innerHTML = "";
        typecheck.innerHTML = "";
        output.innerHTML = "";
        input.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        inputSubmit.setAttribute("disabled", "disabled");
        go.setAttribute("disabled", "disabled");
        try {
            pageTree = Lab7.parseProgram(source.value);
            parse.innerHTML = renderTree(pageTree).outerHTML;
            parens.innerText = Lab7.programToString(pageTree);
            const constantNames = allConstantNames(pageTree);
            constants.innerHTML =
                constantNames.size > 0
                    ? renderConsts(constantNames)
                        .map(row => row.outerHTML)
                        .join("")
                    : "<tr><td>(no constants in expression)</td></tr>";
            constantsForm.style.visibility = "visible";
            constantsSubmit.removeAttribute("disabled");
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab7.TokenizingError) {
                    parse.innerHTML = "tokenizing error: " + e["message"];
                    parens.innerText = "";
                    constantsForm.style.visibility = "hidden";
                }
                else if (e.constructor == Lab7.ParseError) {
                    parse.innerHTML = "parse error: " + e["message"];
                    parens.innerText = "";
                    constantsForm.style.visibility = "hidden";
                }
                else
                    console.error(e);
            }
        }
    };
    Lab7.step2 = () => {
        const expandedAST = document.getElementById("expanded_ast");
        const expandedParens = document.getElementById("expanded_parens");
        const typecheck = document.getElementById("typecheck");
        const go = document.getElementById("go");
        const input = document.getElementById("input");
        const inputLabel = document.getElementById("input_label");
        const inputSubmit = document.getElementById("input_submit");
        const output = document.getElementById("output");
        Lab7.inputType = null;
        input.setAttribute("disabled", "disabled");
        inputLabel.innerText = "Not running.";
        inputSubmit.setAttribute("disabled", "disabled");
        output.innerHTML = "";
        try {
            const env = new Map;
            document.querySelectorAll(`[${CONST_ATTR}]`).forEach(elem => {
                const name = elem.getAttribute(CONST_ATTR);
                const value = Lab7.parseCompleteExpr(Lab7.tokenize(elem.value));
                if (!Lab7.isValue(value))
                    throw new Lab7.ParseError(`invalid value for ${name}: ${Lab7.exprToString(value)}`);
                env.set(name, value);
            });
            pageProgram = Lab7.expandProg(env, pageTree);
            expandedAST.innerHTML = renderTree(pageProgram).outerHTML;
            expandedParens.innerHTML = Lab7.programToString(pageProgram);
            go.removeAttribute("disabled");
            Lab7.typecheckProg(pageProgram);
            typecheck.innerHTML = "OK!";
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab7.ParseError) {
                    expandedAST.innerHTML = "parse error: " + e["message"];
                    expandedParens.innerHTML = "";
                    typecheck.innerHTML = "";
                    go.setAttribute("disabled", "disabled");
                }
                else if (e.constructor == Lab7.TypeError)
                    typecheck.innerHTML = "type error: " + e["message"];
                else
                    console.error(e);
            }
        }
    };
    Lab7.step3 = () => __awaiter(this, void 0, void 0, function* () {
        const inputLabel = document.getElementById("input_label");
        const go = document.getElementById("go");
        const output = document.getElementById("output");
        Lab7.inputType = null;
        output.innerText = "";
        go.setAttribute("disabled", "disabled");
        try {
            yield Lab7.run(pageProgram);
            go.removeAttribute("disabled");
        }
        catch (e) {
            if (e instanceof Error) {
                if (e.constructor == Lab7.RuntimeError) {
                    go.removeAttribute("disabled");
                    output.innerText += "\nRuntime error: " + e["message"];
                }
                else if (e.constructor != InterruptError)
                    console.error(e);
            }
        }
        finally {
            inputLabel.innerText = "Not running.";
        }
    });
    const wait = (time) => __awaiter(this, void 0, void 0, function* () { return new Promise(handler => setTimeout(handler, time)); });
    Lab7.inputValue = null;
    Lab7.inputType = null;
    class InterruptError extends Error {
    }
    Lab7.runtime = {
        input: (type) => __awaiter(this, void 0, void 0, function* () {
            const input = document.getElementById("input");
            const inputLabel = document.getElementById("input_label");
            const inputSubmit = document.getElementById("input_submit");
            inputLabel.innerText = `Enter input of type ${Lab7.typeToString(type)}: `;
            input.removeAttribute("disabled");
            inputSubmit.removeAttribute("disabled");
            Lab7.inputType = type;
            while (Lab7.inputValue == null) {
                yield wait(100);
                if (Lab7.inputType == null)
                    throw new InterruptError;
            }
            Lab7.inputType = null;
            inputLabel.innerText = "Executing...";
            input.setAttribute("disabled", "disabled");
            input.value = "";
            inputSubmit.setAttribute("disabled", "disabled");
            const value = Lab7.inputValue;
            Lab7.inputValue = null;
            return value;
        }),
        output: value => {
            const output = document.getElementById("output");
            output.innerText += "\n" + Lab7.exprToString(value);
        }
    };
    Lab7.submitInput = () => {
        const input = document.getElementById("input");
        const output = document.getElementById("output");
        try {
            const expr = Lab7.parseCompleteExpr(Lab7.tokenize(input.value));
            if (Lab7.isValue(expr) && Lab7.equalTypes(Lab7.inferExprType(pageProgram, new Map, expr), Lab7.inputType)) {
                Lab7.inputValue = expr;
            }
            else
                output.innerText += "\nInvalid input, try again.";
        }
        catch (e) {
            output.innerText += "\nInvalid input, try again.";
        }
    };
    const renderTree = (tree) => {
        const treeElement = document.createElement("ast-tree");
        treeElement.appendChild(renderNode(tree));
        return treeElement;
    };
    // helps catch missing cases at compile-time
    const assertNever = (_) => {
        throw new Error("missing case in type narrowing");
    };
    const renderNode = (tree) => {
        const rootElement = document.createElement("ast-node");
        if (tree instanceof Lab7.NumLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab7.BoolLeaf) {
            rootElement.setAttribute("data-name", tree.value.toString());
        }
        else if (tree instanceof Lab7.StringLeaf) {
            rootElement.setAttribute("data-name", "\"" + tree.value + "\"");
        }
        else if (tree instanceof Lab7.NameLeaf) {
            rootElement.setAttribute("data-name", tree.name);
        }
        else if (tree instanceof Lab7.InputLeaf) {
            rootElement.setAttribute("data-name", "input(" + Lab7.typeToString(tree.inputType) + ")");
        }
        else if (tree instanceof Lab7.ArrayNode) {
            const elemString = tree.subtreeArray.length > 0 ? "[...]" : "[]";
            rootElement.setAttribute("data-name", Lab7.typeToString(tree.elementType) + elemString);
            for (const subtree of tree.subtreeArray)
                rootElement.appendChild(renderNode(subtree));
        }
        else if (tree instanceof Lab7.NegateNode) {
            rootElement.setAttribute("data-name", "-");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab7.ToStringNode) {
            rootElement.setAttribute("data-name", "@");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab7.PlusNode) {
            rootElement.setAttribute("data-name", "+");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.TimesNode) {
            rootElement.setAttribute("data-name", "*");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.AndNode) {
            rootElement.setAttribute("data-name", "&");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.LessThanNode) {
            rootElement.setAttribute("data-name", "<");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.EqualNode) {
            rootElement.setAttribute("data-name", "=");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.GreaterThanNode) {
            rootElement.setAttribute("data-name", ">");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.IndexNode) {
            rootElement.setAttribute("data-name", "#");
            rootElement.appendChild(renderNode(tree.leftSubtree));
            rootElement.appendChild(renderNode(tree.rightSubtree));
        }
        else if (tree instanceof Lab7.ConditionalNode) {
            rootElement.setAttribute("data-name", "?:");
            rootElement.appendChild(renderNode(tree.conditionSubtree));
            rootElement.appendChild(renderNode(tree.trueBranchSubtree));
            rootElement.appendChild(renderNode(tree.falseBranchSubtree));
        }
        else if (tree instanceof Lab7.OutputNode) {
            rootElement.setAttribute("data-name", "output(...)");
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab7.VarDeclNode) {
            rootElement.setAttribute("data-name", `var ${tree.varName} : ${Lab7.typeToString(tree.varType)} <- ...`);
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Lab7.AssignNode) {
            rootElement.setAttribute("data-name", `${tree.varName} <- ...`);
            rootElement.appendChild(renderNode(tree.subtree));
        }
        else if (tree instanceof Map) {
            rootElement.setAttribute("data-name", "Program");
            for (const [funcName, func] of tree.entries()) {
                const funcElement = rootElement.appendChild(document.createElement("ast-node"));
                const paramString = '(' +
                    func.parameterArray
                        .map(param => param.name + ": " + Lab7.typeToString(param.type))
                        .join(", ") +
                    ')';
                const typeString = func.returnType == null ? "" : `: ${Lab7.typeToString(func.returnType)}`;
                funcElement.setAttribute("data-name", "def " + funcName + paramString + typeString);
                funcElement.appendChild(renderNode(func.body));
            }
        }
        else if (tree instanceof Lab7.CallNode) {
            rootElement.setAttribute("data-name", tree.funcName);
            for (const subtree of tree.argArray)
                rootElement.appendChild(renderNode(subtree));
        }
        else if (tree instanceof Lab7.BlockNode) {
            const elemString = tree.stmtArray.length > 0 ? "{...}" : "{}";
            rootElement.setAttribute("data-name", elemString);
            for (const subtree of tree.stmtArray)
                rootElement.appendChild(renderNode(subtree));
        }
        else if (tree instanceof Lab7.IfNode) {
            const ifString = tree.falseBranch == null ? "if" : "if/else";
            rootElement.setAttribute("data-name", ifString);
            rootElement.appendChild(renderNode(tree.conditional));
            rootElement.appendChild(renderNode(tree.trueBranch));
            if (tree.falseBranch != null)
                rootElement.appendChild(renderNode(tree.falseBranch));
        }
        else if (tree instanceof Lab7.WhileNode) {
            rootElement.setAttribute("data-name", "while");
            rootElement.appendChild(renderNode(tree.conditional));
            rootElement.appendChild(renderNode(tree.body));
        }
        else if (tree instanceof Lab7.ForEachNode) {
            rootElement.setAttribute("data-name", "foreach (var " + tree.varName + " <-- ...)");
            rootElement.appendChild(renderNode(tree.arrayExpr));
            rootElement.appendChild(renderNode(tree.body));
        }
        else if (tree instanceof Lab7.ReturnNode) {
            rootElement.setAttribute("data-name", "return");
            if (tree.returnExpr != null)
                rootElement.appendChild(renderNode(tree.returnExpr));
        }
        else
            assertNever(tree);
        return rootElement;
    };
    const union = (...sets) => sets.reduce((set1, set2) => new Set([...set1, ...set2]), new Set());
    const allConstantNames = (tree) => {
        if (tree instanceof Lab7.ConstLeaf)
            return new Set([tree.name]);
        if (tree instanceof Lab7.ArrayNode)
            return union(...tree.subtreeArray.map(allConstantNames));
        else if (tree instanceof Lab7.UnaryNode)
            return allConstantNames(tree.subtree);
        else if (tree instanceof Lab7.BinaryNode)
            return union(allConstantNames(tree.leftSubtree), allConstantNames(tree.rightSubtree));
        else if (tree instanceof Lab7.ConditionalNode)
            return union(allConstantNames(tree.conditionSubtree), allConstantNames(tree.trueBranchSubtree), allConstantNames(tree.falseBranchSubtree));
        else if (tree instanceof Map) {
            let names = new Set;
            for (const func of tree.values())
                names = union(names, allConstantNames(func.body));
            return names;
        }
        else
            return new Set;
    };
    const renderConsts = (names) => {
        const header = document.createElement("tr");
        header.innerHTML = "<th>Name</th><th>Value</th>";
        const rows = Array.from(names).map(name => {
            const id = "constant-" + name;
            const row = document.createElement("tr");
            const label = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("label"));
            label.setAttribute("for", id);
            label.innerText = name;
            const input = row
                .appendChild(document.createElement("td"))
                .appendChild(document.createElement("input"));
            input.setAttribute("type", "text");
            input.setAttribute("id", id);
            input.setAttribute(CONST_ATTR, name);
            return row;
        });
        return [header, ...rows];
    };
})(Lab7 || (Lab7 = {}));
const oldWindowLoad8 = window.onload;
window.onload = event => {
    var _a;
    if (oldWindowLoad8)
        oldWindowLoad8.bind(window)(event);
    if ((_a = document.querySelector("title")) === null || _a === void 0 ? void 0 : _a.innerText.startsWith("Lab assignment 8")) {
        Lab8.updateAll();
        for (const elem of Array.from(document.getElementsByTagName("input")))
            elem.oninput = () => Lab8.updateAll();
    }
};
var Lab8;
(function (Lab8) {
    class ParseError extends Error {
    }
    const parseNum = (x) => {
        const num = parseFloat(x);
        if (isFinite(num))
            return num;
        else
            throw new ParseError("invalid number: " + x);
    };
    const listValue = (list) => {
        const splits = list.value.split(/\s*,\s*/);
        if (splits[splits.length - 1] === "")
            splits.pop();
        return list.value ? Lab8.fromArray(splits.map(parseNum)) : null;
    };
    Lab8.updateAll = () => {
        const html_list1 = document.getElementById("list1");
        const html_list1out = document.getElementById("list1out");
        const html_iterativeSum = document.getElementById("iterativeSum");
        const html_recursiveSum = document.getElementById("recursiveSum");
        const html_maximum = document.getElementById("maximum");
        const html_concatenate_list = document.getElementById("concatenate_list");
        const html_concatenated = document.getElementById("concatenated");
        const html_sumByFoldLeft = document.getElementById("sumByFoldLeft");
        const html_maximumByFoldRight = document.getElementById("maximumByFoldRight");
        const html_subtractByFoldLeft = document.getElementById("subtractByFoldLeft");
        const html_subtractByFoldRight = document.getElementById("subtractByFoldRight");
        const html_lookingFor = document.getElementById("lookingFor");
        const html_found = document.getElementById("found");
        const html_concatenateByFold = document.getElementById("concatenateByFold");
        const html_remove = document.getElementById("remove");
        const html_removed = document.getElementById("removed");
        try {
            const list1 = listValue(html_list1);
            html_list1out.innerHTML = render(list1);
            html_iterativeSum.innerText = Lab8.iterativeSum(list1).toString();
            html_recursiveSum.innerText = Lab8.recursiveSum(list1).toString();
            html_maximum.innerText = Lab8.maximum(list1).toString();
            try {
                const list2 = listValue(html_concatenate_list);
                html_concatenated.innerHTML = render(Lab8.concatenateRecursive(list1, list2));
                html_concatenateByFold.innerHTML = render(Lab8.concatenate(list1, list2));
            }
            catch (e) {
                if (e instanceof Error && e.constructor == ParseError) {
                    html_concatenated.innerHTML = "";
                    html_concatenateByFold.innerHTML = "";
                }
                else
                    throw e;
            }
            html_sumByFoldLeft.innerText = Lab8.sumByFoldLeft(list1).toString();
            html_maximumByFoldRight.innerText = Lab8.maximumByFoldRight(list1).toString();
            html_subtractByFoldLeft.innerText = Lab8.subtractByFoldLeft(list1).toString();
            html_subtractByFoldRight.innerText = Lab8.subtractByFoldRight(list1).toString();
            try {
                const value = parseNum(html_lookingFor.value);
                html_found.innerText = Lab8.anyEqualTo(value, list1).toString();
            }
            catch (e) {
                if (e instanceof Error && e.constructor == ParseError)
                    html_found.innerText = "";
                else
                    throw e;
            }
            try {
                const value = parseNum(html_remove.value);
                html_removed.innerHTML = render(Lab8.removeAll(value, list1));
            }
            catch (e) {
                if (e instanceof Error && e.constructor == ParseError)
                    html_removed.innerText = "";
                else
                    throw e;
            }
        }
        catch (e) {
            if (e instanceof Error && e.constructor == ParseError) {
                html_list1out.innerHTML = "";
                html_iterativeSum.innerHTML = "";
                html_recursiveSum.innerHTML = "";
                html_maximum.innerHTML = "";
                html_concatenated.innerHTML = "";
                html_sumByFoldLeft.innerHTML = "";
                html_maximumByFoldRight.innerHTML = "";
                html_subtractByFoldLeft.innerHTML = "";
                html_subtractByFoldRight.innerHTML = "";
                html_found.innerHTML = "";
                html_concatenateByFold.innerHTML = "";
                html_removed.innerHTML = "";
            }
            else
                throw e;
        }
    };
    const render = (list) => (list == null) ?
        "" :
        ("<li>" + list.head.toString() + "</li>" + render(list.tail));
})(Lab8 || (Lab8 = {}));
const createElementSVG = (tag) => document.createElementNS("http://www.w3.org/2000/svg", tag);
//# sourceMappingURL=bundle.js.map