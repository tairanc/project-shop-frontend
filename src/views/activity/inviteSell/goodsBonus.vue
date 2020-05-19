<template>
    <div class='goodsBonus'>
        <el-button type="primary" @click="selectVisible=true">添加主推商品</el-button>
        <el-button @click="delSelection">删除</el-button>
        <p></p>
        <table width='100%'  style="border-collapse:collapse">
            <tr class='goodsBonus_title'>
                <td width="35">
                    <input type="checkbox" v-model='checked' @click='checkedAll'>
                </td>
                <td width=50%>主推商品</td>
                <td v-for="(vip,index) in vipName" :key='index'>
                    {{vip.name}}提成比率
                </td>
                <td>
                    操作
                </td>
            </tr>
            <tr v-for='(goods,index) in list' :key="index">
                <td class='tc' width="35">
                    <input type="checkbox" v-model='checkList' :value="goods.item_id" @click="oneChecked(goods.item_id)">
                </td>
                <td>
                    <img :src="goods.item_image+'_t.jpg'" class='img'>
                    <p style="vertical-align: top;display:inline-block;width:70%">
                        <a :href="defaultUrl('item_id',goods)" class='goods_url' target="_blank">{{goods.item_title}}</a></p>
                </td>
                <td v-for='(rate,index) in goods.rates' :key="index" class='tc' v-show="!goods.edit"> 
                    <span>{{rate.val}}%
                        <el-popover
                            placement="right"
                            width="210"
                            trigger="hover"
                            v-if="rate.remain_time"
                            >  
                            <span>距该修改生效还需时间:
                                <count-down :endTime='rate.remain_time'></count-down>
                                <!-- <span>{{rate.remain_time}}</span>    -->
                            </span> 
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
                    <a @click="handleDelete(goods)">删除</a></div>
                    <el-button type="primary"  v-show="goods.edit" @click="handleCheck(goods)">保存修改</el-button>
                </td>
            </tr>
        </table>
        <pagination-view 
        :currentPage="form.page"
        v-show='list.length' 
        :total="total" 
        @size-change="sizeChange"
        @current-change="pageChange">
        </pagination-view>
        <invitesell-goods :saleType="type" :selectVisible="selectVisible" :selectList="selectList"  @visible-change="handleVisible"
        @choose-submit="handleAdd"></invitesell-goods>
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import CountDown from '@/components/CountDown'
import inviteSell from '@/api/activity/inviteSell'
import invitesellGoods from '@/components/invitesellGoods'
import ticket from '@/api/activity/ticket'
export default {
    data(){
        return{
            selectVisible: false,
            checked: false, //全选框
            end_time:'',
            checkList: [],
            total:0,
            list:[],
            goodsList:[],
            type:'invite',
            id:{
                item_ids:[]
            },
            checkAll: false,
            isIndeterminate: true,
            form:{
                page:1,
                page_size:20
            },
            vipName:[]
        }
    },
    methods:{
        getItemList(data){
            inviteSell.getItemList(data).then((res) =>{
                this.total =res.data.items.total_count
                this.list=[]
                this.newRates=[]
                this.vipName=[]
                for(var y in res.data.level_names){
                    this.vipName.push(res.data.level_names[y])
                }
                 for(var i in res.data.items.list){
                    let remain_time=res.data.items.list[i].remain_time
                    

                    if(res.data.items.list[i].effecting_rates ==null){
                         res.data.items.list[i].rates =[{val:0,remain_time:remain_time}]
                    }else{
                        let newRates =[]
                        for(let j in res.data.items.list[i].effecting_rates){
                            var n =(j*1+1)*1
                            let rate ={
                                val:0,
                                remain_time:remain_time
                            }
                        rate.val =res.data.items.list[i].effecting_rates[j][n]
                        
                        newRates.push(rate)
                    }
                    res.data.items.list[i].rates=newRates
                    }
                    this.list.push(res.data.items.list[i])
                    this.$set(res.data.items.list[i],'edit',false)
                }
            })
        },
        //全选
         checkedAll() {
            var _this = this;
            _this.checked =!_this.checked
            if (_this.checked) { //实现全选
                _this.checkList = [];
                _this.id.item_ids=[]
                _this.list.forEach(function(item, index) {
                _this.checkList.push(item.item_id);
                });
                _this.id.item_ids = _this.checkList
            } else { //实现反选
                _this.checkList = [];
                _this.id.item_ids=[]
             
               
            }
         },
         //单选
         oneChecked(item_id){
            let idIndex = this.id.item_ids.indexOf(item_id)
            if (idIndex >= 0) {
                this.id.item_ids.splice(idIndex, 1)
            } else {
                this.id.item_ids.push(item_id)
            }
         },
         //删除选中
         delSelection(){
             this.removeSpecial(this.id)
             this.getItemList(this.form)
         },
        //行编辑
        handleEdit(row){
            this.list.map((item)=>{
            if(item.item_id == row.item_id){
                item.edit = true
            }
            })
        },
        //移除主推商品
        removeSpecial(data){
            inviteSell.removeSpecial(data).then((res) =>{
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            })
        },
        //行删除
        handleDelete(row){
            // this.goodsList =this.goodsList.filter((item)=>{
            // return item.item_id != row.item_id
            // })
            this.id.item_ids=[]
            this.id.item_ids.push(row.item_id)
            this.removeSpecial(this.id)
            this.getItemList(this.form)

        },
        //行保存
        handleCheck(row){
            let data ={
                item_id:row.item_id,
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
            inviteSell.editSpecial(data).then((res) =>{
                row.edit = false
                this.getItemList(this.form)
            })
        },
        //全选
        handleSelectionChange (val) {
             this.id.item_ids=[]
             for(var i in val){
                this.id.item_ids.push(val[i].item_id)
             }
         },
        sizeChange(val){
            this.form.page_size=val;
            this.getItemList(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getItemList(this.form)
       },
       // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      handleAdd(val){
         ticket.importItemsById({
            item_id: val
          }).then((res) => {
            const result = res.data;
            this.getItemList(this.form)
            let errMsg = "";
            // if (result.itemList.length != 0) {
            //   this.goodsList = result.itemList
            // }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: 'warning'
              });
            }
          })
      }, 
    },
    created:function(){
        this.getItemList(this.form)
    },

    mounted() {

    },
    computed: {
      selectList(){
        let list = []
        this.goodsList.map((item)=> {
          (list.indexOf(item.item_id) == -1) && list.push(item.item_id)
        })
        return list
      },
    },
    components:{
        PaginationView,
        invitesellGoods,
        CountDown,
    }

}
</script>
<style lang="scss" scoped>
.goodsBonus{
    padding: 10px
    
}
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
.goodsBonus td{
    padding: 5px;
    font-size: 14px;
}
.img{
    height: 100px;
    width: 100px;
    display: inline-block;
}
.tc{
    text-align: center
}

.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>

