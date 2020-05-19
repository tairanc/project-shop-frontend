import axios from '@/api/interception'

const getRoleList = () => {
  return axios({
    method: 'get',
    url: '/trmall/shop/getRoleList',
  })
}
const delRole =(parm) =>{
    return axios({
        method:'post',
        url:'/trmall/shop/deleteRole',
        data:parm
    })
}
const getRoleInfo =(params) =>{
    return axios({
        method:'get',
        url:'/trmall/shop/getRoleInfo',
        params,
        
    })
}
const getPrivilegeList =() =>{
    return axios({
        method:'get',
        url:'/trmall/shop/getPrivilegeList',
    })
}

const createRole =(param) =>{
    return axios({
        method:'post',
        url:'/trmall/shop/createRole',
        data:param
    })
}
const updateRole =(param) =>{
    return axios({
        method:'post',
        url:'/trmall/shop/updateRole',
        data:param
    })
     
}
export default {
    getRoleList,delRole,getRoleInfo,getPrivilegeList,createRole,updateRole
}