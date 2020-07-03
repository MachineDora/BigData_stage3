links= open( '..\\links.txt', 'r' )
nodes = open('..\\nodes.txt', 'r')
nodes_new = open('..\\nodes_new.txt', 'a')
all={}

lineLink = links.readline()

while lineLink:
    outC=lineLink.split("#")[0]
    inC=lineLink.split("#")[1]
    if outC in all.keys():
        all[outC]["outDegrees"]=all[outC]["outDegrees"]+1
    else:
        all[outC]={
            "inDegrees":0,
            "outDegrees":1
        }
    if inC in all.keys():
        all[inC]["inDegrees"]=all[inC]["inDegrees"]+1
    else:
        all[inC] = {
            "inDegrees": 1,
            "outDegrees": 0
        }
    lineLink = links.readline()

lineNode = nodes.readline()

while lineNode:
    node=lineNode.split("#")[0]
    inDegrees=all[node]["inDegrees"]
    outDegrees = all[node]["outDegrees"]
    line=lineNode.strip("\n")+"#"+str(inDegrees)+"#"+str(outDegrees)+"\n"
    nodes_new.write(line)
    lineNode = nodes.readline()
