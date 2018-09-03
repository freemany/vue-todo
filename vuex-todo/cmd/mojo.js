var fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var contents = fs.readFileSync('dist/index.html', 'utf8');
// const dom = new JSDOM(contents);


// console.log(dom.window.document.querySelector("script"));

var matches = contents.match(/<script>(.*?)<\/script>/g);

console.log(contents, matches)