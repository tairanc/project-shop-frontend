<template>
  <div class="onChecking">
    <el-form :model="formOnChecking.form" ref="formOnChecking" :rules="formOnChecking.rules" label-width="100px" size="medium">
      <el-row>
          <el-col :span="6" :offset="1">
            <el-form-item label="商品名称：" prop="title">
              <el-input v-model="formOnChecking.form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-form-item label="商品货号：" prop="art_no">
              <el-input v-model="formOnChecking.form.art_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item label="店铺分类：" prop="shop_category_id">
              <el-cascader
                :options="categoryList"
                @change="getCategoryId"
                v-model="formOnChecking.form.shop_category_list">
              </el-cascader>
            </el-form-item>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="供应链绑定：" prop="supply_bind_status">
            <el-select v-model="formOnChecking.form.supply_bind_status">
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
                <el-input v-model="formOnChecking.form.min_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">到</el-col>
            <el-col :span="11">
              <el-form-item prop="max_price">
                <el-input v-model="formOnChecking.form.max_price"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-form-item label="运费模板：" prop="logistics_template_id">
            <el-select v-model="formOnChecking.form.logistics_template_id">
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
            <el-input v-model="formOnChecking.form.bar_code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="9">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="default" @click="resetForm">清空条件</el-button>
          <el-button size="medium" @click="exportGoodTable">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="table">
      <table-view
        :tableName="formOnChecking.name"
        :selection="true"
        :loading="formOnChecking.loading"
        :columns="formOnChecking.columns"
        :pageList="formOnChecking.list"
        @select-change='handleSelectChange'
      >
      </table-view>
    </div>
    <pagination-view 
      v-show="formOnChecking.list.length"
      :paginationName="formOnChecking.name"
      :total="formOnChecking.total"
      :currentPage="formOnChecking.form.page"
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
          this.$refs.formOnChecking.validateField('max_price');
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
        } else if (value < parseFloat(this.formOnChecking.form.min_price)) {
          callback(new Error('最高价不得小于最低价'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    };
    return {
      formOnChecking: {
        name: 'formOnChecking',
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
          status: 20,
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
          { label: '操作', field: 'options', link: '/goods-manage/goods/edit', align: 'center' },
        ],
        list: [],
        selectList: []
      },
      exportList: [],
    }
  },
  methods: {
    // 导出报表
    exportGoodTable() {
      goods.exportGoods(this.formOnChecking.form).then((res)=>{
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

          item.status = '审核中'

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
      this.formOnChecking.form.shop_category_id = value[value.length-1]
    },
    handleSelectChange (val) {
      // let self = this
      // self.formOnSale.selectList = []
      // val.forEach(function (val) {
      //   self.formOnSale.selectList.push(val.id)
      // })
    },
    handleSizeChange (val) {
      this.formOnChecking.form.page_size = val
      this.getItemList(this.formOnChecking.form)
    },
    handleNumberChange (val) {
      this.formOnChecking.form.page = val
      this.getItemList(this.formOnChecking.form)
    },
    search () {
      this.$refs.formOnChecking.validate((valid) => {
        if (valid) {
          this.formOnChecking.loading = true
          this.formOnChecking.form.page = 1
          this.getItemList(this.formOnChecking.form)
        }
      });
    },
    resetForm () {
      this.$refs.formOnChecking.resetFields()
      this.formOnChecking.form.shop_category_list = []
    },
  
    getItemList (params) {
      goods.getItemList(params).then((res) => {
        this.formOnChecking.list = []
        this.formOnChecking.loading = false
        this.formOnChecking.total = res.data.total_count
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
          this.formOnChecking.list.push(res.data.list[i]);
        }
        this.formOnChecking.list.sort(function (a, b) {
          a = new Date(a.updated_at)
          b = new Date(b.updated_at)
          return b - a
        })
      })
    }
  },
  components: {
    TableView,
    PaginationView
  },
  computed: {
    ...mapGetters([
      'deliveryTplUpList',
      'categoryList'
    ]),
  },
  mounted () {
    this.search()
  }
}

</script>

<style lang='scss' scoped>
.onChecking {
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
