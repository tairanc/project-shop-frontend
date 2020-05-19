    <template>
        <section>
            <div style="padding:10px">
                <h2>发货商品明细</h2>
                <table width=100% style="border-collapse:collapse;">
                    <tr class='li'>
                        <td width=80%>商品</td>
                        <td width=10%>单价</td>
                        <td width=10%>数量</td>
                    </tr>
                    <tr v-for='(item,index) in defaultList' :key='index'>
                        <td class='shipMentsImg'>
                            <img :src="imageDomains(item.primary_image)+'_t.jpg'"/>
                            <div style="display:inline-block;vertical-align: top;">
                                <a :href="defaultUrl('item_id',item)" class='goods_url' target="_blank">
                                  <p>{{item.title}}</p>
                                </a>
                                <p>{{item.spec_nature_info}}</p>
                            </div>
                        </td>
                        <td class='tc'>
                           {{item.sell_price}} 
                        </td>
                        <td class='tc'>
                            {{item.num}}
                        </td>
                    </tr>
                </table>
                <h2>发货信息</h2>
                <div>
                    <p>收货人姓名：{{address.name}}</p>
                    <p>收货手机号：{{address.mobile}}</p>
                    <p>收货人地址：
                        {{address.state}}
                        {{address.city}}
                        {{address.district}}
                        {{address.address}}
                    </p>
                </div>
                <h2>配送信息</h2>
                <div class="delivery-content" v-if="isOwn">
                    <span class="delivery-head">配送方式:</span>
                    <el-radio-group v-model="delivery_type" @change="radioChange" :disabled="packed_items.length != 0">
                        <el-radio :label="10">快递</el-radio>
                        <el-radio :label="20">无需配送</el-radio>
                    </el-radio-group>
                </div>
                <div class="delivery-content" v-else>
                    <span class="delivery-head">配送方式:</span>
                    <el-radio-group v-model="delivery_type" @change="radioChange" :disabled="packed_items.length != 0">
                        <el-radio :label="10">快递</el-radio>
                    </el-radio-group>
                </div>
                
                <div  v-if='packed_items.length==0'>
                        <table-view
                            v-if="delivery_type == 10"
                            :selection="delivery_type == 10"
                            :columns="columns"
                            :imageDomain='imageDomain'
                            :pageList="list"
                            @select-change='handleSelectChange'
                            >
                        </table-view>
                        <!-- <el-table class="table" :data="list" border align="center" @select-change='handleSelectChange'>
                                <el-table-column  
                                type="selection"
                                width="35">
                                </el-table-column>
                                <el-table-column align="center" label="商品">
                                        <template  slot-scope="scope">
                                                <span class="shipMentsImg"><img :src="imageDomains(scope.row.primary_image)"/></span>
                                                <a :href="defaultUrl('item_id',scope.row)" class='goods_url' target="_blank">
                                                <p>{{scope.row.title}}</p></a>
                                                <p>{{scope.row.spec_nature_info}}</p>
                                        </template>
                                </el-table-column>
                                <el-table-column align="center" label="数量">
                                        <template  slot-scope="scope">
                                            <el-input type='number'></el-input>
                                        </template>
                                </el-table-column>
                                <el-table-column align="center">
                                        <template  slot-scope="scope">
                                        </template>
                                </el-table-column>
                        </el-table> -->
                        <div style="margin:20px 0 20px 0" v-if="delivery_type == 10">
                            <el-button type="primary" :disabled="disabled">包裹拆分</el-button>
                            <el-button type="primary" :disabled="path" @click="pathClick">路径拆分</el-button>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    <el-form :model="formOnSearch.form" :rules="rules" ref="formOnSearch" label-width="100px" size="medium">
                                        <el-row v-if="delivery_type == 10">
                                          <el-col :span="11" :offset="1" v-if="pathModlie" style="position:relative">
                                            <h3>国际物流</h3>
                                            <el-form-item label="物流公司:">
                                                <el-select v-model="formOnSearch.form.overseas_corp_id" placeholder="请选择">
                                                    <el-option
                                                        v-for="(item,index) in options"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>    
                                            </el-form-item>
                                            <el-form-item label="配送单号:">
                                                <el-input v-model="formOnSearch.form.overseas_express_no" maxlength="20" ></el-input>   
                                            </el-form-item>
                                            <span style="position: absolute;right: 0;top: 0;" @click="delPath">x</span>
                                          </el-col>
                                        <el-col :span="11" :offset="1">
                                          <h3>国内物流</h3>
                                              <el-form-item label="物流公司:">
                                                  <el-select v-model="formOnSearch.form.corp_id" placeholder="请选择">
                                                      <el-option
                                                          v-for="item in options"
                                                          :key="item.id"
                                                          :label="item.name"
                                                          :value="item.id">
                                                      </el-option>
                                                  </el-select>    
                                              </el-form-item>
                                              <el-form-item label="配送单号:">
                                                  <el-input v-model="formOnSearch.form.express_no"  maxlength="20"></el-input>   
                                              </el-form-item>
                                          </el-col>
                                        </el-row>
                                        <el-row style="text-align: center;">
                                          <el-col class='btn-margintop'>
                                              <el-button type="primary" @click="clickDelivery">发货</el-button>
                                          </el-col>
                                        </el-row>
                                    </el-form>    
                                </li>
                            </ul>
                        </div>
                    </div>
                <div v-else>
                    <div style="margin:20px 0 20px 0" v-if="delivery_type == 10">
                        <el-button type="primary" @click="addTab(editableTabsValue2)" :disabled="parcel_split">包裹拆分</el-button>
                        <el-button type="primary" :disabled="path_split" @click="pathClick">路径拆分</el-button>       
                    </div>
                      <el-tabs v-model="editableTabsValue2" type="card"  @tab-remove="removeTab" @tab-click="handleClick">
                          <el-tab-pane
                            :key="item.name"
                            v-for="(item,index) in packed_items"
                            :label="'包裹'+(index +1*1)*1"
                            :closable='item.close'
                            :name="item.name"
                            v-if="delivery_type == 10"
                            >
                            <div v-if='item.close'>
                                <table-view
                                    :selection="delivery_type == 10"
                                    :columns="titles"
                                    :pageList="item.content"
                                    :imageDomain='imageDomain'
                                    @select-change='toHandleSelectChange'
                                    >
                                    </table-view>
                                <el-form >
                                    <el-row>
                                          <el-col :span="11" :offset="1" v-if="pathModlie" style="position:relative">
                                            <h3>国际物流</h3>
                                            <el-form-item label="物流公司:">
                                                <el-select v-model="formOnSearch.form.overseas_corp_id" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in options"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>    
                                            </el-form-item>
                                            <el-form-item label="配送单号:">
                                                <el-input v-model="formOnSearch.form.overseas_express_no" maxlength="20" ></el-input>   
                                            </el-form-item>
                                            <span style="position: absolute;right: 0;top: 0;" @click="delPath">x</span>
                                            </el-col>
                                        <el-col :span="11" :offset="1">
                                        <h3>国内物流</h3>
                                            <el-form-item label="物流公司:">
                                                <el-select v-model="formOnSearch.form.corp_id" placeholder="请选择">
                                                    <el-option
                                                        v-for="item in options"
                                                        :key="item.id"
                                                        :label="item.name"
                                                        :value="item.id">
                                                    </el-option>
                                                </el-select>    
                                            </el-form-item>
                                            <el-form-item label="配送单号:">
                                                <el-input v-model="formOnSearch.form.express_no"  maxlength="20"></el-input>   
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                  </el-form>
                            </div>
                            <div v-else>
                              <table-view
                                :columns="title"
                                :pageList="item.goods_orders"
                                :imageDomain='imageDomain'
                                >
                                </table-view>
                                <el-row >
                                  <el-col :span="11" :offset="1">
                                      <h3>国内物流</h3>
                                      <label>物流公司：</label>
                                      <el-select v-model="item.deliveries.domestic.corp_id" placeholder='请选择'>
                                          <el-option
                                              v-for="item in options"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">               
                                          </el-option>         
                                      </el-select>
                                      <label>物流单号：</label>
                                      <input v-model="item.deliveries.domestic.express_no" type="text"  maxlength="20"/>
                                  </el-col>
                                  <el-col :span="11" :offset="1" v-if='item.deliveries.overseas'>
                                      <h3>国际物流</h3>
                                      <label>物流公司：</label>
                                      <el-select v-model="item.deliveries.overseas.corp_id" placeholder='请选择'>
                                          <el-option
                                              v-for="item in options"
                                              :key="item.id"
                                              :label="item.name"
                                              :value="item.id">               
                                          </el-option>         
                                      </el-select>
                                      <label>物流单号：</label>
                                      <input v-model="item.deliveries.overseas.express_no" type="text"  maxlength="20"/>
                                  </el-col>     
                                </el-row> 
                            </div>
                          </el-tab-pane>
                          <el-row class='tc'>
                            <el-button type="primary" v-if="delivery_type == 10" @click="clickSubmit">提交</el-button>
                            <el-button type="primary" v-else @click="clickBack">返回</el-button>
                          </el-row>    
                    </el-tabs>
                </div>
            </div>
        </section>    
    </template>

    <script>
