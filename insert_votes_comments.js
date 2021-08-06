const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
// Connection URL
const url = 'mongodb://admin:$mrb$232@188.166.30.233:27017';
 
// Database Name
const dbName = 'nodebb';

fs.readdir('F:\\scraper\\forum_replies\\', function(err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    let q=0;
    MongoClient.connect(url, async (err, client) => {
        if(err == null) console.log(err)
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        await asyncForEach(filenames, async filename => {
            console.log(filename)
            let data_reply = require('F:\\scraper\\forum_replies\\'+filename);
            let data_facebook = require('F:\\scraper\\scrapped_v2\\'+data_reply.fbPostId+'.json');
            let upvotes;
            if(data_reply.replyI)
                upvotes = data_facebook.comments[data_reply.commentI].replies[data_reply.replyI].upvotes
            else
                upvotes = data_facebook.comments[data_reply.commentI].upvotes
            if(!upvotes) return;
            let a = db.collection('objects').updateOne(
                {_key: 'post:'+data_reply.data.pid},
                {
                    $set: { 'downvotes': 0 }
                }
            );
            let b = db.collection('objects').updateOne(
                {_key: 'post:'+data_reply.data.pid},
                {
                    $set: { 'upvotes': parseInt( upvotes ) }
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
      
});


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}