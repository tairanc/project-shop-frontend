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
      <div  class="goods" v-show="goodsList.length">
        <h3>适用商品</h3>
        <div class="table">
          <el-table :data="goodsList" border >
            <el-table-column  align="center" label="商品ID" prop="item_id">
            </el-table-column>
            <el-table-column align="center"  label="商品名称">
              <template slot-scope="scope">
                <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center" label="标准售价（元）" prop="sell_price">
            </el-table-column>
          </el-table>
        </div>
        <pagination-view 
          :currentPage="pageInfo.page" 
          :total="total" 
          :pagesize="20"
          @size-change="sizeChange" 
          @current-change="pageChange">
        </pagination-view>
      </div>
      <el-button  class="back" type="primary" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
  import PaginationView  from '@/components/PaginationView'
  import shopcross from '@/api/activity/shopcross'

  export default {
    data() {
      return {
        total: 0,
        pageInfo: {
          coupon_id: '',
          page: 1,
          page_size: 20
        },
        message: {},
        goodsList: []
      }
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
      // 获取商品列表
      getCouponAppliedItems(params){
        shopcross.getCouponAppliedItems(params).then((res)=>{
          if(res.code == 0){
            this.total = res.data.total_count
            this.goodsList = res.data.list
          }
        })
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
      goBack(){
        this.$router.go(-1)
      }
    },
    components: {
      PaginationView
    },
    created() {
      this.pageInfo.coupon_id = this.$route.query.coupon_id
      this.getShopCrossCoupon({
        coupon_id: this.pageInfo.coupon_id
      })
      this.getCouponAppliedItems(this.pageInfo)
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
    .goods{
      overflow: hidden;
    }
    .back{
      margin-left: 40%
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
