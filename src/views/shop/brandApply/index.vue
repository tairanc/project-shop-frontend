<template>
  <div class="categoryApply">
    <div>
      <el-button type="primary" @click="addNewApply">新建申请</el-button>
      <table-view
        class="list"
        :columns="columns"
        :pageList="list"
        >
      </table-view>
      <pagination-view 
        v-show="list.length"
        :total="total"
        :currentPage="pageInfo.page"
        @size-change="sizeChange"
        @current-change="pageChange"
      ></pagination-view>
    </div>

    <el-dialog title="品牌申请" :visible.sync="dialogFormVisible" width="70%" :show-close="false">
      <el-form :model="form" :rules="rules" ref="submitForm">
        <div class="brand-css-spec">
           <el-form-item label="新增品牌:" class="brand-css" >
              <span class="red-star">*</span>
              <el-select v-model="form.brand_ids" filterable multiple :placeholder="placeholderbrandlist" multiple-limit="10" :disabled="is_reapply">
                  <el-option
                  v-for="item in brandlist"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  </el-option>
              </el-select>
          </el-form-item> 
          <!-- <div class="has_brand_list-div">
                <div class="size-big">已经选择品牌：</div>
                <div v-for="(item, index) in has_brand_list" :key="index" class="add-padding">{{item.name}}</div>
          </div> -->
        </div>

        <el-form-item label="品牌授权书:" class="brand-css">
            <!-- <span class="red-star-brand">*</span>
            <div v-for="(item, index) in brandImgUrlList" :key="index" class="img_edit">
                <img class="small-brandimg" :src="item + '_s.jpg'" alt="">
                <div class="img_delete">
                  <div class="right_img_delete" @click="deleteImg(index)">
                    <div class="el-icon-delete"></div>
                  </div>
                </div>
            </div>
            <el-button @click="showImgSelect" v-if="brandImgUrlList.length > 0" class="img_spec_btn"><i class="el-icon-plus"></i></el-button>
            <el-button @click="showImgSelect" v-else class="img_spec_btn_top"><i class="el-icon-plus"></i></el-button> -->



            <span class="red-star-brand">*</span>
            <div v-for="(item, index) in qiniuImgUrlList" :key="index" class="img_edit">
                <img class="small-brandimg" :src="item.url" alt="">
                <div class="img_delete" @click="removeBrandImg(index)">
                  <div class="el-icon-delete"></div>
                </div>
            </div>
            <el-upload
                action="111"
                accept="image/*"
                list-type="picture-card"
                :file-list="qiniuImgUrlList"
                multiple
                :limit="10"
                :on-exceed="handleExceed"
                :before-upload="beforeAvatarUpload"
                :http-request="upload"
                :show-file-list="false"
                class="enterin-img"
                >
                <i class="el-icon-plus"></i>
            </el-upload>
            <h4 class="img-worlds">请上传所申请品牌的授权书，最多可上传10张，图片请控制在5M以内，支持jpe,jpeg.png,bmp格式;</h4>
        </el-form-item> 

        <el-form-item label="申请原因:" prop="apply_reason">
          <el-input  class="textArea" type="textarea" v-model="form.apply_reason"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" v-if="!is_reapply" @click="applyCategoryApply">确 定</el-button>
        <el-button type="primary" v-else @click="reapplyCategoryApply">确 定</el-button>

      </div>
    </el-dialog>
    <el-dialog
        class="imgSeclect"
        :visible="imgSeclect"
        :show-close="false"
        width="90%">
        <imguse ref="refimguse" />

        <div slot="footer" class="footer">
            <el-button @click="sureImgSelect('hid')">取 消</el-button>
            <el-button type="primary" @click="sureImgSelect('sure')">确 定</el-button>
        </div>
        </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TableView from "@/components/TableView";
import PaginationView from "@/components/PaginationView";
import shops from "@/api/shops";
import Imguse from "./imguse";
import goods from '@/api/goods'

