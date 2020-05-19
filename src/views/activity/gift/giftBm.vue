<template>
    <section class='giftInfo'>
       <p v-if="package_info.apply_status=='refuse'">审核驳回原因：{{package_info.refuse_reason}}</p>
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
       <p></p>
       <el-button type="primary" @click='clickCoupon'>选择优惠劵</el-button>
       <p></p>

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
            <el-table-column align="center" label="优惠劵状态" prop="valid_status"></el-table-column>
            <el-table-column align="center" label="审核状态" prop="verify_status"></el-table-column>
            <el-table-column align="center" label="操作">
                 <template slot-scope="scope">
                        <a @click="deleteCoupons(scope.row.id)">删除</a>
                </template>
            </el-table-column>
       </el-table>
       <el-dialog
        title="优惠劵列表"
        :visible.sync="centerDialogVisible"
        width="60%"
        center>
        <el-table class="table" :data="couponList" border align="center" @selection-change="handleSelectionChange">
            <el-table-column  
            type="selection"
            width="35"
            :selectable='selectable'>
            </el-table-column>
            <el-table-column align="center" label="优惠劵ID" prop="id">
            </el-table-column>
            <el-table-column align="center" label="优惠劵名称" prop="name">
                <template slot-scope="scope">
                        <a :href="'/goods-activity/activity/ticketDetail?id='+scope.row.id" target="_blank" class='goods_url'>{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column align="center" label="门槛金额" prop="limit_money">
            </el-table-column>
            <el-table-column align="center" label="优惠金额" prop="deduct_money">
            </el-table-column>
            <el-table-column align="center" label="发放数量" prop="send_quantity">
            </el-table-column>
            <el-table-column align="center" label="领取数量" prop="user_obtain_quantity">
            </el-table-column>
            <el-table-column align="center" label="使用数量" prop="user_used_quantity">
            </el-table-column>
            <el-table-column align="center" label="优惠劵状态" prop="status">
            </el-table-column>
        </el-table>    
         <pagination-view 
         :currentPage="form.page" 
         :total="total" 
         @size-change="sizeChange"
         @current-change="pageChange">
        </pagination-view>
        <div class='isSumit'>
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="couponYes">确 定</el-button>
        </div>
        </el-dialog>
        <p></p>
        <el-button  class="submit" @click='clickSavaGift'>提交</el-button>
    </section>
</template>
<script>
    import TableView from '@/components/TableView'
    import PaginationView from '@/components/PaginationView'
    import gift from '@/api/activity/gift'
    import { urlParse } from '@/utils/urlParse'
  
    export default {
        data() {
            return {
                value:[],
                package_info:'',
                info:{
                    package_id:'',
                    apply_id:''
                },
                form:{
                    page:1,
                    page_size:20,
                    package_id:''
                },
                couponList:[],
                total:0,
                couponColumns:[
                    {label: '优惠劵ID',field: 'id',align: 'center'},
                    {label: '优惠劵名称',field: 'name',align: 'center'},
                    {label: '门槛金额',field: 'limit_money',align: 'center'},
                    {label: '优惠金额',field: 'deduct_money',align: 'center'},
                    {label: '发放数量',field: 'send_quantity',align: 'center'},
                    {label: '领取数量',field: 'user_obtain_quantity',align: 'center'},
                    {label: '使用数量',field: 'user_used_quantity',align: 'center'},
                    {label: '优惠劵状态',field: 'valid_status',align: 'center'},
                ],
                centerDialogVisible:false,
                list:[],
                columns:[
                    {label: '优惠劵ID',field: 'id',align: 'center'},
                    {label: '优惠劵名称',field: 'name',align: 'center'},
                    {label: '门槛金额',field: 'limit_money',align: 'center'},
                    {label: '优惠金额',field: 'deduct_money',align: 'center'},
                    {label: '发放数量',field: 'send_quantity',align: 'center'},
                    {label: '领取数量',field: 'user_obtain_quantity',align: 'center'},
                    {label: '使用数量',field: 'user_used_quantity',align: 'center'},
                    {label: '创建时间',field: 'created_at',align: 'center'},
                    {label: '优惠劵状态',field: 'valid_status',align: 'center'},
                    {label: '审核状态',field: 'verify_status',align: 'center'},
                    {
                        label:'操作',
                        align:'center',actions: [
                            {
                                label: '删除',
                                type: 'text',
                                size: 'medium',
                                disable: (row, index) => {
                                // return row.status == 30 || row.status == 40 || row.status == 50
                                return false
                                },
                                click: (index, row) => {
                                this.deleteCoupons(row.id);
                                }
                            },
                        ]
                    
                    }
                ],
                savaGiftData:{
                    package_id:'',
                    coupon_ids:[]
                }
            }
        },
        methods:{
            getGiftCouponList(data){
                gift.getGiftCouponList(data).then((res) =>{
                    this.couponList =[]
                    this.total = res.data.total_count
                    for(var i in res.data.data){
                        var  valid_status = res.data.data[i].valid_status
                        var  status = res.data.data[i].status
                        switch(valid_status){
                            case 'invalid' : res.data.data[i].valid_status  ='已作废'
                            break
                            case 'valid' : res.data.data[i].valid_status  ='有效中'
                            break
                        }
                        switch(status){
                            case 1 : res.data.data[i].status  ='有效'
                            break;
                            case 0 : res.data.data[i].status ='已作废'
                            break;
                            case 2 : res.data.data[i].status ='无报名审核通过记录'
                            break;
                            case 3 : res.data.data[i].status ='待生效'
                            break;
                            case 4 : res.data.data[i].status ='生效中'
                            break;
                            case 5 : res.data.data[i].status ='已失效'
                            break;
                        }
                        this.couponList.push(res.data.data[i])
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
            },
             getGiftInfo(data){
                gift.getGiftInfo(data).then((res) =>{
                    this.package_info = res.data.package_info
                    this.list =[]
                    if(res.data.data !=''){
                        for(var i in res.data.coupon_list.data){
                        var coupon_status = res.data.coupon_list.data[i].status
                        switch(coupon_status){
                            case 1 : res.data.coupon_list.data[i].status ='有效'
                            break;
                            case 0 : res.data.coupon_list.data[i].status ='已作废'
                            break;
                            case 2 : res.data.coupon_list.data[i].status ='无报名审核通过记录'
                            break;
                            case 3 : res.data.coupon_list.data[i].status ='待生效'
                            break;
                            case 4 : res.data.coupon_list.data[i].status ='生效中'
                            break;
                            case 5 : res.data.coupon_list.data[i].status ='已失效'
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
                    }
                })
            },
            //禁用优惠劵
            selectable(row){
                return row.valid_status =='有效中'
            
            },
            //选择优惠劵
            clickCoupon(){
                this.centerDialogVisible =true;
                this.form.package_id=urlParse().package_id
                this.getGiftCouponList(this.form)
            },
            sizeChange(val){
                this.form.page_size=val
                this.getGiftCouponList(this.form)
            },
            pageChange(val){
                this.form.page=val
                this.getGiftCouponList(this.form)
            },
            //复选框
            handleSelectionChange(val){
                this.value = val
            },
            //确定优惠劵
            couponYes(){
                let id =[]
                for(var i in this.list){
                    id.push(this.list[i].id)
                }
                for(var j in this.value){
                    if(id.indexOf(this.value[j].id)<0){
                        this.list.push(this.value[j])
                    }
                }
                this.centerDialogVisible = false
                // for(let i in this.value){
                //     for(let j in this.list){
                //         if(this.value[i].id == this.list[j].id){
                //             flag ++
                //         }
                //     }  
                // }
                // if(flag == 0){
                //     for(let i in this.value){
                //         this.list.push(this.value[i])
                //     }
                //      this.centerDialogVisible = false
                // }else{
                //     this.$message({
                //         message: '优惠劵已存在',
                //         type: 'warning'
                //     })
                // }
               
            },
            deleteCoupons(id) {
                this.list = this.list.filter(function (item) {
                return item.id != id;
                })
            },
            //保存礼包
            saveGift(data){
                gift.saveGift(data).then((res) =>{
                this.$router.push({
                    name:'giftpackage'})
                
                })
            },
            clickSavaGift(){
                 this.savaGiftData.package_id = urlParse().package_id
                 this.savaGiftData.coupon_ids =[]
                 this.savaGiftData.apply_id =this.info.apply_id
                 var _this =this
                 var list = this.list
                 for(var i in list){
                     _this.savaGiftData.coupon_ids.push(list[i].id)
                 }
                 _this.saveGift(this.savaGiftData)
            }
        },
        created:function(){
            this.info.package_id=this.$route.query.package_id
            this.info.apply_id=this.$route.query.apply_id
            this.info.apply_id ? this.getGiftInfo(this.info) : this.getGiftInfo({package_id:this.info.package_id})
        },
        components:{
            TableView,
            PaginationView
        }
    }
</script>
<style lang="scss" scoped>
.giftInfo{
    padding: 10px;
    font-size: 14px;
    p{
        font-size: 16px
    }
    .submit{
        display: block;
        margin: auto
    }
}
.isSumit{
    margin-top:60px;
    text-align: center
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>
