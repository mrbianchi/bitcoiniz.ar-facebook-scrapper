from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
import time
import argparse

meses = ['--','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

class Collector(object):
    """Collector of recent FaceBook posts.
           Note: We bypass the FaceBook-Graph-API by using a 
           selenium FireFox instance! 
           This is against the FB guide lines and thus not allowed.

           USE THIS FOR EDUCATIONAL PURPOSES ONLY. DO NOT ACTAULLY RUN IT.
    """

    def __init__(self,permalinks):
        super(Collector, self).__init__()
        self.permalinks = permalinks
        # browser instance
        options = Options()
        options.add_argument("--disable-notifications")
        self.browser = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.browser, 10)
        #self.browser = webdriver.Firefox()
        self.delay = 3

    def strip(self, string):
        """Helping function to remove all non alphanumeric characters"""
        words = string.split()
        words = [word for word in words if "#" not in word]
        string = " ".join(words)
        clean = ""
        for c in string:
            if str.isalnum(c) or (c in [" ", ".", ","]):
                clean += c
        return clean

    def collect_permalink(self, permalink):
        self.browser.get(permalink)

        self.browser.execute_script("aksjdakd=document.evaluate(`//a[contains(string(), ' respuesta')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);")
        self.browser.execute_script("for (let i = 0, length = aksjdakd.snapshotLength; i < length; i++) { aksjdakd.snapshotItem(i).click(); }")
        time.sleep(2.5)
        # Once the full page is loaded, we can start scraping

        postId = permalink.split("/")[6]
        try:
            userContentWrapper = self.browser.find_element_by_class_name("userContentWrapper")
            with open("post.{}.html".format(postId), "w", encoding="utf-8") as f:
                f.write(userContentWrapper.get_attribute("innerHTML"))
        except:
            with open('allposts.error.txt', 'a') as file:
                file.write("{}\n".format(permalink))

    def collect(self):
        # navigate to page
        self.browser.get('https://facebook.com')
        username =  self.browser.find_element_by_id("email")
        password =  self.browser.find_element_by_id("pass")
        submit =  self.browser.find_element_by_id("loginbutton")
        username.send_keys()
        password.send_keys()
        # Step 4) Click Login
        submit.click()

        j = 0
        for permalink in self.permalinks:
            print(j)
            j = j + 1
            postId = permalink.split("/")[6]
            try:
                f = open("post.{}.html".format(postId))
                continue
            except IOError:
                self.collect_permalink(permalink)

with open("allposts.txt", 'r') as fin:
    permalinks = fin.read().splitlines(True)
    permalinks = [line[:-1] for line in permalinks]

C = Collector(permalinks=permalinks)
C.collect()