  <template>
  <div class="detail">
    <div class="content">
      <h3>优惠券信息</h3>
      <el-row>
        <el-col>
          <p>优惠券ID： {{couponDetail.id}}</p>
        </el-col>
        <el-col>
          <p>优惠券名称： {{couponDetail.name}}</p>
        </el-col>
        <el-col>
          <p>门槛金额： ¥{{couponDetail.limit_money}}</p>
        </el-col>
        <el-col>
          <p>优惠金额： ¥{{couponDetail.deduct_money}}</p>
        </el-col>
        <el-col>
          <p>发放数量： {{couponDetail.send_quantity}}</p>
        </el-col>
        <el-col>
          <p>每人每张限领： {{couponDetail.user_obtain_limit}}</p>
        </el-col>
        <el-col>
          <p>是否显示入口： {{couponDetail.is_show==1?"是":"否"}}</p>
        </el-col>
        <el-col>
          <p>适用平台： {{platform}}
          </p>
        </el-col>
        <el-col>
          <p>创建时间： {{couponDetail.extend.created_at}}</p>
        </el-col>
        <el-col>
          <p>领取开始时间： {{couponDetail.obtain_start_time}}</p>
        </el-col>
        <el-col>
          <p>领取结束时间： {{couponDetail.obtain_end_time}}</p>
        </el-col>
        <el-col v-if='is_set_expiry_date == 1'>
            <p>使用有效期: {{couponDetail.extend.expiry_date}}天</p>
        </el-col>
        <el-col v-if='is_set_expiry_date == 0'>
          <p>使用开始时间： {{couponDetail.use_start_time}}</p>
        </el-col>
        <el-col v-if='is_set_expiry_date == 0'>
          <p>使用结束时间： {{couponDetail.use_end_time}}</p>
        </el-col>
      </el-row>
      <el-row>
        <h3>商品信息</h3>
        <el-col>
          <el-button type='primary' @click="selectVisible=true">选择商品</el-button>
          <el-button @click="addItemBomb">批量导入商品</el-button>
          <el-input
            class="item_search"
            placeholder="请输入商品 ID 进行搜索"
            v-model="pageInfo.item_search	"
            clearable>
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchItem">搜索</el-button>
          <el-button type="primary"  @click="resetSearch">重置</el-button>
        </el-col>
        <el-col :span="16" class="mt20">
          <table-view :loading="loading" :columns="columns" :pageList="itemList"></table-view>
          <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-form>
        <el-form-item>
          <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addTicketGoods">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :selectVisible="selectVisible" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>    
    <el-row class="mt40" type="flex" justify="center">
      <el-col :span="2">
        <el-button type="primary" @click="backList">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import ticket from '@/api/activity/ticket'
  import TableView from '@/components/TableView'
  import SelectGoods from '@/components/SelectGoods'  
  import PaginationView from '@/components/PaginationView'

  export default {
    data() {
      return {
        loading: false,
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        itemList: [],
        is_set_expiry_date:'',
        total: 0,
        goodsVisible: false,
        couponInfo: {
          coupon_id: undefined
        },
        pageInfo: {
          page: 1,
          page_size: 20,
          coupon_id: undefined,
          item_search	:null
        },
        couponDetail: {
          extend: {}
        },
        columns: [{
            label: '商品ID',
            field: 'item_id',
            align: 'center'
          },
          {
            label: '商品名称',
            // field: 'title',
            align: 'center',
            isGood: 2
          },
          {
            label: '标准售价(元)',
            field: 'sell_price',
            align: 'center'
          },
          {
            label: '操作',
            align: 'center',
            actions: [{
              label: '关闭',
              type: 'text',
              size: 'mini',
              disable: (row, index) => {
                return (row.status == 0) || (this.couponDetail.status == 2) || (this.couponDetail.status == 3) || (this.couponDetail.status == 1 && this.couponDetail.can_obtain == 0)
              },
              click: (index, row) => {
                this.closeCouponItem(this.couponInfo.coupon_id, row.item_id);
              }
            }]
          }
        ],
      }
    },
    methods: {
      // 获取优惠券详情
      getCouponDetail(params) {
        ticket.getShopcoupon(params).then((res) => {
          this.couponDetail = res.data;
          this.is_set_expiry_date =parseInt(JSON.parse(res.data.extend.arguments).is_set_expiry_date)
        });
      },
      // 获取优惠券适用商品
      getCouponAppliedItems(params) {
        ticket.getCouponAppliedItems(params).then((res) => {
          this.itemList = res.data.list;
          this.total = res.data.total_count;
        });
      },
      // 关闭优惠券商品
      closeCouponItem(coupon_id, id) {
        this.$confirm('确定关闭该商品的活动状态？', '关闭提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ticket.closeCouponItem({
            coupon_id: coupon_id,
            item_ids: id
          }).then((res) => {
            if (res.data) {
              this.$message({
                showClose: true,
                message: "商品关闭成功",
                type: 'success',
                duration: 1000
              });
              this.getCouponAppliedItems(this.pageInfo);
            } else {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 1000
              });
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消关闭商品'
          });
        });

      },
      // 添加优惠券适用商品
      addTicketGoods() {
        ticket.addGoodsById({
          coupon_id: this.couponInfo.coupon_id,
          item_ids: this.goodsIds
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
              message: "添加商品成功",
              type: 'success'
            });
            this.addVisibleid = false
            this.getCouponAppliedItems(this.pageInfo)
          }
        }, (err) => {
          this.$message({
            showClose: true,
            message: err.message,
            type: 'warning'
          });
        });
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 返回列表页
      backList() {
        this.$router.push({
          name: "ticket"
        })
      },
      //搜索item
      searchItem(){
        this.pageInfo.page = 1
        this.getCouponAppliedItems(this.pageInfo);
      },
      resetSearch(){
        this.pageInfo.item_search = ''
        this.pageInfo.page = 1
        this.getCouponAppliedItems(this.pageInfo);
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getCouponAppliedItems(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getCouponAppliedItems(this.pageInfo);
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
        this.goodsIds = val
        this.addTicketGoods()
      }
    },
    components: {
      TableView,
      PaginationView,
      SelectGoods
    },
    computed: {
      platform: function () {
        let platText = ''
        let plat  = this.couponDetail.extend.applicable_platform
        if(plat == undefined){
          return 
        }
        if(plat == 'ALL'){
          platText += '全平台，'
        }
        if(plat.indexOf('PC')!= -1){
          platText += 'PC端，'
        }
        if(plat.indexOf('WX')!= -1){
          platText += '微信端，'
        }
        if(plat.indexOf('APP')!= -1){
          platText += 'APP端，'
        }
        if(plat.indexOf('WAP')!= -1){
          platText += 'WAP端，'
        }
        return platText.slice(0,-1)
      }
    },
    created() {
      this.couponInfo.coupon_id = this.$route.query.id;
      this.pageInfo.coupon_id = this.$route.query.id;
      this.getCouponDetail(this.couponInfo);
      this.getCouponAppliedItems(this.pageInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    padding: 10px 20px;
    .item_search{
        width: 195px;
        margin-left: 10px;
    }
  }

  .mt40 {
    margin-top: 40px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb30 {
    margin-bottom: 30px;
  }

</style>
