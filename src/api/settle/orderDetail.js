import axios from '@/api/interception'

//列表
const searchOrderGoodBill = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchOrderGoodBill',
    params:data
  })
}
export default {
  searchOrderGoodBill
}
