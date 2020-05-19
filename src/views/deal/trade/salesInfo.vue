<template>
    <section>
        <div class='salesInfo'>


               <div class='div'>
                        <h2>售后基本类型</h2>
                        <p>售后编号：{{after_sale_info.bn}}</p>
                        <p>售后类型：{{after_sale_info.type}}</p>
                        <p>申请时间：{{after_sale_info.created_at}}</p>
                        <p>申请处理进度：{{after_sale_info.status}}</p>
                        <p>申请退款金额：{{after_sale_info.apply_amount}}</p>
               </div>
               <div class='div'>
                        <h2>订单信息</h2>
                        <p>店铺订单：{{user_info.order_shop_no}}</p>
                        <p>订单状态：{{user_info.shop_order_status}}</p>
                        <p>会员用户名：{{user_info.user_name}}</p>
                        <p>下单时间：{{user_info.created_at}}</p>
                        <p>收货信息：<span v-if="receiver!=undefined">{{receiver.name}}{{receiver.address}} {{receiver.mobile}}</span> </p>
                </div>
                <div v-if='supply_info.need_access_to_supply' class='supply_info'>
                    <h2>仓库反馈：</h2>
                    <p>{{ warehouse_text }}</p>
                </div>
                <div>
                        <h2>售后基本信息</h2>
                          <el-table class="table" :data="good_order_info" border align="center">
                            <el-table-column align="center" label="商品">
                                <template slot-scope="scope">
                                <img :src='scope.row.primary_image+"_t.jpg"' style="width:100px;height:100px;">
                                <div style="display:inline-block">
                                <a :href="defaultUrl('item_id',scope.row)" target="_blank" class='goods_url'>
                                  <span style="color:red" v-if="scope.row.label !='normal'">【{{scope.row.label}}】</span>
                                  {{scope.row.title}}
                                </a>
                                <p>{{scope.row.spec_info}}</p>
                                </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="单价（元)" prop="sell_price"></el-table-column>
                            <el-table-column align="center" label="数量" prop="num"></el-table-column>
                            <el-table-column align="center" label="实付款（元）" prop="payment"></el-table-column>
                          </el-table>

                </div>
                <div>
                    <h2>售后申请信息</h2>
                    <p>售后申请理由：{{after_sale_info.reason}}</p>
                    <p>问题描述：{{after_sale_info.user_remark}}</p>
                    <div>图片信息：<div class='imgs'>
                                <img v-for='(img,index) in after_sale_info.images' :src='img+"_t.jpg"' :key="'img'+index" @click='clickViewImg(img)' style="cursor:pointer" />
                                </div>

                                </div>
                </div>

                <!-- 仅退款&&审核 -->
                <el-form v-if='after_sale_info.type =="仅退款" && after_sale_info.status =="等待商家处理" '>
                    <el-row>
                        <el-col :span='10' :offset="1">
                        <el-form-item label="处理结果:">
                            <el-radio-group v-model="form.operate" @change="operate">
                                <el-radio label="agree">接受处理</el-radio>
                                <el-radio label="reject">不同意</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        </el-col>
                        <el-col :span='10' :offset="1" v-if='no'>
                        <el-form-item label="商品赔付及金额调整：">
                            <el-input v-model="form.amount" :disabled='!user_info.is_editable_amount'></el-input>
                            <p class='fz'>最多可退¥{{after_sale_info.goods_amount}}且必须大于0.01</p>
                        </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                    <el-col :span='10' :offset="1">
                    <el-form-item label="处理说明：">
                        <el-input type="textarea" :rows="7" v-model="form.nod_remark" maxlength="100"></el-input>
                    </el-form-item>
                    </el-col>
                    <el-col :span='10' :offset="1" v-if='no'>
                    <el-form-item label="退款备注：">
                        <el-input type="textarea" :rows="7" maxlength="100" v-model="form.remark"></el-input>
                    </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row class="tc">
                        <el-button type="primary" @click="clickSubmit">提交平台审核</el-button>
                        <span v-if='no'>
                            <span style="margin-left:10px" v-if='supply_info.refund_need_cancel_status'>
                                    <el-button :type="btnType" :disabled="btnType === 'info'" @click='notifyWarehouse' v-if='btnChange '>通知仓库</el-button>
                                    <el-button :disabled = 'true' v-if='!btnChange'>已通知仓库</el-button>
                            </span>
                        </span>
                    </el-row>
                </el-form>

                <!-- 退货退款&&审核 -->
                 <el-form v-if='after_sale_info.type =="退货退款" && after_sale_info.status =="等待商家处理" '>
                    <el-row>
                        <el-col :span='10' :offset="1">
                        <el-form-item label="处理结果:">
                            <el-radio-group v-model="formToo.operate" @change="operateToo">
                                <el-radio label="agree">接受处理</el-radio>
                                <el-radio label="reject">不同意</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-if='no'>
                            <el-form-item label="退货仓库：" v-if='supply_info.restore_need_warehouse'>
                             <span style="margin-right:50px">{{ warehouseName }}</span> <el-button @click='warehouse'>选择仓库</el-button>
                            </el-form-item>
                            <el-form-item label="退货地址：">
                                <el-input v-model="address"></el-input>
                            </el-form-item>

                            <el-form-item label="退款联系人：">
                                <el-input v-model="name"></el-input>
                            </el-form-item>

                            <el-form-item label="联系人手机号：">
                                <el-input v-model="mobile"></el-input>
                            </el-form-item>
                        </div>
                        </el-col>
                        <el-col :span='10' :offset="1">
                        <el-form-item label="处理说明：">
                            <el-input type="textarea" :rows="7" v-model="formToo.nod_remark" maxlength="100"></el-input>
                        </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>

                    </el-row>
                    <el-row class="tc">
                        <el-button type="primary" @click="clickSubmitToo">提交平台审核</el-button>
                        <span v-if='no'>
                            <span style="margin-left:10px" v-if='supply_info.refund_need_cancel_status'>
                                <el-button :type="btnType" :disabled="btnType === 'info'" @click='notifyWarehouse' v-if='btnChange'>通知仓库</el-button>
                                <el-button :disabled = 'true' v-if='!btnChange'>已通知仓库</el-button>
                            </span>
                        </span>
                    </el-row>
                </el-form>

                <!-- 审核驳回 -->
                <div v-if='after_sale_info.status =="商家驳回"'>
                    <h4>审核结果</h4>
                    <p>审核状态：审核驳回</p>
                    <p>处理说明：{{after_sale_info.nod_remark}}</p>
                </div>
                <!--审核通过，等待平台退款&&仅退款-->
                <div v-if='after_sale_info.status =="商家同意，等待消费者回寄" && after_sale_info.type =="仅退款"'>
                    <h4>退款处理</h4>
                    <p>退款金额：¥{{after_sale_info.refund_amount}}</p>
                    <p>退款状态：等待平台退款</p>
                    <p>退款备注：{{after_sale_info.remark}}</p>
                </div>

                <!--审核通过，等待买家回寄&&退货退款-->
                <div v-if='after_sale_info.status =="商家同意，等待消费者回寄" && after_sale_info.type =="退货退款"'>
                        <h4>处理结果</h4>
                        <p>审核结果：审核通过</p>
                        <p v-if='supply_info.restore_need_warehouse'>退货仓库：{{delivery.receiver.ware_house_name}}</p>
                        <p>退货地址：{{delivery.receiver.address}}</p>
                        <p>退货联系人：{{delivery.receiver.name}}</p>
                        <p>联系人手机号：{{delivery.receiver.mobile}}</p>
                </div>
                <div v-if='after_sale_info.status =="超时系统关闭"'>
                        <h4>处理结果</h4>
                        <p>审核结果：审核通过</p>
                        <p v-if='supply_info.restore_need_warehouse'>退货仓库：{{delivery.receiver.ware_house_name}}</p>
                        <p>退货地址：{{delivery.receiver.address}}</p>
                        <p>退货联系人：{{delivery.receiver.name}}</p>
                        <p>联系人手机号：{{delivery.receiver.mobile}}</p>
                </div>
              <!--已完成&&仅退款-->
                <div v-if='after_sale_info.status =="平台处理退款，退款完成" && after_sale_info.type =="仅退款"'>

                    <h4>退款处理：</h4>
                    <p>退款金额：¥{{after_sale_info.refund_amount}}</p>
                    <p>退款状态：已完成</p>
                    <p>退款备注：{{after_sale_info.remark}}</p>
                </div>
                 <!--商家同意，等待平台处理&&仅退款-->
                <div v-if='after_sale_info.status =="商家同意，等待平台处理" && after_sale_info.type =="仅退款"'>
                    <p></p>
                    <h4>退款处理：</h4>
                    <p>退款金额：¥{{after_sale_info.refund_amount}}</p>
                    <p>退款状态：等待平台退款</p>
                    <p>退款备注：{{after_sale_info.remark}}</p>
                </div>
            <!--退货退款&&买家已回寄等待确认收货-->
            <el-form v-if='after_sale_info.type =="退货退款" && after_sale_info.status =="消费者回寄，等待商家收货确认" '>
                    <el-row>
                        <el-col :span='10' :offset="1">

                            <h4>处理结果：</h4>
                        </el-col>
                        <el-col :span='10' :offset="1" v-if='no'>
                            <h4>回寄信息：</h4>
                        </el-col>
                    </el-row>
                    <el-row>
                    <el-col :span='10' :offset="1">
                        <p>审核结果：审核通过</p>
                        <p v-if='supply_info.restore_need_warehouse'>退货仓库：{{delivery.receiver.ware_house_name}}</p>
                        <p>退货地址：{{delivery.receiver.address}}</p>
                        <p>退货联系人：{{delivery.receiver.name}}</p>
                        <p>联系人手机号：{{delivery.receiver.mobile}}</p>
                    </el-col>
                    <el-col :span='10' :offset="1" v-if='no'>
                     <p>物流公司：{{delivery.sender.corp_name}}</p>
                     <p>物流单号：{{delivery.sender.delivery_no}}</p>
                    <el-form-item label="商品赔付及金额调整：">
                        <el-input v-model="wait.amount" :disabled='!user_info.is_editable_amount'></el-input>
                         <p class='fz'>最多可退¥{{after_sale_info.goods_amount}}且必须大于0.01</p>
                    </el-form-item>
                    <el-form-item label="退款备注：">
                        <el-input type="textarea" :rows="7" v-model="wait.remark" maxlength="100"></el-input>
                    </el-form-item>
                    </el-col>
                    </el-row>
                    <el-row class="tc">
                        <el-button type="primary" @click="waitClick">提交平台审核</el-button>
                    </el-row>
                </el-form>
                <!--退货退款&&等待平台退款-->
             <el-form v-if='after_sale_info.type =="退货退款" && after_sale_info.status =="商家同意，等待平台处理"'>
                <el-row>
                    <el-col :span='10' :offset="1">
                        <h4>处理结果：</h4>
                    </el-col>
                    <el-col :span='10' :offset="1">
                        <h4>买家回寄：</h4>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='10' :offset="1">
                        <p>审核结果：审核通过</p>
                        <p v-if='supply_info.restore_need_warehouse'>退货仓库：{{delivery.receiver.ware_house_name}}</p>
                        <p>退货地址：{{delivery.receiver.address}}</p>
                        <p>退货联系人：{{delivery.receiver.name}}</p>
                        <p>联系人手机号：{{delivery.receiver.mobile}}</p>
                    </el-col>
                    <el-col :span='10' :offset="1">
                        <p>物流公司：{{delivery.sender.corp_name}}</p>
                        <p>物流单号：{{delivery.sender.delivery_no}}</p>
                        <p>退款金额：¥{{after_sale_info.refund_amount}}</p>
                        <p>退款备注：{{after_sale_info.remark}}</p>
                    </el-col>
                </el-row>
            </el-form>

               <!--退货退款&&平台处理退款，退款完成-->
             <el-form v-if='after_sale_info.type =="退货退款" && after_sale_info.status =="平台处理退款，退款完成"'>
                <el-row>
                    <el-col :span='10' :offset="1">
                        <h4>处理结果：</h4>
                    </el-col>
                    <el-col :span='10' :offset="1">
                        <h4>买家回寄：</h4>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='10' :offset="1">
                        <p>审核结果：审核通过</p>
                        <p v-if='supply_info.restore_need_warehouse'>退货仓库：{{delivery.receiver.ware_house_name}}</p>
                        <p>退货地址：{{delivery.receiver.address}}</p>
                        <p>退货联系人：{{delivery.receiver.name}}</p>
                        <p>联系人手机号：{{delivery.receiver.mobile}}</p>
                    </el-col>
                    <el-col :span='10' :offset="1">
                        <p>物流公司：{{delivery.sender.corp_name}}</p>
                        <p>物流单号：{{delivery.sender.delivery_no}}</p>
                        <p>退款金额：¥{{after_sale_info.refund_amount}}</p>
                        <p>退款备注：{{after_sale_info.remark}}</p>
                    </el-col>
                </el-row>
            </el-form>

        </div>
        <el-dialog
        title="查看大图"
        :visible.sync="viewImg"
        width="40%"
        center>
        <div style="text-align: center;">
            <img :src="bigImg"  width="450"/>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="viewImg = false">关 闭</el-button>
        </span>
        </el-dialog>

        <el-dialog
        title="退货仓库"
        :visible.sync="show"
        width="80%"
        center>
        <div>
        <el-radio-group v-model="radio" @change='changeRadio'>
                <el-radio :label="warehouse.code" :key='warehouse.code' v-for='warehouse in warehouseList'>
                    {{warehouse.warehouseName}}
                    <p style="padding-left:20px;white-space:normal">{{warehouse.allAreaName}} , {{warehouse.warehouseContact}} , {{warehouse.warehouseContactNumber}}</p>
                </el-radio>
            </el-radio-group>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="submitRadio">确 定</el-button>
            <el-button @click="show = false">取 消</el-button>

        </span>
        </el-dialog>

        <el-dialog
        title="仓库提示"
        :visible.sync="misWarehouse"
        width="30%"
        center>
        <div>
            <span v-if ='warehouse_status == "4" || warehouse_status == "6"'>仓库截单中，请确认是否提交退款审核？</span>
            <span v-else-if ='warehouse_status == "5"'>仓库截单失败，请确认是否提交退款审核？</span>
            <span v-else>未通知仓库，是否确认提交</span>

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="submitWarehouse">确 定</el-button>
            <el-button @click="misWarehouse = false">取 消</el-button>

        </span>
        </el-dialog>


        <el-dialog
        title="仓库提示"
        :visible.sync="maxWarehouse"
        width="30%"
        center>
        <div>
            <span>仓库尚未收货，请确认是否提交退款审核？</span>

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="XsubmitWarehouse">确 定</el-button>
            <el-button @click="maxWarehouse = false">取 消</el-button>

        </span>
        </el-dialog>
    </section>
