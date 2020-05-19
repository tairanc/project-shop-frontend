<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px">
    <div class="basic">
      <el-form-item label="活动名称:" prop="promotion_name">
        <el-input v-model="addCoupon.promotion_name" placeholder="活动名称"></el-input>
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
    <div class="gifts">
      <el-row>
        <el-col class="title">
          <p>选择赠品</p>
        </el-col>
      </el-row>
      <el-row class="pl20">
        <p class="btn">
          <el-button type="danger" @click="selectVisibleGift=true">选择商品</el-button>
          <el-button type="danger" @click="addItemBombGift">批量导入商品</el-button>
        </p>
        <el-table class="table" :data="goodsListGift" border align="center" >
          <el-table-column align="center" label="商品ID" prop="item_id">
          </el-table-column>
          <el-table-column align="center" label="商品编号" prop="art_no">
          </el-table-column>
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="市场价（元）" prop="market_price">
          </el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price">
          </el-table-column>
          <el-table-column align="center" label="可售库存" prop="store">
          </el-table-column>
          <el-table-column align="center" label="赠送数量/件" >
            <template slot-scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.quantity}}</span>
              <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
              <el-button type="text" @click="handleDeleteGift(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </div>
    
    <!-- 主商品 -->
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById('goods')">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :promotionType="typeMain" :selectVisible="selectVisible" :selectList="selectList"@visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>

    <!-- 赠品 -->
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleidGift">
      <el-input type="textarea" :rows="6" v-model="goodsIdsGift" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleidGift=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById('gift')">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods  :subType="'gift'" :promotionType="type" :selectVisible="selectVisibleGift" :selectList="selectListGift" @visible-change="handleVisibleGift" @choose-submit="handleAddGift"></select-goods>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import SelectGoods from '@/components/SelectGoods'
  import ticket from '@/api/activity/ticket'
  import giftbuy from '@/api/activity/giftbuy'
  import { spanArr } from '@/utils/spanArr'


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

      return {
        typeMain: 'GiftBuy',
        type: 'gift',
        addVisibleid: false,
        selectVisible: false,
        addVisibleidGift: false,
        selectVisibleGift: false,
        goodsIds: "",
        goodsList: [],
        goodsIdsGift: "",
        goodsListGift: [],
        addCoupon: {
          promotion_name: "",
          start_time: "",
          end_time: "",
          items: [],
          arguments: {
            gifts: []
          }
        },
        addRules: {
          promotion_name: [
            { required: true, message: '请输入1~60个字符', trigger: 'blur' },
            { min: 1, max: 60, message: '请输入1~60个字符', trigger: 'blur'}
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
      selectListGift(){
        let list = []
        this.goodsListGift.map((item)=> {
          (list.indexOf(item.item_id) == -1) && list.push(item.item_id)
        })
        return list
      },
      spanArr(){
        return spanArr(this.goodsList)
      },
      spanArrGift(){
        return spanArr(this.goodsListGift)
      }
    },
    methods: {
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      addItemBombGift() {
        this.addVisibleidGift = true;
        this.goodsIdsGift = "";
      },
      // 添加优惠券适用商品
      addGoodsById(type) {
        let promotion_type_code = type=='goods'?'GiftBuy':'gift'
        
        if (this.goodsIds || this.goodsIdsGift) {
          ticket.importItemsById({
            item_id: this.goodsIds||this.goodsIdsGift,
            promotion_type: promotion_type_code,
            return_by: 'sku'
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              if(type == "goods"){
                this.goodsFilter(result.itemList)
              }else if(type == "gift"){  
                this.goodsFilterGift(result.itemList)
              }
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

        if(type == "goods"){
          this.goodsIds = "";
          this.addVisibleid = false;
        }else if(type == "gift"){
          this.goodsIdsGift = "";
          this.addVisibleidGift = false;
        }
        
      },
      // 添加过滤已经存在的商品
      goodsFilter(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsList.length != 0) {
            for (let j = 0; j < this.goodsList.length; j++) {
              (items[i].sku_id == this.goodsList[j].sku_id) && (flag = true)
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
      goodsFilterGift(items) {
        for (let i = 0; i < items.length; i++) {
          let flag = false;
          if (this.goodsListGift.length != 0) {
            for (let j = 0; j < this.goodsListGift.length; j++) {
              (items[i].sku_id == this.goodsListGift[j].sku_id) && (flag = true)
            }
          }
          if (!flag) {
            this.goodsListGift.push(items[i])
            this.$set(items[i],'edit',false)
            this.$set(items[i],'quantity',1)
          }
        }

        let listGift = []
        items.map((item) => {
          listGift.push(item.item_id)
        })

        for(let n = 0; n < this.goodsListGift.length;n++){
          if(listGift.indexOf(this.goodsListGift[n].item_id) == -1){
            this.goodsListGift.splice(n,1)
            n --
          }
        }
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      handleVisibleGift(val){
        this.selectVisibleGift = val;
      },
      //选择商品添加
      handleAdd(val){
        ticket.importItemsById({
          item_id: val,
          promotion_type: 'GiftBuy',
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
      handleAddGift(val){
        ticket.importItemsById({
          item_id: val,
          promotion_type: 'gift',
          return_by: 'sku'
        }).then((res) => {
          const result = res.data;
          let errMsg = "";
          if (result.itemList.length != 0) {
            this.goodsFilterGift(result.itemList)
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
      //行编辑
      handleEdit(row){
        this.goodsListGift.map((item)=>{
          if(item.id == row.id){
            item.edit = true
          }
        })
      },
      //验证赠送数量
      handleCheck(row){
        const posInteger = /^(\d+)$/

        if(!posInteger.test(row.quantity) || parseInt(row.quantity)>row.store || row.quantity==0){
          this.$message({
            showClose: true,
            message: '仅限输入正整数，活动库存不得大于可售库存',
            type: 'warning'
          })
        }else{
          row.edit = false
        }
      },
      //删除商品
      handleDelete(row){
        this.goodsList =this.goodsList.filter((item)=>{
          return item.item_id != row.item_id
        })
      },
      handleDeleteGift(row){
        this.goodsListGift =this.goodsListGift.filter((item)=>{
          return item.sku_id != row.sku_id
        })
      },
      // 提交添加商品
      handleSubmit(){
        this.$refs.addCoupon.validate((valid) => {
          if (valid) {
            let items = []
            let argumentsList = []

            this.goodsList.map((item)=>{
              items.push({
                item_id: item.item_id,
                sku_id: item.id,
                price: item.promotion_price
              })
            })

            this.goodsListGift.map((item)=>{
              argumentsList.push({
                item_id: item.item_id,
                sku_id: item.id,
                quantity: item.quantity
              })
            })

            this.addCoupon.items = JSON.stringify(items)
            this.addCoupon.arguments.gifts = argumentsList
            this.addCoupon.arguments = JSON.stringify(this.addCoupon.arguments)

            giftbuy.createGiftBuy(this.addCoupon).then((res)=>{
              if(res.code==0){
                this.$message({
                  showClose: true,
                  message: '创建成功',
                  type: 'success'
                })
                this.$router.push({name: 'giftbuy'})
              }
            })

            this.addCoupon.arguments = JSON.parse(this.addCoupon.arguments)            
          }
        })
      },
      //取消
      handleCancel(){
        this.$router.push({name: 'giftbuy'})
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
  .goods,.gifts{
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
