/* eslint-env browser */
import React, {useEffect, useState, useRef, useMemo} from 'react';

import { EditorView } from 'codemirror';
//import { sanitize } from 'isomorphic-dompurify';
import { Canvas, useFrame } from '@react-three/fiber'
import { themeCompartment } from './scripts/editor/createEditor';
import { editorState} from './scripts/editor/editorState';
import { Html, Stats, KeyboardControls, KeyboardControlsEntry } from '@react-three/drei'
import { HtmlProps } from '@react-three/drei/web/Html';

let editorView: EditorView;

export function modifyEditorView(newTheme) {
    //console.log("theme modified")
    /*
    editorView.dispatch({
        effects: themeCompartment.reconfigure(newTheme),
        reconfigured: true,
    });
    */
    editorView.dispatch({
        effects: themeCompartment.reconfigure(newTheme),
        reconfigured: true,
    })
    editorKey += 1;    
    //console.log("theme updated")    

    
}
let editorKey = 0;
    

function EditorWrapper() {
    const editorRef = useRef(null);
  
    useEffect(() => {
      editorView = new EditorView({
        state: editorState,
        parent: editorRef.current,
        // Other configurations for the editor...
      });
      
  
      return () => {
        editorView.destroy();
      };
    }, []);
  
    return (
      <div style={{
        width: "100%",
        height: "100%",
        }}>  
        <div
            //style={{ width: screen.width - 200, 
            //    height: screen.height - 200}}  
            
            ref={editorRef}
            key={editorKey}
        />
      </div>
    );
  }
/*
//works
function TorusDemo(props) {
    const torusRef = useRef();
    
    useFrame((state, delta) => {
      torusRef.current.rotation.x += delta;
      torusRef.current.rotation.y += delta; 
    });   
  
    return ( 
        <>
            <group ref={torusRef}>
                <mesh {...props}>
                <torusGeometry args={[1, 0.2, 12, 36]} />
                <meshStandardMaterial color={"red"} />
                </mesh>
            </group>
        </>
    );
}
*/

/*
enum Controls {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
}
*/


function App() {
        
    /*
    const keymap = useMemo<KeyboardControlsEntry<Controls>[]>(()=>[
        { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
        { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
        { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
        { name: Controls.jump, keys: ['Space'] },
      ], [])   
    */
      
    return (
        <>
        {/* the editor */}  
        <div className='flex flex-row'> 
            
            <div
            className="flex-1 h-screen overflow-y-auto">
            <EditorWrapper 
            />
            </div>
            
            
            <Canvas
            className='flex-1'
            style={{
                height:'h-screen', 
                background : "silver",
            }}
            >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <TorusDemo /> 
            </Canvas>
            
        </div>
        
        {/**
        <Canvas
        style={{
        //height:screen.height.valueOf()-300,
        //background : "transparent",
        }}
        >
            <KeyboardControls map={keymap}>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <TorusDemo /> 
            </KeyboardControls>
               
        </Canvas>
        */} 
        
        </>
    );
    
    /*
        
        <div key={editorKey} ref={editorRef}/>
    
    */
    
}

export default App;