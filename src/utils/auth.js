
//  export function saveToken (data){
//     return sessionStorage.setItem('key',JSON.stringify(data))
//   }
//   export function getToken(key){
//     return JSON.parse(sessionStorage.getItem(key))
//   }
   
//   export function removeToken (key){
//     return sessionStorage.removeItem(key)
//   }
  export function saveToken(name,value,time){
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path=/";
    }
    function getsec(str){
        var str1=str.substring(1,str.length)*1;
        var str2=str.substring(0,1);
        if (str2=="s"){
            return str1*1000;
        }else if(str2=="m"){
            return str1*60*1000
        }
        else if (str2=="h"){
            return str1*60*60*1000;
        }
        else if (str2=="d"){
            return str1*24*60*60*1000;
        }
  }
   function cookie(token){
        var arr,reg=new RegExp("(^| )"+token+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        }else{
            return null;
        }
    }
export function clearCookie(name) {    
        saveToken(name, "","-1");    
      } 
export function getCookie(){
    return cookie('shop_token')
}
export function getNameCookie(){
    return cookie('admin')
}
    