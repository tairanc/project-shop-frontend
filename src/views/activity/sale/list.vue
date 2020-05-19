<template>
  <div class="sales">
    <table-view :loading="loading" :columns="columns" :pageList="list"></table-view>
    <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
  </div>
</template>

<script>
import sale from '@/api/activity/sale'
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'

export default {
  data() {
    return {
      columns: [
        {
          label: '活动名称',
          field: 'name',
          align: 'center'
        },
        {
          label: '活动类型',
          field: 'type',
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
          label: '活动开始时间',
          field: 'start_time',
          align: 'center'
        },
        {
          label: '活动结束时间',
          field: 'end_time',
          align: 'center'
        },
        {
          label: '报名情况',
          textp: true,
          align: 'center'
        },
        {
          label: '参与情况',
          field: 'apply_status',
          align: 'center',
          tags: [
            {
              index: 1,
              name: "报名未开始",
              type: "danger"
            }, 
            {
              index: 2,
              name: "可参与",
              type: "success"
            }, 
            {
              index: 3,
              name: "报名已结束",
              type: "info"
            }, 
            {
              index: 0,
              name: "不可参与",
              type: "warning"
            }
          ]
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
                return row.apply_status != 2;
              },
              click: (index,row) => {
                !row.apply_id && (row.apply_id = -1)
                this.$router.push(
                  {path:`/goods-activity/activity/saleDetail?sale_id=${row.flash_sale_id}&apply_id=${row.apply_id}`}
                )
              }
            }, 
            {
              label: '报名',
                type: 'text',
                size: 'medium',
                visible: (row) => {
                  return row.apply_status == 2;
                },
                click: (index,row) => {
                  !row.apply_id && (row.apply_id = -1)
                  this.$router.push(
                    {path:`/goods-activity/activity/addSale?sale_id=${row.flash_sale_id}&apply_id=${row.apply_id}`}
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
        type: 'list',
        page: 1,
        page_size: 20
      }
    }
  },
  methods: {
    // pageSize变化函数
    sizeChange(val){
      this.pageInfo.page_size = val;
      this.getFlashSaleList(this.pageInfo);
    },
    // page变化函数
    pageChange(val){
      this.pageInfo.page = val;
      this.getFlashSaleList(this.pageInfo);
    },
    getFlashSaleList(params){
      sale.getFlashSaleList(params).then((res)=>{
        if(res.code == 0){
          this.total = res.data.total_count
          this.list = res.data.data

          this.list.map((item)=>{
            switch(item.type){
              case 'FlashSale': 
                  item.type = '单品特卖'
                  break
              case 'SpecialFlashSale': 
                  item.type = '专场特卖'
                  break
            }

            item.textp = [
              `未审核 ${item.record_verify_status.pending}`,
              `审核通过 ${item.record_verify_status.agree}`,
              `审核未通过 ${item.record_verify_status.refuse}`
            ]
          })
        }
      })
    }
  },
  components: {
    TableView,
    PaginationView
  },
  mounted(){
    this.getFlashSaleList(this.pageInfo)
  }
}

</script>
