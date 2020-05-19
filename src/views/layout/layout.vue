<template>
  <div class="app-wrapper">
    <v-header></v-header>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <section class="app-main">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>
  </div>
</template>

<script>
  import Navbar from '@/components/Navbar'
  import Sidebar from '@/components/SideBar'
  import VHeader from '@/components/Header'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      VHeader
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

</style>
