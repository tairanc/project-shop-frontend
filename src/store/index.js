import 'babel-polyfill'
import Vue from 'vue'
import Vuex from 'vuex'
import menuItems from './modules/menuItems'
import delivery from './modules/delivery'
import shop from './modules/shop'
import permission from './modules/permission'
import getters from './getter'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    menuItems,
    delivery,
    shop,
    permission,
  },
  getters
})

export default store
