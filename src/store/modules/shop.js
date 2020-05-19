import axios from '@/api/interception'

const shop = {
  state: {
    sellImgSrc : ''       ,//选中销售图片 src
    skuitem:{},           //sku选中数据
    selcctImgListUrl: [], //图片url 数组
    selectImgList : [],   //发布商品图片数组处理
    goodsIntInfo:null,
    categoryList: [],
    bindCategoryList: [],
    accountId: '',
    shopId: '',
    brandImgUrlList: [],    //品牌列表
    selectBrandImgList:[],  //选中列表
  },

  mutations: {
    upSkuSelect(state, payload){
      state.skuitem = payload.skuitem
    },
    delImgList(state,payload){
      state.selectImgList =[]
    },
    upImgSelect(state, payload){
      state.selectImgList = payload.imgitem
      if (state.selectImgList.length > 0) {
        let _data = []
        state.selectImgList.map((item,index)=>{
          _data.push(item.url)
        })
        state.selcctImgListUrl = _data
      }else{
        state.selcctImgListUrl = []
      }
    },
    upBrandImg(state, payload){
      state.selectBrandImgList = payload.brandImg
      if (state.selectBrandImgList) {
        let _data = []
        state.selectBrandImgList.map((item,index)=>{
          _data.push(item.url)
        })
        state.brandImgUrlList = _data
      }else{
        state.brandImgUrlList = []
      }
    },
    upSellImgSelect(state, payload){
      state.sellImgSrc = payload.imgsrc
    },
    upGoodsInfo(state, payload){
      state.goodsIntInfo = payload.data
    },
    updateData(state, payload) {
      state[payload.name] = payload.value
    },
    SET_ACCOUNTID: (state, accountId) => {
      state.accountId = accountId
    },
    SET_SHOPID: (state, shopId) => {
      state.shopId = shopId
    }
  },

  actions: {
    getCategoryList({ commit }, payload) {
      axios({
        method: 'get',
        url: '/trmall/item/shop_category'
      }).then((res) => {
        if(res.code === 0){
          commit('updateData', {
            name: 'categoryList',
            value: res.data
          })
        }
      })
    },
    getBindCategoryList({ commit }, payload) {
      axios({
        method: 'get',
        url: '/trmall/category/shop_bind_category/get'
      }).then((res) => {
        if(res.code === 0){
          for(let i=0;i<res.data.length;i++){
              if (res.data[i].sub) {
                res.data[i].children = res.data[i].sub
                let childLength = res.data[i].children.length
                for (let j = 0; j < childLength; j++) {
                  if (res.data[i].children[j].sub) {
                    res.data[i].children[j].children = res.data[i].children[j].sub
                  }
                }
              }
          }
          // 萌宠店铺只展示萌宠分类
          let petCate = [];
          for(let i=0;i<res.data.length;i++){
            if(payload.channel == 'pet' && res.data[i].value == 1225){
              petCate.push(res.data[i])
            }
          }

          commit('updateData', {
            name: 'bindCategoryList',
            value: payload.channel == 'pet' ? petCate : res.data
          })
        }
      })
    },
    getGoodsInfoList({ commit }, payload) {
      axios({
        method: 'get',
        url: '/trmall/item/init_publish',
        params : {item_id : payload.id}
      }).then((res) => {
        if(res.code === 0){
          // for(let i=0;i<res.data.length;i++){
          //   if(res.data[i].sub){
          //     res.data[i].children = res.data[i].sub
          //     let childLength = res.data[i].children.length
          //     for(let j=0;j<childLength;j++){
          //       if(res.data[i].children[j].sub){
          //         res.data[i].children[j].children = res.data[i].children[j].sub
          //       }
          //     }
          //   }
          // }
          commit('upGoodsInfo', {
            data: res.data
          })
        }
      })
    },
    setImgSelect({ commit }, payload){
      commit('upImgSelect' , {
        imgitem : payload
      })
    },
    setBrandImg({ commit }, payload){
      commit('upBrandImg' , {
        brandImg : payload || []
      })
    },
    setSellImgSelect({ commit }, payload){
      commit('upSellImgSelect' , {
        imgsrc : payload.url
      })
    },
    setSkuSelect({ commit }, payload){
      commit('upSkuSelect' , {
        skuitem : payload
      })
    },
  }
}

export default shop
