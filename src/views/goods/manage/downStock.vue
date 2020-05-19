<template>
  <div class="onStock">
    <el-form :model="formOnStock.form" ref="formOnStock" :rules="formOnStock.rules" label-width="100px" size="medium">
      <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="商品名称：" prop="title">
              <el-input v-model="formOnStock.form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="商品货号：" prop="art_no">
              <el-input v-model="formOnStock.form.art_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="店铺分类：" prop="shop_category_id">
              <el-cascader
                :options="categoryList"
                @change="getCategoryId"
                v-model="formOnStock.form.shop_category_list">
              </el-cascader>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="供应链绑定：" prop="supply_bind_status">
            <el-select v-model="formOnStock.form.supply_bind_status">
              <el-option label="全部" value=""></el-option>
              <el-option label="是" value="30"></el-option>
              <el-option label="否" value="10"></el-option>
              <el-option label="部分" value="20"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7" :offset="1">
          <el-form-item label="销售价格：">
            <el-col :span="11">
              <el-form-item prop="min_price">
                <el-input v-model="formOnStock.form.min_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">到</el-col>
            <el-col :span="11">
              <el-form-item prop="max_price">
                <el-input v-model="formOnStock.form.max_price"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="运费模板：" prop="logistics_template_id">
            <el-select v-model="formOnStock.form.logistics_template_id">
                <el-option 
                  v-for="item in deliveryTplUpList" 
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="条形码：" prop="bar_code">
            <el-input v-model="formOnStock.form.bar_code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="9">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="resetForm">清空条件</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btn-group" v-show="formOnStock.list.length">
      <el-button size="medium" :disabled="formOnStock.selectList.length?false:true" @click="deleteBtn">删除</el-button>
      <el-button size="medium" :disabled="formOnStock.selectList.length?false:true" @click="setShelfBtn">批量上架</el-button>
      <el-button size="medium" :disabled="formOnStock.selectList.length?false:true" @click="showCategory">调整商品分类</el-button>
      <el-button size="medium" :disabled="formOnStock.selectList.length?false:true" @click="showTemplate">调整运费模板</el-button>
      <el-button size="medium" @click="exportGoodTable">导出</el-button>
    </el-row>
    <div class="table">
      <table-view
        :tableName="formOnStock.name"
        :selection="true"
        :loading="formOnStock.loading"
        :columns="biz_mode==1?formOnStock.columns:formOnStock.columns_enter"
        :pageList="formOnStock.list"
        @select-change='handleSelectChange'
      >
      </table-view>
    </div>
    <pagination-view 
      v-show="formOnStock.list.length"
      :paginationName="formOnStock.name"
      :total="formOnStock.total"
      :currentPage="formOnStock.form.page"
      @size-change="handleSizeChange"
      @current-change="handleNumberChange"
    ></pagination-view>

    <table id='export-form'>
      <tr>
        <td>商品id</td>
        <td>商品货号</td>
        <td>商品名称</td>
        <td>品牌</td>
        <td>条形码</td>
        <td>库存</td>
        <td>SKU-ID</td>
        <td>规格</td>
        <td>售价</td>
        <td>一级类目</td>
        <td>二级类目</td>
        <td>三级类目</td>
        <td>贸易类型</td>
        <td>税率</td>
        <td>状态</td>
        <td>商品重量(kg)</td>
        <td>运费模板</td>
        <td>是否支持七天无理由</td>
      </tr>
      <tr v-for='(item,index) in exportList' :key ='index'>
        <td style="mso-number-format:'\@';">{{item.id}}</td>
        <td style="mso-number-format:'\@';">{{'('+item.art_no}}</td>
        <td style="mso-number-format:'\@';">{{'('+item.title}}</td>
        <td style="mso-number-format:'\@';">{{item.brand}}</td>
        <td style="mso-number-format:'\@';">{{'('+item.barcode}}</td>
        <td style="mso-number-format:'\@';">{{item.store}}</td>
        <td style="mso-number-format:'\@';">{{item.sku_id}}</td>
        <td style="mso-number-format:'\@';">{{item.spec_text}}</td>
        <td style="mso-number-format:'\@';">{{item.sell_price}}</td>
        <td style="mso-number-format:'\@';">{{item.category_primary}}</td>
        <td style="mso-number-format:'\@';">{{item.category_secondary}}</td>
        <td style="mso-number-format:'\@';">{{item.category_third}}</td>
        <td style="mso-number-format:'\@';">{{item.trade_type}}</td>
        <td style="mso-number-format:'\@';">{{item.tax_rate}}</td>
        <td style="mso-number-format:'\@';">{{item.status}}</td>
        <td style="mso-number-format:'\@';">{{item.weight}}</td>
        <td style="mso-number-format:'\@';">{{item.freight_template}}</td>
        <td style="mso-number-format:'\@';">{{item.free_refund}}</td>
      </tr>
    </table>

    <el-dialog 
      title="选择运费模板" 
      width="30%"
      :visible.sync="delivery.dialogVisible" 
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-col :offset="5">
          <el-form :model="delivery.form" size="medium">
            <el-form-item label="运费模板：" >
              <el-select v-model="delivery.form.freight_template_id">
                <el-option 
                  v-for="item in deliveryTplUpList" 
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelTempDialog">取 消</el-button>
        <el-button type="primary" @click="setTemplateBtn">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog 
      title="调整店铺分类" 
      width="30%"
      :visible.sync="category.dialogVisible" 
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-row>
        <el-col :offset="5">
          <el-form :model="category.form" size="medium">
            <el-form-item label="店铺分类：" >
              <el-cascader
                v-model="category.form.category_id"
                :options="categoryList"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCategoryDialog">取 消</el-button>
        <el-button type="primary" @click="setCategoryBtn">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import goods from '@/api/goods'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

