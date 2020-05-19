<template>
  <div class="imguse">
    <el-card class="box-card">
      <el-container>
        <el-aside>
        <div class="imgspace_left_name">图片空间</div>
          <el-input
            size="small"
            placeholder="搜索文件夹"
            v-model="filterText">
          </el-input>

          <el-tree
            class="filter-tree"
            :data="imgdir"
            :props="defaultProps"
            :default-expand-all=false
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
            ref="tree2">
          </el-tree>
        </el-aside>

        <el-main class="imgspace_imgcontent">
            <div class="imgspace_right_head">
              <div class="imspace_right_position">当前文件名： {{newFileName}}</div>
              <el-upload
                  action="11"
                  accept="image/*"
                  multiple
                  :limit='200'
                  :on-exceed="handleExceed"
                  :before-upload="beforeAvatarUpload"
                  :http-request="upload"
                  :show-file-list=false
                  >
                  <el-button size="small">上传图片</el-button>
              </el-upload>
              <el-button size="small" @click="addNewFile">新建文件夹</el-button>
              <el-button size="small" @click="reName" v-show="imgSelectList.length == 1" >重命名</el-button>
              <div class="imgspace_right_head_input">
                  <el-input v-model="inputImgName" placeholder="图片名称搜索" clearable size="small" ></el-input>
                  <el-button slot="append" icon="el-icon-search" @click="searchImg" size="small"></el-button>
              </div>
              
            </div>
            <div class="imgspace_content">
              <div v-if="imglist.length > 0" class="imgspace_content_imgui">
                <div  v-for="(item,index) in imglist" :key="index" >
                  <div v-if="item.content_type === 'image'" :class="sellImgSrc == item.url  ? 'imgspace_imgcontent_li_select' : 'imgspace_imgcontent_li'" @click="selectItem(item)">
                      <img :src="item.url + '_m.jpg'" alt="">
                      <span v-if="item.name.length < 10">{{item.name}}</span>
                      <el-popover
                        placement="top"
                        width="200"
                        trigger="hover"
                        :content="item.name"
                        v-else
                        >
                        <span slot="reference">{{item.name.slice(0,10) + '...'}}</span>
                      </el-popover>
                  </div>
                </div>
              </div>
               <pagination-view 
                v-show="imglist.length"
                :paginationName="''"
                :total="img_total_count"
                :currentPage="postparams.page"
                @size-change="handleSizeChange"
                @current-change="handleNumberChange"
                :pagesize=20
              ></pagination-view>
            </div>
            
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import goods from '@/api/goods'
import delivery from '@/api/delivery'
import axios from '@/api/interception'
import PaginationView from '@/components/PaginationView'
import { mapActions, mapGetters } from 'vuex';


