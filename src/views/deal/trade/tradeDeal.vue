<template>
<div class="manage">
  <el-tabs type="border-card">
    <el-form :model="formOnSearch.form" :rules="rules" ref="formOnSearch" label-width="100px" size="medium">
  <el-row>
    <el-col :span="6" :offset="1">
      <el-form-item prop="item_name" label="商品名称：">
        <el-input v-model="formOnSearch.form.item_name"></el-input>
      </el-form-item>
    </el-col>
    <el-col :span="6" :offset="1">
      <div class="block">
        <el-form-item label="下单时间：" prop="order_start_time">
          <el-date-picker v-model="formOnSearch.form.order_start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择起始时间"></el-date-picker>
        </el-form-item>
      </div>
    </el-col>
    <el-col :span="6" :offset="1">
      <div class="block">
        <el-form-item label="-" style="width:0;margin-left: -100px;" prop="order_end_time">
          <el-date-picker v-model="formOnSearch.form.order_end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择结束时间"></el-date-picker>
        </el-form-item>
      </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5" :offset="1">
          <el-form-item prop="shop_order_no" label="店铺订单号：">
            <el-input v-model="formOnSearch.form.shop_order_no"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6" :offset="1">
          <el-form-item prop="ptorderNun" label="平台订单号：">
            <el-input v-model="formOnSearch.form.ptorderNun"></el-input>
            </el-form-item>
         </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item  label="订单类型：" prop="trade_type">
              <el-select v-model="formOnSearch.form.trade_type" placeholder='全部类型'>
                <el-option
                    v-for="item in trade_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="5" :offset="1"><el-form-item  label="订单状态：" prop="order_status">
              <el-select v-model="formOnSearch.form.order_status" placeholder="全部状态" @change='statusChange'>
                <el-option
                  v-for="item in state_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value" >
                </el-option>
              </el-select></el-form-item>
        </el-col>
        <el-col :span="5" :offset="1"><el-form-item  label="是否需要发票:" prop="is_need_invoice">
                  <el-select v-model="formOnSearch.form.is_need_invoice" placeholder="全部">
                    <el-option
                      v-for="item in invoice_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      ></el-option>
                  </el-select>
                </el-form-item>
                </el-col>
        </el-row>

  <el-row>
         <el-col :span="6" :offset="1">
                  <el-form-item prop="user_name" label="会员用户名：">
                    <el-input v-model="formOnSearch.form.user_name" placeholder="会员注册手机号"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5" :offset="1">
                    <el-form-item prop="main_order_no" label="平台订单号：">
                      <el-input v-model="formOnSearch.form.main_order_no"></el-input>
                    </el-form-item>
              </el-col>
              <el-col :span="5" :offset="1">
                <el-form-item prop="receiver_name" label="收货人姓名：">
                  <el-input v-model="formOnSearch.form.receiver_name"></el-input>
                </el-form-item>
          </el-col>
    <!-- <el-col :span="6" :offset="1"><el-form-item  label="拼团状态：" prop="spell_state_val">
                <el-select v-model="formOnSearch.form.spell_state_val" placeholder="全部状态">
                  <el-option
                    v-for="item in spell_state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    ></el-option>
                </el-select>
                </el-form-item>
                </el-col> -->
    </el-row>

    <el-row style="text-align:center">
      <el-button type="primary" icon="el-icon-search" @click="submitForm()">搜索</el-button>
      <el-button @click="exportExcel">导出订单</el-button>
      <el-button @click="resetForm">清空条件</el-button>
      <el-button @click="batchShipment">批量发货</el-button>
    </el-row>
    </el-form>
  </el-tabs>
