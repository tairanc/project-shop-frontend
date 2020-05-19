<template>
  <div class="direct">
    <p>
      <el-button type="primary" @click="addDirect">添加活动</el-button>
    </p>
    <el-tabs>
      <table-view :columns="columns" :pageList="list">
      </table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import direct from '@/api/activity/direct'

  export default {
    data() {
      return {
        list: [],
        total: 0,
        pageInfo: {
          page: 1,
          page_size: 20
        },
        columns: [
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
                type: "warning"
              },
              {
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
                  this.seeDirect(row.id);
                }
              }, 
              {
                label: '编辑',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                  return row.status == 40 || row.status == 50
                },
                click: (index, row) => {
                  this.editDirect(row.id,row.status);
                }
              },  
              {
                label: '删除',
                type: 'text',
                size: 'medium',
                disable: (row, index) => {
                  return row.status == 30 || row.status == 40 || row.status == 50
                },
                click: (index, row) => {
                  this.$confirm('是否确定要删除？', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.deleteDirectReduction(row.id);
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
                }
            ]
          }
        ]
      }
    },
    methods: {
      // 获取直降列表
      getDirectReductionList(params) {
        direct.getDirectReductionList(params).then((res) => {
          if(res.code == 0){
            this.list = res.data.data
            this.total = res.data.total_count
          }
        })
      },
      // 新增直降
      addDirect() {
        this.$router.push({
          name: "addDirect"
        })
      },
      // 查看直降详情
      seeDirect(id) {
        this.$router.push({
          name: "directDetail",
          query: {
            id: id
          }
        })
      },
      // 编辑直降
      editDirect(id,activity_status) {
        this.$router.push({
          name: "editDirect",
          query: {
            id: id,
            activity_status: activity_status
          }
        })
      },
      // 删除直降
      deleteDirectReduction(id) {
        direct.deleteDirectReduction({
          promotion_id: id
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: 1000
            });
            this.getDirectReductionList(this.pageInfo);
          }
        });
      },
      // 关闭活动
      closeCoupon(id) {
        direct.closeCoupon({
          promotion_id: id
        } ).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '关闭成功!',
              duration: 1000
            });
            this.getDirectReductionList(this.pageInfo);
          }
        });
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getDirectReductionList(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getDirectReductionList(this.pageInfo);
      }
    },
    components: {
      TableView,
      PaginationView
    },
    created() {
      this.getDirectReductionList(this.pageInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .direct {
    padding: 10px;
  }

</style>
