import axios from '@/api/interception'

//列表
const searchFreightBill = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchFreightBill',
    params:data
  })
}
export default {
  searchFreightBill
}
