<template>
  <div>
    <div class="crumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <span>添加分类</span>
      <el-button
        icon="el-icon-plus"
        circle
        size="mini"
        class="addCate"
        @click="addDialogVisible='true';"
      ></el-button>
      <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index :row-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)'}" :cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)'}">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-error" style="color:rgb(245,108,108);" v-if="scope.row.cate_deleted"></i>
          <i class="el-icon-success" style="color:rgb(103,194,58);" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0" effect="dark">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1" effect="dark">二级</el-tag>
          <el-tag size="mini" type="warning" v-else effect="dark">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operate">
          <el-button type="primary" size="mini" class="el-icon-edit" circle></el-button>
          <el-button type="danger" size="mini" class="el-icon-delete" circle></el-button>
        </template>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
          align: "center",
          headerAlign:"center",
        },
        {
          label: "是否有效",
          //   当前列是模板类
          type: "template",
          //   自定义
          template: "isOk",
          align: "center",
          headerAlign:"center",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
          align: "center",
          headerAlign:"center",
        },
        {
          label: "操作",
          type: "template",
          template: "operate",
          align: "center",
          headerAlign:"center",
        },
      ],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      console.log(res.data);
      this.cateList = res.data.result;
      this.total = res.total;
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
  .addCate {
    background-color: rgb(14, 23, 38);
    border: 1px solid rgb(59, 63, 92);
    margin-left: 20px;
    color: rgb(140, 182, 194);
    margin-top: 5px;
  }
  .zk-table{
      margin-top:20px;
      font-size: 13px;
  }
}
</style>