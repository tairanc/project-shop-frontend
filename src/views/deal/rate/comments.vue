
<template>
  <div class="manage">
        <el-form :model="formOnComments.form" ref="formOnComments" :rules="formOnComments.rules" label-width="100px" size="medium">
          <el-row>
            <el-col :span="4" :offset="1">
              <el-form-item prop="title" label="商品名称：">
                <el-input v-model="formOnComments.form.title"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" :offset="1">
              <el-form-item label="评论时间:" prop="trade_time">
                   <el-date-picker
                      v-model="trade_time"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd" 
                      value-format="yyyy-MM-dd">
                    </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" :offset="1">
              <el-form-item label="评论分类：" prop="grade">
               <el-select v-model="formOnComments.form.grade" placeholder="全部" @change="gradeChange">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="差评" value="10"></el-option>
                  <el-option label="中评" value="20"></el-option>
                  <el-option label="好评" value="30"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" :offset="1">
               <el-checkbox label="精华评论" @change="is_essenceChange"></el-checkbox>
               <el-checkbox label="有晒图" @change="has_imageChange"></el-checkbox>
               <el-checkbox label="有回复" @change="has_replyChange"></el-checkbox>
               <el-checkbox label="有内容" @change="has_contentChange"></el-checkbox>
               <el-checkbox label="有点赞" @change="has_likeChange"></el-checkbox>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20" :offset="1" class='tc'>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
        <p></p>
        <el-table class="table" :data="formOnComments.list" border align="center" >
            <el-table-column align="center" label="评论等级" prop="grade">
            </el-table-column>
            <el-table-column align="center" label="订单编号" prop="order_no">
            </el-table-column>
            <el-table-column align="center" label="评价时间" prop="created_at">
            </el-table-column>
            <el-table-column align="center" label="评论内容" prop="content">
              <template slot-scope="scope">
                <p>[初次评论]：<span v-if="scope.row.content">{{scope.row.content}}</span><span v-else>默认评论</span></p>
                <p v-if='scope.row.images' class='commentsImg'><img  v-for='(img,index) in scope.row.images' :src='img+"_t.jpg"' :key="'img'+index"/></p>
                <p v-if="scope.row.created_at">{{scope.row.created_at}}</p>
                <p v-if="scope.row.reply">{{scope.row.reply}}</p>
              </template>
            </el-table-column>
             <el-table-column align="center" label="点赞数量" prop="like_count">
            </el-table-column>
             <el-table-column align="center" label="评论类型" prop="is_essence">
            </el-table-column>
             <el-table-column align="center" label="商品信息">
               <template slot-scope="scope" class='tc'>
                 <p>
                   <a :href="defaultUrl('item_id',scope.row)" class='goods_url' target="_blank">{{scope.row.title}}</a>
                 </p>
                 <p style="color:#ff851b"><span v-if="scope.row.sell_price">¥{{scope.row.sell_price}}</span></p>
               </template>
            </el-table-column>
             <el-table-column align="center" label="评价人">
               <template slot-scope="scope">
                  <span v-if="scope.row.is_anonymous==0 && scope.row.nickname !=null">{{scope.row.nickname}}</span>
                  <span v-if="scope.row.is_anonymous==0 && scope.row.nickname ==null">****</span>
                  <span v-if="scope.row.is_anonymous==1">**** [匿名]</span>
               </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="centerComplaint(scope.row)">评论申诉</el-button>
                <el-button type="text" style="margin-left:0" @click="niceClick(scope.row)" v-if='scope.row.is_essence =="一般评价"'>精华设定</el-button>
                <el-button type="text" style="margin-left:0" @click="cancelNiceClick(scope.row)" v-if='scope.row.is_essence !="一般评价"'>取消精华</el-button>
                <el-button type="text" style="margin-left:0" @click="clickReply(scope.row)">评论回复</el-button>
              </template>
            </el-table-column>
        </el-table>   
        <!-- </el-table>
           <table-view
            :loading="formOnComments.loading"
            :columns="formOnComments.columns"
            :pageList="formOnComments.list">
            </table-view> -->
            
         <pagination-view 
         :currentPage="formOnComments.form.page" 
         :total="formOnComments.total" 
         @size-change="sizeChange"
         @current-change="pageChange">
        </pagination-view>
        <el-dialog
          title="对用户差评进行申诉"
          :visible.sync="centerComplaintVisible"
          width="50%"
          center>
          <el-input type="textarea"
          :autosize="{ minRows: 7, maxRows: 7}"
          placeholder="说明申诉理由"
          v-model="complaint.content"
          maxlength="200"
          ></el-input>
          <span>至少1个字，还可以输入
            <span v-if="complaint.content!=''">{{textNumTo -complaint.content.length}}</span>
            <span v-if="complaint.content==''">{{textNumTo}}</span>字</span>
          <div class='img_sepc'>
              <p>举证仅限五张</p>
              <div v-for="(item, index) in selectImgList" :key="index" class="img_edit" v-if="selectImgList.length > 0">
                <img :src="item.url+'_t.jpg'" alt="">
                <div class="img_delete" @click="deleteImg(index)"><i class="el-icon-delete"></i></div>
              </div>
               <el-button @click="showImgSelect" style="width:68px;height:68px;display:inline-block;vertical-align: top"><i class="el-icon-plus"></i></el-button>
        </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitComplaint(complaint)">提交申诉</el-button>
            <el-button @click="centerComplaintVisible = false">取消申诉</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="对用户评价进行解释"
          :visible.sync="replyView"
          width="50%"
          center>
          <el-input type="textarea"
          :autosize="{ minRows: 7, maxRows: 7}"
          placeholder="说点什么吧～"
          v-model="replys.reply"
          maxlength="100"
          ></el-input>
          <span>至少1个字，还可以输入
            <span v-if="this.replys.reply!=null">{{textNum - this.replys.reply.length}}</span>
            <span v-if="this.replys.reply==null">{{textNum}}</span>字</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="replyView = false">取消</el-button>
            <el-button type="primary" @click="saveReply(replys)">保存</el-button>
          </span>
        </el-dialog>

        <el-dialog
            class="imgSeclect"
            :visible="imgSeclect"
            width="80%"
            :show-close="false">
            <imguse ref="refimguse" />

            <div slot="footer" class="footer">
              <el-button @click="hideImgSelect">取 消</el-button>
              <el-button type="primary" @click="sureImgSelect">确 定</el-button>
            </div>
          </el-dialog>
  </div>
