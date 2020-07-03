function getCodeInfo() {
    var codeTag=document.getElementById("code0");
    var code=codeTag.value;
    $.getJSON('getInfoByCode',"code=" + code, function (ret) {
        if(ret['code']===0){
            alert("你要查找的股票代码不存在！请重新输入。");
        }
        else{
            console.log(ret);
        $('#mainInfo').empty();
        $('#mainAff').empty();
        $('#otherInfos').empty();
        $('#peopleList').empty();
        $('#stockConnection').empty();
        $('#profitPerG').empty();
        $('#Money').empty();
        $('#allMoney').empty();
        $('#industryC').empty();
        $('#level').empty();
        var block=
            "<div class='title'>"+ "公司名称："+ret['公司全称']+ "</div>"+
            "<div class='title'>"+ "股票代码："+ret['股票代码']+ "</div>"+
            "<div class='title'>"+ "上市时间："+ret['上市时间']+ "</div>"+
            "<div class='title'>"+ "实际控制人："+ret['实际控制人']+ "</div>"+
            "<div class='title'>"+ "注册资本："+ret['注册资本(万元)']+"万元"+ "</div>";
        $('#mainInfo').append(block);
        var block2=
            "主营业务："+ret['主营业务'];
        $('#mainAff').append(block2);
        var block3=
            "<div class='title0'>"+ ret['板块'] +"</div>"+
            "<div class='title0'>"+ret['总股本(万股)']+"万股"+ "</div>"+
            "<div class='title0'>"+ ret['总流通股本(万股)']+"万股"+"</div>"+
            "<div class='title0'>"+ ret['每股净资产(元/股)'] +"元/股"+"</div>"+
            "<div class='title0'>" +ret['主营收入(万元)']+"万元"+ "</div>"+
            "<div class='title0'>" +ret['净利润(万元)']+"万元" +"</div>" +
            "<div class='title0'>"+ret['发行价格'] +"元"+"</div>"+
            "<div class='title0'>"+ ret['状态'] +"</div>";
        $('#otherInfos').append(block3);
        var peoplelist=ret['高管列表'];
        var block4="";
        block4+="高管列表"+"<div class='peopleList' style='display: flex'>";
        for(var i=0;i<(peoplelist>5?peoplelist:5);i++){
            block4+=
                "<div class='people'>"+peoplelist[i]+"</div>";
        }
        block4+="</div>";
        block4+="<div class='peopleList' style='display: flex'>";
        for(var j=5;j<peoplelist.length;j++){
            block4+=
                "<div class='people'>"+peoplelist[j]+"</div>";
        }
        block4+="</div>";
        $('#peopleList').append(block4);

        var GDs=ret['股东详情'];
        var legendData = [];
        var seriesData = [];
        for(var k=0;k<10;k++){
            legendData.push(GDs[k]['股东名称']);
            if(GDs[k]['持股数'].indexOf(',')){
                GDs[k]['持股数']=parseFloat(GDs[k]['持股数'].replace(/,/g,''))/10000;
            }
            seriesData.push({
                name: GDs[k]['股东名称'],
                value: GDs[k]['持股数']
            });
        }

        option = {
            title: {
                text: '持股控股饼状图',
                subtext:'这里的百分比是是指在前10股东的百分比，不是全部股东，基本差的不大',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 60,
                bottom: 0,
                data: legendData,
            },
            series: [
                {
                    name: '股东',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '75%'],
                    data: seriesData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var cloud=echarts.init(document.getElementById('stockConnection'));
        cloud.setOption(option,true);

        var block5=
            "行业分类" +"<br><br>"+
            "证监会行业分类 :"+ ret['行业分类']['证监会行业分类']+ "<br>"+
            "全球行业分类 :"+ ret['行业分类']['全球行业分类']+ "<br>"+
            "申万行业分类 :"+ ret['行业分类']['申万行业分类']
        $('#industryC').append(block5);

        var block6=
            "评级"+ "<br><br>"+
            "综合评级 :"+ ret['评级']['综合评级']+"<br>"+
            "市盈率(TTM) :"+ ret['评级']['市盈率(TTM)'] +"<br>"+
            "市净率(MRQ) :"+ ret['评级']['市净率(MRQ)']+ "<br>"+
            "市现率(TTM) :" +ret['评级']['市现率(TTM)']
        $('#level').append(block6);
        }

        var profitPerG=ret['每股收益'];
        var timeData=[];
        var DataOfTime=[];
        for(var p in profitPerG){
            timeData.push(p);
            DataOfTime.push(profitPerG[p]);
        }
        timeData.reverse();
        DataOfTime.reverse();

        option2 = {
            title:{
                text:'每股收益变化图'
            },
            xAxis: {
                type: 'category',
                data: timeData
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: DataOfTime,
                type: 'line'
            }]
        };
        var cloud2=echarts.init(document.getElementById('profitPerG'));
        cloud2.setOption(option2,true);

        var moneyPerG=ret['每股经营现金流'];
        var timeData2=[];
        var DataOfTime2=[];
        for(var m in moneyPerG){
            timeData2.push(m);
            DataOfTime2.push(moneyPerG[m]);
        }
        timeData2.reverse();
        DataOfTime2.reverse();

        option3 = {
            title:{
                text:'每股经营现金变化图'
            },
            xAxis: {
                type: 'category',
                data: timeData2
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: DataOfTime2,
                type: 'line'
            }]
        };
        var cloud3=echarts.init(document.getElementById('Money'));
        cloud3.setOption(option3,true);

        var money1=ret['总资产'];
        var money2=ret['总负债'];
        var money3=ret['总利润'];
        var money4=ret['净利润'];
        var money5=ret['经营现金流'];

        var moneyTime=[];
        var DataOfmoney1=[];
        var DataOfmoney2=[];
        var DataOfmoney3=[];
        var DataOfmoney4=[];
        var DataOfmoney5=[];

        for(var m1 in money1){
            moneyTime.push(m1.split(" ")[0]);
            DataOfmoney1.push(money1[m1]);
            DataOfmoney2.push(money2[m1]);
            DataOfmoney3.push(money3[m1]);
            DataOfmoney4.push(money4[m1]);
            DataOfmoney5.push(money5[m1]);
        }

        option4 = {
            title: {
                text: '总资产变化图'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总资产', '总负债', '总利润', '净利润', '经营现金流']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: moneyTime
            },
            yAxis:
                {
                    type: 'value',
                },
            series: [
                {
                    name: '总资产',
                    type: 'line',
                    data: DataOfmoney1
                },
                {
                    name: '总负债',
                    type: 'line',
                    data: DataOfmoney2
                },
                {
                    name: '总利润',
                    type: 'line',
                    data: DataOfmoney3
                },
                {
                    name: '净利润',
                    type: 'line',
                    data: DataOfmoney4
                },
                {
                    name: '经营现金流',
                    type: 'line',
                    data: DataOfmoney5
                }
            ]
        };
        var cloud4=echarts.init(document.getElementById('allMoney'));
        cloud4.setOption(option4,true);
    });
    $.getJSON('getChangeByCode',"code=" + code,function(ret){
        console.log(ret);
        $('#allChange').empty();
        var monthData=[];
        var data1=[];
        var data2=[];
        var data3=[];
        var data4=[];
        var data5=[];
        var data6=[];
        var data7=[];

        for(var time in ret){
            monthData.push(time);
            data1.push(ret[time]['开盘价']);
            data2.push(ret[time]['最高价']);
            data3.push(ret[time]['最低价']);
            data4.push(ret[time]['收盘价']);
            data5.push(ret[time]['昨日收盘价']);
            data6.push(ret[time]['成交量(手)']);
            data7.push(ret[time]['成交额(千元)']);
        }


        option5 = {
            title: {
                text: '交易所数据变化图（两个月）'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            legend: {
                data: ['开盘价', '最高价', '最低价', '收盘价', '昨日收盘价', '成交量(手)', '成交额(千元)']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: monthData
            },
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 成交量/千元'
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 元'
                    }
                },
                ],
            series: [
                {
                    name: '开盘价',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data1
                },
                {
                    name: '最高价',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data2
                },
                {
                    name: '最低价',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data3
                },
                {
                    name: '收盘价',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data4
                },
                {
                    name: '昨日收盘价',
                    type: 'line',
                    yAxisIndex: 1,
                    data: data5
                },
                {
                    name: '成交量(手)',
                    type: 'bar',
                    data: data6
                },
                {
                    name: '成交额(千元)',
                    type: 'bar',
                    data: data7
                }
            ]
        };
        var cloud5=echarts.init(document.getElementById('allChange'));
        cloud5.setOption(option5,true);
    })
}

