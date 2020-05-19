import axios from '@/api/interception'
//管理芯片列表
const getChip = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/trgo/getChipList',
    params: params
  })
}
//商品芯片列表
const getSkuChipList = (params) => {
  return axios({
    method: 'get',
    url: '/trmall/trgo/getSkuChipList',
    params: params
  })
}
//商品芯片详情
const getSkuChipInfo=(params) =>{
  return axios({
    method: 'get',
    url: '/trmall/trgo/getSkuChipInfo',
    params: params
  })
}
//写入芯片
const initChipManager=(params) =>{
  return axios({
    method: 'get',
    url: '/trmall/trgo/initChipManager',
    params: params
  })
}
//保存被选择的商品芯片信息
const saveSelectedItem=(params) =>{
  return axios({
    method: 'post',
    url: '/trmall/trgo/saveSelectedItem',
    data:params
  })
}
//保存芯片
const saveChips=() =>{
  return axios({
    method: 'post',
    url: '/trmall/trgo/saveChips',
  })
}
//多规格商品信息
const getSkuDetail=(params) =>{
  return axios({
    method: 'GET',
    url: '/trmall/trgo/getSkuDetail',
    params: params
  })
}
const importItemsById = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/itemselect/importItems',
      data: params
    })
  } 
export default {
    importItemsById,getChip,getSkuChipList,getSkuChipInfo,initChipManager,saveSelectedItem,saveChips,getSkuDetail
  }