webpackJsonp([19],{COTu:function(e,t,s){"use strict";var r=s("2AkA");t.a={getGroupList:function(e){return Object(r.a)({method:"get",url:"/trmall/groupbuy/getGroupBuyList",params:e})},downGroup:function(e){return Object(r.a)({method:"post",url:"/trmall/groupbuy/closeGroupBuyItem",data:e})},importItemsById:function(e){return Object(r.a)({method:"post",url:"/trmall/itemselect/importItems",data:e})},createGroupBuy:function(e){return Object(r.a)({method:"post",url:"/trmall/groupbuy/createGroupBuy",data:e})}}},DFNU:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=s("1G+u"),o=s("3cXf"),i=s.n(o),a=s("kvg+"),l={data:function(){return{goodsVisible:!1,total:0,warehouses:[],categoryList:[],category:[],brandList:[],selectForm:{warehouse_id:"",brand_id:"",categories:{primary_id:"",secondary_id:"",tertiary_id:""},title:"",trade_type:"",min_price:"",max_price:"",promotion_type:"",promotion_id:"",page:1,page_size:14,only_shelving:""},goods:[],selectItems:[]}},props:{selectVisible:{type:Boolean,default:!1},promotionType:{type:String,default:""},promotionId:{type:String,default:""},subType:{type:String,default:"item"},onlyShelving:{type:String,default:""},selectList:{type:Array,default:function(){return[]}}},watch:{selectList:function(){var e=this;this.goods.map(function(t){-1!=e.selectList.indexOf(t.id)&&(t.selected=!0)}),this.selectItems=this.selectList},selectVisible:function(){this.selectVisible&&(this.selectForm.page=1,this.getSelectItemList(this.selectForm))}},methods:{pageChange:function(e){this.selectForm.page=e,this.getSelectItemList(this.selectForm)},resetForm:function(){this.$refs.selectForm.resetFields(),this.selectForm.max_price="",this.category=[]},getWarehuoses:function(){var e=this;a.a.getWarehouse({page:1,page_size:-1}).then(function(t){0==t.code&&(e.warehouses=t.data.data)})},getCategories:function(){var e=this;a.a.getCategory().then(function(t){if(0===t.code){for(var s=0;s<t.data.length;s++)if(t.data[s].sub){t.data[s].children=t.data[s].sub;for(var r=t.data[s].children.length,o=0;o<r;o++)t.data[s].children[o].sub&&(t.data[s].children[o].children=t.data[s].children[o].sub)}e.categoryList=t.data}else e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:t.message,type:"warning"})}).catch(function(t){e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:t.message,type:"error"})})},getBrandList:function(){var e=this,t=this.category.length,s={};switch(this.selectForm.brand_id="",t){case 1:s={category_id:this.category[0],level:1};break;case 2:s={category_id:this.category[1],level:2};break;case 3:s={category_id:this.category[2],level:3}}a.a.getRelBrandListByCategoryId(s).then(function(t){0==t.code&&(e.brandList=t.data)})},searchBrand:function(e){var t=this,s=this.category.length,r={};switch(this.selectForm.brand_id="",s){case 1:r={category_id:this.category[0],level:1,brand_name:e};break;case 2:r={category_id:this.category[1],level:2,brand_name:e};break;case 3:r={category_id:this.category[2],level:3,brand_name:e};break;default:r={category_id:"",level:"",brand_name:e}}a.a.getRelBrandListByCategoryId(r).then(function(e){0==e.code&&(t.brandList=e.data)})},remoteMethod:function(e){this.searchBrand(e)},getSelectItemList:function(e){var t=this;switch(this.selectForm.categories={primary_id:"",secondary_id:"",tertiary_id:""},this.category.length){case 0:break;case 1:this.selectForm.categories.primary_id=this.category[0];break;case 2:this.selectForm.categories.secondary_id=this.category[1];break;case 3:this.selectForm.categories.tertiary_id=this.category[2]}this.selectForm.categories=i()(this.selectForm.categories),a.a.getSelectItemList(e).then(function(e){0==e.code&&(t.goods=e.data.list,t.total=e.data.total_count,t.goods.map(function(e){-1!=t.selectItems.indexOf(e.id)&&(e.selected=!0)}))})},handleSelect:function(e){if(this.selectItems.length>=1)return e.selected=!1,this.selectItems=this.selectItems.filter(function(t){return t!=e.id}),!1;e.selected=!e.selected,e.selected?this.selectItems.push(e.id):this.selectItems=this.selectItems.filter(function(t){return t!=e.id})},selectAll:function(){var e=this;this.goods.map(function(t){t.selected=!0,-1==e.selectItems.indexOf(t.id)&&e.selectItems.push(t.id)})},cancelAll:function(){var e=this;this.goods.map(function(t){t.selected=!1,e.selectItems=e.selectItems.filter(function(e){return e!=t.id})})},handleCancel:function(){var e=this;this.goodsVisible=!1,this.$emit("visible-change",this.goodsVisible),this.goods.map(function(t){-1!=e.selectList.indexOf(t.id)&&(t.selected=!0)}),this.selectItems=this.selectList,this.resetForm()},handleSubmit:function(){this.selectItems.length?(this.goodsVisible=!1,this.$emit("visible-change",this.goodsVisible),this.$emit("choose-submit",this.selectItems)):this.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:"请选择商品",type:"warning"})}},created:function(){var e=this;this.goodsVisible=this.selectVisible,this.selectForm.promotion_type=this.promotionType,this.selectForm.promotion_id=this.promotionId,this.selectForm.sub_type=this.subType,this.selectForm.only_shelving=this.onlyShelving,this.getWarehuoses(),this.getCategories(),a.a.getRelBrandListByCategoryId().then(function(t){0==t.code&&(e.brandList=t.data)})}},n={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-dialog",{staticClass:"dialog",attrs:{width:"70%",title:"选择商品",visible:e.selectVisible,"show-close":!1}},[s("el-form",{ref:"selectForm",staticClass:"mt30",attrs:{inline:!0,model:e.selectForm,size:"small"}},[s("el-form-item",{attrs:{prop:"warehouse_id"}},[s("el-select",{attrs:{placeholder:"仓库"},model:{value:e.selectForm.warehouse_id,callback:function(t){e.$set(e.selectForm,"warehouse_id",t)},expression:"selectForm.warehouse_id"}},e._l(e.warehouses,function(e){return s("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),s("el-form-item",[s("el-cascader",{attrs:{placeholder:"分类",options:e.categoryList,"show-all-levels":!1,"change-on-select":""},on:{change:e.getBrandList},model:{value:e.category,callback:function(t){e.category=t},expression:"category"}})],1),e._v(" "),s("el-form-item",{attrs:{prop:"brand_id"}},[s("el-select",{attrs:{placeholder:"品牌",filterable:"",remote:"","remote-method":e.remoteMethod},model:{value:e.selectForm.brand_id,callback:function(t){e.$set(e.selectForm,"brand_id",t)},expression:"selectForm.brand_id"}},e._l(e.brandList,function(e){return s("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),s("el-form-item",{attrs:{prop:"trade_type"}},[s("el-select",{attrs:{placeholder:"贸易类型"},model:{value:e.selectForm.trade_type,callback:function(t){e.$set(e.selectForm,"trade_type",t)},expression:"selectForm.trade_type"}},[s("el-option",{attrs:{label:"国内贸易",value:10}}),e._v(" "),s("el-option",{attrs:{label:"海淘",value:20}}),e._v(" "),s("el-option",{attrs:{label:"跨境保税",value:30}}),e._v(" "),s("el-option",{attrs:{label:"跨境直邮",value:40}})],1)],1),e._v(" "),s("el-form-item",{attrs:{prop:"title"}},[s("el-input",{staticClass:"title",attrs:{placeholder:"商品关键字"},model:{value:e.selectForm.title,callback:function(t){e.$set(e.selectForm,"title",t)},expression:"selectForm.title"}})],1),e._v(" "),s("el-form-item",{attrs:{label:"价格：",prop:"min_price"}},[s("el-input",{model:{value:e.selectForm.min_price,callback:function(t){e.$set(e.selectForm,"min_price",t)},expression:"selectForm.min_price"}}),e._v("\n        —\n        "),s("el-input",{model:{value:e.selectForm.max_price,callback:function(t){e.$set(e.selectForm,"max_price",t)},expression:"selectForm.max_price"}})],1),e._v(" "),s("el-form-item",[s("el-button",{attrs:{type:"warning"},on:{click:function(t){return e.getSelectItemList(e.selectForm)}}},[e._v("搜索")])],1),e._v(" "),s("el-form-item",[s("el-button",{attrs:{type:"text"},on:{click:e.resetForm}},[e._v("清空筛选条件")])],1)],1),e._v(" "),s("div",{staticClass:"content"},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.goods.length,expression:"goods.length"}],staticClass:"goods"},e._l(e.goods,function(t){return s("div",{key:t.id,staticClass:"item",class:t.selected?"active":"",on:{click:function(s){return e.handleSelect(t)}}},[s("div",{staticClass:"thumb"},[s("img",{attrs:{src:t.primary_image}})]),e._v(" "),s("div",{staticClass:"title"},[e._v(e._s(t.title))])])}),0),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:!e.goods.length,expression:"!goods.length"}],staticClass:"goods"},[s("div",{staticClass:"no-goods"},[e._v("暂无数据")])]),e._v(" "),s("el-pagination",{directives:[{name:"show",rawName:"v-show",value:e.goods.length,expression:"goods.length"}],staticClass:"pagination",attrs:{"current-page":e.selectForm.page,"page-size":e.selectForm.page_size,layout:"total, prev, pager, next, jumper",total:e.total||0},on:{"current-change":e.pageChange}})],1),e._v(" "),s("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:e.handleCancel}},[e._v("取 消")]),e._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:e.handleSubmit}},[e._v("确 定")])],1)],1)},staticRenderFns:[]};var c=s("C7Lr")(l,n,!1,function(e){s("c2PB")},"data-v-0f5be378",null).exports,d=s("COTu"),u=/^-?[1-9]+[0-9]*$/,p={data:function(){var e=this;return{selectVisible:!1,goodsList:[],loading:!1,type:"GroupBuy",dist:!1,addGroup:{group_person:"",group_price:"",group_type:"Normal",user_max_join:"",open_group_number:"",start_time:"",end_time:"",item_ids:[]},addRules:{group_person:[{validator:function(e,t,s){t?t<2?s(new Error("请输入大于等于2的数值")):s():s(new Error("请填写必填项目"))},trigger:"blur"}],group_price:[{validator:function(e,t,s){t?t<0?s(new Error("请输入大于等于0的数值")):s():s(new Error("请填写必填项目"))},trigger:"blur"}],user_max_join:[{validator:function(e,t,s){t?t<1||t>10||!u.test(t)?s(new Error("请输入大于等于1/小于等于10/有效的整数值")):s():s(new Error("请填写必填项目"))},trigger:"blur"}],open_group_number:[{validator:function(e,t,s){t&&(t<1||!u.test(t))?s(new Error("请输入大于等于1/有效的整数值")):s()},trigger:"blur"}],start_time:[{validator:function(e,t,s){t?s():s(new Error("请填写必填项目"))},trigger:"blur"}],end_time:[{validator:function(e,t,s){t?s():s(new Error("请填写必填项目"))},trigger:"blur"}]},columns:[{label:"商品ID",field:"id",align:"center"},{label:"商品名称",align:"center",isGood:1},{label:"标准售价(元)",field:"sell_price",align:"center"},{label:"操作",align:"center",actions:[{label:"删除",type:"primary",size:"mini",click:function(t,s){e.deleteGoods(s.id)}}]}]}},methods:{goodsFilter:function(e){for(var t=0;t<e.length;t++){var s=!1;if(0!=this.goodsList.length)for(var r=0;r<this.goodsList.length;r++)e[t].id==this.goodsList[r].id&&(s=!0);s||this.goodsList.push(e[t])}},handleAdd:function(e){var t=this;d.a.importItemsById({item_id:e}).then(function(e){var s=e.data,r="";if(0!=s.itemList.length&&t.goodsFilter(s.itemList),0!=s.inValidItems.length)for(var o=0;o<s.inValidItems.length;o++)r+="<p>异常商品ID:"+s.inValidItems[o]+"</p>";if(0!=s.unsatisfiedItems.length)for(var i=0;i<s.unsatisfiedItems.length;i++)r+="<p>参加了不可叠加的商品:"+s.unsatisfiedItems[i]+"</p>";r&&t.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:r,type:"warning"})})},handleVisible:function(e){this.selectVisible=e},deleteGoods:function(e){this.goodsList=this.goodsList.filter(function(t){return t.id!=e})},createGroupBuy:function(e){var t=this;d.a.createGroupBuy(e).then(function(e){t.$message({type:"success",message:"拼团活动创建成功"}),t.$router.push({name:"group"})}).catch(function(e){this.$message({message:e.message,type:"error"})})},changeType:function(){"Rookie"==this.addGroup.group_type?(this.addGroup.user_max_join=1,this.dist=!0):this.dist=!1},commitGroup:function(){var e=this;this.$refs.addGroupForm.validate(function(t){if(!t)return!1;e.addGroup.item_ids=[];var s=e.addGroup;if(e.goodsList.forEach(function(e){s.item_ids.push(e.id)}),e.addGroup.end_time<e.addGroup.start_time)return e.$message({message:"活动结束时间应该大于活动开始时间",type:"warning"}),!1;""==e.addGroup.item_ids?e.$message({message:"请选择商品",type:"warning"}):e.createGroupBuy(e.addGroup)})},backList:function(){this.$router.push({name:"group"})}},components:{groupGoods:c,TableView:r.a}},m={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("section",{staticClass:"group"},[s("el-button",{attrs:{type:"danger"},on:{click:function(t){e.selectVisible=!0}}},[e._v("选择商品")]),e._v(" "),s("p"),e._v(" "),s("group-goods",{attrs:{selectVisible:e.selectVisible,promotionType:e.type},on:{"visible-change":e.handleVisible,"choose-submit":e.handleAdd}}),e._v(" "),s("div",{staticClass:"pt20"},[s("table-view",{ref:"goodsTable",attrs:{loading:e.loading,columns:e.columns,pageList:e.goodsList}})],1),e._v(" "),s("el-form",{ref:"addGroupForm",attrs:{model:e.addGroup,rules:e.addRules,"label-width":"128px"}},[s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"group_person",label:"拼团人数："}},[s("el-input",{attrs:{type:"number"},model:{value:e.addGroup.group_person,callback:function(t){e.$set(e.addGroup,"group_person",t)},expression:"addGroup.group_person"}})],1)],1),e._v(" "),s("el-col",{attrs:{span:4}},[s("p",{staticClass:"tips"},[e._v("至少2人")])])],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"group_price",label:"拼团价："}},[s("el-input",{attrs:{type:"number"},model:{value:e.addGroup.group_price,callback:function(t){e.$set(e.addGroup,"group_price",t)},expression:"addGroup.group_price"}})],1)],1),e._v(" "),s("el-col",{attrs:{span:6}},[s("p",{staticClass:"tips"},[e._v("请参考最低售价")])])],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"group_type",label:"拼团类型："}},[s("el-select",{on:{change:e.changeType},model:{value:e.addGroup.group_type,callback:function(t){e.$set(e.addGroup,"group_type",t)},expression:"addGroup.group_type"}},[s("el-option",{attrs:{value:"Normal",label:"普通拼团"}}),e._v(" "),s("el-option",{attrs:{value:"Rookie",label:"新人拼团"}})],1)],1)],1),e._v(" "),s("el-col",{attrs:{span:6}},[s("p",{staticClass:"tips"},[e._v("选择新人团后，参团人员仅限新用户")])])],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"user_max_join",label:"每人最多参团次数:"}},[s("el-input",{attrs:{type:"number",disabled:e.dist},model:{value:e.addGroup.user_max_join,callback:function(t){e.$set(e.addGroup,"user_max_join",t)},expression:"addGroup.user_max_join"}})],1)],1),e._v(" "),s("el-col",{attrs:{span:6}},[s("p",{staticClass:"tips"},[e._v("次")])])],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"open_group_number",label:"最高开团次数："}},[s("el-input",{attrs:{type:"number"},model:{value:e.addGroup.open_group_number,callback:function(t){e.$set(e.addGroup,"open_group_number",t)},expression:"addGroup.open_group_number"}})],1)],1),e._v(" "),s("el-col",{attrs:{span:6}},[s("p",{staticClass:"tips"},[e._v("次 请输入最高可开团数，不填写时不做限制")])])],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"start_time",label:"活动开始时间："}},[s("el-date-picker",{attrs:{type:"datetime",placeholder:"活动开始时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.addGroup.start_time,callback:function(t){e.$set(e.addGroup,"start_time",t)},expression:"addGroup.start_time"}})],1)],1)],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:10,offset:1}},[s("el-form-item",{attrs:{prop:"end_time",label:"活动结束时间："}},[s("el-date-picker",{attrs:{type:"datetime",placeholder:"活动结束时间",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss"},model:{value:e.addGroup.end_time,callback:function(t){e.$set(e.addGroup,"end_time",t)},expression:"addGroup.end_time"}})],1)],1)],1),e._v(" "),s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.commitGroup()}}},[e._v("提交")]),e._v(" "),s("el-button",{on:{click:function(t){return e.backList()}}},[e._v("取消")])],1)],1)],1)},staticRenderFns:[]};var g=s("C7Lr")(p,m,!1,function(e){s("GfGP")},null,null);t.default=g.exports},GfGP:function(e,t){},c2PB:function(e,t){}});