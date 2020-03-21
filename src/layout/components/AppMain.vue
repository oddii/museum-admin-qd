<template>
  <div class="main-container">
    <!--四个card页-->
    <ul class="card-group clearfix">
      <li>
        <el-card class="card-panel">
          <div class="icon-wrapper icon1">
            <i class="iconfont">&#xe788;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">文物数量</div>
            <div class="content-text">1600000</div>
          </div>
        </el-card>
      </li>
      <li>
        <el-card class="card-panel">
          <div class="icon-wrapper icon2">
            <i class="iconfont">&#xe786;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">待录文物</div>
            <div class="content-text">51</div>
          </div>
        </el-card>
      </li>
      <li>
        <el-card class="card-panel">
          <div class="icon-wrapper icon3">
            <i class="iconfont">&#xe783;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">仓库总数</div>
            <div class="content-text">10</div>
          </div>
        </el-card>
      </li>
      <li>
        <el-card class="card-panel">
          <div class="icon-wrapper icon4">
            <i class="iconfont">&#xe77c;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">团队人数</div>
            <div class="content-text">16</div>
          </div>
        </el-card>
      </li>
    </ul>

    <!--大图表-->
    <el-card class="chart-container">
      <div class="chart-title">{{lineTitle}}</div>
      <div class="chart">
        <ve-line :data="lineData" :settings="lineSettings" :colors="chartColors" :extend="lineExtend" :grid="lineGrid"/>
      </div>
    </el-card>

    <div class="bottom-container clearfix">

      <el-row>
        <!--博物馆文物仓库类型图表-->
        <el-col :span="7">
          <el-card class="ring-container">
            <div class="ring-title">{{ringTitle}}</div>
            <ve-ring :data="ringData" :settings="ringSettings" :extend="ringExtend" height="350px"/>
          </el-card>
        </el-col>

        <!--最近待录入文物简单展示-->
        <el-col :span="11">
          <el-card class="wait-container">
            <div class="wait-title">最近待入文物</div>
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item :name="index" v-for="(item,index) in waitListData" :key="index">
                <template slot="title">
                  <div class="wait-title">{{item.name}}</div>
                </template>
                <div class="wait-content">
                  <p>文物编号：{{item.id}}<span>存储位置：{{item.location}}</span></p>
                  <p>录入时间：{{item.entry_time}}</p>
                  <el-button size="small" type="warning" class="btn-wait-insert">立即录入</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-col>

        <!--右下角位置-->
        <el-col :span="6">
          <div class="bottom-right-container">
            <!--显示天气-->
            <el-card class="weather-container">
              <div id="he-plugin-standard"></div>
            </el-card>

            <!--最近事件位置-->
            <el-card class="ad-container">
              <div class="a-title">最近事件</div>
              <el-timeline style="margin-top: 15px;">
                <el-timeline-item v-for="(item, index) in activities" :key="index"
                                  :timestamp="item.timestamp" :color="item.color">
                  {{item.content}}
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import data from '@/mock/lineData.json'
import weatherInit from '../../utils/weather'
import waitData from '@/mock/waitListData.json'
export default {
  name: 'AppMain',
  created () {
    weatherInit()
  },
  data () {
    return {
      waitListData: waitData.data,
      chartColors: ['#ff085f', '#3a89fa'],
      lineGrid: {
        show: true,
        backgroundColor: '#f6fafe',
        borderColor: '#f6fafe'
      },
      lineExtend: {
        yAxis: {
          name: '数量',
          axisLabel: {
            textStyle: {
              color: '#999',
              fontSize: 14
            }
          },
          splitLine: { show: false },
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: { color: '#999' }
          }
        },
        xAxis: {
          splitLine: { show: false },
          axisLine: {
            show: true,
            lineStyle: { color: '#999' }
          }
        }
      },
      lineSettings: {
        xAxisType: 'category'
      },
      lineTitle: '过去三十天博物馆文物数量变化图',
      lineData: {
        columns: ['日期', '入库文物', '出库文物'],
        rows: data.data
      },
      activeName: '0',
      ringSettings: {
        selectedMode: 'single',
        roseType: 'radius',
        offsetY: 152
      },
      ringExtend: {
        legend: {
          x: 'center',
          y: 'bottom'
        }
      },
      ringData: {
        columns: ['日期', '访问用户'],
        rows: [
          {
            日期: '1/1',
            访问用户: 1393
          },
          {
            日期: '1/2',
            访问用户: 3530
          },
          {
            日期: '1/3',
            访问用户: 2923
          },
          {
            日期: '1/4',
            访问用户: 1723
          },
          {
            日期: '1/5',
            访问用户: 3792
          },
          {
            日期: '1/6',
            访问用户: 4593
          },
          {
            日期: '1/7',
            访问用户: 2150
          },
          {
            日期: '1/8',
            访问用户: 3150
          }
        ]
      },
      ringTitle: '博物馆内各仓库文物数量',
      activities: [{
        content: '活动按期开始',
        timestamp: '2018-04-15',
        color: '#409EFF'
      }, {
        content: '通过审核',
        timestamp: '2018-04-13',
        color: '#0bbd87'
      }]
    }
  }
}
</script>

