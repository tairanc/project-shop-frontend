webpackJsonp([76],{fb28:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r("4YfN"),o=r.n(a),n=r("2bvH"),s=r("1G+u"),i=r("VXZc"),l=r("qsHl"),c=r("NcNL"),m=r.n(c),_=r("wJ7o"),f=r.n(_),d=/^\d+(\.{0,1}\d+){0,1}$/,p={data:function(){var e=this;return{formOnChecking:{name:"formOnChecking",loading:!1,total:0,form:{title:"",art_no:"",shop_category_id:"",shop_category_list:[],supply_bind_status:"",min_price:"",max_price:"",logistics_template_id:"",bar_code:"",status:20,page:1,page_size:20},rules:{title:[{max:60,message:"长度在 0 到 60 个字符",trigger:"blur"}],art_no:[{max:50,message:"长度在 0 到 50 个字符",trigger:"blur"}],min_price:[{validator:function(t,r,a){r?d.test(r)?(e.$refs.formOnChecking.validateField("max_price"),a()):a(new Error("最低价必须为数字")):a()},trigger:"blur"}],max_price:[{validator:function(t,r,a){r||0===r?d.test(r)?r<parseFloat(e.formOnChecking.form.min_price)?a(new Error("最高价不得小于最低价")):a():a(new Error("最高价必须为数字")):a()},trigger:"blur"}]},columns:[{label:"商品名称",desField:"1"},{label:"店铺分类",field:"shop_category_name",align:"center"},{label:"价格（元）",field:"sell_price",align:"center"},{label:"总库存",field:"total_store",align:"center"},{label:"运费模板",field:"logistics_template_name",align:"center"},{label:"供应链绑定",field:"supply_bind_status",align:"center"},{label:"发布时间",field:"updated_at",align:"center"},{label:"操作",field:"options",link:"/goods-manage/goods/edit",align:"center"}],list:[],selectList:[]},exportList:[]}},methods:{exportGoodTable:function(){var e=this;l.a.exportGoods(this.formOnChecking.form).then(function(t){t.data.map(function(e){switch(e.trade_type){case 10:e.trade_type="一般贸易";break;case 20:e.trade_type="海淘";break;case 30:e.trade_type="跨境保税";break;case 40:e.trade_type="海外直邮"}switch(!e.tax_rate&&(e.tax_rate=""),e.status="审核中",e.free_refund){case 0:e.free_refund="否";break;case 1:e.free_refund="是"}}),e.exportList=t.data,setTimeout(function(){var e=f.a.utils.table_to_book(document.querySelector("#export-form"));for(var t in e.Sheets.Sheet1)e.Sheets.Sheet1[t].t&&("("==String(e.Sheets.Sheet1[t].v).substr(0,1)&&""!=e.Sheets.Sheet1[t]&&(e.Sheets.Sheet1[t].v=String(e.Sheets.Sheet1[t].v).substr(1,e.Sheets.Sheet1[t].v.length-1)),e.Sheets.Sheet1[t].t="s");var r=f.a.write(e,{bookType:"xlsx",bookSST:!1,type:"binary"});try{m.a.saveAs(new Blob([function(e){for(var t=new ArrayBuffer(e.length),r=new Uint8Array(t),a=0;a!==e.length;++a)r[a]=255&e.charCodeAt(a);return t}(r)],{type:"application/octet-stream"}),"商品列表.xlsx")}catch(e){"undefined"!=typeof console&&console.log(e,r)}return r},1e3),e.$message({showClose:!0,message:"导出成功",type:"success"})})},getCategoryId:function(e){this.formOnChecking.form.shop_category_id=e[e.length-1]},handleSelectChange:function(e){},handleSizeChange:function(e){this.formOnChecking.form.page_size=e,this.getItemList(this.formOnChecking.form)},handleNumberChange:function(e){this.formOnChecking.form.page=e,this.getItemList(this.formOnChecking.form)},search:function(){var e=this;this.$refs.formOnChecking.validate(function(t){t&&(e.formOnChecking.loading=!0,e.formOnChecking.form.page=1,e.getItemList(e.formOnChecking.form))})},resetForm:function(){this.$refs.formOnChecking.resetFields(),this.formOnChecking.form.shop_category_list=[]},getItemList:function(e){var t=this;l.a.getItemList(e).then(function(e){for(var r in t.formOnChecking.list=[],t.formOnChecking.loading=!1,t.formOnChecking.total=e.data.total_count,e.data.list){switch(e.data.list[r].supply_bind_status){case 10:e.data.list[r].supply_bind_status="否";break;case 20:e.data.list[r].supply_bind_status="部分";break;case 30:e.data.list[r].supply_bind_status="是"}e.data.list[r].options={text:"编辑",option:"id"},t.formOnChecking.list.push(e.data.list[r])}t.formOnChecking.list.sort(function(e,t){return e=new Date(e.updated_at),(t=new Date(t.updated_at))-e})})}},components:{TableView:s.a,PaginationView:i.a},computed:o()({},Object(n.c)(["deliveryTplUpList","categoryList"])),mounted:function(){this.search()}},u={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"onChecking"},[r("el-form",{ref:"formOnChecking",attrs:{model:e.formOnChecking.form,rules:e.formOnChecking.rules,"label-width":"100px",size:"medium"}},[r("el-row",[r("el-col",{attrs:{span:6,offset:1}},[r("el-form-item",{attrs:{label:"商品名称：",prop:"title"}},[r("el-input",{model:{value:e.formOnChecking.form.title,callback:function(t){e.$set(e.formOnChecking.form,"title",t)},expression:"formOnChecking.form.title"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:7,offset:1}},[r("el-form-item",{attrs:{label:"商品货号：",prop:"art_no"}},[r("el-input",{model:{value:e.formOnChecking.form.art_no,callback:function(t){e.$set(e.formOnChecking.form,"art_no",t)},expression:"formOnChecking.form.art_no"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:6,offset:1}},[r("el-form-item",{attrs:{label:"店铺分类：",prop:"shop_category_id"}},[r("el-cascader",{attrs:{options:e.categoryList},on:{change:e.getCategoryId},model:{value:e.formOnChecking.form.shop_category_list,callback:function(t){e.$set(e.formOnChecking.form,"shop_category_list",t)},expression:"formOnChecking.form.shop_category_list"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:6,offset:1}},[r("el-form-item",{attrs:{label:"供应链绑定：",prop:"supply_bind_status"}},[r("el-select",{model:{value:e.formOnChecking.form.supply_bind_status,callback:function(t){e.$set(e.formOnChecking.form,"supply_bind_status",t)},expression:"formOnChecking.form.supply_bind_status"}},[r("el-option",{attrs:{label:"全部",value:""}}),e._v(" "),r("el-option",{attrs:{label:"是",value:"30"}}),e._v(" "),r("el-option",{attrs:{label:"否",value:"10"}}),e._v(" "),r("el-option",{attrs:{label:"部分",value:"20"}})],1)],1)],1),e._v(" "),r("el-col",{attrs:{span:7,offset:1}},[r("el-form-item",{attrs:{label:"销售价格："}},[r("el-col",{attrs:{span:11}},[r("el-form-item",{attrs:{prop:"min_price"}},[r("el-input",{model:{value:e.formOnChecking.form.min_price,callback:function(t){e.$set(e.formOnChecking.form,"min_price",t)},expression:"formOnChecking.form.min_price"}})],1)],1),e._v(" "),r("el-col",{attrs:{span:2}},[e._v("到")]),e._v(" "),r("el-col",{attrs:{span:11}},[r("el-form-item",{attrs:{prop:"max_price"}},[r("el-input",{model:{value:e.formOnChecking.form.max_price,callback:function(t){e.$set(e.formOnChecking.form,"max_price",t)},expression:"formOnChecking.form.max_price"}})],1)],1)],1)],1),e._v(" "),r("el-col",{attrs:{span:6,offset:1}},[r("el-form-item",{attrs:{label:"运费模板：",prop:"logistics_template_id"}},[r("el-select",{model:{value:e.formOnChecking.form.logistics_template_id,callback:function(t){e.$set(e.formOnChecking.form,"logistics_template_id",t)},expression:"formOnChecking.form.logistics_template_id"}},e._l(e.deliveryTplUpList,function(e){return r("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:6,offset:1}},[r("el-form-item",{attrs:{label:"条形码：",prop:"bar_code"}},[r("el-input",{model:{value:e.formOnChecking.form.bar_code,callback:function(t){e.$set(e.formOnChecking.form,"bar_code",t)},expression:"formOnChecking.form.bar_code"}})],1)],1)],1),e._v(" "),r("el-row",[r("el-col",{attrs:{span:6,offset:9}},[r("el-button",{attrs:{type:"primary"},on:{click:e.search}},[e._v("搜索")]),e._v(" "),r("el-button",{attrs:{type:"default"},on:{click:e.resetForm}},[e._v("清空条件")]),e._v(" "),r("el-button",{attrs:{size:"medium"},on:{click:e.exportGoodTable}},[e._v("导出")])],1)],1)],1),e._v(" "),r("div",{staticClass:"table"},[r("table-view",{attrs:{tableName:e.formOnChecking.name,selection:!0,loading:e.formOnChecking.loading,columns:e.formOnChecking.columns,pageList:e.formOnChecking.list},on:{"select-change":e.handleSelectChange}})],1),e._v(" "),r("pagination-view",{directives:[{name:"show",rawName:"v-show",value:e.formOnChecking.list.length,expression:"formOnChecking.list.length"}],attrs:{paginationName:e.formOnChecking.name,total:e.formOnChecking.total,currentPage:e.formOnChecking.form.page},on:{"size-change":e.handleSizeChange,"current-change":e.handleNumberChange}}),e._v(" "),r("table",{attrs:{id:"export-form"}},[e._m(0),e._v(" "),e._l(e.exportList,function(t,a){return r("tr",{key:a},[r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.id))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s("("+t.art_no))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s("("+t.title))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.brand))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s("("+t.barcode))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.store))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.sku_id))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.spec_text))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.sell_price))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.category_primary))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.category_secondary))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.category_third))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.trade_type))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.tax_rate))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.status))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.weight))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.freight_template))]),e._v(" "),r("td",{staticStyle:{"mso-number-format":"'\\@'"}},[e._v(e._s(t.free_refund))])])})],2)],1)},staticRenderFns:[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("tr",[r("td",[e._v("商品id")]),e._v(" "),r("td",[e._v("商品货号")]),e._v(" "),r("td",[e._v("商品名称")]),e._v(" "),r("td",[e._v("品牌")]),e._v(" "),r("td",[e._v("条形码")]),e._v(" "),r("td",[e._v("库存")]),e._v(" "),r("td",[e._v("SKU-ID")]),e._v(" "),r("td",[e._v("规格")]),e._v(" "),r("td",[e._v("售价")]),e._v(" "),r("td",[e._v("一级类目")]),e._v(" "),r("td",[e._v("二级类目")]),e._v(" "),r("td",[e._v("三级类目")]),e._v(" "),r("td",[e._v("贸易类型")]),e._v(" "),r("td",[e._v("税率")]),e._v(" "),r("td",[e._v("状态")]),e._v(" "),r("td",[e._v("商品重量(kg)")]),e._v(" "),r("td",[e._v("运费模板")]),e._v(" "),r("td",[e._v("是否支持七天无理由")])])}]};var g=r("C7Lr")(p,u,!1,function(e){r("had5")},"data-v-48683b5d",null);t.default=g.exports},had5:function(e,t){}});