import VHeader from "@/components/Header";
import order from "@/api/deal/order";
import shops from "@/api/shops";
import { urlParse } from "@/utils/urlParse";
import TableView from "@/components/TableView";
export default {
  data() {
    return {
        isOwn:false,    //是否直营 true 是
      list: [],
      defaultList: [],
      name: "0",
      info: "",
      address: "",
      obj: "",
      closable: false,
      imageDomain: "",
      parcel_split: "",
      path_split: true,
      packed_items: [],
      un_packed_items: [],
      post_data: [],
      disabled: true,
      path: true,
      checkList: [],
      val: "",
      columns: [
        { label: "商品", desFields: "1" },
        { label: "数量", text: "num", align: "center" },
        { label: "", field: "after_sale_status", align: "center" }
      ],
      titles: [
        { label: "商品", desFields: "1" },
        { label: "数量", text: "packed_num", align: "center" },
        { label: "", field: "after_sale_status", align: "center" }
      ],
      title: [
        { label: "商品", desFields: "1" },
        { label: "数量", field: "packed_num", align: "center" },
        { label: "", field: "after_sale_status", align: "center" }
      ],
      options: [],
      value3: "",
      no: "",
      rules: {},
      pathModlie: false,
      delivery_type: 10, //配送方式 默认10 快递 20 无需配送
      formOnSearch: {
        form: {
          order_shop_no: "",
          corp_id: "",
          express_no: "",
          package: [],
          overseas_corp_id: "",
          overseas_express_no: "",
          is_overseas: false
        }
      },
      editableTabsValue2: "0",
      editableTabs2: [],
      tabIndex: 1
    };
  },
  methods: {
    initDelivery(data) {
      order.initDelivery(data).then(res => {
        this.delivery_type = res.data.delivery_type || 10
        this.imageDomain = res.data.image_domain;
        this.defaultList = [];
        this.formOnSearch.form.order_shop_no = res.data.shop_order_item.no;
        res.data.unpacked_items == ""
          ? (this.parcel_split = true)
          : (this.parcel_split = false);
        for (var i in res.data.unpacked_items) {
          var after_sale_status = res.data.unpacked_items[i].after_sale_status;
          if (after_sale_status != null) {
            if (
              after_sale_status == 10 ||
              after_sale_status == 20 ||
              after_sale_status == 40 ||
              after_sale_status == 50
            ) {
              res.data.unpacked_items[i].after_sale_status = "售后处理中";
            } else if (after_sale_status == 30) {
              res.data.unpacked_items[i].after_sale_status = "售后完成";
            } else if (after_sale_status == 60 || after_sale_status == 70) {
              res.data.unpacked_items[i].after_sale_status = "";
            }
          }

          this.list.push(res.data.unpacked_items[i]);
        }
        for (let i in res.data.shop_order_item.order_goods) {
          this.defaultList.push(res.data.shop_order_item.order_goods[i]);
        }
        for (var i in res.data.packed_items) {
          var close = false;
          res.data.packed_items[i].close = close;
          res.data.packed_items[i].name = i;
          for (var j in res.data.packed_items[i].goods_orders) {
            var after_sale_status =
              res.data.packed_items[i].goods_orders[j].after_sale_status;
            if (after_sale_status != null) {
              if (
                after_sale_status == 10 ||
                after_sale_status == 20 ||
                after_sale_status == 40 ||
                after_sale_status == 50
              ) {
                res.data.packed_items[i].goods_orders[j].after_sale_status =
                  "售后处理中";
              } else if (after_sale_status == 30) {
                res.data.packed_items[i].goods_orders[j].after_sale_status =
                  "售后完成";
              } else if (after_sale_status == 60 || after_sale_status == 70) {
                res.data.packed_items[i].goods_orders[j].after_sale_status = "";
              }
            }
          }
          this.packed_items.push(res.data.packed_items[i]);
        }
        var close = true;
        var obj = {
          close: "",
          goods_orders: []
        };
        obj.close = close;

        for (var i in res.data.unpacked_items) {
          var after_sale_status = res.data.unpacked_items[i].after_sale_status;
          if (after_sale_status != null) {
            if (
              after_sale_status == 10 ||
              after_sale_status == 20 ||
              after_sale_status == 40 ||
              after_sale_status == 50
            ) {
              res.data.unpacked_items[i].after_sale_status = "售后处理中";
            } else if (after_sale_status == 30) {
              res.data.unpacked_items[i].after_sale_status = "售后完成";
            } else if (after_sale_status == 60 || after_sale_status == 70) {
              res.data.unpacked_items[i].after_sale_status = "";
            }
          }
          obj.goods_orders.push(res.data.unpacked_items[i]);
        }
        this.info = res.data.shop_order_item.order.receiver;
        this.address = res.data.shop_order_item.order.receiver.address;
        for (var i in res.data.delivery_company) {
          res.data.delivery_company[i].id = res.data.delivery_company[i].id * 1;
          this.options.push(res.data.delivery_company[i]);
        }
        this.un_packed_items.push(obj);
      });
    },
    handleClick(tab, event) {
      this.closable = tab.closable;
      tab.closable ? (this.path_split = false) : (this.path_split = true);
      this.name = tab.name;
    },
    delivery(data) {
      data.delivery_type = this.delivery_type; //将快递方式植入
      order.delivery(data).then(res => {
        this.$message({
          type: "success",
          message: "发货成功"
        });
        setTimeout(function() {
          window.location.reload();
        }, 1000);
      });
    },
    radioChange(val){
      console.log(val)
    },
    handleSelectChange(val) {
      let self = this;
      val == "" ? (self.path = true) : (self.path = false);
      this.val = "";
      this.val = val;
      self.formOnSearch.form.package = [];
      if (val == "") {
        return false;
      } else {
        val.forEach(function(val) {
          var obj = { num: "", order_good_no: "" };
          obj.num = val.num;
          obj.order_good_no = val.no;
          self.formOnSearch.form.package.push(obj);
        });
      }
    },
    toHandleSelectChange(val) {
      let self = this;
      val == "" ? (self.path = true) : (self.path = false);
      this.val = "";
      this.val = val;
      self.formOnSearch.form.package = [];
      if (val == "") {
        return false;
      } else {
        val.forEach(function(val) {
          var obj = { num: "", order_good_no: "" };
          obj.num = val.num;
          obj.order_good_no = val.no;
          self.formOnSearch.form.package.push(obj);
        });
      }
    },
    pathClick() {
      this.pathModlie = true;
      this.formOnSearch.form.is_overseas = true;
    },
    delPath() {
      this.pathModlie = false;
      this.formOnSearch.form.is_overseas = false;
      this.formOnSearch.form.overseas_corp_id = "";
      this.formOnSearch.form.overseas_express_no = "";
    },
    clickDelivery() {
      let _this = this
      this.handleSelectChange(this.val);
      if (this.delivery_type == 20) {
        _this.defaultList.forEach(function(val) {
          var obj = { num: "", order_good_no: "" };
          obj.num = val.num;
          obj.order_good_no = val.no;
          _this.formOnSearch.form.package.push(obj);
        });
        this.delivery(this.formOnSearch.form);
      }else{
        if (this.formOnSearch.form.package == "") {
          this.$message({ message: "请勾选商品", type: "error", duration: 1000 });
        } else {
          this.delivery(this.formOnSearch.form);
        }
      }
      
    },

    addTab(targetName) {
      for (var i in this.un_packed_items[0].goods_orders) {
        this.un_packed_items[0].goods_orders[
          i
        ].packed_num = this.un_packed_items[0].goods_orders[i].num;
      }
      this.closable = true;
      this.parcel_split = true;
      this.path_split = false;
      let newTabName = ++this.tabIndex + 1;
      this.packed_items.push({
        title: "包裹" + (this.packed_items.length * 1 + 1) * 1,
        name: newTabName,
        content: this.un_packed_items[0].goods_orders,
        close: true
      });
      this.editableTabsValue2 = newTabName;
    },
    removeTab(targetName) {
      this.parcel_split = false;
      this.path_split = true;
      let tabs = this.packed_items;
      let activeName = this.editableTabsValue2;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue2 = activeName;
      this.packed_items = tabs.filter(tab => tab.name !== targetName);
    },
    clickSubmit() {
      this.post_data = [];
      let packed_items = this.packed_items;
      if (this.closable) {
        this.toHandleSelectChange(this.val);
        this.delivery(this.formOnSearch.form);
      } else {
        var _this = this;
        for (var i in packed_items) {
          if (_this.name == packed_items[i].name) {
            var obj = {
              corp_id: "",
              express_no: "",
              is_overseas: false,
              overseas_corp_id: "",
              overseas_express_no: "",
              order_shop_no: "",
              package_id: "",
              package: []
            };

            obj.corp_id = packed_items[i].deliveries.domestic.corp_id;
            obj.express_no = packed_items[i].deliveries.domestic.express_no;
            obj.order_shop_no = packed_items[i].goods_orders[0].order_shop_no;
            packed_items[i].deliveries.domestic.package_id
              ? (obj.package_id =
                  packed_items[i].deliveries.domestic.package_id)
              : (obj.package_id = 0);
            this.formOnSearch.form.order_shop_no =
              packed_items[i].goods_orders[0].order_shop_no;

            if (packed_items[i].deliveries.overseas) {
              obj.is_overseas = true;
              obj.overseas_corp_id =
                packed_items[i].deliveries.overseas.corp_id;
              obj.overseas_express_no =
                packed_items[i].deliveries.overseas.express_no;
            }

            for (var j in packed_items[i].goods_orders) {
              var packobj = {
                num: "",
                order_good_no: ""
              };
              packobj.num = packed_items[i].goods_orders[j].packed_num;
              packobj.order_good_no = packed_items[i].goods_orders[j].no;
              obj.package.push(packobj);
            }
          }
        }
        this.delivery(obj);
      }
    },
    clickBack(){
      this.$router.push({name: 'tradeDeal'})
    },
    imageDomains(img) {
      var newstr = ""; //初始化一个空字符串
      var imgs = img.substring(0, 1);
      var estr = img.substring(1, imgs.length);
      newstr += this.imageDomain + img + estr;
      return newstr;
    },
    getShopInfo() {
      shops.getShopInfo().then(res => {
        // 1直营 2 入驻
        this.isOwn = res.data.biz_model === 1
      });
    }
  },

  components: {
    VHeader,
    TableView
  },
  created: function() {
    this.initDelivery(urlParse());
    this.getShopInfo();
  }
};
</script>
    <style>
.delivery-content {
  padding: 0 0 10px 0;
}
.delivery-content .delivery-head {
  margin-right: 20px;
}
.shipMentsImg img {
  width: 100px;
  height: 100px;
  display: inline-block;
}
.li td {
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
.tc {
  text-align: center;
}
.btn-margintop{
    margin-top: 20px;
}
.goods_url {
  cursor: pointer;
}
.goods_url:hover {
  color: #409eff;
}
</style>
