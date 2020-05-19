<template>
  <div class="logistics">
    <el-form class="form" ref="form" :model="form" label-width="150px">
      <el-row>
        <el-col :span="6">
          <el-form-item label="物流公司名称：" prop="logistics_name">
            <el-input v-model="form.logistics_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="物流公司编码：" prop="logistics_code">
            <el-input v-model="form.logistics_code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="状态：" prop="open_status">
            <el-select v-model="form.open_status">
              <el-option label="全部" value=""></el-option>              
              <el-option label="已启用" value="1"></el-option>
              <el-option label="已禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="10">
          <el-button type="primary" @click="search">确定</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <table-view
        :columns="company"
        :pageList="list"
      >
      </table-view>

    <pagination-view 
      v-show="list.length"
      :total="total"
      :currentPage="form.page"
      @size-change="handleSizeChange"
      @current-change="handleNumberChange"
    ></pagination-view>
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import delivery from '@/api/delivery'

export default {
  data () {
    return {
      form: {
        shop_id: 1,
        open_status: '',
        logistics_code: '',
        logistics_name: '',
        page: 1,
        page_size: 20
      },
      list: [],
      total: 0,
      company: [
        { label: '物流公司名称', field: 'name', align: 'center' },
        { label: '物流公司编码', field: 'code', align: 'center' },
        { label: '状态', field: 'open_text', align: 'center' },
        {
          label: '操作', align: 'center',
          actions: [
            {
              label: '禁用',
              type: 'primary',
              size: 'mini',
              visible: (row) => {
                return row.is_open === 1
              },
              click: (index, row) => {
                delivery.cancelSignLogistics({
                  shop_id: this.form.shop_id,
                  corp_id: row.id
                }).then((res) => {
                  if (res.code === 0) {
                    row.is_open = 0
                    row.open_text = '已禁用'
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    })
                  }
                })
              }
            },
            {
              label: '启用',
              type: 'primary',
              size: 'mini',
              visible: (row) => {
                return row.is_open === 0
              },
              click: (index, row) => {
                delivery.signLogistics({
                  shop_id: this.form.shop_id,
                  corp_id: row.id
                }).then((res) => {
                  if (res.code === 0) {
                    row.is_open = 1
                    row.open_text = '已启用'
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    })
                  }
                })
              }
            }
          ]
        }
      ]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.form.page_size = val
      this.getLogistics(this.form)
    },
    handleNumberChange (val) {
      this.form.page = val
      this.getLogistics(this.form)
    },
    search () {
      this.form.page = 1
      this.getLogistics(this.form)
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    getLogistics (params) {
      delivery.getLogistics(params).then((res) => {
        res.data.data.forEach((item) => {
          if (item.is_open === 1) {
            item.open_text = "已启用"
          } else {
            item.open_text = "已禁用"
          }
        })
        this.list = res.data.data
        this.total = res.data.total_count
      })
    }
  },
  created () {
    this.search()
  },
  components: {
    TableView,
    PaginationView
  }
}

</script>

<style lang='scss' scoped>
.logistics {
  margin: 20px 10px;
  .form {
    margin-bottom: 20px;
  }
}
</style>
