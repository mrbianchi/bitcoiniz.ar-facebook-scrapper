var fs = require('fs');
const { sanitazeMessage , sanitazeAttachment } = require('./sanitaze')
var crc32 = require('js-crc').crc32;
const axios = require('axios')
var username_uid = require('./username_uid.json')
const api_keys_by_uid = require('./api_keys_by_uid.json')

function extractFacebookUrl(u) {
    //console.log(u)
    u = u.substr(u.indexOf('l.php?u=') + 8); // remove before ?u=
    u = u.substr(0, u.indexOf('&')); // remove after &

    return decodeURIComponent(u);
}
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

function compare( a, b ) {
    if ( a.utime < b.utime ){
      return -1;
    }
    if ( a.utime > b.utime ){
      return 1;
    }
    return 0;
  }

let filenames = fs.readdirSync('./scrapped_v2/');
found=false;
asyncForEach(filenames, async filename => {
    if(!found)
        if(filename != "903863886392401.json")
            return;
        else{
            found=true
        }
    console.log(filename)
    let fbpost = require('./scrapped_v2/'+filename)
    let temp_forum = require('./forum_posts/'+filename)
    console.log(temp_forum.data.id)
    await asyncForEach(fbpost.comments, async (comment, commentI) => {
        let permacleaned = cleanUserPermalink(comment.author.permalink);
        let hashed = crc32(permacleaned);

        let g = sanitazeMessage(comment.html);
        let userContentHTML = g.messageHTML;
        let imgs1 = g.imgs;
        g = sanitazeAttachment(comment.attachsHTML);
        let attachsHTML = g.attachmentHTML
        let imgs2 = g.imgs;
        let imgs = imgs1.concat(imgs2);
        let raw = userContentHTML
                    + (attachsHTML != "" || imgs.length ? "\r\n **Adjuntos:** \r\n"+attachsHTML + imgs.join("\r\n") : "" )
        raw = raw.trim() != "" ? raw : "*Contenido no disponible*";
        //let fb_commentid = extractUrlValue("comment_id",comment.permalink);
        let res;
        try{
        res = await axios({
            method: 'post',
            url: 'https://1btcarg.com/posts.json',
            data: {
                raw,
                    //+ ("\r\n **Fecha original:** \r\n"+ timeConverter(parseInt(comment.utime)))
                    //+ ("\r\n *fb_commentid:* \r\n"+ fb_commentid),
                topic_id: temp_forum.data.topic_id,
                created_at: new Date(comment.utime*1000).toJSON()
            },
            headers: {
                'Api-Key': api_keys_by_uid[username_uid[hashed]],
                'Api-Username': hashed
            }
        });
        }catch(e){
            console.log(e.toJSON())
            process.exit()
        }
        fs.writeFileSync(`./forum_replies/${fbpost.id}.${commentI}.json`,JSON.stringify({fbPostId: fbpost.id, commentI, data: res.data}));
        console.log("reply to topic id: "+temp_forum.data.id )
        let post_number = res.data.post_number;
        await asyncForEach(comment.replies, async (reply,replyI) => {
            let permacleaned = cleanUserPermalink(reply.author.permalink);
            let hashed = crc32(permacleaned);
            //let fb_commentid = extractUrlValue("comment_id",comment.permalink);

            let g = sanitazeMessage(reply.html);
            let userContentHTML = g.messageHTML;
            let imgs1 = g.imgs;
            g = sanitazeAttachment(reply.attachsHTML);
            let attachsHTML = g.attachmentHTML
            let imgs2 = g.imgs;
            let imgs = imgs1.concat(imgs2);
            
            let raw = userContentHTML
            + (attachsHTML != "" || imgs.length ? "\r\n **Adjuntos:** \r\n"+attachsHTML + imgs.join("\r\n") : "" );
            raw = raw.trim() != "" ? raw : "*Contenido no disponible*"
            let res;
            try {
            res = await axios({
                method: 'post',
                url: 'https://1btcarg.com/posts.json',
                data: {
                    topic_id: temp_forum.data.topic_id,
                    reply_to_post_number: post_number,
                    raw,
                        //+ ("\r\n **Fecha original:** \r\n"+ timeConverter(parseInt(comment.utime)))
                        //+ ("\r\n *fb_commentid:* \r\n"+ fb_commentid),
                    created_at: new Date(reply.utime*1000).toJSON()
                },
                headers: {
                    'Api-Key': api_keys_by_uid[username_uid[hashed]],
                    'Api-Username': hashed
                }

            });
            }catch(e){
                console.log(e.toJSON())
                process.exit()
            }
            fs.writeFileSync(`./forum_replies/${fbpost.id}.${commentI}.${replyI}.json`,JSON.stringify({fbPostId: fbpost.id, commentI, replyI, data: res.data}));
            console.log("reply to reply id: "+post_number )
        });
    });
});

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

function cleanUserPermalink(permalink){
    permalink = permalink.replace(/https:\/\/www.facebook.com\//, ``);
    permalink = permalink.replace(/profile.php\?id=/, ``);
    permalink = permalink.replace(/\&[^]*$/, ``);
    permalink = permalink.replace(/\?[^]*$/, ``);
    permalink = permalink.replace(/\/$/, ``);
    permalink = permalink.replace(/file:\/\/\/F:\//, ``);
    return permalink;
}

function extractUrlValue(key, url)
{
    if (typeof(url) === 'undefined')
        url = window.location.href;
    var match = url.match('[?&]' + key + '=([^&]+)');
    return match ? match[1] : null;
}