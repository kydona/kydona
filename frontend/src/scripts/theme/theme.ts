import {createTheme} from 'thememirror';
import JSON5 from 'json5';
import {tags as t} from '@lezer/highlight';
import {themeTags} from './themeTags';
import { defaultProvider, defaultYDoc } from '../networking/createProvider';
import { modifyEditorView } from '../../app';

async function fetchJSON5(url: string){
    return await fetch(url)
    .then(response => {
        return response.text();
    }).then(data => {
        return JSON5.parse(data);
    }).catch((error) => {
        //console.error('Error:', error);  
        throw new Error(error)
    })
}

const VITE_URL = 'http://localhost:5173/'



const ytext = defaultYDoc.getText("codemirror")
while (ytext.toString() == ""){
    ////console.log(ytext.toString())
    await new Promise(r => setTimeout(r, 500));
}
let rawTheme
try{
    //throw Error
    rawTheme = JSON5.parse(ytext.toString())
}catch{
    rawTheme = await fetchJSON5(VITE_URL + '/json/defaultTheme.json5');
}
const colorData = await fetchJSON5(VITE_URL + '/json/tailwindColors.json5');
// add any custom colors to the tailwind color list
for (const [key, value] of Object.entries(rawTheme.colors)) {
    colorData[key] = value
}

let layout = {}
for (const [key, value] of Object.entries(rawTheme.layout)) {
    layout[key] = colorData[value]
}


// see about adding other editor theming abilities https://codemirror.net/docs/ref/#view.EditorView


let styles = generateStyles(rawTheme)

ytext.observe(event => {
    //console.log("theme changed")
    try{        
        rawTheme = JSON5.parse(ytext.toString())
        rawTheme = removeEmptyValues(rawTheme)
        styles = generateStyles(rawTheme)
        for (const [key, value] of Object.entries(rawTheme.colors)) {
            colorData[key] = value
        }
        
        layout = {}
        for (const [key, value] of Object.entries(rawTheme.layout)) {
            layout[key] = colorData[value]
        }
        
        theme = createTheme({
            variant: rawTheme.variant,
            settings: layout,
            styles: styles
        })
        setTimeout(function() {
            modifyEditorView(theme)
            console.log("theme changed")
          }, 0); // Delay of 0ms causes it to be executed asynchronously, see if there is a better way to do this
        //modifyEditorView(theme)
        //console.log("theme changed")
    }catch(e){
       // console.log("theme error" + e)
       throw new Error(e)
    }
})


function removeEmptyValues(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = removeEmptyValues(obj[key]); // Recursively call the function for nested objects
      }
  
      if (obj[key] === '') {
        delete obj[key]; // Delete the key-value pair if the value is an empty string
      }
    }
    return obj;
  }

rawTheme = removeEmptyValues(rawTheme)



function generateStyles(themeData : object){
    const outputStyles : object[] = []
    
      
    function addColor(tt, key, value){
        // get color
        let color 
        if(value.startsWith("#")){ // test if key is a hex code color
            color = value
        } else { 
            color = colorData[value] // color is either a custom/tailwind color name or ""
        }
        //console.log(key, colorData[value])
        
        if (color){
            //console.log("pushed color")
            outputStyles.push({
                tag: tt[key],
                color: color,
            })
        }
    }
    
    
    
    // top level (comment, name, etc)
    for (let [topLevelKey, topLevelValue] of Object.entries(themeTags)) {
        
        const topLevelDefaultColor = themeData[topLevelKey].default
        ////console.log(topLevelKey, topLevelDefaultColor)
        topLevelValue = themeData[topLevelKey]
        //console.log(topLevelKey, topLevelValue)
        
        // second level (default, variable, etc)
        for (const [key, value] of Object.entries(topLevelValue)) {
            //console.log(key, value, typeof value)
            // test if color is an object
            if (typeof value == 'string' && value) {
                
                addColor(themeTags[topLevelKey], key, value)
                                
            } else if (value){
                for (const [subKey, subValue] of Object.entries(value)) {
                    addColor(themeTags[topLevelKey][key], subKey, subValue)
                }
            }
                
            
        }
    }
    //console.log(outputStyles)
    return outputStyles

}


let theme;
theme = createTheme({
    variant: rawTheme.variant,
	settings: layout,
	styles: styles, 
    /*[
		{
			tag: t.comment,
			color: '#787b8099',
		},
		{
			tag: t.string,
			color: '#86b300',
		},
		{
			tag: t.regexp,
			color: '#4cbf99',
		},
		{
			tag: [t.number, t.bool, t.null],
			color: '#ffaa33',
		},
		{
			tag: t.variableName,
			color: '#5c6166',
		},
		{
			tag: [t.definitionKeyword, t.modifier],
			color: '#fa8d3e',
		},
		{
			tag: [t.keyword, t.special(t.brace)],
			color: '#fa8d3e',
		},
		{
			tag: t.operator,
			color: '#ed9366',
		},
		{
			tag: t.separator,
			color: '#5c6166b3',
		},
		{
			tag: t.punctuation,
			color: '#5c6166',
		},
		{
			tag: [t.definition(t.propertyName), t.function(t.variableName)],
			color: '#f2ae49',
		},
		{
			tag: [t.className, t.definition(t.typeName)],
			color: '#22a4e6',
		},
		{
			tag: [t.tagName, t.typeName, t.self, t.labelName],
			color: '#55b4d4',
		},
		{
			tag: t.angleBracket,
			color: '#55b4d480',
		},
		{
			tag: t.attributeName,
			color: '#f2ae49',
		},
	],
    */
});

export {theme}