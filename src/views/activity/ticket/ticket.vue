<template>
  <div class="tickets">
    <el-row>
      <el-col :span='6'>
        <el-button type="primary" @click="addTicket">添加优惠券</el-button>
      </el-col>
    </el-row>
    <el-tabs>
      <table-view :loading="loading" :columns="columns" :pageList="list">
      </table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
    <el-dialog width="500px" title="请输入用户账号,多用户账号需用换行输入" :visible.sync="reissueVisible">
      <el-form>
        <el-form-item>
          <el-input type="textarea" :rows="6" v-model="userIds" placeholder="请输入用户手机号">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReissue">取 消</el-button>
        <el-button type="primary" @click="reissueCoupon">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import ticket from '@/api/activity/ticket'
  export default {
    data() {
      return {
        loading: false,
        reissueVisible: false,
        coupon_id: undefined,
        userIds: "",
        list: [],
        total: 0,
        pageInfo: {
          page: 1,
          page_size: 20
        },
        columns: [{
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
            label: '门槛金额(元)',
            field: 'limit_money',
            align: 'center'
          },
          {
            label: '优惠金额(元)',
            field: 'deduct_money',
            align: 'center'
          },
          {
            label: '发放数量',
            field: 'send_quantity',
            align: 'center'
          },
          {
            label: '领取数量',
            field: 'extend.user_obtain_quantity',
            align: 'center'
          },
          {
            label: '使用数量',
            field: 'extend.user_used_quantity',
            align: 'center'
          },
          {
            label: '优惠券状态',
            field: 'status',
            align: 'center',
            tags: [{
              index: 1,
              name: "未生效",
              type: "danger"
            }, {
              index: 0,
              name: "生效中",
              type: "success"
            }, {
              index: 2,
              name: "已过期",
              type: "info"
            }, {
              index: 3,
              name: "已作废",
              type: "warning"
            }]
          },
          {
            label: '操作',
            align: 'center',
            width: 350,
            actions: [{
              label: '查看',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return !index == 0;
              },
              click: (index, row) => {
                this.seeCoupon(row.id);
              }
            }, {
              label: '编辑',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return !(row.status == 1 && row.can_obtain == 0);
              },
              click: (index, row) => {
                this.editCoupon(row.id);
              }
            }, {
              label: '作废',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return !((row.status == 1 && row.can_obtain == 1) || row.status == 0);
              },
              click: (index, row) => {
                this.$confirm('优惠券作废后将不可领取及不可使用，确定要作废？', '作废提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.cancelCoupon(row.id);
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消作废'
                  });
                });
              }
            }, {
              label: '补发',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return !((row.status == 1 && row.can_obtain == 1) || row.status == 0);
              },
              click: (index, row) => {
                this.reissueVisible = true;
                this.userIds = "";
                this.coupon_id = row.id;
              }
            }, {
              label: '删除',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return !(row.status == 1 && row.can_obtain == 0);
              },
              click: (index, row) => {
                this.$confirm('优惠券删除后将不可领取及不可使用，确定要删除？', '删除提示', {
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
            }]
          }
        ],
      }
    },
    methods: {
      // 获取优惠券列表
      getTicketList(params) {
        ticket.getShopcouponList(params).then((res) => {
          this.list = res.data.data;
         
          this.list.map((item)=>{
            if(item.limit_money == 0){
              item.limit_money = '/'
            }
          })

          this.total = res.data.total_count;
        });
      },
      // 新增优惠券
      addTicket() {
        this.$router.push({
          name: "addTicket"
        })
      },
      // 查看优惠券
      seeCoupon(id) {
        this.$router.push({
          name: "ticketDetail",
          query: {
            id: id
          }
        })
      },
      // 编辑优惠券
      editCoupon(id) {
        this.$router.push({
          name: "editTicket",
          query: {
            id: id
          }
        })
      },
      // 删除优惠券
      deleteCoupon(id) {
        ticket.deleteCoupon({
          coupon_id: id
        }).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '删除n成功!',
              duration: 1000
            });
            this.getTicketList(this.pageInfo);
          }
        });
      },
      // 作废优惠券
      cancelCoupon(id) {
        ticket.cancelCoupon({
          coupon_id: id
        }).then((res) => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '作废成功!',
              duration: 1000
            });
            this.getTicketList(this.pageInfo);
          }
        });
      },
      // 补发优惠券
      reissueCoupon() {
        ticket.reissueCoupon({
          coupon_id: this.coupon_id,
          telephones: this.userIds
        }).then((res) => {
          if (res.data.fail != 0) {
            let warning = "";
            let message = res.data.message;
            let len = res.data.message.length;
            for (let i = 0; i < len; i++) {
              warning += "<p>" + message[i] + "</p>"
            }
            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: warning,
              type: 'warning'
            });
          } else {
            this.$message({
              showClose: true,
              message: "补发成功",
              type: 'success'
            });
          }
        });
      },
      // 取消补发优惠券
      cancelReissue() {
        this.reissueVisible = false;
        this.userIds = "";
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getTicketList(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getTicketList(this.pageInfo);
      }
    },
    components: {
      TableView,
      PaginationView
    },
    created() {
      this.getTicketList(this.pageInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .tickets {
    padding: 10px;
  }

</style>
