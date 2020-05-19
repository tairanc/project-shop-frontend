<template>
  <div class="reducedetail">
    <div class="content">
      <h3>活动信息</h3>
      <el-row v-if="backData != {}">
        <el-col>
          <p>活动名称： {{backData.name}}</p>
        </el-col>
        <el-col>
          <p>活动规则： {{backData.ruleStr}}</p>
        </el-col>
        <el-col>
          <p>活动创建时间： {{backData.created_at}}</p>
        </el-col>
        <el-col>
          <p>活动开始时间： {{backData.start_time}}</p>
        </el-col>
        <el-col>
          <p>活动结束时间： {{backData.end_time}}</p>
        </el-col>
      </el-row>
      <el-row>
        <h3>商品信息</h3>
        <el-col>
          <el-button @click="exportForm">导出报表</el-button>
          <el-button type='primary' @click="selectVisible=true">选择商品</el-button>
          <el-button @click="addItemBomb">批量导入商品</el-button>
          
          <el-input
            class="item_search"
            placeholder="请输入商品 ID 进行搜索"
            v-model="detailInfo.item_search	"
            clearable>
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchItem">搜索</el-button>
          <el-button type="primary"  @click="resetSearch">重置</el-button>
        </el-col>
        <el-col :span="24" class="mt20">
          <el-table class="table" :data="itemList" border align="center" :span-method="spanMethod" id="exportformtable" >
              <el-table-column align="center" label="商品ID" prop="item_id"></el-table-column>
              <!-- <el-table-column align="center" label="商品编号" prop="art_no"></el-table-column> -->
              <!-- <el-table-column align="center" label="商品名称" prop="title"></el-table-column> -->
              <el-table-column align="center"  label="商品名称">
                <template slot-scope="scope">
                  <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="属性" prop="spec_text"></el-table-column>
              
              <el-table-column align="center" label="市场价（元）" >
                <template slot-scope="scope">
                  <span v-show="!scope.row.edit">{{scope.row.market_price}}</span>
                  <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.market_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="标准售价（元）" prop="sell_price"></el-table-column>
              <el-table-column align="center" label="可售库存" prop="store"></el-table-column>
              <el-table-column align="center" label="销量" prop="sales"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="info" size="mini" 
                    v-if="statusFirst" disabled >关闭</el-button>
                  <el-button type="primary" size="mini" 
                    @click="closeCouponItem(backData.id ,scope.row.item_id)" 
                    v-else-if="scope.row.status != 0 && statusFirst == false" >关闭</el-button>
                  <el-button type="info" v-else disabled size="mini">已关闭</el-button>
                </template>
              </el-table-column>
            </el-table>
          <pagination-view :currentPage="detailInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
          <el-tabs id="export-form">
            <table-view :loading="loading" :columns="columns" :pageList="itemListAll"></table-view>
          </el-tabs>
        </el-col>
      </el-row>
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
    <el-row class="mt40" type="flex" justify="center">
      <el-col :span="2">
        <el-button type="primary" @click="backList">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import reduce from '@/api/activity/reduce'
  import TableView from '@/components/TableView'
  import SelectGoods from '@/components/SelectGoods' 
  import PaginationView from '@/components/PaginationView'
  import { spanArr } from '@/utils/spanArr'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
          statusFirst: false,     // 商品当前状态是否置灰 关闭按钮
          isfullreduce : true,    // 满折 reducebreak 还是 满减 reducefull
          detailInfo: {
              promotion_id : '',
              page : 1 ,
              page_size : 20,
              item_search:null
          },
          backData: {},

        loading: false,
        promotionType : 'FullDiscount',    //图片选择对应类型  FullMinus 满减； FullDiscount 满折；
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        itemList: [],
        itemListAll : [],         //导出所有数据
        total: 0,
        goodsVisible: false,
        couponInfo: {
          coupon_id: undefined
        },
        couponDetail: {
          extend: {}
        },
        columns: [{
                label: '商品ID',
                field: 'item_id',
                align: 'center'
            },{
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
            },{
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
            }]
      }
    },
    methods: {
      getAllDetail(params){
        let _this = this
        let _newdata = JSON.parse(JSON.stringify(params));
        if (_newdata.item_search!=null && _newdata.item_search.length > 0) {
          _this.downFileData(this.itemList)
        }else{
          _newdata.page_size = -1
          reduce.getShopcoupon(_newdata, this.isfullreduce).then((res) => {
            _this.downFileData(res.data.itemList.list)
          });
        }
      },
      downFileData(data){
        if (data.length < 1) {
          return
        }
        this.itemListAll = data;
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
      },
      getDetail(params){
        reduce.getShopcoupon(params, this.isfullreduce).then((res) => {
          this.backData = res.data;
          this.itemList = res.data.itemList.list;
          this.total = res.data.itemList.total_count;
        });
      },
      // 关闭优惠券商品
      closeCouponItem(promotion_id, id) {
        this.$confirm('确定关闭该商品的活动状态？', '关闭提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reduce.closeCouponItem({
            promotion_id: promotion_id,
            item_id: id
          }, this.isfullreduce).then((res) => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: "商品关闭成功",
                type: 'success',
                duration: 1000
              });
              this.getDetail(this.detailInfo);
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 1000
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭商品'
          });
        });

      },
      //搜索item
      searchItem(){
        this.detailInfo.page = 1
        this.getDetail(this.detailInfo);
      },
      resetSearch(){
        this.detailInfo.page = 1
        this.detailInfo.item_search = ''
        this.getDetail(this.detailInfo);
      },
      // 导出报表
      exportForm() {
        this.getAllDetail(this.detailInfo)
        this.$message({
          showClose: true,
          message: "导出成功",
          type: 'success'
        });
      },
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
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
      //行编辑
      handleEdit(row){
        this.itemList.map((item)=>{
          if(item.item_id == row.item_id){
            item.edit = true
          }
        })
      },
      // 添加优惠券适用商品
      addTicketGoods(type='normal') {
        let _itmes = []
        let _goodsitemsid = []
        this.itemList.map((item, index)=>{
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
        reduce.appendItems({
          promotion_id: this.couponInfo.coupon_id,
          items: _itmes
        },this.isfullreduce).then((res) => {
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
            this.getDetail(this.detailInfo)
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
      // 返回列表页
      backList() {
        let _name = this.isfullreduce ? 'reducebreak' : 'reducefull'
        this.$router.push({
          name: _name
        })
      },
      // pageSize变化函数
      sizeChange(val){
        this.detailInfo.page_size = val;
        this.getDetail(this.detailInfo);
      },
      // page变化函数
      pageChange(val){
        this.detailInfo.page = val;
        this.getDetail(this.detailInfo);
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
        this.goodsIds = val
        this.addTicketGoods()
      }
    },
    components: {
      TableView,
      PaginationView,
      SelectGoods
    },
    computed: {
      spanArr(){
        return spanArr(this.itemList)
      }
    },
    created() {
      let that = this
      that.isfullreduce = that.$route.name === "reduceBreakDetail" ?  true : false
      that.promotionType = that.$route.name === "reduceBreakDetail" ?  'FullDiscount' : 'FullMinus' //图片选择对应类型  FullDiscount 满折 FullMinus 满减； 
      if (that.$route.query.status != 30) {
        that.statusFirst = true
      }else{
        that.statusFirst = false
      }
      that.couponInfo.coupon_id = that.$route.query.id;
      that.detailInfo.promotion_id = that.$route.query.id
      that.getDetail(that.detailInfo)
    }
  }

</script>

<style lang='scss' scoped>
  .reducedetail {
    padding: 10px 20px;
    .el-col{
      p{
        // font-size: 14px;
      }
      .item_search{
          width: 195px;
          margin-left: 10px;
      }
    }
  }

  .mt40 {
    margin-top: 40px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb30 {
    margin-bottom: 30px;
  }

  #export-form{
    display: none;
  }

</style>
