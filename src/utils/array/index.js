// 返回数组 交集
export function interSection(arr1, arr2){
    let _result = []
    if (arr1.length > 0 && arr2.length > 0) {
        arr1.map((item,index)=>{
            if (arr2.includes(item)) {
                _result.push(item)
            }
        })
    }
    return _result   
}