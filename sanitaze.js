const sanitizeHtml = require('sanitize-html');
const crc32 = require('js-crc').crc32;

function extractFacebookUrl(u) {
    //console.log(u)
    u = u.substr(u.indexOf('l.php?u=') + 8); // remove before ?u=
    u = u.substr(0, u.indexOf('&')); // remove after &

    return decodeURIComponent(u);
}

function sanitazeMessage(messageHTML) {
    messageHTML = messageHTML.replace(/<\/p>/, `</p>\r\n`);
    let imgs=[];
    messageHTML = sanitizeHtml(messageHTML,{
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

    return { messageHTML, imgs }
}

function sanitazeAttachment(attachmentHTML) {
    let imgs=[];
    attachmentHTML = attachmentHTML.replace(/<\/p>/, `</p>\r\n`);
    attachmentHTML = sanitizeHtml(attachmentHTML,{
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
    attachmentHTML = attachmentHTML.replace(/(\?*fbclid=)[A-Za-z0-9\-_&%;=]*/, ``);

    return { attachmentHTML, imgs }
}

module.exports = { sanitazeMessage , sanitazeAttachment }