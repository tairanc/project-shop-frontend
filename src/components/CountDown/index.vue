<template>
    <span>
        {{time}}
    </span>
     
</template>
<script>
   export default {
       data () {
           return {
               time : '',
               flag : false,
               h:'',
               m:'',
               s:'',
               endTime:this.endTime
           }
       },
        props:{
           endTime : {
               type : String,
                default:''
                
           }
       },
       mounted () {
           let time = setInterval(()=>{
               if(this.flag == true){
                   clearInterval(time)
                   window.location.reload()
               }
               this.timeDown()
           },1000)
       },
      
       methods : {
           timeDown () {
               var leftTime = this.endTime.split(":")
               var timeO = this.formate(leftTime[0])
               var timeT = this.formate(leftTime[1])
               var timeE = this.formate(leftTime[2])
               this.h =timeO*1
               this.m =timeT*1
               this.s =timeE*1
            //    if(leftTime <= 0){
            //        this.flag = true
            //        this.$emit('time-end')
            //    }
            if(this.h==0 && this.m==0 && this.s==0){
                        this.flag = true
                    }else{
                             if(this.s<=0 ){
                                this.s=59
                                this.m--//减分
                            }else if(this.m<=0&& this.h!=0){
                                this.m =59
                                this.h--//减时
                            }else{
                                this.s--
                            }
                            this.endTime = `${this.formate(this.h)}:${this.formate(this.m)}:${this.formate(this.s)}`
                            this.time =this.endTime
                    }
           },
           formate (time) {
               if(time>=10){
                   return time
               }else{
                   return `0${time}`
               }
           }
       },
   }
</script>