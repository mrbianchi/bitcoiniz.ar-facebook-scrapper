html="Returns a subset of a string, composed, by complete subsets found using delimeter between min and max length. If no complete subsets are found, returns a subset using length max and ellipsis."
var excerptHtml = require('excerpt-html');
var excerpt = excerptHtml(html,{
    stripTags:   true, // Set to false to get html code
    pruneLength: 50, // Amount of characters that the excerpt should contain
});
console.log(excerpt)