import axios from '@/api/interception'
const getGroupList = (params) => {
    return axios({method: 'get', url: '/trmall/groupbuy/getGroupBuyList', params})
  }
const downGroup =(params) =>{
    return axios({method:'post',url:'/trmall/groupbuy/closeGroupBuyItem',data:params})
}
const importItemsById = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/itemselect/importItems',
      data: params
    })
  }  
const createGroupBuy = (params) => {
    return axios({
      method: 'post',
      url: '/trmall/groupbuy/createGroupBuy',
      data: params
    })
  }
  export default {
    getGroupList,downGroup,importItemsById,createGroupBuy
  }