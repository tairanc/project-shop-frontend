webpackJsonp([15],{SxUR:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("VXZc"),s=n("1G+u"),i=n("SZCj"),o=n("NcNL"),l=n.n(o),r=n("wJ7o"),c=n.n(r),u={data:function(){var e=this;return{exportform:[],loading:!1,reissueVisible:!1,exportnumber:!1,exportNum:"",selectItem:{user_can_get:0},coupon_id:void 0,userIds:"",list:[],total:0,pageInfo:{page:1,page_size:20},columns:[{label:"优惠券ID",field:"id",align:"center",width:80},{label:"优惠券名称",field:"name",align:"center"},{label:"发放数量",field:"send_quantity",align:"center",width:80},{label:"领取数量",field:"user_obtain_quantity",align:"center",width:80},{label:"使用数量",field:"user_used_quantity",align:"center",width:80},{label:"免单券状态",field:"status",align:"center",tags:[{index:0,name:"生效中",type:"success"},{index:1,name:"未生效",type:"danger"},{index:2,name:"已过期",type:"info"},{index:3,name:"已作废",type:"warning"}]},{label:"领取时间",obtaintime:!0,align:"center"},{label:"有效期",field:"expiry_date",align:"center",width:80},{label:"操作",align:"center",width:350,actions:[{label:"查看",type:"text",size:"medium",disable:function(e,t){return 0==!t},click:function(t,n){e.seeCoupon(n.id)}},{label:"编辑",type:"text",size:"medium",disable:function(e,t){return 0==e.status||2==e.status||3==e.status},click:function(t,n){e.editCoupon(n.id)}},{label:"作废",type:"text",size:"medium",disable:function(e,t){return 1==e.status||2==e.status||3==e.status},click:function(t,n){e.$confirm("作废后，用户将无法查看该卡券包，确认作废？","作废提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.cancelCoupon(n.id)}).catch(function(){e.$message({type:"info",message:"已取消作废"})})}},{label:"补发",type:"text",size:"medium",disable:function(e,t){return 1==e.status||2==e.status||3==e.status},click:function(t,n){e.reissueVisible=!0,e.userIds="",e.coupon_id=n.id}},{label:"删除",type:"text",size:"medium",disable:function(e,t){return 0==e.status||2==e.status||3==e.status},click:function(t,n){e.$confirm("删除后将不可领取及不可使用，确定要删除？","删除提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.deleteCoupon(n.id)}).catch(function(){e.$message({type:"info",message:"已取消删除"})})}},{label:"导出兑换码",type:"text",size:"medium",disable:function(e,t){return 2==e.status||3==e.status||e.user_can_get<1},click:function(t,n){e.exportnumber=!0,e.coupon_id=n.id,e.selectItem=n}}]}]}},methods:{getTicketList:function(e){var t=this;i.a.getShopcouponList(e).then(function(e){t.list=e.data.data,t.total=e.data.total_count})},addTicket:function(){this.$router.push({name:"addexempt"})},seeCoupon:function(e){this.$router.push({name:"checkexempt",query:{id:e}})},editCoupon:function(e){this.$router.push({name:"editexempt",query:{id:e}})},deleteCoupon:function(e){var t=this;i.a.deleteCoupon({coupon_id:e}).then(function(e){e.data&&(t.$message({type:"success",message:"删除n成功!",duration:1e3}),t.getTicketList(t.pageInfo))})},cancelCoupon:function(e){var t=this;i.a.cancelCoupon({coupon_id:e}).then(function(e){e.data&&(t.$message({type:"success",message:"作废成功!",duration:1e3}),t.getTicketList(t.pageInfo))})},reissueCoupon:function(){var e=this;i.a.reissueCoupon({coupon_id:this.coupon_id,telephones:this.userIds}).then(function(t){if(0!=t.data.fail){for(var n="",a=t.data.message,s=t.data.message.length,i=0;i<s;i++)n+="<p>"+a[i]+"</p>";e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:n,type:"warning"})}else e.$message({showClose:!0,message:"补发成功",type:"success"})})},cancelExport:function(){this.exportnumber=!1,this.selectItem={user_can_get:0}},sureExport:function(){var e=this;!new RegExp("^[0-9]*[1-9][0-9]*$").test(this.exportNum)||this.exportNum>this.selectItem.user_can_get||this.exportNum<0?this.$message({type:"info",message:"请输入有效数字"}):i.a.exportCode({coupon_id:this.coupon_id,num:this.exportNum}).then(function(t){if(0!=t.code){for(var n="",a=t.data.message,s=t.data.message.length,i=0;i<s;i++)n+="<p>"+a[i]+"</p>";e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:n,type:"warning"})}else{e.exportform=t.data;var o=e.selectItem.user_can_get-e.exportNum;e.$set(e.selectItem,"user_can_get",o),e.$message({showClose:!0,message:"导出成功",type:"success"}),e.exportnumber=!1,setTimeout(function(){var e=c.a.utils.table_to_book(document.querySelector("#exportformtable")),t=c.a.write(e,{bookType:"xlsx",bookSST:!0,type:"array"});try{l.a.saveAs(new Blob([t],{type:"application/octet-stream"}),"兑换码列表.xlsx")}catch(e){"undefined"!=typeof console&&console.log(e,t)}return t},1e3)}})},cancelReissue:function(){this.reissueVisible=!1,this.userIds=""},sizeChange:function(e){this.pageInfo.page_size=e,this.getTicketList(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getTicketList(this.pageInfo)}},components:{TableView:s.a,PaginationView:a.a},created:function(){this.getTicketList(this.pageInfo)}},p={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"exemptlist"},[n("el-row",[n("el-col",{attrs:{span:6}},[n("el-button",{attrs:{type:"primary"},on:{click:e.addTicket}},[e._v("添加优惠券")])],1)],1),e._v(" "),n("el-tabs",[n("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.list}}),e._v(" "),n("pagination-view",{attrs:{currentPage:e.pageInfo.page,total:e.total},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1),e._v(" "),n("el-dialog",{attrs:{width:"500px",title:"请输入用户账号,多用户账号需换行输入",visible:e.reissueVisible},on:{"update:visible":function(t){e.reissueVisible=t}}},[n("el-form",[n("el-form-item",[n("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请输入用户手机号"},model:{value:e.userIds,callback:function(t){e.userIds=t},expression:"userIds"}})],1)],1),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancelReissue}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.reissueCoupon}},[e._v("确 定")])],1)],1),e._v(" "),n("el-dialog",{attrs:{width:"500px",visible:e.exportnumber},on:{"update:visible":function(t){e.exportnumber=t}}},[n("el-form",[n("el-form-item",[n("el-row",[n("el-col",{attrs:{span:8}},[n("span",[e._v("请输入想导出的数量：")])]),e._v(" "),n("el-col",{attrs:{span:12}},[n("el-input",{attrs:{type:"number",placeholder:"可导出数量"+e.selectItem.user_can_get},model:{value:e.exportNum,callback:function(t){e.exportNum=t},expression:"exportNum"}})],1)],1)],1),e._v(" "),n("span",[e._v("注：导出后的兑换码不会再被导出，请慎用。")])],1),e._v(" "),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{on:{click:e.cancelExport}},[e._v("取 消")]),e._v(" "),n("el-button",{attrs:{type:"primary"},on:{click:e.sureExport}},[e._v("确 定")])],1)],1),e._v(" "),n("div",{staticClass:"exportHideform"},[n("el-table",{attrs:{data:e.exportform,id:"exportformtable"}},[n("el-table-column",{attrs:{type:"index"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row[0]))])]}}])}),e._v(" "),n("el-table-column",{attrs:{type:"index"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row[1]))])]}}])}),e._v(" "),n("el-table-column",{attrs:{type:"index"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(t.row[2]))])]}}])})],1)],1)],1)},staticRenderFns:[]};var d=n("C7Lr")(u,p,!1,function(e){n("Yis0")},"data-v-45a2a4b4",null).exports,m={data:function(){return{loading:!1,userIds:"",list:[],total:0,pageInfo:{page:1,page_size:20,use_start_time:"",use_end_time:"",coupon_id:"",telephone:""},columns:[{label:"免单券ID",field:"coupon_id",align:"center"},{label:"免单券名称",field:"name",align:"center"},{label:"用户手机号",field:"login_account",align:"center"},{label:"兑换码",field:"coupon_code",align:"center"},{label:"免单券状态",field:"status",align:"center"},{label:"使用时间",field:"used_time",align:"center"},{label:"订单编号",field:"order_no",align:"center"},{label:"订单金额",field:"order_payment",align:"center"},{label:"订单状态",field:"order_status",align:"center",tags:[{index:10,name:"未付款",type:"danger"},{index:20,name:"支付完成",type:"success"},{index:30,name:"已取消",type:"info"},{index:40,name:"已全部退款",type:"warning"},{index:"1234",name:"/",type:"warning"}]}]}},methods:{getDataList:function(e){var t=this;i.a.getUserCouponList(e).then(function(e){var n=[],a=["coupon_id","name","login_account","coupon_code","used_time","order_no","order_id","created_at","order_payment","status"];e.data.length>0&&e.data.map(function(e,t){a.map(function(t,n){null==e[t]&&(e[t]="/")}),null==e.order_status&&(e.order_status="1234"),n.push(e)}),t.list=n,t.total=e.total_count})},sizeChange:function(e){this.pageInfo.page_size=e,this.getDataList(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getDataList(this.pageInfo)},onSubmit:function(){this.getDataList(this.pageInfo)}},components:{TableView:s.a,PaginationView:a.a},created:function(){this.getDataList(this.pageInfo)}},f={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"exemptuserlist"},[n("el-form",{ref:"pageInfo",attrs:{model:e.pageInfo,"label-width":"100px",inline:!0}},[n("el-form-item",{attrs:{label:"使用时间"}},[n("el-col",{attrs:{span:10}},[n("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"date",size:"small"},model:{value:e.pageInfo.use_start_time,callback:function(t){e.$set(e.pageInfo,"use_start_time",t)},expression:"pageInfo.use_start_time"}})],1),e._v(" "),n("el-col",{staticClass:"line",attrs:{span:1}},[e._v(" 至 ")]),e._v(" "),n("el-col",{attrs:{span:10}},[n("el-date-picker",{staticStyle:{width:"100%"},attrs:{type:"date",size:"small"},model:{value:e.pageInfo.use_end_time,callback:function(t){e.$set(e.pageInfo,"use_end_time",t)},expression:"pageInfo.use_end_time"}})],1)],1),e._v(" "),n("el-form-item",{attrs:{label:"免单券ID"}},[n("el-input",{attrs:{size:"small"},model:{value:e.pageInfo.coupon_id,callback:function(t){e.$set(e.pageInfo,"coupon_id",t)},expression:"pageInfo.coupon_id"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"用户手机号"}},[n("el-input",{attrs:{size:"small"},model:{value:e.pageInfo.telephone,callback:function(t){e.$set(e.pageInfo,"telephone",t)},expression:"pageInfo.telephone"}})],1),e._v(" "),n("el-form-item",[n("el-button",{staticClass:"el-icon-search",attrs:{size:"small"},on:{click:e.onSubmit}})],1)],1),e._v(" "),n("el-tabs",[n("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.list}}),e._v(" "),n("pagination-view",{attrs:{currentPage:e.pageInfo.page,total:e.total},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1)],1)},staticRenderFns:[]};var g={data:function(){return{activeName:"first"}},components:{exemptList:d,exemptUserList:n("C7Lr")(m,f,!1,function(e){n("WRip")},"data-v-de619524",null).exports},methods:{}},_={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-tabs",{staticClass:"exempt",model:{value:e.activeName,callback:function(t){e.activeName=t},expression:"activeName"}},[n("el-tab-pane",{attrs:{label:"免单券列表",name:"first"}},[n("exempt-list")],1),e._v(" "),n("el-tab-pane",{attrs:{label:"用户免单券列表",name:"second"}},[n("exempt-user-list")],1)],1)},staticRenderFns:[]};var h=n("C7Lr")(g,_,!1,function(e){n("xMI3")},"data-v-40c173d0",null);t.default=h.exports},WRip:function(e,t){},Yis0:function(e,t){},xMI3:function(e,t){}});