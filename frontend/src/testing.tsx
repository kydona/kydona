
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';

import React from 'react';

// works with node js versions
/*
const jsxCode = `
function MyComponent() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}
`;

const ast = parser.parse(jsxCode, {
  sourceType: 'module',
  plugins: ['jsx']
});

traverse(ast, {
  enter(path) {
    // You can perform operations here on the AST nodes if needed
    // For instance, you can log each node type
    console.log(path.node.type);
  }
});

const transformedCode = generate(ast).code;
console.log(transformedCode);
*/

// works with standalone version
/*
// Your JavaScript code using Babel transformations
const code = 'const square = (x) => x * x;';

// Babel transformation using transform function from @babel/standalone
const transformedCode = Babel.transform(code, {
    presets: ['env']
}).code;

console.log(transformedCode);
*/
import * as parser from '@babel/parser';
import traverse from '@babel/traverse';

//function internalFunction() {
//    return (<div>Internal Function</div>);
//}
 
/*


<div className="myclass" test={test}>
{/*this is a comment/}
<div closing="self" func={a || b}/>
</div>
*/


const reactFunction1 = `
  const Component = (props) => {
    return (
        <>
            <Fragment key={mykey} className="yeet">
                <div>Hello</div>
            </Fragment>
            <div />
            <myCustomType />
        </>
    );
  }
`;

/*
const component = Function("props", `return (
    <>
        <Fragment key={mykey} className="yeet">
            <div>Hello</div>
        </Fragment>
        <div />
        <myCustomType />
    </>
);`)
*/

// conditional rendering

// seems to work
const reactFunction = `
  function Component(props ){
    const hasNotifications = props.hasNotifications;

    if (hasNotifications) {
      return(
        <p>You have unread notifications.</p>
    );
    } else {
      return(
        <p>No new notifications.</p>);
    }
  }
`;

const reactFunction3 = `
  function Component(props){
    const hasNotifications = props.hasNotifications;

  return (
    <div>
      {hasNotifications ? (
        <p>You have unread notifications.</p>
      ) : (
        <p>No new notifications.</p>
      )}
    </div>
  );
  }
`;

//Babel.registerPreset("@babel/preset-react", require("@babel/preset-react"));


import * as Babel from '@babel/standalone'
console.log(Babel.transform(reactFunction,  { presets: ["react"] }).code);



/*
<div>
   {hasNotifications ? <p>You have unread notifications.</p> : <p>No new notifications.</p>}
</div>

React.createElement("div", null, hasNotifications ? React.createElement("p", null, "You have unread notifications.") : React.createElement("p", null, "No new notifications."));

hasNotifications ? React.createElement("p", null, "You have unread notifications.") : React.createElement("p", null, "No new notifications.")

*/


/*
let htmlElementsSet = new Set([
    "html", "base", "head", "link", "meta", "style", "title", "body", "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4", "h5", "h6", "hgroup", "main", "nav", "section", "search", "blockquote", "dd", "div", "dl", "dt", "figcaption", "figure", "hr", "li", "menu", "ol", "p", "pre", "ul", "a", "b", "abbr", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "rtc", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "area", "audio", "img", "map", "track", "video", "embed", "iframe", "object", "picture", "portal", "param", "svg", "math", "source", "canvas", "noscript", "script", "del", "ins", "caption", "col", "colgroup", "table", "thead", "tbody", "td", "th", "tr", "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea", "details", "dialog", "menu", "menuitem", "summary", "content", "element", "shadow", "template", "slot"
]);

function isHtmlElement(type){
    //console.log(type, htmlElementsSet.has(type))
    return htmlElementsSet.has(type);
}
*/

/*
function generateReactCreateElement(node) {
    if (node.type === 'JSXElement') {
      let type = node.openingElement.name.name;
      if (type === 'Fragment') {
        type = 'React.Fragment';
      } else if (isHtmlElement(type)) {
        type = `"${type}"`;
      } else if (node.type === 'JSXText') {
        return `"${node.value.trim()}"`;
    
        } else if (node.type === 'JSXExpressionContainer') { // unsure if this branch is needed
            if (node.expression.type === 'ConditionalExpression') {
            const test = generate(node.expression.test).code;
            const consequent = generateReactCreateElement(node.expression.consequent);
            const alternate = generateReactCreateElement(node.expression.alternate);
            return `${test} ? ${consequent} : ${alternate}`;
        } else if (node.type === 'IfStatement') { //definitely not needed
            console.log("if statement")
            const test = generate(node.test).code;
            const consequent = generateReactCreateElement(node.consequent);
            const alternate = node.alternate ? generateReactCreateElement(node.alternate) : 'null';
            return `${test} ? ${consequent} : ${alternate}`;
        } else {
      return generate(node.expression).code;
    }
  }
      const props = node.openingElement.attributes.reduce((props, attribute) => {
        if (attribute.type === 'JSXAttribute') {
          const value = attribute.value.type === 'JSXExpressionContainer'
            ? generate(attribute.value.expression).code
            : `"${attribute.value.value}"`;
          props.push(`${attribute.name.name}: ${value}`);
        }
        return props;
      }, []);
      const propsString = `{${props.join(', ')}}`;
      const children = node.children
        .map(child => {
          if (child.type === 'JSXExpressionContainer') {
            if (child.expression.type === 'ConditionalExpression') {
                const test = generate(child.expression.test).code;
                const consequent = generateReactCreateElement(child.expression.consequent);
                const alternate = generateReactCreateElement(child.expression.alternate);
                return `${test} ? ${consequent} : ${alternate}`;
              } else {
                return generate(child.expression).code;
              }
          } else if (child.type === 'JSXText' && child.value.trim() !== '') {
            return `"${child.value.trim()}"`;
          } else if (child.type === 'JSXElement') {
            return generateReactCreateElement(child);
          }
        })
        .filter(Boolean)
        .join(', ');
      return `React.createElement(${type}, ${propsString}, ${children})`;
    } else if (node.type === 'JSXFragment') {
      const children = node.children
        .map(child => {
          if (child.type === 'JSXExpressionContainer') {
            return generate(child.expression).code;
          } else if (child.type === 'JSXText' && child.value.trim() !== '') {
            return `"${child.value.trim()}"`;
          } else if (child.type === 'JSXElement') {
            return generateReactCreateElement(child);
          }
        })
        .filter(Boolean)
        .join(', ');
      return `React.createElement(React.Fragment, null, ${children})`;
    } else if (node.type === 'JSXText') {
      return `"${node.value.trim()}"`;
    }
  }
*/

