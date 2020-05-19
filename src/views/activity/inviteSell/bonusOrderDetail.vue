<template>
    <div>
        <el-form>
            <el-row>
                <el-col :span='6' :offset="1">
                    <el-form-item label="开始时间：" prop="start_at">
                        <el-date-picker v-model="form.start_at" type="datetime" placeholder="开始时间" 
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='6' :offset="1">
                    <el-form-item label="结束时间：" prop="end_at">
                        <el-date-picker v-model="form.end_at" type="datetime" placeholder="结束时间" 
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='2' :offset="1">
                    <el-select v-model="form.status" placeholder="全部状态">
                        <el-option label="未到账" value="40"></el-option>
                        <el-option label="已到账" value="50"></el-option>
                        <el-option label="已失效" value="60"></el-option>
                    </el-select>
                </el-col>
                <el-col :span='2' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getOrderDetailList(form)">搜索</el-button>
                </el-col>
                <el-col :span='2' :offset="1">
                    <el-button icon="el-icon-download" @click="exportExcel">下载报表</el-button>
                </el-col>
            </el-row>
        </el-form>
        <p></p>
        <!-- <table-view
        :columns="columns"
        :pageList="list"
        id='rebateSetTable'
        ></table-view> -->
        <!-- <table id='rebateSetTable' style="width:100%;border-collapse:collapse">
            <tr>
                <td>平台订单号</td>
                <td>店铺订单号</td>
                <td>订单创建时间</td>
                <td>订单结算时间</td>
                <td>订单状态</td>
                <td>商品ID</td>
                <td>商品名称</td>
                <td>商品数量</td>
                <td>实付金额</td>
                <td>结算金额</td>
                <td>返点比率</td>
                <td>返点</td>
            </tr>
            <tr v-for="item in list">
               <td>{{item.order_id}}</td>
               <td>{{item.shop_order_id}}</td>
               <td>{{item.created_at}}</td>
               <td>{{item.settled_at}}</td>

            </tr>
        </table> -->
        <el-table class="table" :data="list" border align="center"  id='rebateSetTable' :span-method="spanMethod">
            <el-table-column align="center" label="平台订单号" prop="order_id">
            </el-table-column>
            <el-table-column align="center" label="店铺订单号" prop="shop_order_id">
            </el-table-column>
            <el-table-column align="center" label="订单创建时间" prop="created_at">
            </el-table-column>
            <el-table-column align="center" label="订单结算时间" prop="settled_at">
            </el-table-column>
            <el-table-column align="center" label="订单状态" prop="order_status">
            </el-table-column>
            <el-table-column align="center" label="商品ID" prop="item_id">
            </el-table-column>
            <el-table-column align="center" label="商品名称">
                <template slot-scope="scope">
                    <p>
                        <a :href="defaultUrl('item_id',scope.row)" class='goods_url' target="_blank">{{scope.row.title}}</a>
                    </p>
                </template>
            </el-table-column>
            <el-table-column align="center" label="商品数量" prop="item_num">
            </el-table-column>
            <el-table-column align="center" label="提成比率" prop="bonus_rate">
            </el-table-column>
            <el-table-column align="center" label="实付金额" prop="payment_amount">
            </el-table-column>
            <el-table-column align="center" label="结算金额" prop="settled_amount">
            </el-table-column>
            <el-table-column align="center" label="提成" prop="settled_income">
            </el-table-column>
            <el-table-column align="center" label="提成状态" prop="status">
            </el-table-column>
        </el-table>
        <pagination-view 
        :currentPage="form.page" 
        :total="total" 
        @size-change="sizeChange"
        @current-change="pageChange">
        </pagination-view>
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import inviteSell from '@/api/activity/inviteSell'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { objSpanArr } from '@/utils/objSpanArr'
export default {
    data(){
        return{
            total:0,
            form:{
                page:1,
                page_size:20,
                start_at:'',
                end_at:'',
                status:''
            },
            list:[],     
        }
    },
    computed: {
        objSpanArr(){
            return objSpanArr(this.list)
        }
    },
    methods:{
        getOrderDetailList(data){
            inviteSell.getOrderDetailList(data).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.list){
                    for(var j in res.data.list[i].shop){
                        let status = res.data.list[i].shop[j].order_status
                        switch(status){
                            case 10 : res.data.list[i].shop[j].order_status ='已创建'
                            break;
                            case 20 : res.data.list[i].shop[j].order_status ='已支付'
                            break;
                            case 30 : res.data.list[i].shop[j].order_status ='已发货'
                            break;
                            case 40 : res.data.list[i].shop[j].order_status ='已结算'
                            break;
                            case 50 : res.data.list[i].shop[j].order_status ='已失效'
                            break;
                        }
                        this.list.push(res.data.list[i].shop[j])
                    }
                    
                }
            })
        },
        //表格合并处理方法
            spanMethod({ row, column, rowIndex, columnIndex }) {
                let _this =this
                if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 ) {
                if (_this.objSpanArr[rowIndex] == 1) {
                    return {
                    rowspan: 0,
                    colspan: 0
                    }
                } else if(_this.objSpanArr[rowIndex] == 0){
                    return {
                    rowspan: 1,
                    colspan: 1
                    }
                }else {
                    return {
                    rowspan: _this.objSpanArr[rowIndex],
                    colspan: 1
                    }
                }
                }
            },    
        sizeChange(val){
            this.form.page_size=val;
            this.getOrderDetailList(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getOrderDetailList(this.form)
       },
       //下载报表
       exportExcel () {
            this.form.page_size=-1
            this.getOrderDetailList(this.form)
            setTimeout(function(){
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '提成订单明细.xlsx');
                    } catch (e)
                    {
                        if (typeof console !== 'undefined')
                            console.log(e, wbout)
                    }
                    return wbout
            },1000)
            
              },
    },
    created:function(){
        this.getOrderDetailList(this.form)
    },
    components:{
        TableView,
        PaginationView
    },
}
</script>
<style lang="scss" scoped>
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>

