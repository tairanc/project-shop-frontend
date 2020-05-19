<template>
  <div class="chip">
    <el-form :model="formOnSale.form" ref="formOnSale" :rules="formOnSale.rules" label-width="100px" size="medium">
      <el-row>
          <el-col :span="6">
            <el-form-item label="芯片编码：" prop="chip_code">
              <el-input v-model="formOnSale.form.chip_code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="商品名称：" prop="title">
              <el-input v-model="formOnSale.form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="状态：" prop="status">
              <el-select v-model="formOnSale.form.status">
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已核销" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="开始时间：" prop="started_at">
            <el-date-picker
              v-model="formOnSale.form.started_at"
              type="datetime"
              placeholder="请选择起始时间"
              size="large"
              :default-value="time"
              format="yyyy-MM-dd HH:mm:ss" 
              value-format="yyyy-MM-dd HH:mm:ss"
            >
             </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束时间：" prop="end_at">
            <el-date-picker
              v-model="formOnSale.form.end_at"
              type="datetime"
              placeholder="请选择结束时间"
              size="large"
              :default-value="time"
              format="yyyy-MM-dd HH:mm:ss" 
              value-format="yyyy-MM-dd HH:mm:ss"
            >
             </el-date-picker>
          </el-form-item>
        </el-col>
       
      </el-row>
      <el-row>
         
      </el-row>
      <el-row>
        <el-col :span="6" :offset="9">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="resetForm">清空条件</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btn-group">
      <el-button size="medium" @click="addChip">写入</el-button>
    </el-row>
    <div class="table">
      <table-view
        :tableName="formOnSale.name"
        :columns="formOnSale.columns"
        :pageList="formOnSale.list"
      >
      </table-view>
    </div>
    <pagination-view 
      v-show="formOnSale.list.length"
      :paginationName="formOnSale.name"
      :total="formOnSale.total"
      :currentPage="formOnSale.form.page"
      @size-change="handleSizeChange"
      @current-change="handleNumberChange"
    ></pagination-view>
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import chip from '@/api/chip/chip'

export default {
  data () {
    return {
      start_time:'',
      end_time:'',
      formOnSale: {
        name: 'formOnSale',
        total: 0,
        form: {
          title: '',
          chip_code: '',
          started_at:'',
          end_at:'',
          status:'',
          page: 1,
          page_size: 20
        },
        rules: {
          title: [
            { max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
          ],
          chip_code: [
            { max: 100, message: '长度在 0 到 100 个字符', trigger: 'blur' }
          ]
        },
        columns: [
          { label: '芯片编码', field: 'chip_code', align: 'center' },
          { label: '状态', field: 'status', align: 'center' },
          { label: '商品名称', field: 'title', align: 'center' },
          { label: '规格', field: 'spec_text', align: 'center' },
          { label: '商品数量', field: 'num', align: 'center' },
          { label: '创建时间', field: 'created_at', align: 'center' },
          { label: '修改时间', field: 'updated_at', align: 'center' },
        ],
        list: []
      }
    }
  },
  computed: {
    time(){
      const date = new Date()
      return date.setTime(date.getTime() -  3600*1000*24*90)
    }
  },
  methods: {
    handleSelectChange (val) {
      let self = this
      self.formOnSale.selectList = []
      val.forEach(function (val) {
        self.formOnSale.selectList.push(val.id)
      })
    },
    handleSizeChange (val) {
      this.formOnSale.form.page_size = val
      this.getChip(this.formOnSale.form)
    },
    handleNumberChange (val) {
      this.formOnSale.form.page = val
      this.getChip(this.formOnSale.form)
    },
    search () {
      this.$refs.formOnSale.validate((valid) => {
        if (valid) {
          this.formOnSale.form.page = 1
          this.getChip(this.formOnSale.form)
        }
      });
    },
    resetForm () {
      this.$refs.formOnSale.resetFields()
    },
    getChip(params) {
      chip.getChip(params).then((res) => {
        this.formOnSale.list = []
        this.formOnSale.total = res.data.total
        for (let i in res.data.list) {
          var status = res.data.list[i].status
          status ==1 ? res.data.list[i].status='已上架' : res.data.list[i].status='已核销' 
          res.data.list[i].num =1
          this.formOnSale.list.push(res.data.list[i]);
        }
      
      })
    },
     addChip() {
        this.$router.push({
          name: "addChip"
        })
      },
  },
  components: {
    TableView,
    PaginationView
  },
  mounted () {
    this.search()
  }
}

</script>

<style lang='scss' scoped>
.chip {
  margin: 20px;
  .btn-group {
    margin-top: 20px;
  }
  .table {
    margin-top: 20px;
  }
}
</style>