export default {
  name: 'imguse',
  data () {
    return {
      moveFileShow : false,  //文件夹移动
      inputImgName: '',     //全局搜索输入图片名字
      filterText: '',
      imgdir: [],
      setimgdata: [],       //选中的图片信息
      imgSelectList: [],    //选中的图片
      fileSelectList : [],  //选中的文件夹内容
      // checked : false,      //全选按钮
      imglist:[],           //右边图片展示
      img_total_count : 0,
      storeItem : null,     //保存点击的item
      timeClickshow : false, //时间排序 asc desc
      nameClickshow : false, //名称排序
      newFileName : '',       //当前文件名称
      newFileList : [],       //文件路径
      defaultProps: {
        children: 'children',
        label: function(data){
          // 处理名字显示
          if (data.name.length > 10) {
            data.name = data.name.slice(0,10) + '...'
          }
          return data.name
        }
      },
      postparams : {
          file_id: '',      //图片目录（文件夹）id
          keyword : '',     //模糊搜索关键字：图片名称
          page : 1,         //页码 数量
          page_size : 20,   //asc 升序 desc 降序
          order_bys : 'created_at|desc',   //排序方式
      }
    }
  },
  components: {
    PaginationView
  },
  methods: {
    ...mapActions(['setSellImgSelect']),
    handleExceed (files, fileList) {
      this.$message.warning('已达到最大上传数量');
    },
    beforeAvatarUpload (file) {
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isLt3M) {
        this.$message.error('文件太大，请更换图片!');
      }
      return isLt3M;
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
          file_id : self.storeItem.id
        }).then((res) => {
          if (res.code == 0) {
            self.getImgFun(self.postparams)
          }
        })
      }
    },
    handleNodeClick(nodedata, item) {
      let _postparams = {
          file_id: '',      //图片目录（文件夹）id
          keyword : '',     //模糊搜索关键字：图片名称
          page : 1,         //页码 数量
          page_size : 20,   //asc 升序 desc 降序
          order_bys : 'created_at|desc',   //排序方式
      }

      let _id = nodedata.id
      this.postparams = _postparams

      this.postparams.file_id = _id
      this.storeItem = nodedata
      this.getImgFun(this.postparams)
      this.newFileList = []
      this.getNodeName(item)
    },
    getNodeName(parentdata){
      if (parentdata.parent.level != 0) {
        this.newFileList.unshift(parentdata.data.name)
        this.getNodeName(parentdata.parent)
      }else{
        this.newFileList.unshift(parentdata.data.name)
        this.joinNodeName()
      }
    },
    joinNodeName(){
      this.newFileName = this.newFileList.join("    >    ")
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    addNewFile(){
      this.$prompt('请输入文件夹名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '名称不能为空'
        }).then(({ value }) => {
          let _postValue = {
            name : value,
            parent_id : this.storeItem.id,
            order : 0
          }
          goods.createImgFile(_postValue).then(
            this.getImgFun(this.postparams),
            // 更新左边列表
            goods.getImgDir({}).then((res) => {
                this.imgdir = res.data
            })
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    reName(){
      // imglist
      let _itemselect = {}
      this.imglist.map((item, index)=>{
        if (item.select) {
          _itemselect = item
          return
        }
      })
      this.$prompt('请输入新名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '名称不能为空'
        }).then(({ value }) => {
          let _postid = _itemselect.id
          let _postValue = {
            name : value
          }
          if (_itemselect.content_type === "image") {
            _postValue.image_id = _postid
          }else{
            _postValue.file_id = _postid
          }
          goods.renameImgFile(_postValue).then(
            // this.getImgFun(this.postparams)
            this.$set(_itemselect, 'name', value)
          )
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
    },
    selectItem(item){
      // 处理图片或者文件夹选中数据
      this.$set(item, 'select', !item.select)
      let _store = ''
      if (item.select) {
        this.setSellImgSelect(item)
      }
    },
    searchImg(){
      // if (this.inputImgName.trim().length > 0) {
        // 判断是否输入为空
        let _postdata = JSON.parse(JSON.stringify(this.postparams))
            _postdata.keyword = this.inputImgName.trim()
        this.getImgFun(_postdata)
      // }
      
    },
    handleSizeChange (val) {
      this.postparams.page_size = val
      this.getImgFun(this.postparams)
    },
    handleNumberChange (val) {
      this.postparams.page = val
      this.getImgFun(this.postparams)
    },
    getImgFun(params){
        // this.checked = false
        let that = this
        that.fileSelectList = []
        that.imgSelectList = []
        goods.getImgListJustImg(params).then((resdata) => {
            let _resdata = []
            if (resdata.code === 0 && resdata.data.data.length > 0 ) {
              // 给数据添加字段 用于处理点击后逻辑
              resdata.data.data.map((item, index)=>{
                if (item.content_type == "image") {
                  // 只处理图片
                  if (this.sellImgSrc == item.url) {
                    item.select = true
                  }else{
                    item.select = false
                  }
                  _resdata.push(item)
                }
              })
            }
            that.imglist = _resdata
            that.img_total_count = resdata.data.total_count
        })
    }
  },
  computed : {
    ...mapGetters([ 'sellImgSrc'])
  },
  mounted () {
    goods.getImgDir({}).then((res) => {
        let _data = res.data
        this.imgdir = _data
        if (_data && _data.length > 0) {
           this.newFileName = _data[0].name
           let _postid = _data[0].id
           this.postparams.file_id = _postid
           this.storeItem = _data[0]
           this.getImgFun(this.postparams)
        }
    })
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
}
</script>

<style  lang="scss">
    .imguse{
      .el-container{
        // border: 1px solid #333;
          .el-aside {
            color: #333;
            text-align: center;
            width: 175px !important;
            border: 1px solid #999;
            margin-right: 20px;
            // min-height: 50vh;

            .imgspace_left_name{
              height: 60px;
              line-height: 60px;
              border-bottom: 1px solid #999;
              font-size: 18px;
              font-weight: 400;
            }
            .el-input{
              height: 50px;
              line-height: 50px;
              padding: 0px 10px;
            }
          }
        .el-tree{
          .el-tree-node{
            width: 90%;
          }
        }
        .imgspace_imgcontent{
            color: #333;
            text-align: center;
            padding: 0;

            .imgspace_right_head{
                display: flex;
                flex-direction: row;
                height: 60px;
                justify-content: flex-end;
                align-items: center;
                position: relative;

                // margin-left: 50%;
                &>:nth-child(n){
                  margin-left: 10px;
                }
              .imspace_right_position{
                  position: absolute;
                  left: 0;
              }

              .el-upload--picture-card{
                width: 80px;
                height: 34px;
                line-height: 2;
                border: transparent;
              }

              .imgspace_right_head_input{
                width: 253px;
                &>.el-input{
                  width: 70%;
                }
              }
            }

            .imgspace_content{
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              align-content: end;
              border: 1px dashed #999;
              
              // .imgspace_content_select{
              //   display: flex;
              //   width: 100%;
              //   justify-content: space-between;
              //   height: 43px;
              //   background-color: rgb(153,204,255);
              //   align-items: center;
              //   padding: 0 10px;

              //   .imgspace_content_sort{
              //     margin-right: 10%;
              //     &>span{
              //       margin-right: 10px;
              //     }
              //   }
              // }
              .imgspace_content_imgui{
                min-height: 40vh;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                align-content: end;
              }
              .imgspace_imgcontent_li{
                width: 164px;
                height: 120px;
                border: 8px solid rgb(204,204,204);
                margin: 5px 5px 20px 5px;
                &>img,&>div{
                    width: 100%;
                    height: 100%;
                    line-height: 110px;
                }
                &>span{
                  position: relative;
                  top: 8px;
                  font-size: 12px;
                }
              }
              .imgspace_imgcontent_li_select{
                width: 164px;
                height: 120px;
                border: 2px solid blue;
                padding: 6px;
                margin: 5px 5px 20px 5px;
                &>img,&>div{
                    width: 100%;
                    height: 100%;
                    line-height: 110px;
                }
                &>span{
                  position: relative;
                  top: 8px;
                  font-size: 12px;
                }
              }
              .el-pagination{
                width: 100%;
                text-align: right;
              }
            }
        }
      }
    }
</style>
<style scoped>
    .el-tree-node{
        width: 90%;
    }
    .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>

