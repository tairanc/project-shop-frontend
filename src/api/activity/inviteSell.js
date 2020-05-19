import axios from '@/api/interception'
// 直销分类比率是否已经设置
const isCategoryInitialized = () => {
    return axios({
      method: 'get',
      url: '/trmall/invite/isCategoryInitialized',
    })
  }
//初始化分类提成比率
const initializeCategoriesRates = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/invite/initializeCategoriesRates',
      data: params
    })
  }
// 获取一级分类列表
const getPrimaryCategories = () => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getPrimaryCategories',
    })
  }   
//修改分类比率
const setCategoryRates = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/invite/setCategoryRates',
      data: params
    })
  }
//获取提成分类比率列表
const getShopCategoryList = () => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getShopCategoryList',
    })
  }
//提成订单明细列表
const getOrderDetailList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getOrderDetailList',
      params:params
    })
  }      
//返点订单明细列表
const getRebateDetailList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getRebateDetailList',
      params:params
    })
  }    
//提成订单汇总
const getOrderSumList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getOrderSumList',
      params:params
    })
}    
//返点订单汇总
const getRebateSumList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getRebateSumList',
      params:params
    })
}
//获取主推商品列表
const getItemList = (params) => {
    return axios({
      method: 'get',
      url: '/trmall/invite/getItemList',
      params:params
    })
}
//添加主推商品
const addSpecial = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/invite/addSpecial',
      data:params
    })
}
//编辑主推商品
const editSpecial = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/invite/editSpecial',
      data:params
    })
}
//移除主推商品
const removeSpecial = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/invite/removeSpecial',
      data:params
    })
}

export default {
    isCategoryInitialized,
    initializeCategoriesRates,
    getPrimaryCategories,
    setCategoryRates,
    getRebateSumList,
    getShopCategoryList,
    getOrderDetailList,
    getRebateDetailList,
    getOrderSumList,
    getItemList,
    addSpecial,
    editSpecial,
    removeSpecial,
}