const REG_NUMBER = /^\d+(\.{0,1}\d+){0,1}$/

export default {
  data () {
    var validateMinPrice = (rule, value, callback) => {
      if (value) {
        if (!REG_NUMBER.test(value)) {
          callback(new Error('最低价必须为数字'))
        } else {
          this.$refs.formOnStock.validateField('max_price');
          callback();
        }
      } else {
        callback()
      }
    }
    var validateMaxPrice = (rule, value, callback) => {
      if (value || value === 0) {
        if (!REG_NUMBER.test(value)) {
          callback(new Error('最高价必须为数字'))
        } else if (value < parseFloat(this.formOnStock.form.min_price)) {
          callback(new Error('最高价不得小于最低价'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    return {
      delivery: {
        form: {
          freight_template_id: ''
        },
        dialogVisible: false
      },
      category: {
        form: {
          category_id: []
        },
        dialogVisible: false
      },
      formOnStock: {
        name: 'formOnStock',
        loading: false,
        total: 0,
        form: {
          title: '',
          art_no: '',
          shop_category_id: '',
          shop_category_list: [],
          supply_bind_status: '',
          min_price: '',
          max_price: '',
          logistics_template_id: '',
          bar_code: '',
          status: 10,
          page: 1,
          page_size: 20
        },
        rules: {
          title: [
            { max: 60, message: '长度在 0 到 60 个字符', trigger: 'blur' }
          ],
          art_no: [
            { max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' }
          ],
          min_price: [
            { validator: validateMinPrice, trigger: 'blur' }
          ],
          max_price: [
            { validator: validateMaxPrice, trigger: 'blur' }
          ]
        },
        columns: [
          { label: '商品名称', desField:'1' },
          { label: '店铺分类', field: 'shop_category_name', align: 'center' },
          { label: '价格（元）', field: 'sell_price', align: 'center' },
          { label: '总库存', field: 'total_store', align: 'center' },
          { label: '运费模板', field: 'logistics_template_name', align: 'center' },
          { label: '供应链绑定', field: 'supply_bind_status', align: 'center' },
          { label: '发布时间', field: 'updated_at', align: 'center' },
          { label: '下架原因', field: 'stocked_comment', align: 'center' },
          { label: '操作', field: 'options', link: '/goods-manage/goods/edit', align: 'center' },
        ],
        columns_enter: [
          { label: '商品名称', desField:'1' },
          { label: '店铺分类', field: 'shop_category_name', align: 'center' },
          { label: '价格（元）', field: 'sell_price', align: 'center' },
          { label: '总库存', field: 'total_store', align: 'center' },
          { label: '运费模板', field: 'logistics_template_name', align: 'center' },
          { label: '供应链绑定', field: 'supply_bind_status', align: 'center' },
          { label: '发布时间', field: 'updated_at', align: 'center' },
          { label: '下架原因', field: 'stocked_comment', align: 'center' },
          { label: '未通过原因', field: 'audit_comment', align: 'center'},          
          { label: '操作', field: 'options', link: '/goods-manage/goods/edit', align: 'center' },
        ],
        list: [],
        selectList: []
      },
      exportList: [],
      biz_mode: 1
    }
  },
  computed: {
    ...mapGetters([
      'deliveryTplUpList',
      'categoryList'
    ]),
  },
  methods: {
     // 导出报表
    exportGoodTable() {
      goods.exportGoods(this.formOnStock.form).then((res)=>{
        res.data.map((item) => { 
          switch(item.trade_type){
            case 10 : item.trade_type='一般贸易'
            break;
            case 20 : item.trade_type ='海淘'
            break;
            case 30 : item.trade_type ='跨境保税'
            break;
            case 40 : item.trade_type ='海外直邮'
            break;
          }

          (!item.tax_rate) && (item.tax_rate = '')

          item.status = '仓库中'

          switch(item.free_refund){
            case 0 : item.free_refund='否'
            break;
            case 1 : item.free_refund ='是'
            break;
          }
        })
        this.exportList = res.data
        setTimeout(() => {
          let wb = XLSX.utils.table_to_book(document.querySelector('#export-form'))

          for(var i in wb.Sheets.Sheet1){
            if(wb.Sheets.Sheet1[i].t){
              if(String(wb.Sheets.Sheet1[i].v).substr(0, 1) =='(' && wb.Sheets.Sheet1[i] !=''){
                wb.Sheets.Sheet1[i].v = String(wb.Sheets.Sheet1[i].v).substr(1,wb.Sheets.Sheet1[i].v.length-1)
              }
              wb.Sheets.Sheet1[i].t ='s'
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
              FileSaver.saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '商品列表.xlsx');
          } catch (e) {
            if (typeof console !== 'undefined') {
              console.log(e, wbout)
            }
          }
          return wbout
        }, 1000)

        this.$message({
          showClose: true,
          message: "导出成功",
          type: 'success'
        }); 
      })
    },
    getCategoryId(value) {
      this.formOnStock.form.shop_category_id = value[value.length-1]
    },
    handleSelectChange (val) {
      let self = this
      self.formOnStock.selectList = []
      val.forEach(function (val) {
        self.formOnStock.selectList.push(val.id)
      })
    },
    handleSizeChange (val) {
      this.formOnStock.form.page_size = val
      this.getItemList(this.formOnStock.form)
    },
    handleNumberChange (val) {
      this.formOnStock.form.page = val
      this.getItemList(this.formOnStock.form)
    },
    search () {
      this.$refs.formOnStock.validate((valid) => {
        if (valid) {
          this.formOnStock.loading = true
          this.formOnStock.form.page = 1
          this.getItemList(this.formOnStock.form)
        }
      });
    },
    resetForm () {
      this.$refs.formOnStock.resetFields()
      this.formOnStock.form.shop_category_list = []
      
    },
    deleteBtn () {
      let params = {
        item_ids: this.formOnStock.selectList
      }

      this.$confirm('此操作将删除已选择的全部商品, 是否确定?', '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItemList(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    setShelfBtn (status) {
      let params = {
        item_ids: this.formOnStock.selectList,
        shelf_status: 30
      }

      this.$confirm(`此操作将上架已选择的全部商品, 是否确定?`, '提示', {
        closeOnClickModal: false,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.setShelf(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消上架'
        })
      })
    },
    setTemplateBtn () {
      let params = {
        item_ids: this.formOnStock.selectList,
        freight_template_id: this.delivery.form.freight_template_id
      }
      this.setTemplate(params)
    },
    setCategoryBtn (){
      let length = this.category.form.category_id.length
      let params = {
        item_ids: this.formOnStock.selectList,
        category_id: this.category.form.category_id[length-1]
      }
      this.setShopCategory(params)
    },
    showTemplate () {
      this.delivery.form.freight_template_id = ''
      this.delivery.dialogVisible = true
    },
    cancelTempDialog () {
      this.delivery.dialogVisible = false
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    },
    showCategory () {
      this.category.form.category_id = []
      this.category.dialogVisible = true
    },
    cancelCategoryDialog () {
      this.category.dialogVisible = false
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    },
    getItemList (params) {
      goods.getItemList(params).then((res) => {
        this.biz_mode = res.data.biz_mode
        this.formOnStock.list = []
        this.formOnStock.loading = false
        this.formOnStock.total = res.data.total_count
        for (let i in res.data.list) {

          switch(res.data.list[i].supply_bind_status){
            case 10 :
                res.data.list[i].supply_bind_status = "否"
                break
            case 20 :
                res.data.list[i].supply_bind_status = "部分"
                break
            case 30 :
                res.data.list[i].supply_bind_status = "是"
                break
          }
                   
          res.data.list[i].options = { text: '编辑', option: 'id' }
          this.formOnStock.list.push(res.data.list[i]);
        }
        this.formOnStock.list.sort(function (a, b) {
          a = new Date(a.updated_at)
          b = new Date(b.updated_at)
          return b - a
        })
      })
    },
    deleteItemList (params) {
      goods.deleteItemList(params).then((res) => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.search()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    setShelf (params) {
      goods.setShelf(params).then((res) => {
        if (res.data) {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.search()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    setTemplate (params) {
      goods.setTemplate(params).then((res) => {
        if (res.data) {
          this.delivery.dialogVisible = false
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.search()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    setShopCategory (params) {
      goods.setShopCategory(params).then((res) => {
        if (res.data) {
          this.category.dialogVisible = false
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.search()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  },
  components: {
    TableView,
    PaginationView
  },
  mounted () {
    this.search()
  }
}

</script>

<style lang='scss' scoped>
.onStock {
  .btn-group {
    margin-top: 20px;
  }
  .table {
    margin-top: 20px;
  }
  #export-form{
    display: none;
  }
}
</style>
