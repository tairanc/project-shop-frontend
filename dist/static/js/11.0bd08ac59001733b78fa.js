webpackJsonp([11],{"/AKJ":function(e,t){},"1LGQ":function(e,t){},"DMz/":function(e,t){},E2w8:function(e,t){},e6DE:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("3cXf"),s=i.n(a),n=i("4YfN"),l=i.n(n),r=i("2bvH"),o=i("1G+u"),c=i("VXZc"),p=i("iled"),m=i("qsHl"),d=(i("kIQj"),i("2AkA"),{name:"imguse",data:function(){return{moveFileShow:!1,inputImgName:"",filterText:"",imgdir:[],setimgdata:[],imgSelectList:[],fileSelectList:[],imglist:[],img_total_count:0,storeItem:null,timeClickshow:!1,nameClickshow:!1,newFileName:"",newFileList:[],defaultProps:{children:"children",label:function(e){return e.name.length>10&&(e.name=e.name.slice(0,10)+"..."),e.name}},postparams:{file_id:"",keyword:"",page:1,page_size:20,order_bys:"created_at|desc"}}},components:{PaginationView:c.a},methods:l()({},Object(r.b)(["setBrandImg"]),{handleExceed:function(e,t){this.$message.warning("已达到最大上传数量")},beforeAvatarUpload:function(e){var t=e.size/1024/1024<3;return t||this.$message.error("文件太大，请更换图片!"),t},upload:function(e){var t=this,i=new FileReader;i.readAsDataURL(e.file),i.onload=function(i){m.a.uploadImg({file_name:e.file.name,file_content:i.target.result,target_type:"20",image_type:"item",file_id:t.storeItem.id}).then(function(e){0==e.code&&t.getImgFun(t.postparams)})}},handleNodeClick:function(e,t){var i=e.id;this.postparams={file_id:"",keyword:"",page:1,page_size:20,order_bys:"created_at|desc"},this.postparams.file_id=i,this.storeItem=e,this.getImgFun(this.postparams),this.newFileList=[],this.getNodeName(t)},getNodeName:function(e){0!=e.parent.level?(this.newFileList.unshift(e.data.name),this.getNodeName(e.parent)):(this.newFileList.unshift(e.data.name),this.joinNodeName())},joinNodeName:function(){this.newFileName=this.newFileList.join("    >    ")},moveHandleNodeClick:function(e){},filterNode:function(e,t){return!e||-1!==t.name.indexOf(e)},addNewFile:function(){var e=this;this.$prompt("请输入文件夹名称","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputPattern:/\S/,inputErrorMessage:"名称不能为空"}).then(function(t){var i={name:t.value,parent_id:e.storeItem.id,order:0};m.a.createImgFile(i).then(e.getImgFun(e.postparams),m.a.getImgDir({}).then(function(t){e.imgdir=t.data}))}).catch(function(){e.$message({type:"info",message:"取消输入"})})},reName:function(){var e=this,t={};this.imglist.map(function(e,i){e.select&&(t=e)}),this.$prompt("请输入新名称","提示",{confirmButtonText:"确定",cancelButtonText:"取消",inputPattern:/\S/,inputErrorMessage:"名称不能为空"}).then(function(i){var a=i.value,s=t.id,n={name:a};"image"===t.content_type?n.image_id=s:n.file_id=s,m.a.renameImgFile(n).then(e.$set(t,"name",a))}).catch(function(){e.$message({type:"info",message:"取消输入"})})},selectItem:function(e){this.$set(e,"select",!e.select);var t=JSON.parse(s()(this.selectBrandImgList));if(e.select)"image"===e.content_type&&(this.brandImgUrlList.length>0?-1==this.brandImgUrlList.indexOf(e.url)&&(t.length>9?(this.$message({message:"已达到最大上传数量",type:"warning"}),this.$set(e,"select",!e.select)):(t.push(e),this.imgSelectList.push(e.id))):(this.imgSelectList.push(e.id),t.push(e)));else if("image"===e.content_type&&this.brandImgUrlList.length>0){var i=this.brandImgUrlList.indexOf(e.url);-1!=i&&(t.splice(i,1),this.imgSelectList.splice(i,1))}this.setBrandImg(t)},searchImg:function(){var e=JSON.parse(s()(this.postparams));e.keyword=this.inputImgName.trim(),this.getImgFun(e)},handleSizeChange:function(e){this.postparams.page_size=e,this.getImgFun(this.postparams)},handleNumberChange:function(e){this.postparams.page=e,this.getImgFun(this.postparams)},getImgFun:function(e){var t=this,i=this;i.fileSelectList=[],i.imgSelectList=[],m.a.getImgListJustImg(e).then(function(e){var a=[];0===e.code&&e.data.data.length>0&&e.data.data.map(function(e,i){"image"==e.content_type&&(-1!=t.brandImgUrlList.indexOf(e.url)?e.select=!0:e.select=!1,a.push(e))}),i.imglist=a,i.img_total_count=e.data.total_count})}}),computed:l()({},Object(r.c)(["selectBrandImgList","brandImgUrlList"])),mounted:function(){var e=this;m.a.getImgDir({}).then(function(t){var i=t.data;if(e.imgdir=i,i&&i.length>0){e.newFileName=i[0].name;var a=i[0].id;e.postparams.file_id=a,e.storeItem=i[0],e.getImgFun(e.postparams)}})},watch:{filterText:function(e){this.$refs.tree2.filter(e)}}}),u={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"imguse"},[i("el-card",{staticClass:"box-card"},[i("el-container",[i("el-aside",[i("div",{staticClass:"imgspace_left_name"},[e._v("图片空间")]),e._v(" "),i("el-input",{attrs:{size:"small",placeholder:"搜索文件夹"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),i("el-tree",{ref:"tree2",staticClass:"filter-tree",attrs:{data:e.imgdir,props:e.defaultProps,"default-expand-all":!1,"filter-node-method":e.filterNode},on:{"node-click":e.handleNodeClick}})],1),e._v(" "),i("el-main",{staticClass:"imgspace_imgcontent"},[i("div",{staticClass:"imgspace_right_head"},[i("div",{staticClass:"imspace_right_position"},[e._v("当前文件名： "+e._s(e.newFileName))]),e._v(" "),i("el-upload",{attrs:{action:"11",accept:"image/*",multiple:"",limit:200,"on-exceed":e.handleExceed,"before-upload":e.beforeAvatarUpload,"http-request":e.upload,"show-file-list":!1}},[i("el-button",{attrs:{size:"small"}},[e._v("上传图片")])],1),e._v(" "),i("el-button",{attrs:{size:"small"},on:{click:e.addNewFile}},[e._v("新建文件夹")]),e._v(" "),i("el-button",{directives:[{name:"show",rawName:"v-show",value:1==e.imgSelectList.length,expression:"imgSelectList.length == 1"}],attrs:{size:"small"},on:{click:e.reName}},[e._v("重命名")]),e._v(" "),i("div",{staticClass:"imgspace_right_head_input"},[i("el-input",{attrs:{placeholder:"图片名称搜索",clearable:"",size:"small"},model:{value:e.inputImgName,callback:function(t){e.inputImgName=t},expression:"inputImgName"}}),e._v(" "),i("el-button",{attrs:{slot:"append",icon:"el-icon-search",size:"small"},on:{click:e.searchImg},slot:"append"})],1)],1),e._v(" "),i("div",{staticClass:"imgspace_content"},[e.imglist.length>0?i("div",{staticClass:"imgspace_content_imgui"},e._l(e.imglist,function(t,a){return i("div",{key:a},["image"===t.content_type?i("div",{class:-1!=e.brandImgUrlList.indexOf(t.url)?"imgspace_imgcontent_li_select":"imgspace_imgcontent_li",on:{click:function(i){return e.selectItem(t)}}},[i("img",{attrs:{src:t.url+"_m.jpg",alt:""}}),e._v(" "),t.name.length<10?i("span",[e._v(e._s(t.name))]):i("el-popover",{attrs:{placement:"top",width:"200",trigger:"hover",content:t.name}},[i("span",{attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(t.name.slice(0,10)+"..."))])])],1):e._e()])}),0):e._e(),e._v(" "),i("pagination-view",{directives:[{name:"show",rawName:"v-show",value:e.imglist.length,expression:"imglist.length"}],attrs:{paginationName:"",total:e.img_total_count,currentPage:e.postparams.page,pagesize:20},on:{"size-change":e.handleSizeChange,"current-change":e.handleNumberChange}})],1)])],1)],1)],1)},staticRenderFns:[]};var g=i("C7Lr")(d,u,!1,function(e){i("E2w8"),i("1LGQ")},"data-v-6fdd2a36",null).exports,f={data:function(){var e=this;return{qiniuImgUrlList:[],storeimgurllist:[],placeholderbrandlist:"请选择",imgSeclect:!1,brandlist:[],messages:"",is_reapply:!1,dialogFormVisible:!1,list:[],total:0,pageInfo:{page:1,page_size:20},columns:[{label:"品牌名称",field:"brand_names",align:"center"},{label:"提交时间",field:"created_at",align:"center"},{label:"申请原因",field:"apply_reason",align:"center"},{label:"状态",field:"status",align:"center",tags:[{index:1,name:"待审核",type:"error"},{index:2,name:"审核通过",type:"success"},{index:3,name:"审核失败",type:"danger"}]},{label:"失败原因",field:"verify_remark",align:"center"},{label:"操作",align:"center",width:180,actions:[{label:"重新申请",type:"text",size:"medium",disable:function(e,t){return 3!=e.status},click:function(t,i){e.showReapplyCategoryApply(i)}},{label:"删除",type:"text",size:"medium",disable:function(e,t){return-1==e.status},click:function(t,i){e.$confirm("是否确定要删除？","删除提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.deleteCategoryApply({apply_id:i.id})}).catch(function(){e.$message({type:"info",message:"已取消删除"})})}}]}],form:{certificate_url:[],brand_ids:[],apply_id:null,apply_reason:""},rules:{apply_reason:[{required:!0,message:"请填写申请原因",trigger:"blur"},{max:100,message:"最长为100个字符",trigger:"blur"}]}}},methods:l()({},Object(r.b)(["setBrandImg"]),{getBrandApply:function(e){var t=this;p.a.getBrandApply(e).then(function(e){t.messages=e.data.message,t.list=e.data.data,t.total=e.data.total_count})},getBrandList:function(){var e=this;p.a.getBrandList({}).then(function(t){e.brandlist=t.data.available_brand_list})},sureImgSelect:function(e){if("hid"==e)this.setBrandImg(this.storeimgurllist);else{var t=[];JSON.parse(s()(this.brandImgUrlList)).map(function(e,i){t.push({url:e})}),this.storeimgurllist=t}this.imgSeclect=!1},deleteImg:function(e){var t=JSON.parse(s()(this.brandImgUrlList)),i=[];t.splice(e,1),t.map(function(e,t){i.push({url:e})}),this.setBrandImg(i)},removeBrandImg:function(e){this.qiniuImgUrlList.splice(e,1)},beforeAvatarUpload:function(e){var t=e.size/1024/1024<5;return t||this.$message.error("上传图片大小不能超过 5MB!"),t},handleExceed:function(e,t){this.$message.warning("已达到最大上传数量")},upload:function(e){var t=this,i=new FileReader;i.readAsDataURL(e.file),i.onload=function(i){m.a.uploadImg({file_name:e.file.name,file_content:i.target.result,target_type:"20",image_type:"item",seller_id:t.accountId,is_private:1}).then(function(i){if(0==i.code&&"111"==e.action){var a={url:i.data.url,ident:i.data.ident};t.qiniuImgUrlList.push(a)}})}},showImgSelect:function(){this.imgSeclect=!0},addNewApply:function(){this.qiniuImgUrlList=[],this.storeimgurllist=[],this.dialogFormVisible=!0},applyCategoryApply:function(){var e=this;if(e.qiniuImgUrlList.length<1)e.$alert("请上传品牌授权书","提示",{confirmButtonText:"确定",callback:function(e){}});else{if(!e.is_reapply&&e.form.brand_ids.length<1)return void e.$alert("请选择新加品牌","提示",{confirmButtonText:"确定",callback:function(e){}});e.$refs.submitForm.validate(function(t){t&&e.applyBrandApplys()})}},applyBrandApplys:function(){var e=this,t=[];e.qiniuImgUrlList.map(function(e,i){t.push(e.ident)}),e.form.certificate_url=t,e.is_reapply&&delete e.form.brand_ids,p.a.applyBrandApply(e.form).then(function(t){0==t.code&&(e.$message({showClose:!0,message:"申请发送成功",type:"success"}),e.resetForm(),e.getBrandApply(e.pageInfo),e.getBrandList())})},showReapplyCategoryApply:function(e){var t=[];this.is_reapply=!0,this.placeholderbrandlist=e.brand_names;var i=[];e.certificate_url.map(function(e,a){i.push({url:e}),t.push(e.ident)}),this.form={apply_id:e.id,apply_reason:e.apply_reason,certificate_url:t,brand_ids:[]},this.qiniuImgUrlList=e.certificate_url||[],this.dialogFormVisible=!0},reapplyCategoryApply:function(){this.applyCategoryApply()},cancelDialog:function(){this.resetForm()},resetForm:function(){this.form={apply_id:null,apply_reason:"",certificate_url:[],brand_ids:[]},this.is_reapply=!1,this.dialogFormVisible=!1,this.placeholderbrandlist="请选择"},deleteCategoryApply:function(e){var t=this;p.a.deleteBrandApply(e).then(function(e){t.getBrandApply(t.pageInfo),t.getBrandList()})},sizeChange:function(e){this.pageInfo.page_size=e,this.getBrandApply(this.pageInfo)},pageChange:function(e){this.pageInfo.page=e,this.getBrandApply(this.pageInfo)}}),components:{Imguse:g,TableView:o.a,PaginationView:c.a},computed:l()({},Object(r.c)(["brandImgUrlList"])),created:function(){this.getBrandApply(this.pageInfo),this.getBrandList()}},h={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"categoryApply"},[i("div",[i("el-button",{attrs:{type:"primary"},on:{click:e.addNewApply}},[e._v("新建申请")]),e._v(" "),i("table-view",{staticClass:"list",attrs:{columns:e.columns,pageList:e.list}}),e._v(" "),i("pagination-view",{directives:[{name:"show",rawName:"v-show",value:e.list.length,expression:"list.length"}],attrs:{total:e.total,currentPage:e.pageInfo.page},on:{"size-change":e.sizeChange,"current-change":e.pageChange}})],1),e._v(" "),i("el-dialog",{attrs:{title:"品牌申请",visible:e.dialogFormVisible,width:"70%","show-close":!1},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[i("el-form",{ref:"submitForm",attrs:{model:e.form,rules:e.rules}},[i("div",{staticClass:"brand-css-spec"},[i("el-form-item",{staticClass:"brand-css",attrs:{label:"新增品牌:"}},[i("span",{staticClass:"red-star"},[e._v("*")]),e._v(" "),i("el-select",{attrs:{filterable:"",multiple:"",placeholder:e.placeholderbrandlist,"multiple-limit":"10",disabled:e.is_reapply},model:{value:e.form.brand_ids,callback:function(t){e.$set(e.form,"brand_ids",t)},expression:"form.brand_ids"}},e._l(e.brandlist,function(e){return i("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1)],1),e._v(" "),i("el-form-item",{staticClass:"brand-css",attrs:{label:"品牌授权书:"}},[i("span",{staticClass:"red-star-brand"},[e._v("*")]),e._v(" "),e._l(e.qiniuImgUrlList,function(t,a){return i("div",{key:a,staticClass:"img_edit"},[i("img",{staticClass:"small-brandimg",attrs:{src:t.url,alt:""}}),e._v(" "),i("div",{staticClass:"img_delete",on:{click:function(t){return e.removeBrandImg(a)}}},[i("div",{staticClass:"el-icon-delete"})])])}),e._v(" "),i("el-upload",{staticClass:"enterin-img",attrs:{action:"111",accept:"image/*","list-type":"picture-card","file-list":e.qiniuImgUrlList,multiple:"",limit:10,"on-exceed":e.handleExceed,"before-upload":e.beforeAvatarUpload,"http-request":e.upload,"show-file-list":!1}},[i("i",{staticClass:"el-icon-plus"})]),e._v(" "),i("h4",{staticClass:"img-worlds"},[e._v("请上传所申请品牌的授权书，最多可上传10张，图片请控制在5M以内，支持jpe,jpeg.png,bmp格式;")])],2),e._v(" "),i("el-form-item",{attrs:{label:"申请原因:",prop:"apply_reason"}},[i("el-input",{staticClass:"textArea",attrs:{type:"textarea"},model:{value:e.form.apply_reason,callback:function(t){e.$set(e.form,"apply_reason",t)},expression:"form.apply_reason"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:e.cancelDialog}},[e._v("取 消")]),e._v(" "),e.is_reapply?i("el-button",{attrs:{type:"primary"},on:{click:e.reapplyCategoryApply}},[e._v("确 定")]):i("el-button",{attrs:{type:"primary"},on:{click:e.applyCategoryApply}},[e._v("确 定")])],1)],1),e._v(" "),i("el-dialog",{staticClass:"imgSeclect",attrs:{visible:e.imgSeclect,"show-close":!1,width:"90%"}},[i("imguse",{ref:"refimguse"}),e._v(" "),i("div",{staticClass:"footer",attrs:{slot:"footer"},slot:"footer"},[i("el-button",{on:{click:function(t){return e.sureImgSelect("hid")}}},[e._v("取 消")]),e._v(" "),i("el-button",{attrs:{type:"primary"},on:{click:function(t){return e.sureImgSelect("sure")}}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]};var _=i("C7Lr")(f,h,!1,function(e){i("/AKJ"),i("DMz/")},"data-v-621a0925",null);t.default=_.exports}});