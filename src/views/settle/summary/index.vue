<template>
  <div class="summary">
    <el-tabs type="border-card">
      <el-form>
        <el-row>
          <el-col :span='6' :offset="1">
            <el-form-item label="账单月：" prop="start_at">
              <!--<el-date-picker v-model="form.settlement_month" type="datetime" placeholder="账单月"
                              format="yyyy-MM"
                              value-format="yyyy-MM"></el-date-picker>-->
              <div class="block">
                <el-date-picker
                  v-model="form.settlement_month"
                  value-format="yyyy-MM"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="状态" prop="type">
              <el-select v-model="form.status" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="待商家确认" value="20"></el-option>
                <el-option label="商家已确认" value="30"></el-option>
                <el-option label="平台完成打款" value="40"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
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
          <el-button type="primary" @click="settleConfirm">结算确认</el-button>
        </el-col>
      </el-row>
    </div>
    <table-view
      :height="600"
      :selection="true"
      :columns="columns"
      :pageList="list"
      @select-change='handleSelectChange'
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
  import commission from '@/api/settle/summary'


  export default {
    data() {
      return {
        total: 0,
        selectList: [],
        form: {
          page: 1,
          page_size: 20,
          settlement_month: '',
          status: ''
        },
        list: [],
        columns: [
          {label: '创建时间', field: 'created_at', align: 'center', minWidth: '160px'},
          {label: '结算周期', field: 'settlement_scope_date', align: 'center', minWidth: '330px'},
          /* {label: '结算周期开始时间', field: 'settlement_start_at', align: 'center', minWidth: "160px"},
           {label: '结算周期结束时间', field: 'settlement_end_at', align: 'center', minWidth: "160px"},*/
          {label: '结算方式', field: 'zh_periodic', align: 'center'},
          {label: '状态', field: 'zh_status', align: 'center', minWidth: "100px"},
          {label: '子订单实付金额', field: 'payment', align: 'center', minWidth: "120px"},
          {label: '退款金额', field: 'refund_amount', align: 'center'},


          {label: '净销售', field: 'sale_amount', align: 'center'},
          {label: '活动e卡金额', field: 'activity_e_card_payment', align: 'center', minWidth: "100px"},
          {label: '红包金额', field: 'discount_hb', align: 'center'},
          {label: '优惠券平台承担', field: 'discount_coupon_platform', align: 'center', minWidth: "120px"},
          {label: '服务费', field: 'service_fee', align: 'center'},

          {label: '结算小计', field: 'settlement_fee', align: 'center'},
          {label: '商品税费调减', field: 'reduce_taxes', align: 'center', minWidth: "120px"},
          {label: '活动e卡调减', field: 'reduce_activity_e_card_payment', align: 'center', minWidth: "120px"},
          {label: '红包金额调减', field: 'reduce_discount_hb', align: 'center', minWidth: "130px"},
          {label: '优惠券平台承担-调减', field: 'reduce_discount_coupon_platform', align: 'center', minWidth: "180px"},


          {label: '服务费调减', field: 'reduce_service_fee', align: 'center', minWidth: "120px"},
          {label: '已结算扣回', field: 'reduce_settlement_fee', align: 'center', minWidth: "120px"},
          {label: '代付运费', field: 'compensatory_freight_amount', align: 'center'},
          {label: '违规罚款', field: 'fine_amount', align: 'center'},
          {label: '其他款项', field: 'incidental_amount', align: 'center'},
          {label: '结算金额', field: 'settlement_total_fee', align: 'center'},

          {label: '商家需开发票', field: 'shop_invoice_amount', align: 'center', minWidth: "120px"},
          {label: '平台需开发票', field: 'platform_invoice_amount', align: 'center', minWidth: "120px"}
        ]
      }
    },
    methods: {
      searchFormdata(form){
        form.page=1;
        this.searchPeriodicStatement(form);
      },
      searchPeriodicStatement(data) {
        commission.searchPeriodicStatement(data).then((res) => {
          this.total = res.data.total_count
          this.list = []
          for (var i in res.data.list) {
            this.list.push(res.data.list[i])
          }
          ;
        })
      },
      sizeChange(val) {
        this.form.page_size = val;
        this.searchPeriodicStatement(this.form)
      },
      pageChange(val) {
        this.form.page = val;
        this.searchPeriodicStatement(this.form)
      },
      //下载报表
      exportExcel() {
        let params = {
          settlement_month: this.form.settlement_month,
          status: this.form.status
        };
        commission.exportPeriodicStatement(params)
          .then((res) => {
            if (res.data.result) {
              this.$message({
                message: '导出成功',
                type: 'success'
              });
            }
          })
      },
      //select选中
      handleSelectChange(val) {
        let self = this;
        self.selectList = []
        val.forEach(function (val) {
          //self.selectList.push(val.id)
          self.selectList.push({id: val.id, status: val.status})

        })
      },
      //结算确认
      settleConfirm() {
        if (this.selectList.length >= 1) {
          this.$confirm('是否确认结算？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let dealArray = this.selectList.filter((item) => {
              return item.status == 20;
            });
            if (dealArray.length < 1) {
              this.$message({
                type: 'info',
                message: '请选择待确认数据'
              });
            } else {
              let lastArray = [];
              dealArray.map((item) => {
                lastArray.push(item.id);
              });
              commission.checkPeriodicStatement(lastArray)
                .then((res) => {
                  if (res.data.result) {
                    this.$message({
                      message: '结算成功',
                      type: 'success'
                    });
                  }
                  this.searchPeriodicStatement(this.form)
                })
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消结算'
            });
          });

        } else {
          this.$message.error("请选择要操作的数据项！");
        }
      },
      //清空
      clearBtn() {
        this.form = {
          settlement_month: '',
          status: ''
        }
      }
    },
    created: function () {
      this.searchPeriodicStatement(this.form)
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

