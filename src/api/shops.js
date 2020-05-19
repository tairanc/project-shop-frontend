import axios from '@/api/interception'

// 获取店铺信息
const getShopInfo = () => {
  return axios({
    method: 'get',
    url: '/trmall/shop/getShopInfo'
  })
}


// pc店铺装修初始信息
const pcIndex = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/decoration/pcIndex',
    params: params
  })
}


// wap店铺装修初始信息
const wapIndex = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/decoration/wapIndex',
    params: params
  })
}

//pc装修预览
const prePcDecorate = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/decoration/preview',
    data: params
  })
}

//店铺所有优惠券列表
const shopCoupons = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/decoration/shopCoupons',
    params: params
  })
}

//pc店铺装修保存
const savePcDecorate = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/decoration/pc/save',
    data: params
  })
}

//wap店铺装修保存
const saveWapDecorate = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/decoration/wap/save',
    data: params
  })
}

//店铺配置初始化接口
const getShopExtendData = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/getShopExtendData',
    params: params
  })
}

//店铺配置保存接口
const updateShopInfo = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/updateShopInfo',
    data: params
  })
}

//店铺入驻信息
const getShopExtendEnterData = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/getShopExtendEnterData',
    params: params
  })
}

//店铺发票配置
const getInvoice = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/invoice/get',
    params: params
  })
}

//设置店铺发票
const setInvoice = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/invoice/set',
    data: params
  })
}

//店铺类目申请列表
const getCategoryApply = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/categoryApply/list/get',
    params: params
  })
}

//店铺类目申请列表
const getBrandList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/brandApply/applicableBrandList',
    params: params
  })
}

//店铺类目申请列表
const getBrandApply = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/brandApply/list',
    params: params
  })
}

//店铺可申请类目列表
const getAvailableCats = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/shop/categoryApply/availableCats/get',
    params: params
  })
}

//店铺类目申请
const applyBrandApply = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/brandApply/apply',
    data: params
  })
}

//店铺类目申请
const applyCategoryApply = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/categoryApply/apply',
    data: params
  })
}

//店铺类目重新申请
const reapplyCategoryApply = (params) => {
  return axios({
    method: 'post',
    url: '/trmall/shop/categoryApply/reapply',
    data: params
  })
}

//店铺删除类目申请
const deleteCategoryApply = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/shop/categoryApply/remove',
    params: params
  })
}

//店铺删除品牌申请
const deleteBrandApply = (params) => {
  return axios({
    method: 'delete',
    url: '/trmall/shop/brandApply/delete',
    params: params
  })
}

export default {
  getShopInfo,
  pcIndex,
  wapIndex,
  shopCoupons,
  prePcDecorate,
  savePcDecorate,
  saveWapDecorate,
  getShopExtendData,
  updateShopInfo,
  getShopExtendEnterData,
  getInvoice,
  setInvoice,
  getCategoryApply,
  getBrandList,
  getBrandApply,
  getAvailableCats,
  deleteCategoryApply,
  deleteBrandApply,
  applyBrandApply,
  reapplyCategoryApply,
  applyCategoryApply
}
