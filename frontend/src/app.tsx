/* eslint-env browser */
import React, {useEffect, useState, useRef} from 'react';

import { EditorView } from 'codemirror';
//import { sanitize } from 'isomorphic-dompurify';
import { Canvas, useFrame } from '@react-three/fiber'
import { themeCompartment } from './scripts/editor/createEditor';
import { editorState} from './scripts/editor/editorState';

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
    
function App() {
        
    // the ref for the editor    
    const editorRef = useRef(null);
    
    
    // Initialize the editor box
    useEffect(() => {

        // create the editor view
        editorView = new EditorView({
            state : editorState,
            parent: editorRef.current,
           // extensions: [theme],
            
        });
        
        // destroy the editor view when the component unmounts
        return () => {
        editorView.destroy();
        };
    }, []);
    
    
    return (
        <>
        
        {/* the editor */}
        <div key={editorKey} ref={editorRef}/>
        
        </>
    );
}

export default App;