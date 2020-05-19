<template>
  <div class="header-view">
    <img src="../../assets/logo.png" class="logo">
    <h2 class="title">商家后台</h2>
    <el-menu
      :default-active="activeRoute"
      router
      class="nav-menu"
      mode="horizontal"
      background-color="#2B88CB"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/home">首页</el-menu-item>
      <el-menu-item v-if="isShow[0]" index="/goods-manage" @click="changeItem">商品管理</el-menu-item>
      <el-menu-item v-if="isShow[1]" index="/goods-deal" @click="changeItem">交易管理</el-menu-item>
      <el-menu-item v-if="isShow[2]" index="/goods-activity" @click="changeItem">营销活动</el-menu-item>
      <el-menu-item v-if="isShow[3]" index="/shop-manage" @click="changeItem">店铺管理</el-menu-item>
      <el-menu-item v-if="isShow[4]" index="/shop-admin" @click="changeItem">权限管理</el-menu-item>
      <el-menu-item v-if="isShow[5]" index="/settlement-manage" @click="changeItem">数据结算</el-menu-item>
    </el-menu>
    <!-- 右边头像和退出 -->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <span style="color:#fff">用户名：{{name}}</span>
        <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'"> -->
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <!-- <router-link class="inlineBlock" to="/"> -->
          <el-dropdown-item>
            <span @click="clickChangePassword" style="display:block;">
              修改密码
            </span>
          </el-dropdown-item>
        <!-- </router-link> -->
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出登陆</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      title="修改密码"
      :visible.sync="changePassword"
      width="50%"
      center>
      <div>
         <el-form :model="formOnChange" ref="formOnChange" :rules="rules" label-position="left" label-width="110px"
         class="card-box login-form">
          <el-form-item label="旧密码：" prop="origin_password">
              <el-input v-model="formOnChange.origin_password" placeholder="密码，6-20字符，不能为纯数字/字母" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请设置新密码：" prop="new_password">
              <el-input v-model="formOnChange.new_password" placeholder="密码，6-20字符，不能为纯数字/字母" type="password"></el-input>
          </el-form-item>
          <el-form-item label="请确认新密码：" prop="confirm_password">
              <el-input v-model="formOnChange.confirm_password" placeholder="请再次输入新密码" type="password"></el-input>
          </el-form-item>
         </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPassword">密码修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from '@/api/interception'
import { mapGetters, mapMutations } from 'vuex'
import { clearCookie,getNameCookie } from '@/utils/auth'
const SER_AB =/^(?!\d+$|[a-zA-Z]+$)[^\u4e00-\u9fa5]*$/;

export default {
  data(){
    var validatepassword=(rule,value,callback) =>{
              if(!value){
                  return callback(new Error('密码必填'))
              }else{
                  if(value.length >20 || value.length<6){
                    return callback(new Error('请输入6至20个字符'))
                  }else if(!SER_AB.test(value)){
                    return callback(new Error('不能为纯数字或字母'))
                  }else{
                    callback()
                  }
              }
          }
    var validateNewpassword=(rule,value,callback) =>{
              if(!value){
                  return callback(new Error('密码必填'))
              }else{
                  if(value.length >20 || value.length<6){
                    return callback(new Error('请输入6至20个字符'))
                  }else if(!SER_AB.test(value)){
                    return callback(new Error('不能为纯数字或字母'))
                  }else{
                    callback()
                  }
              }
          }
    var validateConfirmPassword=(rule,value,callback) =>{
              if(!value){
                return callback(new Error('密码必填'))
              }else{
                  if(value != this.formOnChange.new_password){
                    return callback(new Error('密码不一致'))
                  }else{
                     callback()
                  }
              }
    }
    return{
      name:'',
      changePassword:false,
      isShow: [],
      formOnChange:{
        origin_password:'',
        new_password:'',
        confirm_password:''
      },
      rules:{
        origin_password:[{validator:validatepassword,trigger:'blur'}],
        new_password:[{validator:validateNewpassword,trigger:'blur'}],
        confirm_password:[{validator:validateConfirmPassword,trigger:'blur'}],
      }
    }
  },
  computed: {
    activeRoute () {
      return `/${this.$route.path.split('/')[1]}`
    },
    ...mapGetters([
      'menuItem',
      'headMenu'
    ])
  },
  methods: {
    ...mapMutations({
      changeMenu: 'SET_MENUITEM'
    }),
    clickChangePassword(){
      this.changePassword = true
      this.formOnChange.origin_password=''
      this.formOnChange.new_password=''
      this.formOnChange.confirm_password=''
    },
    logout(){
      clearCookie('shop_token')
      location.reload()
    },
    submitPassword(){
      this.$refs.formOnChange.validate((valid)=>{
        if(valid){
          this.updateShopAccountPassword(this.formOnChange)

        }
      })
    },
    updateShopAccountPassword(params){
      axios({
        method: 'post',
        url: '/trmall/shop/updateShopAccountPassword',
        data: params
      }).then((res) =>{
          this.changePassword = false
           this.$message({
                 message: '密码修改成功',
                 type: 'success'
            })

            setTimeout(function(){
              clearCookie('shop_token')
              location.reload()
          },1000)
      })
    },
    changeItem(){
      setTimeout(() => {
        this.changeMenu(this.activeRoute)
      },100);
      this.name = getNameCookie()
    },

  },
  created(){
    this.changeItem()
    let menuList = JSON.parse(JSON.stringify(this.headMenu))
    this.isShow.push(menuList.item?1:0)
    this.isShow.push(menuList.trade?1:0)
    this.isShow.push(menuList.promotion?1:0)
    this.isShow.push(menuList.shop?1:0)
    this.isShow.push(menuList.account?1:0)
    this.isShow.push(menuList.settlement?1:0)
  }
}
</script>

<style lang='scss' scoped>
.header-view {
  position: relative;
  background: #2b88cb;
  color: #fff;
  padding-left: 40px;
  padding-right: 40px;
  height: 60px;
  line-height: 60px;
  overflow: hidden;
  .logo {
    float: left;
    width: 220px;
    height: 52px;
    margin-top: 4px;
  }
  .title {
    float: left;
    margin: 0 70px 0 30px;
  }
  .nav-menu {
    float: left;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