</template>

<script>
import TableView from '@/components/TableView'
import { urlParse } from '@/utils/urlParse'
import sales from '@/api/deal/sales'
import VHeader from '@/components/Header'
export default {
        data(){
            return{
                misWarehouse:false,
                maxWarehouse:false,
                radio:'',
                warehouseName:'',
                btnChange:'',
                btnType: 'primary',
                code:"",
                warehouseList:[],
                show:false,
                no:true,
                viewImg:false,
                bigImg:'',
                after_sale_info:'',
                good_order_info:[],
                delivery:'',
                user_info:'',
                name:'',
                mobile:'',
                address:'',
                receiver:'',
                supply_info:'',
                warehouse_text:'',
                warehouse_status:'',
                form:{
                    operate:'agree',
                    bn:'',
                    remark:'',
                    amount:'',
                    nod_remark:''
                },
                formToo:{
                    operate:'agree',
                    bn:'',
                    nod_remark:'',
                    address:{
                        name:'',
                        mobile:'',
                        address:''
                    },
                    warehouse:{
                        ware_house_code:'',
                        ware_house_name:'',
                    }
                },
                wait:{
                    bn:'',
                    amount:'',
                    remark:''
                },
                columns: [
                    {
                        label: '商品',
                        desFields: '1',
                    },
                     {
                        label: '单价（元）',
                        field: 'sell_price',
                        align: 'center',
                    },
                    {
                        label: '数量',
                        field: 'num',
                        align: 'center',
                    },
                    {
                        label: '实付款（元）',
                        field: 'payment',
                        align: 'center',
                    },
                ]
            }
        },
        methods:{
            //warehouseFeedBack
            warehouseFeedBack(){
                sales.warehouseFeedBack(urlParse()).then((res) =>{
                    this.warehouse_status = res.data.status_code
                    this.warehouse_text = res.data.warehouse_feedback
                })
            },
            //notifyWarehouse
            notifyWarehouse(){
              if(this.btnType === 'primary') {
                this.btnType = 'info'
                sales.notifyWarehouse(urlParse()).then((res) =>{
                  this.btnChange =false
                  this.btnType = 'primary'
                  location.reload()
                }).catch((err) => {
                  this.btnType = 'primary'
                })
              }
            },
            //submit
            submitRadio(){
                if(!this.code){
                    this.$message({message:'请选择仓库',type:'error'})
                }else{
                    for(var i in this.warehouseList){
                        if(this.code == this.warehouseList[i].code){
                            this.address = this.warehouseList[i].allAreaName
                            this.name = this.warehouseList[i].warehouseContact
                            this.mobile = this.warehouseList[i].warehouseContactNumber
                            this.formToo.warehouse.ware_house_code = this.warehouseList[i].code
                            this.formToo.warehouse.ware_house_name = this.warehouseList[i].warehouseName
                            this.warehouseName = this.warehouseList[i].warehouseName
                        }
                    }

                    this.show = false
                }
            },
            //lister
            changeRadio(){
                this.code = this.radio;
            },
            getSalesIntoList(data){
                sales.getSalesIntoList(data).then((res)=>{
                    this.form.bn =res.data.after_sale_info.bn
                    if(!res.data.order_info.is_editable_amount){
                        this.form.amount = res.data.after_sale_info.goods_amount
                        this.wait.amount = res.data.after_sale_info.goods_amount
                    }
                    this.good_order_info =[]
                    this.formToo.bn =res.data.after_sale_info.bn
                    this.wait.bn =res.data.after_sale_info.bn
                    this.user_info =res.data.order_info
                    this.receiver =res.data.order_info.receiver
                    this.supply_info =res.data.supply_info
                    if(this.supply_info.need_access_to_supply){
                        this.warehouseFeedBack()
                    }
                    if(this.supply_info.refund_need_cancel_status){
                        sales.checkNotify(urlParse()).then((res) =>{
                            this.btnChange = !res.data.is_notify
                        })
                    }
                    let state =res.data.after_sale_info.status
                    this.delivery =res.data.after_sale_info.delivery
                    switch(state){
                        case 10:res.data.after_sale_info.status='等待商家处理';
                        break;

                        case 20:res.data.after_sale_info.status='商家同意，等待平台处理';
                        break;

                        case 30:res.data.after_sale_info.status='平台处理退款，退款完成';
                        break;

                        case 40:res.data.after_sale_info.status='商家同意，等待消费者回寄';
                        break;

                        case 50:res.data.after_sale_info.status='消费者回寄，等待商家收货确认';
                        break;

                        case 60:res.data.after_sale_info.status='商家驳回';
                        break;

                        case 70:res.data.after_sale_info.status='用户撤销';
                        break;

                        case 80:res.data.after_sale_info.status='超时系统关闭';
                        break;
                    };
                     let type =res.data.after_sale_info.type
                     switch(type){
                         case 10 :res.data.after_sale_info.type ='仅退款';
                         break;
                         case 20 :res.data.after_sale_info.type ='退货退款';
                         break;
                     }
                     let order_status =res.data.order_info.shop_order_status
                     switch(order_status){
                         case 10 :res.data.order_info.shop_order_status ='待支付';
                         break;
                         case 20 :res.data.order_info.shop_order_status ='支付完成';
                         break;
                         case 25 :res.data.order_info.shop_order_status ='订单待发货';
                         break;
                         case 30 :res.data.order_info.shop_order_status ='支付前取消';
                         break;
                         case 31 :res.data.order_info.shop_order_status ='支付后取消';
                         break;
                         case 40 :res.data.order_info.shop_order_status ='待收货';
                         break;
                         case 50 :res.data.order_info.shop_order_status ='待评论';
                         break;
                         case 60 :res.data.order_info.shop_order_status ='订单完成';
                         break;
                     }
                     this.after_sale_info=res.data.after_sale_info
                    var _this =this
                    for(var i in res.data.good_order_info){

                            let label =res.data.good_order_info[i].label
                            if(label != 'normal'){
                            switch(label){
                                case 'gifts' : res.data.good_order_info[i].label ='赠品'
                                break;
                                case 'exchanges' : res.data.good_order_info[i].label ='换购'
                                break;
                            }
                            }

                        _this.good_order_info.push(res.data.good_order_info[i])
                    }
                })
                .catch(function(error){
                    console.log(error)
                })
            },
            //提交
            submitWarehouse(){
                this.getVerify(this.form)
                this.misWarehouse = false
            },
            //提交01
            XsubmitWarehouse(){
                this.getCheckRestore(this.wait)
                this.maxWarehouse = false
            },
            //判断是否通知仓库
            checkNotify(){
                if(this.supply_info.refund_need_cancel_status){
                    sales.checkNotify(urlParse()).then((res) =>{
                    if(!res.data.is_notify && this.form.operate=='agree'){
                        this.misWarehouse = true
                    }else{
                        if(this.form.operate =='agree'){
                            if(this.warehouse_status == '4' || this.warehouse_status =='5' || this.warehouse_status =='6'){
                                this.misWarehouse = true
                            }else{
                                this.getVerify(this.form)
                            }
                        }else{
                            this.getVerify(this.form)
                        }
                    }
                })
                }else{
                    this.getVerify(this.form)
                }

            },
            //选择仓库
            warehouse(){
                this.show = true
                sales.supplyWarehouseList().then((res) =>{
                    this.warehouseList=[]
                    let data =res.data.data
                    for(let i in data){
                        this.warehouseList.push(data[i])
                    }
                })
            },

            operate(){
                if(this.form.operate=='reject'){

                    this.no=false
                }else{
                    this.no=true
                }
            },
            operateToo(){
                if(this.formToo.operate=='reject'){
                    this.no=false
                }else{
                    this.no=true
                }
            },
            clickViewImg(img){
                this.viewImg =true;
                this.bigImg =img;
            },
            getVerify(data){
                sales.getVerify(data).then((res) =>{
                   this.$message({message:'审核成功',type:'success'})
                    this.getSalesIntoList(urlParse())
                })

            },
            getCheckRestore(data){
                sales.getCheckRestore(data).then((res) =>{
                    this.$message({message:'审核成功',type:'success'})
                     this.getSalesIntoList(urlParse())
                })

            },
            clickSubmit(){
                this.checkNotify()

            },
            clickSubmitToo(){

                this.formToo.address.mobile=this.mobile
                this.formToo.address.address=this.address
                this.formToo.address.name=this.name
                if(this.formToo.operate !='agree'){
                        this.getVerify(this.formToo)
                    }else{
                        if(this.supply_info.restore_need_warehouse){
                        if(this.formToo.warehouse.ware_house_code =='' || this.formToo.warehouse.ware_house_name ==''){
                            this.$message({
                                            message:'请选择仓库',
                                            type:'error'
                                        })
                        }else{
                            this.getVerify(this.formToo)
                        }
                        }else{
                            this.getVerify(this.formToo)
                        }
                    }



                // if(this.supply_info.refund_need_cancel_status){
                //     if(!this.btnChange){
                //         this.getVerify(this.formToo)
                //     }else{
                //         this.$message({
                //             message:'请先通知仓库',
                //             type:'error'
                //         })
                //     }
                // }else{
                //
                // }


            },
            waitClick(){
                if(this.warehouse_status=='0' || this.warehouse_status=='1' || this.warehouse_status=='6'){
                               this.maxWarehouse = true
                           } else{
                                this.getCheckRestore(this.wait)
                           }
            }
        },
        components:{
            TableView,
            VHeader,
        },
        created() {
            this.getSalesIntoList(urlParse())


        }
}
</script>
<style lang='scss' scoped>
.salesInfo{
    padding: 10px
}
.div{
    width: 47%;
    display: inline-block
}
.tc{
    text-align: center
}
.fz{
    font-size: 14px;
    color:red
}
.imgs img{
    width: 50px;
    height: 50px;
    display: inline-block;
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
.supply_info{
    height: 200px;
    border-top:2px #ebeef5 solid;
    border-bottom:2px #ebeef5 solid;
}
.supply_info p{
    text-indent: 2;
    font-size: 14px;
}
</style>

