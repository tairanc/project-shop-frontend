<template>
    <div id='orderInfo'>
        <el-form>
            <el-row>
                <el-col :span='5' :offset="1">
                    <el-form-item  label="订单状态" prop="order_status">
                        <el-select v-model="form.order_status" placeholder="全部状态">
                            <el-option label="已付款" value="20"></el-option>
                            <el-option label="已发货" value="30"></el-option>
                            <el-option label="已失效" value="50"></el-option>
                            <el-option label="已结算" value="40"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='5' :offset="1">
                    <el-form-item label="开始时间：" prop="start_at">
                        <el-date-picker v-model="form.start_at" type="datetime" placeholder="开始时间" 
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='5' :offset="1">
                    <el-form-item label="结束时间：" prop="end_at">
                        <el-date-picker v-model="form.end_at" type="datetime" placeholder="结束时间" 
                        format="yyyy-MM-dd HH:mm:ss"
                        value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span='3' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getListShareBonus(form)">搜索</el-button>
                </el-col>
                <el-col :span='3' :offset="1">
                    <el-button icon="el-icon-download" @click="exportExcel">下载报表</el-button>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span='6' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getListShareBonus(form)">搜索</el-button>
                </el-col>
                <el-col :span='6' :offset="1">
                    <el-button icon="el-icon-download" @click="exportExcel">下载报表</el-button>
                </el-col>
            </el-row> -->
        </el-form>
        <p></p>
        <table-view
        :columns="columns"
        :pageList="list"
        id='rebateSetTable'
        ></table-view>
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
import commission from '@/api/activity/commission'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
    data(){
        return{
            total:0,
            form:{
                page:1,
                page_size:20,
                start_at:'',
                end_at:'',
                order_status:''
            },
            list:[],
            columns:[
                {label: '订单创建时间',field: 'created_at',align: 'center'},
                {label: '订单结算时间',field: 'settled_at',align: 'center'},
                {label: '订单状态',field: 'order_status',align: 'center'},
                {label: '商品ID',field: 'item_id',align: 'center'},
                {   
                    label: '商品名称',
                    // field: 'title',
                    align: 'center',
                    isGood: 2
                },
                {label: '属性',field: 'spec_nature_info',align: 'center'},
                {label: '商品数量',field: 'item_num',align: 'center'},
                {label: '订单实付金额',field: 'payment_amount',align: 'center'},
                {label: '佣金比率',field: 'bonus_rate',align: 'center'},
                {label: '最终结算金额',field: 'settled_amount',align: 'center'},
                {label: '订单编号',field: 'shop_order_id',align: 'center'},
            ]
        }
    },
    methods:{
        getListShareBonus(data){
            commission.getListShareBonus(data).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.data){
                    var status = res.data.data[i].order_status
                    switch(status){
                        case 20 : res.data.data[i].order_status ='已付款'
                        break;
                        case 30 : res.data.data[i].order_status ='已发货'
                        break;
                        case 50 : res.data.data[i].order_status ='已失效'
                        break;
                        case 40 : res.data.data[i].order_status ='已结算'
                        break;
                    }
                    this.list.push(res.data.data[i])
                }
            })
        },
        sizeChange(val){
            this.form.page_size=val;
            this.getListShareBonus(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getListShareBonus(this.form)
       },
       //下载报表
       exportExcel () {
            this.form.page_size=-1
            commission.getListShareBonus(this.form).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.data){
                    var status = res.data.data[i].order_status
                    switch(status){
                        case 20 : res.data.data[i].order_status ='已付款'
                        break;
                        case 30 : res.data.data[i].order_status ='已发货'
                        break;
                        case 50 : res.data.data[i].order_status ='已失效'
                        break;
                        case 40 : res.data.data[i].order_status ='已结算'
                        break;
                    }
                    this.list.push(res.data.data[i])
                }
                setTimeout(function(){
                    let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                    try {
                        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '分佣订单细明.xlsx');
                        } catch (e)
                        {
                            if (typeof console !== 'undefined')
                                console.log(e, wbout)
                        }
                        return wbout
                },1000)
            })
            

              },
    },
    created:function(){
        this.getListShareBonus(this.form)
    },
    components:{
        TableView,
        PaginationView
    }
}
</script>
<style lang="scss" scoped>
    #orderInfo{
        .el-col-offset-1{
            margin-left:2.16667%;
        }
    } 

</style>

