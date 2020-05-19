webpackJsonp([45],{VKbd:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("1G+u"),s=a("VXZc"),l=a("iled"),o={data:function(){var e=this;return{is_supported:"",messages:"",is_reapply:!1,dialogFormVisible:!1,list:[],total:0,pageInfo:{page:1,page_size:20},columns:[{label:"类目名称",field:"name",align:"center"},{label:"提交时间",field:"created_at",align:"center"},{label:"申请原因",field:"apply_reason",align:"center"},{label:"状态",field:"status",align:"center",tags:[{index:1,name:"待审核",type:"error"},{index:2,name:"审核通过",type:"success"},{index:3,name:"审核失败",type:"danger"}]},{label:"失败原因",field:"reject_reason",align:"center"},{label:"操作",align:"center",width:180,actions:[{label:"重新申请",type:"text",size:"medium",disable:function(e,t){return 3!=e.status},click:function(t,a){e.showReapplyCategoryApply(a)}},{label:"删除",type:"text",size:"medium",disable:function(e,t){return-1==e.status},click:function(t,a){e.$confirm("是否确定要删除？","删除提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.deleteCategoryApply({apply_id:a.id})}).catch(function(){e.$message({type:"info",message:"已取消删除"})})}}]}],options:[],config:{value:"id",label:"name",children:"children",disabled:"disabled"},form:{cat_ids:[],cat_id:"",apply_reason:""},rules:{cat_ids:[{required:!0,message:"请选择分类",trigger:"blur"}],apply_reason:[{required:!0,message:"请填写申请原因",trigger:"blur"},{max:100,message:"最长为100个字符",trigger:"blur"}]}}},methods:{getCategoryApply:function(e){var t=this;l.a.getCategoryApply(e).then(function(e){t.is_supported=e.data.is_supported,t.messages=e.data.message,t.list=e.data.data,t.total=e.data.total_count})},getAvailableCats:function(){var e=this;l.a.getAvailableCats().then(function(t){e.options=t.data})},applyCategoryApply:function(){var e=this;this.$refs.submitForm.validate(function(t){t&&(e.form.cat_id=e.form.cat_ids[e.form.cat_ids.length-1],l.a.applyCategoryApply(e.form).then(function(t){0==t.code&&(e.$message({showClose:!0,message:"申请发送成功",type:"success"}),e.getCategoryApply(e.pageInfo),e.form={cat_ids:[],cat_id:"",apply_reason:""},e.dialogFormVisible=!1,e.getAvailableCats())}))})},showReapplyCategoryApply:function(e){this.is_reapply=!0,this.form={apply_id:e.id,cat_ids:e.cat_id,cat_id:e.cat_id[1],apply_reason:e.apply_reason},this.dialogFormVisible=!0},reapplyCategoryApply:function(){var e=this;this.$refs.submitForm.validate(function(t){t&&l.a.reapplyCategoryApply(e.form).then(function(t){0==t.code&&(e.$message({showClose:!0,message:"申请发送成功",type:"success"}),e.getCategoryApply(e.pageInfo),e.form={cat_ids:[],cat_id:"",apply_reason:""},e.is_reapply=!1,e.dialogFormVisible=!1,e.getAvailableCats())})})},cancelDialog:function(){this.is_reapply=!1,this.dialogFormVisible=!1,this.form={cat_ids:[],cat_id:"",apply_reason:""}},deleteCategoryApply:function(e){var t=this;l.a.deleteCategoryApply(e).then(function(e){t.getCategoryApply(t.pageInfo),t.getAvailableCats()})},sizeChange:function(e){this.pageInfo.page_size=e,this.getCategoryApply(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getCategoryApply(this.pageInfo)}},components:{TableView:i.a,PaginationView:s.a},created:function(){this.getCategoryApply(this.pageInfo),this.getAvailableCats()}},n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"categoryApply"},[e.is_supported?a("div",[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.dialogFormVisible=!0}}},[e._v("申请类目")]),e._v(" "),a("table-view",{staticClass:"list",attrs:{columns:e.columns,pageList:e.list}}),e._v(" "),a("pagination-view",{directives:[{name:"show",rawName:"v-show",value:e.list.length,expression:"list.length"}],attrs:{total:e.total,currentPage:e.pageInfo.page},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1):a("div",[e._v(e._s(e.messages))]),e._v(" "),a("el-dialog",{attrs:{title:"申请类目权限",visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"submitForm",attrs:{model:e.form,rules:e.rules}},[a("el-form-item",{attrs:{label:"申请类目：",prop:"cat_ids"}},[a("el-cascader",{attrs:{disabled:!!e.is_reapply,"expand-trigger":"hover",options:e.options,props:e.config},model:{value:e.form.cat_ids,callback:function(t){e.$set(e.form,"cat_ids",t)},expression:"form.cat_ids"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"申请原因：",prop:"apply_reason"}},[a("el-input",{staticClass:"textArea",attrs:{type:"textarea"},model:{value:e.form.apply_reason,callback:function(t){e.$set(e.form,"apply_reason",t)},expression:"form.apply_reason"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancelDialog}},[e._v("取 消")]),e._v(" "),e.is_reapply?a("el-button",{attrs:{type:"primary"},on:{click:e.reapplyCategoryApply}},[e._v("确 定")]):a("el-button",{attrs:{type:"primary"},on:{click:e.applyCategoryApply}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var r=a("C7Lr")(o,n,!1,function(e){a("mgAv")},"data-v-7cd4c751",null);t.default=r.exports},mgAv:function(e,t){}});