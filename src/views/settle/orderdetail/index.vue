<template>
  <div class="summary">
    <el-tabs type="border-card">
      <el-form>
        <el-row>
          <el-col :span="12" :offset="1">
            <el-form-item label="创建时间:" prop="trade_time">
              <el-date-picker
                v-model="trade_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='5' :offset="1">
            <el-button type="primary" icon="el-icon-search" @click="searchFormdata(form)">搜索</el-button>
            <el-button @click="clearBtn">清空条件</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-tabs>
    <p></p>
    <div class='btn'>
      <el-row>
        <el-col :span='5'>
          <el-button type="primary" icon="el-icon-download" :disabled="list.length==0" @click="exportExcel">导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <table-view
      :height="600"
      :columns="columns"
      :pageList="list"
      id='rebateSetTable'
    ></table-view>

    <pagination-view
      :currentPage="form.page"
      :total="total"
      @size-change="sizeChange"
      @current-change="pageChange">
    </pagination-view>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import commission from '@/api/settle/orderDetail'
  import {exportFun} from '@/utils/exportBill.js'
  import {getInitDay} from '@/utils/createtime.js'

  export default {
    data() {
      return {
        total: 0,
        trade_time: [],
        form: {
          page: 1,
          page_size: 20,
        },
        list: [],
        columns: [
          {label: '创建时间', field: 'created_at', align: 'center', minWidth: '160px'},
          /*{label: '结算周期', field: 'settlement_at', align: 'center', minWidth: '160px'},*/
          {label: '支付完成时间', field: 'payed_at', align: 'center', minWidth: '160px'},
          {label: '平台订单号', field: 'order_no', align: 'center', minWidth: '180px'},
          {label: '店铺订单号', field: 'order_shop_no', align: 'center', minWidth: '180px'},
          {label: '条形码', field: 'barcode', align: 'center', minWidth: '150px'},
          {label: '货号', field: 'art_no', align: 'center', minWidth: '150px'},
          {label: '商品名称', field: 'title', align: 'center'},
          {label: '商品id', field: 'item_id', align: 'center'},
          {label: '规格', field: 'spec_nature_info', align: 'center'},
          {label: '商品数量', field: 'num', align: 'center'},
          {label: '单价', field: 'price', align: 'center'},
          {label: '商品总价', field: 'total_fee', align: 'center'},
          {label: '商品税费', field: 'taxes', align: 'center'},
          {label: '运费分摊', field: 'freight', align: 'center'},
          {label: '红包金额', field: 'discount_hb', align: 'center'},

          {label: '促销优惠分摊', field: 'discount_promotion', align: 'center', minWidth: '130px'},
          {label: '促销活动类型', field: 'promotion_tags', align: 'center', minWidth: '160px'},
          {label: '优惠券平台承担金额', field: 'discount_coupon_platform', align: 'center', minWidth: '160px'},
          {label: '优惠券店铺承担金额', field: 'discount_coupon_shop', align: 'center', minWidth: '160px'},
          {label: '优惠券类型', field: 'coupon_type', align: 'center', minWidth: '130px'},
          {label: '优惠券名称', field: 'coupon_name', align: 'center', minWidth: '130px'},
          {label: '优惠券id', field: 'coupon_id', align: 'center'},
          {label: '子订单级订单优惠金额', field: 'discount_amount', align: 'center', minWidth: '180px'},
          {label: '子订单实付金额', field: 'payment', align: 'center', minWidth: '180px'},
          {label: '活动卡金额', field: 'activity_e_card_payment', align: 'center', minWidth: '100px'},
          {label: '充值卡金额', field: 'recharge_e_card_payment', align: 'center', minWidth: '100px'},
          {label: '网关金额', field: 'gate_payment', align: 'center'},
          {label: '其他渠道金额', field: 'other_payment', align: 'center', minWidth: '110px'},
          {label: '订单实付金额', field: 'order_payment', align: 'center', minWidth: '110px'},


          /*{label: '店铺名称', field: 'shop_name', align: 'center'},*/
          {label: '供应商名称', field: 'supplier_name', align: 'center', minWidth: '110px'},
          {label: '一级类目', field: 'cat_primary_name', align: 'center'},
          {label: '二级类目', field: 'cat_secondary_name', align: 'center'},
          {label: '三级类目', field: 'cat_tertiary_name', align: 'center'},
          {label: '贸易方式', field: 'trade_type', align: 'center'},
          {label: '终端类型', field: 'platform_type', align: 'center', minWidth: "120px"},
          {label: '扣点', field: 'point', align: 'center'},
          /* {label: '平台券金融承担金额', field: 'discount_coupon_finance', align: 'center',minWidth:'180px'},
           {label: '平台券积分商城承担金额', field: 'discount_coup', align: 'center',minWidth:'180px'},
           {label: '平台券泰然城承担金额', field: 'discount_coupon_mall', align: 'center',minWidth:'180px'},*/
          {label: '服务费', field: 'service_fee', align: 'center'},
          {label: '结算小计', field: 'settlement_fee', align: 'center'},

          /* {label: '规格id', field: 'sku_id', align: 'center'},
           {label: '类目id', field: 'cat_id', align: 'center'},
           {label: '店铺id', field: 'shop_id', align: 'center'},
          {label: '更新时间', field: 'updated_at', align: 'center', minWidth: '160px'},*/
        ]
      }
    },
    methods: {
      searchFormdata(form){
        form.page=1;
        this.searchOrderGoodBill(form);
      },

      searchOrderGoodBill(data) {
        if (this.trade_time) {
          this.form.start_date = this.trade_time[0]
          this.form.end_date = this.trade_time[1]
        }else{
          this.form.start_date = ''
          this.form.end_date = ''
        }
        commission.searchOrderGoodBill(data).then((res) => {
          this.total = res.data.total_count
          this.list = []
          for (var i in res.data.list) {
            var tradeType = res.data.list[i].trade_type
            switch (tradeType) {
              case 10 :
                res.data.list[i].trade_type = '国内贸易'
                break;
              case 20 :
                res.data.list[i].trade_type = '海淘'
                break;
              case 30 :
                res.data.list[i].trade_type = '跨境保税'
                break;
              case 40 :
                res.data.list[i].trade_type = '跨境直邮'
                break;
            }
            this.list.push(res.data.list[i])
          }
        })
      },
      sizeChange(val) {
        this.form.page_size = val;
        this.searchOrderGoodBill(this.form)
      },
      pageChange(val) {
        this.form.page = val;
        this.searchOrderGoodBill(this.form)
      },
      //导出报表
      exportExcel() {
        let params = {
          type: 'order_good_bill',
          start_date: this.form.start_date,
          end_date: this.form.end_date
        };
        exportFun(params, this);
      },

      //清空
      clearBtn() {
        this.form.start_date = ''
        this.form.end_date = ''
        this.trade_time = []
      },


    },
    created: function () {
      this.trade_time[0] = getInitDay('start');
      this.trade_time[1] = getInitDay('end');
      this.searchOrderGoodBill(this.form)
    },
    components: {
      TableView,
      PaginationView
    }
  }
</script>
<style lang="scss" scoped>
  .summary {
    padding: 20px
  }

  .btn {
    margin-top: 10px;
    padding: 5px
  }
</style>

