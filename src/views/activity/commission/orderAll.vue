<template>
    <div>
        <el-form>
            <el-row>
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
                <el-col :span='5' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getOrderGatherList(form)">搜索</el-button>
                </el-col>
                <el-col :span='5' :offset="1">
                    <el-button icon="el-icon-download" @click="exportExcel">下载报表</el-button>
                </el-col>
            </el-row>
            <!-- <el-row>
                <el-col :span='5' :offset="1">
                    <el-button type="primary" icon="el-icon-search" @click="getOrderGatherList(form)">搜索</el-button>
                </el-col>
                <el-col :span='5' :offset="1">
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

        <table-view
        :columns="columns"
        :pageList="listdown"
        id='rebateSetTabledown'
        ></table-view>
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
                end_at:''
            },
            list:[],
            listdown:[],
            columns:[
                {label: '日期',field: 'day',align: 'center'},
                // {label: '点击数',field: 'clicks',align: 'center'},
                {label: '实付金额',field: 'sum_payment_amount',align: 'center'},
                {label: '最终结算金额',field: 'sum_real_amount',align: 'center'},
                {label: '佣金支出',field: 'sum_settled_income',align: 'center'},
                {label: '平均分佣比率',field: 'avg_bonus_rate',align: 'center'},
                // {label: '审核状态',field: 'check_status',align: 'center'},
            ]
        }
    },
    methods:{
        getOrderGatherList(data){
            commission.getOrderGatherList(data).then((res)=>{
                this.total =res.data.total_count
                this.list =[]
                for(var i in res.data.data){
                    this.list.push(res.data.data[i])
                }
            })
        },
        sizeChange(val){
            this.form.page_size=val;
            this.getOrderGatherList(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getOrderGatherList(this.form)
       },
       //下载报表
       exportExcel () {
            let _form = JSON.parse(JSON.stringify(this.form));
                _form.page_size=-1
            commission.getOrderGatherList(_form).then((res)=>{
                this.listdown =[]
                for(var i in res.data.data){
                    this.listdown.push(res.data.data[i])
                }
                setTimeout(function(){
                    let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTabledown'));
                    let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
                    try {
                        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '分佣订单汇总.xlsx');
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
        this.getOrderGatherList(this.form)
    },
    components:{
        TableView,
        PaginationView
    }
}
</script>
<style lang="scss" scoped>
    #rebateSetTabledown{
        display: none;
    }
</style>

