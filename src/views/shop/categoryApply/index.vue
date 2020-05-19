<template>
  <div class="categoryApply">
    <div v-if="is_supported">
      <el-button type="primary" @click="dialogFormVisible=true">申请类目</el-button>
      <table-view
        class="list"
        :columns="columns"
        :pageList="list"
        >
      </table-view>
      <pagination-view 
        v-show="list.length"
        :total="total"
        :currentPage="pageInfo.page"
        @size-change="sizeChange"
        @current-change="pageChange"
      ></pagination-view>
    </div>

    <div v-else>{{messages}}</div>

    <el-dialog title="申请类目权限" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="submitForm">
        <el-form-item label="申请类目：" prop="cat_ids">
          <el-cascader
            :disabled="(!is_reapply)?false:true"
            expand-trigger="hover"
            :options="options"
            :props="config"
            v-model="form.cat_ids"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="申请原因：" prop="apply_reason">
          <el-input  class="textArea" type="textarea" v-model="form.apply_reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" v-if="!is_reapply" @click="applyCategoryApply">确 定</el-button>
        <el-button type="primary" v-else @click="reapplyCategoryApply">确 定</el-button>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import shops from '@/api/shops'

export default {
  data() {
    return {
      is_supported: '',
      messages: '',
      is_reapply: false,
      dialogFormVisible: false,
      list: [],
      total: 0,
      pageInfo: {
        page: 1,
        page_size: 20
      },
      columns: [
        {
          label: '类目名称',
          field: 'name',
          align: 'center'
        },
        {
          label: '提交时间',
          field: 'created_at',
          align: 'center'
        },
        {
          label: '申请原因',
          field: 'apply_reason',
          align: 'center'
        },
        {
          label: '状态',
          field: 'status',
          align: 'center',
          tags: [
            {
              index: 1,
              name: "待审核",
              type: "error"
            }, 
            {
              index: 2,
              name: "审核通过",
              type: "success"
            },
            {
              index: 3,
              name: "审核失败",
              type: "danger"
            }
          ]
        },
        {
          label: '失败原因',
          field: 'reject_reason',
          align: 'center'
        },
        {
          label: '操作',
          align: 'center',
          width: 180,
          actions: [ 
            {
              label: '重新申请',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return row.status != 3
              },
              click: (index, row) => {
                this.showReapplyCategoryApply(row)
              }
            },
            {
              label: '删除',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return row.status == -1
              },
              click: (index, row) => {
                this.$confirm('是否确定要删除？', '删除提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.deleteCategoryApply({apply_id: row.id});
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });
              }
            }
          ]
        }
      ],
      options: [],
      config: {
        value: "id",
        label: "name",
        children: "children",
        disabled: "disabled"
      },
      form:{
        cat_ids: [],
        cat_id: '',
        apply_reason: ''
      },
      rules: {
        cat_ids: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        apply_reason: [
          { required: true, message: '请填写申请原因', trigger: 'blur' },
          { max: 100, message: '最长为100个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //获取列表
    getCategoryApply(params){
      shops.getCategoryApply(params).then((res)=>{
        this.is_supported = res.data.is_supported
        this.messages = res.data.message
        this.list = res.data.data
        this.total = res.data.total_count
      })
    },
    //可申请类目
    getAvailableCats(){
      shops.getAvailableCats().then((res)=>{
        this.options = res.data
      })
    },
    //申请
    applyCategoryApply(){
      this.$refs.submitForm.validate((valid) => {
        if(valid){
          this.form.cat_id = this.form.cat_ids[this.form.cat_ids.length-1]

          shops.applyCategoryApply(this.form).then((res)=>{
            if(res.code == 0){
              this.$message({
                showClose: true,
                message: '申请发送成功',
                type: 'success'
              })
              this.getCategoryApply(this.pageInfo)
              this.form = {
                cat_ids: [],
                cat_id: '',
                apply_reason: ''
              },

              this.dialogFormVisible = false
              this.getAvailableCats()
            }
          })
          
        }
      })
    },
    //重新申请显示弹窗
    showReapplyCategoryApply(row){
      this.is_reapply = true
      this.form = {
        apply_id: row.id,
        cat_ids: row.cat_id,
        cat_id: row.cat_id[1],
        apply_reason: row.apply_reason
      },

      this.dialogFormVisible = true
    },
    //重新申请
    reapplyCategoryApply(){
      this.$refs.submitForm.validate((valid) => {
        if(valid){
          shops.reapplyCategoryApply(this.form).then((res)=>{
            if(res.code == 0){
              this.$message({
                showClose: true,
                message: '申请发送成功',
                type: 'success'
              })
              this.getCategoryApply(this.pageInfo)
              this.form = {
                cat_ids: [],
                cat_id: '',
                apply_reason: ''
              },

              this.is_reapply = false
              this.dialogFormVisible = false
              this.getAvailableCats()
            }
          })
        }
      })
    },
    //取消弹窗
    cancelDialog(){
      this.is_reapply = false
      this.dialogFormVisible = false
      this.form = {
        cat_ids: [],
        cat_id: '',
        apply_reason: ''
      }
    },
    //删除
    deleteCategoryApply(params){
      shops.deleteCategoryApply(params).then((res)=>{
        this.getCategoryApply(this.pageInfo);
        this.getAvailableCats()
      })
    },
    // pageSize变化函数
    sizeChange(val){
      this.pageInfo.page_size = val;
      this.getCategoryApply(this.pageInfo);
    },
    // page变化函数
    pageChange(val){
      this.pageInfo.page = val;
      this.getCategoryApply(this.pageInfo);
    }
  },
  components: {
    TableView,
    PaginationView
  },
  created() {
    this.getCategoryApply(this.pageInfo)
    this.getAvailableCats()
  },
}

</script>

<style lang='scss' scoped>
.categoryApply{
  margin: 20px;
  .list{
    margin-top: 20px; 
  }
}
.textArea{
  width: 80%
}
</style>
