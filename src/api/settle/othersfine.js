import axios from '@/api/interception'

//列表
const searchIncidentalBill = (data) => {
  return axios({
    method: 'get',
    url: '/trmall/settlement/searchIncidentalBill',
    params:data
  })
}
export default {
  searchIncidentalBill
}
