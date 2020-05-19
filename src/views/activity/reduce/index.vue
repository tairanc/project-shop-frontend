<template>
  <div class="reduce">
    <el-row>
      <el-col :span='6'>
        <el-button type="primary" @click="addPlay">
            <span class="el-icon-plus"></span>
            添加{{isfullreduce ? "满折" : "满减"}}活动
        </el-button>
      </el-col>
    </el-row>
    <el-tabs>
      <table-view :loading="loading" :columns="columns" :pageList="list"></table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
  </div>
</template>

<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import reduce from '@/api/activity/reduce'

export default {
    data () {
        return {
            isfullreduce : true , // 满折 reducebreak 还是 满减 reducefull
            
            loading: false,
            coupon_id: undefined,
            list: [],
            total: 0,
            pageInfo: {
                page: 1,
                page_size: 20
            },
            columns: [{
                label: '活动ID',
                field: 'id',
                align: 'center'
            },{
                label: '活动名称',
                field: 'name',
                align: 'center'
            },
            {
                label: '活动规则',
                field: 'ruleStr',
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
                field: 'itemCount',
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
                tags: [{
                    index: 10,
                    name: "即将开始",
                    type: "danger"
                    },{
                    index: 30,
                    name: "进行中",
                    type: "success"
                    }, {
                    index: 40,
                    name: "已结束",
                    type: "warning"
                    },{
                    index: 50,
                    name: "已关闭",
                    type: "info"
                  }]
            },
            {
                label: '操作',
                align: 'center',
                width: 180,
                actions: [{
                label: '查看',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                    return !index == 0;
                },
                click: (index, row) => {
                    this.getDetail(row);
                }
                }, {
                    label: '编辑',
                    type: 'text',
                    size: 'medium',
                    disable: (row, index) => {
                        return (row.status == 30 || row.status == 40 || row.status == 50 );
                    },
                    click: (index, row) => {
                        this.editCoupon(row.id);
                    }
                }, {
                    label: '删除',
                    type: 'text',
                    size: 'medium',
                    disable: (row, index) => {
                        return (row.status == 30 || row.status == 40 || row.status == 50);
                    },
                    click: (index, row) => {
                        this.$confirm('删除后将不可领取及不可使用，确定要删除？', '删除提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                        this.deleteCoupon(row.id);
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
                        return row.status !=30;
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
                }]
            }
            ],
        }
    },
    components: {
      TableView,
      PaginationView
    },
    methods: {
        // 获取列表
      getDatalist(params) {
        reduce.getShopList(params , this.isfullreduce ).then((res) => {
          this.list = res.data.data;
          this.list.map((item)=>{
            if(item.limit_money == 0){
              item.limit_money = '/'
            }
          })
          this.total = res.data.total_count;
        });
      },
      // 新增活动
      addPlay() {
        let _name = this.isfullreduce ? 'addBreakReduce' : 'addFullReduce'
        this.$router.push({
          name: _name,
        })
      },
      // 查看
      getDetail(row) {
        let _name = this.isfullreduce ? 'reduceBreakDetail' : 'reduceFullDetail'
        this.$router.push({
          name: _name,
          query: {
            id: row.id,
            status: row.status
          }
        })
      },
      // 编辑优惠券
      editCoupon(id) {
        let _name = this.isfullreduce ? 'editBreakReduce' : 'editFullReduce'
        this.$router.push({
          name: _name,
          query: {
            id: id
          }
        })
      },
      // 删除活动
      deleteCoupon(id) {
        reduce.deleteCoupon({
          promotion_id: id
        }, this.isfullreduce).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1000
            });
            this.getDatalist(this.pageInfo);
          }
        });
      },
      // 关闭活动
      closeCoupon(id) {
        reduce.closeCoupon({
          promotion_id: id
        } , this.isfullreduce).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '关闭成功!',
              duration: 1000
            });
            this.getDatalist(this.pageInfo);
          }
        });
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getDatalist(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getDatalist(this.pageInfo);
      }
    },
    created(){
        let that = this
        that.isfullreduce = that.$route.name === "reducebreak" ?  true : false
        this.getDatalist(this.pageInfo);
    },
    watch : {
        '$route' (to , from) {
            let that = this
            that.isfullreduce = to.name === "reducebreak" ?  true : false
            that.pageInfo.page = 1
            that.getDatalist(that.pageInfo)
        } 
    }
}
</script>

<style lang='scss' scoped>
  .reduce {
    padding: 10px;
  }

</style>


