<template>
  <div>
    <!-- 面包屑导航 -->
    <div class="crumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-button"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-button
          icon="el-icon-plus"
          circle
          size="mini"
          class="addGood"
          @click="addDialogVisible = 'true'"
        ></el-button>
      </el-row>
      <el-table
        :data="goodsList"
        :header-cell-style="{
          background: 'rgb(14, 23, 38)',
          color: 'rgb(191,201,212)',
          'text-align': 'center',
        }"
        :cell-style="{
          background: 'rgb(14, 23, 38)',
          color: 'rgb(191,201,212)',
          'text-align': 'center',
        }"
      >
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="850"
        ></el-table-column>
        <el-table-column prop="goods_price" label="商品价格"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="修改商品信息" placement="top" effect="light">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除商品" placement="top" effect="light">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="removeGoodById(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next ,jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import func from '../../../vue-temp/vue-editor-bridge';
export default {
  data() {
    return {
      // 查询用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, //页码
        pagesize: 10, //页的大小
      },
      total: 0,
      goodsList: [],
      addDialogVisible: false,
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    async getGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      for(var item of this.goodsList){
          item.add_time = this.getFormatDate(item.add_time);
      }
    },
    getFormatDate(dataStr){
        var time = new Date(dataStr);
        function timeAdd0(str) {
            if (str < 10) {
                str = '0' + str;
            }
            return str
        }
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s);
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getGoodList();
    },

    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getGoodList();
    },
  },
};
</script>

<style lang="less" scoped>
.box-card {
  background: rgb(14, 23, 38);
  border: 1px solid rgb(14, 23, 38);
  color: rgb(185, 193, 207);
  width: 100%;
  .addGood {
    background-color: rgb(14, 23, 38);
    border: 1px solid rgb(59, 63, 92);
    margin-left: 20px;
    color: rgb(140, 182, 194);
    margin-top: 5px;
  }
  .el-table {
    color: rgb(185, 193, 207);
    margin-top: 20px;
    tr {
      background-color: rgb(14, 23, 38);
    }
  }
  .rowStyle {
    background: inherit;
  }
}
.el-pagination {
  padding-top: 20px;
}
</style>