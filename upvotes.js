var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var crc32 = require('js-crc').crc32;
var forum_users = require('./forum_users.json');
const axios = require('axios')
var excerpt = require('excerpt-html');

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

fs.readdir('F:\\scraper\\scrapped\\', function(err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    promises=[]
    q=0

    /* ordena */
    let t=[]
    filenames.forEach( filename => {
        let temp = require('F:\\scraper\\scrapped\\'+filename)
        t.push({id: temp.id, utime: parseInt(temp.utime)});
    });
    filenames = Object.values(t.sort(compare)).map( id_utime => id_utime.id+".json");

    asyncForEach(filenames, async filename => {
        let temp = require('F:\\scraper\\scrapped\\'+filename)
        let userContentHTML = temp.userContentHTML.replace(/<\/p>/, `</p>\r\n`);
        //console.log("======================================================================================")
        imgs=[]
        userContentHTML = sanitizeHtml(userContentHTML,{
            allowedTags: ['img','a'],
            transformTags: {
                'img': function(tagName, attribs) {
                    imgs.push(`![](${attribs["src"]})`);
                    return {
                        tagName: '',
                        text: `![](${attribs["src"]})`
                    };
                },
                'a': function(tagName, attribs) {
                    if(attribs["class"] == 'profileLink')
                        return {
                            tagName: ''
                        };
                    else
                        return {
                            tagName: '',
                            text: `${extractFacebookUrl(attribs["href"])}`
                        };
                    try{
                    }catch(e){

                    }
                },
            },
            textFilter: function(text) {
                text = text.replace(/(https:\/\/)[^]*(facebook.com)[^ ]*/, `[${crc32(text)}]`);
                text = text.replace(/(\?*fbclid=)[A-Za-z0-9\-_&%;=]*/, ``);
                return text;
            }
        });

        let attachsHTML = temp.attachsHTML.replace(/<\/p>/, `</p>\r\n`);
        attachsHTML = sanitizeHtml(attachsHTML,{
            allowedTags: ['img','a'],
            transformTags: {
                'img': function(tagName, attribs) {
                    imgs.push(`![](${attribs["src"]})`);
                    return {
                        tagName: '',
                        text: `![](${attribs["src"]})`
                    };
                },
                'a': function(tagName, attribs, text , text2) {
                    if(attribs["class"] == 'profileLink')
                        return {
                            tagName: ''
                        };
                    else if(typeof attribs["href"] != 'undefined') {
                            return {
                                tagName: '',
                                text: ` ${extractFacebookUrl(attribs["href"])} `
                            };
                    }else{
                        return {
                            tagName: "",
                            attribs,
                            text: ""
                        }
                    }
                },
            }
        });
        attachsHTML = attachsHTML.replace(/(\?*fbclid=)[A-Za-z0-9\-_&%;=]*/, ``);
        /*if(userContentHTML.length<8 && (attachsHTML.match(/#OT/)) || (attachsHTML.match(/OT:/)))
            return;
        */
        let permacleaned = cleanUserPermalink(temp.author.permalink);
        let hashed = crc32(permacleaned);
        if(Object.keys(forum_users).includes( hashed ) ){
            promises.push(axios({
                method: 'post',
                url: 'http://188.166.30.233:4567/api/v2/topics/',
                data: {
                    cid: 10,
                    title: excerpt(userContentHTML != "" ? userContentHTML : attachsHTML,{
                        stripTags:   true, // Set to false to get html code
                        pruneLength: 50, // Amount of characters that the excerpt should contain
                    }),
                    content: userContentHTML
                        + (attachsHTML != "" || imgs.length ? "\r\n **Adjuntos:** \r\n"+attachsHTML + imgs.join("\r\n") : "" )
                        + ("\r\n **Fecha original:** \r\n"+ timeConverter(parseInt(temp.utime)))
                        + ("\r\n *fb_postid:* \r\n"+ temp.id),
                    _uid: forum_users[hashed]
                },
                headers: {
                    'Authorization': 'Bearer cd3eb234-8579-4332-84a3-8c5923df07eb',
                }
            }))
            if(promises.length >= 100 || q ==  filenames.length-1 ) {
                let results = await Promise.allSettled(promises);
                let a = false;
                results.forEach( (result,i) => {
                    if(result.status == 'rejected') {
                        console.log('error',result.reason);
                        a=true;
                    }
                });
                if(a) process.exit();
                await new Promise(r => setTimeout(r, 2000));
                promises=[]
            }
        }
    ++q;
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