webpackJsonp([44],{"6IV7":function(t,e){},CibV:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=n("VXZc"),a=n("1G+u"),s=n("5P40"),o={data:function(){var t=this;return{list:[],total:0,pageInfo:{page:1,page_size:20},columns:[{label:"活动ID",field:"id",align:"center"},{label:"活动名称",field:"name",align:"center"},{label:"开始时间",field:"start_time",align:"center"},{label:"结束时间",field:"end_time",align:"center"},{label:"商品数量",field:"item_count",align:"center"},{label:"创建时间",field:"created_at",align:"center"},{label:"活动状态",field:"status",align:"center",tags:[{index:10,name:"即将开始",type:"danger"},{index:30,name:"进行中",type:"success"},{index:40,name:"已结束",type:"info"},{index:50,name:"已关闭",type:"info"}]},{label:"操作",align:"center",width:180,actions:[{label:"查看",type:"text",size:"medium",click:function(e,n){t.$router.push({name:"giftbuyDetail",query:{promotion_id:n.id}})}},{label:"编辑",type:"text",size:"medium",disable:function(t,e){return 40==t.status||50==t.status},click:function(e,n){t.$router.push({name:"editGiftbuy",query:{promotion_id:n.id,activity_status:n.status}})}},{label:"删除",type:"text",size:"medium",disable:function(t,e){return 30==t.status||40==t.status},click:function(e,n){t.$confirm("确定要删除该买赠活动？","删除提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.deleteGiftBuy({promotion_id:n.id})}).catch(function(){t.$message({type:"info",message:"已取消删除"})})}},{label:"关闭",type:"text",size:"medium",disable:function(t,e){return 30!=t.status},click:function(e,n){t.$confirm("是否关闭当前活动？","关闭提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){t.closeCoupon(n.id)}).catch(function(){t.$message({type:"info",message:"已取消关闭"})})}}]}]}},methods:{getGiftBuyList:function(t){var e=this;s.a.getGiftBuyList(t).then(function(t){0==t.code&&(e.total=t.data.total_count,e.list=t.data.data)})},addGiftbuy:function(){this.$router.push({name:"addGiftbuy"})},deleteGiftBuy:function(t){var e=this;s.a.deleteGiftBuy(t).then(function(t){0==t.code&&(e.$message({type:"success",message:"删除成功"}),e.getGiftBuyList(e.pageInfo))})},closeCoupon:function(t){var e=this;s.a.closeCoupon({promotion_id:t}).then(function(t){t.data&&(e.$message({type:"success",message:"关闭成功!",duration:1e3}),e.getGiftBuyList(e.pageInfo))})},sizeChange:function(t){this.pageInfo.page_size=t,this.getGiftBuyList(this.pageInfo)},pageChange:function(t){this.pageInfo.page=t,this.getGiftBuyList(this.pageInfo)}},components:{PaginationView:i.a,TableView:a.a},created:function(){this.getGiftBuyList(this.pageInfo)}},c={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"seckill"},[n("p",[n("el-button",{attrs:{type:"primary",icon:"el-icon-plus"},on:{click:t.addGiftbuy}},[t._v("添加买赠活动")])],1),t._v(" "),n("table-view",{attrs:{columns:t.columns,pageList:t.list}}),t._v(" "),n("pagination-view",{attrs:{currentPage:t.pageInfo.page,total:t.total},on:{"size-change":t.sizeChange,"current-change":t.pageChange}})],1)},staticRenderFns:[]};var u=n("C7Lr")(o,c,!1,function(t){n("6IV7")},"data-v-7eb58671",null);e.default=u.exports}});