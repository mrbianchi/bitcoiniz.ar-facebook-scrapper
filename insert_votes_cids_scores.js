const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
// Connection URL
const url = 'mongodb://admin:$mrb$232@188.166.30.233:27017';
 
// Database Name
const dbName = 'nodebb';

fs.readdir('F:\\scraper\\forum_posts\\', function(err, filenames) {
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
            let forum_file = require('F:\\scraper\\forum_posts\\'+filename);
            let facebook_file = require('F:\\scraper\\scrapped_v2\\'+filename);
            if(!facebook_file.upvotes) return;
            let b = db.collection('objects').updateOne(
                {_key:"cid:15:tids:votes",value:forum_file.data.topicData.mainPost.tid.toString()},
                {
                    $set: { 'score': parseInt( facebook_file.upvotes ) }
                }
            );
            q++;
            if(q>500) {
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