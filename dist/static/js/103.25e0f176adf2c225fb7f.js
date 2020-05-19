webpackJsonp([103],{IHel:function(e,t){},Wyas:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("VXZc"),a=n("1G+u"),s=n("kvg+"),o={data:function(){var e=this;return{loading:!1,reissueVisible:!1,coupon_id:void 0,userIds:"",list:[],total:0,pageInfo:{page:1,page_size:20},columns:[{label:"优惠券ID",field:"id",align:"center"},{label:"优惠券名称",field:"name",align:"center"},{label:"门槛金额(元)",field:"limit_money",align:"center"},{label:"优惠金额(元)",field:"deduct_money",align:"center"},{label:"发放数量",field:"send_quantity",align:"center"},{label:"领取数量",field:"extend.user_obtain_quantity",align:"center"},{label:"使用数量",field:"extend.user_used_quantity",align:"center"},{label:"优惠券状态",field:"status",align:"center",tags:[{index:1,name:"未生效",type:"danger"},{index:0,name:"生效中",type:"success"},{index:2,name:"已过期",type:"info"},{index:3,name:"已作废",type:"warning"}]},{label:"操作",align:"center",width:350,actions:[{label:"查看",type:"text",size:"medium",disable:function(e,t){return 0==!t},click:function(t,n){e.seeCoupon(n.id)}},{label:"编辑",type:"text",size:"medium",disable:function(e,t){return!(1==e.status&&0==e.can_obtain)},click:function(t,n){e.editCoupon(n.id)}},{label:"作废",type:"text",size:"medium",disable:function(e,t){return!(1==e.status&&1==e.can_obtain||0==e.status)},click:function(t,n){e.$confirm("优惠券作废后将不可领取及不可使用，确定要作废？","作废提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.cancelCoupon(n.id)}).catch(function(){e.$message({type:"info",message:"已取消作废"})})}},{label:"补发",type:"text",size:"medium",disable:function(e,t){return!(1==e.status&&1==e.can_obtain||0==e.status)},click:function(t,n){e.reissueVisible=!0,e.userIds="",e.coupon_id=n.id}},{label:"删除",type:"text",size:"medium",disable:function(e,t){return!(1==e.status&&0==e.can_obtain)},click:function(t,n){e.$confirm("优惠券删除后将不可领取及不可使用，确定要删除？","删除提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.deleteCoupon(n.id)}).catch(function(){e.$message({type:"info",message:"已取消删除"})})}}]}]}},methods:{getTicketList:function(e){var t=this;s.a.getShopcouponList(e).then(function(e){t.list=e.data.data,t.list.map(function(e){0==e.limit_money&&(e.limit_money="/")}),t.total=e.data.total_count})},addTicket:function(){this.$router.push({name:"addTicket"})},seeCoupon:function(e){this.$router.push({name:"ticketDetail",query:{id:e}})},editCoupon:function(e){this.$router.push({name:"editTicket",query:{id:e}})},deleteCoupon:function(e){var t=this;s.a.deleteCoupon({coupon_id:e}).then(function(e){e.data&&(t.$message({type:"success",message:"删除n成功!",duration:1e3}),t.getTicketList(t.pageInfo))})},cancelCoupon:function(e){var t=this;s.a.cancelCoupon({coupon_id:e}).then(function(e){e.data&&(t.$message({type:"success",message:"作废成功!",duration:1e3}),t.getTicketList(t.pageInfo))})},reissueCoupon:function(){var e=this;s.a.reissueCoupon({coupon_id:this.coupon_id,telephones:this.userIds}).then(function(t){if(0!=t.data.fail){for(var n="",i=t.data.message,a=t.data.message.length,s=0;s<a;s++)n+="<p>"+i[s]+"</p>";e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:n,type:"warning"})}else e.$message({showClose:!0,message:"补发成功",type:"success"})})},cancelReissue:function(){this.reissueVisible=!1,this.userIds=""},sizeChange:function(e){this.pageInfo.page_size=e,this.getTicketList(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getTicketList(this.pageInfo)}},components:{TableView:a.a,PaginationView:i.a},created:function(){this.getTicketList(this.pageInfo)}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"tickets"},[n("el-row",[n("el-col",{attrs:{span:6}},[n("el-button",{attrs:{type:"primary"},on:{click:e.addTicket}},[e._v("添加优惠券")])],1)],1),e._v(" "),n("el-tabs",[n("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.list}}),e._v(" "),n("pagination-view",{attrs:{currentPage:e.pageInfo.page,total:e.total},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1),e._v(" "),n("el-dialog",{attrs:{width:"500px",title:"请输入用户账号,多用户账号需用换行输入",visible:e.reissueVisible},on:{"update:visible":function(t){e.reissueVisible=t}}},[n("el-form",[n("el-form-item",[n("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请输入用户手机号"},model:{value:e.userIds,callback:function(t){e.userIds=t},expression:"userIds"}})],1)],1),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancelReissue}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.reissueCoupon}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var u=n("C7Lr")(o,c,!1,function(e){n("IHel")},"data-v-007dad12",null);t.default=u.exports}});