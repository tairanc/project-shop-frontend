<template>
  <div class="warehouse">
    <el-button @click="addStore" type="primary">新增仓库</el-button>

    <table-view :columns="wareHouse" :pageList="list">
    </table-view>

    <pagination-view v-show="list.length" :total="total" :currentPage="page" @size-change="handleSizeChange" @current-change="handleNumberChange"></pagination-view>
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import delivery from '@/api/delivery'

export default {
  data () {
    return {
      list: [],
      total: 0,
      page: 1,
      page_size: 20,
      wareHouse: [
        { label: '仓库名称', field: 'name', align: 'center' },
        { label: '状态', field: 'used_text', align: 'center' },
        { label: '创建时间', field: 'created_at', align: 'center' },
        { label: '更新时间', field: 'updated_at', align: 'center' },
        { label: '操作', align: 'center',
          actions: [
            {
              label: '启用',
              type: 'primary',
              size: 'mini',
              visible: (row) => {
                return row.is_used === 0
              },
              click: (index, row) => {
                delivery.changeWarehouseStatus({store_id:row.id,is_used:1}).then((res)=>{
                  if(res.code ===0){
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    })
                    this.getWarehouseList({
                      page: this.page,
                      page_size: this.page_size
                    })
                  }
                })
              }
            },
            {
              label: '禁用',
              type: 'primary',
              size: 'mini',
              visible: (row) => {
                return row.is_used === 1
              },
              click: (index, row) => {
                delivery.changeWarehouseStatus({store_id:row.id,is_used:0}).then((res)=>{
                  if(res.code ===0 ){
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    })
                    this.getWarehouseList({
                      page: this.page,
                      page_size: this.page_size
                    })
                  }
                })
                
              }
            },
            {
              label: '删除',
              type: 'danger',
              size: 'mini',
              click: (index, row) => {
                delivery.removeWarehouse({
                  store_id: row.id
                }).then((res) => {
                  if (res.code === 0) {
                    this.$message({
                      type: 'success',
                      message: '操作成功！'
                    })
                    this.getWarehouseList({
                      page: 1,
                      page_size: this.page_size
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
      this.page_size = val
      this.getWarehouseList({
        page: this.page,
        page_size: this.page_size
      })
    },
    handleNumberChange (val) {
      this.page = val
      this.getWarehouseList({
        page: this.page,
        page_size: this.page_size
      })
    },
    getWarehouseList (params) {
      delivery.getWarehouseList(params).then((res) => {
        res.data.data.forEach((item) => {
          item.used_text = item.is_used === 1 ? '启用' : '禁用'
        })
        this.list = res.data.data
        this.total = res.data.count
      })
    },
    addStore () {
      this.$router.push({ name: 'addstore' })
    },
  },
  created(){
    this.getWarehouseList({
        page: this.page,
        page_size: this.page_size
      })
  },
  components: {
    TableView,
    PaginationView
  }
}

</script>

<style lang='scss' scoped>
.warehouse {
  margin: 20px;
  .el-table {
    margin-top: 20px;
  }
}
</style>
