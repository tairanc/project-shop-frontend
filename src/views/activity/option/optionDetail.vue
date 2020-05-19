<template>
  <div class="detail">
    <h3>活动信息</h3>
    <el-row>
      <el-col>
        <p>活动名称： {{message.name}}</p>
      </el-col>
      <el-col>
        <p>活动规则： {{message.ruleStr}}</p>
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
      <el-button type='primary' @click="selectVisible=true">选择商品</el-button>
      <el-button @click="addItemBomb">批量导入商品</el-button>
          
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
              <el-button type="text" :disabled="!(scope.row.status==1)|| (message.status==10)||(message.status==40)||(message.status==50)" @click="handleDelete(scope.row)">{{scope.row.status==1?'关闭':'已关闭'}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
      <el-tabs id="export-form">
        <table-view :columns="columns" :pageList="goodsListAll"></table-view>
      </el-tabs>
    </div>
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-form>
        <el-form-item>
          <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addTicketGoods('splice')">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :selectVisible="selectVisible"
                  :promotionType="promotionType" 
                  @visible-change="handleVisible" 
                  @choose-submit="handleAdd"></select-goods> 
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
  import SelectGoods from '@/components/SelectGoods'
  import option from '@/api/activity/option'
  import { spanArr } from '@/utils/spanArr'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        promotionType : 'OptionBuy',    //图片选择对应类型
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
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
            field: 'store',
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
      //获取特卖信息
      getOptionBuyDetail(params){
        option.getOptionBuyDetail(params).then((res)=>{
          if(res.code == 0){
            this.message = res.data
            this.goodsList = res.data.itemList.list
            this.total = res.data.itemList.total_count
          }
        })
      },
      //关闭直降商品
      handleDelete(row){
        option.closeOptionBuyItem({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id
        }).then((res)=>{
          if(res.code == 0){
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: 'success'
            });
            this.getOptionBuyDetail(this.pageInfo)
          }
        })
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getOptionBuyDetail(this.pageInfo)
      },
      //搜索item
      searchItem(){
        this.pageInfo.page = 1
        this.getOptionBuyDetail(this.pageInfo)
      },
      resetSearch(){
        this.pageInfo.page = 1
        this.pageInfo.item_search = ''
        this.getOptionBuyDetail(this.pageInfo)
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getOptionBuyDetail(this.pageInfo)
      },
      // 导出报表
      exportForm() {
        let _this = this
        if (_this.pageInfo.item_search != null && _this.pageInfo.item_search.length > 0) {
          _this.downFileData(_this.goodsList)
        }else{
          option.getOptionBuyDetail(this.pageInfoAll).then((res)=>{
            _this.downFileData(res.data.itemList.list)
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
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex==0 || columnIndex==1 || columnIndex== 7) {
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
      // 添加优惠券适用商品
      addTicketGoods(type='normal') {
        let _itmes = []
        let _goodsitemsid = []
        this.goodsList.map((item, index)=>{
          if (item.status != 0) {
            if (_goodsitemsid.indexOf(item.item_id) == -1) {
              _goodsitemsid.push(item.item_id)
            }
          }
        })
        let _itemidmap = type == 'splice' ?  this.goodsIds.split(",") : this.goodsIds
        let _itemid = _itemidmap.map((item, index)=>{
          let _indexof = _goodsitemsid.indexOf(item)
          if (_indexof == -1) {
            _itmes.push({
              item_id:item
            })
          }
        })
        if (_itmes.length < 1) {
          return
        }
        option.appendItems({
          promotion_id: this.pageInfo.promotion_id,
          items: _itmes
        }).then((res) => {
          if (res.data.fail != 0) {
            let warning = "";
            let message = res.data.message;
            let len = res.data.message.length;
            for (let i = 0; i < len; i++) {
              warning += "<p>" + message[i] + "</p>"
            }
            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: warning,
              type: 'warning'
            });
          } else {
            this.$message({
              showClose: true,
              message: "添加商品成功",
              type: 'success'
            });
            this.addVisibleid = false
            this.getOptionBuyDetail(this.pageInfo)
          }
        }, (err) => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'warning'
          });
        });
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
        this.goodsIds = val
        this.addTicketGoods()
      },
      goBack(){
        this.$router.go(-1)
      }
    },
    components: {
      PaginationView,
      TableView,
      SelectGoods
    },
    created() {
      this.pageInfo.promotion_id = this.$route.query.id
      this.pageInfoAll.promotion_id = this.$route.query.id

      this.getOptionBuyDetail(this.pageInfo)
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