<style lang="less" scoped>
  .main-container {
    margin-top: 15px;
    margin-left: 3px;

    .card-group {
      display: flex;
      justify-content: space-around;

      li {
        width: 23%;
        margin-right: 44px;

        .card-panel {
          position: relative;
          width: 100%;
          height: 120px;
          cursor: pointer;

          &:hover .icon-wrapper i {
            color: white;
          }

          &:hover .icon1 {
            background-color: #409EFF;
          }

          &:hover .icon2 {
            background-color: #19d4ae;
          }

          &:hover .icon3 {
            background-color: #f4516c;
          }

          &:hover .icon4 {
            background-color: #b6a2de;
          }

          .icon1 i {
            color: #409EFF;
          }

          .icon2 i {
            color: #19d4ae;
          }

          .icon3 i {
            color: #f4516c;
          }

          .icon4 i {
            color: #b6a2de;
          }

          .icon-wrapper {
            position: absolute;
            width: 80px;
            height: 80px;
            text-align: center;
            border-radius: 5px;
            transition: all .5s;

            i {
              font-size: 70px;
            }
          }

          .content-wrapper {
            position: absolute;
            top: 28px;
            right: 30px;
            text-align: center;

            .content-title {
              font-size: 18px;
              color: #909399;
              font-family: 'HYDaSong';
            }

            .content-text {
              font-size: 28px;
              line-height: 50px;
              height: 45px;
            }
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }

    }

    .chart-container {
      margin-top: 35px;

      .chart-title {
        font-size: 17px;
        color: #666;
        font-family: 'HYDaSong';
      }

      .chart {
        height: 350px;
      }
    }

    .bottom-container {
      margin: 35px 0;

      .ring-container {
        float: left;
        width: 93%;
        color: #666;

        .ring-title {
          height: 35px;
          font-size: 17px;
          font-family: 'HYDaSong';
        }
      }

      .wait-container {
        float: left;
        width: 95.5%;
        color: #666;

        .wait-title {
          height: 35px;
          font-size: 17px;
          font-family: 'HYDaSong';
        }

        .wait-content{
          position: relative;
          p{
            height: 25px;
            line-height: 25px;
            font-size: 15px;

            span{
              margin-left: 100px;
            }
          }

          .btn-wait-insert{
            position: absolute;
            right: 20px;
            bottom: 5px;
          }
        }
      }

      .bottom-right-container {
        float: left;
        width: 100%;

        .weather-container {
          margin-bottom: 33px;
        }

        .ad-container {
          height: 212px;

          .a-title{
            height: 35px;
            font-size: 17px;
            font-family: 'HYDaSong';
            color: #666;
          }
        }
      }
    }
  }
</style>
