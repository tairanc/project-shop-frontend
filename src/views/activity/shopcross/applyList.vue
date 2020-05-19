<template>
  <div class="sales">
    <table-view :loading="loading" :columns="columns" :pageList="list"></table-view>
    <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
  </div>
</template>

<script>
import shopcross from '@/api/activity/shopcross'
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'

export default {
  data() {
    return {
      columns: [
        {
          label: '优惠券ID',
          field: 'id',
          align: 'center'
        },
        {
          label: '优惠券名称',
          field: 'name',
          align: 'center'
        },
        {
          label: '报名开始时间',
          field: 'apply_start_time',
          align: 'center'
        },
        {
          label: '报名结束时间',
          field: 'apply_end_time',
          align: 'center'
        },
        {
          label: '发布时间',
          field: 'release_time',
          align: 'center'
        },
        {
          label: '优惠券使用时间',
          field: 'use_time',
          align: 'center'
        },
        {
          label: '报名情况',
          field: 'apply',
          align: 'center'
        },
        {
          label: '参与情况',
          field: 'join',
          align: 'center'
        },
        {
          label: '操作',
          align: 'center',
          actions: [
            {
              label: '查看',
              type: 'text',
              size: 'medium',
              visible: (row) => {
                return row.can_apply == 0;
              },
              click: (index,row) => {
                this.$router.push(
                  {
                    name: "shopDetail",
                    query: {
                      coupon_id: row.id,
                    }
                  }
                )
              }
            }, 
            {
              label: '报名',
                type: 'text',
                size: 'medium',
                visible: (row) => {
                  return row.can_apply == 1;
                },
                click: (index,row) => {
                  this.$router.push(
                    {
                      name: "addShop",
                      query: {
                        coupon_id: row.id,
                      }
                    }
                  )
                }
              }
          ]
        }
      ],
      loading: false,
      list: [],
      total: 0,
      pageInfo: {
        type: 'my',
        page: 1,
        page_size: 20
      }
    }
  },
  methods: {
    // pageSize变化函数
    sizeChange(val){
      this.pageInfo.page_size = val;
      this.getShopCrossCouponList(this.pageInfo);
    },
    // page变化函数
    pageChange(val){
      this.pageInfo.page = val;
      this.getShopCrossCouponList(this.pageInfo);
    },
    //获取列表
    getShopCrossCouponList(params){
      shopcross.getShopCrossCouponList(params).then((res)=>{
        if(res.code == 0){
          this.total = res.data.total_count
          this.list = res.data.list

          this.list.map((item)=>{
            this.$set(item,'use_time',`${item.use_start_time} — ${item.use_end_time}`)
          })
        }
      })
    }
  },
  components: {
    TableView,
    PaginationView
  },
  created(){
    this.getShopCrossCouponList(this.pageInfo)
  }
}

</script>
