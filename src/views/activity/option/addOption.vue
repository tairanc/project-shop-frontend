<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px">
    <div class="basic">
      <el-form-item label="活动名称:" prop="promotion_name">
        <el-input v-model="addCoupon.promotion_name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="金额:" prop="amount">
        <el-input v-model="addCoupon.amount" placeholder="仅限输入正整数"></el-input> 元
      </el-form-item>
      <el-form-item label="任选:" prop="quantity">
        <el-input v-model="addCoupon.quantity" placeholder="仅限输入正整数"></el-input> 件
      </el-form-item>
      <el-form-item label="活动开始时间:" prop="start_time">
        <el-date-picker v-model="addCoupon.start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间:" prop="end_time">
        <el-date-picker v-model="addCoupon.end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动结束时间">
        </el-date-picker>
      </el-form-item>
    </div>
    <div class="goods">
      <el-row>
        <el-col class="title">
          <p>选择适用商品</p>
        </el-col>
      </el-row>
      <el-row class="pl20">
        <p class="btn">
          <el-button type="danger" @click="selectVisible=true">选择商品</el-button>
          <el-button type="danger" @click="addItemBomb">批量导入商品</el-button>
        </p>
        <el-table class="table" :data="goodsList" border align="center" :span-method="spanMethod" >
          <el-table-column align="center" label="商品ID" prop="item_id">
          </el-table-column>
          <el-table-column align="center" label="商品编号" prop="art_no">
          </el-table-column>
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="属性" prop="spec_text">
          </el-table-column>
          <el-table-column align="center" label="市场价（元）" prop="market_price">
          </el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price">
          </el-table-column>
          <el-table-column align="center" label="可售库存" prop="store">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :promotionType="type" :selectVisible="selectVisible" :selectList="selectList" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import SelectGoods from '@/components/SelectGoods'
  import ticket from '@/api/activity/ticket'
  import option from '@/api/activity/option'
  import { spanArr } from '@/utils/spanArr'

  const isInt = /^[1-9]+\d*$/

  export default {
    data() {
      const validateStartTime = (rule, value, callback) => {
        if(!value) {
          callback(new Error('请选择活动开始时间'))
        }else {
          this.$refs.addCoupon.validateField('end_time')
          callback()
        }
      }

      const validateEndTime = (rule, value, callback) => {
        if(!value) {
          callback(new Error('请选择活动结束时间'))
        }else {
          if(value < this.addCoupon.start_time) {
            callback(new Error('活动结束时间需要大于活动开始时间'))
          }else {
            callback()
          }
        }
      }
      
      const validateIntNum = (rule, value, callback) => {
        if(!value) {
          callback(new Error('请填写必填项'))
        }else {
          if(!isInt.test(value)) {
            callback(new Error('请输入正整数'))
          }else {
            callback()
          }
        }
      }

      return {
        type: 'OptionBuy',
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        goodsList: [],
        commitData: {},
        addCoupon: {
          promotion_name: "",
          start_time: "",
          end_time: "",
          items: [],
          amount: '',
          quantity: ''
        },
        addRules: {
          promotion_name: [
            { required: true, message: '请输入1~60个字符', trigger: 'blur' },
            { min: 1, max: 60, message: '请输入1~60个字符', trigger: 'blur'}
          ],
          amount: [
            { validator: validateIntNum, trigger: 'blur' }
          ],
          quantity: [
            { validator: validateIntNum, trigger: 'blur' }
          ],
          start_time: [
            { validator: validateStartTime, trigger: 'blur' }
          ],
          end_time: [
            { validator: validateEndTime, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      selectList(){
        let list = []
        this.goodsList.map((item)=> {
          (list.indexOf(item.item_id) == -1) && list.push(item.item_id)
        })
        return list
      },
      spanArr(){
        return spanArr(this.goodsList)
      }
    },
    methods: {
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 添加优惠券适用商品
      addGoodsById() {;
        if (this.goodsIds) {
          ticket.importItemsById({
            item_id: this.goodsIds,
            promotion_type: 'OptionBuy',
            return_by: 'sku'
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
        this.goodsIds = "";
        this.addVisibleid = false;
      },
      // 添加过滤已经存在的商品
      goodsFilter(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsList.length != 0) {
            for (let j = 0; j < this.goodsList.length; j++) {
              (items[i].id == this.goodsList[j].id) && (flag = true)
            }
          }
          if (!flag) {
            this.goodsList.push(items[i])
          }
        }

        let list = []
        items.map((item) => {
          list.push(item.item_id)
        })

        for(let n = 0; n < this.goodsList.length;n++){
          if(list.indexOf(this.goodsList[n].item_id) == -1){
            this.goodsList.splice(n,1)
            n --
          }
        }
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
        ticket.importItemsById({
          item_id: val,
          promotion_type: 'OptionBuy',
          return_by: 'sku'
        }).then((res) => {
          const result = res.data;
          let errMsg = "";
          if (result.itemList.length != 0) {
            this.goodsFilter(result.itemList)
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
      },
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 7) {
          if (this.spanArr[rowIndex] == 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          } else if(this.spanArr[rowIndex] == 0){
            return {
              rowspan: 1,
              colspan: 1
            }
          }else {
            return {
              rowspan: this.spanArr[rowIndex],
              colspan: 1
            }
          }
        }
      },
      //删除商品
      handleDelete(row){
        this.goodsList =this.goodsList.filter((item)=>{
          return item.item_id != row.item_id
        })
      },
      // 提交添加商品
      handleSubmit(){
        this.$refs.addCoupon.validate((valid) => {
          if (valid) {
            let items = []
            this.goodsList.map((item)=>{
              items.push({
                item_id: item.item_id,
                sku_id: item.id
              })
            })
            this.addCoupon.items = JSON.stringify(items)
            option.createOptionBuy(this.addCoupon).then((res)=>{
              if(res.code==0){
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({name: 'option'})
              }
            })
          }
        })
      },
      //取消
      handleCancel(){
        this.$router.push({name: 'option'})
      }
    },
    components: {
      SelectGoods
    }
  }

</script>

<style lang='scss' scoped>
  .basic{
    margin: 20px;
    padding: 20px;
    padding-bottom: 0px;
    border: 1px solid #ddd;
    border-radius: 4px;
    .el-input{
      width: 200px;
    }
  }
  .goods{
    margin: 20px;
    padding-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  .title {
    margin-bottom: 20px;
    padding-left: 20px;
    background-color: #f5f5f5;
  }
  .pl20 {
    padding: 0 20px;
    .btn{
      margin-bottom: 20px;
    }
    .goods_url{
      cursor: pointer;
      &:hover{
        color: #409EFF
      }
    }
  }

</style>
