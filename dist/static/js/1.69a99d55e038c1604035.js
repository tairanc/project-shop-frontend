webpackJsonp([1],{"7cL9":function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s("3cXf"),o=s.n(i),l=s("1G+u"),a=s("wSwi"),n=s("S7CR"),r=s("6PaB"),d={data:function(){return{showBtnBatch:!1,promotionId:-1,promotionType:"FullDiscount",isfullreduce:!0,isEditfullreduce:-1,reduceList:[{full:"",percent:""}],checked:!1,detailInfo:{promotion_id:"",page:1,page_size:-1},loading:!1,addVisibleid:!1,selectVisible:!1,goodsIds:"",goodsList:[],commitData:{},addCoupon:{promotion_name:"",items:"",start_time:"",end_time:""},addRules:{promotion_name:[{required:!0,message:"请输入1~60个字符",trigger:"blur"},{min:1,max:60,message:"请输入1~60个字符",trigger:"blur"}],start_time:[{required:!0,message:"请选择领取开始时间",trigger:"change"}],end_time:[{required:!0,message:"请选择领取结束时间",trigger:"change"}]}}},methods:{addReduceList:function(){if(this.reduceList.length>=5)this.$message({message:"最多添加5条规则!",type:"warning"});else{this.reduceList.push({full:"",percent:""})}},deleteRedece:function(e){this.reduceList.splice(e,1)},inputFull:function(e){new RegExp("^[0-9]*[1-9][0-9]*$").test(e.full)||this.$set(e,"full","")},inputReduce:function(e){var t=new RegExp("^[0-9]*[1-9][0-9]*$").test(e.percent);this.isfullreduce?t?(e.percent>=100||e.percent<30)&&this.$message.error("折扣力度需控制在三折及以上"):this.$message.error("请输入有效的整数值"):t||this.$message.error("请输入有效的整数值")},addItemBomb:function(){this.addVisibleid=!0,this.goodsIds=""},addGoodsById:function(){var e=this;if(this.goodsIds){var t=this,s=JSON.parse(o()(this.goodsIds));if(0==this.showBtnBatch){var i=[];-1!=this.goodsIds.indexOf(",")?i=this.goodsIds.split(","):-1!=this.goodsIds.indexOf("，")?i=this.goodsIds.split("，"):i.push(this.goodsIds),this.goodsList.map(function(e,t){-1==i.indexOf(e.item_id)&&i.push(e.item_id)}),s=i.join(",")}var l={item_id:s,promotion_type:t.promotionType,return_by:"sku"};-1!=t.isEditfullreduce&&(l.promotion_id=t.$route.query.id),n.a.importItemsById(l).then(function(s){var i=s.data,o="";if(0!=i.itemList.length&&t.goodsFilter(i.itemList),0!=i.inValidItems.length)for(var l=0;l<i.inValidItems.length;l++)o+="<p>异常商品ID:"+i.inValidItems[l]+"</p>";if(0!=i.unsatisfiedItems.length)for(var a=0;a<i.unsatisfiedItems.length;a++)o+="<p>参加了不可叠加的商品:"+i.unsatisfiedItems[a]+"</p>";o&&e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:o,type:"warning"})})}this.goodsIds="",this.addVisibleid=!1},goodsFilter:function(e){for(var t=0;t<e.length;t++){var s=!1;if(0!=this.goodsList.length)for(var i=0;i<this.goodsList.length;i++)e[t].id==this.goodsList[i].id&&(s=!0);s||this.goodsList.push(e[t])}var o=[];e.map(function(e){o.push(e.item_id)});for(var l=0;l<this.goodsList.length;l++)-1==o.indexOf(this.goodsList[l].item_id)&&(this.goodsList.splice(l,1),l--)},deleteGoods:function(e){this.goodsList=this.goodsList.filter(function(t){return t.item_id!=e})},commitCoupon:function(){var e=this,t=[];if(this.goodsList.forEach(function(e){var s={item_id:e.item_id,sku_id:e.sku_id,id:e.id};t.push(s)}),this.isfullreduce)this.addCoupon.rules=o()(this.reduceList);else{this.addCoupon.has_high_limit=this.checked?0:1;var s=[];this.reduceList.length>0&&this.reduceList.map(function(e,t){var i={limit_money:e.full,deduct_money:e.percent};s.push(i)}),this.addCoupon.rules=o()(s)}if(this.addCoupon.items=o()(t),this.commitData=this.addCoupon,""==this.addCoupon.items)this.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:"请选择优惠券商品～",type:"warning"});else{var i=this;this.$refs.addCoupon.validate(function(t){if(!t)return!1;-1!=e.isEditfullreduce&&(i.commitData.promotion_id=i.$route.query.id),n.a.createPlay(i.commitData,e.isfullreduce,e.isEditfullreduce).then(function(t){if(0==t.code){e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:"成功",type:"success"});var s=e.isfullreduce?"reducebreak":"reducefull";e.$router.push({name:s})}else e.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:t.message,type:"warning"})})})}},backList:function(){var e=this.isfullreduce?"reducebreak":"reducefull";this.$router.push({name:e})},handleVisible:function(e){this.selectVisible=e},handleAdd:function(e){var t=this,s={item_id:e,promotion_type:this.promotionType,return_by:"sku"};-1!=this.isEditfullreduce&&(s.promotion_id=this.$route.query.id),n.a.importItemsById(s).then(function(e){var s=e.data,i="";if(0!=s.itemList.length&&t.goodsFilter(s.itemList),0!=s.inValidItems.length)for(var o=0;o<s.inValidItems.length;o++)i+="<p>异常商品ID:"+s.inValidItems[o]+"</p>";if(0!=s.unsatisfiedItems.length)for(var l=0;l<s.unsatisfiedItems.length;l++)i+="<p>参加了不可叠加的商品:"+s.unsatisfiedItems[l]+"</p>";i&&t.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:i,type:"warning"})})},spanMethod:function(e){e.row,e.column;var t=e.rowIndex,s=e.columnIndex;if(0===s||1===s||2===s||7===s)return 1==this.spanArr[t]?{rowspan:0,colspan:0}:0==this.spanArr[t]?{rowspan:1,colspan:1}:{rowspan:this.spanArr[t],colspan:1}},handleEdit:function(e){this.goodsList.map(function(t){t.item_id==e.item_id&&(t.edit=!0)})},getDetail:function(e){var t=this;n.a.getShopcoupon(e,this.isfullreduce).then(function(e){if(t.addCoupon=e.data,t.addCoupon.promotion_name=e.data.name,t.goodsList=e.data.itemList.list,t.total=e.data.itemList.total_count,t.showBtnBatch=10!=e.data.status,t.isfullreduce)t.reduceList=t.addCoupon.rules;else{var s=[];e.data.rules.rule.length>0&&e.data.rules.rule.map(function(e,t){var i={full:e.limit_money,percent:e.deduct_money};s.push(i)}),t.reduceList=s,t.checked=0==e.data.rules.has_high_limit}})}},components:{TableView:l.a,SelectGoods:a.a},computed:{selectList:function(){var e=[];return this.goodsList.map(function(t){-1==e.indexOf(t.item_id)&&e.push(t.item_id)}),e},spanArr:function(){return Object(r.a)(this.goodsList)}},created:function(){this.isfullreduce="addBreakReduce"===this.$route.name||"editBreakReduce"===this.$route.name,this.promotionType="addBreakReduce"===this.$route.name||"editBreakReduce"===this.$route.name?"FullDiscount":"FullMinus","editBreakReduce"===this.$route.name&&(this.detailInfo.promotion_id=this.$route.query.id,this.promotionId=this.$route.query.id.toString(),this.getDetail(this.detailInfo),this.isEditfullreduce="editBreakReduce"),"editFullReduce"===this.$route.name&&(this.detailInfo.promotion_id=this.$route.query.id,this.promotionId=this.$route.query.id.toString(),this.getDetail(this.detailInfo),this.isEditfullreduce="editFullReduce")}},u={render:function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("el-form",{ref:"addCoupon",staticClass:"addreduce",attrs:{model:e.addCoupon,rules:e.addRules,"label-width":"120px","label-position":"left"}},[s("div",{staticClass:"basic"},[s("el-row",[s("el-col",{attrs:{span:15}},[s("el-form-item",{attrs:{label:"活动名称:",prop:"promotion_name"}},[s("el-input",{attrs:{placeholder:"活动名称",size:"small"},model:{value:e.addCoupon.promotion_name,callback:function(t){e.$set(e.addCoupon,"promotion_name",t)},expression:"addCoupon.promotion_name"}})],1)],1)],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:3}},[s("el-button",{attrs:{type:"primary",size:"small"},on:{click:e.addReduceList}},[s("span",{staticClass:"el-icon-plus"}),e._v("\n                  添加"+e._s(e.isfullreduce?"满折":"满减")+"区间规则\n              ")])],1),e._v(" "),s("el-col",{attrs:{span:10}},[s("p",{staticClass:"tips"},[e._v("最多可同时设置5条"+e._s(e.isfullreduce?"满折":"满减")+"区间规则")])])],1),e._v(" "),e.reduceList.length>0?s("el-row",{staticClass:"addreduce-basic-rule"},[e._l(e.reduceList,function(t,i){return s("el-col",{key:i,attrs:{span:20}},[s("el-col",{attrs:{span:2}},[s("span",[e._v("消费满")])]),e._v(" "),s("el-col",{attrs:{span:4}},[s("el-input",{attrs:{size:"small",type:"number",placeholder:"请输入有效的整数值"},on:{blur:function(s){return e.inputFull(t)}},model:{value:t.full,callback:function(s){e.$set(t,"full",s)},expression:"item.full"}})],1),e._v(" "),s("el-col",{attrs:{span:2}},[s("span",[e._v(e._s(e.isfullreduce?"件，给予":"元，减"))])]),e._v(" "),s("el-col",{attrs:{span:4}},[s("el-input",{attrs:{size:"small",type:"number",placeholder:"请输入有效的整数值"},on:{blur:function(s){return e.inputReduce(t)}},model:{value:t.percent,callback:function(s){e.$set(t,"percent",s)},expression:"item.percent"}})],1),e._v(" "),s("el-col",{attrs:{span:2}},[s("span",[e._v(e._s(e.isfullreduce?"%折扣":"元"))])]),e._v(" "),s("el-col",{attrs:{span:2}},[s("span",{staticClass:"has-bluecolor",on:{click:function(t){return e.deleteRedece(i)}}},[e._v("删除")])]),e._v(" "),e.isfullreduce&&t.full.length>0&&t.percent.length>0?s("el-col",{attrs:{span:6}},[s("span",{staticClass:"has-redcolor"},[e._v("注意：页面将显示"+e._s(t.full)+"件"+e._s(t.percent/10)+"折")])]):e._e()],1)}),e._v(" "),e.isfullreduce?e._e():s("el-col",{attrs:{span:20}},[s("el-checkbox",{model:{value:e.checked,callback:function(t){e.checked=t},expression:"checked"}},[e._v("上不封顶（若勾选，则按照最后一条规则成比例优惠递减，如最后一条设置了满200减20，则默认为满400减40，满800减80，以此类推。)")])],1)],2):e._e(),e._v(" "),s("el-row",[s("el-col",{attrs:{span:15}},[s("el-form-item",{attrs:{label:"活动开始日期:",prop:"start_time"}},[s("el-date-picker",{attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"活动开始日期",size:"small"},model:{value:e.addCoupon.start_time,callback:function(t){e.$set(e.addCoupon,"start_time",t)},expression:"addCoupon.start_time"}})],1)],1)],1),e._v(" "),s("el-row",[s("el-col",{attrs:{span:15}},[s("el-form-item",{attrs:{label:"活动结束时间:",prop:"end_time"}},[s("el-date-picker",{attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss",placeholder:"活动结束时间",size:"small"},model:{value:e.addCoupon.end_time,callback:function(t){e.$set(e.addCoupon,"end_time",t)},expression:"addCoupon.end_time"}})],1)],1)],1)],1),e._v(" "),s("div",{staticClass:"goods"},[s("el-row",[s("el-col",{staticClass:"title"},[s("p",[e._v("选择适用商品")])])],1),e._v(" "),s("el-row",{staticClass:"pl20"},[s("el-col",[s("el-button",{attrs:{type:"danger"},on:{click:function(t){e.selectVisible=!0}}},[e._v("选择商品")]),e._v(" "),s("el-button",{attrs:{type:"danger"},on:{click:e.addItemBomb}},[e._v("批量导入商品")])],1)],1)],1),e._v(" "),s("div",{staticClass:"all"},[s("el-row",[s("el-col",{attrs:{span:24}},[s("el-table",{staticClass:"table",attrs:{data:e.goodsList,border:"",align:"center","span-method":e.spanMethod}},[s("el-table-column",{attrs:{align:"center",label:"商品ID",prop:"item_id"}}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"商品名称"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("a",{staticClass:"goods_url",attrs:{href:e.defaultUrl("item_id",t.row),target:"_blank"}},[e._v(e._s(t.row.title))])]}}])}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"属性",prop:"spec_text"}}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"市场价（元）"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("span",{directives:[{name:"show",rawName:"v-show",value:!t.row.edit,expression:"!scope.row.edit"}]},[e._v(e._s(t.row.market_price))]),e._v(" "),s("el-input",{directives:[{name:"show",rawName:"v-show",value:t.row.edit,expression:"scope.row.edit"}],attrs:{size:"mini"},model:{value:t.row.market_price,callback:function(s){e.$set(t.row,"market_price",s)},expression:"scope.row.market_price"}})]}}])}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"标准售价（元）",prop:"sell_price"}}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"可售库存",prop:"store"}}),e._v(" "),s("el-table-column",{attrs:{align:"center",label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[s("el-button",{attrs:{type:"text"},on:{click:function(s){return e.deleteGoods(t.row.item_id)}}},[e._v("删除")])]}}])})],1)],1)],1)],1),e._v(" "),s("el-dialog",{attrs:{width:"500px",title:"请输入商品ID，多个商品ID需用逗号间隔输入",visible:e.addVisibleid},on:{"update:visible":function(t){e.addVisibleid=t}}},[s("el-input",{attrs:{type:"textarea",rows:6,placeholder:"请输入商品ID"},model:{value:e.goodsIds,callback:function(t){e.goodsIds=t},expression:"goodsIds"}}),e._v(" "),s("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[s("el-button",{on:{click:function(t){e.addVisibleid=!1}}},[e._v("取 消")]),e._v(" "),s("el-button",{attrs:{type:"primary"},on:{click:e.addGoodsById}},[e._v("确 定")])],1)],1),e._v(" "),-1!=e.promotionId?s("select-goods",{attrs:{promotionType:e.promotionType,promotionId:e.promotionId,selectList:e.selectList,selectVisible:e.selectVisible},on:{"visible-change":e.handleVisible,"choose-submit":e.handleAdd}}):s("select-goods",{attrs:{promotionType:e.promotionType,selectVisible:e.selectVisible,selectList:e.selectList},on:{"visible-change":e.handleVisible,"choose-submit":e.handleAdd}}),e._v(" "),s("el-row",{attrs:{type:"flex",justify:"center"}},[s("el-button",{attrs:{type:"primary"},on:{click:e.commitCoupon}},[e._v("提交")]),e._v(" "),s("el-button",{on:{click:e.backList}},[e._v("取消")])],1)],1)},staticRenderFns:[]};var c=s("C7Lr")(d,u,!1,function(e){s("CR9Y")},"data-v-dfce0640",null);t.default=c.exports},CR9Y:function(e,t){}});