<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo02.jpg" alt />
      </div>
      <!-- 标题 -->
      <div class="title">电商后台管理系统</div>
      <!-- 表单 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef" class="login_form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="iconfont icon-password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login" round>登陆</el-button>
          <el-button type="info" @click="resetLoginForm" round>重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
    </div>
  </div>
</template>
<script>
export default {
  name: "app",
  data() {
    return {
      // 表单数据绑定对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      //  表单较验规则
      loginFormRules: {
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
      },
    };
  },
  methods: {
    //   发送请求判断是否登陆成功
    /**
     *  async 和 await
     *  1.两者都是ES7提出的，是基于Promise实现的
     *  2.通过同步方式的写法，实现异步操作，使代码更易读
     *
     *  async
     *  1.async修饰的函数会变成异步函数，返回一个promise对象
     *  2.当函数执行时，一旦遇到await函数就会先返回一个promise对象，等到异步操作完成，再去执行后面的语句
     *
     *  await
     *  1.await只能放在async函数里
     *  2.await后面接一个会返回promise对象的函数并执行它
     */
    login() {
      //   判断表单校验是否成功
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("login", this.loginForm); //直接返回执行的结果
        console.log(res);
        if (res.meta.status != 200) {
          return this.$message.error("登陆失败！");
        }

        this.$message.success("登陆成功！");
        sessionStorage.setItem("token", res.data.token);

        //登陆成功后，进入Home页面
        this.$router.push('/home');
      });
    },
    resetLoginForm(){
        this.$refs.loginFormRef.resetFields();
    }
  },
};
</script>
<style scoped lang="less">
.login_container {
  background: url("../assets/technic.png");
  height: 100%;
}

.login_box {
  width: 450px;
  height: 350px;
//   background: rgba(255,255,255,0.7);
  border-radius: 7px;
  // 水平垂直居中
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 15px 15px 10px rgb(5, 5, 5);
  border: 1px solid #000;
  // logo
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px, solid, #ccc;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #eee;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    //   background: #fff;
    }
  }

  // 标题
  .title {
    position: absolute;
    top: 100px;
    right: 50%;
    transform: translate(50%);
    font-size: 20px;
    font-weight: bold;
    color: #fff;
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0px 20px;
    box-sizing: border-box;
    .btns {
      text-align: center;
    }
  }
}
</style>