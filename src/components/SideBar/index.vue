<template>
  <scroll-bar>
    <el-menu mode="vertical" unique-opened :default-active="activeItem" active-text-color="#2B88CB">
      <sidebar-item :routes="routes"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import { mapGetters } from 'vuex'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'menuItem'
    ]),
    routes () {
      let allPath = this.$router.options.routes.filter((item) => {
        return `/${item.path.split('/')[1]}` === this.menuItem
      })
      return allPath
    },
    activeItem () {
      let arr = this.$route.path.split('/')
      arr = arr.filter((item,index)=>{
        return index < 4
      })
      arr = arr.join('/')
      return arr
    }
  }
}
</script>
