<template>
  <div class="detail">
    <div class="content">
      <span  v-show="message.refuse_reason" class="reason">审核驳回原因：{{message.refuse_reason}}</span>
      <h3>活动信息</h3>
      <el-row>
        <el-col>
          <p>活动名称： {{message.name}}</p>
        </el-col>
        <el-col>
          <p>活动标签： {{message.type}}</p>
        </el-col>
        <el-col>
          <p>每人每件限购： {{message.user_buy_limit}}件</p>
        </el-col>
        <el-col>
          <p>店铺商品限量： {{message.shop_apply_limit}}件</p>
        </el-col>
        <el-col>
          <p>商品折扣范围： {{message.discount_min}}%~{{message.discount_max}}%</p>
        </el-col>
        <el-col>
          <p>店铺类型： {{message.used_shop_type}}</p>
        </el-col>
        <el-col>
          <p>适用分类： {{message.used_category}}</p>
        </el-col>
        <el-col>
          <p>活动创建时间： {{message.created_at}}</p>
        </el-col>
        <el-col>
          <p>活动发布时间： {{message.release_time}}</p>
        </el-col>
        <el-col>
          <p>活动开始时间： {{message.start_time}}</p>
        </el-col>
        <el-col>
          <p>活动结束时间： {{message.end_time}}</p>
        </el-col>
        <el-col>
          <p>报名开始时间： {{message.apply_start_time}}</p>
        </el-col>
        <el-col>
          <p>报名结束时间： {{message.apply_end_time}}</p>
        </el-col>
        <div v-if="message.special_flash_sale_title">
          <el-col>
            <p class="pic">专场广告图：<img :src="message.special_flash_sale_image" width="500"></p>
          </el-col>
          <el-col>
            <p>专场主标题：{{message.special_flash_sale_title}}</p>
          </el-col>
          <el-col>
            <p>专场副标题：{{message.special_flash_sale_subtitle}}</p>
          </el-col>
        </div>
      </el-row>
      <p>
        <el-button type="primary" @click="selectVisible=true">选择商品</el-button>
        <el-button @click="addItemBomb">批量导入商品</el-button>
      </p>
      <el-table class="table" :data="goodsList" border align="center" :span-method="spanMethod" >
        <el-table-column align="center" label="商品ID" prop="item_id">
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
        <el-table-column align="center" label="活动价（元）" >
          <template slot-scope="scope">
            <span v-show="!scope.row.edit">{{scope.row.promotion_price}}</span>
            <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.promotion_price"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="可售库存" prop="store">
        </el-table-column>
        <el-table-column align="center" label="活动库存" prop="promotion_store">
          <template slot-scope="scope">
            <span v-show="!scope.row.edit">{{scope.row.promotion_store}}</span>
            <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.promotion_store"></el-input>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态" prop="verify_status">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
            <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-col :offset="10">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </el-col>
    </div>

    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods :promotionType="type" :promotionId="(flash_sale_id).toString()" :selectList="selectList" :selectVisible="selectVisible" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>
  </div>
