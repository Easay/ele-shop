<template>
  <div>
    <div class="crumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>权限管理</el-breadcrumb-item>
          <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <span>添加角色</span>
      <el-button
        icon="el-icon-plus"
        circle
        size="mini"
        class="addUser"
        @click="addDialogVisible= true"
      ></el-button>
      <el-table
        :data="rolesList"
        :header-cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
        :cell-style="{background:'rgb(14, 23, 38)',color:'rgb(191,201,212)','text-align':'center'}"
      >
        <el-table-column type="expand" :class="{expandStyle:true}">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              :class="{bdbottom:true,bdtop:i1==0,vcenter:true}"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="{bdtop:i2!=0,vcenter:true}"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row,item2.id)"
                    >{{ item2.authName }}</el-tag>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级权限 -->
                    <el-tag
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      type="warning"
                      @close="removeRightById(scope.row,item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              round
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              round
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-share"
              size="small"
              round
              @click="showRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="30%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" width="30%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="rightDialogVisible"
      width="30%"
      @close="rightDialogClosed"
    >
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :props="rightProps"
        default-expand-all="true"
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="asignRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      rightDialogVisible: false,

      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      rightList: [],
      rightProps: {
        label: "authName",
        children: "children",
      },
      //   默认选中的权限节点数组
      defaultKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.rolesList = res.data;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("/roles", this.addForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }

        this.getRolesList();
        this.$message.success(res.meta.msg);
        this.addDialogVisible = false;
      });
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.editForm = res.data;
      console.log(id);
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    editRoles() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("添加角色失败！");
        }
        const { data: res } = await this.$http.put(
          `roles/${this.editForm.roleId}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色失败！");
        }
        this.getRolesList();
        this.editDialogVisible = false;
        this.$message.success("修改角色成功！");
      });
    },

    // 删除角色
    removeRoleById(id) {
      this.$confirm("确定删除角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg);
          }
          this.getRolesList();
          this.$message.success(res.meta.msg);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除权限
    removeRightById(role, rightId) {
      //   this.$message.success(res.meta.msg);
      this.$confirm("此操作将永久取消该用户权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("删除权限失败！");
          }
          //   this.getRolesList(); 不建议，因为会使整个页面刷新
          role.children = res.data; //只需要重新设置角色权限即可
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        })
        .catch(() => {});
    },
    async showRightDialog(role) {
      //   console.log(id);
      //   获取所有权限列表
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightList = res.data;
      this.rightDialogVisible = true;

      //   获取角色下所有三级权限的id
      this.getLeafKeys(role, this.defaultKeys);
      //   存储当前要分配权限的角色id
      this.roleId = role.id;
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果不是三级权限，则递归
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    rightDialogClosed() {
      this.defaultKeys = [];
    },
    async asignRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }
      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.rightDialogVisible=false;
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
.addUser {
  background-color: rgb(14, 23, 38);
  border: 1px solid rgb(59, 63, 92);
  margin-left: 20px;
  color: rgb(140, 182, 194);
  margin-top: 5px;
  margin-bottom: 5px;
}
.expandStyle {
  background: rgb(14, 23, 38);
}
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
// 设置垂直居中
.vcenter {
  display: flex;
  align-items: center;
}
</style>