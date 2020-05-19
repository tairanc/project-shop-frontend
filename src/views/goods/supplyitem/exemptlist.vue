<template>
  <div class="exemptlist">
    <el-form ref="pageInfo" :model="pageInfo" label-width="100px" :inline="true" :rules="rules">
        <el-form-item  label="供应商：" prop="supplier_code">
          <el-select v-model="pageInfo.supplier_code" placeholder="" size="small">
            <el-option
              v-for="item in supplier_code_options"
              :key="item.supplier_name"
              :label="item.supplier_name"
              :value="item.supplier_code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：">
            <el-input v-model="pageInfo.item_name" size="small" ></el-input>
        </el-form-item>
        <el-form-item label="品牌名称:">
            <el-input v-model="pageInfo.brand" size="small"></el-input>
        </el-form-item>
        <el-form-item label="sku映射：">
          <el-select v-model="pageInfo.is_mapped"  size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small">确定</el-button>
          <el-button @click="resetForm('pageInfo')" size="small">重置</el-button>
        </el-form-item>
    </el-form>
     <el-button size="small" @click="showDiaBtn" :disabled="canOneKeySent.length < 1" >一键发布（代发）</el-button>
    <el-tabs>
      <table-view :loading="loading" :selection="true" @select-change='handleSelectChange' :columns="columns" :pageList="list"></table-view>
      <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
    </el-tabs>
    <el-dialog  :visible.sync="outerVisible">
      <el-dialog 
        title="选择类目" 
        width="30%"
        :visible="categoryDialog.isVisable" 
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        append-to-body
        >
        
        <el-form :model="categoryDialog.form" size="medium">
          <el-form-item label="选择类目：" >
            <el-cascader
              class="categoryDialog"
              ref="categoryListExemp"
              v-model="categoryDialog.form.list"
              :options="bindCategoryList"
              placeholder="选择或搜索类目"
              filterable
              @change="categoryChange"
            ></el-cascader>
          </el-form-item>
        </el-form>
          
        <div slot="footer" class="dialog-footer">
          <el-button @click="getInitClick('hid')">取 消</el-button>
          <el-button type="primary" @click="getInitClick('sure')">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        width="30%"
        title="选择品牌"
        :visible.sync="showBrand"
        append-to-body>

        <el-autocomplete
            class="inline-input"
            v-model="searchsupplier"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        <div slot="footer" class="dialog-footer">
          <el-button @click="changeSupplyDialogBtn('hid')" size="small">取 消</el-button>
          <el-button type="primary" @click="changeSupplyDialogBtn('sure')" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <el-row class="line-margin">
        <el-col :span="24">
          <div class="grid-content" v-for="(item,index) in supplier_code_options" :key="index" v-show="item.supplier_code == pageInfo.supplier_code">
            供应商：{{item.supplier_name}}
          </div>
        </el-col>
      </el-row>
      <el-row class="line-margin">
        <el-col :span="24">
          <div class="grid-content">
              <span>分类：{{categoryDialog.list_text}}</span>
              <el-button type="primary" @click="showDiaBtnCategory" size="small">分类</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="line-margin">
        <el-col :span="24">
          <div class="grid-content">
              <span>品牌：{{searchsupplier}}</span>
              <el-button type="primary" @click="showDiaBtnBrand" size="small" :disabled="categoryDialog.form.list.length < 1">品牌</el-button>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="outerVisibleBtn" :disabled="this.supplierselect == null">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import goods from '@/api/goods'
  import supply from '@/api/supplyitem'
  

  export default {
    data() {
      return {
        loading: false,
        userIds: "",
        list: [],
        total: 0,
        supplier_code_options : [] ,
        is_mapped_options: [],
        outerVisible: false,
        showBrand : false,
        brand_list: [],           //品牌列表
        supplierselect  : null,   //选中筛选
        searchsupplier : '',            //选中品牌
        canOneKeySent:[],     //一件代发能否使用
        categoryDialog: {
          isVisable: false,    //选择类目
          form: {
            list: [],
            item: '',
          },
          list_text: ''
        },
        pageInfo: {
          is_mapped : '' ,    //是否映射
          supplier_name : '', //商品名称
          brand: '',          //品牌名
          supplier_code: '', //供应商
          page: 1,
          page_size: 20,
          supplier_type : 'external',
        },
        columns: [{
            label: '是否已映射',
            field: 'is_mapped',
            align: 'center',
            tags: [{
              index: false,
              name: "否",
              type: "danger"
            }, {
              index: true,
              name: "是",
              type: "success"
            }]
          },
          {
            label: '商品货号',
            field: 'art_no',
            align: 'center'
          },
          {
            label: '供应商名称',
            field: 'supplier_name',
            align: 'center'
          },
          {
            label: '商品名称',
            field: 'item_name',
            align: 'center'
          },
          {
            label: 'SkuID',
            field: 'sku_code',
            align: 'center'
          },
          {
            label: '商品状态',
            field: 'status',
            align: 'center',
            tags: [{
              index: 'shelved',
              name: "上架",
              type: "success"
            }, {
              index: 'stock',
              name: "下架",
              type: "danger"
            }]
          },
          {
            label: 'Sku属性',
            field: 'properties',
            align: 'center'
          },
          {
            label: '贸易类型',
            field: 'trade_type',
            align: 'center'
          },{
            label: '商品分类',
            field: 'category',
            align: 'center'
          },
          {
            label: '品牌名称',
            field: 'brand',
            align: 'center'
          },
          {
            label: '供货价',
            field: 'cost_price',
            align: 'center'
          },
          {
            label: '供应商售价',
            field: 'supplier_price',
            align: 'center'
          },{
            label: '市场参考价',
            field: 'market_price',
            align: 'center'
          },
          {
            label: '库存',
            field: 'stock',
            align: 'center'
          },
        ],
        rules: {
          supplier_code:{required: true, message: '请选择供应商！', trigger: 'change'}
        }
      }
    },
    methods: {
      ...mapActions([
        'getBindCategoryList'
      ]),
      // 获取优惠券列表
      getDataList(params) {
        supply.getUserCouponList(params).then((res) => {
          if (res.code == 0) {
            this.list = res.data.skus;
            this.total = res.data.total;
          }
        });
      },
      handleSelectChange(val){
        this.canOneKeySent = val
      },
      showDiaBtn(){
        this.outerVisible = true
        this.getBindCategoryList()
      },
      showDiaBtnCategory(){
        this.categoryDialog.isVisable = true
      },
      showDiaBtnBrand(){
        this.showBrand = true
      },
      outerVisibleBtn(){
        this.outerVisible = false //用户效果 先隐藏
        let category_id = this.categoryDialog.form.item
        let _successNum = 0
        let _falseNum = 0
        this.canOneKeySent.map((item,index)=>{
          let _data = {
            category_id : category_id,
            brand_id : this.supplierselect.id,
            sku_code : item.sku_code
          }
          supply.publishExternal(_data).then((res)=>{
            if (res.code == 0) {
              if (Array.isArray(res.data)) {
                _successNum = _successNum + 1
              }else{
                _falseNum = _falseNum + 1
              }
              if (this.canOneKeySent.length == _successNum + _falseNum) {
                this.$message({
                  message: '成功'+_successNum+'条，失败'+_falseNum+'条',
                  type: 'success'
                });
                this.getDataList(this.pageInfo);
              }
            }
          })
        })
        let _form = {
          list: [],
          item: '',
        }
        this.categoryDialog.form = _form
        this.categoryDialog.list_text = ''
        this.searchsupplier = ''
      },
      getInitClick(type){
        let that = this
        switch (type) {
          case 'sure':
             that.categoryDialog.list_text = that.$refs.categoryListExemp.$el.innerText
             let category_id = that.categoryDialog.form.item
              if (category_id == "" || that.categoryDialog.form.list.length < 3) {
                return
              }
              let _data = {
                category_id: category_id,
                level : that.categoryDialog.form.list.length
              }
              goods.setBrandList(_data).then((res)=>{
                  if (res.code === 0) {
                    let _resdata = []
                    _resdata = Object.values(res.data) //对象转数组
                    _resdata.map((item,index)=>{
                      item.value = item.name
                    })
                    that.brand_list = _resdata
                  }
              })
            break;
          case 'hid':
            
            break;
        
          default:
            break;
        }
        this.categoryDialog.isVisable = false
      },
      querySearch(queryString, cb) {
        var restaurants = this.brand_list || [];
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.supplierselect = item
      },
      changeSupplyDialogBtn(type){
        switch (type) {
          case 'hid':
            this.showBrand = false
            break;
          case 'sure':
            this.showBrand = false
            break;
        
          default:
            break;
        }
      },
      categoryChange(value){
        this.categoryDialog.form.item = value[value.length-1]
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getDataList(this.pageInfo);
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getDataList(this.pageInfo);
      },
      onSubmit() {
        if (this.pageInfo.supplier_code === '') {
          this.$message({
            message: '请选择供应商！',
            type: 'warning'
          });
        }else{
          this.getDataList(this.pageInfo);
        }
      },
      resetForm(){
        this.pageInfo = {
          is_mapped : '' ,    //是否映射
          supplier_name : '', //商品名称
          brand: '',          //品牌名
          supplier_code: '', //供应商
          page: 1,
          page_size: 20,
          supplier_type : 'external',
        }
      }
    },
    components: {
      TableView,
      PaginationView
    },
    computed: {
    ...mapGetters([
        'bindCategoryList'
      ])
    },
    created () {
      // 初始化一件代发
      let _data = {
        page : 1 ,
        page_size: 50
      }
      supply.initExternal(_data).then((res) => {
        if (res.code === 0) {
          this.supplier_code_options = res.data.supplier_list.suppliers
        }
      })
    }
  }

</script>

<style lang='scss' scoped>
  .exemptlist {
    padding: 10px;
    .line-margin{
      margin-bottom: 10px;
    }
  }

</style>
