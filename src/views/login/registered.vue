    <template>
        <div id ="box">
            <div id="bg"></div>
            <div class="login-container">
                <el-form :model="formOnRegistered" ref="formOnRegistered" :rules="rules" label-position="left" label-width="110px" class="card-box login-form">
                    <h2 class="tc" style="margin-left:73px">申请注册泰然城商家账号</h2>
                    <el-form-item label="账号名：" prop="account">
                        <el-input v-model="formOnRegistered.account" placeholder="必填，最少4个字符，不能为纯数字或者中文"></el-input>
                    </el-form-item>

                     <el-form-item label="设置密码：" prop="password">
                        <el-input v-model="formOnRegistered.password" placeholder="密码，6-20字符，不能为纯数字/字母" type="password"></el-input>
                    </el-form-item>

                     <el-form-item label="确认密码：" prop="confirm_password">
                        <el-input v-model="formOnRegistered.confirm_password" placeholder="请再次输入密码" type="password"></el-input>
                    </el-form-item>

                     <el-form-item label="联系人姓名：" prop="name">
                        <el-input v-model="formOnRegistered.name" placeholder="请输入联系人姓名，最多15个字"></el-input>
                    </el-form-item>

                     <el-form-item label="联系人手机号：" prop="mobile">
                        <el-input v-model="formOnRegistered.mobile" placeholder="请输入联系人手机号"></el-input>
                    </el-form-item>

                     <el-form-item label="联系人邮箱：" prop="email">
                        <el-input v-model="formOnRegistered.email" placeholder="请输入联系人邮箱，最多50个字符"></el-input>
                    </el-form-item>

                    <div class="tc" style="margin-top:20px;margin-bottom:20px;margin-left: 75px;width:455px;">
                        <el-checkbox v-model="checkState">
                            我已阅读并同意
                        </el-checkbox>
                        <a @click='clickLicense' style="color:#409EFF;">《泰然城用户注册协议》</a>
                        <a @click='clickProtocol' style="color:#409EFF;">《泰然城入驻协议》</a>
                    </div>

                    <el-form-item class="tc" style="margin-right:20px;margin-left: -60px">
                        <el-button type="primary" @click="submitForm">申请注册</el-button>
                        <a href="/login" style="display:block;color:#409EFF;">已有账户？去登录></a>
                    </el-form-item>
                </el-form>
                <el-dialog
                    title="商城用户注册协议"
                    :visible.sync="centerDialogVisible"
                    width="50%"
                    center>
                    <div v-html="license"></div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">关 闭</el-button>

                    </span>
                </el-dialog>
                    <el-dialog
                    title="商城入驻协议"
                    :visible.sync="protocol"
                    width="50%"
                    center>
                    <div v-html="protocolText"></div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="protocol = false">关 闭</el-button>

                    </span>
                    </el-dialog>
            </div>
        </div>
    </template>

    <script>
    require('particles.js')
    import config from './particles'
    import login from '@/api/login/login'

    const SER_NUBER =/^(?!\d+$)[0-9a-zA-Z]*$/;
    const SER_AB =/^(?!\d+$|[a-zA-Z]+$)[^\u4e00-\u9fa5]*$/;
    const SER_HZ =/^[\u4e00-\u9fa5]+$/;
    const SER_PHONE =/^1\d{10}$/;
    const SER_EMAIL =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

    export default {
      data(){
          var validateAccount=(rule,value,callback) =>{
              if(!value){
                  return callback(new Error('用户名必填'))
              }else{
                  if(value.length >20 || value.length<4){
                    return callback(new Error('最少4个字符或者最多20个字符'))
                  }else if(!SER_AB.test(value)){
                    return callback(new Error('不能为纯数字或中文或特殊字符'))
                  }else{
                    // this.$refs.formOnRegistered.validateField('account')
                    callback()
                  }
              }
          }
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
          var validateConfirmPassword=(rule,value,callback) =>{
              if(!value){
                  return callback(new Error('密码必填'))
              }else{
                  if(value !==this.formOnRegistered.password){
                    return callback(new Error('两次输入密码不一致'))
                  }else{
                    callback()
                  }
              }
              }

              var validateName=(rule,value,callback) =>{
                if(!value){
                    return callback(new Error('姓名必填'))
                }else{
                    if(value.length>15){
                        return callback(new Error('不能超过15个汉字'))
                    } else if(!SER_HZ.test(value)){
                        return callback(new Error('必须为汉字'))
                    }else{
                        callback()
                    }
                }
              }


              var validateMobile=(rule,value,callback) =>{
                if(!value){
                    return callback(new Error('手机号必填'))
                }else{
                    if(value.length>11 || !SER_PHONE.test(value)){
                        return callback(new Error('请输入11位有效数字'))
                    }else{
                        callback()
                    }
                }
              }

              var validateEmail=(rule,value,callback) =>{
                if(!value){
                    return callback(new Error('邮箱必填'))
                }else{
                    if(value.length>50 || !SER_EMAIL.test(value)){
                        return callback(new Error('请输入有效的email'))
                    }else{
                        callback()
                    }
                }
              }
          return{
            channelType:this.$route.query.channelType,
              checkState:'',
              centerDialogVisible:false,
              license:'',
              protocol:false,
              protocolText:'',
              formOnRegistered:{
                  account:'',
                  password:'',
                  confirm_password:'',
                  name:'',
                  mobile:'',
                  email:''

              },
              rules:{
                account:[
                    {validator:validateAccount,trigger:'blur'}
                ],
                password:[{
                    validator:validatepassword,trigger:'blur'
                }],
                confirm_password:[{
                    validator:validateConfirmPassword,trigger:'blur'
                }],
                name:[{
                    validator:validateName,trigger:'blur'
                }],
                mobile:[{
                    validator:validateMobile,trigger:'blur'
                }],
                email:[{
                    validator:validateEmail,trigger:'blur'
                }]

              }
          }
      },
      methods:{
          postRegistered(data){
            let {channelType}=this;
            login.getRAegistered(data,channelType).then((res) => {
                if(res.code == 0){
                    this.$message({message:'注册成功',type:'success'})
                    let info = {
                        account_id: res.data.account_id,
                    }
                    localStorage.setItem('id', JSON.stringify(info));
                    if(channelType){
                      this.$router.push({path:'/enterin?channelType='+channelType})
                    }else {
                      this.$router.push({path:'/enterin'})
                    }
                }
            })
            .catch((error) => {
                this.$message.error(error.message)
            })
          },

          getShopRegisterLicense(){
              login.getShopRegisterLicense().then((res) => {
                  this.license=res.data
              })
          },
          submitForm(){
            this.$refs.formOnRegistered.validate((valid)=>{
                  if(valid){
                      if(this.checkState){
                            this.postRegistered(this.formOnRegistered)
                      }else{
                            this.$message({message:'请阅读《泰然城用户注册协议》《泰然城入驻协议》',type:'warning'})
                      }

                  }else{
                      return false
                  }
              })
          },
          getEnterApplicationProtocol(){
              login.getEnterApplicationProtocol().then((res) =>{
                  this.protocolText = res.data
              })
          },
          clickLicense(){
              this.centerDialogVisible=true
              this.getShopRegisterLicense()
          },
          clickProtocol(){
              this.protocol =true
              this.getEnterApplicationProtocol()

          }
      },
      mounted() {
            particlesJS('bg', config)
        },
    }
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
        .login-container{
            position: relative;
            /*height: 100vh;*/
           // background: #2d3a4b;
            input{
                background: transparent;
                border:0;
                appearance: none;
                border-radius: 0;
                padding: 12px 5px 12px 15px;
                color:#eeeeee;
                height: 47px;
            }
            .el-input{
                display: inline-block;
                width: 90%;
            }
            .login-form{
                position: fixed;
                left: 0;
                right: 0;
                width: 530px;
                padding: 35px 35px 15px 35px;
                margin: 80px auto;
            }

        }
        .tc{
            text-align: center;
        }
    </style>
