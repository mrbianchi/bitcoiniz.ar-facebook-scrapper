with open("allposts.txt", 'r') as fin:
    data = fin.read().splitlines(True)
    #data = [line[:-1] for line in data]
data = set(data)
with open("allposts.txt", 'w') as fout:
    fout.writelines(data)