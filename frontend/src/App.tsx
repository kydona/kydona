/* eslint-env browser */

import React, {useEffect, useState, useRef} from 'react';

import * as Y from 'yjs';
// @ts-ignore
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
//import { WebrtcProvider } from 'y-webrtc';
import {WebsocketProvider} from 'y-websocket';

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript';
import {html} from '@codemirror/lang-html';
//import { sanitize } from 'isomorphic-dompurify';
//import * as THREE from 'three'
//import * as random from 'lib0/random';
//const parser = require('@babel/parser');
import * as parser from '@babel/parser';
//const traverse = require('@babel/traverse').default;
import traverse from '@babel/traverse';
//const t = require('@babel/types');


import { Canvas, useFrame } from '@react-three/fiber'
/*
// Parse the code string into an AST
const ast = parser.parse(codeString, {
  plugins: ['jsx'], // Enable JSX parsing
});

// Traverse the AST to find the BoxMin function
let boxMinFunction;

traverse(ast, {
  FunctionDeclaration(path) {
    if (path.node.id.name === 'BoxMin') {
      boxMinFunction = path.node;
      path.stop(); // Stop traversing once the BoxMin function is found
    }
  },
});

console.log(boxMinFunction);

*/



function BoxMin(props) {
    return (
      <mesh
        {...props}
        scale={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={props.color ?? 'gray'} />
        </mesh>
    )
    }
    
const codeString = `<mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={'blue'} />
  </mesh>
`;

const codeExpression = `"expression": {
    "type": "ArrayExpression",
    "start": 34,
    "end": 43,
    "elements": [
      {
        "type": "Literal",
        "start": 35,
        "end": 36,
        "value": 1,
        "raw": "1"
      },
      {
        "type": "Literal",
        "start": 38,
        "end": 39,
        "value": 1,
        "raw": "1"
      },
      {
        "type": "Literal",
        "start": 41,
        "end": 42,
        "value": 1,
        "raw": "1"
      }
    ]
  }`
  
const complicatedCode = `
function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => {setHover(true)
            ycolor.set("color", userHex)}}
        onPointerOut={(event) => {
            setHover(false)
            ycolor.set("color", defaultColor)}}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={props.color ?? 'gray'} />
      </mesh>
    )
  }`

/*
ignore all JSXText
walk up the tree until you see a JSXIdentifier type, and find the first openingElement
take the openingElement.name.name and use that as the name of the component
iterate over openingElement.attributes and create props for each one
props are in the format {attributes[i].name.name : attributes[i].value.expression.value}
iterate over the children and createElements for each one
ignore closingElements

React.createElement(name, props, ...children)
*/
    
import { Parser, ecmaVersion } from "acorn";
import acornJsx from "acorn-jsx";
//import acornBigint from "acorn-bigint";

const MyParser = Parser.extend(
  acornJsx(),
);
const acornOptions = {
    ecmaVersion: 2020, 
    sourceType: "module", 
    plugins: {jsx: true}, 
    location: false,
    allowReturnOutsideFunction: true,
    }
//const acornObject = MyParser.parse(codeString, acornOptions);
const acornObject = MyParser.parse(complicatedCode, acornOptions);
console.log(acornObject)


/*
//import * as Babel from '@babel/standalone';

//const input = 'const getMessage = () => "Hello World";';
//const output = Babel.transform(input, { presets: ["env"] }).code;
//console.log(output);
*/


function getRandomHexColor() {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
  
    // Convert decimal to hexadecimal
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');
  
    // Construct the hex color code
    const hexColor = `#${redHex}${greenHex}${blueHex}`;
    return hexColor;
  }
  
  // Example usage:
  const randomColor = getRandomHexColor();

// Select a random color for this user
export const userColor = {color : randomColor, light :randomColor + "33"};
const ydoc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:3000', 'codemirror-demo-room', ydoc);

provider.awareness.setLocalStateField('user', {
  name: 'Anonymous ' + Math.floor(Math.random() * 100),
  color: userColor.color,
  colorLight: userColor.light,
});

const ytext = ydoc.getText('codemirror');
const ycolor = ydoc.getMap('cubecolor');

const undoManager = new Y.UndoManager(ytext);


const userHex = userColor.color.replace("#","0x")
console.log(userHex)
const defaultColor = "gray"

/*
function Box(props) {
    // This reference will give us direct access to the mesh
    const meshRef = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (meshRef.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={active ? 1.5 : 1}
        onClick={(event) => setActive(!active)}
        onPointerOver={(event) => {setHover(true)
            ycolor.set("color", userHex)}}
        onPointerOut={(event) => {
            setHover(false)
            ycolor.set("color", defaultColor)}}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={props.color ?? 'gray'} />
      </mesh>
    )
  }
*/
  
// works
//  const add_numbers = new Function("a", "b", "return a + b");
//  console.log(add_numbers(1, 2)); // Output: 3



let Box = new Function("props", 
`
const React = props.React
// This reference will give us direct access to the mesh
const meshRef = React.useRef()
// Set up state for the hovered and active state
const [hovered, setHover] = React.useState(false)
const [active, setActive] = React.useState(false)
// Subscribe this component to the render-loop, rotate the mesh every frame
props.useFrame((state, delta) => (meshRef.current.rotation.x += delta))
// Return view, these are regular three.js elements expressed in JSX

const meshElement = React.createElement("mesh", {ref: meshRef}, 
    React.createElement("boxGeometry", {args: [1, 1, 1]}), 
    React.createElement("meshStandardMaterial", {color: "red"}))
    
return (meshElement)`)

/*
  function BoxMin(props) {
    const meshRef = useRef()
    return (
      <mesh
        {...props}
        ref={meshRef}
        scale={1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'blue'} />
      </mesh>
    )
  }
*/

//let Box = new Function()
//console.log(Box)
/*
console.log("ytext", ytext.toString())
const funcText = `const React = props.React
// This reference will give us direct access to the mesh
const meshRef = React.useRef()
// Set up state for the hovered and active state
const [hovered, setHover] = React.useState(false)
const [active, setActive] = React.useState(false)
// Subscribe this component to the render-loop, rotate the mesh every frame
props.useFrame((state, delta) => (meshRef.current.rotation.x += delta))
// Return view, these are regular three.js elements expressed in JSX

const meshElement = React.createElement("mesh", {ref: meshRef}, 
    React.createElement("boxGeometry", {args: [1, 1, 1]}), 
    React.createElement("meshStandardMaterial", {color: "green"}))
    
return (meshElement)`
*/

/*
const acornOptions = {ecmaVersion: 2020, sourceType: "module", plugins: {jsx: true}, location: false}
*/
/*
const testCode = `
let x = 25
`
try{ 
    MyParser.parse(testCode, acornOptions);
    console.log("valid test code")
}catch(err){
    console.log("invalid test code")
}


const testCode2 = `
let x = 25
thisshouldfail
`
try{ 
    MyParser.parse(testCode2, acornOptions);
    console.log("valid test code 2")
}catch(err){
    console.log("invalid test code 2")
}
*/

//let Box = new Function("props", funcText)

function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [colorContent, setColorContent] = useState('');
  const [shouldRerender, setShouldRerender] = useState('');
  
  const myBox = useRef(null);
  
  ytext.observe(() => {
    //setHtmlContent(ytext.toString());
    //console.log("ytext", ytext.toString())
    const OldBox = Box
    try{ 
        //MyParser.parse(ytext.toString(), acornOptions);
        //new Function("props", ytext.toString())
        Box = new Function("props", ytext.toString())
        //Box({React : React, useFrame : useFrame})
        boxElement = React.createElement(Box, {position: [1.2, 0, 0], color: colorContent, React: React, useFrame: useFrame, ycolor: ycolor})
        setShouldRerender(ytext.toString())
        console.log("valid code")
    }catch(err){
        console.log("invalid code")
        Box = OldBox
        console.log(err)
    }
    //console.log(ytext.toString())
    //console.log(Box)
    
  });

  function setColor(color : string) {
    setColorContent(ycolor.get(color).startsWith("0x") ? parseInt(ycolor.get(color),16) : ycolor.get(color))
  }
  
  ycolor.observe(() => {
    setColor("color")    
    })
    
    
  // Initialize the editor
  useEffect(() => {
    
    const state = EditorState.create({
        doc: ytext.toString(),
        extensions: [
          keymap.of([
            ...yUndoManagerKeymap
          ]),
          basicSetup,
          javascript({jsx : true}),
          //html(),
          yCollab(
            ytext,
            provider.awareness,
            { undoManager }
          )
        ],
      });
  
    setHtmlContent(ytext.toString());
    
    //setColorContent('gray')
    
    Box = new Function("props", ytext.toString())
    boxElement = React.createElement(Box, {position: [1.2, 0, 0], color: colorContent, React: React, useFrame: useFrame, ycolor: ycolor})
    setShouldRerender(ytext.toString())
    
    const editorView = new EditorView({
        state,
        parent: document.getElementById('test-codemirror'),
        
      });
        return () => {
      editorView.destroy();
    };
  }, []);
  
  //const boxText = "<Box position={[1.2, 0, 0]} />"
  //const boxText = {[1.2, 0, 0]}
//   const componentsMap = {
//     "box": <Box props />,
//   }
  
  //const element = React.createElement(acornObject );
  
  //works
  const meshElement = React.createElement("mesh", {}, 
    React.createElement("boxGeometry", {args: [1, 1, 1]}), 
    React.createElement("meshStandardMaterial", {color: "green"}))
  
 // const meshElement = React.createElement(Box, {position: [1.2, 0, 0], color: colorContent})
  let boxElement = React.createElement(Box, {position: [1.2, 0, 0], color: colorContent, React: React, useFrame: useFrame})
  
  return (
    <>
    <div id="test-codemirror">
        {/* The EditorView will be rendered here */}
    </div>
    
    <Canvas
    style={{height:screen.height.valueOf()-300}}
    >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        {boxElement}
        
    </Canvas>
    </>
    
    /*
     <Box key={ytext.toString()} position={[-1.2,0,0]} 
        color={colorContent} React={React} useFrame={useFrame}></Box>
    <div id="html-container" key={htmlContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
     <BoxMin>
      {meshElement}
    */
  );
}

export default App;