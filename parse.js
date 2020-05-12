const fs = require("fs");
const path = require("path");
const RandONC = require("./utils/RandONC.js");

const inDir  = path.join(__dirname, "./input/data/World");
const outDir = path.join(__dirname, "./output/data/World");

if (!fs.existsSync(inDir)) {
    fs.mkdirSync(inDir, {
        recursive: true
    });
}
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {
        recursive: true
    });
}

let files = fs.readdirSync(inDir);

files.forEach(function(file) {
    let data = fs.readFileSync(path.join(inDir, file)).toString();
    data = parse(data);
    fs.writeFileSync(path.join(outDir, file), data);
});

function parse(input) {
    let output = RandONC.parse(input);
    return JSON.stringify(output, null, 4);
}