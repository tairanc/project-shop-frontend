<template>
  <div class="exemptlist">
    <el-row>
      <el-col :span='6'>
        <el-button type="primary" @click="addTicket">添加优惠券</el-button>
      </el-col>
    </el-row>
    <el-tabs>
      <table-view :loading="loading" :columns="columns" :pageList="list"></table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
    <el-dialog width="500px" title="请输入用户账号,多用户账号需换行输入" :visible.sync="reissueVisible">
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

    <el-dialog width="500px" :visible.sync="exportnumber">
      <el-form>
        <el-form-item >
            <el-row>
                <el-col :span="8"><span>请输入想导出的数量：</span></el-col>
                <el-col :span="12"><el-input v-model="exportNum" type="number" :placeholder="'可导出数量'+selectItem.user_can_get"></el-input></el-col>
            </el-row>
        </el-form-item>
        <span>注：导出后的兑换码不会再被导出，请慎用。</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelExport">取 消</el-button>
        <el-button type="primary" @click="sureExport">确 定</el-button>
      </div>
    </el-dialog>
    <div class="exportHideform">
      <!-- <table-view id="exportformtable" :loading="loading" :columns="columns" :pageList="exportform"></table-view> -->
      <el-table
        :data="exportform"
        id="exportformtable">
        <el-table-column type="index">
          <template slot-scope="scope">
            <span>{{scope.row[0]}}</span>
          </template>
        </el-table-column>
        <el-table-column type="index">
          <template slot-scope="scope">
            <span>{{scope.row[1]}}</span>
          </template>
        </el-table-column>
        <el-table-column type="index">
          <template slot-scope="scope">
            <span>{{scope.row[2]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>


  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import exempt from '@/api/activity/exempt'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    data() {
      return {
        exportform: [],  //导出兑换码的数据
        loading: false,
        reissueVisible: false,
        exportnumber: false,
        exportNum: '',
        selectItem : {user_can_get : 0},
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
            align: 'center',
            width: 80
          },
          {
            label: '优惠券名称',
            field: 'name',
            align: 'center'
          },
          {
            label: '发放数量',
            field: 'send_quantity',
            align: 'center',
            width: 80
          },
          {
            label: '领取数量',
            field: 'user_obtain_quantity',
            align: 'center',
            width: 80
          },
          {
            label: '使用数量',
            field: 'user_used_quantity',
            align: 'center',
            width: 80
          },
          {
            label: '免单券状态',
            field: 'status',
            align: 'center',
            tags: [{
              index: 0,
              name: "生效中",
              type: "success"
            },{
              index: 1,
              name: "未生效",
              type: "danger"
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
            label: '领取时间',
            obtaintime: true,
            align: 'center'
          },
          {
            label: '有效期',
            field: 'expiry_date',
            align: 'center',
            width: 80
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
                return (row.status == 0 || row.status == 2 || row.status == 3);
                // return (row.status == 0);
              },
              click: (index, row) => {
                this.editCoupon(row.id);
              }
            }, {
              label: '作废',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                return (row.status == 1 || row.status == 2 || row.status == 3);
              },
              click: (index, row) => {
                this.$confirm('作废后，用户将无法查看该卡券包，确认作废？', '作废提示', {
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
                return (row.status == 1 || row.status == 2 || row.status == 3);
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
                return (row.status == 0 || row.status == 2 || row.status == 3);
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
            },{
              label: '导出兑换码',
              type: 'text',
              size: 'medium',
              disable: (row, index) => {
                // 未过期 未作废 且能导出数量大于0
                return (row.status == 2 || row.status == 3 ||  row.user_can_get < 1) ;
              },
              click: (index, row) => {
                this.exportnumber = true;
                this.coupon_id = row.id;
                this.selectItem = row;
              }
            },]
          }
        ],
      }
    },
    methods: {
      // 获取列表
      getTicketList(params) {
        exempt.getShopcouponList(params).then((res) => {
          this.list = res.data.data;
          this.total = res.data.total_count;
        });
      },
      // 新增优惠券
      addTicket() {
        this.$router.push({
          name: "addexempt"
        })
      },
      // 查看优惠券
      seeCoupon(id) {
        this.$router.push({
          name: "checkexempt",
          query: {
            id: id
          }
        })
      },
      // 编辑优惠券
      editCoupon(id) {
        this.$router.push({
          name: "editexempt",
          query: {
            id: id
          }
        })
      },
      // 删除优惠券
      deleteCoupon(id) {
        exempt.deleteCoupon({
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
      // 作废免单券
      cancelCoupon(id) {
        exempt.cancelCoupon({
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
        exempt.reissueCoupon({
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
        //取消导出
      cancelExport(){
          this.exportnumber = false;
          this.selectItem = {user_can_get : 0}
      },
        // 确定导出 
      sureExport(){
        let type="^[0-9]*[1-9][0-9]*$"; 
        let r=new RegExp(type); 
        let _flag = r.test(this.exportNum)
        if (!_flag || this.exportNum > this.selectItem.user_can_get || this.exportNum < 0) {
            this.$message({
                type: 'info',
                message: '请输入有效数字'
            });
            return
        }
        exempt.exportCode({
          coupon_id: this.coupon_id,
          num: this.exportNum
        }).then((res) => {
          if (res.code != 0) {
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
            this.exportform = res.data
            let _newnum = this.selectItem.user_can_get - this.exportNum
              this.$set(this.selectItem, 'user_can_get' , _newnum)
              this.$message({
                showClose: true,
                message: "导出成功",
                type: 'success'
              });
            this.exportnumber = false;
            setTimeout(function(){
              /* generate workbook object from table */
              let wb = XLSX.utils.table_to_book(document.querySelector('#exportformtable'));
            //   /* get binary string as output */
              let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
              try {
                  FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '兑换码列表.xlsx');
              } catch (e){
                  if (typeof console !== 'undefined')
                      console.log(e, wbout)
              }
              return wbout
            },1000)
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
  .exemptlist {
    padding: 10px;
    .exportHideform{
      // opacity: 0;
      display: none;
    }
  }

</style>
