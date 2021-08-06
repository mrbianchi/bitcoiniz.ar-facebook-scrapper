const MongoClient = require('mongodb').MongoClient;
const fs = require("fs");
// Connection URL
const url = 'mongodb://admin:$mrb$232@188.166.30.233:27017';
const { sanitazeMessage , sanitazeAttachment } = require('./sanitaze')
 
// Database Name
const dbName = 'nodebb';

fs.readdir('F:\\scraper\\attachments\\', function(err, filenames) {
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
            let attachments = require('F:\\scraper\\attachments\\'+filename);
            if(attachments.length != 1 || !attachments[0].match("/posts/")) {
                return;
            }
            console.log(filename)
            let forum_file = require('F:\\scraper\\forum_posts\\'+filename);
            let temp = require('F:\\scraper\\scrapped_v2\\'+filename);
            //let b = await db.collection('objects').findOne({_key:`post:${forum_file.data.topicData.mainPid}`})
            //console.log(b.content)

            let { messageHTML , imgs1 } = sanitazeMessage(temp.userContentHTML);

            let a = db.collection('objects').updateOne(
                {_key: 'post:'+forum_file.data.topicData.mainPid},
                {
                    $set: { 'content': messageHTML
                    + "\r\n **Adjuntos:** \r\n"+ attachments[0] + "\r\n"
                    + ("\r\n *fb_postid:* \r\n"+ temp.id) }
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