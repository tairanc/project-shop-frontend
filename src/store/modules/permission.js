import { getCookie } from '@/utils/auth'

const permission = {
    state: {
        roles:[],
    },
    mutations:{
        SET_ROLES:(state,routers) =>{
            state.roles = routers;
        },
    },
    actions:{
        //判断权限是否存在
       getRoles({ commit }, payload) {
           if(getCookie()){
            commit('SET_ROLES',getCookie())
           }
       }
       
    }
}
export default permission
