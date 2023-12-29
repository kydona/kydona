import {tags as t} from '@lezer/highlight';

export const themeTags = {
    "comment" : {
        "default": t.comment,
        "block": t.blockComment,
        "line": t.lineComment,
        "doc": t.docComment,
    },
    "name": {
        "default": t.name,
        "variable": {
            "default": t.variableName,
            "special": t.special(t.variableName),
        },
        "type": t.typeName,
        "tag": t.tagName,
        "property": t.propertyName,
        "attribute": t.attributeName,
        "class": t.className,
        "label": t.labelName,
        "namespace": t.namespace,
        "macro": t.macroName,
    },
    "literal": {
        "default": t.literal,
        "special": t.special(t.literal),
        "bool" : t.bool,
        "regexp": t.regexp,
        "escape": t.escape,
        "color": t.color,
        "url": t.url,
        "string": { 
            "default": t.string,
            "special": t.special(t.string),
            "docstring": t.docString,
            "character": t.character,
            "attributeValue": t.attributeValue,
        },
        "number":{
            "default": t.number,
            "integer": t.integer,
            "float": t.float,
        },
    },
    "keyword": {
        "default" : t.keyword,
        "self": t.self,
        "null": t.null,
        "atom": t.atom,
        "unit": t.unit,
        "modifier": t.modifier,
        "operator": t.operatorKeyword,
        "control": t.controlKeyword,
        "definition": t.definitionKeyword,
        "module": t.moduleKeyword,
    },
    "operator": {
        "default": t.operator,
        "deref": t.derefOperator,
        "arithmetic": t.arithmeticOperator,
        "logic": t.logicOperator,
        "bitwise": t.bitwiseOperator,
        "compare": t.compareOperator,
        "update": t.updateOperator,
        "definition": t.definitionOperator,
        "type": t.typeOperator,
        "control": t.controlOperator,
    },
    "punctuation": {
        "default": t.punctuation,
        "separator": t.separator, 
        "bracket": {
            "default": t.bracket, // <>
            "angle": t.angleBracket, // <>
            "square": t.squareBracket, // []
            "parenthesis": t.paren, // ()
            "brace": t.brace, // {}
        }
    },
    "content" : { // Content, for example plain text in XML or markup documents.
        "default": t.content,
        "heading": {
            "default": t.heading,
            "heading1": t.heading1,
            "heading2": t.heading2,
            "heading3": t.heading3,
            "heading4": t.heading4,
            "heading5": t.heading5,
            "heading6": t.heading6,
        },
        "separator": t.contentSeparator, // A prose separator (such as a horizontal rule).
        "list": t.list,
        "quote": t.quote,
        "emphasis": t.emphasis,
        "strong": t.strong,
        "link": t.link,
        "monospace": t.monospace, // text styled as code or monospaced
        "strikethrough": t.strikethrough,
    },
    "changed":{
        "default": t.changed,
        "inserted" : t.inserted,
        "deleted" : t.deleted,
        "invalid": t.invalid,
    },
    "meta": { // metadata or meta-information
        "default": t.meta,
        "document": t.documentMeta, // metadata that applies to the entire document
        "annotation" : t.annotation, // metadata that annotates or adds attributes to a given syntactic element.
        "processing": t.processingInstruction, //  Processing instruction or preprocessor directive.
    }
}