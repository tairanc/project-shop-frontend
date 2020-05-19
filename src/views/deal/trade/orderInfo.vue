<template>
    <div>
        <div style="padding:10px">
            <div class="title">
                <h2 >{{list.status}}</h2>
                <el-button type='primary' v-if ='status' @click="goFH" style="margin-bottom:20px">我要发货</el-button>
            </div>
            <div>
                 <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                    <el-tab-pane label="订单信息" name="first">
                        <div style="overflow: hidden">
                        <div style="width:30%;float:left">
                            <ul>
                                <li><h3>支付及金额信息</h3></li>
                                <li>商品金额：¥{{list.total_fee}}</li>
                                <li>促销优惠：¥ - {{discount_summary.promotion}}</li>
                                <li v-if="discount_summary.vip>0">会员折扣：¥ - {{discount_summary.vip}}</li>
                                <li>运费：¥ {{list.post_fee}}</li>
                                <li>税费：¥ {{list.tax_fee}}</li>
                                <li>优惠劵抵扣¥ - {{discount_summary.coupon}}</li>
                                <li>红包抵扣：¥ - {{discount_summary.hb}}</li>
                                <li><h3>订单总价：</h3><h3>¥{{list.payment}}</h3></li>
                            </ul>
                        </div>
                        <div style="width:35%;float:left">
                            <ul>
                                <li><h3>支付及配送信息</h3></li>
                                <li>支付方式：{{pay_type ==10 ? '线上支付':'线下支付'}}</li>
                                <li>配送方式：{{shipping_type ==10 ? '快递' : '自提'}}</li>
                            </ul>
                        </div>
                        <div style="width:35%;float:left">
                            <ul>
                                <li><h3>订单信息</h3></li>
                                <li>店铺订单号：{{list.no}}</li>
                                <li>平台订单号：{{list.order_no}}</li>
                                <li>下单时间：{{list.created_at}}</li>
                                <li>付款时间：{{list.payed_at}}</li>
                                <li>发货时间：{{list.consigned_at}}</li>
                            </ul>
                        </div>
                        </div>
                         <div style="width:100%;">
                            <ul v-if="!invoice.type">
                                <li><h3>发票信息</h3></li>
                                <li>发票类型：无</li>
                                <li>发票抬头：无</li>
                                <li>发票内容：无</li>
                            </ul>
                            <div v-if="invoice.type=='普通发票' || invoice.type=='电子发票'">
                                <h3>发票信息</h3>
                                <div style="width:49%;float:left;margin-right:2%;fontSize:14px">
                                    <p>是否需要发票：是</p>
                                    <p>发票类型：{{invoice.type}}</p>
                                    <p>发票抬头：{{invoice.title}}</p>
                                    <p>发票内容：明细</p>
                                    <p v-if="invoice_info.action == 2 && invoice_info.taxpayer_idNumber !=''">纳税人识别码：{{invoice_info.taxpayer_idNumber}}</p>
                                    <p v-if="invoice_info.action == 2 && invoice_info.reg_address !=''">注册地址：{{invoice_info.reg_address}}</p>
                                    <p>发票金额：¥{{list.invoice_amount}}</p>
                                    <p v-if="invoice.type=='电子发票'">收票人邮箱：{{invoice_info.receiver_email}}</p>
                                </div>
                                <div style="width:49%;float:left;fontSize:14px" v-if="invoice_info.action == 2 ">
                                    <p v-if="invoice_info.reg_tel!='' || invoice_info.reg_tel!=null">注册电话：{{invoice_info.reg_tel}}</p>
                                    <p v-if="invoice_info.open_bank!='' || invoice_info.open_bank!=null">开户银行：{{invoice_info.open_bank}}</p>
                                    <p v-if="invoice_info.bank_account!='' || invoice_info.bank_account!=null">银行账户：{{invoice_info.bank_account}}</p>
                                    <!-- <p v-if="invoice_info.receiver_name!='' || invoice_info.receiver_name!=null">收票人姓名：{{invoice_info.receiver_name}}</p>
                                    <p v-if="invoice_info.receiver_tel!='' || invoice_info.receiver_tel!=null">收票人手机：{{invoice_info.receiver_tel}}</p>
                                    <p v-if="invoice_info.receiver_address!='' || invoice_info.receiver_address!=null">收票人地址：{{invoice_info.receiver_address}}</p> -->
                                </div>
                            </div>

                            <div v-if="invoice.type=='增值税发票'">
                                <h3>发票信息</h3>
                                <div style="width:49%;float:left;margin-right:2%;fontSize:14px">
                                    <p>是否需要发票：是</p>
                                    <p>发票类型：{{invoice.type}}</p>
                                    <p>发票抬头：{{invoice.title}}</p>
                                    <p>发票内容：明细</p>
                                    <p>纳税人识别码：{{invoice_info.taxpayer_idNumber}}</p>
                                    <p>注册地址：{{invoice_info.reg_address}}</p>
                                    <p>发票金额：¥{{list.invoice_amount}}</p>
                                </div>
                                <div style="width:49%;float:left;fontSize:14px">
                                    <p>注册电话：{{invoice_info.reg_tel}}</p>
                                    <p>开户银行：{{invoice_info.open_bank}}</p>
                                    <p>银行账户：{{invoice_info.bank_account}}</p>
                                    <p>收票人姓名：{{invoice_info.receiver_name}}</p>
                                    <p>收票人手机：{{invoice_info.receiver_tel}}</p>
                                    <p>收票人地址：{{invoice_info.receiver_region + invoice_info.receiver_address}}</p>
                                    <!-- <p>收票人地址：{{receiverRegion + invoice_info.receiver_address}}</p> -->
                                </div>
                            </div>
                        </div>
                        <p></p>
                        <table width='100%' style="border-collapse:collapse">
                            <tr class="list_title">
                                <td>商品</td>
                                <td>原价</td>
                                <td>单价</td>
                                <td>数量</td>
                                <td>售后</td>
                                <td v-if="channel !== 'pet'">活动e卡</td>
                                <td v-if="channel !== 'pet'">充值e卡</td>
                                <td v-if="channel === 'pet'">宠币</td>
                                <td>网关</td>
                            </tr>
                            <tr v-for='(good,index) in goods_list' :key="index" class='tc'>
                                <td>
                                    <div style="float:left;"><img :src='good.primary_image+"_t.jpg"' class='img'/></div>
                                    <div style="float:left;">
                                       <a :href="defaultUrl('item_id',good)" class='goods_url' target="_blank">
                                       <p>
                                        <span style="color:red" v-if="good.promotions">【<span v-for="(promotions,index) in good.promotions" :key='index'>
                                            {{promotions.promotion_type}}
                                        </span>】
                                        </span>
                                           {{good.title}}</p></a>
                                        <p>{{good.spec_nature_info}}</p>
                                    </div>
                                </td>
                                <td>
                                    {{good.sell_price}}
                                </td>
                                <td>
                                    {{good.price}}
                                </td>
                                <td>
                                    {{good.num}}
                                </td>
                                <td>
                                    <!-- {{good.after_sale.status ? good.after_sale.status :'无'}} -->
                                    <span v-if='good.after_sale'>{{good.after_sale.status}} </span>
                                    <span v-else>无</span>
                                </td>
                                <!-- <td v-for='(payment,index) in good.payments' :key="index">{{payment.amount}}</td> -->
                                <td v-if="good.payments && channel !== 'pet'">
                                    {{good.payments.EcardActivity.amount}}
                                </td>
                                 <td v-if="good.payments && channel !== 'pet'">
                                    {{good.payments.EcardRecharge.amount}}
                                </td>
                                <td v-if="good.payments && channel === 'pet'">
                                  {{good.payments.Ucard.amount}}
                                </td>
                                 <td v-if="good.payments">
                                    {{good.payments.gate.amount}}<span v-if='good.payments.gate.amount !=0 '>({{good.payments.gate.type}})</span>
                                </td>
                            </tr>
                        </table>
                    </el-tab-pane>
                    <el-tab-pane label="收货和物流信息" name="second" v-if='logistics && delivery_type==10'>
                        <div>
                            <ul>
                                <li><h3>收货人信息</h3></li>
                                <li>收货人地址：{{address.name}},
                                              {{address.mobile}},
                                              {{address.state}}
                                              {{address.city}}
                                              {{address.district}}
                                              {{address.address}}
                                              {{address.state_code}}
                                </li>
                                <li v-if="receiver.idCard">身份证号：{{receiver.idCard.id_number}}</li>
                                <li v-if='delivery_info.packed!=""'><h3>物流信息</h3></li>
                            </ul>
                            <el-tabs type="card">
                                <el-tab-pane :label="'包裹'+(index+1)*1" v-for='(packed,index) in delivery_info.packed' :key='index'>
                                    <div style="display: inline-block;">
                                        <h4>国内物流</h4>
                                        <p>物流公司：{{packed.deliveries.domestic.corp_name}}</p>
                                        <p>运单号：{{packed.deliveries.domestic.express_no}}</p>
                                        <a @click='infoClcik(packed.deliveries.domestic.corp_code,packed.deliveries.domestic.express_no)' style="fontSize:14px;color:#409EFF">查看物流信息</a>
                                        <div>
                                            {{packed.deliveries.domestic.trace_list}}
                                            <p v-for='(trace_list, indexs) in packed.deliveries.domestic.trace_list' :key="indexs"><span style="margin-right:50px">{{trace_list.time}}</span>{{trace_list.context}}</p>
                                        </div>
                                    </div>
                                    <div v-if="packed.deliveries.overseas" style="display: inline-block;">
                                        <h4>国际物流</h4>
                                        <p>物流公司：{{packed.deliveries.overseas.corp_name}}</p>
                                        <p>运单号：{{packed.deliveries.overseas.express_no}}</p>
                                        <a @click='infoClcik(packed.deliveries.overseas.corp_code,packed.deliveries.overseas.express_no)' style="fontSize:14px;color:#409EFF">查看物流信息</a>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <el-dialog
        title="物流信息"
        :visible.sync="centerDialogVisible"
        width="50%"
        center>
        <p v-for='(trace_list, indexs) in trace_list' :key="indexs"><span style="margin-right:50px">{{trace_list.time}}</span>{{trace_list.context}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>

    </div>
</template>
<script>
import VHeader from '@/components/Header'
import order from '@/api/deal/order'
import { urlParse } from '@/utils/urlParse'
    export default {
        data(){
            return{
                channel:'',
                phone:'',
                delivery_type:10,
                status:false,
                centerDialogVisible:false,
                activeName2:'first',
                list:'',
                delivery_info:'',
                imageDomain:'',
                logistics:true,
                receiver:'',
                discount_summary:'',
                order:'',
                pay_type:'',
                shipping_type:'',
                invoice:'',
                address:'',
                invoice_info:'',
                goods_list :[],
                trace_list:[]
            }
        },
        computed: {
            // 处理 增值税发票地址数据
            // receiverRegion: function () {
            //    let _receiverRegion = this.invoice_info.receiver_region ? JSON.parse(this.invoice_info.receiver_region) : ''
            //    let _returnReceiveRegin = ''
            //    if (_receiverRegion != '') {
            //        let _provinceText = _receiverRegion.province && _receiverRegion.province.text ? _receiverRegion.province.text  + '  ' : ''
            //        let _cityText = _receiverRegion.city && _receiverRegion.city.text ? _receiverRegion.city.text  + '  ' : ''
            //        let _districtText = _receiverRegion.district && _receiverRegion.district.text ? _receiverRegion.district.text  + '  ' : ''
            //        _returnReceiveRegin = _provinceText +  _cityText + _districtText
            //    }
            //    return _returnReceiveRegin
            // }
        },
        methods:{
            infoClcik(code,no){
                this.centerDialogVisible =true
                order.delivery_trace({code:code,express_no:no,phone:this.phone}).then((res) =>   {
                        this.trace_list = []
                        for(var i in res.data){
                            this.trace_list.push(res.data[i])
                        }

                })
            },
            getOrdeInfo(data){
                order.getOrderInfo(data).then((res) =>{
                    this.list=null
                    this.list =res.data
                    this.goods_list =[]
                    this.receiver =res.data.order.receiver
                    this.address =res.data.order.receiver.address
                    var status =this.list.status
                    this.discount_summary =res.data.discount_summary
                    this.channel = res.data.channel
                    this.order = res.data.order
                    this.pay_type =res.data.order.pay_type
                    this.shipping_type =res.data.order.shipping_type
                    this.delivery_type = res.data.delivery_type || 10
                    var invoice_tpye =res.data.order.invoice.type
                    res.data.order_goods.forEach((goods, index) => {
                      var promotionsCC =[]
                      for(let j in goods.promotions){
                        let promotions=goods.promotions[j]
                        if(promotions.promotion_role=='main_good' || promotions.promotion_role==null){
                          switch(promotions.promotion_type){
                            case 'FullMinus' : promotions.promotion_type='满减'
                              break;
                            case 'FullDiscount' : promotions.promotion_type='满折'
                              break;
                            case 'FlashSale' : promotions.promotion_type='特卖'
                              break;
                            case 'SpeiaFlashSale' : promotions.promotion_type='专场特卖'
                              break;
                            case 'DirectReduction' : promotions.promotion_type='直降'
                              break;
                            case 'GroupBuy' : promotions.promotion_type='拼团'
                              break;
                            case 'SecKill' : promotions.promotion_type='秒杀'
                              break;
                            case 'OptionBuy' : promotions.promotion_type='N元任选'
                              break;
                            case 'ExchangeBuy' : promotions.promotion_type='加价换购'
                              break;
                            case 'GiftBuy' : promotions.promotion_type='买赠'
                              break;
                          }
                        }else{
                          switch(promotions.promotion_type){
                            case 'ExchangeBuy' : promotions.promotion_type='换购'
                              break;
                            case 'GiftBuy' : promotions.promotion_type='赠品'
                              break;
                          }
                        }

                      }
                      if(goods.payments){
                        if(goods.payments['Trcloan']){
                          goods.payments.gate.type ='口袋钱包'
                        }else if(goods.payments['Alipay']){
                          goods.payments.gate.type ='支付宝'
                        }else if(goods.payments['Weixin']){
                          goods.payments.gate.type ='微信'
                        }else if(goods.payments['Offline']){
                          goods.payments.gate.type ='线下支付'
                        }
                      }
                      if(goods.after_sale){
                        let status = goods.after_sale.status
                        switch(status){
                          case 10 : goods.after_sale.status='等待商家处理';
                            break;

                          case 20: goods.after_sale.status='商家同意，等待平台处理';
                            break;

                          case 30: goods.after_sale.status='平台处理退款，退款完成';
                            break;

                          case 40: goods.after_sale.status='商家同意，等待消费者回寄';
                            break;

                          case 50: goods.after_sale.status='消费者回寄，等待商家收货确认';
                            break;

                          case 60: goods.after_sale.status='商家驳回';
                            break;

                          case 70: goods.after_sale.status='用户撤销';
                            break;

                          case 80: goods.after_sale.status='超时系统关闭';
                            break;
                        };
                      }
                      this.goods_list.push(goods)
                    })
                    switch(invoice_tpye){
                        case 1 :res.data.order.invoice.type='普通发票';
                        break;
                        case 2 :res.data.order.invoice.type='增值税发票';
                        break;
                        case 3 :res.data.order.invoice.type='电子发票';
                        break;
                    }
                    this.invoice=res.data.order.invoice
                    this.invoice_info =res.data.order.invoice.info
                    if(status ==25){
                        this.status=true
                    }
                    switch(status){
                        case 10 :this.list.status='等待买家付款';
                        this.logistics=false
                        break;
                        case 20 :this.list.status='买家已付款';
                        this.logistics=false
                        break;
                        case 30 :this.list.status='交易关闭';
                        break;
                        case 31 :this.list.status='交易关闭';
                        break;
                        case 40 :this.list.status='等待买家收货';
                        break;
                        case 50 :this.list.status='等待买家评论';
                        break;
                        case 60 :this.list.status='交易完成';
                        break;
                        case 25 :this.list.status='等待发货';
                        this.logistics=false
                        break;

                    };
                    var invoice_type =this.list.order.invoice.type
                    this.shipping_type !=10 ? this.logistics=false : this.logistics=true
                    switch(invoice_type){
                        case '1' :this.list.order.invoice.type='普通发票';
                        break;
                        case '2' :this.list.order.invoice.type='增值税发票';
                        break;
                        case '3' :this.list.order.invoice.type='电子发票';
                        break;
                    }
                })
            },

            deliveryInfo(data){
                order.deliveryInfo(data).then((res) =>{
                    this.delivery_info =res.data;
                    this.phone = res.data.receiver.phone
                })
            },
            goFH(){
                var url =urlParse().shop_order_no;

                this.$router.push('/goods-deal/trade/shipments?shop_order_no='+url)
            },
            handleClick(tab, event) {
                this.delivery_info=''
                var name =tab.name
                if(name =="second"){
                    this.deliveryInfo(urlParse())
                }
            },
        },
        components:{
                   VHeader
                },


        created:function(){
            this.getOrdeInfo(urlParse())
        }
    }

</script>
<style>
.list_title td{
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
