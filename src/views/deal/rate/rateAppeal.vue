<template>
    <div class='rateAppeal'>
        <p></p>
           <el-form :model="formOnComplaint.form" ref="formOnComplaint" :rules="formOnComplaint.rules" label-width="100px" size="medium">
          <el-row>
            <el-col :span="6" :offset="1">
              <el-form-item prop="start_date" label="开始日期：">
                <el-date-picker v-model="formOnComplaint.form.start_date" type="datetime" placeholder="请选择开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="1">
              <el-form-item label="结束日期：" prop="end_date">
                <el-date-picker v-model="formOnComplaint.form.end_date" type="datetime" placeholder="请选择结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>

             <el-col :span="3" :offset="1" class='tc'>
              <el-button type="primary" @click="complaintSearch">搜索</el-button>
            </el-col>
          </el-row>
          <p></p>
        </el-form>
         <p></p>
        <el-tabs type="border-card" v-model="active" @tab-click='tabClick'>
            <el-tab-pane label="申诉审核" name='10'>
                <table-view
                :loading="formOnComplaint.loading"
                :columns="formOnComplaint.columns"
                :pageList="formOnComplaint.list">
                </table-view>
                <pagination-view 
                :currentPage="formOnComplaint.form.page" 
                :total="formOnComplaint.total" 
                @size-change="sizeChange"
                @current-change="pageChange">
                </pagination-view>
            </el-tab-pane>

            <el-tab-pane label="审核驳回" name='20'>
                <table-view
                :loading="formOnComplaint.loading"
                :columns="formOnComplaint.columns"
                :pageList="formOnComplaint.list">
                </table-view>
                <pagination-view 
                :currentPage="formOnComplaint.form.page" 
                :total="formOnComplaint.total" 
                @size-change="sizeChange"
                @current-change="pageChange">
                </pagination-view>
            </el-tab-pane>

            <el-tab-pane label="申诉成功" name='30'>
                <table-view
                :loading="formOnComplaint.loading"
                :columns="formOnComplaint.columns"
                :pageList="formOnComplaint.list">
                </table-view>
                <pagination-view 
                :currentPage="formOnComplaint.form.page" 
                :total="formOnComplaint.total" 
                @size-change="sizeChange"
                @current-change="pageChange">
                </pagination-view>
            </el-tab-pane>

            <el-tab-pane label="申诉关闭" name='40'>
                <table-view
                :loading="formOnComplaint.loading"
                :columns="formOnComplaint.columns"
                :pageList="formOnComplaint.list">
                </table-view>
                <pagination-view 
                :currentPage="formOnComplaint.form.page" 
                :total="formOnComplaint.total" 
                @size-change="sizeChange"
                @current-change="pageChange">
                </pagination-view>
            </el-tab-pane>
        </el-tabs>
        <el-dialog
            title="申诉详情"
            :visible.sync="centerDialogVisible"
            width="60%"
            center
          >
            <div class='box'>
                <p>申诉状态 ：{{infoText.status}}</p>
                <p>申诉内容 ：
                    <el-input type="textarea"
                        :autosize="{ minRows: 3, maxRows: 3}" v-model="infoText.content" :disabled="textStatus"></el-input></p>
            </div>
            <div class='box'>
                <h4>订单详情</h4>
                <el-row>
                    <el-col :offset="1" :span='10'>
                        <span>订单号：{{rate.order_no}}</span>
                    </el-col>
                    <el-col :offset="1" :span='10'>
                        <span v-if="infoText.goods_order">店铺名称：{{infoText.goods_order.order_shop.shop_info.name}}</span>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :offset="1" :span='10'>
                        <span v-if="infoText.goods_order">下单时间：{{infoText.goods_order.order_shop.created_at}}</span>
                    </el-col>
                    <el-col :offset="1" :span='10'>
                        <span  v-if="infoText.goods_order">发货时间：{{infoText.goods_order.order_shop.consigned_at}}</span>
                    </el-col>
                </el-row>
                <p></p>
                <table width='100%' class='rateAppeal' style="border-collapse:collapse;text-align: center"  border="1" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>货号</td>
                        <td>商品名称</td>
                        <td>成交金额</td>
                        <td>用户id</td>
                    </tr>
                    <tr>
                        <td v-if="infoText.goods_order">{{infoText.goods_order.item_id}}</td>
                        <td v-if="infoText.goods_order">{{infoText.goods_order.title}}</td>
                        <td v-if="infoText.goods_order">{{infoText.goods_order.payment}}</td>
                        <td v-if="infoText.goods_order">{{rate.nickname}}</td>
                    </tr>
                </table>
            </div>
            <div class='box'>
                <h4>评论详情</h4>
                <p v-if='rate.images ==""'>没有晒图</p>
                <el-row>
                    <el-col :offset="1" :span='10'>
                        <p>[初次评论]：{{rate.content}}</p>
                        <p v-if='rate.images' class='rateImg'><span>晒图：</span><img  v-for='(img,index) in rate.images' :src='img+"_t.jpg"' :key="'img'+index"/></p>
                        <p>评论时间：{{rate.created_at}}</p>
                    </el-col>
                    <el-col :offset="1" :span='10'>
                        <p>[商家回复]：{{rate.reply}}</p>
                    </el-col>
                </el-row>
               
                
            </div>
            <span slot="footer" class="dialog-footer" v-if='infoText.status =="等待审核" '> 
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo(savaData)">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TableView from '@/components/TableView'
import comments from '@/api/deal/comments'
import PaginationView from '@/components/PaginationView'

