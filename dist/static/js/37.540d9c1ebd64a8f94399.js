webpackJsonp([37],{Jmci:function(t,e){},R4YO:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("4YfN"),s=a.n(i),n=a("qsHl"),o=a("2bvH"),c={data:function(){return{activeTab:"/goods-manage/goods/manage/sale",tabList:[{title:"正在销售",path:"/goods-manage/goods/manage/sale"},{title:"仓库中",path:"/goods-manage/goods/manage/stock"}]}},computed:s()({},Object(o.c)(["deliveryTplUpList","categoryList"])),watch:{$route:function(){this.activeTab=this.$route.path}},methods:s()({tabClick:function(t){this.$route.path!==this.activeTab&&this.$router.push({path:this.activeTab})}},Object(o.b)(["getDeliveryStatusList","getCategoryList"])),created:function(){var t=this;this.activeTab=this.$route.path,this.getDeliveryStatusList({status:1}),this.getCategoryList(),n.a.getItemList().then(function(e){2==e.data.biz_mode&&t.tabList.push({title:"审核中",path:"/goods-manage/goods/manage/checking"})})}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"manage"},[a("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":t.tabClick},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},[t._l(t.tabList,function(t,e){return a("el-tab-pane",{key:t.path,attrs:{label:t.title,name:t.path}})}),t._v(" "),a("router-view")],2)],1)},staticRenderFns:[]};var u=a("C7Lr")(c,r,!1,function(t){a("Jmci")},"data-v-c025c950",null);e.default=u.exports}});