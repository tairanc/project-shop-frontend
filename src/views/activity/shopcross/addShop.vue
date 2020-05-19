<template>
  <div class="detail">
    <div class="content">
      <span v-show="message.refuse_reason" class="reason">审核驳回原因： {{message.refuse_reason}}</span>
      <h3>优惠券信息</h3>
      <el-row>
        <el-col>
          <p>优惠券ID： {{message.id}}</p>
        </el-col>
        <el-col>
          <p>优惠券名称： {{message.name}}</p>
        </el-col>
        <el-col>
          <p>优惠券兑换码： {{message.exchangeCode}}</p>
        </el-col>
        <el-col>
          <p>门槛金额： {{message.limit_money}}元</p>
        </el-col>
        <el-col>
          <p>优惠金额： {{message.deduct_money}}元</p>
        </el-col>
        <el-col>
          <p>商家费用承担： {{message.undertake_percent}}</p>
        </el-col>
        <el-col>
          <p>发放数量： {{message.send_quantity}}张</p>
        </el-col>
        <el-col>
          <p>每人每张限领： {{message.user_obtain_limit}}张</p>
        </el-col>
        <el-col>
          <p>是否显示入口： {{message.is_show?'是':'否'}}</p>
        </el-col>
        <el-col>
          <p>适用平台： {{message.applicable_platform}}</p>
        </el-col>
        <el-col>
          <p>适用店铺： {{message.applicable_shop_type}}</p>
        </el-col>
        <el-col>
          <p>适用分类： {{message.applicable_category}}</p>
        </el-col>
        <el-col>
          <p>适用品牌： {{message.applicable_brand}}</p>
        </el-col>
        <el-col>
          <p>创建时间： {{message.created_at}}</p>
        </el-col>
        <el-col>
          <p>报名开始时间： {{message.apply_start_time}}</p>
        </el-col>
        <el-col>
          <p>报名结束时间： {{message.apply_end_time}}</p>
        </el-col>
        <el-col>
          <p>发布时间： {{message.release_time}}</p>
        </el-col>
        <el-col>
          <p>领取开始时间： {{message.obtain_start_time}}</p>
        </el-col>
        <el-col>
          <p>领取结束时间： {{message.obtain_end_time}}</p>
        </el-col>
        <el-col>
          <p>使用开始时间： {{message.use_start_time}}</p>
        </el-col>
        <el-col>
          <p>使用结束时间： {{message.use_end_time}}</p>
        </el-col>
        <el-col>
          <div class="shopdetail-tag">
            <div class="shopdetail-tag-title">活动标签展示：</div>
            <div class="tag-content" v-if="message.tag_list && message.tag_list.length > 0">
              <div class="img-list" v-for="(item, index) in message.tag_list" :key="index">
                <img :src="item.mb_square_img" alt="" class="img">
                <span>{{item.show_start_time}}</span>
                <span class="margin10">-</span>
                <span>{{item.show_end_time}}</span>
              </div>
            </div> 
            <div class="tag-withno" v-else>无</div>
          </div>
        </el-col>
      </el-row>
      <div>
        <h3>适用商品</h3>
        <p>
          <el-button type="primary" @click="selectVisible=true">选择商品</el-button>
          <el-button @click="addItemBomb">批量导入商品</el-button>
        </p>
        <div class="table">
          <el-table :data="goodsList" border >
            <el-table-column  align="center" label="商品ID" prop="id">
            </el-table-column>
            <el-table-column align="center"  label="商品名称">
              <template slot-scope="scope">
                <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标准售价（元）" prop="sell_price">
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-row>
        <el-col :offset="10">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods  :selectVisible="selectVisible" :selectList="selectList" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>
  </div>
</template>
<script>
  import SelectGoods from '@/components/SelectGoods'
  import ticket from '@/api/activity/ticket'
  import shopcross from '@/api/activity/shopcross'

  export default {
    data() {
      return {
        coupon_id: '',
        message: {},
        addVisibleid: false,
        goodsIds: "",
        selectVisible: false,
        goodsList: []
      }
    },
    computed: {
      selectList(){
        let list = []
        this.goodsList.length && this.goodsList.map((item)=> {
          list.push(item.id)
        })
        return list
      },
    },
    methods: {
      //获取特卖信息
      getShopCrossCoupon(params){
        shopcross.getShopCrossCoupon(params).then((res)=>{
          if(res.code == 0){
            this.message = res.data
          }
        })
      },
      //获取特卖的商品
      getCouponAppliedItems(params){
        shopcross.getCouponAppliedItems(params).then((res)=>{
          if(res.code == 0){
            this.goodsList = res.data.list
          }
        })
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      //添加优惠券适用商品
      addGoodsById() {;
        if (this.goodsIds) {
          ticket.importItemsById({
            item_id: this.goodsIds
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              this.goodsFilter(result.itemList);
            }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: 'warning'
              });
            }
          })
        }
        this.goodsIds = "";
        this.addVisibleid = false;
      },
      // 添加过滤已经存在的商品
      goodsFilter(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsList.length != 0) {
            for (let j = 0; j < this.goodsList.length; j++) {
              (items[i].id == this.goodsList[j].id) && (flag = true)
            }
          }
          if(!flag) {
            this.goodsList.push(items[i])
          }
        }

        let list = []
        items.map((item) => {
          list.push(item.id)
        })

        for(let n = 0; n < this.goodsList.length;n++){
          if(list.indexOf(this.goodsList[n].id) == -1){
            this.goodsList.splice(n,1)
            n --
          }
        }
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //删除商品
      handleDelete(row){
        this.goodsList =this.goodsList.filter((item)=>{
          return item.id != row.id
        })
      },
      //选择商品添加
      handleAdd(val){
         ticket.importItemsById({
            item_id: val
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              this.goodsFilter(result.itemList)
            }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: 'warning'
              });
            }
          })
      },
      //提交
      handleSubmit(){
        let items = []
        this.goodsList.map((item)=>{
          items.push({
            item_id: item.id
          })
        })
        shopcross.apply({
          coupon_id: this.coupon_id,
          items: JSON.stringify(items)
        }).then((res)=>{
          if(res.code==0){
            this.$message({
              showClose: true,
              message: '报名成功',
              type: 'success'
            })
            this.$router.push({name: 'shoplist'})
          }
        })
      },
      goBack(){
        this.$router.go(-1)
      }
    },
    components: {
      SelectGoods
    },
    created() {
      this.coupon_id = this.$route.query.coupon_id
      this.getShopCrossCoupon({
        coupon_id: this.coupon_id
      })
      this.getCouponAppliedItems({
        coupon_id: this.coupon_id,
        page: 1,
        page_size: -1
      })
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    padding: 10px 20px;
    .reason{
      display: inline-block;
      padding: 8px 0;
      background: #f3f3f3;
    }
    .pic{
      display: inline-block;
      img{
        vertical-align: top
      }
    }
    .table{
      width: 85%;
      .goods_url{
        cursor: pointer;
        &:hover{
          color: #409EFF
        }
      }
    }
    .el-pagination{
      margin-right: 15%
    }
    .shopdetail-tag{
      display: flex;
      flex-direction: row;
      .shopdetail-tag-title{
        width: 120px;
      }
      .tag-content{
        display: flex;
        flex-direction: column;
        .img-list{
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
          .img{
              width: 68px;
              height: 68px;
              border: 1px solid #d8d8d8;
              margin-right: 20px;
              border-radius: 4px;
          }
          .margin10{
            margin: 0 10px;
          }
        }
      }
    }
  }
</style>
