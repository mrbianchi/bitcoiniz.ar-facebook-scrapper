const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
// Connection URL
const url = 'mongodb://admin:$mrb$232@188.166.30.233:27017';
 
// Database Name
const dbName = 'nodebb';
const filenames_replies = fs.readdirSync('F:\\scraper\\forum_replies\\');
let q=0;
a=true;
MongoClient.connect(url, async (err, client) => {
    if(err == null) console.log(err)
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    await asyncForEach(filenames_replies, async (filename_reply,filename_replyI) => {
        let reply = require('F:\\scraper\\forum_replies\\'+filename_reply);
        let fbpost = require('F:\\scraper\\\scrapped_v2\\'+reply.fbPostId+".json");
        let commentI = reply.commentI;
        let utime;
        if(reply.replyI)
            utime=fbpost.comments[commentI].replies[reply.replyI].utime;
        else
            utime=fbpost.comments[commentI].utime;
        let pid = reply.data.pid;
        console.log(filename_replyI,pid,utime)
        let a = db.collection('objects').updateOne(
            {_key: 'post:'+pid},
            {
                $set: { 'timestamp': parseInt( add_zeros(utime) ) }
            }
        );
        q++;
        if(q>1000) {
            await new Promise(r => setTimeout(r, 2000));
            q=0;
        }
    });
    client.close();
});


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

function extractUrlValue(key, url)
{
    if (typeof(url) === 'undefined')
        url = window.location.href;
    var match = url.match('[?&]' + key + '=([^&]+)');
    return match ? match[1] : null;
}