<template>
  <div class="exemptuserlist">
    <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true">
        <el-form-item label="使用时间">
            <el-col :span="10">
            <el-date-picker type="date"  v-model="pageInfo.use_start_time" style="width: 100%;" size="small"></el-date-picker>
            </el-col>
            <el-col class="line" :span="1" > 至 </el-col>
            <el-col :span="10">
            <el-date-picker type="date"  v-model="pageInfo.use_end_time" style="width: 100%;" size="small"></el-date-picker>
            </el-col>
        </el-form-item>
        <el-form-item label="免单券ID">
            <el-input v-model="pageInfo.coupon_id" size="small"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
            <el-input v-model="pageInfo.telephone" size="small" ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button  @click="onSubmit" class="el-icon-search" size="small"></el-button>
        </el-form-item>
    </el-form>
    <el-tabs>
      <table-view :loading="loading" :columns="columns" :pageList="list">
      </table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import exempt from '@/api/activity/exempt'
  export default {
    data() {
      return {
        loading: false,
        userIds: "",
        list: [],
        total: 0,
        pageInfo: {
          page: 1,
          page_size: 20,
          use_start_time : '',
          use_end_time : '',
          coupon_id : '',
          telephone : ''
        },
        columns: [{
            label: '免单券ID',
            field: 'coupon_id',
            align: 'center'
          },
          {
            label: '免单券名称',
            field: 'name',
            align: 'center'
          },
          {
            label: '用户手机号',
            field: 'login_account',
            align: 'center'
          },
          {
            label: '兑换码',
            field: 'coupon_code',
            align: 'center'
          },
          {
            label: '免单券状态',
            field: 'status',
            align: 'center'
          },
          {
            label: '使用时间',
            // obtaintime: true,
            field : 'used_time',
            align: 'center'
          },
          {
            label: '订单编号',
            field: 'order_no',
            align: 'center'
          },
          {
            label: '订单金额',
            field: 'order_payment',
            align: 'center'
          },
          {
            label: '订单状态',
            field: 'order_status',
            align: 'center',
            tags: [{
              index: 10,
              name: "未付款",
              type: "danger"
            }, {
              index: 20,
              name: "支付完成",
              type: "success"
            }, {
              index: 30,
              name: "已取消",
              type: "info"
            }, {
              index: 40,
              name: "已全部退款",
              type: "warning"
            },{
              index: '1234',
              name: "/",
              type: "warning"
            }]
          }
        ],
      }
    },
    methods: {
      // 获取优惠券列表
      getDataList(params) {
        exempt.getUserCouponList(params).then((res) => {
          
          
          let _resdata = []
          let _keyw = ['coupon_id', 'name','login_account' ,'coupon_code', 'used_time', 'order_no', 'order_id','created_at','order_payment', 'status']
          if (res.data.length > 0) {
            res.data.map((item, index)=>{
              _keyw.map((kitem,kindex)=>{
                if (item[kitem] == null ) {
                  item[kitem] = '/'
                }
              })
              if (item.order_status == null) {
                item.order_status = '1234'
              }
              _resdata.push(item)
            })
          }
          this.list = _resdata;
          this.total = res.total_count;
        });
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getDataList(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getDataList(this.pageInfo);
      },
      onSubmit() {
        this.getDataList(this.pageInfo);
      }
    },
    components: {
      TableView,
      PaginationView
    },
    created() {
      this.getDataList(this.pageInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .exemptuserlist {
    padding: 10px;
  }

</style>
