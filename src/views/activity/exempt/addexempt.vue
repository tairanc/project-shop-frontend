<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="140px" label-position="left">
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
          <el-form-item label="发放数量:" prop="send_quantity">
            <el-input v-model.number="addCoupon.send_quantity" placeholder="发放数量"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="每人每张限领:" prop="user_obtain_limit">
            <el-input v-model.number="addCoupon.user_obtain_limit" placeholder="每人每张限领" maxlength="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="15" :offset="1">
          <el-form-item label="使用平台:" prop="applicable_platform">
            <el-checkbox-group v-model="addCoupon.applicable_platform">
              <el-checkbox label="WX">微信</el-checkbox>
              <el-checkbox label="APP">APP</el-checkbox>
              <el-checkbox label="WAP">移动端网页</el-checkbox>
              <el-checkbox label="PC">PC网页</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="17" :offset="1">
          <el-form-item label="使用平台:" prop="applicable_platform">
            <el-checkbox  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-checkbox-group v-model="addCoupon.applicable_platform" @change="handleCheckedPlatformChange" class="addexempt_checkboxgroup">
               <el-checkbox v-for="(item,index) in platform" :label="item.label" :key="index">{{item.name}}</el-checkbox>

              <!-- <el-checkbox label="WX">微信</el-checkbox>
              <el-checkbox label="APP">APP</el-checkbox>
              <el-checkbox label="WAP">移动端网页</el-checkbox>
              <el-checkbox label="PC">PC网页</el-checkbox> -->
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="可免单的商品ID:" prop="item_id">
            <el-input v-model.number="addCoupon.item_id" placeholder="可免单的商品ID"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="10">
          <p class="tips">无门槛可不填，满足优惠金额即可使用</p>
        </el-col> -->
      </el-row>
      <div class="all">
        <el-row>
          <el-col :span="24">
            <div class="pl20">
              <table-view ref="goodsTable" :loading="loading" :columns="columns" :pageList="goodsList"></table-view>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="可免单的商品别名:" prop="alias">
            <el-input v-model.number="addCoupon.alias" placeholder="可免单的商品别名" maxlength="10"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <p class="tips">为避免显示不全，请控制在十字以内</p>
        </el-col>
      </el-row>
    </div>
    
    <div class="time">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="发放开始时间：" prop="obtain_start_time">
            <el-date-picker 
              v-model="addCoupon.obtain_start_time" 
              type="datetime" 
              format="yyyy-MM-dd HH:mm:ss" 
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="发放开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="发放结束时间：" prop="obtain_end_time">
            <el-date-picker 
              v-model="addCoupon.obtain_end_time" 
              type="datetime" 
              format="yyyy-MM-dd HH:mm:ss" 
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="发放结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="使用有效期" prop="expiry_date">
            <el-input v-model.number="addCoupon.expiry_date" placeholder="使用有效期"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <p class="tips">天      将自动顺延为有效期当天23点59分59秒失效</p>
        </el-col>
      </el-row>
    </div>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="commitCoupon">提交</el-button>
      <el-button @click="backList">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import TableView from '@/components/TableView'
  import exempt from '@/api/activity/exempt'
  export default {
    data() {
      const isNum = (rule, value, callback) => {
        if (!value) {
          callback(new Error('可免单的商品ID'));
        } else {
          if (Number.isInteger(value)) {
            if (value >= 1 && value <= 999999999) {
              this.goodsList = []
              this.addGoodsById(value)
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
      const necNumNight = (rule, value, callback) => {
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
      return {
        isNotAdd: false, //是新加还是编辑
        loading: false,
        checkAll: false,
        platform : [{label:'WX',name:'微信'},{label:'APP',name:'APP'},{label:'WAP',name:'移动端网页'},{label:'PC',name:'PC网页'}],
        goodsList: [],
        commitData: {},
        addCoupon: {
          coupon_name: "",
          item_id: "",
          send_quantity: "",
          user_obtain_limit: "",
          applicable_platform: [],
          item_ids: "",
          obtain_start_time: "",
          obtain_end_time: ""
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
            label: '市场价',
            field: 'market_price',
            align: 'center'
          },
          {
            label: '标准售价',
            field: 'sell_price',
            align: 'center'
          },
          // {
          //   label: '操作',
          //   align: 'center',
          //   actions: [{
          //     label: '删除',
          //     type: 'primary',
          //     size: 'mini',
          //     click: (index, row) => {
          //       this.deleteGoods(row.id);
          //     }
          //   }]
          // }
        ],
        addRules: {
          coupon_name: [{
              required: true,
              message: '请输入1~20个字符',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 20,
              message: '请输入1~20个字符',
              trigger: 'blur'
            }
          ],
          send_quantity: [{
            required: true,
            validator: necNumNight,
            trigger: 'blur'
          }],
          user_obtain_limit: [{
            required: true,
            validator: necNum,
            trigger: 'blur'
          }],
          applicable_platform: [{
            required: true,
            message: "请选择适用平台",
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
          item_id: [{
            validator: isNum,
            trigger: 'blur'
          }],
          alias : [{
            required: true,
            message: "可免单的商品别名",
            trigger: 'change'
          }],
          expiry_date :[{
            required: true,
            message: "使用有效期",
            trigger: 'change'
          }],
        }
      }
    },
    methods: {
      // 全选
       handleCheckAllChange(val) {
        this.addCoupon.applicable_platform = val ? ['WX','APP','WAP','PC'] : [];
      },
      handleCheckedPlatformChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.platform.length;
      },
      // 添加优惠券适用商品
      addGoodsById(ids) {
        if (ids) {
          let that = this;
          exempt.importItemsById({
            item_id: ids
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (res.code == 0) {
              let _data = []
                _data.push(result)
              that.goodsFilter(_data);
            }else{
              errMsg += "<p>" + res.message + "</p>"
            }
            // if (result.inValidItems.length != 0) {
            //   for (let i = 0; i < result.inValidItems.length; i++) {
            //     errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
            //   }
            // }
            // if (result.unsatisfiedItems.length != 0) {
            //   for (let i = 0; i < result.unsatisfiedItems.length; i++) {
            //     errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
            //   }
            // }
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
      // 添加过滤已经存在的商品
      goodsFilter(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsList.length != 0) {
            for (let j = 0; j < this.goodsList.length; j++) {
              if (!flag) {
                if (items[i].id == this.goodsList[j].id) {
                  flag = true;
                }
              }
            }
          }
          if (!flag) {
            this.goodsList.push(items[i]);
          }
        }
      },
      // 获取免单券详情
      getEditcoupon(id) {
        let that = this;
        exempt.getCoupon({
          coupon_id: id
        }).then((res) => {
          that.addCoupon = res.data;
          that.addCoupon.coupon_id = id
          that.addCoupon.coupon_name = that.addCoupon.name
          if (that.addCoupon.applicable_platform.indexOf('ALL') != -1) {
            that.addCoupon.applicable_platform = ['WX','APP','WAP','PC']
            that.checkAll = true
          }else{
            that.addCoupon.applicable_platform = that.addCoupon.applicable_platform.split(",");
            let _index = that.addCoupon.applicable_platform.indexOf('XCX')
            if (_index != -1) {
              that.addCoupon.applicable_platform.splice(_index,1)
            }
          }
          
          // if (that.addCoupon.applicable_platform.length === 4) {
          //   that.checkAll = true
          // }
          
          let _item = []
          _item.push(res.data.item)
          that.goodsList = _item;
        });
      },
      // 提交添加商品
      commitCoupon() {
        let ids = [];
        this.goodsList.forEach(function (item) {
          ids.push(item.id);
        })
        this.addCoupon.item_ids = ids.toString();
        this.commitData = { ...this.addCoupon};

        if (this.commitData.item_id == "") {
          this.commitData.item_id = 0;
        }
        if (this.addCoupon.item_ids == "") {
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: "请选择优惠券商品～",
            type: 'warning'
          });
        } else {
          let that = this;
          this.$refs.addCoupon.validate((valid) => {
            if (valid) {
              let _postdata = JSON.parse(JSON.stringify(that.commitData ))
              if (_postdata.applicable_platform.length == 4) {
                _postdata.applicable_platform = ['ALL']
              }
              exempt.createCoupon(_postdata , this.isNotAdd).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: "优惠券添加成功",
                    type: 'success'
                  });
                  this.$router.push({
                    name: "exempt"
                  })
                } else {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: res.message,
                    type: 'warning'
                  });
                }
              })
            } else {
              return false;
            }
          });
        }
      },
      // 返回列表页
      backList() {
        this.$router.push({
          name: "exempt"
        })
      },
    },
    components: {
      TableView
    },
    created () {
        if (this.$route.name === "editexempt") {
          this.isNotAdd = true
          this.addCoupon.coupon_id = this.$route.query.id;
          this.getEditcoupon(this.addCoupon.coupon_id);
        }
    }
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
    padding: 0 20px 20px 20px;
  }

  .el-col-10 .tips {
    margin-top: 12px;
    margin-bottom: 10px;
    margin-left: 20px;
    color: #ccc;
    font-size: 14px;
  }

  .addexempt_checkboxgroup{
    display: inline-block;
    margin-left: 15px;
  }

</style>
