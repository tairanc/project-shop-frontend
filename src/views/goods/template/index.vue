<template>
  <div class="main">
    <el-button type="primary" @click="addTempalte">新增运费模板</el-button>

    <div class="template" v-for="item in list">
      <div class="top">
        <span class="name">{{item.name}}</span>
        <span class="status">{{item.status_text}}</span>
        <span class="btn-group">
          <el-button type="primary" size="small" @click="editTemplate(item.id)">修改</el-button>
          <el-button type="primary" size="small" @click="removeTemplate(item.id)">删除</el-button>
        </span>
        <span class="time">最后修改时间：{{item.updated_at}}</span>
      </div>
      <table-view class="bottom_table" v-if="item.is_free"
        :columns="free"
        :pageList="item.all || []"
      >
      </table-view>

      <table-view class="bottom_table" v-if="!item.is_free&&(item.valuation_type===1||item.valuation_type===2)"
        :columns="item.valuation_type===1?weight:number"
        :pageList="item.freight_conf || []"
      >
      </table-view>

      <el-table class="bottom_table" v-if="!item.is_free&&item.valuation_type===3" :data="item.freight_conf||[]" border align="center" :span-method="spanMethod">
        <el-table-column align="center" label="配送地址" prop="area_label">
        </el-table-column>
        <el-table-column align="center" label="金额下限（元）" prop="boundary">
        </el-table-column>
        <el-table-column align="center" label="金额上限（元）" prop="upper">
        </el-table-column>
        <el-table-column align="center" label="运费（元）" prop="freight">
        </el-table-column>
      </el-table>

    </div>

    <pagination-view v-show="list.length" :total="total" :currentPage="page" @size-change="handleSizeChange" @current-change="handleNumberChange"></pagination-view>    
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import delivery from '@/api/delivery'
import { spanArr } from '@/utils/spanArr'

export default {
  data () {
    return {
      total: 0,
      page: 1,
      page_size: 20,
      list: [],
      free: [
        { label: '运费模板名称', field: 'name', align: 'center' },        
        { label: '配送地址', field: 'area_label', align: 'center' },
        { label: '运费', field: 'price', align: 'center' }
      ],
      weight: [
        { label: '配送地址', field: 'area_label', align: 'center' },
        { label: '首重（kg）', field: 'start_standard', align: 'center' },
        { label: '首费（元）', field: 'start_freight', align: 'center' },
        { label: '续重（kg）', field: 'add_standard', align: 'center' },
        { label: '续费（元）', field: 'add_freight', align: 'center' }
      ],
      number: [
        { label: '配送地址', field: 'area_label', align: 'center' },
        { label: '首件（件）', field: 'start_standard', align: 'center' },
        { label: '首费（元）', field: 'start_freight', align: 'center' },
        { label: '续件（件）', field: 'add_standard', align: 'center' },
        { label: '续费（元）', field: 'add_freight', align: 'center' }
      ]
    }
  },
  methods: {
    handleSizeChange (val) {
      this.page_size = val
      this.getList({
        page: this.page,
        page_size: this.page_size
      })
    },
    handleNumberChange (val) {
      this.page = val
      this.getList({
        page: this.page,
        page_size: this.page_size
      })
    },
    getList(params){
      delivery.getDeliveryList(params).then((res)=>{
        if(res.code === 0){
          res.data.data.forEach((item) => {
            item.status_text = item.status === 1 ? '启用' : '禁用'
            if(item.is_free){
              item.all =[{
                name: item.name,
                area_label: '全国',
                price: '包邮'
              }]
            }
            if(item.is_free != 1 && item.valuation_type == 3){   
              item.freight_conf.map((child)=>{
                child.item_id = child.area_label
                child.id = item.id
                !child.upper && (child.upper = '∞')
              })
            }
          })
          this.list = res.data.data
          this.total = res.data.total_count
        }
      })
    },
    addTempalte () {
      this.$router.push({ name: 'addtemplate' })
    },
    editTemplate(params){
      this.$router.push({path:`/goods-manage/logistics/edittemplate/${params}`})
    },
    removeTemplate(params){
      delivery.removeTemplate({template_id:params}).then((res)=>{
        if(res.code===0){
          this.$message({
            type:'success',
            message: '删除模板成功'
          })
          this.getList({page:this.page,page_size:this.page_size})
        }
      })
    },
    //表格合并处理方法
    spanMethod({ row, column, rowIndex, columnIndex }) {
      
      if (columnIndex === 0) {

        let currentObj = this.list.filter((item)=>{
          return item.id == row.id
        })
        
        let newArr = spanArr(currentObj[0].freight_conf)

        if (newArr[rowIndex] == 1) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else if(newArr[rowIndex] == 0){
          return {
            rowspan: 1,
            colspan: 1
          }
        }else {
          return {
            rowspan: newArr[rowIndex],
            colspan: 1
          }
        }
      }
    }
  },
  components: {
    TableView,
    PaginationView
  },
  created () {
    this.getList({page:this.page,page_size:this.page_size})

  }
}

</script>

<style lang='scss' scoped>
.main {
  margin: 10px;
  .template{
    width: 100%;
    margin: 40px 0;
    .top{
      overflow: hidden;
      padding: 10px 0;
      background: #b0c4de;
      line-height: 32px;
      .name{
        margin: 0 20px;
      }
      .status{
        color: blue;
      }
      .time,.btn-group{
        float: right;
        margin-right: 20px;
      }
    }
    .bottom_table{
      width: 100%;
    }
    
  }
}
</style>

<style>
.el-table__header-wrapper .el-table__header{
  width: 100%!important;
}
.el-table__body-wrapper .el-table__body{
  width: 100%!important;
}
</style>

