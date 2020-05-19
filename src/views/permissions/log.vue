    <template>
        <div class="manage">
            <el-tabs>
                <table-view
                    :loading="loading"
                    :columns="columns"
                    :pageList="list"
                >
                </table-view>
                <pagination-view 
                    v-show="list.length"
                    :paginationName="name"
                    :total="total"
                    :currentPage="form.page"
                    @size-change="handleSizeChange"
                    @current-change="handleNumberChange"
                    ></pagination-view>   
            </el-tabs>
        </div>
    </template>
    <script>
        import TableView from '@/components/TableView'
        import admin from '@/api/permissions/admin'
        import PaginationView from '@/components/PaginationView'
        export default {
            data() {
                return {
                    loading:false,
                    list:[],
                    name:'log',
                    total:0,
                    form:{
                        page:1,
                        page_size: 20
                    },
                    columns: [
                        { label: '操作时间', field: 'created_at', align: 'center' },
                        { label: '用户名', field: 'seller_account', align: 'center' },
                        { label: '操作内容', field: 'content', align: 'center' },
                        { label: 'IP', field: 'ip', align: 'center' }
                        
                    ],       
                }
            },
                methods: {
                     getOperationLogList(data){
                      admin.getOperationLogList(data).then((res) =>{
                         this.list=[]
                         for(var i in res.data.data){
                             this.list.push(res.data.data[i])
                         }
                         this.total =res.data.count
                      })
                  },
                  handleSizeChange (val) {
                    this.form.page_size = val
                    this.getOperationLogList(this.form)
                    },
                    handleNumberChange (val) {
                    this.form.page = val
                    this.getOperationLogList(this.form)
                    },
                },
                components:{
                    TableView,PaginationView
                },
                created:function(){
                    this.getOperationLogList(this.form)
                }
            
        }   
    </script>

    <style lang='scss' scoped>
        .manage{
            padding: 10px;
        }
    </style>