/*
// works, latest
function generateReactCreateElement(node) {
    if (node.type === 'JSXElement') {
      let type = node.openingElement.name.name;
      if (type === 'Fragment') {
        type = 'React.Fragment';
      } else if (isHtmlElement(type)) {
        type = `"${type}"`;
      }
      const props = node.openingElement.attributes.reduce((props, attribute) => {
        if (attribute.type === 'JSXAttribute') {
          const value = attribute.value.type === 'JSXExpressionContainer'
            ? generate(attribute.value.expression).code
            : `"${attribute.value.value}"`;
          props.push(`${attribute.name.name}: ${value}`);
        }
        return props;
      }, []);
      const propsString = `{${props.join(', ')}}`;
      const children = node.children
        .filter(child => (child.type === 'JSXText' && child.value.trim() !== '') || child.type === 'JSXElement')
        .map(generateReactCreateElement)
        .join(', ');
      return `React.createElement(${type}, ${propsString}, ${children})`;
    } else if (node.type === 'JSXFragment') {
      const children = node.children
        .filter(child => (child.type === 'JSXText' && child.value.trim() !== '') || child.type === 'JSXElement')
        .map(generateReactCreateElement)
        .join(', ');
      return `React.createElement(React.Fragment, null, ${children})`;
    } else if (node.type === 'JSXText') {
      return `"${node.value.trim()}"`;
    }
  }
*/

/*
// works, minus conditional output
function generateReactCreateElement(node) {
    if (node.type === 'JSXElement') {
      let type = node.openingElement.name.name;
      if (type === 'Fragment') {
        type = 'React.Fragment';
      } else if (isHtmlElement(type)) {
        type = `"${type}"`;
      }
      const props = node.openingElement.attributes.reduce((props, attribute) => {
        if (attribute.type === 'JSXAttribute') {
          const value = attribute.value.type === 'JSXExpressionContainer'
            ? generate(attribute.value.expression).code
            : `"${attribute.value.value}"`;
          props.push(`${attribute.name.name}: ${value}`);
        }
        return props;
      }, []);
      const propsString = `{${props.join(', ')}}`;
      const children = node.children
        .filter(child => (child.type === 'JSXText' && child.value.trim() !== '') || child.type === 'JSXElement')
        .map(generateReactCreateElement)
        .join(', ');
      return `React.createElement(${type}, ${propsString}, ${children})`;
    } else if (node.type === 'JSXFragment') {
      const children = node.children
        .filter(child => (child.type === 'JSXText' && child.value.trim() !== '') || child.type === 'JSXElement')
        .map(generateReactCreateElement)
        .join(', ');
      return `React.createElement(React.Fragment, null, ${children})`;
    } else if (node.type === 'JSXText') {
      return `"${node.value.trim()}"`;
    }
  }
*/


try{
// Parse the code using @babel/parser
/*
const ast = parser.parse(reactFunction, {
  sourceType: 'module',
  plugins: ['jsx'] // Enable JSX parsing
});
*/



    /*
    ArrowFunctionExpression: {
        enter(path) {
        console.log(path.node);
        },
    },
    */
   
        /*
        const jsx = path.node.argument;
        const { code } = generate(jsx);
        console.log(code);
        */
/*
traverse(ast, {
    ReturnStatement(path) {
        const jsx = path.node.argument;
        const createElementOutput = generateReactCreateElement(jsx);
        console.log(createElementOutput);
    },
});
*/

/*
//works
  traverse(ast, {
    ReturnStatement(path) {
      const jsx = path.node.argument;
      const output = generateReactCreateElement(jsx);
      console.log(output);
    },
  });
*/

/*
traverse(ast, {
    ReturnStatement(path) {
      const jsx = path.node.argument;
      const output = generateReactCreateElement(jsx);
      //console.log(output);
    },
    IfStatement(path) {
        const test = generate(path.node.test).code;
        const consequentReturnStatement = path.node.consequent.body.find(node => node.type === 'ReturnStatement');
        const consequent = consequentReturnStatement ? generateReactCreateElement(consequentReturnStatement.argument) : 'null';
        const alternateReturnStatement = path.node.alternate && path.node.alternate.body.find(node => node.type === 'ReturnStatement');
        const alternate = alternateReturnStatement ? generateReactCreateElement(alternateReturnStatement.argument) : 'null';
        //console.log(`${test} ? ${consequent} : ${alternate}`);
    },
});
*/
}catch(e){
    console.log(e.message);
}

//console.log(Babel.availablePresets)

