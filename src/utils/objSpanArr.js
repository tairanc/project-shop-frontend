export function objSpanArr(list){
    let arr = []
    //就只有一条数据
    if(list.length <2){
      return arr = [0]
    }
    let flag = 0
  
    list.map((item,index)=>{
      //先判断第一条
      if(index == 0){
        if(item.order_id != list[1].order_id){
          arr.push(0)
        }else{
          arr.push(1)
        }
      }else{
        if(item.order_id == list[index-1].order_id){
          arr[flag] += 1
          arr.push(1)
        }else if(index<list.length-1 && item.order_id == list[index+1].order_id){
          arr.push(1)
          flag = index
        }else{
          arr.push(0)
          flag = index
        }
      }
    })
    return arr
  }