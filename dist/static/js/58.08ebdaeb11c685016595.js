webpackJsonp([58],{"2kDr":function(e,t){},zBND:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("1G+u"),i=a("TwMp"),o=a("VXZc"),l={data:function(){return{loading:!1,list:[],name:"log",total:0,form:{page:1,page_size:20},columns:[{label:"操作时间",field:"created_at",align:"center"},{label:"用户名",field:"seller_account",align:"center"},{label:"操作内容",field:"content",align:"center"},{label:"IP",field:"ip",align:"center"}]}},methods:{getOperationLogList:function(e){var t=this;i.a.getOperationLogList(e).then(function(e){for(var a in t.list=[],e.data.data)t.list.push(e.data.data[a]);t.total=e.data.count})},handleSizeChange:function(e){this.form.page_size=e,this.getOperationLogList(this.form)},handleNumberChange:function(e){this.form.page=e,this.getOperationLogList(this.form)}},components:{TableView:n.a,PaginationView:o.a},created:function(){this.getOperationLogList(this.form)}},r={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"manage"},[a("el-tabs",[a("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.list}}),e._v(" "),a("pagination-view",{directives:[{name:"show",rawName:"v-show",value:e.list.length,expression:"list.length"}],attrs:{paginationName:e.name,total:e.total,currentPage:e.form.page},on:{"size-change":e.handleSizeChange,"current-change":e.handleNumberChange}})],1)],1)},staticRenderFns:[]};var s=a("C7Lr")(l,r,!1,function(e){a("2kDr")},"data-v-645b021c",null);t.default=s.exports}});