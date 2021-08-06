var fs = require('fs');
const { sanitazeMessage , sanitazeAttachment } = require('./sanitaze')
var crc32 = require('js-crc').crc32;
var username_uid = require('./username_uid.json');
const axios = require('axios')
var excerpt = require('excerpt-html');
const api_keys_by_uid = require('./api_keys_by_uid.json')

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
fbid_forumid={}
fs.readdir('F:\\scraper\\scrapped_v2\\', function(err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    promises=[]
    q=0

    /* ordena */
    let t=[]
    filenames.forEach( filename => {
        let temp = require('F:\\scraper\\scrapped_v2\\'+filename)
        t.push({id: temp.id, utime: parseInt(temp.utime)});
    });
    filenames = Object.values(t.sort(compare)).map( id_utime => id_utime.id+".json");
    asyncForEach(filenames, async (filename,n) => {
        let temp = require('F:\\scraper\\scrapped_v2\\'+filename)
        let g = sanitazeMessage(temp.userContentHTML);
        let userContentHTML = g.messageHTML;
        let imgs1 = g.imgs;
        g = sanitazeAttachment(temp.attachsHTML);
        let attachsHTML = g.attachmentHTML
        let imgs2 = g.imgs;
        console.log(filename,n,filenames.length-1)
        let imgs = imgs1.concat(imgs2);

        let permacleaned = cleanUserPermalink(temp.author.permalink);
        let hashed = crc32(permacleaned);
        let title  = excerpt(userContentHTML != "" ? userContentHTML : attachsHTML,{
            stripTags:   true, // Set to false to get html code
            pruneLength: 50, // Amount of characters that the excerpt should contain
        })
        promises.push(axios({
            method: 'post',
            url: 'https://1btcarg.com/posts.json',
            data: {
                title: title.length ? title : "Sin título",
                raw: userContentHTML
                    + (attachsHTML != "" || imgs.length ? "\r\n **Adjuntos:** \r\n"+attachsHTML + imgs.join("\r\n") : "" )
                    //+ ("\r\n **Fecha original:** \r\n"+ timeConverter(parseInt(temp.utime)))
                    + ("\r\n *fb_postid:* \r\n"+ temp.id),
                fbid:temp.id,
                created_at: new Date(temp.utime*1000).toJSON()
            },
            headers: {
                'Api-Key': api_keys_by_uid[username_uid[hashed]],
                'Api-Username': hashed
            }
        }));
        if( n % 50 == 0 || n ==  filenames.length-1 ) {
            let results = await Promise.allSettled(promises);
            results.forEach( (result,i) => {
                if(result.status == 'rejected') {
                    console.log('error',filename,i,result.reason.toJSON());
                    process.exit(0)
                }else{
                    let fbid=JSON.parse(result.value.config.data).fbid;
                    console.log(result.value.data)
                    fs.writeFileSync(`./forum_posts/${fbid}.json`,JSON.stringify({fbid, data: result.value.data}));
                }
            });
            //await new Promise(r => setTimeout(r, 10000));
            promises=[]
        }
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