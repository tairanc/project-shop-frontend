    <template>
        <div class="manage">
            <el-row>
                <el-col :span='6'>
                    <el-button type="primary" @click="addRole">添加角色</el-button>
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
                    <el-tree
                    :data="info_list"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="checked_info_list"
                    :default-checked-keys="checked_info_list"
                    :props='defaultProps'
                    >
                    </el-tree>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="getCheckedKeys">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </template>
    <script>
        import TableView from '@/components/TableView'
        import role from '@/api/permissions/role'
        export default {
            data() {
                return {
                    loading:false,
                    centerDialogVisible:false,
                    list:[],
                    info_list:[],
                    form:{
                        name:'',
                        id:'',
                        privilege_list:[]
                    },
                    columns: [
                        { label: '角色名称', field: 'name', align: 'center' },
                        { label: '操作', align: 'center',
                        actions: [
                                    {
                                    label: '编辑',
                                    type: 'primary',
                                    size: 'mini',
                                    click: (index, row) => {
                                        this.openRole({role_id:row.role_id})
                                        this.form.id =row.id;
                                    }
                                    },
                                    {
                                    label: '删除',
                                    type: 'danger',
                                    size: 'mini',
                                    click: (index, row) => {
                                        role.delRole({
                                        id: row.id
                                        }).then((res) => {
                                        if (res.code === 0) {
                                            this.$message({
                                            type: 'success',
                                            message: '删除成功！'
                                            })
                                            this.getRoleList();
                                        }
                                        })
                                    }
                                    }
                                ] 
                        }
                    ],  
                    checked_info_list:[], 
                     defaultProps: {
                        children: 'children',
                        label: 'label'
                    },
                }
            },
                methods: {
                    getRoleList(){
                        role.getRoleList().then((res) => {
                            if(this.list!=''){
                                this.list=[];
                                for(var i in res.data){
                                    this.list.push(res.data[i])
                                }
                            }else{
                                for(var i in res.data){
                                    this.list.push(res.data[i])
                                }
                            }
                        })
                    },
                    //拉取角色信息
                    getRoleInfo(data){
                      role.getRoleInfo(data).then((res)=>{
                          let privilege_list =res.data.privilege_list
                          this.form.name =res.data.name
                          let _privilege_list = []
                          if (privilege_list.length > 0) {
                              for(var i in privilege_list){
                                _privilege_list.push(privilege_list[i])
                            }
                          }
                          this.info_list = _privilege_list
                          
                          let _list = []
                          this.checked_info_list=[]
                            for(var i in this.info_list){
                              for(var j in this.info_list[i].children){
                                  for(var t in this.info_list[i].children[j]){
                                     if(typeof this.info_list[i].children[j][t] =='object'){
                                         for(var b in this.info_list[i].children[j][t]){
                                             if(this.info_list[i].children[j][t][b].is_selected){
                                                 _list.push(this.info_list[i].children[j][t][b].id.toString())
                                             }
                                         }
                                     }
                                  }
                              }
                          }
                        this.checked_info_list=_list
                      })
                    },
                    addRole(){
                         this.$router.push({name: "addRole"})
                    },
                    updateRole(data){
                        role.updateRole(data).then((res)=>{
                            this.centerDialogVisible = false;
                            this.$message({message: '编辑成功', type: 'success'});
                            
                        })
                        .catch(function(error){
                            this.centerDialogVisible = false;
                            this.$message({message: '编辑失败', type: 'error'});
                        })
                    },
                    // 编辑窗
                    openRole(data){
                        this.centerDialogVisible=true;
                        this.getRoleInfo(data)
                    },
                    getCheckedKeys(){
                        let list =this.$refs.tree.getCheckedKeys();
                        if(this.form.privilege_list!=''){
                            this.form.privilege_list=[]
                            for(var i in list){
                            if(list[i] !=null){
                                this.form.privilege_list.push(list[i])
                            }
                        }
                        }else{
                           for(var i in list){
                            if(list[i] !=null){
                                this.form.privilege_list.push(list[i])
                            }
                        } 
                        }
                        this.updateRole(this.form)
                    }
                },
                components:{
                    TableView
                },
                created(){
                    this.getRoleList()
                }
            
        }   
    </script>

    <style lang='scss' scoped>
        .manage{
            padding: 10px;
        }
    </style>