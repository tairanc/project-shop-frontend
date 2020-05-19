<template>
  <el-tabs v-model="activeName" class="exempt">
    <el-tab-pane label="免单券列表" name="first">
        <exempt-list />
    </el-tab-pane>
    <el-tab-pane label="用户免单券列表" name="second">
        <exempt-user-list />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import exemptList from './exemptlist'
import exemptUserList from './exemptuserlist'

  export default {
    data() {
      return {
        activeName: 'first'
      };
    },
    components : {
        exemptList,
        exemptUserList
    },
    methods: {
    //   handleClick(tab, event) {
    //     console.log(tab, event);
    //   }
    }
  };
</script>
<style lang="scss" scoped>
  .exempt{
    padding-left: 10px;
  }
</style>

