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

    def __init__(self,attachmentsByPostIds):
        super(Collector, self).__init__()
        self.attachmentsByPostIds = attachmentsByPostIds
        # browser instance
        options = Options()
        options.add_argument("--disable-notifications")
        self.browser = webdriver.Chrome(options=options)
        self.browser.set_network_conditions(offline=True, latency=0, throughput=500 * 1024)
        #self.browser = webdriver.Firefox()

    def fix_permalink(self, permalink):
        fb = 'https://www.facebook.com'
        result = permalink.find(fb)
        if(result == -1):
            return '{}{}'.format(fb,permalink)
        else:
            return permalink

    def collect_attachment(self, permalinks):
        #self.browser.get("data:text/html;charset=utf-8," + html.replace('\\"','"'))
        for permalink in permalinks:
            if(permalink.find("/posts/") != -1):
                print(permalink)

    def collect(self):
        for attachmentsByPostId in self.attachmentsByPostIds:
            try:
                postId = attachmentsByPostId["id"]
                self.collect_attachment(permalinks=attachmentsByPostId["attachments"])
            except:
                print("Error postId {} , error: {}".format(postId, sys.exc_info()[0]))


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

path = 'F:\\scraper\\attachments'
attachmentsByPostIds = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.json' in file:
            with open(os.path.join(r, file)) as json_file:
                print(file)
                t = dict()
                t["attachments"] = json.load(json_file)
                t["id"] =  file.split(".")[0]
                attachmentsByPostIds.append(t)

C = Collector(attachmentsByPostIds=attachmentsByPostIds)
C.collect()