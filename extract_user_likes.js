const {Builder, By, Key, until} = require('selenium-webdriver');
const fs = require('fs');
const path = 'F:\\scraper\\posts\\';

let likes_data = {};
(async () => {
  const posts_filenames = fs.readdirSync(path);
  //const posts_filenames = ["post.2354158561362919.html"]
  const driver = await new Builder().forBrowser('chrome').build();
  //await driver.sleep(5000)
  //driver.set_network_conditions(offline=true, latency=0, throughput=500 * 1024);
  await asyncForEach(posts_filenames, async (post_filename,post_filenameI) => {
    console.log(post_filenameI,posts_filenames.length-1);
    const fbid = filenameTofbid(post_filename);
    likes_data[fbid] = {};
    await driver.get(path + post_filename);
    let href;
    try {
      const el_a = await driver.findElement(By.xpath('//div[contains(@data-testid,"fbFeedStoryUFI/feedbackSummary")]//a[contains(@data-testid,"UFI2ReactionsCount/root")]'));
      href = await el_a.getAttribute('href');
      href = href.replace("file:///F:","");
    }catch(e){
      //console.log(e);
      href = "";
    }finally{
      likes_data[fbid].href = href;
      const els_comments = await driver.findElements(By.xpath('//div[@aria-label="Comentario"]'));
      likes_data[fbid].comments = [];
      await asyncForEach(els_comments, async (el_comment,el_commentI) => {
        likes_data[fbid].comments[el_commentI] = {}
        let href;
        try{
          const el_a = await el_comment.findElement(By.xpath('.//span[@data-testid="UFI2CommentTopReactions/tooltip"]//a'));
          href = await el_a.getAttribute('href');
          href = href.replace("file:///F:","");
        }catch(e){
          //console.log(e);
          href = "";
        }finally{
          likes_data[fbid].comments[el_commentI].href = href;
          likes_data[fbid].comments[el_commentI].replies = [];
          const els_replies = await el_comment.findElements(By.xpath('.//ancestor::li//div[@data-testid="UFI2CommentsList/root_depth_1"]/ul/li'));
          await asyncForEach(els_replies, async (el_reply,el_replyI) => {
            let href;
            try{
              const el_a = await el_reply.findElement(By.xpath('.//span[@data-testid="UFI2CommentTopReactions/tooltip"]/a'));
              href = await el_a.getAttribute('href');
              href = href.replace("file:///F:","");
            }catch(e){
              //console.log(e);
              href = "";
            }finally{
              likes_data[fbid].comments[el_commentI].replies.push(href);
            }
          });
        }
      });
    }
  });
  await driver.quit();
  fs.writeFileSync('./likes_data.json',JSON.stringify(likes_data));
  console.log(likes_data);
})();

// help functions
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function filenameTofbid(filename) {
  return filename.split("json").slice(-1)
}