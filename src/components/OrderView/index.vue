<template>

<el-tabs
  :tableName="tableName">
  <div style="width:100%;border-left: 1px solid #ddd;border-top: 1px solid #ddd;border-right: 1px solid #ddd;">
    <table width='100%' style="border-collapse:collapse" >
    <tr class='title'>
      <td class="shop_info">
        <div style="width:60%">商品信息</div>
        <div style="width:20%">单价（元）</div>
        <div style="width:20%">数量</div>
        </td>
      <!-- <td style="width:7%">单价（元）</td>
      <td style="width:6%">数量</td> -->
      <td>实收款</td>
      <td>会员信息</td>
      <td>交易状态</td>
      <td >订单操作</td>
    </tr>
   <tbody v-for="(item,index) in pageList" :key="index" class='order-lists'>
     <tr class='order-title'>
          <!-- <span>订单类型：普通订单</span> -->
          <td>店铺订单号:{{item.no}}</td>
          <td>平台订单号:{{item.order_no}} </td>
          <td>下单时间:{{item.created_at}}</td>
          <td>订单状态:{{item.status}}</td>
          <td><a @click="openNOte(item.no,item.shop_memo)" class="goods_url">
            <i class='img_icon'>
              <img src="../../assets/order_icon.png"/>
            </i>
          </a></td>
      </tr>
      <tr class="order-content">
        <td class='order-one' width=40%>
          <div class='order-information' v-for="(good,index) in item.order_goods" :key='index'>
            <div class='order-img'>
              <img :src=' good.primary_image +"_t.jpg"' />
              <div class='p'>

                <a :href="defaultUrl('item_id',good)" class='goods_url' target="_blank">
                <p><span style="color:red" v-if="good.promotions">【<span v-for="(promotions,index) in good.promotions" :key='index'>
                    {{promotions.promotion_type}}
                  </span>】
                </span>{{good.title}}</p></a>
                <p>{{good.spec_nature_info}}</p>
                <!-- <p style="color:red" v-if="good.promotions">【<span v-for="(promotions,index) in good.promotions" :key='index'>
                    {{promotions}}
                  </span>】</p> -->
              </div>
            </div>

            <div class='order-number'>
              {{good.num}}
            </div>
           <div class='order-price'>
                ¥{{good.price}}
            </div>

            <div class='order-shop-status' width=20%>
              <p v-if="showChain">供应商：{{good.supplier_name}}</p>
              <p>售后状态：
                <span v-if='good.after_sales_status'>{{good.after_sales_status}}</span>
                <span v-else>无</span></p>
              <p v-if="showChain">供应链推送状态：{{good.push_status}}</p>
            </div>
          </div>
        </td>

        <td class=order-all-price width=20%>
          <p>应付：¥{{item.payment}}</p>
          <p>运费:¥{{item.post_fee}}</p>
          <p>税费:¥{{item.tax_fee}}</p>
          <p>促销优惠:¥{{item.discount_summary.promotion}}</p>
          <p v-if="item.discount_summary.vip > 0">会员折扣:¥{{item.discount_summary.vip}}</p>
          <p>优惠劵:¥{{item.discount_summary.coupon}}</p>
          <p>红包:¥{{item.discount_summary.hb}}</p>
        </td>

        <td class=order-url width=20%>
          <p>会员用户名：{{item.user_account}}</p>
          <p>收货人姓名：{{item.order.receiver.address.name}}</p>
          <p>收货人手机号：{{item.order.receiver.address.mobile}}</p>
          <p style="width:85%">收货人地址：
           {{item.order.receiver.address.state}}
           {{item.order.receiver.address.city}}
           {{item.order.receiver.address.district}}
           {{item.order.receiver.address.address}}
          </p>
          <p v-if="item.buyer_message || item.shop_memo">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              >
              <div>
                <p>用户备注：{{item.buyer_message}}</p>
                <p>商家备注：{{item.shop_memo}}</p>
              </div>
              <i class='el-icon-tickets' style="color:#409EFF;" slot="reference"></i>
            </el-popover>
          </p>
        </td>
        <td class='deal-status' width=10%>
            <p>{{item.status}}</p>
            <a :href="'/goods-deal/trade/orderInfo?shop_order_no='+item.no" style="color:#409EFF;" target="_blank">订单详情</a>
        </td>
        <td class='deal-status' width=10%>
           <p> <a @click="shipments(item.no)" v-if="item.status =='等待发货'"><el-button type="primary">发货</el-button></a></p>
           <p> <a @click="shipments(item.no)" v-if="item.status =='等待买家收货' && item.consign_status!=20"><el-button type="primary">修改发货</el-button></a></p>
           <p> <a @click="shipments(item.no)" v-if="item.consign_status==20"><el-button type="primary">发货</el-button></a></p>
        </td>
      </tr>
   </tbody>
  </table>
  <el-dialog
  title="商家备注"
  :visible.sync="dialogNote"
  width="40%">
  <el-input type="textarea" v-model="data.shop_memo" :autosize="{ minRows: 4, maxRows: 5}" maxlength="100"></el-input>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogNote = false">取 消</el-button>
    <el-button type="primary" @click="submitMemo">确 定</el-button>
  </span>