</template>

<script>
import TableView from '@/components/TableView'
import comments from '@/api/deal/comments'
import PaginationView from '@/components/PaginationView'
import Imguse from '@/views/goods/imgspace/imguse'
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'

export default {
  data() {
    return {
        imgSeclect : false, 
        replyView:false,
        len:'',
        list:[],
        textNum:100,
        textNumTo:200,
        storeselectImgList : [],
        activeName:'commentsList',
        centerComplaintVisible:false,
        complaint:{
          rate_id:'',
          content:'',
          images:[]
        },
        replys:{
            rate_id:'',
            reply:''
        },
        nice:{
          rate_id:'',
          is_essence:''
        },
        trade_time:[],
        //评论列表
        formOnComments:{
          total:0,
          form:{
            title:'',
            start_date:'',
            end_date:'',
            grade:'',
            is_essence:0,
            has_image:0,
            has_reply:0,
            has_content:0,
            has_like:0,
            page_size:20,
            page:1
          },
          list:[],
        },
    };
  },
  methods: {
   ...mapActions([
      'getBindCategoryList' , 'getGoodsInfoList' , 'setImgSelect' , 'setSkuSelect'
    ]),
      //评论列表
      getCommentList(data){
        comments.getCommentList(data).then((res) =>{
            this.formOnComments.total =res.data.total_count
            this.formOnComments.list=[]
            let data =res.data.list;
            if(this.trade_time){
              this.formOnComments.form.start_date =this.trade_time[0]
              this.formOnComments.form.end_date =this.trade_time[1]
            }
            for(var i in data){
              let grade = data[i].grade
              switch(grade){
                case 10 :data[i].grade ='差评';
                break;
                case 20 :data[i].grade ='中评';
                break;
                case 30 :data[i].grade ='好评';
                break;
              }
              let is_essence =data[i].is_essence
              switch(is_essence){
                case 0 :data[i].is_essence ='一般评价';
                break;
                case 1 :data[i].is_essence ='精华评论';
                break;
              }
              this.formOnComments.list.push(data[i])
            }
            
        })
      },
      search(){
        if(this.trade_time){
              this.formOnComments.form.start_date =this.trade_time[0]
              this.formOnComments.form.end_date =this.trade_time[1]
          }
        this.getCommentList(this.formOnComments.form); 
      },
      //精华设定
     
      niceClick(row){
       this.$confirm('每个店铺最多设置10条精华评论, 是否设置为精华?', '设置精华', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.nice.rate_id =row.id
          this.nice.is_essence =true
          comments.set_essence(this.nice).then((res) =>{
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
              this.search()
          })
          .catch(function(error){
             this.$message({
                type: 'error',
                message: '设置失败!'
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });          
        });
    },
    //取消精华
    cancelNiceClick(row){
      this.$confirm('是否取消精华?', '取消精华', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.nice.rate_id =row.id
          this.nice.is_essence =false
          comments.set_essence(this.nice).then((res) =>{
              this.$message({
                type: 'success',
                message: '设置成功!'
              });
              this.search()
          })
          .catch(function(error){
             this.$message({
                type: 'error',
                message: '设置失败!'
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消设置'
          });          
        });
    },
      //评论申诉
      centerComplaint(row){
        this.centerComplaintVisible =true
        this.complaint.images=[]
        this.complaint.content=''
        this.complaint.rate_id =row.id
        store.commit('delImgList')
      },
      //提交申诉
      submitComplaint(data){
        if(this.selectImgList.length >5){
            this.$message({
                type: 'warning',
                message: '图片仅限五张!'
              });
        }else{
          this.complaint.images =[]
          for(let i in this.selectImgList){
            this.complaint.images.push(this.selectImgList[i].url)
          }
          comments.create(data).then((res) =>{
            this.centerComplaintVisible=false
          })
        }
        
      },
      //回复评论
    clickReply(row){
        this.replys.rate_id =row.id
        this.replys.reply = row.reply
        this.replyView =true
      },
    saveReply(data){
        comments.reply(data).then((res) =>{
          this.replyView=false
          this.search()
         
        })
      },
    sizeChange(val){
        this.formOnComments.form.page_size=val
         this.getCommentList(this.formOnComments.form); 
      },
    pageChange(val){
          this.formOnComments.form.page=val
           this.getCommentList(this.formOnComments.form); 
      },                    
    hideImgSelect(){
      this.setImgSelect(this.storeselectImgList)
      this.imgSeclect = false
    },
    sureImgSelect(){
      this.imgSeclect = false
    },
    deleteImg(index){
      this.selectImgList.splice(index,1)
      this.setImgSelect(this.selectImgList)
    },
    showImgSelect(){
      this.storeselectImgList = JSON.parse(JSON.stringify(this.selectImgList))
      this.imgSeclect = true
    },
    //评论分类
    gradeChange(){
      this.search()
    },
    //精华评价
    is_essenceChange(){
        this.formOnComments.form.is_essence ==0 ? this.formOnComments.form.is_essence =1 : this.formOnComments.form.is_essence =0
        this.search()
    },
    has_imageChange(){
        this.formOnComments.form.has_image ==0 ? this.formOnComments.form.has_image=1 : this.formOnComments.form.has_image=0
        this.search()
    },
    has_replyChange(){
        this.formOnComments.form.has_reply ==0 ? this.formOnComments.form.has_reply=1 : this.formOnComments.form.has_reply=0
        this.search()
    },
    has_contentChange(){
        this.formOnComments.form.has_content ==0 ? this.formOnComments.form.has_content =1 : this.formOnComments.form.has_content =0
        this.search()
    },
    has_likeChange(){
        this.formOnComments.form.has_like ==0 ? this.formOnComments.form.has_like=1 : this.formOnComments.form.has_like=0
        this.search()
    },
    
    },
 
 
  created() {
      this.search()
  },
  computed: {
    ...mapGetters([
      'bindCategoryList' , 'goodsIntInfo' , 'selectImgList' , 'skuitem' , 'sellImgSrc'
    ])
  },
   components: {
     TableView,
     PaginationView,
     Imguse
  }
};
</script>

<style lang='scss' scoped>
.manage {
  padding: 10px;
}
.imgSeclect,.sellImgSelect{
      .el-dialog{
        width: 70%;
        margin-top:10vh !important;
        .el-dialog__header,.el-dialog__body{
          padding:0;
        }
      }
    }
 .img_sepc{
      .el-form-item__label{
          font-size: 8px;
          padding: 0;
      }
      .el-form-item__content{
          margin-left: 100px;
          display: flex;
          flex-direction: row;
          .el-upload--picture-card{
            width: 68px;
            height: 68px;
            line-height: 75px;
          }
      }

      .el-upload-list--picture-card{
        .el-upload-list__item{
            width: 68px;
            height: 68px;
        }
      } 

      .img_edit{
          width: 68px;
          height: 68px;
          background-color: #fff;
          border: 1px solid #c0ccda;
          border-radius: 6px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 0 8px 8px 0;
          position: relative;
          display: inline-block;
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
            line-height: 64px;
            color: white;
          }
        &:hover{
          .img_delete{
              display: block;
          }
        }
      }
      .el-button{
          width: 68px;
          height: 68px;
          font-size: 24px;
      }
    }
    .commentsImg img{
      width: 48px;
      height: 48px;
    }
.tc{
  text-align: center;
}
th{
  text-align: center;
}
.cell{
  text-align: center;
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>