export default {
  data() {
    return {
      qiniuImgUrlList:[],
      storeimgurllist:[], //存储图片选中数据
      placeholderbrandlist: "请选择",
      imgSeclect: false,
      // has_brand_list: [], //已经有品牌列表
      brandlist: [],
      messages: "",
      is_reapply: false,
      dialogFormVisible: false,
      list: [],
      total: 0,
      pageInfo: {
        page: 1,
        page_size: 20
      },
      columns: [
        {
          label: "品牌名称",
          field: "brand_names",
          align: "center"
        },
        {
          label: "提交时间",
          field: "created_at",
          align: "center"
        },
        {
          label: "申请原因",
          field: "apply_reason",
          align: "center"
        },
        {
          label: "状态",
          field: "status",
          align: "center",
          tags: [
            {
              index: 1,
              name: "待审核",
              type: "error"
            },
            {
              index: 2,
              name: "审核通过",
              type: "success"
            },
            {
              index: 3,
              name: "审核失败",
              type: "danger"
            }
          ]
        },
        {
          label: "失败原因",
          field: "verify_remark",
          align: "center"
        },
        {
          label: "操作",
          align: "center",
          width: 180,
          actions: [
            {
              label: "重新申请",
              type: "text",
              size: "medium",
              disable: (row, index) => {
                return row.status != 3;
              },
              click: (index, row) => {
                this.showReapplyCategoryApply(row);
              }
            },
            {
              label: "删除",
              type: "text",
              size: "medium",
              disable: (row, index) => {
                return row.status == -1;
              },
              click: (index, row) => {
                this.$confirm("是否确定要删除？", "删除提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    this.deleteCategoryApply({ apply_id: row.id });
                  })
                  .catch(() => {
                    this.$message({
                      type: "info",
                      message: "已取消删除"
                    });
                  });
              }
            }
          ]
        }
      ],
      form: {
        certificate_url: [],
        brand_ids: [],
        apply_id: null, //重新申请时候传入
        apply_reason: ""
      },
      rules: {
        apply_reason: [
          { required: true, message: "请填写申请原因", trigger: "blur" },
          { max: 100, message: "最长为100个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["setBrandImg"]),
    //获取列表
    getBrandApply(params) {
      shops.getBrandApply(params).then(res => {
        this.messages = res.data.message;
        this.list = res.data.data;
        this.total = res.data.total_count;
      });
    },
    getBrandList() {
      shops.getBrandList({}).then(res => {
        // available_brand_list 可申请品牌列表
        // already_applied_brand_list 已经申请品牌列表
        this.brandlist = res.data.available_brand_list;
        // this.has_brand_list = res.data.already_applied_brand_list;
      });
    },
    sureImgSelect(type) {
      if (type == "hid") {
        this.setBrandImg(this.storeimgurllist)
      }else{
        let _imglist = JSON.parse(JSON.stringify(this.brandImgUrlList))
        let _imgurllist = []
        _imglist.map((item,index)=>{
          _imgurllist.push({url:item})
        })
        this.storeimgurllist = _imgurllist
      }
      this.imgSeclect = false;
    },
    // 图片删除
    deleteImg(index) {
      let _imglist = JSON.parse(JSON.stringify(this.brandImgUrlList))
      let _imgurllist = []
        _imglist.splice(index, 1);
      
      _imglist.map((item,index)=>{
        _imgurllist.push({url:item})
      })
      this.setBrandImg(_imgurllist)
    },
    removeBrandImg (index) { 
      let self = this
      self.qiniuImgUrlList.splice(index, 1)
    },
    beforeAvatarUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return isLt5M;
    },
    handleExceed (files, fileList) {
      this.$message.warning('已达到最大上传数量');
    },
    upload (value) {
      let self = this
      let render = new FileReader();
      render.readAsDataURL(value.file)
      render.onload = function (e) {
        goods.uploadImg({
          file_name: value.file.name,
          file_content: e.target.result,
          target_type: '20',
          image_type: 'item',
          seller_id: self.accountId,
          is_private:1
        }).then((res) => {
          if (res.code == 0) {
            if (value.action == "111") {
              let _data = {
                url:res.data.url,
                ident:res.data.ident
              }
              self.qiniuImgUrlList.push(_data)
            }
          }
        })
      }
    },
    showImgSelect() {
      //   this.storeselectImgList = JSON.parse(JSON.stringify(this.selectImgList))
      this.imgSeclect = true;
    },
    addNewApply(){
      this.qiniuImgUrlList = []
      this.storeimgurllist = []
      this.dialogFormVisible = true;
    },
    //申请
    applyCategoryApply() {
      let that = this;
      if (that.qiniuImgUrlList.length < 1) {
        that.$alert("请上传品牌授权书", "提示", {
          confirmButtonText: "确定",
          callback: action => {
            // console.log(that.form)
          }
        });
      } else {
        if (!that.is_reapply) {
          if (that.form.brand_ids.length < 1) {
            that.$alert("请选择新加品牌", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                // console.log(that.form)
              }
            });
            return;
          }
        }
        that.$refs.submitForm.validate(valid => {
          if (valid) {
            that.applyBrandApplys();
          }
        });
      }
    },
    applyBrandApplys() {
      let that = this;
      let _identlist = []
      that.qiniuImgUrlList.map((item,index)=>{
        _identlist.push(item.ident)
      })
      that.form.certificate_url = _identlist
      if (that.is_reapply) {
        delete that.form["brand_ids"];
      }
      shops.applyBrandApply(that.form).then(res => {
        if (res.code == 0) {
          that.$message({
            showClose: true,
            message: "申请发送成功",
            type: "success"
          });
          that.resetForm()
          that.getBrandApply(that.pageInfo);
          // that.setBrandImg([])
          that.getBrandList();
        }
      });
    },
    //重新申请显示弹窗
    showReapplyCategoryApply(row) {
      let _certificate_url = []
      this.is_reapply = true;
      this.placeholderbrandlist = row.brand_names
      let _imgurllist = []
      row.certificate_url.map((item,index)=>{
        _imgurllist.push({url:item})
        _certificate_url.push(item.ident)
      })
      this.form = {
        apply_id: row.id,
        apply_reason: row.apply_reason,
        certificate_url: _certificate_url,
        brand_ids: []
      }
      this.qiniuImgUrlList = row.certificate_url || []
      // this.setBrandImg(_imgurllist)
      // this.storeimgurllist = _imgurllist
      this.dialogFormVisible = true;
    },
    //重新申请
    reapplyCategoryApply() {
      this.applyCategoryApply();
    },
    //取消弹窗
    cancelDialog() {
      // 取消 不再做是否编辑状态判断
      this.resetForm()
      // this.setBrandImg([])
      // if (this.is_reapply) {
      //   this.resetForm()
      //   this.setBrandImg([])
      // }else{
      //   this.setBrandImg([])
      //   this.dialogFormVisible = false
      // }
    },
    resetForm(){
      this.form = {
          apply_id: null,
          apply_reason: "",
          certificate_url: [],
          brand_ids: []
        };
        this.is_reapply = false;
        this.dialogFormVisible = false;
        this.placeholderbrandlist = "请选择";
    },
    //删除
    deleteCategoryApply(params) {
      shops.deleteBrandApply(params).then(res => {
        this.getBrandApply(this.pageInfo);
        this.getBrandList();
      });
    },
    // pageSize变化函数
    sizeChange(val) {
      this.pageInfo.page_size = val;
      this.getBrandApply(this.pageInfo);
    },
    // page变化函数
    pageChange(val) {
      this.pageInfo.page = val;
      this.getBrandApply(this.pageInfo);
    }
  },
  components: {
    Imguse,
    TableView,
    PaginationView
  },
  computed: {
    ...mapGetters(["brandImgUrlList"])
  },
  created() {
    this.getBrandApply(this.pageInfo);
    this.getBrandList();
  }
};
</script>

