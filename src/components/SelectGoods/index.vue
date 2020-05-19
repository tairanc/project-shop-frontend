<template>
  <el-dialog class="dialog" width="70%" title="选择商品" :visible="selectVisible" :show-close="false">
    <el-form class="mt30" ref="selectForm" :inline="true" :model="selectForm" size="small">
      <el-form-item prop="warehouse_id">
        <el-select v-model="selectForm.warehouse_id" placeholder="仓库">
          <el-option v-for="warehouse in warehouses" :key="warehouse.id" :label="warehouse.name" :value="warehouse.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-cascader
          v-model="category"
          placeholder="分类"
          :options="categoryList"
          :show-all-levels="false"
          change-on-select
          @change="getBrandList"
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="brand_id">
        <el-select v-model="selectForm.brand_id" placeholder="品牌" filterable remote :remote-method="remoteMethod">
          <el-option v-for="brand in brandList" :key="brand.id" :label="brand.name" :value="brand.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="trade_type">
        <el-select v-model="selectForm.trade_type" placeholder="贸易类型">
          <el-option label="国内贸易" :value=10></el-option>
          <el-option label="海淘" :value=20></el-option>
          <el-option label="跨境保税" :value=30></el-option>
          <el-option label="跨境直邮" :value=40></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title">
        <el-input class="title" v-model="selectForm.title" placeholder="商品关键字"></el-input>
      </el-form-item>
      <el-form-item label="价格：" prop="min_price">
          <el-input v-model="selectForm.min_price"></el-input>
          —
          <el-input v-model="selectForm.max_price"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="getSelectItemList(selectForm)">搜索</el-button>
        <el-button type="primary" @click="selectAll">全选当前页</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="text" @click="cancelAll">清空当前页</el-button>
        <el-button type="text" @click="resetForm">清空筛选条件</el-button>
      </el-form-item>
    </el-form>
    <div class="content">
      <div  v-show="goods.length" class="goods">
        <div class="item" :class="good.selected?'active':''"  v-for="good in goods" :key="good.id" @click="handleSelect(good)">
          <div class="thumb">
            <img :src="good.primary_image">
          </div>
          <div class="title">{{good.title}}</div>
        </div>
      </div>
      <div v-show="!goods.length" class="goods">
        <div class="no-goods">暂无数据</div>
      </div>
      <el-pagination v-show="goods.length" class="pagination"
        @current-change="pageChange"
        :current-page="selectForm.page"
        :page-size="selectForm.page_size"
        layout="total, prev, pager, next, jumper"
        :total="total||0">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ticket from '@/api/activity/ticket'

