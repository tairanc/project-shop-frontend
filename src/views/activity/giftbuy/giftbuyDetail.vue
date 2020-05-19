<template>
  <div class="detail">
    <h3>活动信息</h3>
    <el-row>
      <el-col>
        <p>活动名称： {{message.name}}</p>
      </el-col>
      <el-col>
        <p>活动创建时间： {{message.created_at}}</p>
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
      <div class="table">
        <el-table :data="goodsList" border :span-method="spanMethod" >
          <el-table-column  align="center" label="商品ID" prop="item_id">
          </el-table-column>
          <el-table-column align="center"  label="商品名称">
            <template slot-scope="scope">
              <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center"  label="属性" prop="spec_text">
          </el-table-column>
          <el-table-column align="center" label="市场价（元）" prop="market_price">
          </el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price">
          </el-table-column>
          <el-table-column align="center" label="可售库存" prop="store">
          </el-table-column>
          <el-table-column align="center" label="销量" prop="sales">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" :disabled="(scope.row.status==0)||(message.status==10)||(message.status==40)" @click="handleDelete(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
      <el-tabs id="export-form">
        <table-view :columns="columns" :pageList="goodsListAll"></table-view>
      </el-tabs>
    </div>
    <h3>赠品信息</h3>
    <div class="table">
      <el-table :data="goodsListGift" border >
        <el-table-column  align="center" label="商品ID" prop="item_id">
        </el-table-column>
        <el-table-column align="center"  label="商品名称">
          <template slot-scope="scope">
            <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center"  label="属性" prop="spec_text">
        </el-table-column>
        <el-table-column align="center" label="市场价（元）" prop="market_price">
        </el-table-column>
        <el-table-column align="center" label="标准售价（元）" prop="sell_price">
        </el-table-column>
        <el-table-column align="center" label="可售库存" prop="store">
        </el-table-column>
        <el-table-column align="center" label="赠送数量/件" prop="quantity">
        </el-table-column>
        <el-table-column align="center" label="销量" prop="sales">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" :disabled="(scope.row.status==0) || (message.status==10)||(message.status==40)" @click="handleDeleteGift(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row>
      <el-col :offset="10">
        <el-button type="primary" @click="goBack">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import giftbuy from '@/api/activity/giftbuy'
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
        message: {},
        goodsListAll: [],
        goodsList: [],
        goodsListGift: [],
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
            label: '市场价（元）',
            field: 'market_price',
            align: 'center'
          },
          {
            label: '标准售价（元）',
            field: 'sell_price',
            align: 'center'
          },
          {
            label: '可售库存',
            field: 'total',
            align: 'center'
          },
          {
            label: '销量',
            field: 'sales',
            align: 'center'
          },
          {
            label: '赠送数量（件）',
            field: 'gift_quantity',
            align: 'center'
          }
        ]
      }
    },
    computed: {
      spanArr(){
        return spanArr(this.goodsList)
      },
      spanArrGift(){
        return spanArr(this.goodsListGift)
      }
    },
    methods: {
      //获取买赠信息
      getGiftBuyDetail(params){
        giftbuy.getGiftBuyDetail(params).then((res)=>{
          if(res.code == 0){
            this.message = res.data.activity_info
            this.goodsList = res.data.main_items
            this.goodsListGift = res.data.gift_items

            this.total = res.data.total_count
          }
        })
      },
      //关闭买赠商品
      handleDelete(row){
        giftbuy.closeItem({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id
        }).then((res)=>{
          if(res.code == 0){
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: 'success'
            });
            this.getGiftBuyDetail(this.pageInfo)
          }
        })
      },
      handleDeleteGift(row){
        giftbuy.closeItem({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id,
          sku_id: row.sku_id
        }).then((res)=>{
          if(res.code == 0){
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: 'success'
            });
            this.getGiftBuyDetail(this.pageInfo)
          }
        })
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getGiftBuyDetail(this.pageInfo)
      },
      //搜索item
      searchItem(){
        this.pageInfo.page = 1
        this.getGiftBuyDetail(this.pageInfo)
      },
      resetSearch(){
        this.pageInfo.page = 1
        this.pageInfo.item_search = ''
        this.getGiftBuyDetail(this.pageInfo)
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getGiftBuyDetail(this.pageInfo)
      },
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex==0 || columnIndex==1 || columnIndex== 2 || columnIndex== 7) {
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
      // 导出报表
      exportForm() {
        let _this = this
        if (_this.pageInfo.item_search != null && _this.pageInfo.item_search.length > 0) {
          let _goodsaddgift = this.goodsList.concat(this.goodsListGift)
          _this.downFileData(_goodsaddgift)
        }else{
          giftbuy.getExportData({promotion_id:this.pageInfo.promotion_id}).then((res)=>{ 
            _this.downFileData(res.data)
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
          /* get binary string as output */
          let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
          try {
              FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '商品列表.xlsx');
          } catch (e){
            if (typeof console !== 'undefined'){
              console.log(e, wbout)
            }
          }
          return wbout
        },1000)

        this.$message({
          showClose: true,
          message: "导出成功",
          type: 'success'
        });
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

      this.getGiftBuyDetail(this.pageInfo)
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    overflow: hidden;
    padding: 10px 20px;
    .goods{
      overflow: hidden;
      .item_search{
        width: 195px;
        margin-left: 10px;
      }
    }
    .table{
      width: 85%;
      margin-top: 20px;
      .goods_url{
        cursor: pointer;
        &:hover{
          color: #409EFF
        }
      }
    }
    .el-pagination{
      margin-right: 15%;
      margin-bottom: 20px;
    }
    #export-form{
      display: none;
    }
  }
</style>