<style lang='scss' scoped>
.categoryApply {
  margin: 20px;
  .list {
    margin-top: 20px;
  }
}
.brand-css-spec {
  .brand-css {
    display: inline-block;
    width: 60%;
    vertical-align: top;
    .el-select {
      width: 70%;
    }
  }
  .has_brand_list-div {
    display: inline-block;
    .size-big {
      font-size: 18px;
      font-weight: 500;
    }
    .add-padding {
      padding: 3px;
    }
  }
}
.brand-css {
  .el-form-item__content {
    margin-top: 10px;
  }
  .red-star,
  .red-star-brand {
    color: #f56c6c;
    position: absolute;
    left: -8px;
  }
  .has_brand_list-div {
    display: inline-block;
  }
  // .img_edit {
  //   display: inline-block;
  //   width: 55px;
  //   height: 55px;
  //   margin: 3px;
  //   border-radius: 4px;
  //   border: 1px solid #dcdfe6;
  //   position: relative;
  //   .small-brandimg {
  //     width: 100%;
  //   }
  //   .img_delete {
  //     width: 100%;
  //     height: 100%;
  //     position: absolute;
  //     display: none;
  //     top: 0;
  //     left: 0;
  //     background-color: rgba(0, 0, 0, 0.3);
  //     text-align: center;
  //     line-height: 64px;
  //     color: white;

  //     .right_img_delete {
  //       width: 100%;
  //       height: 100%;
  //       display: flex;
  //       align-items: center;
  //       justify-content: center;
  //     }
  //   }
  //   &:hover{
  //     .img_delete{
  //         display: block;
  //     }
  //   }
  // }
  .img_spec_btn {
    line-height: 30px;
    position: relative;
    top: -21px;
  }
  .img_spec_btn_top {
    line-height: 30px;
  }
  .img-worlds{
    padding-left: 90px;
  }
}

.textArea {
  width: 80%;
}
</style>
<style lang="scss">
  .categoryApply {
    .enterin-img{
      display: contents;
      width: 55px;
      height: 55px;
      .el-upload--picture-card{
        width:55px;
        height:55px;
        line-height:60px;
      }
    }
    .img_edit{
        width: 55px;
        height: 55px;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0 8px 8px 0;
        position: relative;
        display: inline-flex;
        &>img{
          width:100%;
          height: 100%;
        }
        .img_delete{
          width: 100%;
          height: 100%;
          position: absolute;
          display: none;
          top: 0;
          left: 0;
          background-color: rgba(0,0,0,0.3);
          text-align: center;
          line-height: 146px;
          color: white;
          align-items: center;
          justify-content: center;
        }
      &:hover{
        .img_delete{
          display: flex;
        }
      }
    }
  }
</style>
