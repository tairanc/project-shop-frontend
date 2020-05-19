webpackJsonp([80],{"nM+B":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var l=a("VXZc"),s=a("1G+u"),n=a("2/bT"),o=a("6PaB"),i=a("NcNL"),r=a.n(i),c=a("wJ7o"),g=a.n(c),p={data:function(){return{total:0,pageInfo:{promotion_id:"",page:1,page_size:20,item_search:null},message:{rules:{exchange_count:"",exchange_full:""}},goodsListAll:[],goodsList:[],goodsListGift:[],columns:[{label:"商品ID",field:"item_id",align:"center"},{label:"商品名称",field:"title",align:"center"},{label:"属性",field:"spec_text",align:"center"},{label:"市场价（元）",field:"market_price",align:"center"},{label:"标准售价（元）",field:"sell_price",align:"center"},{label:"活动价（元）",field:"price",align:"center"},{label:"可售库存",field:"total",align:"center"},{label:"换购价（元）",field:"exchange_price",align:"center"},{label:"销量",field:"sales",align:"center"}]}},computed:{spanArr:function(){return Object(o.a)(this.goodsList)},spanArrGift:function(){return Object(o.a)(this.goodsListGift)}},methods:{getExchangeBuyDetail:function(e){var t=this;n.a.getExchangeBuyDetail(e).then(function(e){0==e.code&&(t.message=e.data.activity,t.goodsList=e.data.items.activity_items,t.goodsListGift=e.data.items.exchange_items,t.total=e.data.total_count)})},handleDelete:function(e){var t=this;n.a.closeItem({promotion_id:this.pageInfo.promotion_id,item_id:e.item_id}).then(function(e){0==e.code&&(t.$message({showClose:!0,message:"关闭商品成功",type:"success"}),t.getExchangeBuyDetail(t.pageInfo))})},handleDeleteGift:function(e){var t=this;n.a.closeItem({promotion_id:this.pageInfo.promotion_id,item_id:e.item_id,sku_id:e.sku_id}).then(function(e){0==e.code&&(t.$message({showClose:!0,message:"关闭商品成功",type:"success"}),t.getExchangeBuyDetail(t.pageInfo))})},sizeChange:function(e){this.pageInfo.page_size=e,this.getExchangeBuyDetail(this.pageInfo)},searchItem:function(){this.pageInfo.page=1,this.getExchangeBuyDetail(this.pageInfo)},resetSearch:function(){this.pageInfo.page=1,this.pageInfo.item_search="",this.getExchangeBuyDetail(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getExchangeBuyDetail(this.pageInfo)},spanMethod:function(e){e.row,e.column;var t=e.rowIndex,a=e.columnIndex;if(0==a||1==a||2==a||7==a)return 1==this.spanArr[t]?{rowspan:0,colspan:0}:0==this.spanArr[t]?{rowspan:1,colspan:1}:{rowspan:this.spanArr[t],colspan:1}},exportForm:function(){var e=this;if(null!=e.pageInfo.item_search&&e.pageInfo.item_search.length>0){var t=this.goodsList.concat(this.goodsListGift);e.downFileData(t)}else n.a.getExportData({promotion_id:this.pageInfo.promotion_id}).then(function(t){e.downFileData(t.data)})},downFileData:function(e){e.length<1||(this.goodsListAll=e,setTimeout(function(){var e=g.a.utils.table_to_book(document.querySelector("#export-form")),t=g.a.write(e,{bookType:"xlsx",bookSST:!0,type:"array"});try{r.a.saveAs(new Blob([t],{type:"application/octet-stream"}),"商品列表.xlsx")}catch(e){"undefined"!=typeof console&&console.log(e,t)}return t},1e3),this.$message({showClose:!0,message:"导出成功",type:"success"}))},goBack:function(){this.$router.go(-1)}},components:{PaginationView:l.a,TableView:s.a},created:function(){this.pageInfo.promotion_id=this.$route.query.promotion_id,this.getExchangeBuyDetail(this.pageInfo)}},u={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"detail"},[a("h3",[e._v("活动信息")]),e._v(" "),a("el-row",[a("el-col",[a("p",[e._v("活动名称： "+e._s(e.message.name))])]),e._v(" "),a("el-col",[a("p",[e._v("活动规则： 消费满"+e._s(e.message.rules.exchange_full)+"元，可换购"+e._s(e.message.rules.exchange_count)+"件")])]),e._v(" "),a("el-col",[a("p",[e._v("活动创建时间： "+e._s(e.message.created_at))])]),e._v(" "),a("el-col",[a("p",[e._v("活动开始时间： "+e._s(e.message.start_time))])]),e._v(" "),a("el-col",[a("p",[e._v("活动结束时间： "+e._s(e.message.end_time))])])],1),e._v(" "),a("div",{staticClass:"goods"},[a("h3",[e._v("商品信息")]),e._v(" "),a("el-button",{on:{click:e.exportForm}},[e._v("导出报表")]),e._v(" "),a("el-input",{staticClass:"item_search",attrs:{placeholder:"请输入商品 ID 进行搜索",clearable:""},model:{value:e.pageInfo.item_search,callback:function(t){e.$set(e.pageInfo,"item_search",t)},expression:"pageInfo.item_search\t"}}),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"el-icon-search"},on:{click:e.searchItem}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.resetSearch}},[e._v("重置")]),e._v(" "),a("div",{staticClass:"table"},[a("el-table",{attrs:{data:e.goodsList,border:"","span-method":e.spanMethod}},[a("el-table-column",{attrs:{align:"center",label:"商品ID",prop:"item_id"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"商品名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("a",{staticClass:"goods_url",attrs:{href:e.defaultUrl("item_id",t.row),target:"_blank"}},[e._v(e._s(t.row.title))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"属性",prop:"spec_text"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"市场价（元）",prop:"market_price"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"标准售价（元）",prop:"sell_price"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"可售库存",prop:"store"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"销量",prop:"sales"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",disabled:0==t.row.status||10==e.message.status||40==e.message.status},on:{click:function(a){return e.handleDelete(t.row)}}},[e._v(e._s(0==t.row.status?"已关闭":"关闭"))])]}}])})],1)],1),e._v(" "),a("pagination-view",{attrs:{currentPage:e.pageInfo.page,total:e.total},on:{"size-change":e.sizeChange,"current-change":e.pageChange}}),e._v(" "),a("el-tabs",{attrs:{id:"export-form"}},[a("table-view",{attrs:{columns:e.columns,pageList:e.goodsListAll}})],1)],1),e._v(" "),a("h3",[e._v("换购商品")]),e._v(" "),a("div",{staticClass:"table"},[a("el-table",{attrs:{data:e.goodsListGift,border:""}},[a("el-table-column",{attrs:{align:"center",label:"商品ID",prop:"item_id"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"商品名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("a",{staticClass:"goods_url",attrs:{href:e.defaultUrl("item_id",t.row),target:"_blank"}},[e._v(e._s(t.row.title))])]}}])}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"属性",prop:"spec_text"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"市场价（元）",prop:"market_price"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"标准售价（元）",prop:"sell_price"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"可售库存",prop:"store"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"换购价",prop:"price"}}),e._v(" "),a("el-table-column",{attrs:{align:"center",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{type:"text",disabled:0==t.row.status||10==e.message.status||40==e.message.status},on:{click:function(a){return e.handleDeleteGift(t.row)}}},[e._v(e._s(0==t.row.status?"已关闭":"关闭"))])]}}])})],1)],1),e._v(" "),a("el-row",[a("el-col",{attrs:{offset:10}},[a("el-button",{attrs:{type:"primary"},on:{click:e.goBack}},[e._v("返回")])],1)],1)],1)},staticRenderFns:[]};var _=a("C7Lr")(p,u,!1,function(e){a("nR+X")},"data-v-417c1bc6",null);t.default=_.exports},"nR+X":function(e,t){}});