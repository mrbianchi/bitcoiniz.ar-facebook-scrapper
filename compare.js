const fs = require('fs')

let filenames = fs.readdirSync('./scrapped_v2/');
let filenames2 = fs.readdirSync('./forum_posts/');

console.log(filenames.length)
console.log(filenames2.length)

console.log(
    filenames2.filter( filename => !filenames.includes(filename) )
)