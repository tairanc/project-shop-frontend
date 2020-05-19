    <template>
        
       <section>
            <v-header></v-header>
            <div class="manage">   
                <div class="title"><i class='el-icon-date'></i> {{info.today_week}} 您和泰然城合作的第{{info.open_days}}天，亲继续加油哦!</div>
                <div class="title_list">
                    <el-row>
                        <div class="mm">实时数据 
                            <!-- <span class='colors'>更新时间：2018-01-16 17：57：25
                            </span> -->
                        </div>
                    </el-row>
                    
                    <el-row :gutter="20">
                        <!-- <el-col :span="6">
                            <div>
                                <span>支付金额</span>
                                <span>2980.00</span>
                            </div>
                            <div>
                                <span>昨日全天</span>
                                <span>656.68</span>
                            </div>
                        </el-col>

                        <el-col :span="6">
                            <div>
                                <span>支付买家数</span>
                                <span>18</span>
                            </div>
                            <div>
                                <span>昨日全天</span>
                                <span>656.68</span>
                            </div>
                        </el-col> -->

                        <el-col :span="6">
                            <div>
                                <span>昨日支付子订单数</span>
                                
                                     <span v-if="info.yesterday_order_data">{{info.yesterday_order_data.order_good_count}}</span>
                            </div>
                            <div>
                                <span>昨日全天</span>
                              
                                <span v-if="info.yesterday_order_data">{{info.yesterday_order_data.payment}}</span>
                            </div>
                        </el-col>

                        <el-col :span="6">
                            <div>
                                <span>今日支付子订单数</span>
                                <span v-if="info.today_order_data">{{info.today_order_data.order_good_count}}</span>
                            </div>
                            <div>
                                <span>今日全天</span>
                                  <span v-if="info.today_order_data">{{info.today_order_data.payment}}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <el-row :gutter="20">
                    <el-col :span="12"><div class="title_list">
                        <span>店铺动态</span>
                        <h3>商品管理</h3>
                        <div class='shop_text'>
                            <span>出售中的商品:{{selling}}</span>
                            <span>等待上架的商品:{{wait_for_shelf}}</span>
                        </div>

                        <h3>交易提醒</h3>
                        <div class='shop_text'>
                            <span>待发货订单:{{order_num.wait_for_delivery}}</span>
                            <span>待评价订单:{{order_num.wait_for_rate}}</span>
                            <span>待处理售后单:{{after_sale_num.wait_for_deal}}</span>
                        </div>

                    
                        <div class='shop_text' v-if="item_num.not_pass">
                            <h3>违规提醒</h3>
                            <span>审核不通过的商品：{{item_num.not_pass.count}}</span>
                        </div>
                    </div></el-col>
                    <el-col :span="12">
                        <!-- <div class="title_list">
                        <span>最新动态</span>
                        </div> -->
                        </el-col>
                </el-row>
            </div>           
        </section>         
    </template>
    <script>
    import VHeader from '@/components/Header'
    import login from "@/api/login/login";
        export default {
            data() {
                return {
                    info:'',
                    selling:'',
                    wait_for_shelf:'',
                    order_num:'',
                    after_sale_num:'',
                    item_num:''
                }
            },
            methods: {
                getShopTrends(){
                    login.getShopTrends().then((res) =>{
                        this.info =res.data
                        this.selling =res.data.item_num.selling.count
                        this.wait_for_shelf =res.data.item_num.wait_for_shelf.count
                        this.order_num =res.data.order_num
                        this.after_sale_num =res.data.after_sale_num
                        this.item_num =res.data.item_num
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                }

            },
            components:{
                VHeader
            },
            created() {
                this.getShopTrends()
            }
            
        }
    </script>

    <style lang='scss' scoped>
        .manage{
            padding-left: 20px;
            padding-right: 20px;
        }
        .colors{
            color:#777;
        }

        .title{
            padding: 20px;
            border-right: solid 1px #e6e6e6;
            border-left: solid 1px #e6e6e6;
            border-bottom: solid 1px #e6e6e6;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
        }
        .title_list{
            margin-top:10px;
            padding: 20px;
            border: solid 1px #e6e6e6;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
        }
        .mm{
            margin-bottom: 20px
        }
        .shop_text span{
            margin-right: 40px
        }   
    </style>