export default {
  data() {
    return {
      goodsVisible: false,
      total: 0,
      warehouses: [],
      categoryList: [],//分类选项
      category: [],//已选分类
      brandList: [],
      selectForm: {
        warehouse_id: "",
        brand_id: "",
        categories: {
          primary_id: "",
          secondary_id: "",
          tertiary_id: ""
        },
        title: "",
        trade_type: "",
        min_price: "",
        max_price: "",
        promotion_type: "",
        promotion_id: "",
        page: 1,
        page_size: 14,
        only_shelving: ""
      },
      goods: [],
      selectItems: []
    }
  },
  props: {
    selectVisible: {
      type: Boolean,
      default: false
    },
    promotionType: {
      type: String,
      default: ""
    },
    promotionId: {
      type: String,
      default: ""
    },
    subType: {
      type: String,
      default: "item"
    },
    onlyShelving: {
      type: String,
      default: ""
    },
    selectList: {
      type: Array,
      default: function () {
        return []
      }
    },
    specGoods:{
      type: Array,
      default: []
    },
    goodsinduring:{
      type: Array,
      default: []
    }
  },
  watch: {
    // 带出已选中的商品
    selectList: function () {
      this.goods.map((item)=>{
        let index = this.selectList.indexOf(item.id)
        if(index!=-1){
          item.selected = true
        }
      })
      this.selectItems = this.selectList
    },
    selectVisible: function () {
      if(this.selectVisible){
        this.selectForm.page = 1
        this.getSelectItemList(this.selectForm)
      }
    }
  },
  methods: {
    // page变化函数
    pageChange(val){
      this.selectForm.page = val;
      this.getSelectItemList(this.selectForm)
    },
    //清空筛选条件
    resetForm(){
      this.$refs.selectForm.resetFields()
      this.selectForm.max_price = ""
      this.category = []
    },
    // 获取仓库列表
    getWarehuoses() {
      ticket.getWarehouse({page: 1,page_size: -1}).then((res) => {
        if(res.code==0){
          this.warehouses = res.data.data;
        }
      })
    },
    // 获得店铺绑定的类目
    getCategories() {
      ticket.getCategory().then((res) => {
        if(res.code === 0){
          for(let i=0;i<res.data.length;i++){
            if(res.data[i].sub){
              res.data[i].children = res.data[i].sub
              let childLength = res.data[i].children.length
              for(let j=0;j<childLength;j++){
                if(res.data[i].children[j].sub){
                  res.data[i].children[j].children = res.data[i].children[j].sub
                }
              }
            }
          }
          this.categoryList = res.data
        }else{
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: res.message,
            type: 'warning'
          })
        }
      }).catch((err)=>{
        this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: err.message,
            type: 'error'
          })
      })
    },
    // 获取分类关联品牌列表
    getBrandList() {
      let length = this.category.length
      let brandInfo = {}
      this.selectForm.brand_id = ""
      
      switch(length){
        case 1:
            brandInfo = {category_id:this.category[0],level:1}
            break
        case 2:
            brandInfo = {category_id:this.category[1],level:2}
            break
        case 3:
            brandInfo = {category_id:this.category[2],level:3}
            break
      }
      ticket.getRelBrandListByCategoryId(brandInfo).then((res) => {
        if(res.code == 0){
          this.brandList = res.data
        }
      })
    },
    // 品牌搜索方法
    searchBrand(query){
      let length = this.category.length
      let brandInfo = {}
      this.selectForm.brand_id = ""
      
      switch(length){
        case 1:
            brandInfo = {category_id:this.category[0],level:1,brand_name:query}
            break
        case 2:
            brandInfo = {category_id:this.category[1],level:2,brand_name:query}
            break
        case 3:
            brandInfo = {category_id:this.category[2],level:3,brand_name:query}
            break
        default:
            brandInfo = {category_id:'',level:'',brand_name:query}
      }
      
      ticket.getRelBrandListByCategoryId(brandInfo).then((res) => {
        if(res.code == 0){
          this.brandList = res.data
        }
      })
    },
    // 分类搜索
    remoteMethod(query){
      this.searchBrand(query)
    },
    //获取商品列表
    getSelectItemList(params){
      this.selectForm.categories = {
        primary_id: "",
        secondary_id: "",
        tertiary_id: ""
      }

      switch(this.category.length){
        case 0: break
        case 1:
            this.selectForm.categories.primary_id = this.category[0]
            break
        case 2:
            this.selectForm.categories.secondary_id = this.category[1]
            break
        case 3:
            this.selectForm.categories.tertiary_id = this.category[2]
            break
      }

      this.selectForm.categories = JSON.stringify(this.selectForm.categories)

      ticket.getSelectItemList(params).then((res)=>{
        if(res.code == 0){
          this.goods = res.data.list
          this.total = res.data.total_count
          // 带出原来选中的商品
          this.goods.map((item)=>{
            let index = this.selectItems.indexOf(item.id)
            let _specindex = this.specGoods.indexOf(item.id)
            if (this.specGoods.length > 0) {
              if(_specindex != -1){
                item.selected = this.goodsinduring[_specindex].selected
              }else{
                if(index != -1){
                  item.selected = true
                }
              }
            }else{
              if(index != -1){
                item.selected = true
              }
            }
            
          })
        }
      })
    },
    //点击选中
    handleSelect(item){
      item.selected = !item.selected
      if(item.selected){
        if (this.selectItems.indexOf(item.id) == -1) {
          this.selectItems.push(item.id)
        }
      }else{
        this.selectItems = this.selectItems.filter(function(option){
          return option != item.id;
        })
      }
    },
    //全选
    selectAll(){
      this.goods.map((item)=>{
        item.selected = true
        if(this.selectItems.indexOf(item.id) == -1){
          this.selectItems.push(item.id)
        }
      })
    },
    cancelAll(){
      this.goods.map((item)=>{
        item.selected = false
        this.selectItems = this.selectItems.filter(function(option){
          return option != item.id;
        })
      })
    },
    // 关闭商品选择弹框
    handleCancel() {
      this.goodsVisible = false;
      this.$emit('visible-change', this.goodsVisible);

      this.goods.map((item)=>{
        let index = this.selectList.indexOf(item.id)
        if(index != -1){
          item.selected = true
        }
      })
      this.selectItems = this.selectList
      this.resetForm()
    },
    //确认添加
    handleSubmit(){
      if(this.selectItems.length){
        this.goodsVisible = false;
        this.$emit('visible-change', this.goodsVisible);
        
        if (this.specGoods.length > 0) {
          let _storegoodsinduring = JSON.parse(JSON.stringify(this.goodsinduring))
          this.goods.map((item)=>{
            let index = this.specGoods.indexOf(item.id)
            if(index != -1){
              _storegoodsinduring.map((items, indexs)=>{
                if (items.item_id == item.id) {
                  items.selected = item.selected
                }
              })
              // 处理 sku 级别数据
            }
          })
          _storegoodsinduring.map((item, index)=>{
            let _has = this.selectItems.indexOf(item.item_id)
            if (_has == -1) {
              this.selectItems.push(item.item_id)
            }
          })
          this.$emit('choose-spec',_storegoodsinduring)
        }
        this.$emit('choose-submit', this.selectItems);
        
      }else{
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: '请选择商品',
          type: 'warning'
        });
      }
    }
  },
  
  created() {
    this.goodsVisible = this.selectVisible;
    this.selectForm.promotion_type = this.promotionType
    this.selectForm.promotion_id = this.promotionId
    this.selectForm.sub_type = this.subType
    this.selectForm.only_shelving = this.onlyShelving

    
    this.getWarehuoses();
    this.getCategories()

    ticket.getRelBrandListByCategoryId().then((res) => {
        if(res.code == 0){
          this.brandList = res.data
        }
    })
  }
}

