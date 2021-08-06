const chrome = require('selenium-webdriver/chrome');
const { Builder, By, Key, until, Options, Actions } = require('selenium-webdriver');
const fs = require('fs');
const likes_data = require('./likes_data.json');
//const likes_data = {"post.2385293724916069.html": {    "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OQ%3D%3D&av=100000198787604",    "comments": [        {            "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzAzNDE0OTE1MTAw&av=100000198787604",            "replies": [                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzA5ODE0OTE0NDYw&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzEyNTIxNTgwODU2&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzE3MDk4MjQ3MDY1&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzIyMzU4MjQ2NTM5&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzIzMTYxNTc5Nzky&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzI0MDIxNTc5NzA2&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzMxNDcxNTc4OTYx&av=100000198787604",                "",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzMzODM4MjQ1Mzkx&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzM2MTQ4MjQ1MTYw&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzQxMTE0OTExMzMw&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzQ0NzQxNTc3NjM0&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzQ1ODAxNTc3NTI4&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzQ3NDU0OTEwNjk2&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzQ3NDkxNTc3MzU5&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzYzODQ0OTA5MDU3&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Mzc2NDk0OTA3Nzky&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzgwMTU4MjQwNzU5&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDA2Mjc4MjM4MTQ3&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDk4MjI4MjI4OTUy&av=100000198787604"            ]        },        {            "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzI3NTg0OTEyNjgz&av=100000198787604",            "replies": []        },        {            "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzI3OTkxNTc5MzA5&av=100000198787604",            "replies": [                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzU5Njk0OTA5NDcy&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzY3OTg4MjQxOTc2&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzczNTY0OTA4MDg1&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzgwMzI0OTA3NDA5&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzgxNTg0OTA3Mjgz&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzgyNDc4MjQwNTI3&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Mzg0OTU0OTA2OTQ2&av=100000198787604",                "",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDA5MzYxNTcxMTcy&av=100000198787604",                "",               "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDQyMjY0OTAxMjE1&av=100000198787604",                "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTA5MjI0ODk0NTE5&av=100000198787604",                ""            ]        },        {            "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1MzcyNTkxNTc0ODQ5&av=100000198787604", "replies": [ "" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Mzc0MDgxNTc0NzAw&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Mzg0MDI0OTA3MDM5&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDE4NDcxNTcwMjYx&av=100000198787604", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDI0OTM4MjM2Mjgx&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDI4ODIxNTY5MjI2&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDM1NzE0OTAxODcw&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDQyMzg0OTAxMjAz&av=100000198787604", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDUxMjkxNTY2OTc5&av=100000198787604", "", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTAzNDU4MjI4NDI5&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTEyMTk0ODk0MjIy&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTI4MDk4MjI1OTY1&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTMwMjQxNTU5MDg0&av=100000198787604", "", "", "", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NzQ3NzcxNTM3MzMx&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Mzc2NjI0OTA3Nzc5&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDI4ODY4MjM1ODg4&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDM3NDQ4MjM1MDMw&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTQ4NTc4MjIzOTE3&av=100000198787604", "", "", "" ] }, { "href": "", "replies": [] }, { "href": "", "replies": [ "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NjM0OTIxNTQ4NjE2&av=100000198787604" ] }, { "href": "", "replies": [ "", "" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDA1MDQxNTcxNjA0&av=100000198787604", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDQ0MTAxNTY3Njk4&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDQ3OTI4MjMzOTgy&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDk0MDg4MjI5MzY2&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDYxODAxNTY1OTI4&av=100000198787604", "replies": [ "", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDc0Njg4MjMxMzA2&av=100000198787604", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTE5Njk0ODkzNDcy&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTIwNzM4MjI2NzAx&av=100000198787604", "" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NDc3ODExNTY0MzI3&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg2MDc2MTYxNTA0NDky&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg2MzE2ODg0ODEzNzUz&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTE3ODU4MjI2OTg5&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTI1MjA4MjI2MjU0&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTIxNTM4MjI2NjIx&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTMzNTM0ODkyMDg4&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTUyNDIxNTU2ODY2&av=100000198787604", "", "" ] }, { "href": "", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTQ0NDk0ODkwOTky&av=100000198787604", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTQ1OTExNTU3NTE3&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTYwNjE4MjIyNzEz&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NTU1ODE4MjIzMTkz&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NjAxODM4MjE4NTkx&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NjA5NDM4MjE3ODMx&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NjE3MjE0ODgzNzIw&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NjY5NTE4MjExODIz&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1Njg0OTE4MjEwMjgz&av=100000198787604", "", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NzI1NzU0ODcyODY2&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NzMwMzM0ODcyNDA4&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NzM0MjgxNTM4Njgw&av=100000198787604", "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1NzU5OTQxNTM2MTE0&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1ODA0OTc4MTk4Mjc3&av=100000198787604", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg1OTk4NTUxNTEyMjUz&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg2MDQwMzMxNTA4MDc1&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg2Mzk3NzQ4MTM5MDAw&av=100000198787604", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg3MjEwNjI0NzI0Mzc5&av=100000198787604", "replies": [ "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg3MjMwNzIxMzg5MDM2&av=100000198787604" ] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg3NTA5MjgxMzYxMTgw&av=100000198787604", "replies": [] }, { "href": "/ufi/reaction/profile/browser/?ft_ent_identifier=ZmVlZGJhY2s6MjM4NTI5MzcyNDkxNjA2OV8yMzg4NDEwNDQ0NjA0Mzk3&av=100000198787604", "replies": [] } ] }};

