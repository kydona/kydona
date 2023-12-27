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
import { sanitize } from 'isomorphic-dompurify';
import * as THREE from 'three'

import * as random from 'lib0/random';

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



import { Canvas, useFrame } from '@react-three/fiber'

const userHex = userColor.color.replace("#","0x")
console.log(userHex)
const defaultColor = "gray"

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
        <meshStandardMaterial color={props.color} />
      </mesh>
    )
  }

    

function App() {
  const [htmlContent, setHtmlContent] = useState('');
  const [colorContent, setColorContent] = useState('');

  ytext.observe(() => {
    setHtmlContent(ytext.toString());
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
          //javascript(),
          html(),
          yCollab(
            ytext,
            provider.awareness,
            { undoManager }
          )
        ],
      });
  
    setHtmlContent(ytext.toString());
    
    setColorContent('gray')
    
    const editorView = new EditorView({
        state,
        parent: document.getElementById('test-codemirror'),
      });
        return () => {
      editorView.destroy();
    };
  }, []);
  
  const boxText = "<Box position={[-1.2, 0, 0]} />"
  
  return (
    <>
    <div id="test-codemirror">
        {/* The EditorView will be rendered here */}
    </div>
    <div id="html-container" key={htmlContent} dangerouslySetInnerHTML={{ __html: htmlContent }} />
    
    <Canvas
    style={{height:screen.height.valueOf()-300}}
    >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2,0,0]} 
        color={colorContent}></Box>
    </Canvas>
    </>
    
    /*
     
    */
  );
}

export default App;