<template>
  <el-menu class="navbar" mode="horizontal">
    <breadcrumb></breadcrumb>
  </el-menu>
</template>

<script>
import Breadcrumb from '@/components/BreadCrumb'

export default {
  components: {
    Breadcrumb
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
}
</style>

