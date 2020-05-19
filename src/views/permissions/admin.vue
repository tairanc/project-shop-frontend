    <template>
        <div class="manage">
            <el-row>
                <el-col :span='6'>
                    <el-button type="primary" @click="addAdmin">添加账号</el-button>
                </el-col>
            </el-row>
            <el-tabs>
                <table-view
                    :loading="loading"
                    :columns="columns"
                    :pageList="list"
                >
                </table-view>   
            </el-tabs>
             <el-dialog
                title="编辑"
                :visible.sync="centerDialogVisible"
                width="50%"
                center>
                <div>
                    <el-form>
                        <el-row>
                        <el-col :span="20" :offset="1">
                        <el-form-item label="重置密码:">
                            <el-input type="password"  v-model="ps_from.password"></el-input>
                        </el-form-item>
                        </el-col>
                        </el-row>
                         <el-row>
                        <el-col :span="20" :offset="1">
                        <el-form-item label="确认密码:">
                            <el-input type="password"  v-model="ps_from.confirm_password"></el-input>
                        </el-form-item>
                        </el-col>
                        </el-row>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="openAdmin">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog
                title="编辑账号"
                :visible.sync="openUpAdmin"
                width="60%"
                center>
                <el-form :model="formOnAdminInfo.form" ref="formOnAdminInfo" :rules="rules" label-position="left"> 
                    <el-form-item prop="account" label="用户名:">
                        <el-input v-model="formOnAdminInfo.account" :disabled="disabled"></el-input>
                    </el-form-item>   

                    <el-form-item  label="联系姓名:" prop="name">
                        <el-input v-model="formOnAdminInfo.form.name"></el-input>
                    </el-form-item>  

                    <el-form-item  label="联系手机:" prop="mobile">
                        <el-input v-model="formOnAdminInfo.form.mobile"></el-input>
                    </el-form-item>  

                    <el-form-item  label="联系邮箱:" prop="email">
                        <el-input v-model="formOnAdminInfo.form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="选择角色:" prop="role_id">
                        <el-radio-group v-model="formOnAdminInfo.form.role_id">
                            <el-radio v-for="list in role_list"
                            :label="list.role_id"
                            :key="list.role_id"
                            >{{list.name}}</el-radio>
                        </el-radio-group>
                        <div class="tc" style="margin-top:20px">
                            <el-button @click="openUpAdmin = false">取 消</el-button>
                            <el-button type="primary" @click="clickUpInfo">确 定</el-button>
                        </div>
                    </el-form-item>       
                </el-form>
                <span slot="footer" class="dialog-footer">
                       
                    </span>
            </el-dialog>    
        </div>
    </template>
    <script>
        import TableView from '@/components/TableView'
        import admin from '@/api/permissions/admin'

        const SER_PHONE =/^[1][3,4,5,7,8][0-9]{9}$/;
        const SER_EMAIL =/^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/;
        const SER_AB =/^(?!\d+$|[a-zA-Z]+$)[^\u4e00-\u9fa5]*$/;

        export default {
            data() {
                
                 var validateName=(rule,value,callback) =>{
                    if(!value){
                        return callback(new Error('姓名必填'))
                        }else{
                                callback()
                            }
                    }
                    var validateId=(rule,value,callback) =>{
                    if(!value){
                        return callback(new Error('角色必填'))
                        }else{
                                callback()
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
                return {
                    loading:false,
                    disabled:true,
                    openUpAdmin:false,
                    formOnAdminInfo:{
                        form:{
                            name:'',
                            mobile:'',
                            email:'',
                            role_id:'',
                            id:'',
                        },
                        account:''
                    },
                    role_list:[],
                    rules:{
                        name:[
                            {validator:validateName, trigger:'blur'}
                        ],
                        mobile:[
                            {validator:validateMobile, trigger:'blur'}
                        ],
                        email:[{
                            validator:validateEmail, trigger:'blur'
                        }],
                        role_id:[{
                            validator:validateId, trigger:'blur'
                        }]
                    },
                    list:[],
                    ps_from:{
                        id:'',
                        password:'',
                        confirm_password:''
                    },
                    centerDialogVisible:false,
                    columns: [
                        { label: '登录账号', field: 'account', align: 'center' },
                        { label: '角色', field: 'role_name', align: 'center' },
                        { label: '手机号码', field: 'mobile', align: 'center' },
                        { label: '邮箱', field: 'email', align: 'center' },
                        { label: '操作', align: 'center',
                        actions: [
                                    {
                                    label: '编辑',
                                    type: 'primary',
                                    size: 'mini',
                                    click: (index, row) => {
                                        this.openUpAdmin=true
                                        this.getInfo({'id':row.id})
                                        this.formOnAdminInfo.form.id =row.id
                                        
                                    }
                                    },
                                    {
                                    label: '修改密码',
                                    type: 'primary',
                                    size: 'mini',
                                    click: (index, row) => {
                                        this.centerDialogVisible=true
                                        this.ps_from.id=''
                                        this.ps_from.password='',
                                        this.ps_from.confirm_password='',
                                        this.ps_from.id =row.id;
                                    }
                                    },
                                    {
                                    label: '删除',
                                    type: 'danger',
                                    size: 'mini',
                                    click: (index, row) => {
                                        admin.delAdmin({
                                        id: row.id
                                        }).then((res) => {
                                        if (res.code === 0) {
                                            this.$message({
                                            type: 'success',
                                            message: '删除成功！'
                                            })
                                            this.getAdminList();
                                        }
                                        })
                                    }
                                    }
                                ] 
                        }
                    ],       
                }
            },
                methods: {
                    addAdmin(){
                         this.$router.push({name: "addAdmin"})
                    },
                    getAdminList(){
                        admin.getAdminList().then((res) => {
                            this.list =[]
                            for(var i in res.data.data){
                                this.list.push(res.data.data[i])
                            }
                        })
                    },
                    restPassWord(data){
                        admin.restPassWord(data).then((res) =>{
                            this.$message({
                                type: 'success',
                                message: '重置成功'  
                            })
                            this.centerDialogVisible=false
                        })
                    },
                    getInfo(data){
                        admin.getAdminInfo(data).then((res) =>{
                            this.role_list=[]
                            this.formOnAdminInfo.form.name =res.data.name
                            this.formOnAdminInfo.form.mobile =res.data.mobile
                            this.formOnAdminInfo.form.email =res.data.email
                            this.formOnAdminInfo.form.role_id =res.data.role_id
                            this.formOnAdminInfo.account =res.data.account
                            for(var i in res.data.role_list){
                                this.role_list.push(res.data.role_list[i])
                            }
                        })
                    },
                    upDataInfo(data){
                        admin.upDataInfo(data).then((res) =>{
                            this.$message({
                                type: 'success',
                                message: '编辑成功'  
                            })
                            this.openUpAdmin=false
                            this.getAdminList();
                        })
                    },
                    clickUpInfo(){
                        this.$refs.formOnAdminInfo.validate((valid)=>{
                            if(valid){
                                this.upDataInfo(this.formOnAdminInfo.form)
                                this.getAdminList();
                            }else{
                               this.$message({type: 'error',message: '编辑失败'}) 
                            }
                        })
                        
                    },
                    openAdmin(){
                         if(this.ps_from.confirm_password != this.ps_from.password){
                                this.$message({
                                    type: 'error',
                                    message: '密码不一致'
                                })
                                 return false
                            }else if(this.ps_from.confirm_password==''|| this.ps_from.password==''){
                                this.$message({
                                    type: 'error',
                                    message: '密码不能为空'
                                })
                                return false
                            }else if(this.ps_from.confirm_password.length < 6 || this.ps_from.password.length < 6 ){
                                this.$message({
                                    type: 'error',
                                    message: '密码长度不能小于6个字符'
                                })
                                 return false
                            }if(!SER_AB.test(this.ps_from.confirm_password) || !SER_AB.test(this.ps_from.password)){
                                this.$message({
                                    type: 'error',
                                    message: '密码不能为纯数字'
                                })
                                 return false
                            }else{
                                this.restPassWord(this.ps_from)
                            }
                    }

                },
                components:{
                    TableView
                },
                created:function(){
                    this.getAdminList()
                   
                }
            
            
        }   
    </script>

    <style lang='scss' scoped>
        .manage{
            padding: 10px;
        }
        .tc{
            text-align: center
        }
    </style>