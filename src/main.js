import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import { saveToken, getCookie } from '@/utils/auth'
import {asynRouterMap} from '@/router'
import axios from '@/api/interception'
import { NORMAL,CHANNEL} from '@/utils/url'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.config.silent=true
const whiteList = ['/login', '/registered', '/enterin']

router.beforeEach((to, from, next) => {
  if(to.path == "/enterin"){
    next()
  } else if (getCookie()) {
    if (to.path === '/login') {
      next({ path: "/home" })
    } else {
      if (store.getters.roles.length == 0) {
        store.dispatch('getRoles');
        axios({
          method: 'get',
          url: '/trmall/shop/getShopMenuList',
        }).then((res) =>{
          let shopMenuList = res.data;
          let list = asynRouterMap;
          let SnewList = [];
          if (shopMenuList) {
            store.commit('SET_HEADERMENU', shopMenuList)
            //localStorage.setItem('newList', JSON.stringify(shopMenuList));
            //一级路由
            for (var i =0;i<list.length;i++) {
              var key = list[i].key;
              var  top = list[i].top;
              var children =[];
              if (shopMenuList[key]) {

                var bottom = list[i].bottom
                if(!shopMenuList[key][bottom]){
                  // 暂时先这样写着
                  if(bottom == "tradeManage"){
                    list[i].redirect.name = 'rate'
                  }
                  if(bottom == "itemInfo"){
                    list[i].redirect.name = 'logistics'
                  }
                }

                SnewList.push(list[i]);
              }else{
                if(shopMenuList[top] && shopMenuList[top][key]){
                  let name = list[i].redirect.name

                  for (var j in list[i].children) {
                    var childrens = list[i].children[j].key;
                    if (shopMenuList[top][key][childrens]) {
                      children.push(list[i].children[j]);
                    }
                  }

                  let flag = children.filter((item)=>{
                    return item.name == name
                  })

                  if(!flag.length){
                    list[i].redirect.name = children[0].name
                  }
                  list[i].children = [];
                  list[i].children = children;
                  SnewList.push(list[i]);
                }
              }
            }
            //最后挂404页面
            SnewList.push({path: '*', redirect: '/404', hidden: true})

            router.addRoutes(SnewList);

            for (var i in SnewList) {
              router.options.routes.push(SnewList[i])
            }
          }
          next({ ...to, replace: true })
        })


      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next('/login')
    }
  }
})


Vue.mixin({
  methods:{
    //跳转链接
    defaultUrl(id,row){
      //渠道参数 channel
      return CHANNEL[row['channel']] ? (CHANNEL[row['channel']] + row[id]) : (NORMAL + row[id]);
    },
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
