const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
// Connection URL
const url = 'mongodb://admin:$mrb$232@188.166.30.233:27017';
 
// Database Name
const dbName = 'nodebb';

files_names = fs.readdirSync('F:\\scraper\\forum_replies\\');

files_names.forEach( (file_name) => {
    let data_reply = require('F:\\scraper\\forum_replies\\'+file_name);
    let id = data_reply.fbPostId.id;
    delete data_reply.fbPostId;
    data_reply.fbPostId = id;
    fs.writeFileSync('F:\\scraper\\forum_replies\\'+file_name,JSON.stringify(data_reply));
})


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}
function add_zeros(numberString) {
    for(let i=0;i<=14-numberString.length;i++)
        numberString = numberString+"0";
    return numberString
}