function getChart() {
    $.getJSON('getAllChart',function(ret){
        console.log(ret);
        $('#mainInfo').hide();
        $('#mainAff').hide();
        $('#content-main').hide();
        $('#code').hide();

        var categories = [];
        categories[0] = {
            name: "股票公司"
        };
        categories[0] = {
            name: "股东公司"
        };

        ret.nodes.forEach(function (node) {
            node.itemStyle = null;
            node.label={
                show:node.symbolSize>600000||node.outDegrees>50
            };
            node.value = node.symbolSize;
            if(parseInt(node.kind)===1){
                if(node.outDegrees<=10){
                    node.symbolSize=10;
                }else{
                    node.symbolSize=Math.sqrt(node.outDegrees)+8;
                }
            }
            else{
                node.symbolSize = Math.sqrt(node.symbolSize/1000);
            }
            node.draggable = true;
        });
        option = {
            title: {
                text: '大数据集成知识图谱',
                top: 'bottom',
                left: 'right'
            },
            tooltip: {},
            /*legend: [{
                // selectedMode: 'single',
                data: categories.map(function (a) {
                    return a.name;
                })
            }],*/
            animation: false,
            series : [
                {
                    name: '大数据集成知识图剖',
                    type: 'graph',
                    layout: 'force',
                    data: ret.nodes,
                    links: ret.links,
                    roam: true,
                    label: {
                        position: 'right'
                    },
                    force: {
                        repulsion: 100
                    },
                    itemStyle:{
                        normal:{
                            color:function (params) {
                                var colorList = ['#009bff','#00ff86','yellow','orange','red'];
                                if(parseInt(params.data.kind)===0){
                                    return colorList[0]
                                }
                                else if(parseInt(params.data.outDegrees)>=0&&parseInt(params.data.outDegrees)<40){
                                    return colorList[1]
                                }
                                else if(parseInt(params.data.outDegrees)>=40&&parseInt(params.data.outDegrees)<70){
                                    return colorList[2]
                                }
                                else if(parseInt(params.data.outDegrees)>=70&&parseInt(params.data.outDegrees)<150){
                                    return colorList[3]
                                }
                                else if(parseInt(params.data.outDegrees)>=150){
                                    return colorList[4]
                                }
                            },

                        }
                    }
                }
            ]
        };
        var chart=echarts.init(document.getElementById('chart'));
        chart.setOption(option,true);
    })
}