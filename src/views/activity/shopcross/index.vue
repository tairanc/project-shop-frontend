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
export default {
  data () {
    return {
      activeTab: '/goods-activity/activity/shopcross/list',
      tabList: [
        {
          title: '我的报名',
          path: '/goods-activity/activity/shopcross/applylist'
        },
        {
          title: '优惠券列表',
          path: '/goods-activity/activity/shopcross/list'
        },
         {
          title: '历史报名',
          path: '/goods-activity/activity/shopcross/history'
        },
      ]
    }
  },
  methods: {
    tabClick (el) {
      if (this.$route.path === this.activeTab) {
        return
      }
      this.$router.push({ path: this.activeTab })
    }
  }
}

</script>

<style lang='scss' scoped>
.manage {
  padding: 10px;
}
</style>
