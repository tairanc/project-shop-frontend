import axios from '@/api/interception'

//列表
const searchRefundBill = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchRefundBill',
    params:data
  })
}
export default {
  searchRefundBill
}
