const authors = require('./authors.json')
const fs = require('fs')
function cleanUserPermalink(permalink){
    permalink = permalink.replace(/https:\/\/www.facebook.com\//, ``);
    permalink = permalink.replace(/profile.php\?id=/, ``);
    permalink = permalink.replace(/\&[^]*$/, ``);
    permalink = permalink.replace(/\?[^]*$/, ``);
    permalink = permalink.replace(/\/$/, ``);
    permalink = permalink.replace(/file:\/\/\/F:\//, ``);
    return permalink;
}

cleaned={}
Object.keys(authors).forEach(permalink => {
    if(!permalink.match(/events\//))
        cleaned[cleanUserPermalink(permalink)] = authors[permalink]
});

fs.writeFileSync('./authors2.json',JSON.stringify(cleaned));
/*
arr1 = Object.keys(authors)
arr2 = Object.values(authors)
newObj={}
arr1.forEach( (fullName,i) => {
    newObj[fullName]
});
*/