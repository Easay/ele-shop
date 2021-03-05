<template>
  <div>
      <div class="crumb-container">
          <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card class="box-card">
            <div id="main" style="width:600px;height:400px;">
            </div>
        </el-card>
        
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
   data(){
     return {

     }
   },
   mounted(){
       // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '销量展示',
                textStyle:{
                  color: '#E6E6FA'
                },
            },
            tooltip: {},
            legend: {
                data:['销量'],
                textStyle:{
                  color: '#E6E6FA'
                },
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
                axisLabel:{
                  textStyle:{
                    color:'#E6E6FA'
                  }
                }
            },
            yAxis: {  
              axisLabel:{
                  textStyle:{
                    color:'#E6E6FA'
                  }
                }},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20],
            }],
            backgroundColor:'transparent',
        };
        // option.xAxis.data.textStyle.color = "#E6E6FA";
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
   },
   methods:{

   },
}
</script>

<style scoped lang="less">
.box-card {
  background: rgb(14, 23, 38);
  border: 1px solid rgb(14, 23, 38);
  color: rgb(185, 193, 207);
  width: 100%;
}
</style>