<template>
  <div class="seckill">
    <p>
      <el-button type="primary" icon="el-icon-plus" @click='addSeckill'>添加秒杀活动</el-button>
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
import seckill from '@/api/activity/seckill'

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
          label: '活动发布时间',
          field: 'release_time',
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
          label: '商品数量',
          field: 'item_count',
          align: 'center'
        },
        {
          label: '创建时间',
          field: 'end_time',
          align: 'center'
        },
        {
          label: '状态',
          field: 'activity_status',
          align: 'center',
          tags: [
            {
              index: 10,
              name: "即将开始",
              type: "danger"
            }, 
            {
              index: 20,
              name: "已发布",
              type: "success"
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
            }, 
            {
              index: 50,
              name: "已关闭",
              type: "warning"
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
                    name: 'seckillDetail',
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
                  return (row.activity_status==20  || row.activity_status==40 || row.activity_status == 50)
                },
                click: (index, row) => {
                  this.$router.push({
                    name: 'editSeckill',
                    query: {
                      promotion_id: row.id,
                      activity_status: row.activity_status
                    }
                  })
                }
              }, 
              {
                label: '删除',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                  return (row.activity_status==20 || row.activity_status==30 || row.activity_status==40 || row.activity_status == 50)
                },
                click: (index, row) => {
                  this.$confirm('确定要删除该秒杀活动？', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.deleteSeckill({promotion_id:row.id})
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
                        return row.activity_status !=30;
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
    getSeckillList(params){
      seckill.getSeckillList(params).then((res) => {
        if(res.code == 0){
          this.total = res.data.total_count
          this.list = res.data.data
        }
      })
    },
    //添加秒杀
    addSeckill(){
      this.$router.push({name:'addSeckill'})
    },
    //删除秒杀
    deleteSeckill(params){
      seckill.deleteSeckill(params).then((res)=>{
        if(res.code == 0){
          this.$message({
            type: 'success',
            message: '删除成功'
          });
          this.getSeckillList(this.pageInfo)
        }
      })
    },
    // 关闭活动
      closeCoupon(id) {
        seckill.closeCoupon({
          promotion_id: id
        }).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '关闭成功!',
              duration: 1000
            });
            this.getSeckillList(this.pageInfo);
          }
        });
      },
    // pageSize变化函数
    sizeChange(val){
      this.pageInfo.page_size = val;
      this.getSeckillList(this.pageInfo);
    },
    // page变化函数
    pageChange(val){
      this.pageInfo.page = val;
      this.getSeckillList(this.pageInfo);
    }
  },
  components: {
    PaginationView,
    TableView
  },
  created(){
    this.getSeckillList(this.pageInfo)
  }
}

</script>

<style lang='scss' scoped>
.seckill{
  margin: 20px
}
</style>
