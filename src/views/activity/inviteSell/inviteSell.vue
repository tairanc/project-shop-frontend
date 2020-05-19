<template>
  <div class="commission">
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
       <el-dialog
        title="分类设置"
        :visible.sync="centerDialog"
        :show-close='false'
        :close-on-click-modal ='false'
        width="40%"
        center>
        <p>以下分类您还没有设置比率，请自行设置</p>
        <p style="text-align: center;"><el-input v-model="allRate" style="width:100px;display:inline-block;">
          </el-input>%<el-button style="margin-left:40px" @click="allClickRate">批量设置</el-button></p>
        <el-table class="table" :data="list" border align="center">
          <el-table-column align="center" label="类目名" prop="name">
          </el-table-column>
          <el-table-column align="center" label="设置比率">
                <template  slot-scope="scope">
                    <el-input  v-model="scope.row.rate" style="width:100px"></el-input>%
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="clickRate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import inviteSell from '@/api/activity/inviteSell'
export default {
  data () {
    return {
      list:[],
      allRate:"",
      centerDialog:false,
      data_categories:{
        rates:[]
      },
      activeTab: '',
      tabList: [
        {
          title: '商品提成列表',
          path: '/goods-activity/activity/inviteSell/goodsBonus'
        },
        {
          title: '分类提成管理',
          path: '/goods-activity/activity/inviteSell/bonusCateList'
        },
         {
          title: '提成订单明细',
          path: '/goods-activity/activity/inviteSell/bonusOrderDetail'
        },
        {
          title: '返点订单明细',
          path: '/goods-activity/activity/inviteSell/rebatesDetail'
        },
        {
          title: '提成订单汇总',
          path: '/goods-activity/activity/inviteSell/bonusOrderSum'
        },
        {
          title: '返点订单汇总',
          path: '/goods-activity/activity/inviteSell/bonusRebateSum'
        }
      ]
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
    tabClick (el) {
      if (this.$route.path === this.activeTab) {
        return
      }
      this.$router.push({ path: this.activeTab })
    },
    getPrimaryCategories(){
      inviteSell.getPrimaryCategories().then((res) =>{
        this.list =[]
        for(var i in res.data){
          this.list.push(res.data[i])
          this.$set(res.data[i],'rate','')
        }
      })
    },
    initializeCategoriesRates(data){
      inviteSell.initializeCategoriesRates(data).then((res) =>{
           window.location.reload()
      })
    },
    isCategoryInitialized(){
      inviteSell.isCategoryInitialized().then((res) =>{
        if(res.data==false){
          this.centerDialog=true
          this.getPrimaryCategories()
        }
      })
    },
    clickRate(){
      this.data_categories.rates =[]
      this.list.map((item) =>{
        let data ={
          category_id:'',
          rates:''
        }
        data.category_id = item.id
        data.rates =item.rate
        this.data_categories.rates.push(data)
      })
      this.initializeCategoriesRates(this.data_categories)
   
    },
    //批量设置
    allClickRate(){
      this.list.map((item) =>{
        item.rate = this.allRate
      })
    },
    tabFixbug(){
      let url = window.location.href
      let urlArr = url.split('.com')
      this.activeTab = urlArr[1]
    },
  },
  created:function(){
    this.isCategoryInitialized()
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
