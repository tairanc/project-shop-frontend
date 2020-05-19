<template>
  <div class="manage">
    <el-tabs v-model="activeTab" type="border-card" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in tabList"
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
import goods from '@/api/goods'
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      activeTab: '/goods-manage/goods/manage/sale',
      tabList: [
        {
          title: '正在销售',
          path: '/goods-manage/goods/manage/sale'
        },
        {
          title: '仓库中',
          path: '/goods-manage/goods/manage/stock'
        }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'deliveryTplUpList',
      'categoryList'
    ]),
  },
  watch: {
    "$route": function () {
      this.activeTab = this.$route.path
    }
  },
  methods: {
    tabClick (el) {
      if (this.$route.path === this.activeTab) {
        return
      }
      this.$router.push({ path: this.activeTab })
    },
    ...mapActions([
      'getDeliveryStatusList',
      'getCategoryList'
    ])
  },
  created() {
    this.activeTab = this.$route.path
    this.getDeliveryStatusList({ status: 1 })
    this.getCategoryList()
    goods.getItemList().then((res)=>{
      if(res.data.biz_mode == 2){
        this.tabList.push({
          title: "审核中",
          path: '/goods-manage/goods/manage/checking'
        })
      }
    })
    
  },
}

</script>

<style lang='scss' scoped>
.manage {
  padding: 10px;
}
</style>
