webpackJsonp([85],{LOsW:function(t,a,i){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var e=i("iVs4"),l={data:function(){return{list:[],allRate:"",centerDialog:!1,data_categories:{rates:[]},activeTab:"",tabList:[{title:"商品提成列表",path:"/goods-activity/activity/inviteSell/goodsBonus"},{title:"分类提成管理",path:"/goods-activity/activity/inviteSell/bonusCateList"},{title:"提成订单明细",path:"/goods-activity/activity/inviteSell/bonusOrderDetail"},{title:"返点订单明细",path:"/goods-activity/activity/inviteSell/rebatesDetail"},{title:"提成订单汇总",path:"/goods-activity/activity/inviteSell/bonusOrderSum"},{title:"返点订单汇总",path:"/goods-activity/activity/inviteSell/bonusRebateSum"}]}},watch:{$route:function(){var t=window.location.href.split(".com");this.activeTab=t[1]}},methods:{tabClick:function(t){this.$route.path!==this.activeTab&&this.$router.push({path:this.activeTab})},getPrimaryCategories:function(){var t=this;e.a.getPrimaryCategories().then(function(a){for(var i in t.list=[],a.data)t.list.push(a.data[i]),t.$set(a.data[i],"rate","")})},initializeCategoriesRates:function(t){e.a.initializeCategoriesRates(t).then(function(t){window.location.reload()})},isCategoryInitialized:function(){var t=this;e.a.isCategoryInitialized().then(function(a){0==a.data&&(t.centerDialog=!0,t.getPrimaryCategories())})},clickRate:function(){var t=this;this.data_categories.rates=[],this.list.map(function(a){var i={category_id:"",rates:""};i.category_id=a.id,i.rates=a.rate,t.data_categories.rates.push(i)}),this.initializeCategoriesRates(this.data_categories)},allClickRate:function(){var t=this;this.list.map(function(a){a.rate=t.allRate})},tabFixbug:function(){var t=window.location.href.split(".com");this.activeTab=t[1]}},created:function(){this.isCategoryInitialized(),this.tabFixbug()}},o={render:function(){var t=this,a=t.$createElement,i=t._self._c||a;return i("div",{staticClass:"commission"},[i("el-tabs",{attrs:{type:"border-card"},on:{"tab-click":t.tabClick},model:{value:t.activeTab,callback:function(a){t.activeTab=a},expression:"activeTab"}},[t._l(t.tabList,function(t){return i("el-tab-pane",{key:t.path,attrs:{label:t.title,name:t.path}})}),t._v(" "),i("router-view")],2),t._v(" "),i("el-dialog",{attrs:{title:"分类设置",visible:t.centerDialog,"show-close":!1,"close-on-click-modal":!1,width:"40%",center:""},on:{"update:visible":function(a){t.centerDialog=a}}},[i("p",[t._v("以下分类您还没有设置比率，请自行设置")]),t._v(" "),i("p",{staticStyle:{"text-align":"center"}},[i("el-input",{staticStyle:{width:"100px",display:"inline-block"},model:{value:t.allRate,callback:function(a){t.allRate=a},expression:"allRate"}}),t._v("%"),i("el-button",{staticStyle:{"margin-left":"40px"},on:{click:t.allClickRate}},[t._v("批量设置")])],1),t._v(" "),i("el-table",{staticClass:"table",attrs:{data:t.list,border:"",align:"center"}},[i("el-table-column",{attrs:{align:"center",label:"类目名",prop:"name"}}),t._v(" "),i("el-table-column",{attrs:{align:"center",label:"设置比率"},scopedSlots:t._u([{key:"default",fn:function(a){return[i("el-input",{staticStyle:{width:"100px"},model:{value:a.row.rate,callback:function(i){t.$set(a.row,"rate",i)},expression:"scope.row.rate"}}),t._v("%\n              ")]}}])})],1),t._v(" "),i("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:t.clickRate}},[t._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var n=i("C7Lr")(l,o,!1,function(t){i("pQJd")},"data-v-33c2bf52",null);a.default=n.exports},pQJd:function(t,a){}});