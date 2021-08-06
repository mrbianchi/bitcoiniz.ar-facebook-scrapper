import os
import json
import codecs

path = 'F:\\scraper\\scrapped'
files = []
# r=root, d=directories, f = files
for r, d, f in os.walk(path):
    for file in f:
        if '.json' in file:
            files.append(os.path.join(r, file))

authors=[]
for file in files:
    with open(file, 'r') as myfile:
        print(file)
        data = myfile.read()
        obj = json.loads(data)
        authors.append(obj["author"])
        for comment in obj["comments"]:
            authors.append(comment["author"])
            for reply in comment["replies"]:
                authors.append(reply["author"])
_authors=dict()
for author in authors:
    try:
        if(_authors[author["fullName"]] is None):
            _authors[author["permalink"]] = author["fullName"]
    except KeyError:
        _authors[author["permalink"]] = author["fullName"]

print(json.dumps(_authors), file=open("./authors.json", "a", encoding='utf-8'))