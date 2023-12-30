import * as Y from 'yjs';
import { yCollab, yUndoManagerKeymap } from 'y-codemirror.next';
import { basicSetup } from 'codemirror';
import { EditorState, Compartment } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view'
import {autocompletion, completionStatus, acceptCompletion} from "@codemirror/autocomplete"
import {indentWithTab, indentLess, indentMore} from "@codemirror/commands"
import {html} from '@codemirror/lang-html';
import { javascript } from '@codemirror/lang-javascript';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';
import { theme } from '../theme/theme';

export interface createEditorOptions {
    ytext : Y.Text;
    provider : WebsocketProvider | WebrtcProvider;
    language? : "typescript" | "javascript" | "html";
}

export const themeCompartment = new Compartment
export const languageCompartment = new Compartment

export function createEditor(options : createEditorOptions) {
    const {ytext, provider, language = "typescript"} = options;
        
    // create undo manager
    const undoManager = new Y.UndoManager(ytext);
        
    // default extensions
    const editorExtensions = [
        
        // default editor setup        
        basicSetup,
        
        // language (for testing)
        //javascript({jsx : true, typescript: true}),
        
        // allow indent with tab (superceded by following keymap)
        //keymap.of([indentWithTab]),
        
        // allow both autocomplete and indent with tab
        keymap.of([
            {
            key: 'Tab',
            preventDefault: true,
            shift: indentLess,
            run: e => {
                if (!completionStatus(e.state)) return indentMore(e);
                return acceptCompletion(e);
            },
            },
        ]),
        
        // allows for undo/redo
        keymap.of([
            ...yUndoManagerKeymap
        ]),
        
        // enables autocompletion
        yCollab(
            ytext,
            provider.awareness,
            { undoManager }
        ),
        
        // the theme is in a compartment so it can be changed dynamically
        // themeCompartment.of(theme),
               
        ]
    
    
    // add language specific extensions
    switch (language){
        case "typescript":
            editorExtensions.push(javascript({jsx : true, typescript: true}))
            break;
        case "javascript":
            editorExtensions.push(javascript({jsx : true}))
            break;
        case "html":
            editorExtensions.push(html())
            break;
        default: // default to typescript
            editorExtensions.push(javascript({jsx : true, typescript: true}))
    }
    
    // create and return the editor state
    return EditorState.create({
        doc: ytext.toString(),
        extensions: editorExtensions
    });
}