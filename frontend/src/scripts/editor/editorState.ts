import { defaultProvider, defaultYDoc as ydoc } from '../networking/createProvider';
import { createEditor } from './createEditor';

const ytext = ydoc.getText('codemirror');

// create the editor state
export const editorState = createEditor({
    ytext: ytext, // the object representing the shared document
    provider : defaultProvider, // the provider for the shared document
    });