import pymongo

client=pymongo.MongoClient("mongodb://mongoadmin:mongoadmin@47.100.220.26:27017")
db=client.stock
v=db.all

def getCode(i):
    if i>=1 and i<=999:
        return str(i).zfill(6)
    elif i>=1000 and i<=1998:
        return "002"+str(i-999).zfill(3)
    elif i>=1999 and i<=2997:
        return "300"+str(i-1998).zfill(3)
    elif i>=2998 and i<=3997 :
        return "600"+str(i-2998).zfill(3)
    elif i>=3998 and i<=4997:
        return "601"+str(i-3998).zfill(3)
    elif i>=4998 and i<=5997:
        return "603"+str(i-4998).zfill(3)
    else :
        return "688"+str(i-5998).zfill(3)


if __name__ == "__main__":
    guDongList=[]
    nodes = open( '..\\nodes.txt', 'a' )
    links= open( '..\\links.txt', 'a' )
    for i in range(1, 7000):
        code = getCode(i)
        data_all = v.find({'股票代码': str(code)})
        data=list(data_all)
        length = len(data)
        if length==1:
            print(code)
            list0 = data[0]
            guDongs=list0['股东详情']
            k={
                '股票代码':code,
                '公司名称':list0['公司全称'],
                '股本':list0['总股本(万股)'],
                '类型':0
            }
            nodes.write(k['公司名称']+"#"+k['股票代码']+"#"+str(k['股本'])+"#"+str(k['类型'])+"\n")
            for gudong in guDongs:
                s={
                    '股票代码': '--',
                    '公司名称': gudong['股东名称'],
                    '股本': '--',
                    '类型': 1
                }
                if s['公司名称'] not in guDongList:
                    guDongList.append(s['公司名称'])
                    nodes.write(s['公司名称']+"#"+s['股票代码']+"#"+str(s['股本'])+"#"+str(s['类型'])+"\n")
                t={
                    'source':s['公司名称'],
                    'target':k['公司名称'],
                    '持股数':gudong['持股数']
                }
                links.write(t['source']+"#"+t['target']+"#"+str(t['持股数'])+"\n")