<!--
  <table-view
    :pageList="exportList"
    v-show="false"
    id='rebateSetTable'
    :columns="columns"
  ></table-view>           -->
  <table v-show="false" id='rebateSetTable'>
    <tr>
      <td>订单创建时间</td>
      <td>订单支付时间</td>
      <td>平台订单号</td>
      <td>店铺订单号</td>
      <td>商品订单号</td>
      <td>仓库名称</td>
      <td>订单状态</td>
      <td>售后状态</td>
      <td>收货人姓名</td>
      <td>收货人手机号</td>
      <td>收货人省份</td>
      <td>收货人城市</td>
      <td>收货人地区</td>
      <td>收货人详细地址</td>
      <td>收货人身份证号码</td>
      <td>收货人身份证正面</td>
      <td>收货人身份证反面</td>
      <td>一级类目</td>
      <td>二级类目</td>
      <td>三级类目</td>
      <td>商品名称</td>
      <td>商品贸易类型</td>
      <td>销售属性</td>
      <td>条形码</td>
      <td>商品货号</td>
      <td>供应商</td>
      <td>购买数量</td>
      <td>赠品</td>
      <td>商品售价</td>
      <td>邮费</td>
      <td>优惠</td>
      <td>实际支付</td>
      <td>是否开发票</td>
      <td>发票类型</td>
      <td>发票抬头</td>
      <td>发票内容</td>
      <td>纳税人识别码</td>
      <td>注册地址</td>
      <td>注册电话</td>
      <td>开户银行</td>
      <td>银行账户</td>
      <td>收票人姓名</td>
      <td>收票人邮箱</td>
      <td>收票人地址</td>
      <td>推单</td>
      <td>备注信息</td>
      <tr v-for='(order,index) in exportList' :key ='index'>
          <td class='ex'>{{'"'+order.created_at}}</td>
          <td style="mso-number-format:'\@';"><span v-if='order.payed_at'>{{'"'+order.payed_at}}</span></td>
          <td style="mso-number-format:'\@';">{{'"'+order.platform_no}}</td>
          <td style="mso-number-format:'\@';">{{'"'+order.shop_no}}</td>
          <td style="mso-number-format:'\@';">{{'"'+order.goods_no}}</td>
          <td style="mso-number-format:'\@';">{{order.repo_name}}</td>
          <td style="mso-number-format:'\@';">{{order.status}}</td>
          <td style="mso-number-format:'\@';">{{order.after_sale_status}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_name}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_mobile}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_province}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_city}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_prefecture}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_address}}</td>
          <td style="mso-number-format:'\@';"><span v-if='order.receiver_idcard'>{{'"'+order.receiver_idcard}}</span></td>
          <td style="mso-number-format:'\@';">{{order.receiver_idcard_front}}</td>
          <td style="mso-number-format:'\@';">{{order.receiver_idcard_back}}</td>
          <td style="mso-number-format:'\@';">{{order.cat_primary_name}}</td>
          <td style="mso-number-format:'\@';">{{order.cat_secondary_name}}</td>
          <td style="mso-number-format:'\@';">{{order.cat_name}}</td>
          <td style="mso-number-format:'\@';">{{order.title}}</td>
          <td style="mso-number-format:'\@';">{{order.trade_type}}</td>
          <td style="mso-number-format:'\@';">{{order.spec_nature_info}}</td>
          <td style="mso-number-format:'\@';"><span v-if='order.barcode'>{{'"'+order.barcode}}</span></td>
          <td style="mso-number-format:'\@';"><span v-if='order.art_no'>{{'"'+order.art_no}}</span></td>
          <td style="mso-number-format:'\@';">{{order.supplier_name}}</td>
          <td style="mso-number-format:'\@';">{{order.num}}</td>
          <td style="mso-number-format:'\@';">{{order.gifts}}</td>
          <td style="mso-number-format:'\@';">{{order.sell_price}}</td>
          <td style="mso-number-format:'\@';">{{order.freight}}</td>
          <td style="mso-number-format:'\@';">{{order.discount}}</td>
          <td style="mso-number-format:'\@';">{{order.payment}}</td>
          <td style="mso-number-format:'\@';">{{order.is_need_invoice}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_type}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_title}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_content}}</td>
          <td style="mso-number-format:'\@';"><span v-if='order.invoice_id_number'>{{'"'+order.invoice_id_number}}</span></td>
          <td style="mso-number-format:'\@';">{{order.invoice_reg_address}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_reg_tel}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_open_bank}}</td>
          <td style="mso-number-format:'\@';"><span v-if='order.invoice_bank_account'>{{'"'+order.invoice_bank_account}}</span></td>
          <td style="mso-number-format:'\@';">{{order.invoice_receiver_name}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_receiver_email}}</td>
          <td style="mso-number-format:'\@';">{{order.invoice_receiver_address}}</td>
          <td style="mso-number-format:'\@';">{{order.push_status}}</td>
          <td style="mso-number-format:'\@';">{{order.buyer_message}}</td>
      </tr>
  </table>
  <el-tabs type="border-card" style="margin-top:40px" v-model="activeName" @tab-click="talClick" >
    <el-tab-pane  name ='all'>
        <span slot="label">全部订单</span>
          <div>
            <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
          </div>
    </el-tab-pane>
      <el-tab-pane label="等待买家付款" name ='10'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="买家已付款" name ='20'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="等待发货" name ='25'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="部分发货" name ='consign_status'>
          <order-view
              :pageList="list"
              :showChain ="show_chain"
              ></order-view>
               <pagination-view
                v-show="list.length"
                :paginationName="formOnSearch.name"
                :total="formOnSearch.total"
                :currentPage="formOnSearch.form.page"
                @size-change="handleSizeChange"
                @current-change="handleNumberChange"
              ></pagination-view>
        </el-tab-pane>
      <el-tab-pane label="等待买家收货" name ='40'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="等待买家评论" name ='50'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="交易完成" name ='60'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
      <el-tab-pane label="交易关闭" name ='30,31'>
        <order-view
            :pageList="list"
            :showChain ="show_chain"
            ></order-view>
             <pagination-view
              v-show="list.length"
              :paginationName="formOnSearch.name"
              :total="formOnSearch.total"
              :currentPage="formOnSearch.form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
      </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import OrderView from '@/components/OrderView'
