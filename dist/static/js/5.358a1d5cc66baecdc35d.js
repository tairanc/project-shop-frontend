webpackJsonp([5],{"5CID":function(e,t){},texg:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("hRKE"),o=a.n(r),i=a("kIQj"),s=a("6PaB"),n=/^\d+(.\d{1,2})?$/,l=/^[1-9]\d*$/,f={data:function(){return{form:{template_id:"",name:"",status:1,is_free:0,valuation_type:1,freight_conf:[{item_id:"",area:"",area_label:"全国",start_standard:"",start_freight:"",add_standard:"",add_freight:"",boundary:"0",upper:"",freight:"",first:!0,second:!1,disabledBtn:!0}],is_select:!1,free_conf:[{area:"",area_label:"全国",free_type:1,limit_quantity:"",limit_money:""}]},isAble:!1,freightDialog:!1,freeDialog:!1,areaList:[],defaultProps:{children:"children",label:"label"}}},computed:{freight_areaList:function(){return this.handleAreaList(this.form.freight_conf)},free_areaList:function(){return this.handleAreaList(this.form.free_conf)},spanArr:function(){return Object(s.a)(this.form.freight_conf)}},methods:{objDeepCopy:function(e){var t=e instanceof Array?[]:{};for(var a in e)t[a]="object"===o()(e[a])?this.objDeepCopy(e[a]):e[a];return t},handleArea:function(e){var t=this.$refs[e].getCheckedNodes(),a=t.filter(function(e){return e.children}).map(function(e){return e.value}),r="",o="";return t.filter(function(e){return-1==a.indexOf(e.parentId)}).map(function(e){r+=e.value+",",o+=e.label+","}),r=r.slice(0,-1),o=o.slice(0,-1),{area:r,area_label:o}},handleAreaList:function(e){var t=this,a=e.map(function(e){return e.area}).join(",").slice(1).split(","),r=this.objDeepCopy(this.areaList);return""!=a[0]&&(r.map(function(e){-1!=a.indexOf(e.value)?(t.$set(e,"disabled",!0),e.children.map(function(e){t.$set(e,"disabled",!0)})):e.children.map(function(e){-1!=a.indexOf(e.value)&&t.$set(e,"disabled",!0)})}),r.map(function(e){var a=!0;e.children.map(function(e){!e.disabled&&(a=!1)}),a&&t.$set(e,"disabled",!0)})),r},handleType:function(){this.form.freight_conf=[{item_id:"",area:"",area_label:"全国",start_standard:"",start_freight:"",add_standard:"",add_freight:"",boundary:"0",upper:"",freight:"",first:!0,second:!1,disabledBtn:!0}],this.form.is_select=!1,this.form.free_conf=[{area:"",area_label:"全国",free_type:1,limit_quantity:"",limit_money:""}]},cancelFreight:function(){this.freightDialog=!1,this.$refs.freightTree.setCheckedKeys([])},addFreight:function(){var e=this.handleArea("freightTree");e.area?(this.form.freight_conf.push({item_id:e.area,area:e.area,area_label:e.area_label,start_standard:"",start_freight:"",add_standard:"",add_freight:"",boundary:"0",upper:"",freight:"",first:!0,second:!1,disabledBtn:!0}),this.cancelFreight()):this.$message({showClose:!0,dangerouslyUseHTMLString:!0,message:"请选择地区",type:"warning"})},delFreight:function(e,t){this.form.freight_conf=this.form.freight_conf.filter(function(e){return e.area!=t.area})},delFreightMoney:function(e,t){this.form.freight_conf[e-1].second=!1,this.form.freight_conf[e-1].disabledBtn=!0,this.form.freight_conf[e-1].upper="",this.form.freight_conf.splice(e,1)},addMoney:function(e,t){!isNaN(t.upper)&&t.upper>0&&parseFloat(t.upper)>parseFloat(t.boundary)?(t.second=!0,t.disabledBtn=!1,this.form.freight_conf.splice(e+1,0,{item_id:t.area,area:t.area,area_label:t.area_label,boundary:t.upper,upper:"",freight:"",first:!0,second:!1,disabledBtn:!0})):this.$message({showClose:!0,message:"请填写正确的金额",type:"warning"})},spanMethod:function(e){e.row,e.column;var t=e.rowIndex;if(0===e.columnIndex)return 1==this.spanArr[t]?{rowspan:0,colspan:0}:0==this.spanArr[t]?{rowspan:1,colspan:1}:{rowspan:this.spanArr[t],colspan:1}},cancelFree:function(){this.freeDialog=!1,this.$refs.freeTree.setCheckedKeys([])},addFree:function(){var e=this.handleArea("freeTree");e.area?(this.form.free_conf.push({area:e.area,area_label:e.area_label,free_type:1,limit_quantity:"",limit_money:""}),this.cancelFree()):this.$message({showClose:!0,message:"请选择地区",type:"warning"})},delFree:function(e,t){this.form.free_conf=this.form.free_conf.filter(function(e){return e.area!=t.area})},checkAll:function(){var e=this,t=!0;return this.form.freight_conf.map(function(a){1==e.form.valuation_type?(!n.test(a.start_standard)&&(t=!1),!n.test(a.start_freight)&&(t=!1),!n.test(a.add_standard)&&(t=!1),!n.test(a.add_freight)&&(t=!1)):2==e.form.valuation_type?(!l.test(a.start_standard)&&(t=!1),!n.test(a.start_freight)&&(t=!1),!l.test(a.add_standard)&&(t=!1),!n.test(a.add_freight)&&(t=!1)):!n.test(a.freight)&&(t=!1)}),this.form.is_select&&3!=this.form.valuation_type&&this.form.free_conf.map(function(a){1==e.form.valuation_type?1==a.free_type?!n.test(a.limit_weight)&&(t=!1):2==a.free_type?!n.test(a.limit_money)&&(t=!1):(!n.test(a.limit_weight)&&(t=!1),!n.test(a.limit_money)&&(t=!1)):1==a.free_type?!l.test(a.limit_quantity)&&(t=!1):2==a.free_type?!n.test(a.limit_money)&&(t=!1):(!l.test(a.limit_quantity)&&(t=!1),!n.test(a.limit_money)&&(t=!1))}),t},submitForm:function(){var e=this;this.checkAll()||this.form.is_free?i.a.createTemplate(this.form).then(function(t){0===t.code&&(e.$message({type:"success",message:"操作成功"}),e.$router.push({name:"template"}))}):this.$message({showClose:!0,message:"请填写正确的运费计算规则或指定条件包邮规则",type:"warning"})},updateForm:function(){var e=this;this.checkAll()||this.form.is_free?i.a.updateTemplate(this.form).then(function(t){0===t.code&&(e.$message({type:"success",message:"操作成功"}),e.$router.push({name:"template"}))}):this.$message({showClose:!0,message:"请填写正确的运费计算规则或指定条件包邮规则",type:"warning"})},cancelAdd:function(){this.$router.push({name:"template"})}},mounted:function(){var e=this;"edittemplate"==this.$route.name&&i.a.getDeliveryInfo({template_id:this.$route.params.id}).then(function(t){0==t.code&&(e.form=t.data,e.form.template_id=e.$route.params.id,e.form.is_free?e.form.freight_conf=[{item_id:"",area:"",area_label:"全国",start_standard:"",start_freight:"",add_standard:"",add_freight:"",boundary:"0",upper:"",freight:"",first:!0,second:!1,disabledBtn:!0}]:e.isAble=!0,e.form.free_conf.length?e.$set(e.form,"is_select",!0):(e.$set(e.form,"is_select",!1),e.form.free_conf=[{area:"",area_label:"全国",free_type:1,limit_quantity:"",limit_money:""}]),3==e.form.valuation_type&&e.form.freight_conf.map(function(e){e.item_id=e.area,e.first=!0,e.boundary=e.boundary.toString(),e.upper?(e.second=!0,e.disabledBtn=!1):(e.second=!1,e.disabledBtn=!0)}))})},created:function(){var e=this;i.a.getAreaList().then(function(t){e.areaList=t.data})}},d={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"add"},[a("el-form",{staticClass:"form",attrs:{model:e.form,size:"medium"}},[a("el-form-item",{attrs:{label:"模板名称：",prop:"name"}},[a("el-input",{model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"是否启用："}},[a("el-radio-group",{model:{value:e.form.status,callback:function(t){e.$set(e.form,"status",t)},expression:"form.status"}},[a("el-radio",{attrs:{label:1}},[e._v("启用")]),e._v(" "),a("el-radio",{attrs:{label:0}},[e._v("禁用")])],1)],1),e._v(" "),a("el-form-item",{attrs:{label:"是否包邮：",prop:"is_free"}},[a("el-radio-group",{on:{change:e.handleType},model:{value:e.form.is_free,callback:function(t){e.$set(e.form,"is_free",t)},expression:"form.is_free"}},[a("el-radio",{attrs:{label:0}},[e._v("自定义运费")]),e._v(" "),a("el-radio",{attrs:{label:1}},[e._v("卖家承担运费")])],1),e._v(" "),a("span",{staticClass:"tip"},[e._v("选择了卖家承担运费，运费计算和包邮规则设置将会丢失")])],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:!e.form.is_free,expression:"!form.is_free"}],attrs:{label:"计价方式："}},[a("el-radio-group",{attrs:{disabled:!!e.isAble},on:{change:e.handleType},model:{value:e.form.valuation_type,callback:function(t){e.$set(e.form,"valuation_type",t)},expression:"form.valuation_type"}},[a("el-radio",{attrs:{label:1}},[e._v("按重量")]),e._v(" "),a("el-radio",{attrs:{label:2}},[e._v("按件数")]),e._v(" "),a("el-radio",{attrs:{label:3}},[e._v("按金额")])],1),e._v(" "),a("span",{staticClass:"tip"},[e._v("运费模版保存后，计费方式将无法切换！")])],1),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:!e.form.is_free,expression:"!form.is_free"}],attrs:{label:"运费计算：",size:"mini"}},[a("div",{staticClass:"freight"},[a("p",[e._v("为指定地区城市设置运费")]),e._v(" "),a("el-table",{directives:[{name:"show",rawName:"v-show",value:3!=e.form.valuation_type,expression:"form.valuation_type!=3"}],attrs:{data:e.form.freight_conf,border:""}},[a("el-table-column",{attrs:{label:"运送到"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.area_label))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:1==e.form.valuation_type?"首重（kg）":"首件（件）",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{model:{value:t.row.start_standard,callback:function(a){e.$set(t.row,"start_standard",a)},expression:"scope.row.start_standard"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"首费（元）",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{model:{value:t.row.start_freight,callback:function(a){e.$set(t.row,"start_freight",a)},expression:"scope.row.start_freight"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:1==e.form.valuation_type?"续重（kg）":"续件（件）",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{model:{value:t.row.add_standard,callback:function(a){e.$set(t.row,"add_standard",a)},expression:"scope.row.add_standard"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"续费（元）",width:"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{model:{value:t.row.add_freight,callback:function(a){e.$set(t.row,"add_freight",a)},expression:"scope.row.add_freight"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"75px"},scopedSlots:e._u([{key:"default",fn:function(t){return[0!==t.$index?a("el-button",{on:{click:function(a){return e.delFreight(t.$index,t.row)}}},[e._v("删除")]):e._e()]}}])})],1),e._v(" "),a("el-table",{directives:[{name:"show",rawName:"v-show",value:3==e.form.valuation_type,expression:"form.valuation_type==3"}],attrs:{data:e.form.freight_conf,border:"","span-method":e.spanMethod}},[a("el-table-column",{attrs:{label:"运送到"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.area_label))]),e._v(" "),a("el-button",{directives:[{name:"show",rawName:"v-show",value:0!=t.$index,expression:"scope.$index!=0"}],staticClass:"inlineBtn",on:{click:function(a){return e.delFreight(t.$index,t.row)}}},[e._v("删除")])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"金额上下限（元）",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{attrs:{disabled:t.row.first},model:{value:t.row.boundary,callback:function(a){e.$set(t.row,"boundary",a)},expression:"scope.row.boundary"}}),e._v(" --\n              "),a("el-input",{attrs:{placeholder:"∞",disabled:t.row.second},on:{blur:function(a){return e.addMoney(t.$index,t.row)}},model:{value:t.row.upper,callback:function(a){e.$set(t.row,"upper",a)},expression:"scope.row.upper"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"运费（元）",width:"150px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-input",{model:{value:t.row.freight,callback:function(a){e.$set(t.row,"freight",e._n(a))},expression:"scope.row.freight"}})]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"75px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{directives:[{name:"show",rawName:"v-show",value:0!=t.$index&&t.row.disabledBtn,expression:"scope.$index!=0&&scope.row.disabledBtn"}],on:{click:function(a){return e.delFreightMoney(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("div",{staticClass:"addBtn"},[a("el-button",{on:{click:function(t){e.freightDialog=!0}}},[e._v("添加地区")])],1)],1)]),e._v(" "),a("el-form-item",{directives:[{name:"show",rawName:"v-show",value:!e.form.is_free&&3!=e.form.valuation_type,expression:"!form.is_free&&form.valuation_type!=3"}],attrs:{label:"指定条件包邮：",size:"mini"}},[a("el-checkbox",{model:{value:e.form.is_select,callback:function(t){e.$set(e.form,"is_select",t)},expression:"form.is_select"}},[e._v("是否指定")]),e._v(" "),a("div",{directives:[{name:"show",rawName:"v-show",value:e.form.is_select,expression:"form.is_select"}],staticClass:"free"},[a("el-table",{attrs:{data:e.form.free_conf,border:""}},[a("el-table-column",{attrs:{label:"运送到"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",[e._v(e._s(t.row.area_label))])]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"设置包邮条件",align:"center",width:"500px"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-select",{model:{value:t.row.free_type,callback:function(a){e.$set(t.row,"free_type",a)},expression:"scope.row.free_type"}},[a("el-option",{attrs:{label:1==e.form.valuation_type?"重量":"件数",value:1}}),e._v(" "),a("el-option",{attrs:{label:"金额",value:2}}),e._v(" "),a("el-option",{attrs:{label:1==e.form.valuation_type?"重量+金额":"件数+金额",value:3}})],1),e._v("\n\n              在"),a("span",{directives:[{name:"show",rawName:"v-show",value:2!==t.row.free_type&&1==e.form.valuation_type,expression:"scope.row.free_type!==2&&form.valuation_type==1"}]},[a("el-input",{model:{value:t.row.limit_weight,callback:function(a){e.$set(t.row,"limit_weight",a)},expression:"scope.row.limit_weight"}}),e._v("（kg）内\n              ")],1),e._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:2!==t.row.free_type&&2==e.form.valuation_type,expression:"scope.row.free_type!==2&&form.valuation_type==2"}]},[a("el-input",{model:{value:t.row.limit_quantity,callback:function(a){e.$set(t.row,"limit_quantity",a)},expression:"scope.row.limit_quantity"}}),e._v("（件）内\n              ")],1),e._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:3==t.row.free_type,expression:"scope.row.free_type==3"}]},[e._v("且")]),e._v(" "),a("span",{directives:[{name:"show",rawName:"v-show",value:1!==t.row.free_type,expression:"scope.row.free_type!==1"}]},[a("el-input",{model:{value:t.row.limit_money,callback:function(a){e.$set(t.row,"limit_money",a)},expression:"scope.row.limit_money"}}),e._v("（元）以上\n              ")],1),e._v("包邮\n\n            ")]}}])}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"75px"},scopedSlots:e._u([{key:"default",fn:function(t){return[0!==t.$index?a("el-button",{on:{click:function(a){return e.delFree(t.$index,t.row)}}},[e._v("删除")]):e._e()]}}])})],1),e._v(" "),a("div",{staticClass:"addBtn"},[a("el-button",{on:{click:function(t){e.freeDialog=!0}}},[e._v("添加地区")])],1)],1)],1)],1),e._v(" "),a("div",{staticClass:"btnGroup"},[this.form.template_id?a("el-button",{attrs:{type:"primary"},on:{click:e.updateForm}},[e._v("确 定")]):a("el-button",{attrs:{type:"primary"},on:{click:e.submitForm}},[e._v("确 定")]),e._v(" "),a("el-button",{on:{click:e.cancelAdd}},[e._v("取 消")])],1),e._v(" "),a("el-dialog",{staticClass:"dialog",attrs:{title:"选择地区",width:"30%",visible:e.freightDialog,"close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(t){e.freightDialog=t}}},[a("div",{staticClass:"treeBody"},[a("el-tree",{ref:"freightTree",attrs:{data:e.freight_areaList,"node-key":"value","show-checkbox":"","default-expanded-keys":[],accordion:""}})],1),e._v(" "),a("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancelFreight}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.addFreight}},[e._v("确 定")])],1)]),e._v(" "),a("el-dialog",{staticClass:"dialog",attrs:{title:"选择地区",width:"30%",visible:e.freeDialog,"close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(t){e.freeDialog=t}}},[a("div",{staticClass:"treeBody"},[a("el-tree",{ref:"freeTree",attrs:{data:e.free_areaList,"node-key":"value","show-checkbox":"","default-expanded-keys":[],accordion:""}})],1),e._v(" "),a("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancelFree}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.addFree}},[e._v("确 定")])],1)])],1)},staticRenderFns:[]};var c=a("C7Lr")(f,d,!1,function(e){a("5CID")},"data-v-49745f8a",null);t.default=c.exports}});