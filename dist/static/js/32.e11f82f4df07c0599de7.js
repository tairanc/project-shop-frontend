webpackJsonp([32],{La5c:function(t,e){},jUVy:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("VXZc"),o=a("1G+u"),n=a("2AkA"),r=function(t){return Object(n.a)({method:"get",url:"/trmall/settlement/searchDownloadList",params:t})},l=function(t){return Object(n.a)({method:"get",url:"/trmall/settlement/getDownloadAuthUrl",params:t})},s=a("0HAb"),c={data:function(){var t=this;return{total:0,trade_time:[],urldialogVisible:!1,fileUrl:"",form:{page:1,page_size:20},list:[],columns:[{label:"文件名",field:"file_name",align:"center"},{label:"创建时间",field:"created_at",align:"center"},{label:"操作",align:"center",actions:[{label:"下载",type:"text",size:"medium",click:function(e,a){t.openInfo(a.file_name)}}]}]}},methods:{searchFormdata:function(t){t.page=1,this.searchDownloadList(t)},searchDownloadList:function(t){var e=this;this.trade_time&&(this.form.start_date=this.trade_time[0],this.form.end_date=this.trade_time[1]),r(t).then(function(t){for(var a in e.total=t.data.total_count,e.list=[],t.data.list)e.list.push(t.data.list[a])})},sizeChange:function(t){this.form.page_size=t,this.searchDownloadList(this.form)},pageChange:function(t){this.form.page=t,this.searchDownloadList(this.form)},openInfo:function(t){console.log("filename",t),this.info(t)},info:function(t){var e={filename:t};console.log(e),l(e).then(function(e){0==e.code&&(console.log(e.data.authUrl),window.open(e.data.authUrl,t))})},clearBtn:function(){this.form.start_date="",this.form.end_date="",this.trade_time=[]}},created:function(){this.trade_time[0]=Object(s.a)("start"),this.trade_time[1]=Object(s.a)("end"),this.searchDownloadList(this.form)},components:{TableView:o.a,PaginationView:i.a}},d={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"summary"},[a("el-tabs",{staticStyle:{"margin-bottom":"50px"},attrs:{type:"border-card"}},[a("el-form",[a("el-row",[a("el-col",{attrs:{span:12,offset:1}},[a("el-form-item",{attrs:{label:"创建时间:",prop:"trade_time"}},[a("el-date-picker",{attrs:{type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:t.trade_time,callback:function(e){t.trade_time=e},expression:"trade_time"}})],1)],1),t._v(" "),a("el-col",{attrs:{span:5,offset:1}},[a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:function(e){return t.searchFormdata(t.form)}}},[t._v("搜索")]),t._v(" "),a("el-button",{on:{click:t.clearBtn}},[t._v("清空条件")])],1)],1)],1)],1),t._v(" "),a("table-view",{attrs:{columns:t.columns,pageList:t.list,id:"rebateSetTable"}}),t._v(" "),a("pagination-view",{attrs:{height:600,currentPage:t.form.page,total:t.total},on:{"size-change":t.sizeChange,"current-change":t.pageChange}}),t._v(" "),a("el-dialog",{attrs:{title:"提示",visible:t.urldialogVisible,width:"30%","before-close":t.handleClose},on:{"update:visible":function(e){t.urldialogVisible=e}}},[a("span",[t._v(t._s(t.fileUrl))]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(e){t.urldialogVisible=!1}}},[t._v("确 定")])],1)])],1)},staticRenderFns:[]};var f=a("C7Lr")(c,d,!1,function(t){a("La5c")},"data-v-f86e5d48",null);e.default=f.exports}});