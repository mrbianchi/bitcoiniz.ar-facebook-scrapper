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
            let b = db.collection('objects').updateOne(
                {_key:"cid:15:pids",value:forum_file.data.topicData.mainPost.pid.toString()},
                {
                    $set: { 'score': parseInt( add_zeros(facebook_file.utime) ) }
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
function add_zeros(numberString) {
    for(let i=0;i<=14-numberString.length;i++)
        numberString = numberString+"0";
    return numberString
}