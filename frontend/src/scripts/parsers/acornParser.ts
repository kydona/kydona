import { Parser, ecmaVersion, Options } from "acorn";
import acornJsx from "acorn-jsx";

const acornParser = Parser.extend(
  acornJsx(),
);
const acornOptions : Options = {
    ecmaVersion: 2020, 
    sourceType: "module", 
    plugins: {jsx: true}, // unsure if this is needed
    location: false,
    allowReturnOutsideFunction: true,
}

// pass in a string of code and get back an AST
export function acornParse(codeString: string) {
    return acornParser.parse(codeString, acornOptions);
}