</template>
<script>
  import SelectGoods from '@/components/SelectGoods'
  import sale from '@/api/activity/sale'
  import ticket from '@/api/activity/ticket'
  import { spanArr } from '@/utils/spanArr'


  export default {
    data() {
      return {
        type: 'FlashSale',
        flash_sale_id: '',
        apply_id: '',
        message: {},
        addVisibleid: false,
        goodsIds: "",
        selectVisible: false,
        goodsList: []
      }
    },
    computed: {
      selectList(){
        let list = []
        this.goodsList && this.goodsList.map((item)=> {
          (list.indexOf(item.item_id) == -1) && list.push(item.item_id)
        })
        return list
      },
      spanArr(){
        return spanArr(this.goodsList)
      }
    },
    methods: {
      //获取特卖信息
      getFlashSaleDetail(params){
        sale.getFlashSaleDetail(params).then((res)=>{
          if(res.code == 0){
            this.message = res.data

            switch(this.message.type){
              case 'FlashSale': 
                  this.message.type = '单品特卖'
                  break
              case 'SpecialFlashSale': 
                  this.message.type = '专场特卖'
                  break
            }
          }
        })
      },
      // 获取商品列表
      getFlashSaleApplyList(params){
        sale.getFlashSaleApplyList(params).then((res)=>{
          if(res.code == 0){
            this.total = res.data.total_count
            this.goodsList = res.data.list
            this.goodsList && this.goodsList.map((item)=>{
              switch(item.verify_status){
                case 'pending': 
                    item.verify_status = '未审核'
                    break
                case 'agree': 
                    item.verify_status = '审核通过'
                    break
                case 'refuse': 
                    item.verify_status = '审核未通过'
                    break
              }
              this.$set(item,'edit',false)
            })
          }
        })
      },
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
            promotion_id: this.flash_sale_id,
            promotion_type: 'FlashSale',
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
          if(!flag) {
            this.goodsList.push(items[i])
            this.$set(items[i],'edit',false)
            this.$set(items[i],'promotion_price','')
            this.$set(items[i],'promotion_store','')
            this.$set(items[i],'verify_status','未审核')
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
            promotion_id: this.flash_sale_id,
            promotion_type: 'FlashSale',
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
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 8 || columnIndex === 9) {
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
        this.goodsList.map((item)=>{
          if(item.item_id == row.item_id){
            item.edit = true
          }
        })
      },
      //验证填写的活动价和库存
      handleCheck(row){
        const posNumber = /^(\d+)$|^(\d+\.\d+)$/
        const posInteger = /^(\d+)$/

        let flag = true

        this.goodsList.map((item)=>{
          if(item.item_id == row.item_id){
            item.promotion_price = parseFloat(item.promotion_price)
            item.promotion_store = parseInt(item.promotion_store)
            if(!posNumber.test(item.promotion_price) || item.promotion_price >= parseFloat(item.sell_price) || item.promotion_price==0){    
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: '仅限输入正数，保留两位小数，金额需小于标准售价',
                type: 'warning'
              })
              flag = false
            }else{
              item.promotion_price = parseFloat(item.promotion_price).toFixed(2)
            }

            if(!posInteger.test(item.promotion_store) || item.promotion_store > parseFloat(item.store) || item.promotion_store==0){
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: '仅限输入正整数，活动库存不得大于可售库存',
                type: 'warning'
              })
              flag = false
            }
          }
        })
        
        this.goodsList.map((item)=>{
          if(item.item_id == row.item_id){
            flag && (item.edit = false)
          }
        })
      },
      //删除商品
      handleDelete(row){
        this.goodsList =this.goodsList.filter((item)=>{
          return item.item_id != row.item_id
        })
      },
      //提交
      handleSubmit(){
        let items = []
        this.goodsList.map((item)=>{
          items.push({
            item_id: item.item_id,
            sku_id: item.id,
            price: item.promotion_price,
            store: item.promotion_store
          })
        })
        sale.applyFlashSale({
          flash_sale_id: this.flash_sale_id,
          apply_id: this.apply_id,
          items: JSON.stringify(items)
        }).then((res)=>{
          if(res.code==0){
            this.$message({
              showClose: true,
              message: '报名成功',
              type: 'success'
            })
            this.$router.push({name: 'applylist'})
          }
        })
      }
    },
    components: {
      SelectGoods
    },
    created() {
      this.flash_sale_id = this.$route.query.sale_id

      if(this.$route.query.apply_id != -1){
        this.apply_id = this.$route.query.apply_id
        this.getFlashSaleApplyList({
          apply_id: this.apply_id,
          page: 1,
          page_size: 20,
          no_limit: 'true'
        })
      }

      this.getFlashSaleDetail({
        flash_sale_id: this.flash_sale_id,
        apply_id: this.apply_id
      })
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    padding: 10px 20px;
    .reason{
      display: inline-block;
      padding: 8px 0;
      background: #f3f3f3;
    }
    .pic{
      display: inline-block;
      img{
        vertical-align: top
      }
    }
    .table{
      margin-bottom: 20px;
      .goods_url{
          cursor: pointer;
          &:hover{
            color: #409EFF
          }
        }
    }
  }
</style>