(async () => {
    const keys = Object.keys(likes_data);
    const post_fbid = Object.keys(likes_data).map(post_n_html => { return post_n_html.split(".")[1]; });
    //const posts_filenames = ["post.2354158561362919.html"]
    const options = new chrome.Options();
    options.addArguments("--disable-notifications");
    options.addArguments("--user-agent=marcelo");
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    const actions = driver.actions({bridge: true});
    await driver.get("https://facebook.com");
    let input_email = await driver.findElement(By.xpath('//input[@type="email"]'));
    let input_password = await driver.findElement(By.xpath('//input[@type="password"]'));
    let submit = await driver.findElement(By.xpath('//input[@type="submit"]'));
    await input_email.sendKeys();
    await input_password.sendKeys();
    await submit.click();

    await asyncForEach(keys, async (post_fbid_html, post_fbid_htmlI) => {
        if(post_fbid_htmlI < 300) return;
        console.log(post_fbid_htmlI, keys.length - 1);
        const fbid = filenameTofbid(post_fbid_html);
        console.log('https://facebook.com'+likes_data[post_fbid_html].href);
        if(likes_data[post_fbid_html].href.length)
            save(fbid,await extractData(driver,likes_data[post_fbid_html].href));
        await asyncForEach(likes_data[post_fbid_html].comments, async (comment,commentI) => {
            if(comment.href.length)
                save(fbid+"."+commentI,await extractData(driver,comment.href));
            await asyncForEach(driver,comment.replies, async (replyHREF,replyI) => {
                save(fbid+"."+commentI+"."+replyI,await extractData(driver,replyHREF));
            });
        });
    });
    //await driver.quit();
    //console.log(likes_data);
})();

function save(fbid,data) {
    fs.writeFileSync(`./likes/${fbid}.json`,JSON.stringify(data));
}

async function extractData(driver,href) {
    await driver.get('https://facebook.com'+href);
    //await driver.executeAsyncScript("window.scrollTo(0, document.body.scrollHeight);");
    var reaction_profile_pagers = await driver.findElements(By.xpath('//div[contains(@id,"reaction_profile_pager")]//a'));
    while(reaction_profile_pagers.length) {
        await asyncForEach(reaction_profile_pagers, async (reaction_profile_pager) => {
            
            try{
                //await actions.move(reaction_profile_pager).perform();
                await driver.executeScript("arguments[0].click()",reaction_profile_pager);
                await driver.sleep(5000);
            }catch(e){
                //console.log(e);
            }
            //await driver.wait(until.elementIsVisible(reaction_profile_pager.findElement('//a[contains(@class,"uiMorePagerPrimary")]')),5000);
        });
        //await driver.executeAsyncScript("window.scrollTo(0, document.body.scrollHeight);");
        reaction_profile_pagers = await driver.findElements(By.xpath('//div[contains(@id,"reaction_profile_pager")]//a'));
    }

    let reaction_profile_browsers = await driver.findElements(By.xpath('//ul[contains(@id,"reaction_profile_browser")]/li/div/div'));
    let likes = [];
    await asyncForEach(reaction_profile_browsers, async (reaction_profile) => {
        reaction_profile = await reaction_profile.findElement(By.xpath(".//a"));
        let fullName = await reaction_profile.getAttribute("title");
        let permalink_rough = await reaction_profile.getAttribute("href");
        if(!fullName.length) {
            console.log(await reaction_profile.getAttribute("outerHTML"));
        }
        likes.push({fullName,permalink_rough});
    });
    return likes;
}


// help functions
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function filenameTofbid(filename) {
    return filename.split(".")[1];
}

const sleep = m => new Promise(r => setTimeout(r, m))