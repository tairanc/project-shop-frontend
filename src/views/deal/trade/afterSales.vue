<template>
<div class="manage">
    <el-tabs type="border-card">
      <el-form :model="formOnSearch.form" ref="formOnSearch" label-width="100px" size="medium">
        <el-row>
          <el-col :span="6" :offset="1">
            <div class="block">
              <el-form-item label="开始时间：" prop="start_date">
                <el-date-picker v-model="formOnSearch.form.start_date" type="datetime" placeholder="开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </div>
          </el-col>

           <el-col :span="6" :offset="1">
            <div class="block">
              <el-form-item label="结束时间：" prop="end_date">
                <el-date-picker v-model="formOnSearch.form.end_date" type="datetime" placeholder="结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="6" :offset="1">
            <el-form-item prop="bn" label="售后申请编号:">
              <el-input v-model="formOnSearch.form.bn"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item prop="order_no" label="订单编号：">
              <el-input v-model="formOnSearch.form.order_no"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" :offset="1">
              <el-form-item label="售后类型" prop="type">
                <el-select v-model="formOnSearch.form.type" placeholder="全部">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="仅退款" value="10"></el-option>
                  <el-option label="退货退款" value="20"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="6" :offset="1">
              <el-form-item prop="item_name" label="商品名称：">
                <el-input v-model="formOnSearch.form.item_name"></el-input>
              </el-form-item>
            </el-col> 
        </el-row>

        <el-row>
         

           <el-col :span="6" :offset="1">
              <el-form-item label="申请处理进度:" prop="status">
                <el-select v-model="formOnSearch.form.status" placeholder="全部">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="等待审核" value="10"></el-option>
                  <el-option label="等待平台退款" value="20"></el-option>
                  <el-option label="已完成" value="30"></el-option>
                  <el-option label="等待买家回寄" value="40"></el-option>
                  <el-option label="待确认收货" value="50"></el-option>
                  <el-option label="审核驳回" value="60"></el-option>
                  <el-option label="买家撤销" value="70"></el-option>
                  <el-option label="超时系统关闭" value="80"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
        </el-row>
        <el-row style="text-align:center">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button @click='resetForm'>清空条件</el-button>
        </el-row> 
      </el-form>  
    </el-tabs>  
    <el-tabs type="border-card" style="margin-top:40px" v-model="activeName" @tab-click="talClick">
      <el-tab-pane name ='all'>
        <span slot="label">全部</span>
         <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
              <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>  
      <el-tab-pane label="等待审核" name ='10'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="等待买家回寄" name ='40'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="待确认收货" name ='50'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="等待平台退款" name ='20'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="审核驳回" name ='60'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="已完成" name ='30'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="买家撤销" name ='70'> 
        <after-view
            :pageList="list"
            :imageDomain="imageDomain"
            ></after-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>

      <el-tab-pane label="超时系统关闭" name ='80'> 
          <after-view
              :pageList="list"
              :imageDomain="imageDomain"
              ></after-view>
               <pagination-view 
                v-show="list.length"
                :paginationName="formOnSearch.name"
                :total="formOnSearch.total"
                :currentPage="formOnSearch.form.page"
                @size-change="handleSizeChange"
                @current-change="handleNumberChange"
              ></pagination-view>
        </el-tab-pane>
    </el-tabs>  
</div>

  
</template>

<script>
import sales from '@/api/deal/sales'
import AfterView from '@/components/AfterView'
import PaginationView from '@/components/PaginationView'
export default {
  data() {
    return {
      activeName:'all',
      imageDomain:'',
      state:{
        status:''
      },
      formOnSearch:{
        name:'formOnSearch',
        total:0,
        form:{
          item_name:'',
          page:1,
          page_size:20,
          start_date:'',
          end_date:'',
          bn:'',
          order_no:'',
          type:'',
          item_name:'',
          status:''
        },  
        
      },
      list:[],
      price:[],
    }
  },
  methods: {
    getSalesList(data){
      sales.getSalesList(data).then((res) =>{
        this.imageDomain =res.data.image_domain
        this.formOnSearch.total =res.data.total_count
            this.list =[];
            
            if(res.data.list){
                var _this =this
                for(var i in res.data.list){
                  this.price=[]
                  for(let j in res.data.list[i].items){
                    this.price.push(res.data.list[i].items[j].apply_amount)
                  }
              
                let type = res.data.list[i].type
                switch(type){
                case 10:res.data.list[i].type='仅退款';
                break;

                case 20:res.data.list[i].type='退货退款';
                break;
              };

              let state =res.data.list[i].status
              switch(state){
                case 10:res.data.list[i].status='等待商家处理';
                break;

                case 20:res.data.list[i].status='商家同意，等待平台处理';
                break;

                case 30:res.data.list[i].status='平台处理退款，退款完成';
                break;

                case 40:res.data.list[i].status='商家同意，等待消费者回寄';
                break;

                case 50:res.data.list[i].status='消费者回寄，等待商家收货确认';
                break;

                case 60:res.data.list[i].status='商家驳回';
                break;

                case 70:res.data.list[i].status='用户撤销';
                break;

                case 80:res.data.list[i].status='超时系统关闭';
                break;
              };
              for(let j in res.data.list[i].items){
                 let label =res.data.list[i].items[j].label
                 if(label != 'normal'){
                   switch(label){
                     case 'gifts' : res.data.list[i].items[j].label ='赠品'
                     break;
                     case 'exchanges' : res.data.list[i].items[j].label ='换购'
                     break;
                   }
                 }
              }
             
                _this.list.push(res.data.list[i])
                this.$set(res.data.list[i],'price',this.price)
              }
            }  
      })
    },
    search(){
        this.formOnSearch.form.page = 1
        this.getSalesList(this.formOnSearch.form)
    },
    talClick(tab,event){
        let name =tab.name;
        switch(name){
          case 'all':
          this.formOnSearch.form.status =''
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '10':
          this.formOnSearch.form.status ='10'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '20':
          this.formOnSearch.form.status ='20'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '30':
          this.formOnSearch.form.status='30'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '40':
          this.formOnSearch.form.status ='40'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '50':
          this.formOnSearch.form.status ='50'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '60':
          this.formOnSearch.form.status ='60'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '70':
          this.formOnSearch.form.status ='70'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;

          case '80':
          this.formOnSearch.form.status ='80'
          this.formOnSearch.form.page = 1
          this.getSalesList(this.formOnSearch.form)
          break;
        
      } 
    },
    resetForm(){
         this.$refs.formOnSearch.resetFields();
      }, 
    handleSizeChange (val) {
      this.formOnSearch.form.page_size = val
      this.getSalesList(this.formOnSearch.form)
    },
    handleNumberChange (val) {
      this.formOnSearch.form.page = val
      this.getSalesList(this.formOnSearch.form)
    },  
  },
  components:{
    AfterView,
    PaginationView
  },
   created:function(){
    this.getSalesList(this.formOnSearch.form)
  }
}

</script>

<style lang='scss' scoped>
.manage {
  padding: 10px;
}
label{
  text-align: left;
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
    
</style>
