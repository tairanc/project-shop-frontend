    <template>
        <section>
            <div class="manage">
                 <el-tabs type="border-card">
                    <h2>添加用户</h2>
                    <el-form :model="formOnAdmin" ref="formOnAdmin" :rules="rules" label-width="100px" size="medium">
                        <el-row>
                            <el-col :span="6" :offset="1">
                            <el-form-item prop="account" label="用户名：">
                                <el-input v-model="formOnAdmin.account" placeholder="最少4个字符 不能是纯数字"></el-input>
                            </el-form-item>
                            </el-col>

                             <el-col :span="6" :offset="1">
                            <el-form-item prop="password" label="设置密码：">
                                <el-input type='password' v-model="formOnAdmin.password" placeholder="6-20个字符 不能纯数字.字母"></el-input>
                            </el-form-item>
                            </el-col>

                            <el-col :span="6" :offset="1">
                            <el-form-item prop="confirm_password" label="确认密码：">
                                <el-input type='password' v-model="formOnAdmin.confirm_password" placeholder="登陆密码确认"></el-input>
                            </el-form-item>
                            </el-col>
                        </el-row> 
                        <el-row>
                            <el-col :span="6" :offset="1">
                            <el-form-item prop="name" label="联系姓名：">
                                <el-input type='text' v-model="formOnAdmin.name" placeholder="店员姓名，最多10个字符" maxlength="10"></el-input>
                            </el-form-item>
                            </el-col>

                            <el-col :span="6" :offset="1">
                            <el-form-item prop="mobile" label="联系手机：">
                                <el-input type='text' v-model="formOnAdmin.mobile" placeholder="请输入联系人手机"></el-input>
                            </el-form-item>
                            </el-col>

                            <el-col :span="6" :offset="1">
                            <el-form-item prop="email" label="联系邮箱：">
                                <el-input type='text' v-model="formOnAdmin.email" placeholder="最多50个字符"></el-input>
                            </el-form-item>
                            </el-col>
                        </el-row> 
                        <el-row style="margin-top:20px">
                            <el-col :span="18" :offset="1">
                            <el-form-item label="选择角色：" prop="role_id">
                                <el-radio-group v-model="formOnAdmin.role_id">
                                    <el-radio v-for="list in role_list"
                                    :label="list.role_id"
                                    :key="list.role_id"
                                    >{{list.name}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="tc">
                            <el-col :span="24" :offset="1">
                                <el-button type="primary" @click="clickCreateAdmin">保存</el-button>
                                <a href="/shop-admin/permissions/admin"><el-button>取消</el-button></a>
                            </el-col>
                        </el-row>           
                    </el-form>    
                </el-tabs>
            </div>
        </section>
       
    </template>
    <script>
    import VHeader from '@/components/Header'
    import admin from '@/api/permissions/admin'
    const SER_PHONE =/^[1][3,4,5,7,8][0-9]{9}$/;
    const SER_EMAIL =/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
    const SER_ACCOUNT =/^(?!\d+$)[^\u4e00-\u9fa5]*$/
    const SER_PASSWORD =/^(?!\d+$|[a-zA-Z]+$)[^\u4e00-\u9fa5]*$/
        export default {
            data() {
                var validateAccount=(rule,value,callback) =>{
                    if(!value){
                        return callback(new Error('用户名必填'))
                        }else{
                            if(value.length<4 || !SER_ACCOUNT.test(value)){
                                return callback(new Error('最少4个字符 不能纯数字或中文'))
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
                                return callback(new Error('请输入11位有效号码'))
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
                    var validatePassWord=(rule,value,callback) =>{
                        if(!value){
                            return callback(new Error('密码必填'))
                        }else{
                            if(!value.length>6 && value.length<20 || !SER_PASSWORD.test(value)){
                                return callback(new Error('6-20个字符 不能纯数字.字母'))
                            }else{
                                callback()
                            }
                        }
                    } 
                    var validateConfirmPassWord=(rule,value,callback) =>{
                        if(!value){
                            return callback(new Error('密码必填'))
                        }else{
                            if(this.formOnAdmin.password !=this.formOnAdmin.confirm_password){
                                return callback(new Error('密码不一致'))
                            }else{
                                callback()
                            }
                        }
                    } 
                    var validateName=(rule,value,callback) =>{
                    if(!value){
                        return callback(new Error('姓名必填'))
                        }else{
                                callback()
                            }
                    }
                return {
                    formOnAdmin:{
                        name:'',
                        password:'',
                        confirm_password:'',
                        account:'',
                        mobile:'',
                        email:'',
                        role_id:''
                    },
                    role_list:[],
                    rules:{
                        name:[
                            {validator:validateName, trigger:'blur'}
                        ],  
                        account:[
                            {validator:validateAccount , trigger:'blur'}
                        ], 
                        password:[
                            {validator:validatePassWord,trigger:'blur'}
                        ],
                        confirm_password:[
                            {validator:validateConfirmPassWord,trigger:'blur'}
                        ],
                        mobile:[
                            {validator:validateMobile , trigger:'blur'}
                        ],
                        email:[
                            {validator:validateEmail,trigger:'blur'}
                        ],
                        }
                }
            },
                methods: {
                    getRoleList(){
                        admin.getRoleList().then((res) =>{
                            this.role_list=[];
                            for(var i in res.data){
                                this.role_list.push(res.data[i])
                            }
                        })
                    },
                  createAdmin(data){
                      admin.createAdmin(data).then((res) =>{
                          this.$router.push({path:'/shop-admin/permissions/admin'})
                      })
                  },
                clickCreateAdmin(){
                    this.$refs.formOnAdmin.validate((valid)=>{
                        if(valid){
                            if(this.formOnAdmin.role_id!=''){
                                this.createAdmin(this.formOnAdmin)
                            }else{
                                this.$message({type: 'error',message: '角色必填'}) 
                            }
                        }
                    })
                }
            },
                components:{
                   VHeader
                },
                created:function(){
                    this.getRoleList()
                }
                
            
         
    } 
    </script>

    <style lang='scss' scoped>
        .manage{
            padding: 10px;
        }
        .tc{
            text-align: center;
        }
    </style>