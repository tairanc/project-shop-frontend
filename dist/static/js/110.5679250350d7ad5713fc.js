webpackJsonp([110],{ChDY:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var i=t("UMpo"),l=t("VXZc"),n={data:function(){var e=this;return{columns:[{label:"活动名称",field:"name",align:"center"},{label:"活动类型",field:"type",align:"center"},{label:"报名开始时间",field:"apply_start_time",align:"center"},{label:"报名结束时间",field:"apply_end_time",align:"center"},{label:"活动开始时间",field:"start_time",align:"center"},{label:"活动结束时间",field:"end_time",align:"center"},{label:"报名情况",textp:!0,align:"center"},{label:"参与情况",field:"apply_status",align:"center",tags:[{index:1,name:"报名未开始",type:"danger"},{index:2,name:"可参与",type:"success"},{index:3,name:"报名已结束",type:"info"},{index:0,name:"不可参与",type:"warning"}]},{label:"操作",align:"center",actions:[{label:"查看",type:"text",size:"medium",visible:function(e){return 2!=e.apply_status},click:function(a,t){!t.apply_id&&(t.apply_id=-1),e.$router.push({path:"/goods-activity/activity/saleDetail?sale_id="+t.flash_sale_id+"&apply_id="+t.apply_id})}},{label:"报名",type:"text",size:"medium",visible:function(e){return 2==e.apply_status},click:function(a,t){!t.apply_id&&(t.apply_id=-1),e.$router.push({path:"/goods-activity/activity/addSale?sale_id="+t.flash_sale_id+"&apply_id="+t.apply_id})}}]}],loading:!1,list:[],total:0,pageInfo:{type:"my",page:1,page_size:20}}},methods:{sizeChange:function(e){this.pageInfo.page_size=e,this.getFlashSaleList(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getFlashSaleList(this.pageInfo)},getFlashSaleList:function(e){var a=this;i.a.getFlashSaleList(e).then(function(e){0==e.code&&(a.total=e.data.total_count,a.list=e.data.data,a.list.map(function(e){switch(e.type){case"FlashSale":e.type="单品特卖";break;case"SpecialFlashSale":e.type="专场特卖"}e.textp=["未审核 "+e.record_verify_status.pending,"审核通过 "+e.record_verify_status.agree,"审核未通过 "+e.record_verify_status.refuse]}))})}},components:{TableView:t("1G+u").a,PaginationView:l.a},mounted:function(){this.getFlashSaleList(this.pageInfo)}},s={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"sales"},[t("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.list}}),e._v(" "),t("pagination-view",{attrs:{currentPage:e.pageInfo.page,total:e.total},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1)},staticRenderFns:[]},p=t("C7Lr")(n,s,!1,null,null,null);a.default=p.exports}});