</el-dialog>
   </div>
  </el-tabs>


</template>
<script>
import axios from '@/api/interception'
import { NORMAL,XTFQ} from '@/utils/url'
export default {
  props: {
    tableName: {
      type: String,
      default: ''
    },
     pageList: {
      type: Array,
      default: []
    },
    showChain:{
      type:Boolean,
      default:''
    }
    },
    data(){
      return{
        dialogNote:false,
        data:{
          shop_order_no:'',
          shop_memo:''
        }
      }
    },
    methods: {
      handleSelectionChange (val) {
        this.$emit('select-change', val, this.tableName)
      },
      indexFn (index) {
        return (this.indexMethod && this.indexMethod(index)) || (index + 1)
      },
      openInfo(id){
          this.$router.push({
            name: "orderInfo",
            query: {
              shop_order_no: id
            }
          })
      },
      openNOte(no,shop_memo){
        this.dialogNote=true
        this.data.shop_order_no =no
        this.data.shop_memo=shop_memo
      },
      submitMemo(){
        axios({
          method: 'post', url: '/trmall/order/add_shop_memo', data: this.data
        }).then((res)=>{
            this.dialogNote=false
            location.reload()
        })
      },
      shipments(id){
          this.$router.push({
            name: "shipments",
            query: {
              shop_order_no: id
            }
          })
      }
    }
}
</script>
<style>
ul,li{
   padding:0;
   margin:0;
   list-style:none
   }
ul{
  overflow: hidden;
}
.title td{
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
  white-space: nowrap;
  overflow: hidden;
  user-select: none;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  color: #909399;
  border-collapse: separate;
  font-size: 14px;
  line-height: 40px;
  box-sizing: inherit;
  height: 40px;
   text-align: center
}
.order-title{
  background: #f5f7fa;
  margin-top:5px;
  width: 100%;
}
.order-lists{
  font-size: 14px
}
.order-title td{
  line-height: 20px;
  box-sizing: inherit;
  height: 40px;
  font-size: 14px;
  text-align: center
}
.order-content{
  width: auto;
  overflow: hidden;
}
.order-one{
  vertical-align: top;
  height: auto;
}
.order-all-price,.order-url{
  width:20%;
  padding: 8px;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.order-information img{
  width: 100px;
  height: 100px;
}
.deal-status{
  width: 10%;
  text-align: center;
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.order-one{
  border-top: 1px solid #ddd;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.order-information{
  padding: 5px;
  border-bottom: 1px solid #ddd;
  width: 100%
}
.order-one .order-information:last-child{
  border-bottom:none;
}
.order-img{
  overflow: hidden;
  width: 70%;
  display: inline-block
}
.order-img img{
  float: left;
}
.order-img .p{
  float: left;
  width: 54%;
  vertical-align: top;
  margin-left: 5px;
}
.order-price{
  position: absolute;
  right: 20%;
  top:50px
}
.order-number{
  position: absolute;
  right: 6%;
  top:50px
}
.order-information{
  overflow: hidden;
  position: relative;
}
.numPrice{
  position: absolute;
  right: 20px;
  top:50px
}
.order-content td:last-child{
  border-right: none
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
.title .shop_info div{
  display: inline-block
}
.img_icon img{
 text-align: center;
  width: 20px;
  height: 20px;
}
</style>

