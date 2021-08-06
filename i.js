const chrome = require('selenium-webdriver/chrome');
const { Builder, By, Key, until, Options, Actions } = require('selenium-webdriver');
const fs = require('fs');


(async () => {
    const options = new chrome.Options();
    options.addArguments("--disable-notifications");
    options.addArguments("--user-agent=refs");
    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    const actions = driver.actions({bridge: true});
    await do_login();

    await driver.get('https://www.facebook.com/groups/BitcoinArg/search/?query=%23ref&epa=SEARCH_BOX');
    let results = await driver.findElements(By.xpath('//div[contains(@data-gt,{&quot;type&quot;:&quot;xtracking&quot;,&quot;xt&quot;:&quot;21.{\\&quot;module_type\\&quot;:\\&quot;GROUP_POSTS\\&quot;,\\&quot;item_type\\&quot;:\\&quot;result)]'));
    console.log(results.length);
})();

do_login = async (driver) => {
    await driver.get("https://facebook.com");
    let input_email = await driver.findElement(By.xpath('//input[@type="email"]'));
    let input_password = await driver.findElement(By.xpath('//input[@type="password"]'));
    let submit = await driver.findElement(By.xpath('//input[@type="submit"]'));
    await input_email.sendKeys();
    await input_password.sendKeys();
    await submit.click();
};