<template>
  <div class="detail">
    <div class="content">
      <h3>活动信息</h3>
      <el-row>
        <el-col>
          <p>活动名称： {{message.name}}</p>
        </el-col>
        <el-col>
          <p>每人每件限购： {{message.user_buy_limit}}件</p>
        </el-col>
        <el-col>
          <p>活动创建时间： {{message.created_at}}</p>
        </el-col>
        <el-col>
          <p>活动发布时间： {{message.release_time}}</p>
        </el-col>
        <el-col>
          <p>活动开始时间： {{message.start_time}}</p>
        </el-col>
        <el-col>
          <p>活动结束时间： {{message.end_time}}</p>
        </el-col>
      </el-row>
      <div class="goods">
        <h3>商品信息</h3>
      <el-button @click="exportForm">导出报表</el-button>
      <el-input
            class="item_search"
            placeholder="请输入商品 ID 进行搜索"
            v-model="pageInfo.item_search	"
            clearable>
          </el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchItem">搜索</el-button>
        <el-button type="primary"  @click="resetSearch">重置</el-button>
        <el-table  class="goodsTable" :data="goodsList" border :span-method="spanMethod" >
            <el-table-column  align="center" label="商品ID" prop="item_id">
            </el-table-column>
            <el-table-column align="center"  label="商品名称">
              <template slot-scope="scope">
                <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center"  label="属性" prop="spec_text">
            </el-table-column>
            <el-table-column align="center" label="标准售价（元）" prop="sell_price">
            </el-table-column>
            <el-table-column align="center" label="活动价（元）" prop="price">
            </el-table-column>
            <el-table-column align="center" label="总库存" prop="total_store">
            </el-table-column>
            <el-table-column align="center" label="活动库存" prop="promotion_store">
            </el-table-column>
            <el-table-column align="center" label="销量" prop="sales">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" :disabled="(scope.row.status==0) || (message.activity_status==10)||(message.activity_status==40)||(message.activity_status==50)" @click="handleDelete(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button>
              </template>
            </el-table-column>
        </el-table>
        <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
        <el-tabs id="export-form">
          <table-view :columns="columns" :pageList="goodsListAll"></table-view>
        </el-tabs>
      </div>
      <el-row>
        <el-col :offset="10">
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import seckill from '@/api/activity/seckill'
  import { spanArr } from '@/utils/spanArr'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'


  export default {
    data() {
      return {
        total: 0,
        pageInfo: {
          promotion_id: '',
          page: 1,
          page_size: 20,
          item_search:null
        },
        pageInfoAll: {
          promotion_id: '',
          page: 1,
          page_size: -1
        },
        message: {},
        goodsListAll: [],
        goodsList: [],
        columns: [
          {
            label: '商品ID',
            field: 'item_id',
            align: 'center'
          },
          {
            label: '商品名称',
            field: 'title',
            align: 'center'
          },
          {
            label: '属性',
            field: 'spec_text',
            align: 'center'
          },
          {
            label: '标准售价（元）',
            field: 'sell_price',
            align: 'center'
          },
          {
            label: '活动价（元）',
            field: 'price',
            align: 'center'
          },
          {
            label: '总库存',
            field: 'total_store',
            align: 'center'
          },
          {
            label: '活动库存',
            field: 'promotion_store',
            align: 'center'
          },
          {
            label: '销量',
            field: 'sales',
            align: 'center'
          }
        ]
      }
    },
    computed: {
      spanArr(){
        return spanArr(this.goodsList)
      }
    },
    methods: {
      //获取秒杀信息
      getSeckillDetail(params){
        seckill.getSeckillDetail(params).then((res)=>{
          if(res.code == 0){
            res.data.user_buy_limit = JSON.parse(res.data.rules).user_buy_limit
            this.message = res.data
          }
        })
      },
      // 获取商品列表
      getSeckillGoodList(params){
        seckill.getSeckillGoodList(params).then((res)=>{
          if(res.code == 0){
            this.total = res.data.total_count
            this.goodsList = res.data.data
          }
        })
      },
       //关闭直降商品
      handleDelete(row){
        seckill.closeSeckillDetail({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id
        }).then((res)=>{
          if(res.code == 0){
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: 'success'
            });
            this.getSeckillGoodList(this.pageInfo)
          }
        })
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getSeckillGoodList(this.pageInfo)
      },
      //搜索item
      searchItem(){
        this.pageInfo.page = 1
        this.getSeckillGoodList(this.pageInfo)
      },
      resetSearch(){
        this.pageInfo.page = 1
        this.pageInfo.item_search = ''
        this.getSeckillGoodList(this.pageInfo)
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getSeckillGoodList(this.pageInfo)
      },
      // 导出报表
      exportForm() {
        let _this = this
        if (_this.pageInfo.item_search != null && _this.pageInfo.item_search.length > 0) {
          _this.downFileData(_this.goodsList)
        }else{
          seckill.getSeckillGoodList(this.pageInfoAll).then((res)=>{
              this.goodsListAll = res.data.data
              _this.downFileData(res.data.data)
          })
        }
        
      },
      downFileData(data){
        if (data.length < 1) {
          return
        }
        this.goodsListAll = data
        setTimeout(function(){
            /* generate workbook object from table */
            let wb = XLSX.utils.table_to_book(document.querySelector('#export-form'));
          //   /* get binary string as output */
            let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '商品列表.xlsx');
            } catch (e){
                if (typeof console !== 'undefined')
                    console.log(e, wbout)
            }
            return wbout
          },1000)
          this.$message({
            showClose: true,
            message: "导出成功",
            type: 'success'
          });
      },
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex==0 || columnIndex==1 || columnIndex== 8) {
          if (this.spanArr[rowIndex] == 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else if(this.spanArr[rowIndex] == 0){
            return {
              rowspan: 1,
              colspan: 1
            }
          }else {
            return {
              rowspan: this.spanArr[rowIndex],
              colspan: 1
            }
          }
        }
      },
      goBack(){
        this.$router.go(-1)
      }
    },
    components: {
      PaginationView,
      TableView
    },
    created() {
      this.pageInfo.promotion_id = this.$route.query.promotion_id
      this.pageInfoAll.promotion_id = this.$route.query.promotion_id

      this.getSeckillDetail(this.pageInfo)
      this.getSeckillGoodList(this.pageInfo)
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    overflow: hidden;
    padding: 10px 20px;
    .reason{
      display: inline-block;
      padding: 8px 0;
      background: #f3f3f3;
    }
    .goods{
      overflow: hidden;
      .item_search{
        width: 195px;
        margin-left: 10px;
      }
      .goodsTable{
        margin-top: 20px;
        .goods_url{
          cursor: pointer;
          &:hover{
            color: #409EFF
          }
        }
      }
    }
    #export-form{
      display: none;
    }
  }
</style>
