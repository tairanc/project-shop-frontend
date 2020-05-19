<template>
    <section class='giftInfo'>
       <h3>礼包信息</h3>
       <p>礼包ID：{{package_info.id}}</p>
       <p>礼包名称：{{package_info.name}}</p>
       <p>礼包兑换码：{{package_info.exchange_code}}</p>
       <p>礼包金额：{{package_info.package_money}}</p>
       <p>优惠劵数量：{{package_info.coupon_num}}</p>
       <p>每人限领数量：{{package_info.user_get_limit}}</p>
       <p>每家店铺可报名优惠价数量：{{package_info.available_apply_num}}</p>
       <p>发放数量：{{package_info.send_quantity}}</p>
       <p>创建时间：{{package_info.created_at}}</p>
       <p>报名开始时间：{{package_info.apply_start_time}}</p>
       <p>领取开始时间：{{package_info.obtain_start_time}}</p>
       <p>领取结束时间：{{package_info.obtain_end_time}}</p>
       <h3>优惠劵信息</h3>
       <el-table class="table" :data="list" border align="center">
            <el-table-column align="center" label="优惠劵ID" prop="id"></el-table-column>
            <el-table-column align="center" label="优惠劵名称">
                <template slot-scope="scope">
                        <a :href="'/goods-activity/activity/ticketDetail?id='+scope.row.id" target="_blank" class='goods_url'>{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="门槛金额" prop="limit_money"></el-table-column>
            <el-table-column align="center" label="优惠金额" prop="deduct_money"></el-table-column>
            <el-table-column align="center" label="发放数量" prop="send_quantity"></el-table-column>
            <el-table-column align="center" label="领取数量" prop="user_obtain_quantity"></el-table-column>
            <el-table-column align="center" label="使用数量" prop="user_used_quantity"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="created_at"></el-table-column>
            <el-table-column align="center" label="优惠劵状态" prop="coupon_status"></el-table-column>
            <el-table-column align="center" label="审核状态" prop="verify_status"></el-table-column>
       </el-table>
    </section>
</template>
<script>
    import TableView from '@/components/TableView'
    import gift from '@/api/activity/gift'
    import { urlParse } from '@/utils/urlParse'
    export default {
        data() {
            return {
                list:[],
                package_info:'',
                info:{
                    package_id:'',
                    apply_id:'',
                    is_applied:'',
                },
                columns:[
                    {label: '优惠劵ID',field: 'id',align: 'center'},
                    {label: '优惠劵名称',field: 'name',align: 'center'},
                    {label: '门槛金额',field: 'limit_money',align: 'center'},
                    {label: '优惠金额',field: 'deduct_money',align: 'center'},
                    {label: '发放数量',field: 'send_quantity',align: 'center'},
                    {label: '领取数量',field: 'user_obtain_quantity',align: 'center'},
                    {label: '使用数量',field: 'user_used_quantity',align: 'center'},
                    {label: '创建时间',field: 'created_at',align: 'center'},
                    {label: '优惠劵状态',field: 'coupon_status',align: 'center'},
                    {label: '审核状态',field: 'verify_status',align: 'center'},
                ]
            }
        },
        methods:{
            getGiftInfo(data){
                gift.getGiftInfo(data).then((res) =>{
                    this.package_info = res.data.package_info
                    this.list =[]
                    for(var i in res.data.coupon_list.data){
                        var coupon_status = res.data.coupon_list.data[i].coupon_status
                        switch(coupon_status){
                            case 1 : res.data.coupon_list.data[i].coupon_status ='有效'
                            break;
                            case 0 : res.data.coupon_list.data[i].coupon_status ='已作废'
                            break;
                            case 2 : res.data.coupon_list.data[i].coupon_status ='无报名审核通过记录'
                            break;
                            case 3 : res.data.coupon_list.data[i].coupon_status ='待生效'
                            break;
                            case 4 : res.data.coupon_list.data[i].coupon_status ='生效中'
                            break;
                            case 5 : res.data.coupon_list.data[i].coupon_status ='已失效'
                            break;
                        }
                        var status = res.data.coupon_list.data[i].verify_status
                        switch(status){
                            case 'agree' : res.data.coupon_list.data[i].verify_status ='审核通过'
                            break;  
                            case 'refuse' : res.data.coupon_list.data[i].verify_status ='审核拒绝'
                            break;  
                            case 'pending' : res.data.coupon_list.data[i].verify_status ='审核中'
                            break;  
                        }
                        this.list.push(res.data.coupon_list.data[i])

                    }

                })
            }
        },
        created:function(){
            this.info.package_id=this.$route.query.package_id
            this.info.is_applied=this.$route.query.is_applied
            this.info.apply_id=this.$route.query.apply_id
            this.getGiftInfo(this.info)          
        },
        components:{
            TableView
        }
    }
</script>
<style lang="scss" scoped>
.giftInfo{
    padding: 10px;
    font-size: 14px
    p{
        font-size: 16px;
    }
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>
