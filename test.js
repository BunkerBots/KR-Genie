import {transform} from "cjstoesm";
import {writeFileSync} from "fs";

const result = await transform({
	input: "index.js",
});

// Write to disk
for (const {fileName, text} of result.files) {
    console.log(fileName)
	writeFileSync(fileName, text);
}