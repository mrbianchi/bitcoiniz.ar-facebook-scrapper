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

    def __init__(self,attachments):
        super(Collector, self).__init__()
        self.attachments = attachments
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

    def collect_attachment(self, html):
        self.browser.get("data:text/html;charset=utf-8," + html.replace('\\"','"'))
        attachment=dict()
        try:
            attachment["permalinks"] = [self.browser.find_element_by_xpath('//abbr[contains(@data-utime,"")]/../self::a')]
            attachment["type"] = "post"
        except:
            try:
                attachment["permalinks"] = [self.browser.find_element_by_xpath('//div[contains(@class,"fbStoryAttachmentImage")] / ancestor::a')]
                attachment["type"] = "link"
            except:
                attachment["permalinks"] = self.browser.find_elements_by_xpath('//a[contains(@rel,"theater")]')
                if(len(attachment["permalinks"]) > 0):
                    attachment["type"] = "images"
                else:
                    try:
                        attachment["permalinks"] = self.browser.find_element_by_xpath('//video')
                        attachment["type"] = "video"
                    except:
                        try:
                            attachment["permalinks"] = self.browser.find_element_by_xpath('//div[contains(@class,"ellipsis")]/ancestor::div[contains(@class,"userContentWrapper")]//div[contains(@class,"uiScaledImageContainer")]/ancestor::div[position()=1]/a')
                            attachment["type"] = "specialLink"
                        except:
                            attachment["permalinks"] = []
                            attachment["type"] = "unknown"
        return attachment

    def collect(self):
        j = 0
        for attachment in self.attachments:
            try:
                j = j + 1
                postId = attachment["id"]
                attachment = self.collect_attachment(html=attachment["html"])
                print(postId)
                print(attachment["type"])
                continue
                if( len(results) > 0 ):
                    print(postId)
                    for i,result in enumerate(results):
                        #hay que hacer esto el resultado de la linea 37 a veces se buguea y no le funciona get_attr href
                        attrs = self.browser.execute_script('var items = {}; for (index = 0; index < arguments[0].attributes.length; ++index) { items[arguments[0].attributes[index].name] = arguments[0].attributes[index].value }; return items;',result)
                        results[i] = self.fix_permalink(permalink=attrs['href'])
                    print(json.dumps(results), file=open("./attachments/{}.json".format(postId), "a", encoding='utf-8'))
            except:
                print("Error postId {} , error: {}".format(postId, sys.exc_info()[0]))


def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

path = 'F:\\scraper\\scrapped_v2'
attachments = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.json' in file:
            with open(os.path.join(r, file)) as json_file:
                t = dict()
                t["html"] = json.load(json_file)["attachsHTML"]
                if (not t["html"] or t["html"] == "<div data-ft=\"{&quot;tn&quot;:&quot;H&quot;}\"></div>"):
                    continue
                t["id"] =  file.split(".")[0]
                attachments.append(t)

C = Collector(attachments=attachments)
C.collect()