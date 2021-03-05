<template>
  <div>
    <div class="crumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
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
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-button
          icon="el-icon-plus"
          circle
          size="mini"
          class="addUser"
          @click="addDialogVisible = 'true'"
        ></el-button>
      </el-row>
      <el-table
        :data="userList"
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
        <el-table-column
          label="序号"
          width="150"
          type="index"
        ></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!-- 自定义模板，使用scope.row获取当前行的数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="修改用户信息" placement="top" effect="light">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除用户" placement="top" effect="light">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                circle
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配新角色" placement="top" effect="light">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                circle
                @click="showAsignDialog(scope.row)"
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
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="asignDialogVisible"
      width="30%"
      @close="asignDialogClosed"
    >
      <el-form :model="asignForm" ref="asignFormRef">
        <el-form-item label="当前用户" prop="username">
          <span>{{ asignForm.username }}</span>
        </el-form-item>
        <el-form-item label="当前角色" prop="role_name">
          <span>{{ asignForm.role_name }}</span>
        </el-form-item>
        <el-form-item label="分配新角色" prop="newRoleName">
          <el-select v-model="newRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="asignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="asignNewRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import "../../assets/css/usersStyleChange.css";
export default {
  data() {
    return {
      // 查询用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1, //页码
        pagesize: 5, //页的大小
      },
      userList: [],
      roleList: [],
      newRoleId: "",
      total: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      asignDialogVisible: false,
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      editForm: {},
      asignForm: [],
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUserList();
    },

    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUserList();
    },
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("users", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败！");
        }
        // 关闭对话框
        this.addDialogVisible = false;

        // 刷新用户列表
        this.getUserList();
        this.$message.success("添加用户成功！");
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 编辑用户
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败！");
        }
        // 关闭对话框
        this.editDialogVisible = false;

        // 刷新用户列表
        this.getUserList();
        this.$message.success("修改用户成功！");
      });
    },
    // 删除用户
    removeUserById(id) {
      this.$confirm("确定删除用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除用户失败！");
          }
          this.getUserList();
          this.$message.success("删除用户成功！");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
          //this.$message.info("已取消删除");
        });
    },
    // 分配新角色对话框
    async showAsignDialog(user) {
      // console.log(user);
      this.asignForm.username = user.username;
      this.asignForm.role_name = user.role_name;
      this.asignForm.id = user.id;
      this.asignDialogVisible = true;
      //  获取角色列表
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
      // console.log(this.roleList);
    },

    //  分配角色对话框关闭
    asignDialogClosed() {
      this.$refs.asignFormRef.resetFields();
    },
    // 分配角色
    async asignNewRole() {
      // console.log(this.newRole.roleName);
      const { data: res } = await this.$http.put(
        `users/${this.asignForm.id}/role`,
        {
          rid: this.newRoleId,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      // console.log(res);
      this.getUserList();
      this.$message.success(res.meta.msg);
      this.newRoleId = "";
      this.asignDialogVisible = false;
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
  .addUser {
    background-color: rgb(14, 23, 38);
    border: 1px solid rgb(59, 63, 92);
    margin-left: 20px;
    color: rgb(140, 182, 194);
    margin-top: 5px;
  }
  .el-table {
    //   background: rgb(14, 23, 38);
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
.el-card,
.el-message {
  border-radius: 10px;
}
.el-pagination {
  padding-top: 20px;
}
</style>