</script>

<style lang='scss' scoped>
.dialog{
  margin-top: -10vh;
  .content{
    overflow: hidden;
    .goods{
      overflow: hidden;
      padding: 16px;
      padding-right: 0;
      border-radius: 10px;
      background: #efefef;
      .item{
        width: 13.4%;
        float: left;
        margin: 0 10px 10px 0;
        background: #fff;
        border-radius: 5px;
        cursor: pointer;
        border: 2px solid #fff;
        .thumb{
          height: 130px;
          display: table-cell;
          vertical-align: middle;
          img{
            vertical-align: middle;
            max-width: 100%;
            max-height: 100%;
            border-radius: 5px;
          }
        }
        .title{
          text-align: center;
          cursor: pointer;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding: 5px;
          height: 30px;
        }
        &.active{
          border-color: #ff0000;
        }
      }
      .no-goods{
        text-align: center;
        background: #f5f5f5;
        margin-right: 16px;
        height: 30px;
        line-height: 30px;
        border-radius: 5px;
      }
    }
    .pagination{
      float: right;
    }
  }
  .mt30 {
    // margin-top: -30px;
    .el-select, .el-cascader {
      width: 160px;
    }
    .el-input{
      width: 100px;
    }
    .title{
      width: 200px;
    }
  }
  .dialog-footer{
    text-align: center
  }
}
</style>
