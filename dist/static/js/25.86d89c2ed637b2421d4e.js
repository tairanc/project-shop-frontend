webpackJsonp([25],{"7WvC":function(t,e){},"EM+y":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=a("VXZc"),o=a("1G+u"),l=a("iVs4"),s=a("NcNL"),n=a.n(s),i=a("wJ7o"),c=a.n(i),p=a("tRsT"),d={data:function(){return{total:0,form:{page:1,page_size:20,start_at:"",end_at:""},list:[]}},computed:{objSpanArr:function(){return Object(p.a)(this.list)}},methods:{getRebateDetailList:function(t){var e=this;l.a.getRebateDetailList(t).then(function(t){for(var a in e.total=t.data.total_count,e.list=[],t.data.list)for(var r in t.data.list[a].shop){switch(t.data.list[a].shop[r].order_status){case 10:t.data.list[a].shop[r].order_status="已创建";break;case 20:t.data.list[a].shop[r].order_status="已支付";break;case 30:t.data.list[a].shop[r].order_status="已发货";break;case 40:t.data.list[a].shop[r].order_status="已结算";break;case 50:t.data.list[a].shop[r].order_status="已失效"}e.list.push(t.data.list[a].shop[r])}})},spanMethod:function(t){t.row,t.column;var e=t.rowIndex,a=t.columnIndex;if(0===a||1===a||2===a||3===a||4===a)return 1==this.objSpanArr[e]?{rowspan:0,colspan:0}:0==this.objSpanArr[e]?{rowspan:1,colspan:1}:{rowspan:this.objSpanArr[e],colspan:1}},sizeChange:function(t){this.form.page_size=t,this.getRebateDetailList(this.form)},pageChange:function(t){this.form.page=t,this.getRebateDetailList(this.form)},exportExcel:function(){this.form.page_size=-1,this.getRebateDetailList(this.form),setTimeout(function(){var t=c.a.utils.table_to_book(document.querySelector("#rebateSetTable")),e=c.a.write(t,{bookType:"xlsx",bookSST:!0,type:"array"});try{n.a.saveAs(new Blob([e],{type:"application/octet-stream"}),"返点订单明细.xlsx")}catch(t){"undefined"!=typeof console&&console.log(t,e)}return e},1e3)}},created:function(){this.getRebateDetailList(this.form)},components:{TableView:o.a,PaginationView:r.a}},u={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-form",[a("el-row",[a("el-col",{attrs:{span:6,offset:1}},[a("el-form-item",{attrs:{label:"开始时间：",prop:"start_at"}},[a("el-date-picker",{attrs:{type:"datetime",placeholder:"开始时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:t.form.start_at,callback:function(e){t.$set(t.form,"start_at",e)},expression:"form.start_at"}})],1)],1),t._v(" "),a("el-col",{attrs:{span:6,offset:1}},[a("el-form-item",{attrs:{label:"结束时间：",prop:"end_at"}},[a("el-date-picker",{attrs:{type:"datetime",placeholder:"结束时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:t.form.end_at,callback:function(e){t.$set(t.form,"end_at",e)},expression:"form.end_at"}})],1)],1),t._v(" "),a("el-col",{attrs:{span:3,offset:1}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:function(e){return t.getRebateDetailList(t.form)}}},[t._v("搜索")])],1),t._v(" "),a("el-col",{attrs:{span:4,offset:1}},[a("el-button",{attrs:{icon:"el-icon-download"},on:{click:t.exportExcel}},[t._v("下载报表")])],1)],1)],1),t._v(" "),a("p"),t._v(" "),a("el-table",{staticClass:"table",attrs:{data:t.list,border:"",align:"center",id:"rebateSetTable","span-method":t.spanMethod}},[a("el-table-column",{attrs:{align:"center",label:"平台订单号",prop:"order_id"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"店铺订单号",prop:"shop_order_id"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"订单创建时间",prop:"created_at"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"订单结算时间",prop:"settled_at"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"订单状态",prop:"order_status"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"商品ID",prop:"item_id"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"商品名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("p",[a("a",{staticClass:"goods_url",attrs:{href:t.defaultUrl("item_id",e.row),target:"_blank"}},[t._v(t._s(e.row.title))])])]}}])}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"商品数量",prop:"item_num"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"实付金额",prop:"payment_amount"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"结算金额",prop:"settled_amount"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"返点比率",prop:"bonus_rate"}}),t._v(" "),a("el-table-column",{attrs:{align:"center",label:"返点",prop:"settled_income"}})],1),t._v(" "),a("pagination-view",{attrs:{currentPage:t.form.page,total:t.total},on:{"size-change":t.sizeChange,"current-change":t.pageChange}})],1)},staticRenderFns:[]};var m=a("C7Lr")(d,u,!1,function(t){a("7WvC")},"data-v-76012fbf",null);e.default=m.exports},tRsT:function(t,e,a){"use strict";e.a=function(t){var e=[];if(t.length<2)return e=[0];var a=0;return t.map(function(r,o){0==o?r.order_id!=t[1].order_id?e.push(0):e.push(1):r.order_id==t[o-1].order_id?(e[a]+=1,e.push(1)):o<t.length-1&&r.order_id==t[o+1].order_id?(e.push(1),a=o):(e.push(0),a=o)}),e}}});