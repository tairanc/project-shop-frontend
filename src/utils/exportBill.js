import axios from '@/api/interception'


//导出export
const exportBill = (data) => {
  return axios({
    method: 'post',
    url: '/trmall/settlement/exportBill',
    data:data
  })
};
export const exportFun = (data,_this) => {
  exportBill(data).then((res) => {
    let {data:{result}} = res;
    if(result){
      _this.$message({
        showClose: true,
        message: "导出成功",
        type: 'success'
      });
    }
  })
};
