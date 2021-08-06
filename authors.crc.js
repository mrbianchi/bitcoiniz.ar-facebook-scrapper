const authors = require('./authors2.json')
const fs = require('fs')
var crc32 = require('js-crc').crc32;

cleaned={}
Object.keys(authors).forEach(permalink => {
    cleaned[crc32(permalink)] = crc32(authors[permalink])
});

fs.writeFileSync('./authors3.json',JSON.stringify(cleaned));
/*
arr1 = Object.keys(authors)
arr2 = Object.values(authors)
newObj={}
arr1.forEach( (fullName,i) => {
    newObj[fullName]
});
*/