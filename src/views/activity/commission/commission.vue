<template>
  <div class="commission">
    <div v-if="isJointo">
        <el-button type="primary" @click="exitCommission">退出分佣计划</el-button>
        <p>注：买家在您退出推广前（包括推出后<span v-if="commissionConfig!=null">{{commissionConfig.cancel}}</span>小时内）点击的推广链接，成交后均按您设置的佣金比率计算佣金。</p>
        <p>退出<span v-if="commissionConfig!=null">{{commissionConfig.cancel}}</span>小时及以后点击的推广链接，将不计算佣金。同时退出<span v-if="commissionConfig!=null">{{commissionConfig.quit}}</span>日内不能再申请参加推广。</p>

    </div>
    <div v-if="!isJointo">
      <el-button type="primary" @click="joinCommission">加入分佣计划</el-button>
      <p></p>
      <el-dialog
        title="提示"
        :visible.sync="exitTs"
        width="40%"
        center>
        <p>抱歉！您于（{{cancel_time}}）退出分佣计划，小泰联盟将不再推广您的商品。退出后{{commissionConfig.cancel}}小时点击的推广链接，将不计算佣金。</p>
        <p>您在{{commissionConfig.quit}}天之后可以再次加入分佣计划</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="exitTs = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
     <el-dialog
        title="分类佣金设置"
        :visible.sync="ratesBox"
        :show-close='false'
        :close-on-click-modal ='false'
        width="40%"
        center>
        <p>以下分类您还没有设置分佣比率，请自行设置</p>
        <p style="color:red">提醒：您店铺内非主推商品，将按照类目分佣金计算。请合理设置</p>
        <p style="text-align: center;">
          <el-input v-model.number="allRate" style="width:100px;display:inline-block;"></el-input>
          %
          <el-button style="margin-left:40px" @click="allClickRate">批量设置</el-button>
        </p>
        <el-table class="table" :data="list" border align="center">
          <el-table-column align="center" label="类目名" prop="name"></el-table-column>
          <el-table-column align="center" label="设置佣金比率">
                <template  slot-scope="scope">
                    <el-input  v-model.number="scope.row.rate" style="width:100px"></el-input>%
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="clickRate">确 定</el-button>
        </span>
      </el-dialog>
    <el-tabs v-model="activeTab" type="border-card" @tab-click="tabClick">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
        >
        </el-tab-pane>
        <router-view></router-view>
      </el-tabs>
  </div>
</template>

<script>
import commission from '@/api/activity/commission'
export default {
  data () {
    return {
      activeTab: '',
      tabList: [
        {
          title: '主推商品管理',
          path: '/goods-activity/activity/commission/itemList'
        },
        {
          title: '分佣分类',
          path: '/goods-activity/activity/commission/classification'
        },
         {
          title: '分佣订单明细',
          path: '/goods-activity/activity/commission/orderInfo'
        },
        {
          title: '分佣订单汇总',
          path: '/goods-activity/activity/commission/orderAll'
        },
      ],
      isJointo:'',
      commissionConfig:'',
      is_quit:'',
      cancel_time:'',
      valid_time:'',
      exitTs:false,
      allRate:'',
      list:[],
      ratesBox:false,
      data_categories:{
        categories:[]
      }
    }
  },
  watch:{
    $route(){
      let url = window.location.href
      let urlArr = url.split('.com')
      this.activeTab = urlArr[1]
      }
  },
  methods: {
    //初始化分佣分类比率
    isCategoryInitialized(){
      commission.isCategoryInitialized().then((res) =>{
          if(!res.data){
            this.ratesBox=true
            this.getNeedSetCategories()
          }
      })
    },
    tabClick (el) {
      if (this.$route.path === this.activeTab) {
        return
      }
      this.$router.push({ path: this.activeTab })
    },
    //获取设置分类列表
    getNeedSetCategories(){
      commission.getNeedSetCategories().then((res) =>{
        this.list =[]
        for(var i in res.data){
          this.list.push(res.data[i])
          this.$set(res.data[i],'rate','')
        }
      })
    },
    //设置初始化分类
    setShopCategory(data){
      commission.setShopCategory(data).then((res) =>{
        this.$message({
                type: 'success',
                message: '设置成功!'
              });
          this.ratesBox =false 
          window.location.reload() 
      })
    },
    //设置比率
    clickRate(){
      this.data_categories.categories =[]
      this.list.map((item) =>{
        let data ={
          category_id:'',
          rate:''
        }
        data.category_id = item.category_id
        data.rate =item.rate
        this.data_categories.categories.push(data)
      })
      this.setShopCategory(this.data_categories)
    },
    //批量设置
    allClickRate(){
      this.list.map((item) =>{
        item.rate = this.allRate
      })
    },
    exitCommission(){
       this.$confirm('正在退出分佣计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          commission.exitCommission().then((res) =>{
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
            location.reload()
          })
          .catch(function(error){
             this.$message({
                type: 'error',
                message: '退出失败!'
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          });          
        });
    },
    joinCommission(){
      if(this.is_quit){
        this.exitTs =true
      }else{
        this.isCategoryInitialized()
      }
      
    },
    tabFixbug(){
      let url = window.location.href
      let urlArr = url.split('.com')
      this.activeTab = urlArr[1]
    },
    isJoin(){
      commission.isJoin().then((res) =>{
        if(!res.data.is_join && res.data.is_quit){
          this.exitTs=true
        }
        this.isJointo=res.data.is_join
        this.commissionConfig =res.data.commissionConfig
        this.is_quit =res.data.is_quit
        this.cancel_time =res.data.cancel_time
        this.valid_time =res.data.valid_time
      })
    },

  },
  created:function(){
    this.isJoin()
    this.tabFixbug()
    
  }
}

</script>

<style lang='scss' scoped>
.commission {
  padding: 10px;
  font-size: 14px
}
</style>
