    <template>
        <div id ="login">
          <div id="bg" ref="bg"></div>
          <div class="login-container">
            <el-form :model="formOnLogin" ref="formOnLogin" :rules="rules" label-position="left" label-width="50px" size="medium" class="card-box login-form">
              <h3 style="text-align:center">商家后台系统</h3>
              <el-form-item  prop="account">
                <el-input v-model="formOnLogin.account" type="text" placeholder="用户名"></el-input>
              </el-form-item>

              <el-form-item  prop="password">
                <el-input v-model="formOnLogin.password" type="password" placeholder="密码" @keyup.enter.native="clickLogin('formOnLogin')"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" style="width:252px" @click="clickLogin('formOnLogin')">
                  登录
                </el-button>
              </el-form-item>
              <el-form-item>
                <a :href="addHref()">
                  <el-button type="primary" style="width:252px">
                    注册
                  </el-button>
                </a>
              </el-form-item>
            </el-form>
          </div>
        </div>
    </template>

    <script>
require('particles.js')
import config from './particles'
import goods from "@/api/goods";
import login from "@/api/login/login";
import { saveToken, getCookie } from "@/utils/auth";
import { constantRouterMap, asynRouterMap } from "@/router";
import Router from "vue-router";

export default {
  data() {
    return {
      shopMenuList: "",
      newList: [],
      formOnLogin: {
        account: "",
        password: ""
      },
      rules: {
        account: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    addHref(){
      let {channelType} = this.$route.query;
      if (channelType){
        return "/registered?channelType=" + channelType
      }else{
        return "/registered"
      }
    },
    login(data) {
      let {channelType}=this.$route.query;
      login
        .getLoginState(data)
        .then(res => {
          if (res.code == 0) {
            let token = res.data.token;
            let account =res.data.account
            this.$message({
              message: "登陆成功",
              type: "success",
              duration: 500
            });
            saveToken("shop_token", token, "h24");
            saveToken('admin',account,'h24')
            if (res.data.shop_id == 0) {
              let info = {
                account_id: res.data.account_id,
                shop_id: res.data.shop_id
              };
              localStorage.setItem("id", JSON.stringify(info));
              if (channelType){
                this.$router.push({ path: '/enterin?channelType='+channelType });
              }else{
                this.$router.push({ path: '/enterin' });
              }

            } else {
              this.$router.push({ path: "/home" });
              window.location.reload()
            }

          }
        })
        .catch(error => {
          this.$message.error(error.message);
        });
    },
    clickLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login(this.formOnLogin);
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    // console.log(this)
    particlesJS('bg', config)
  },
  created: function() {
    // console.log(this.$route);
  }
};
</script>

<style lang='scss' scoped>
  #bg{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: #2b88cb;
  }
.login-container {
  position: relative;
  // background: #2d3a4b;
  input {
    background: transparent;
    border: 0;
    appearance: none;
    border-radius: 0;
    padding: 12px 5px 12px 15px;
    color: #eeeeee;
    height: 47px;
  }
  .el-input {
    display: inline-block;
    width: 90%;
  }
  .login-form {
    position: fixed;
    left: 0;
    right: 0;
    width: 400px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
}
</style>
