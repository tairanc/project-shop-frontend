<template>
  <div class="seckill">
    <p>
      <el-button type="primary" icon="el-icon-plus" @click='addExchange'>添加活动</el-button>
    </p>
    <table-view :columns='columns' :pageList='list'></table-view>
    <pagination-view 
      :currentPage="pageInfo.page" 
      :total="total" 
      @size-change="sizeChange" 
      @current-change="pageChange">
    </pagination-view>
  </div>
</template>

<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import exchange from '@/api/activity/exchange'

export default {
  data() {
    return {
      list:[],
      total:0,
      pageInfo:{
        page:1,
        page_size:20
      },
      columns:[
        {
          label: '活动ID',
          field: 'id',
          align: 'center'
        },
        {
          label: '活动名称',
          field: 'name',
          align: 'center'
        },
        {
          label: '开始时间',
          field: 'start_time',
          align: 'center'
        },
        {
          label: '结束时间',
          field: 'end_time',
          align: 'center'
        },
        {
          label: '商品数量',
          field: 'item_count',
          align: 'center'
        },
        {
          label: '创建时间',
          field: 'created_at',
          align: 'center'
        },
        {
          label: '活动状态',
          field: 'status',
          align: 'center',
          tags: [
            {
              index: 10,
              name: "即将开始",
              type: "danger"
            }, 
            {
              index: 30,
              name: "进行中",
              type: "success"
            },
            {
              index: 40,
              name: "已结束",
              type: "info"
            },{
              index: 50,
              name: "已关闭",
              type: "info"
            }
          ]
        },
        {
            label: '操作',
            align: 'center',
            width: 180,
            actions: [
              {
                label: '查看',
                type: 'text',
                size: 'medium',
                click: (index, row) => {
                  this.$router.push({
                    name: 'exchangeDetail',
                    query: {
                      promotion_id: row.id
                    }
                  })
                }
              }, 
              {
                label: '编辑',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                  return (row.status == 40 || row.status == 50)
                },
                click: (index, row) => {
                  this.$router.push({
                    name: 'editExchange',
                    query: {
                      promotion_id: row.id,
                      activity_status: row.status
                    }
                  })
                }
              }, 
              {
                label: '删除',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                  return (row.status==30 || row.status==40)
                },
                click: (index, row) => {
                  this.$confirm('确定要删除该活动？', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.deleteExchangeBuy({promotion_id:row.id})
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消删除'
                    });
                  });
                }
              }, {
                    label: '关闭',
                    type: 'text',
                    size: 'medium',
                    disable: (row, index) => {
                        return row.status != 30;
                    },
                    click: (index, row) => {
                        this.$confirm('是否关闭当前活动？', '关闭提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                          this.closeCoupon(row.id);
                        }).catch(() => {
                          this.$message({
                              type: 'info',
                              message: '已取消关闭'
                          });
                        });
                    }
                }
            ]
          }
      ]
    }
  },
  methods: {
    //获取秒杀列表
    getExchangeBuyList(params){
      exchange.getExchangeBuyList(params).then((res) => {
        if(res.code == 0){
          this.total = res.data.total_count
          this.list = res.data.data
        }
      })
    },
    //添加秒杀
    addExchange(){
      this.$router.push({name:'addExchange'})
    },
    //删除秒杀
    deleteExchangeBuy(params){
      exchange.deleteExchangeBuy(params).then((res)=>{
        if(res.code == 0){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getExchangeBuyList(this.pageInfo)
        }
      })
    },

    // 关闭活动
      closeCoupon(id) {
        exchange.closeCoupon({
          promotion_id: id
        } ).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '关闭成功!',
              duration: 1000
            });
            this.getExchangeBuyList(this.pageInfo);
          }
        });
      },
    // pageSize变化函数
    sizeChange(val){
      this.pageInfo.page_size = val;
      this.getExchangeBuyList(this.pageInfo);
    },
    // page变化函数
    pageChange(val){
      this.pageInfo.page = val;
      this.getExchangeBuyList(this.pageInfo);
    }
  },
  components: {
    PaginationView,
    TableView
  },
  created(){
    this.getExchangeBuyList(this.pageInfo)
  }
}

</script>

<style lang='scss' scoped>
.seckill{
  margin: 20px
}
</style>
