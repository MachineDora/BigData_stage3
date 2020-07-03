from django.shortcuts import render
from django.http import JsonResponse
import pymongo

client=pymongo.MongoClient("mongodb://mongoadmin:mongoadmin@47.100.220.26:27017")
db=client.stock
all=db.all
changeData=db.hks
node=db.Nodes
link=db.Links

# Create your views here.
def home(request):
    return render(request, 'home.html')

def getAllChart(request):
    NODES = []
    LINKS = []
    IDandName={}
    count1 = 0
    count2 = 0
    nodes = open('D:\\NJU\\大三\\下\\大数据集成\\nodes_new.txt', 'r')
    lineNode = nodes.readline()
    while lineNode:
        count1 += 1
        if isinstance(lineNode.split("#")[2], float) == True:
            lineNode.split("#")[2] = str(float(lineNode.split("#")[2]) / 10000)
        node = {
            "id": str(count1),
            "name": lineNode.split("#")[0],
            "code": lineNode.split("#")[1],
            "symbolSize": lineNode.split("#")[2],
            "kind": lineNode.split("#")[3],
            "inDegrees":lineNode.split("#")[4],
            "outDegrees": lineNode.split("#")[5],
        }
        IDandName[node["name"]]=count1
        NODES.append(node)
        lineNode = nodes.readline()
    links = open('D:\\NJU\\大三\\下\\大数据集成\\links.txt', 'r')
    lineLinks = links.readline()
    while lineLinks:
        count2 += 1
        link = {
            "id": count2,
            "name": lineLinks.split("#")[2],
            "source": str(IDandName[lineLinks.split("#")[0]]),
            "target": str(IDandName[lineLinks.split("#")[1]])
        }
        LINKS.append(link)
        lineLinks = links.readline()
    s = {
        "nodes": NODES[0:2000],
        "links": LINKS[0:6000]
    }
    return JsonResponse(s)

def getInfoByCode(request):
    code=request.GET.get("code",'')
    data0=list(all.find({'股票代码':code}))
    if len(data0)==0:
        s={
            'code':0
        }
        return JsonResponse(s)
    else:
        data = data0[0]
        print(data)
        s={
            '股票代码': data['股票代码'],
            '公司简称': data['公司简称'],
            '公司全称': data['公司全称'],
            '上市时间': data['上市时间'],
            '注册资本(万元)': data['注册资本(万元)'],
            '实际控制人': data['实际控制人'],
            '股东详情': data['股东详情'],
            '总股本(万股)': data['总股本(万股)'],
            '总流通股本(万股)': data['总流通股本(万股)'],
            '每股净资产(元/股)': data['每股净资产(元/股)'],
            '主营收入(万元)': data['主营收入(万元)'],
            '净利润(万元)': data['净利润(万元)'],
            '高管列表': data['高管列表'],
            '板块': data['板块'],
            '发行价格': data['发行价格'],
            '主营业务': data['主营业务'],
            '行业分类': data['行业分类'],
            '评级': data['评级'],
            '状态': data['状态'],
            '每股收益': data['每股收益'],
            '每股经营现金流': data['每股经营现金流'],
            '净资产收益率': data['净资产收益率'],
            '总资产': data['总资产'],
            '总负债': data['总负债'],
            '总利润': data['总利润'],
            '净利润': data['净利润'],
            '经营现金流': data['经营现金流'],
            '股本变动': data['股本变动'],
            '数据源': data['数据源']
        }
        return JsonResponse(s)

def getChangeByCode(request):
    code = request.GET.get("code", '')
    data0 = list(changeData.find({'股票代码': code}))
    print(data0)
    s={}
    for data in data0:
        s[data['交易日期']]={
            '开盘价':data['开盘价'],
            '最高价':data['最高价'],
            '最低价': data['最低价'],
            '收盘价': data['收盘价'],
            '昨日收盘价': data['昨日收盘价'],
            '涨跌额': data['涨跌额'],
            '成交量(手)': data['成交量(手)'],
            '成交额(千元)': data['成交额(千元)'],
        }
    return JsonResponse(s)