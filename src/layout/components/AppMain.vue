<template>
  <div class="main-container">
    <!--四个card页-->
    <ul class="card-group clearfix">
      <li @click="$router.push('/relic/list')">
        <el-card class="card-panel">
          <div class="icon-wrapper icon1">
            <i class="iconfont">&#xe788;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">文物数量</div>
            <div class="content-text">{{boxData.relicsCount}}</div>
          </div>
        </el-card>
      </li>
      <li @click="$router.push('/relic/wait')">
        <el-card class="card-panel">
          <div class="icon-wrapper icon2">
            <i class="iconfont">&#xe786;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">待录文物</div>
            <div class="content-text">{{boxData.requestCount}}</div>
          </div>
        </el-card>
      </li>
      <li @click="$router.push('/store/list')">
        <el-card class="card-panel">
          <div class="icon-wrapper icon3">
            <i class="iconfont">&#xe783;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">仓库总数</div>
            <div class="content-text">{{boxData.storageCount}}</div>
          </div>
        </el-card>
      </li>
      <li @click="$router.push('/user/list')">
        <el-card class="card-panel">
          <div class="icon-wrapper icon4">
            <i class="iconfont">&#xe77c;</i>
          </div>
          <div class="content-wrapper">
            <div class="content-title">团队人数</div>
            <div class="content-text">{{boxData.memberCount}}</div>
          </div>
        </el-card>
      </li>
    </ul>

    <!--大图表-->
    <el-row :gutter="25">
      <el-col :span="17" class="left-container">
        <el-card>
          <div class="chart-title">{{lineTitle}}</div>
          <div class="chart">
            <ve-line :data="lineData" height="600px"
                     :settings="lineSettings" :colors="chartColors" :extend="lineExtend" :grid="lineGrid"/>
          </div>
        </el-card>
      </el-col>

      <el-col :span="7" class="right-container">
        <el-card class="ring-container">
          <div class="ring-title">{{ringTitle}}</div>
          <ve-ring :data="ringData" :settings="ringSettings" :extend="ringExtend" height="350px"/>
        </el-card>

        <el-card class="weather-container">
          <div id="he-plugin-standard"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from '../../api/baseApi'
import STATISTIC_API_URL from '../../api/statisticsApiUrls'
import weatherInit from '../../utils/weather'
export default {
  name: 'AppMain',
  created () {
    weatherInit()
    this.getLineData()
    this.getRingData()
    this.getBoxData()
  },
  data () {
    return {
      boxData: {
        relicsCount: 0,
        requestCount: 0,
        storageCount: 0,
        memberCount: 0
      },
      waitListData: [],
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
        rows: []
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
        columns: ['仓库名称', '文物数量'],
        rows: []
      },
      ringTitle: '博物馆内各仓库文物数量',
      activities: [
        {
          content: '活动按期开始',
          timestamp: '2018-04-15',
          color: '#409EFF'
        },
        {
          content: '通过审核',
          timestamp: '2018-04-13',
          color: '#0bbd87'
        }]
    }
  },
  methods: {
    getBoxData () {
      /**
       * 获得折线图数据
       */
      api.getObject(STATISTIC_API_URL.getBoxData)
        .then(result => {
          const { status, data } = result
          if (status !== 200) return this.$message.error('获取统计数据失败，请刷新重试')

          this.boxData.memberCount = data.memberCount
          this.boxData.relicsCount = data.relicsCount
          this.boxData.requestCount = data.requestCount
          this.boxData.storageCount = data.storageCount
        })
        .catch(result => {
          return this.$message.error('获取统计数据失败，请刷新重试')
        })
    },
    getLineData () {
      /**
       * 获得折线图数据
       */
      api.getObject(STATISTIC_API_URL.getLineData)
        .then(result => {
          const { status, data } = result
          if (status !== 200) return this.$message.error('过去三十天博物馆文物数量变化数据失败，请刷新重试')

          this.lineData.rows = data
        })
        .catch(result => {
          return this.$message.error('过去三十天博物馆文物数量变化数据失败，请刷新重试')
        })
    },
    getRingData () {
      /**
       * 获得扇形图数据
       */
      api.getObject(STATISTIC_API_URL.getRingData)
        .then(result => {
          const { status, data } = result
          if (status !== 200) return this.$message.error('博物馆内各仓库文物数量数据失败，请刷新重试')

          this.ringData.rows = data
        })
        .catch(result => {
          return this.$message.error('博物馆内各仓库文物数量数据失败，请刷新重试')
        })
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

    .left-container {
      margin-top: 35px;

      .chart-title {
        font-size: 17px;
        color: #666;
      }

      .chart {
        height: 555px;
      }
    }

    .right-container{
      margin-top: 35px;

      .ring-title{
        font-size: 17px;
        color: #666;
      }

      .ring-container{
        margin-bottom: 22px;
      }
    }
  }
</style>
