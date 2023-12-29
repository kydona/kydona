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
    