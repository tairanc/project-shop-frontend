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
                <el-col :span='3' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getRebateSumList(form)">搜索</el-button>
                </el-col>
                <el-col :span='4' :offset="1">
                    <el-button icon="el-icon-download" @click="exportExcel">下载报表</el-button>
                </el-col>
            </el-row>
        </el-form>
        <p></p>
        <table-view
        :columns="columns"
        :pageList="list"
        id="rebateSetTableSum"
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
import inviteSell from '@/api/activity/inviteSell'
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
                end_at:''
            },
            list:[],
            columns:[
                {label: '日期',field: 'day',align: 'center'},
                {label: '付款金额',field: 'sum_payment_amount',align: 'center'},
                {label: '结算金额',field: 'sum_real_amount',align: 'center'},
                {label: '返点支出',field: 'sum_settled_income',align: 'center'},
                {label: '审核状态',field: 'check_status',align: 'center'},
            ]
        }
    },
    methods:{
        getRebateSumList(data){
            inviteSell.getRebateSumList(data).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.data){
                    this.list.push(res.data.data[i])
                }
            })
        },
        sizeChange(val){
            this.form.page_size=val;
            this.getRebateSumList(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getRebateSumList(this.form)
       },
       //下载报表
       exportExcel () {
            this.form.page_size=-1;
            inviteSell.getRebateSumList(this.form).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.data){
                    this.list.push(res.data.data[i])
                }
            setTimeout(function(){
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTableSum'));
                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '返点订单汇总.xlsx');
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
        this.getRebateSumList(this.form)
    },
    components:{
        TableView,
        PaginationView
    }
}
</script>
<style lang="scss" scoped>

</style>
