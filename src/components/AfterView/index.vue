<template>
 
<div
  :tableName="tableName" class='afterView'>
  <table  width='100%' style="border-collapse:collapse"  border="1" cellspacing="0" cellpadding="0" class='afterView'>
    <tr class='afterView_title'>
      <td>售后申请单号</td>
      <td>店铺订单号</td>
      <td>商品</td>
      <td>退款金额</td>
      <td>售后类型</td>
      <td>处理进度</td>
      <td>申请时间</td>
      <td>操作</td>
    </tr>
    
    <tr class='order-list' v-for="(item,index) in pageList" :key="index">
     <td class='tc'>
         <span >{{item.bn}}</span>
     </td>
     <td class='shop-number tc'>
         <span>{{item.order_shop_no}}</span>
     </td>
    <td class='shop-box'>
     <div class='shop-content' v-for="(good,index) in item.items" :key='"o"+index' style="overflow: hidden; position:relative">
         <div class="good" style="width:100%;">
            <img :src='good.primary_image+"_t.jpg"'/>
            <div style="float:left;width:62%"> 
              <a target="_blank" :href="defaultUrl('item_id',good)" class='goods_url'><p>
                <span v-if='good.label !="normal"' style="color:red">【{{good.label}}】</span>
                {{good.title}}</p></a>
                <p>{{good.spec_info}}</p>
            </div>
         </div>
         <div style="position:absolute;right:5px;bottom:5px">×{{good.num}}</div>
    </div>
    </td>
    <td class='tc'>
      {{item.price[0]}}
    </td>
    <td class='tc'>{{item.type}}</td>
    <td class='tc'>{{item.status}}</td>
    <td class='tc'>{{item.created_at}}</td>
    <td class='tc'><a target="_blank" :href="'/goods-deal/trade/salesInfo?bn='+item.bn">查看详情</a></td>
   </tr>
  </table>
</div>
  
</template>
<script>
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
    imageDomain:{
      type:String,
      default:''
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
          name: "salesInfo",
          query: {
            bn: id
          }
        })
    }
}
}
</script>
<style lang='scss' scoped>
ul,li{
   padding:0;
   margin:0;
   list-style:none
   }
ul{
  overflow: hidden;
}
.order-title li{
  float: left;
}
 .afterView_title td{
  border-bottom: 1px solid #ebeef5;
  text-align: center;
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
}
.order-title{
  background: #f5f7fa;
}
.order-title li{
  line-height: 40px;
  box-sizing: inherit;
  height: 40px;
  font-size: 14px;
  margin-left: 20px
}
.order-content{
  width: 100%;
  overflow: hidden;
}

.order-all-price,.order-url{
}
.order-information img{
  width: 100px;
  height: 100px;
}
.deal-status{
  
  width: 10%;
}
.order-img{
  overflow: hidden;
  width: 50%;
  display: inline-block
}
.order-img img{
  float: left;
}
.order-img .p{
  float: left;
}
.order-number,.order-price{
  float: right;
}
.order-price{
  margin-right: 10%
}
.order-number{
  margin-right: 10%
}
.order-information{
  overflow: hidden;
}
.shop-box .shop-content{
    border-bottom:1px solid #ddd;
}
.good-price,.good{
     float: left;
}
.good img{
    float:left;
}
.order-list{
    overflow: hidden;
    font-size: 14px;
}
.order-list img{
    width: 100px;
    height: 100px;
}
.good-price{
    float: right;
}
.order-list {
    overflow: hidden;
    font-size: 14px;
}
.good p{
  margin-top:0
}
.good{
  padding: 5px;

}
.shop-box .shop-content:last-child{
  border-bottom: none
}
.tc{
  text-align: center
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
    
.afterView td,.afterView tr{ border:1px solid #ddd; }

</style>
