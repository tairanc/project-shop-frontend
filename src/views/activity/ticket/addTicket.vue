<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px">
    <div class="basic">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="优惠券名称:" prop="coupon_name">
            <el-input v-model="addCoupon.coupon_name" placeholder="优惠券名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="门槛金额:" prop="limit_money">
            <el-input v-model.number="addCoupon.limit_money" placeholder="门槛金额"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <p class="tips">无门槛可不填，满足优惠金额即可使用</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="优惠金额:" prop="deduct_money">
            <el-input v-model.number="addCoupon.deduct_money" placeholder="优惠金额"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="发放数量:" prop="send_quantity">
            <el-input v-model.number="addCoupon.send_quantity" placeholder="发放数量"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="每人每张限领:" prop="user_obtain_limit">
            <el-input v-model.number="addCoupon.user_obtain_limit" placeholder="每人每张限领"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="是否显示入口:" prop="is_show">
            <el-radio-group v-model="addCoupon.is_show">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="1">
          <el-form-item label="使用平台:" prop="applicable_platform">
            <el-checkbox  style="float:left;margin-right:20px" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="addCoupon.applicable_platform" @change="platformChange">
              <el-checkbox label="WX">微信</el-checkbox>
              <el-checkbox label="APP">APP</el-checkbox>
              <el-checkbox label="WAP">移动端网页</el-checkbox>
              <el-checkbox label="PC">PC网页</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <div class="goods">
      <el-row>
        <el-col class="title">
          <p>选择适用商品</p>
        </el-col>
      </el-row>
      <el-row class="pl20">
        <el-col>
          <el-button type="danger" @click="selectVisible=true">选择商品</el-button>
          <el-button type="danger" @click="addItemBomb">批量导入商品</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="all">
      <el-row>
        <el-col :span="16">
          <el-form-item prop="is_check_all" label="是否全选当前店铺所有商品:" label-width="200px">
            <el-radio-group v-model="addCoupon.is_check_all">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="pl20 pt20">
            <table-view ref="goodsTable" :loading="loading" :columns="columns" :pageList="goodsList"></table-view>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="time">
      <el-row>
        <el-col :span="15">
          <el-form-item label="领取开始时间:" prop="obtain_start_time">
            <el-date-picker v-model="addCoupon.obtain_start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="领取开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15">
          <el-form-item label="领取结束时间:" prop="obtain_end_time">
            <el-date-picker v-model="addCoupon.obtain_end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="领取结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <el-col :span="15">
          <el-form-item label="设置有效时间:" prop="is_set_expiry_date">
            <el-radio-group v-model="addCoupon.is_set_expiry_date">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7" v-if='addCoupon.is_set_expiry_date == 1' class='pr'>
          <el-form-item label="使用有效期:" prop="expiry_date">
            <el-input v-model.number="addCoupon.expiry_date"></el-input><span class='pr30'>天</span>
          </el-form-item>
          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15"  v-if='addCoupon.is_set_expiry_date == 0'>
          <el-form-item label="使用开始时间:" prop="use_start_time">
            <el-date-picker v-model="addCoupon.use_start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="领取开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="15"  v-if='addCoupon.is_set_expiry_date == 0'>
          <el-form-item label="使用结束时间:" prop="use_end_time">
            <el-date-picker v-model="addCoupon.use_end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="领取结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :selectVisible="selectVisible" :selectList="selectList" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="commitCoupon" :disabled="commitCouponClick">提交</el-button>
      <el-button @click="backList">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import TableView from '@/components/TableView'
  import SelectGoods from '@/components/SelectGoods'
  import ticket from '@/api/activity/ticket'
  export default {
    data() {
      const isNum = (rule, value, callback) => {
        if (!value) {
          callback();
        } else {
          if (Number.isInteger(value)) {
            if (value >= 1 && value <= 999999999) {
              callback();
            } else {
              callback(new Error('请输入1~9个字符，仅限正整数'));
            }
          } else {
            callback(new Error('请输入1~9个字符，仅限正整数'));
          }
        }
      };
      const necNum = (rule, value, callback) => {
        if (!value) {
          callback("请输入1~9个字符，仅限正整数");
        } else {
          if (Number.isInteger(value)) {
            if (value >= 1 && value <= 999999999) {
              callback();
            } else {
              callback(new Error('请输入1~9个字符，仅限正整数'));
            }
          } else {
            callback(new Error('请输入1~9个字符，仅限正整数'));
          }
        }
      };
      const fiveNum = (rule, value, callback) => {
        if (!value) {
          callback("请输入1~5个字符，仅限正整数");
        } else {
          if (Number.isInteger(value)) {
            if (value >= 1 && value <= 99999) {
              callback();
            } else {
              callback(new Error('请输入1~5个字符，仅限正整数'));
            }
          } else {
            callback(new Error('请输入1~5个字符，仅限正整数'));
          }
        }
      };
      return {
        
        commitCouponClick:false, //提交操作
        checkAll: false,
        loading: false,
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        goodsList: [],
        commitData: {},
        addCoupon: {
          coupon_name: "",
          limit_money: "",
          deduct_money: "",
          send_quantity: "",
          user_obtain_limit: "",
          is_show: "",
          applicable_platform: [],
          is_check_all: 0,
          item_ids: "",
          obtain_start_time: "",
          obtain_end_time: "",
          is_set_expiry_date:'0',
          expiry_date:'',
          use_start_time: "",
          use_end_time: "",
        },
        columns: [{
            label: '商品ID',
            field: 'id',
            align: 'center'
          },
          {
            label: '商品名称',
            // field: 'title',
            align: 'center',
            isGood: 1
          },
          {
            label: '标准售价(元)',
            field: 'sell_price',
            align: 'center'
          },
          {
            label: '操作',
            align: 'center',
            actions: [{
              label: '删除',
              type: 'primary',
              size: 'mini',
              click: (index, row) => {
                this.deleteGoods(row.id);
              }
            }]
          }
        ],
        addRules: {
          coupon_name: [{
              required: true,
              message: '请输入1~60个字符',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 60,
              message: '请输入1~60个字符',
              trigger: 'blur'
            }
          ],
          limit_money: [{
            validator: isNum,
            trigger: 'blur'
          }],
          deduct_money: [{
            required: true,
            validator: necNum,
            trigger: 'blur'
          }],
          send_quantity: [{
            required: true,
            validator: necNum,
            trigger: 'blur'
          }],
          expiry_date: [{
            required: true,
            validator: necNum,
            trigger: 'blur'
          }],
          user_obtain_limit: [{
            required: true,
            validator: fiveNum,
            trigger: 'blur'
          }],
          is_show: [{
            required: true,
            message: "请选择是否显示入口",
            trigger: 'change'
          }],
          applicable_platform: [{
            required: true,
            message: "请选择适用平台",
            trigger: 'change'
          }],
          is_check_all: [{
            required: true,
            message: "请选择是否全选商品",
            trigger: 'change'
          }],
          obtain_start_time: [{
            required: true,
            message: "请选择领取开始时间",
            trigger: 'change'
          }],
          obtain_end_time: [{
            required: true,
            message: "请选择领取结束时间",
            trigger: 'change'
          }],
          use_start_time: [{
            required: true,
            message: "请选择使用开始时间",
            trigger: 'change'
          }],
          use_end_time: [{
            required: true,
            message: "请选择使用结束时间",
            trigger: 'change'
          }],
        }
      }
    },
    computed: {
      selectList(){
        let list = []
        this.goodsList.map((item)=> {
          list.push(item.id);
        })
        return list
      }
    },
    methods: {
      //平台选择变化
      handleCheckAllChange(val){
        this.addCoupon.applicable_platform = (val?["WX", "APP", "WAP", "PC"]:[])
      },
      platformChange(val){
        this.checkAll = (val.length == 4 ? true:false)
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 添加优惠券适用商品
      addGoodsById() {;
        if (this.goodsIds) {
          let that = this;
          ticket.importItemsById({
            item_id: this.goodsIds
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              that.goodsFilter(result.itemList);
            }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: 'warning'
              });
            }
          })
        }
        this.goodsIds = "";
        this.addVisibleid = false;
      },
      // 添加过滤已经存在的商品
      goodsFilter(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsList.length != 0) {
            for (let j = 0; j < this.goodsList.length; j++) {
              if (items[i].id == this.goodsList[j].id) {
                flag = true;
              }
            }
          }
          if (!flag) {
            this.goodsList.push(items[i]);
          }
        }

        let list = []
        items.map((item) => {
          list.push(item.id)
        })

        for(let n = 0; n < this.goodsList.length;n++){
          if(list.indexOf(this.goodsList[n].id) == -1){
            this.goodsList.splice(n,1)
            n --
          }
        }
      },
      // 删除添加商品
      deleteGoods(id) {
        this.goodsList = this.goodsList.filter(function (item) {
          return item.id != id;
        })
      },
      // 提交添加商品
      commitCoupon() {
        this.commitCouponClick = true
        setTimeout(() => {
          this.commitCouponClick = false
        }, 3000)
        let ids = [];
        this.goodsList.forEach(function (item) {
          ids.push(item.id);
        })
        this.addCoupon.item_ids = ids.toString();
        this.commitData = { ...this.addCoupon};
        if(this.commitData.applicable_platform.length==4){
          this.commitData.applicable_platform = ["ALL"]
        }
        this.commitData.is_show = parseInt(this.commitData.is_show);

        if (this.commitData.limit_money == "") {
          this.commitData.limit_money = 0;
        }
        if (!this.commitData.is_check_all&&this.addCoupon.item_ids == "") {
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: "请选择优惠券商品～",
            type: 'warning'
          });
         this.addCoupon.is_set_expiry_date + ''
        } else if(this.addCoupon.limit_money&&this.addCoupon.limit_money < this.addCoupon.deduct_money){
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: "优惠金额需小于门槛金额",
            type: 'warning'
          });
          this.addCoupon.is_set_expiry_date + ''
        }else {
          let that = this;
          this.$refs.addCoupon.validate((valid) => {
            if (valid) {
              if(that.commitData.is_set_expiry_date ==1){
                delete that.commitData.use_start_time;
                delete that.commitData.use_end_time;
              }
              ticket.createCoupon(that.commitData).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: "优惠券添加成功",
                    type: 'success'
                  });
                  this.$router.push({
                    name: "ticket"
                  })
                } else {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: res.message,
                    type: 'warning'
                  });
                   this.addCoupon.is_set_expiry_date + ''
                }
              })
            } else {
               this.addCoupon.is_set_expiry_date + ''
              return false;
            }
          });
        }
      },
      // 返回列表页
      backList() {
        this.$router.push({
          name: "ticket"
        })
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
         ticket.importItemsById({
            item_id: val
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              this.goodsFilter(result.itemList);
            }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: 'warning'
              });
            }
          })




      }
    },
    components: {
      TableView,
      SelectGoods
    },
  }

</script>

<style lang='scss' scoped>
  .basic,
  .time {
    margin: 20px;
    padding: 20px;
    padding-bottom: 0px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .inline {
    display: inline-block;
    margin-left: 30px;
  }
  .pr{
    position: relative;
  }
  .pr30{
    position: absolute;
    margin-right: -20px
  }
  .goods,
  .all {
    margin: 20px;
    padding-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .all {
    padding-bottom: 0px;
    padding-top: 20px;
  }

  .title {
    margin-bottom: 20px;
    padding-left: 20px;
    background-color: #f5f5f5;
  }

  .pl20 {
    padding-left: 20px;
  }

  .pt20 {
    padding-bottom: 20px;
  }

  .el-col-10 .tips {
    margin-top: 12px;
    margin-bottom: 10px;
    margin-left: 20px;
    color: #ccc;
    font-size: 14px;
  }

</style>
