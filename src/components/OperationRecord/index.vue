<template>
    <div class="operation-record-wrapper" >
      <el-timeline>
        <el-timeline-item timestamp="2018/4/12" placement="top">
          <el-card>
            <h4>操作1</h4>
            <p>odd 提交于 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/3" placement="top">
          <el-card>
            <h4>操作2</h4>
            <p>odd 提交于 2018/4/3 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/2" placement="top">
          <el-card>
            <h4>操作3</h4>
            <p>odd 提交于 2018/4/2 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/12" placement="top">
          <el-card>
            <h4>操作4</h4>
            <p>odd 提交于 2018/4/12 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/3" placement="top">
          <el-card>
            <h4>操作5</h4>
            <p>odd 提交于 2018/4/3 20:46</p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2018/4/2" placement="top">
          <el-card>
            <h4>操作6</h4>
            <p>odd 提交于 2018/4/2 20:46</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
</template>

<script>
export default {
  name: 'operation-record'
}
</script>

<style lang="less" scoped>
.operation-record-wrapper{
    height: 980px;
  overflow: auto;
}
</style>
