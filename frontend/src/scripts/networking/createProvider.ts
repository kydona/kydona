import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { WebrtcProvider } from "y-webrtc";
import { randomHexColor } from "../utils/randomHexColor";
//import { Awareness } from "y-protocols/awareness.js";

//const provider = new WebsocketProvider('ws://localhost:3000', 'codemirror-demo-room', ydoc);

interface CreateProviderOptions {
    ydoc: Y.Doc;
    username?: string;
    color?: string;
    roomName?: string;
    providerProtocol?: "websocket" | "webrtc";
    providerUrl?: string;
  }

  export function createProvider(
    options: CreateProviderOptions
  ): WebsocketProvider | WebrtcProvider {
    // Access options using destructuring
    const {
      ydoc,
      username = "Anonymous " + Math.floor(Math.random() * 100),
      color = randomHexColor(),
      roomName = "default",
      providerProtocol = "websocket",
      providerUrl = "ws://localhost:3000",
    } = options;
    
    
    // there seems to be a way to declare awareness before joining, 
    // but doing it after seems to work alright
    // const awareness : Awareness = {
    //     doc : ydoc,
    //     clientID : parseInt(username),
    // }
    
    let provider : WebsocketProvider | WebrtcProvider;
    switch (providerProtocol){
        case "webrtc":
            provider = new WebrtcProvider(roomName, ydoc, {
                signaling: [providerUrl],
                //awareness: awareness
                //password: password // optional password
            });
            break;
        default: // default to websocket
            provider = new WebsocketProvider(providerUrl, roomName, ydoc, {
                //awareness: awareness
                connect: true,
            });
    }
        
    const userColor = {
        color : color, 
        light : color + "33", 
        hex : parseInt(color.replace("#","0x"),16)
    };
    
    provider.awareness.setLocalStateField('user', {
        name: username,
        color: userColor.color,
        colorLight: userColor.light,
    });
    
    return provider;
}

// for testing
export const defaultYDoc = new Y.Doc();
export const defaultProvider = createProvider({
    ydoc : defaultYDoc,
});
