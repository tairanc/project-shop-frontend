import axios from '@/api/interception'

//列表
const searchFineBill = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchFineBill',
    params:data
  })
}
export default {
  searchFineBill
}
