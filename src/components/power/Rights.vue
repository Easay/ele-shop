<template>
  <div>
    <div class="crumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-table
        :data="rightsList"
        :header-cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
        :cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
      >
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag color="rgb(226,160,63)" v-if="scope.row.level==='0'" effect="dark">一级</el-tag>
            <el-tag color="rgb(92,26,195)" size="small" v-else-if="scope.row.level==='1'" effect="dark">二级</el-tag>
            <el-tag color="rgb(231,81,90)" size="small" v-else effect="dark">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get(`rights/list`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightsList = res.data;
      // console.log(this.rightsList);
    },
  },
};
</script>

<style scoped lang="less">
.box-card {
  background: rgb(14, 23, 38);
  //   background: rgb(14, 23, 38);
  border: 1px solid rgb(14, 23, 38);
  color: rgb(185, 193, 207);
  width: 100%;
}
</style>