import order from '@/api/deal/order'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
const REG_NUMBER = /^\d+(\.{0,1}\d+){0,1}$/
export default {
  data() {
     var validateMinPrice = (rule, value, callback) => {
      if (value) {
        if (!REG_NUMBER.test(value)) {
          callback(new Error('必须为数字'))
        }  else if(value.length>11){
           callback(new Error('最多输入11位有效数字'))
        }else {
          this.$refs.formOnSearch.validateField('members_admin');
          callback();
        }
      } else {
        callback()
      }
     }
    return {
      activeName:'all',
      consign_status:false,
      show_chain:'',
      list:[],
      trade_options: [
        {
          value: "1",
          label: "普通订单"
        },
         {
          value: "2",
          label: "拼团订单"
        }, {
          value: "3",
          label: "分期购订单"
        }, {
          value: "4",
          label: "零元购订单"
        }
      ],
      state_options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "10",
          label: "等待买家付款"
        },
         {
          value: "20",
          label: "买家已付款"
        }, {
          value: "25",
          label: "等待发货"
        },{
          value: "40",
          label: "等待买家收货"
        }, {
          value: "50",
          label: "等待买家评论"
        },{
          value: "60",
          label: "交易完成"
        },{
          value: "30,31",
          label: "交易关闭"
        }
      ],
      spell_state:[
        {
          value: "1",
          label: "拼团中"
        },{
          value: "2",
          label: "拼团成功"
        },{
          value: "3",
          label: "拼团失败"
        }
      ],
      invoice_options:[
        {
          value:'',
          label:'全部'
        },
        {
          value:'1',
          label:'是'
        },
        {
          value:'0',
          label:'否'
        }
      ],
      formOnSearch:{
        name:'formOnSearch',
        total:0,
        form:{
          main_order_no:'',
          item_name:'',
          order_status: '',
          spell_state_val:'',
          is_need_invoice:'',
          shop_order_no:'',
          order_start_time:'',
          order_end_time:'',
          user_name:'',
          receiver_name:'',
          page:1,
          page_size: 20
        },
        loading:false,
      },
      exportList:[],
       dcPage:{
        main_order_no:'',
        page:1,
        item_name:'',
        order_status: '',
        spell_state_val:'',
        is_need_invoice:'',
        shop_order_no:'',
        order_start_time:'',
        order_end_time:'',
        receiver_name:'',
        user_name:'',
        },
       columns: [
          { label: '订单创建时间', field: 'created_at', align: 'center' },
          { label: '订单支付时间', field: 'payed_at', align: 'center' },
          { label: '平台订单号', field: 'platform_no', align: 'center' },
          { label: '店铺订单号', field: 'shop_no', align: 'center' },
          { label: '商品订单号', field: 'goods_no', align: 'center' },
          { label: '仓库名称', field: 'repo_name', align: 'center' },
          { label: '订单状态', field: 'status', align: 'center' },
          { label: '售后状态', field: 'after_sale_status', align: 'center' },
          { label: '收货人姓名', field: 'receiver_name', align: 'center' },
          { label: '收货人手机号', field: 'receiver_mobile', align: 'center' },
          { label: '收货人省份', field: 'receiver_province', align: 'center' },
          { label: '收货人城市', field: 'receiver_city', align: 'center' },
          { label: '收货人地区', field: 'receiver_prefecture', align: 'center' },
          { label: '收货人详细地址', field: 'receiver_address', align: 'center' },
          { label: '收货人身份证号码', field: 'receiver_idcard', align: 'center' },
          { label: '收货人身份证正面', field: 'receiver_idcard_front', align: 'center' },
          { label: '收货人身份证反面', field: 'receiver_idcard_back', align: 'center' },
          { label: '一级类目', field: 'cat_primary_name', align: 'center' },
          { label: '二级类目', field: 'cat_secondary_name', align: 'center' },
          { label: '三级类目', field: 'cat_name', align: 'center' },
          { label: '商品名称', field: 'title', align: 'center' },
          { label: '商品贸易类型', field: 'trade_type', align: 'center' },
          { label: '销售属性', field: 'spec_nature_info', align: 'center' },
          { label: '条形码', field: 'barcode', align: 'center' },
          { label: '商品货号', field: 'art_no', align: 'center' },
          { label: '供应商', field: 'supplier_name', align: 'center' },
          { label: '购买数量', field: 'num', align: 'center' },
          { label: '赠品', field: 'gifts', align: 'center' },
          { label: '商品售价', field: 'payment', align: 'center' },
          { label: '邮费', field: 'freight', align: 'center' },
          { label: '优惠', field: 'discount', align: 'center' },
          { label: '实际支付', field: 'sell_price', align: 'center' },
          { label: '是否开发票', field: 'is_need_invoice', align: 'center' },
          { label: '发票类型', field: 'invoice_type', align: 'center' },
          { label: '发票抬头', field: 'invoice_title', align: 'center' },
          { label: '发票内容', field: 'invoice_content', align: 'center' },
          { label: '纳税人识别码', field: 'invoice_id_number', align: 'center' },
          { label: '注册地址', field: 'invoice_reg_address', align: 'center' },
          { label: '注册电话', field: 'invoice_reg_tel', align: 'center' },
          { label: '开户银行', field: 'invoice_open_bank', align: 'center' },
          { label: '银行账户', field: 'invoice_bank_account', align: 'center' },
          { label: '收票人姓名', field: 'invoice_receiver_name', align: 'center' },
          { label: '收票人邮箱', field: 'invoice_receiver_email', align: 'center' },
          { label: '收票人地址', field: 'invoice_receiver_address', align: 'center' },
          { label: '推单', field: 'push_status', align: 'center' },
        ],
      rules:{
          item_name: [
            { max: 60, message: '长度在 0 到 60 个字符', trigger: 'blur' }
          ],
          orderNun: [
            { max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
          ],
          ptorderNun: [
            { max: 30, message: '长度在 0 到 30 个字符', trigger: 'blur' }
          ],
          members_admin: [
            { validator: validateMinPrice, trigger: 'blur' }
          ],
        }
    };
  },
  methods: {
      batchShipment(){
        this.$router.push({
          name:'batchShipment'
        })
      },
      statusChange(){
        // if(this.formOnSearch.form.order_status==24){
        //     this.formOnSearch.form.consign_status=20
        // }
      },
      zf(val){
        return val+'.'
      },
      getOrderList(data){
        order.getOrderList(data).then((res) => {
          this.formOnSearch.total =res.data.total_count
          this.show_chain=res.data.show_chain
            this.list =[];
            var _this =this;

            for(var i in res.data.list){
              var status =res.data.list[i].status;
               switch(status){
                  case 10 :res.data.list[i].status='等待买家付款';
                  break;
                  case 20 :res.data.list[i].status='买家已付款';
                  break;
                  case 30 :res.data.list[i].status='交易关闭';
                  break;
                  case 31 :res.data.list[i].status='交易关闭';
                  break;
                  case 40 :res.data.list[i].status='等待买家收货';
                  break;
                  case 50 :res.data.list[i].status='等待买家评论';
                  break;
                  case 60 :res.data.list[i].status='交易完成';
                  break;
                  case 25 :res.data.list[i].status='等待发货';
                  break;

                }
                for(var j in res.data.list[i].order_goods){
                  var sales_status =res.data.list[i].order_goods[j].after_sales_status
                  if(sales_status){
                    switch(sales_status){
                      case 10 : res.data.list[i].order_goods[j].after_sales_status ='买家申请，等待卖家审核'
                      break;
                      case 20 : res.data.list[i].order_goods[j].after_sales_status ='卖家审核，等待平台处理'
                      break;
                      case 30 : res.data.list[i].order_goods[j].after_sales_status ='退款完成'
                      break;
                      case 40 : res.data.list[i].order_goods[j].after_sales_status ='卖家输入收货地址，等待卖家寄货'
                      break;
                      case 50 : res.data.list[i].order_goods[j].after_sales_status ='买家已发货（退货退款）'
                      break;
                      case 60 : res.data.list[i].order_goods[j].after_sales_status ='卖家拒绝售后申请'
                      break;
                      case 70 : res.data.list[i].order_goods[j].after_sales_status ='卖家撤销售后'
                      break;
                      case 80 : res.data.list[i].order_goods[j].after_sales_status ='超时系统关闭'
                      break;
                    }
                  }

                  var push_status = res.data.list[i].order_goods[j].push_status
                  switch(push_status){
                    case null : res.data.list[i].order_goods[j].push_status='无需推送';
                    break
                    case 10 : res.data.list[i].order_goods[j].push_status='推送中';
                    break
                    case 20 : res.data.list[i].order_goods[j].push_status='推送成功';
                    break
                    case 40 : res.data.list[i].order_goods[j].push_status='推送失败';
                    break
                    case 200 : res.data.list[i].order_goods[j].push_status='下单成功';
                    break
                    case 300 : res.data.list[i].order_goods[j].push_status='下单失败';
                    break
                  }
                  if(res.data.list[i].order_goods[j].promotions){
                    for(var y in res.data.list[i].order_goods[j].promotions){
                     var  promotions =res.data.list[i].order_goods[j].promotions[y]
                     if(promotions.promotion_role=='main_good' || promotions.promotion_role==null){
                       switch(promotions.promotion_type){
                         case 'FullMinus' : promotions.promotion_type='满减'
                         break;
                         case 'FullDiscount' : promotions.promotion_type='满折'
                         break;
                         case 'FlashSale' : promotions.promotion_type='特卖'
                         break;
                         case 'SpecialFlashSale' : promotions.promotion_type='专场特卖'
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
                  }



                }

               _this.list.push(res.data.list[i])

            }
          }
        )
      },
    extend(parent){
          var child={};
          for(var i in parent){
              child[i]=parent[i];
          }
          return child;
      },
      submitForm(){
        this.$refs.formOnSearch.validate((valid) => {

          if(valid){
              this.formOnSearch.form.page = 1
              this.getOrderList(this.formOnSearch.form)
          } else{
            return false;
          }
        })
      },
      resetForm(){
         this.$refs.formOnSearch.resetFields();
      },
      talClick(tab,event){
        let name =tab.name;
        switch(name){
          case 'all':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status =''
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '10':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='10'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '20':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='20'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '25':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='25'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '40':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='40'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '50':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='50'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case '60':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='60'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

          case 'consign_status':
          this.formOnSearch.form.page = 1
          let consignStatus = this.extend(this.formOnSearch.form)
          consignStatus.consign_status ='20'
          this.formOnSearch.form.order_status =''
          consignStatus.order_status =''
          this.consign_status =true
          this.getOrderList(consignStatus)

          break;

          case '30,31':
          this.formOnSearch.form.page = 1
          this.formOnSearch.form.order_status ='30,31'
          this.getOrderList(this.formOnSearch.form)
          this.consign_status =false
          break;

      }

    },
     handleSizeChange (val) {
       if(this.consign_status){
        let consignStatus = this.extend(this.formOnSearch.form)
        consignStatus.consign_status ='20'
        consignStatus.page_size =val
        this.formOnSearch.form.order_status =''
        consignStatus.order_status =''
        this.dcPage.page_size =val
        this.getOrderList(consignStatus)
       }else{
        this.formOnSearch.form.page_size = val
        this.dcPage.page_size =val
        this.getOrderList(this.formOnSearch.form)
       }

    },
    handleNumberChange (val) {
      if(this.consign_status){
        let consignStatus = this.extend(this.formOnSearch.form)
        consignStatus.consign_status ='20'
        consignStatus.page =val
        this.dcPage.page_size =val
        this.formOnSearch.form.order_status =''
        consignStatus.order_status =''
        this.getOrderList(consignStatus)
       }else{
        this.formOnSearch.form.page = val
        this.dcPage.page =val
        this.getOrderList(this.formOnSearch.form)
       }
      // this.formOnSearch.form.page = val
      // this.dcPage.page =val
      // this.getOrderList(this.formOnSearch.form)
    },
    exportExcel () {
      this.dcPage.item_name=this.formOnSearch.form.item_name,
      this.dcPage.order_status=this.formOnSearch.form.order_status,
      this.dcPage.spell_state_val=this.formOnSearch.form.spell_state_val,
      this.dcPage.is_need_invoice=this.formOnSearch.form.is_need_invoice,
      this.dcPage.shop_order_no=this.formOnSearch.form.shop_order_no,
      this.dcPage.order_start_time=this.formOnSearch.form.order_start_time,
      this.dcPage.order_end_time=this.formOnSearch.form.order_end_time,
      this.dcPage.user_name=this.formOnSearch.form.user_name,
      this.dcPage.main_order_no =this.formOnSearch.form.main_order_no
      this.dcPage.receiver_name=this.formOnSearch.form.receiver_name
      this.Dcexport(this.dcPage)

              },
    Dcexport(page){
      let _this=this
        order.Dcexport(page).then((res)=>{
          _this.exportList =[]
              for(let i in res.data){
                var type = res.data[i].trade_type
                switch(type){
                  case 10 : res.data[i].trade_type='国内贸易'
                  break;
                  case 20 :res.data[i].trade_type='海淘'
                  break;
                  case 30 : res.data[i].trade_type='跨境保税'
                  break;
                  case 40 : res.data[i].trade_type='跨境直邮'
                  break;
                }
                var push_status = res.data[i].push_status
                  switch(push_status){
                    case null : res.data[i].push_status='无需推送';
                    break
                    case 10 : res.data[i].push_status='推送中';
                    break
                    case 20 : res.data[i].push_status='推送成功';
                    break
                    case 40 : res.data[i].push_status='推送失败';
                    break
                    case 200 : res.data[i].push_status='下单成功';
                    break
                    case 300 : res.data[i].push_status='下单失败';
                    break
                  }
                var status =res.data[i].status
                 switch(status){
                  case 10 :res.data[i].status='等待买家付款';
                  break;
                  case 20 :res.data[i].status='买家已付款';
                  break;
                  case 30 :res.data[i].status='交易关闭';
                  break;
                  case 31 :res.data[i].status='交易关闭';
                  break;
                  case 40 :res.data[i].status='等待买家收货';
                  break;
                  case 50 :res.data[i].status='等待买家评论';
                  break;
                  case 60 :res.data[i].status='交易完成';
                  break;
                  case 25 :res.data[i].status='等待发货';
                  break;
                  }
                  var after_sale_status = res.data[i].after_sale_status
                  switch(after_sale_status){
                      case 10 : res.data[i].after_sale_status='买家申请，等待商家审核'
                      break;
                      case 20 : res.data[i].after_sale_status ='商家同意，等待平台处理'
                      break;
                      case 30 : res.data[i].after_sale_status ='退款完成'
                      break;
                      case 40 : res.data[i].after_sale_status ='商家同意，等待买家回寄'
                      break;
                      case 50 : res.data[i].after_sale_status ='买家回寄，等待商家确认收货'
                      break;
                      case 60 : res.data[i].after_sale_status ='商家拒绝售后'
                      break;
                      case 70 : res.data[i].after_sale_status ='买家撤销售后'
                      break;
                      case 80 : res.data[i].after_sale_status ='超时系统关闭'
                      break;
                    }
                _this.exportList.push(res.data[i])
              }
              setTimeout(() => {
                let wb = XLSX.utils.table_to_book(document.querySelector('#rebateSetTable'));
                for(var i in wb.Sheets.Sheet1){
                  if(wb.Sheets.Sheet1[i].t && !wb.Sheets.Sheet1[i].z){
                      if(String(wb.Sheets.Sheet1[i].v).substr(0, 1) =='"' && wb.Sheets.Sheet1[i] !=''){
                        wb.Sheets.Sheet1[i].v =String(wb.Sheets.Sheet1[i].v).substr(1,wb.Sheets.Sheet1[i].v.length-1)
                     }
                    wb.Sheets.Sheet1[i].t ='s'

                  }else if(wb.Sheets.Sheet1[i].z){
                    wb.Sheets.Sheet1[i].z ='yyyy-MM-dd HH:mm:ss'
                  }

                }

                let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
                const s2ab = s => {
                    let buf = new ArrayBuffer(s.length);
                    let view = new Uint8Array(buf);
                    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                  };

                try {
                   FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '订单列表.xlsx');
                } catch (e)
                {
                    if (typeof console !== 'undefined')
                        console.log(e, wbout)
                }
                return wbout
              }, 1000);
        })
      },
  },
  components: {
      OrderView,
      PaginationView,
      TableView
  },
  created:function(){
    this.getOrderList(this.formOnSearch.form)

  }
};
</script>
<style lang='scss' scoped>
.manage {
  padding: 10px;
}
label {
  text-align: left;
}
.tc{
  text-align: center;
}
.ex{
  mso-number-format:'\@'

}
</style>
