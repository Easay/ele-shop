<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <span :to="{ path: '/home' }">电商后台管理系统</span>
      <el-button type="info" @click="logout">退 出</el-button>
    </el-header>
    <el-header class="dropDown">
      <!-- 切换菜单的折叠和展开 -->
      <i class="iconfont icon-gengduo" @click="isCollapse=!isCollapse"></i>
      <!-- 面包屑导航 -->
      
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <el-menu
          background-color="rgb(6, 8, 24)"
          text-color="rgb(66,84,121)"
          active-text-color="rgb(1,117,111)"
          unique-opened="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import "../assets/css/homeStyleChange.css";
export default {
  data() {
    return {
      //左侧菜单列表
      menuList: [],
      //图标样式对象
      iconsObj: {
        "125": " iconfont icon-huiyuanguanli ",
        "103": " iconfont icon-mendianguanli",
        "101": " iconfont icon-shangpinguanli",
        "102": " iconfont icon-dingdanguanli",
        "145": " iconfont icon-fenxi",
      },
      //是否折叠左侧菜单
      isCollapse: false,
      //当前激活菜单的路径
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem("activePath");
  },
  methods: {
    //获取左侧的菜单列表
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      //   console.log(res);
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg);
      }
      this.menuList = res.data;
    },
    // 退出
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    //保存激活菜单的状态
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: rgb(205, 205, 209);
}
.el-breadcrumb__inner {
  color: rgb(205, 205, 209);
}
.el-container {
  height: 100%;
}
.el-header {
  background: rgb(6, 8, 24);
  display: flex;
  align-items: center;
  img {
    width: 50px;
    margin-left: 10px;
  }
  span {
    margin-left: 10px;
    color: rgb(224, 230, 237);
    font-size: 20px;
    margin-right: auto;
  }
}
.dropDown {
  background: rgb(26, 28, 45);
  .icon-gengduo {
    margin-left: 20px;
    color: rgb(191, 196, 205);
    letter-spacing: 0.1rem;
    cursor: pointer;
    font-weight: 90;
    padding-right: 20px;
  }
}
.el-aside {
  background: rgb(6, 8, 24);
  border-right: 1px solid rgb(14, 23, 38);
  .toggle-button {
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #eee;
    text-align: center;
    letter-spacing: 0.1rem;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0px;
    .iconfont {
      margin-right: 10px;
      color: rgb(66, 84, 121);
    }
    .el-submenu:hover {
      background-color: rgb(59, 63, 92);
    }
  }
}
.el-main {
  background: rgb(6, 8, 24);
}
</style>