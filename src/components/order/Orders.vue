<template>
  <div>
    <div class="crumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search-button"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table
        :data="orderList"
        :header-cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
        :cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
      >
        <el-table-column label="序号" width="150" type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status ==='1'" effect="dark">已付款</el-tag>
            <el-tag type="warning" v-if="scope.row.pay_status !=='1'" effect="dark">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.is_send ==='是'" effect="dark">已发货</el-tag>
            <el-tag type="warning" v-if="scope.row.is_send !=='是'" effect="dark">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"></el-table-column>
        <el-table-column label="操作">
          <template>
            <el-tooltip content="修改地址" placement="top" effect="light">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="editDialogVisible=true"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="物流信息" placement="top" effect="light">
              <el-button type="success" icon="el-icon-location" size="mini" circle @click="showProgressDialog"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, prev, pager, next ,jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="addressForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="省市区/县" prop="selectAddress">
          <el-cascader v-model="addressForm.selectAddress" :options="cityData"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="writeAddress">
          <el-input v-model="addressForm.writeAddress" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 显示物流进度的对话框 -->
    <el-dialog title="修改地址" :visible.sync="progressDialogVisible" width="60%">
     <!-- 时间线组件 -->
      <el-timeline >
        <el-timeline-item
          v-for="(progress, index) in progressList"
          :key="index"
          :timestamp="progress.time"
        >{{progress.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1, //页码
        pagesize: 5, //显示条数
      },
      orderList: [],
      total: 0,
      editDialogVisible: false,
      progressDialogVisible:false,
      addressForm: {
        selectAddress: [],
        writeAddress: [],
      },
      cityData,
      editFormRules: {
        selectAddress: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        writeAddress: [
          { required: true, message: "请填写详细地址", trigger: "blur" },
        ],
      },
      progressList: [],
    };
  },
  created() {
    this.getOrdersList();
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.orderList = res.data.goods;
      for(var item of this.orderList){
        item.create_time = this.getFormatDate(item.create_time);
      }
      this.total = res.data.total;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
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
      this.getOrdersList();
    },

    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getOrdersList();
    },
    // 获取物流信息
    async showProgressDialog(){
        const {data:res} = await this.$http.get('/kuaidi/804909574412544580');
        if(res.meta.status !== 200){
           return this.$message.error(res.meta.msg);
        }
        // console.log(res.data);
        this.progressList = res.data;
        this.progressDialogVisible = true;
    }
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
  .el-table {
    //   background: rgb(14, 23, 38);
    color: rgb(185, 193, 207);
    margin-top: 20px;
    tr {
      background-color: rgb(14, 23, 38);
    }
  }
  .el-pagination {
    padding-top: 20px;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>