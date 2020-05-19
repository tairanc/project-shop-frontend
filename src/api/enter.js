import axios from '@/api/interception'

function judgeChannel(channel) {
  switch (channel) {
    case "TrInstallment":
      return "installment";
    default:
      return "trmall"
  }
}


//获取经营类目
const getCategory = (params) => {
  return axios({method: 'get', url: '/trmall/category/getPrimarySecondlyCategoryList', params: params})
}

//获取经营类目下的品牌
const getRelBrandList = (params) => {
  return axios({method: 'get', url: '/trmall/brand/getRelBrandListByCategoryId', params: params})
}

//申请店铺入驻
const createEnterApply = (params, channel) => {
  channel = judgeChannel(channel);
  return axios({method: 'post', url: '/' + channel + '/shop/createEnterApply', data: params})
}

//获取入驻状态接口
const getApplyStatusInfo = (params) => {
  return axios({method: 'get', url: '/trmall/shop/getApplyStatusInfo', params: params})
}

//获取入驻信息
const getEnterApply = (params) => {
  return axios({method: 'get', url: '/trmall/shop/getEnterApply', params: params})
}

//更新入驻信息
const updateEnterApply = (params, channel) => {
  channel = judgeChannel(channel);
  return axios({method: 'post', url: '/' + channel + '/shop/updateEnterApply', data: params})
}

export default {
  getCategory,
  getRelBrandList,
  createEnterApply,
  getApplyStatusInfo,
  getEnterApply,
  updateEnterApply
}
