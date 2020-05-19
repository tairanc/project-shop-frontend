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
          <el-button type="primary" icon="el-icon-download" :disabled="list.length==0" @click="exportExcel">导出</el-button>
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
  import commission from '@/api/settle/othersfine'
  import {exportFun} from '@/utils/exportBill.js'
  import {getInitDay} from '@/utils/createtime.js'



  export default {
    data() {
      return {
        total: 0,
        trade_time:[],
        form: {
          page: 1,
          page_size: 20,
        },
        list: [],
        columns: [
          /*{label: '店铺id', field: 'shop_id', align: 'center'},*/
          {label: '创建时间', field: 'created_at', align: 'center',minWidth:'160px'},
          {label: '款项金额', field: 'amount', align: 'center'},
          {label: '对接人', field: 'admin', align: 'center'},
          {label: '备注', field: 'comment', align: 'center'}
        ]
      }
    },
    methods: {
      searchFormdata(form){
        form.page=1;
        this.searchIncidentalBill(form)
      },
      searchIncidentalBill(data) {
        if(this.trade_time){
          this.form.start_date =this.trade_time[0]
          this.form.end_date =this.trade_time[1]
        }else{
          this.form.start_date =''
          this.form.end_date = ''
        }
        commission.searchIncidentalBill(data).then((res) => {
          this.total = res.data.total_count
          this.list = []
          for (var i in res.data.list) {
            this.list.push(res.data.list[i])
          }
        })
      },
      sizeChange(val) {
        this.form.page_size = val;
        this.searchIncidentalBill(this.form)
      },
      pageChange(val) {
        this.form.page = val;
        this.searchIncidentalBill(this.form)
      },
      //导出报表
      exportExcel() {
        let params={
          type:'incidental_bill',
          start_date:this.form.start_date,
          end_date:this.form.end_date
        };
        exportFun(params,this);
      },

      //清空
      clearBtn(){
        this.form.start_date=''
        this.form.end_date=''
        this.trade_time=[]
      }
    },
    created: function () {
      this.trade_time[0] = getInitDay('start');
      this.trade_time[1] = getInitDay('end');
      this.searchIncidentalBill(this.form)
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