export default {
    data() {
        return {
            savaData:{
                appeal_id:'',
                content:'',
                images:[]
            },
            textStatus:'',
            active:'10',
            centerDialogVisible:false,
            infoText:'',
            rate:'',
            formOnComplaint:{
                total:0,
                form:{
                start_date:'',
                end_date:'',
                status:'10',
                page_size:20,
                page:1
                },
                list:[],
                columns: [
                    { label: '评论等级', field: 'grade', align: 'center' },
                    { label: '订单编号', field: 'order_no', align: 'center' },
                    { label: '评价时间', field: 'created_at', align: 'center' },
                    { label: '评价人', field: 'nickname', align: 'center' },
                    { label: '申诉进度', field: 'status', align: 'center' },
                    {
                        label: '操作',
                        align: 'center',
                        actions: [
                            {
                                label: '详情',
                                type: 'text',
                                size: 'medium',
                                click: (index, row) => {
                                    this.openInfo({appeal_id:row.appeal_id})
                                }
                            },
                        ]
                    }
                ]
            }
        }
    },
    methods:{
         getComplaintList(data){
            comments.getComplaintList(data).then((res)=>{
                this.formOnComplaint.total =res.data.total_count
                this.formOnComplaint.list=[]
                let data =res.data.appeals;
                for(var i in data){
                     data[i].rate.status =data[i].status
                     var grade =data[i].rate.grade;
                     if(data[i].rate.is_anonymous ==1){
                        data[i].rate.nickname='**** [匿名]' 
                     }
                     switch(grade){
                         case 10 :data[i].rate.grade='差评'
                         break
                         case 20 :data[i].rate.grade='中评'
                         break
                         case 30 :data[i].rate.grade='好评'
                         break

                     }
                     var status =data[i].rate.status;
                     switch(status){
                         case 10 :data[i].rate.status='等待审核'
                         break
                         case 20 :data[i].rate.status='已驳回'
                         break
                         case 30 :data[i].rate.status='已成功'
                         break
                         case 40 :data[i].rate.status='已取消'
                         break    
                     }

                    this.formOnComplaint.list.push(data[i].rate)
                    this.$set(data[i].rate,'appeal_id',data[i].id)
                   
                }
            })
        },
    complaintSearch(){
        this.getComplaintList(this.formOnComplaint.form)
    },
     sizeChange(val){
        this.formOnComplaint.form.page_size=val
        this.getComplaintList(this.formOnComplaint.form)
      },
      pageChange(val){
          this.formOnComplaint.form.page=val
          this.getComplaintList(this.formOnComplaint.form)
      },
      tabClick(e,t){
          this.formOnComplaint.form.status=e.name
          this.getComplaintList(this.formOnComplaint.form)
      },
      openInfo(id){
          this.info(id)
          this.centerDialogVisible=true
      },
      saveInfo(data){
            if(!this.status){
                this.savaData.content =this.infoText.content
                this.savaData.images =this.rate.images
                comments.modify(data).then((res) =>{
                this.centerDialogVisible=false
            })
            }else{
                centerDialogVisible=false
            }
            
      },
      info(data){
       comments.info(data).then((res) =>{
          this.savaData.appeal_id =res.data.id
         
           var status =res.data.status
           if(status !=10){
               this.textStatus = true
           }else{
               this.textStatus =false
           }
           switch(status){
                case 10 :res.data.status='等待审核'
                break
                case 20 :res.data.status='已驳回'
                break
                case 30 :res.data.status='已成功'
                break
                case 40 :res.data.status='已取消'
                break    
            }
            this.infoText =res.data
           this.rate =res.data.rate
       })   
      }
    },
    created:function(){
         this.getComplaintList(this.formOnComplaint.form)
    },
    components:{
        TableView,
        PaginationView
    }
}
</script>

<style lang="scss" scoped>
.rateAppeal{
    padding:10px;
    .box{
        padding: 10px;
        margin-bottom: 20px;
        border:  1px solid #dcdfe6;
    }
}
.tc{
  text-align: center;
}
.rateImg img{
    width: 50px;
    height: 50px;
}
.rateAppeal td,.rateAppeal tr{ border:1px solid #ddd; }
</style>

