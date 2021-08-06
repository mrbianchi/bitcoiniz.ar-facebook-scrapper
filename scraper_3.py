from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
import time
import argparse
import os
import json
import sys
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
        self.browser.set_network_conditions(offline=True, latency=0, throughput=500 * 1024)
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

    def collect_permalink(self, permalink, postId):
        self.browser.get(permalink)
        try:
            fullNameElement = self.browser.find_element_by_xpath('//*[not(ancestor::li)]/span/span/a[contains(@ajaxify,"/groups/member/")]')
        except:
            try:
                fullNameElement = self.browser.find_element_by_xpath('//a[contains(@class,"profileLink")]')
            except:
                fullNameElement = self.browser.find_element_by_xpath('//span/a[contains(@class,"weakReference")]')
        fullName = fullNameElement.text
        profilePermalink = fullNameElement.get_attribute("href")
        if(profilePermalink is None):
            print(postId,profilePermalink)
        utime = self.browser.find_element_by_xpath('//abbr[contains(@data-utime,"")]').get_attribute("data-utime")
        post_components = self.browser.find_elements_by_xpath('//div[contains(@class,"userContent")]/../*')
        userContentHTML = post_components[1].get_attribute("innerHTML")
        attachsHTML = post_components[2].get_attribute("innerHTML")
        try:
            upvotes = self.browser.find_element_by_xpath('//a[contains(@data-testid,"UFI2ReactionsCount/root")]/span/span/span').text
        except:
            upvotes = 0

        author = {
            "fullName": fullName,
            "permalink": profilePermalink
        }



        post = {
            "id": postId,
            "author": author,
            "utime": utime,
            "userContentHTML": userContentHTML,
            "upvotes": upvotes,
            "comments": [],
            "attachsHTML": attachsHTML
        }


        comments = self.browser.find_elements_by_xpath('//div[contains(@data-testid,"UFI2CommentsList/root_depth_0")]/ul/li')
        for comment in comments:
            #comment
            comment_components = comment.find_elements_by_xpath('.//ul[contains(@data-testid,"UFI2CommentActionLinks/root") and not(ancestor::  div [contains( @data-testid , "UFI2CommentsList/root_depth_1")] )]/../../../div')
            comment_author_body = comment.find_element_by_xpath('.//div[contains(@data-testid,"UFI2Comment/body")]')
            comment_author_data = comment_author_body.find_element_by_xpath('.//a')
            comment_author_fullname = comment_author_data.text

            comment_author_permalink = comment_author_data.get_attribute("href")

            comment_permalink = comment.find_element_by_xpath('.//ul[contains(@data-testid,"UFI2CommentActionLinks/root")]/li[last()]/a').get_attribute("href")
            utime = comment.find_element_by_xpath('.//ul[contains(@data-testid,"UFI2CommentActionLinks/root")]/li//a/abbr').get_attribute("data-utime")

            if (comment_author_permalink is None):
                print(postId, "comment", comment_author_fullname, profilePermalink)

            author = {
                "fullName": comment_author_fullname,
                "permalink": comment_author_permalink
            }

            comment_content = comment_author_body.find_element_by_xpath('./div')
            try:
                commentHTML = comment_content.find_element_by_xpath('./*[not (self::a[1]) and not (self::span / a[contains( @ aria-label, "Lista de miembros del grupo")])]').get_attribute("innerHTML")
            except:
                commentHTML = ""

            if(len(comment_components) > 2):
                attachsHTML = comment_components[1].get_attribute("innerHTML")
            else:
                attachsHTML = ""

            try:
                upvotes = comment.find_element_by_xpath('.//*[contains(@data-testid,"UFI2CommentTopReactions/tooltip")]//a/span[last()]').text
            except:
                upvotes = 0

            _comment = {
                "author": author,
                "permalink": comment_permalink,
                "utime": utime,
                "html": commentHTML,
                "upvotes": upvotes,
                "replies": [],
                "attachsHTML": attachsHTML
            }

            #replies to comment
            replies = comment.find_elements_by_xpath('.//div[contains(@data-testid,"UFI2CommentsList/root_depth_1")]/ul/li//ul[contains(@data-testid,"UFI2CommentActionLinks/root")]/../../../div')
            for reply in replies:
                reply_components = reply.find_elements_by_xpath("./div")
                main = reply_components[0].find_element_by_xpath('.//div[contains(@data-testid,"UFI2Comment/body")]/div')
                reply_author_fullName = main.find_element_by_tag_name("a").get_attribute("innerHTML")
                reply_author_permalink = main.find_element_by_tag_name("a").get_attribute("href")
                if (reply_author_permalink is None):
                    print(postId, "reply", reply_author_fullName, reply_author_permalink)
                try:
                    reply_content = main.find_element_by_xpath('./*[not (self::a[1]) and not (self::span / a[contains( @ aria-label, "Lista de miembros del grupo")])]').get_attribute("innerHTML")
                except:
                    reply_content = ""
                if(len(reply_components) > 2):
                    attachsHTML = reply_components[1].get_attribute("innerHTML")
                else:
                    attachsHTML = ""
                try:
                    upvotes = main.find_element_by_xpath('.//*[contains(@data-testid,"UFI2CommentTopReactions/tooltip")]//a/span[last()]').text
                except:
                    upvotes = 0
                utime = comment.find_element_by_xpath('.//ul[contains(@data-testid,"UFI2CommentActionLinks/root")]/li[last()]/a/abbr').get_attribute("data-utime")
                permalink = comment.find_element_by_xpath('.//ul[contains(@data-testid,"UFI2CommentActionLinks/root")]/li[last()]/a').get_attribute("href")
                author = {
                    "fullName": reply_author_fullName,
                    "permalink": reply_author_permalink
                }
                _reply = {
                    "author": author,
                    "html": reply_content,
                    "upvotes": upvotes,
                    "utime": utime,
                    "permalink": permalink,
                    "attachsHTML": attachsHTML
                }
                _comment["replies"].append(_reply)
            post["comments"].append(_comment)
        return post




    def collect(self):
        j = 0
        for permalink in self.permalinks:
            try:
                j = j + 1
                postId = permalink.split(".")[1]
                print(json.dumps(self.collect_permalink(permalink,postId)), file=open("./scrapped_v2/{}.json".format(postId), "a", encoding='utf-8'))
            except:
                print("Error postId {} , error: {}".format(postId, sys.exc_info()[0]))


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

path = 'F:\\scraper\\posts'
files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.html' in file:
            files.append(os.path.join(r, file))

list = chunks(files,1284)

def init(files):
    C = Collector(permalinks=files)
    C.collect()

from multiprocessing.dummy import Pool as ThreadPool
pool = ThreadPool(5)
results = pool.map(init, list)