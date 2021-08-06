from selenium import webdriver
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.chrome.options import Options
import time
import argparse
import csv

meses = ['--','enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

class Collector(object):
    """Collector of recent FaceBook posts.
           Note: We bypass the FaceBook-Graph-API by using a 
           selenium FireFox instance! 
           This is against the FB guide lines and thus not allowed.

           USE THIS FOR EDUCATIONAL PURPOSES ONLY. DO NOT ACTAULLY RUN IT.
    """

    def __init__(self, pages=["oxfess"], corpus_file="posts.csv", depth=5, delay=2,month=1,year=2020):
        super(Collector, self).__init__()
        self.pages = pages
        self.depth = depth + 1
        self.delay = delay
        self.month = month
        self.year = year
        self.currentYear = "2020"
        self.dump = "old{}{}.csv".format(self.year, str(self.month).zfill(2))
        # browser instance
        options = Options()
        options.add_argument("--disable-notifications")
        self.browser = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.browser, 10)
        #self.browser = webdriver.Firefox()

        # creating CSV header
        with open(self.dump, "w", newline='', encoding="utf-8") as save_file:
            writer = csv.writer(save_file)
            writer.writerow(["Source", "utime", "Text"])

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

    def collect_page(self, page):
        # navigate to page
        self.browser.get('https://www.facebook.com/')
        username =  self.browser.find_element_by_id("email")
        password =  self.browser.find_element_by_id("pass")
        submit =  self.browser.find_element_by_id("loginbutton")
        username.send_keys("")
        password.send_keys("")
        # Step 4) Click Login
        submit.click()

        self.browser.get('https://www.facebook.com' + page)

        #self.browser.find_elements_by_xpath("//span[contains(text(), 'Más recientes')]")[0].click()
        #time.sleep(3)

        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        self.browser.find_elements_by_xpath("//div[contains(i/following-sibling::text(), 'Elige una fecha...')]")[0].click()
        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        selects = self.browser.find_elements_by_xpath('((//div[@data-testid="filters_section"])[last()]/div/div)[last()]')[0]
        selects.find_element_by_link_text(self.currentYear).click()
        years = self.browser.find_elements_by_xpath('//*[@id="globalContainer"]/div[3]/div')[0]
        years.find_element_by_link_text( str(self.year) ).click()
        time.sleep(3)

        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        self.browser.find_elements_by_xpath("//div[contains(i/following-sibling::text(), 'Elige una fecha...')]")[0].click()
        self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        selects = self.browser.find_elements_by_xpath('((//div[@data-testid="filters_section"])[last()]/div/div)[last()]')[0]
        selects.find_element_by_link_text(meses[0]).click()
        months = self.browser.find_elements_by_xpath('//*[@id="globalContainer"]/div[4]/div')[0]
        months.find_element_by_link_text(meses[self.month]).click()
        time.sleep(3)
        i=0
        while True:
            i=i+1
            if i==10:
                break;
            self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            end = self.browser.find_elements_by_xpath('// *[ @ id = "browse_end_of_results_footer"] / div / div / div')
            if len(end) == 0:
                if len(self.browser.find_elements_by_xpath("//div[contains(text(), 'No hemos encontrado ningún resultado para')]"))>0:
                    break

                time.sleep(3)
            else:
                break

        # Scroll down depth-times and wait delay seconds to load
        # between scrolls
        for scroll in range(self.depth):

            # Scroll down to bottom
            self.browser.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")

            # Wait to load page
            time.sleep(self.delay)

        # Once the full page is loaded, we can start scraping
        with open(self.dump, "a+", newline='', encoding="utf-8") as save_file:
            writer = csv.writer(save_file)
            contentArea = self.browser.find_element_by_id("contentArea")
            permalinks = contentArea.find_elements_by_css_selector("a[href^='/groups/btcarg/permalink/']")
            for permalink in permalinks:
                writer.writerow([permalink.get_attribute("href")])
            self.browser.quit()

    def collect(self):
        for page in self.pages:
            self.collect_page(page)

for year in range(2018,2020):
    for month in range(1,13):
        if year == 2018:
            if month < 9:
                continue
        print("{} {}",year,month)
        C = Collector(pages=["/groups/btcarg/search/?query=\"\"&epa=SEARCH_BOX"],depth=2,month=month,year=year)
        C.collect()