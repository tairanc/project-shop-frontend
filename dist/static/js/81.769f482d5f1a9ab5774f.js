webpackJsonp([81],{"/rCP":function(e,t){},tGQK:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=o("SZCj"),n=(o("kvg+"),{data:function(){return{loading:!1,addVisibleid:!1,selectVisible:!1,goodsIds:"",itemList:[],total:0,goodsVisible:!1,couponInfo:{coupon_id:void 0},pageInfo:{page:1,page_size:10,coupon_id:void 0},couponDetail:{extend:{}},columns:[{label:"商品ID",field:"id",align:"center"},{label:"商品名称",align:"center",isGood:1},{label:"市场价(元)",field:"market_price",align:"center"},{label:"标准售价(元)",field:"sell_price",align:"center"}]}},methods:{getCouponDetail:function(e){var t=this;i.a.getShopcoupon(e).then(function(e){t.couponDetail=e.data;var o=[];o.push(e.data.item),t.itemList=o})},checkexport:function(){this.$router.push({name:"checkexport",query:{id:this.couponInfo.coupon_id}})},backList:function(){this.$router.push({name:"exempt"})}},components:{TableView:o("1G+u").a},computed:{platform:function(){var e="",t=this.couponDetail.applicable_platform;if(void 0!=t){-1!=t.indexOf("ALL")&&(e+="全平台，");var o=0;return-1!=t.indexOf("PC")&&(e+="PC端，",o+=1),-1!=t.indexOf("WX")&&(e+="微信端，",o+=1),-1!=t.indexOf("APP")&&(e+="APP端，",o+=1),-1!=t.indexOf("WAP")&&(e+="WAP端，",o+=1),4==o&&(e="全平台，"),e.slice(0,-1)}}},created:function(){this.couponInfo.coupon_id=this.$route.query.id,this.getCouponDetail(this.couponInfo)}}),l={render:function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"checkexempt"},[o("div",{staticClass:"content"},[o("h3",[e._v("优惠券信息")]),e._v(" "),o("el-row",[o("el-col",[o("p",[e._v("优惠券ID： "+e._s(e.couponDetail.id))])]),e._v(" "),o("el-col",[o("p",[e._v("优惠券名称： "+e._s(e.couponDetail.name))])]),e._v(" "),o("el-col",[o("p",[e._v("发放数量： "+e._s(e.couponDetail.send_quantity))])]),e._v(" "),o("el-col",[o("p",[e._v("每人每张限领： "+e._s(e.couponDetail.user_obtain_limit))])]),e._v(" "),o("el-col",[o("p",[e._v("适用平台： "+e._s(e.platform))])]),e._v(" "),o("el-col",[o("p",[e._v("可免单的商品ID： "+e._s(e.couponDetail.item_id))])]),e._v(" "),o("el-col",[o("p",[e._v("可免单的商品别名： "+e._s(e.couponDetail.alias))])]),e._v(" "),o("el-col",{staticClass:"mt20",attrs:{span:16}},[o("table-view",{attrs:{loading:e.loading,columns:e.columns,pageList:e.itemList}})],1),e._v(" "),o("el-col",[o("p",[e._v("领取开始时间： "+e._s(e.couponDetail.obtain_start_time))])]),e._v(" "),o("el-col",[o("p",[e._v("领取结束时间： "+e._s(e.couponDetail.obtain_end_time))])]),e._v(" "),o("el-col",[o("p",[e._v("有效期： "+e._s(e.couponDetail.expiry_date))])])],1)],1),e._v(" "),o("el-row",{staticClass:"mt40",attrs:{type:"flex",justify:"center"}},[o("el-col",{attrs:{span:4}},[o("el-button",{attrs:{type:"primary"},on:{click:e.checkexport}},[e._v("查看已导出的兑换码")])],1),e._v(" "),o("el-col",{attrs:{span:2}},[o("el-button",{attrs:{type:"primary"},on:{click:e.backList}},[e._v("返回")])],1)],1)],1)},staticRenderFns:[]};var a=o("C7Lr")(n,l,!1,function(e){o("/rCP")},"data-v-3fbe506c",null);t.default=a.exports}});