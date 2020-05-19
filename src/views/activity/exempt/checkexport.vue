<template>
  <div class="exemptuserlist">
    <el-tabs>
      <table-view :loading="loading" :columns="columns" :pageList="list">
      </table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
    <el-row class="mt40" type="flex" justify="center">
      <el-col :span="2">
        <el-button type="primary" @click="backList">返回</el-button>
      </el-col>
    </el-row>
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
          coupon_id : '',
        },
        columns: [{
            label: '兑换码',
            field: 'code',
            align: 'center'
          },
          {
            label: '是否兑换',
            field: 'is_exchange',
            align: 'center',
            tags: [{
              index: 0,
              name: "否"
            }, {
              index: 1,
              name: "是"
            }]
          },
          {
            label: '兑换帐号',
            field: 'login_account',
            align: 'center'
          }
        ],
      }
    },
    methods: {
      // 获取优惠券列表
      getDataList(params) {
        exempt.getExchangeCodes(params).then((res) => {
          this.list = res.data.data;
          this.total = res.data.total_count;
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
      // 返回上一层
      backList() {
        this.$router.push({
          name: "checkexempt",
          query: {
            id: this.pageInfo.coupon_id
          }
        })
      },
    },
    components: {
      TableView,
      PaginationView
    },
    created() {
       this.pageInfo.coupon_id = this.$route.query.id;
        // this.pageInfo.coupon_id = '39'
       this.getDataList(this.pageInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .exemptuserlist {
    padding: 10px;
  }

</style>
