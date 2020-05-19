    <template>
        <section>
            <div class="manage">
                <el-tabs type="border-card">
                    <el-form :model="formOnRole" ref="formOnRole" label-width="100px" size="medium">
                        <h2>添加角色</h2>
                        <el-row>
                            <el-col :span="6" :offset="1">
                            <el-form-item prop="name" label="角色名称：">
                                <el-input v-model="formOnRole.form.name" placeholder="必填"></el-input>
                            </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                                <el-tree
                                :data="info_list"
                                show-checkbox
                                default-expand-all
                                node-key="id"
                                ref="tree"
                                highlight-current
                                >
                                </el-tree>
                        </el-row>
                        <el-row style="text-align: center">
                            <el-button type="primary" @click="clickS('formOnRole')">提交</el-button>
                            <a href="/shop-admin/permissions/role"><el-button>取消</el-button></a>
                        </el-row>
                    </el-form>    
                </el-tabs>
            </div>
        </section>
    </template>
    <script>
    import VHeader from '@/components/Header'
    import role from '@/api/permissions/role'
        export default {
            data() {
                return {
                    info_list:[],
                    formOnRole:{
                        form:{
                            name:'',
                            privilege_list:[]
                        },
                        
                    }
                    
                }
            },
                methods: {
                    getPrivilegeList(){
                        role.getPrivilegeList().then((res) => {
                            if(this.info_list!=''){
                                this.info_list=[];
                                for(var i in res.data){
                                    this.info_list.push(res.data[i])
                                }
                            }else{
                                for(var i in res.data){
                                    this.info_list.push(res.data[i])
                                }
                            } 
                        })
                    },
                    createRole(data){
                        role.createRole(data).then((res)=>{
                            this.$router.push({path:'/shop-admin/permissions/role'})    
                        })
                    },
                    clickS(form){
                        let list =this.$refs.tree.getCheckedKeys();
                        for(var i in list){
                            if(list[i] !=null){
                                this.formOnRole.form.privilege_list.push(list[i])
                            }
                        }
                        this.$refs[form].validate((valid) => {
                          
                            if(this.formOnRole.form.name ==''){
                               this.$message({message:'姓名不能为空',type:'error',duration:1000})
                            }else if(this.formOnRole.form.privilege_list==''){
                               this.$message({message:'权限不能为空',type:'error',duration:1000})  
                            }else{
                                this.createRole(this.formOnRole.form)
                            }
                        })
                        
                    }
                    
                    // defaultProps: {
                    //     // children: 'children',
                    //     // label: 'label'
                    //     } 
                },
                
                components:{
                   VHeader
                },
                created(){
                    this.getPrivilegeList()
                }
            
        }   
    </script>

    <style lang='scss' scoped>
        .manage{
            padding: 10px;
        }
    </style>
