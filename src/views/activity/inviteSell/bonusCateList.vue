<template>
    <div class='cateList'>
         <table width='100%'  style="border-collapse:collapse">
            <tr class='goodsBonus_title'>
                <td>一级分类</td>
                <td v-for="(vip,index) in vipName" :key='index'>
                    {{vip.name}}提成比率
                </td>
                <td>
                    操作
                </td>
            </tr>
            <tr v-for='(goods,index) in list' :key="index">
                <td class='tc'>
                    {{goods.name}}
                </td>
                <td v-for='(rate,index) in goods.rates' :key="index" class='tc' v-show="!goods.edit"> 
                    <span>{{rate.val}}%
                        <el-popover
                            placement="right"
                            width="210"
                            trigger="hover"
                            v-show="rate.remain_time"
                            >  
                            <span>距该修改生效还需时间:<count-down :endTime='rate.remain_time' ></count-down></span>    
                            <i class="el-icon-time" slot="reference" icon ='el-icon-time' style="color:#409EFF"></i>
                        </el-popover>
                    </span>
                </td>

                 <td v-for='(rate,index) in goods.rates' class='tc' v-show="goods.edit" :key="'key'+index">
                    <el-input v-model="rate.val" style="width:100px"></el-input>%
                </td> 

                <td style="color:#409EFF" class='tc'>
                    <div  v-show="!goods.edit">
                    <a @click="handleEdit(goods)">编辑</a>
                    </div>
                    <el-button type="primary"  v-show="goods.edit" @click="handleSave(goods)">保存修改</el-button>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import inviteSell from '@/api/activity/inviteSell'
import CountDown from '@/components/CountDown'
var sss = '';
export default {
    data(){
        return{
            newdata : '',
            list:[],
            rates:[],
            vipName:[],
        }
    },
    methods:{
        getShopCategoryList(){
            inviteSell.getShopCategoryList().then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                this.rates=[]
                this.vipName=[]
                for(var y in res.data.level_names){
                    this.vipName.push(res.data.level_names[y])
                }
                for(var i in res.data.list){
                    let remain_time=res.data.list[i].remain_time
                    if(res.data.list[i].effecting_rates ==null){
                         res.data.list[i].effecting_rates =[{val:0,remain_time:remain_time}]
                    }else{
                        let newRates =[]
                        for(let j in res.data.list[i].effecting_rates){
                            var n =(j*1+1)*1
                            let rate ={
                                val:0,
                                remain_time:remain_time
                            }
                        rate.val =res.data.list[i].effecting_rates[j][n]
                        
                        newRates.push(rate)
                    }
                    res.data.list[i].rates=newRates
                    }
                    this.list.push(res.data.list[i])
                    this.$set(res.data.list[i],'edit',false)
                   
                }
            })
        },
        // countdown(remain_time){
        //             var bbe=remain_time.split(":")
        //             var timeO=bbe[0] //时
        //             var timeT=bbe[1] //分
        //             var timeE=bbe[2] //秒
        //             if(timeO==0&&timeT==0&&timeE==0){
        //                 window.clearInterval(timrS)
        //             }else{
        //                     if(timeE<=0 ){
        //                         timeE=59
        //                         timeT =timeT-1 //减分
        //                     }else if(timeT<=0&& timeO!=0){
        //                         timeT =59
        //                         timeO =timeO-1 //减时
        //                     }else{
        //                         timeE =timeE-1
        //                     }
        //                   return remain_time = timeO + ':' + timeT + ':' + timeE;
        //             }
        // },
        // timeDown(remain_time){
        //     var timrS = setInterval(function () {
        //         var bbe=remain_time.split(":")
        //         var timeO=bbe[0] //时
        //         var timeT=bbe[1] //分
        //         var timeE=bbe[2] //秒
        //         if(timeO==0&&timeT==0&&timeE==0){
        //             window.clearInterval(timrS)
        //         }else{
        //             if(timeE<=0 ){
        //                 timeE=59
        //                 timeT =timeT-1 //减分
        //             }else if(timeT<=0&& timeO!=0){
        //                 timeT =59
        //                 timeO =timeO-1 //减时
        //             }else{
        //                 timeE =timeE-1
        //             }
        //             return remain_time = timeO + ':' + timeT + ':' + timeE;   
        //         }
        //     },1000)
        //     // return this.countdown(remain_time)

        // },
        handleEdit(row){
            this.list.map((item)=>{
            if(item.category_id == row.category_id){
                item.edit = true
            }
            })
        },
        handleSave(row){
            let data ={
                category_id:row.category_id,
                rates:[]
            }
            let flag =[]
            for(let i in row.rates){
                let key = (i*1+1)*1
                let _data = {}
                _data[key] = row.rates[i].val
                flag.push(_data)

            }
            data.rates =flag
                 
            inviteSell.setCategoryRates(data).then((res) =>{
                row.edit = false
                this.getShopCategoryList()
            })
        },
    },
    computed:{
        
    },
    created:function(){
        this.getShopCategoryList()
    },
    components:{
        PaginationView,
        CountDown,
    },
}
</script>

<style>
.goodsBonus_title td{
    text-align: center;
    background: #f5f7fa;
    white-space: nowrap;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    color: #909399;
    border-collapse: separate;
    font-size: 14px;
    line-height: 40px;
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
    height: 40px;
    font-weight: 500;
}
.cateList td{
    line-height: 40px;
    -webkit-box-sizing: inherit;
    box-sizing: inherit;
    height: 40px;
    font-size: 14px;
    padding: 5px
}
.img{
    height: 100px;
    width: 100px;
    display: inline-block;
}
.tc{
    text-align: center
}
</style>

