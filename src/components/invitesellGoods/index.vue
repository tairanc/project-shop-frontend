<template>
  <el-dialog class="dialog" width="90%" title="选择商品" :visible="selectVisible" :show-close="false">
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
        <el-select v-model="selectForm.brand_id" placeholder="品牌">
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
        <div class='left'>
            <div  v-show="goods.length" class="goods">
                
                <div class="item" :class="good.selected?'active':''" v-for="good in goods" :key="good.id" @click="handleSelect(good)">
                    <div class='shadow' v-if="good.is_special">推广中</div>
                <div class="thumb">
                    
                    <img :src="good.primary_image+'_t.jpg'">
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
        <div class='right'>
            <p><span>已选中商品</span><span class='span02'>{{item_num}}/30</span></p>
            <ul>
                <li v-for="goods in goodList" :key="goods.id">
                    <span>
                        <img :src="goods.primary_image+'_t.jpg'">
                    </span>
                    <el-input type="text" v-model="goods.rate" style="dispaly:inline-block;width:80px;vertical-align: top;" /><span style="vertical-align: top">%</span>
                    <div class='title'>
                      ({{goods.title}})
                      {{goods.rate}}
                    </div>
                    <!-- <a @click="delGood(goods.id)" style="vertical-align: top;">
                        x
                    </a> -->
                </li>
            </ul>
            <el-input v-model="all_rate" style="width:100px;dispaly:inline-block"></el-input>%
            <el-button style="margin-left:65px" type="primary" @click="batchClick">批量设置</el-button>
        </div>
    </div>


    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ticket from '@/api/activity/ticket'
import inviteSell from '@/api/activity/inviteSell'
export default {
  data() {
    return {
      goodsVisible: false,
      total: 0,
      item_num:0,
      all_rate:'',
      goodList:[],
      image_domain: "",
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
        sale_type:"",
        page: 1,
        page_size: 14
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
    saleType:{
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
    selectList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    selectList: function () {
      this.goods.map((item)=>{
        let index = this.selectList.indexOf(item.id)
        if(index != -1){
          item.selected = true
        }
      })

      this.selectItems = this.selectList
      this.goodList=this.selectList
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
          this.image_domain = res.data.image_domain

          this.goods.map((item)=>{
            let index = this.selectItems.indexOf(item.id)
            if(index != -1){
              item.selected = true
            }
          })
        }
      })
    },
    //点击选中
    handleSelect(item){
      item.rate = item.rate ==0 ?  '0': item.rate
        if(item.is_special){
            return false
        }else{
        if(this.goodList.length <30){
            item.selected = !item.selected
            if(item.selected){
                this.selectItems.push(item.id)
                this.goodList.push(item)
                this.item_num = this.goodList.length
            }else{
                this.selectItems = this.selectItems.filter(function(option){
                return option != item.id;
                })
                this.goodList = this.goodList.filter(function(option){
                    let _data = option ? option.id != item.id :null
                    return _data
                })
                this.item_num = this.goodList.length
            }
        }else{
            item.selected = false
            this.selectItems = this.selectItems.filter(function(option){
                return option != item.id;
            })
            this.goodList = this.goodList.filter(function(option){
                let _data = option ? option.id != item.id :null
                return _data
            })
            this.item_num = this.goodList.length
        }
      }
    },
    //全选
    selectAll(){
      this.goods.map((item)=>{
        if(!item.is_special){
          item.selected = true
        }
        
        if(this.selectItems.indexOf(item.id) == -1 && !item.is_special){
          item.rate = item.rate ==0 ?  '0': item.rate
          this.selectItems.push(item.id)
          this.goodList.push(item)
        }
      })
      this.item_num = this.goodList.length
    },
    //行内删除
    // delGood(id){
    //     this.goodList =this.goodList.filter((item)=>{
    //         return item.id != id
    //         })
    //      this.selectItems = this.selectItems.filter(function(option){
    //         return option != id;
    //         })
    //     this.item_num = this.goodList.length    
    // },
    cancelAll(){
      this.goods.map((item)=>{
        item.selected = false
        this.selectItems = this.selectItems.filter(function(option){
          return option != item.id;
        })
        this.goodList = this.goodList.filter(function(option){
            let _data = option ? option.id != item.id :null
            return _data
        })
      })
      
      this.item_num = this.goodList.length
    },
    //批量设置比率
    batchClick(){
        let list = this.goodList;
        if(this.all_rate >0 && this.all_rate<100){
            let all_rate =(this.all_rate*1).toFixed(2)
            for(var i in list){ 
                list[i].rate = all_rate
            }
        }else{
            this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: '请请输入大于0小于100的比率',
                type: 'warning'
            });
        }
       
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
      this.goodList=[]
    },
     //新增主推商品
        addSpecial(data){
            inviteSell.addSpecial(data).then((res) =>{
                
            })
        },
    //确认添加
    handleSubmit(){
      if(this.selectItems.length){
        this.goodsVisible = false;
        this.$emit('visible-change', this.goodsVisible);
        this.$emit('choose-submit', this.selectItems);
        var items = [];
        for(var i in this.goodList){
            let data ={item_id:'',rates:{}}
            data.item_id =this.goodList[i].id
            data.rates={'1':this.goodList[i].rate}
            items.push(data)
        }
        this.addSpecial({rates:items})
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
    this.selectForm.sale_type=this.saleType
    this.selectForm.promotion_id = this.promotionId
    this.selectForm.sub_type = this.subType
    
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
    position: relative;
    .left{
        width: 70%;
    .goods{
      overflow: hidden;
      padding: 16px;
      padding-right: 0;
      border-radius: 10px;
      background: #efefef;
      height: 370px;
      .item{
        width: 13%;
        float: left;
        margin: 0 10px 10px 0;
        position: relative;
        background: #fff;
        border-radius: 5px;
        cursor: pointer;
        border: 2px solid #fff;
         .shadow{
                vertical-align: middle;
                width: 100%;
                height: 100%;
                border-radius: 5px;
                background: rgba(52, 52, 52, 0.5);
                position:absolute;
                top:0;
                left: 0;
                text-align: center;
                color: #ffffff;
                line-height: 8;
                z-index: 2
            }  
        .thumb{
          height: 130px;
          display: table-cell;
          vertical-align: middle;
          position: relative;
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
    }
    .pagination{
      float: right;
    }
    .right{
        position:absolute;
        right: 0;
        top:-33px;
        width: 28%;
        .span02{
          float:right  
        }
        ul{
            height: 370px;
            border: 1px solid #cccccc;
            border-radius: 5px;
            margin-bottom: 10px;
            padding: 10px;
            overflow: auto;
            li{
                height: 70px;
                margin:5px 0 10px 0;
                vertical-align: top;
                img{
                    width: 50px;
                    height: 50px;
                }
                .title{
                    text-align: center;
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 5px;
                    height: 30px;
                    vertical-align: top;
                    width: 150px;
                    display: inline-block;
                }
            }
        }    
    }
  }
  .mt30 {
    margin-top: 0;
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
