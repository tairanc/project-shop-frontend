<template>
  <div class="add">
    <el-form class="form" :model="form" size="medium">

      <el-form-item label="模板名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="是否启用：">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="是否包邮：" prop="is_free">
        <el-radio-group v-model="form.is_free" @change="handleType">
          <el-radio :label="0">自定义运费</el-radio>
          <el-radio :label="1">卖家承担运费</el-radio>
        </el-radio-group>
        <span class="tip">选择了卖家承担运费，运费计算和包邮规则设置将会丢失</span>
      </el-form-item>

      <el-form-item v-show="!form.is_free" label="计价方式：">
        <!-- 包邮回来再设置 -->
        <el-radio-group v-model="form.valuation_type" @change="handleType" :disabled="isAble?true:false">
          <el-radio :label="1">按重量</el-radio>
          <el-radio :label="2">按件数</el-radio>
          <el-radio :label="3">按金额</el-radio>
        </el-radio-group>
        <span class="tip">运费模版保存后，计费方式将无法切换！</span>
      </el-form-item>

      <el-form-item v-show="!form.is_free" label="运费计算：" size="mini">
        <div class="freight">
          <p>为指定地区城市设置运费</p>
          <el-table v-show="form.valuation_type!=3" :data="form.freight_conf" border>

            <el-table-column label="运送到" >
              <template slot-scope="scope">
                  <span>{{scope.row.area_label}}</span>
              </template>
            </el-table-column>

            <el-table-column :label="form.valuation_type==1?'首重（kg）':'首件（件）'" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.start_standard"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="首费（元）" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.start_freight"></el-input>
              </template>
            </el-table-column>

            <el-table-column :label="form.valuation_type==1?'续重（kg）':'续件（件）'" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.add_standard"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="续费（元）" width="120px">
              <template slot-scope="scope">
                <el-input v-model="scope.row.add_freight"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="75px">
              <template slot-scope="scope">
                <el-button @click="delFreight(scope.$index,scope.row)" v-if="scope.$index!==0">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <!-- 按金额计价 -->
          <el-table v-show="form.valuation_type==3"  :data="form.freight_conf" border :span-method="spanMethod">
            <el-table-column label="运送到" >
              <template slot-scope="scope">
                  <span>{{scope.row.area_label}}</span>
                  <el-button  class="inlineBtn" @click="delFreight(scope.$index,scope.row)" v-show="scope.$index!=0">删除</el-button>
              </template>
            </el-table-column>

            <el-table-column label="金额上下限（元）" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.boundary" :disabled="scope.row.first"></el-input> --
                <el-input v-model="scope.row.upper"  placeholder="∞" :disabled="scope.row.second" @blur="addMoney(scope.$index,scope.row)"></el-input>
              </template>
            </el-table-column>
      
            <el-table-column label="运费（元）" width="150px" align="center">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.freight"></el-input>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="75px">
              <template slot-scope="scope">
                <el-button @click="delFreightMoney(scope.$index,scope.row)" v-show="scope.$index!=0&&scope.row.disabledBtn">删除</el-button>
              </template>
            </el-table-column>
            
          </el-table>

          <div class="addBtn">
            <el-button @click="freightDialog=true">添加地区</el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item v-show="!form.is_free&&form.valuation_type!=3" label="指定条件包邮：" size="mini">
        <el-checkbox v-model="form.is_select">是否指定</el-checkbox>
        <div class="free" v-show="form.is_select">
          <el-table :data="form.free_conf" border>

            <el-table-column label="运送到">
              <template slot-scope="scope">
                  <span>{{scope.row.area_label}}</span>
              </template>
            </el-table-column>

            <el-table-column label="设置包邮条件" align="center" width="500px">
              <template slot-scope="scope">

                <el-select v-model="scope.row.free_type">
                  <el-option :label="form.valuation_type==1?'重量':'件数'" :value="1"></el-option>
                  <el-option label="金额" :value="2"></el-option>
                  <el-option :label="form.valuation_type==1?'重量+金额':'件数+金额'" :value="3"></el-option>
                </el-select>

                在<span v-show="scope.row.free_type!==2&&form.valuation_type==1">
                  <el-input v-model="scope.row.limit_weight"></el-input>（kg）内
                </span>
                <span v-show="scope.row.free_type!==2&&form.valuation_type==2">
                  <el-input v-model="scope.row.limit_quantity"></el-input>（件）内
                </span>
                <span v-show="scope.row.free_type==3">且</span>
                <span v-show="scope.row.free_type!==1">
                  <el-input v-model="scope.row.limit_money"></el-input>（元）以上
                </span>包邮

              </template>
            </el-table-column>

            <el-table-column label="操作" width="75px">
              <template slot-scope="scope">
                <el-button v-if="scope.$index!==0" @click="delFree(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <div class="addBtn">
            <el-button @click="freeDialog = true">添加地区</el-button>
          </div>
        </div>
      </el-form-item>

    </el-form>

    <div class="btnGroup">
      <el-button v-if="this.form.template_id" type="primary" @click="updateForm">确 定</el-button>    
      <el-button v-else type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancelAdd">取 消</el-button>
    </div>

    <!-- 运费计算选区框 -->
    <el-dialog class="dialog" title="选择地区" width="30%"
      :visible.sync="freightDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <div class="treeBody">
        <el-tree
          ref="freightTree"
          :data="freight_areaList"
          node-key="value"
          show-checkbox
          :default-expanded-keys="[]"
          accordion>
        </el-tree>
      </div>
      <div slot="footer" class="footer">
        <el-button @click="cancelFreight">取 消</el-button>
        <el-button type="primary" @click="addFreight">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 包邮 计算选区框 -->
    <el-dialog class="dialog" title="选择地区" width="30%"
      :visible.sync="freeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <div class="treeBody">
        <el-tree
          ref="freeTree"
          :data="free_areaList"
          node-key="value"
          show-checkbox
          :default-expanded-keys="[]"
          accordion>
        </el-tree>
      </div>
      <div slot="footer" class="footer">
        <el-button @click="cancelFree">取 消</el-button>
        <el-button type="primary" @click="addFree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import delivery from '@/api/delivery'
import { spanArr } from '@/utils/spanArr'

const POSNUM = /^\d+(.\d{1,2})?$/ //正数
const POSINT = /^[1-9]\d*$/ //正整数

export default {
  data() {
    return {
      form: {
        template_id: '',
        name: '',
        status: 1,
        is_free: 0,
        valuation_type: 1,
        freight_conf: [
          {
            item_id: '',
            area: '',
            area_label: '全国',
            start_standard: '',
            start_freight: '',
            add_standard: '',
            add_freight: '',

            boundary: '0',
            upper: '',
            freight: '',
            first: true,
            second: false,
            disabledBtn: true
          }
        ],
        is_select: false,
        free_conf: [
          {
            area: '',
            area_label: '全国',
            free_type: 1,
            limit_quantity: '',
            limit_money: ''
          }
        ]
      },
      isAble: false,
      freightDialog: false,
      freeDialog: false,
      areaList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  computed: {
    freight_areaList() {
      return this.handleAreaList(this.form.freight_conf)
    },
    free_areaList() {
      return this.handleAreaList(this.form.free_conf)
    },
    spanArr(){
      return spanArr(this.form.freight_conf)
    }
  },
  methods: {
    // 对象数组深复制
    objDeepCopy(source) {
      let sourceCopy = source instanceof Array ? [] : {}
      for (var item in source) {
          sourceCopy[item] = typeof source[item] === 'object' ? this.objDeepCopy(source[item]) : source[item]
      }
      return sourceCopy
    },
    // 处理单次选中的地区
    handleArea(val){
      let areaItems = this.$refs[val].getCheckedNodes()
      // 一级地区集合
      let areaFirst = areaItems.filter((item)=>{
        return item.children
      })
      
      let areaFirst_val = areaFirst.map((item)=>{
        return item.value
      })

      let areaComputed = areaItems.filter((item)=>{  
        return areaFirst_val.indexOf(item.parentId) == -1
      })    

      let area = ''
      let area_label = ''

      areaComputed.map((item)=>{
        area += `${item.value},`
        area_label += `${item.label},`
      })

      area = area.slice(0,-1)
      area_label = area_label.slice(0,-1)

      return {
        area: area,
        area_label: area_label
      }
    },
    // 处理选择的地区列表数据
    handleAreaList(val){
      // 最好此处 areaChecked 做去重 因为按金额表格会合并 有多条相同地区的数据
      let areaChecked = val.map((item)=>{
        return item.area
      })
      let checkList = areaChecked.join(',').slice(1).split(',')
      let newAreaList = this.objDeepCopy(this.areaList)
      
      if(checkList[0] != ""){
        // 过滤地区
        newAreaList.map((item)=>{
          if(checkList.indexOf(item.value) != -1){
            this.$set(item,'disabled',true)
            item.children.map((child)=>{
              this.$set(child,'disabled',true)
            })
          }else{
            item.children.map((child)=>{
              (checkList.indexOf(child.value) != -1) && this.$set(child,'disabled',true)
            })
          }
        })

        // 检查 二级全不能选 但是一级没设置不能选的
        newAreaList.map((item)=>{
          var flag = true
          item.children.map((child)=>{
            (!child.disabled) && (flag = false)
          })
          flag && (this.$set(item,'disabled',true))
        })
      }
      return newAreaList
    },
    // 计价方式改变或者是否包邮，重置数据
    handleType(){
      this.form.freight_conf = [{
        item_id: '',
        area: '',
        area_label: '全国',
        start_standard: '',
        start_freight: '',
        add_standard: '',
        add_freight: '',

        boundary: '0',
        upper: '',
        freight: '',
        first: true,
        second: false,
        disabledBtn: true
      }],
      this.form.is_select = false,
      this.form.free_conf = [{
        area: '',
        area_label: '全国',
        free_type: 1,
        limit_quantity: '',
        limit_money: ''
      }]
    },
    // 运费计算 取消添加
    cancelFreight(){
      this.freightDialog = false
      this.$refs.freightTree.setCheckedKeys([])
    },
    // 运费计算 添加一条记录
    addFreight(){
      let areaObj = this.handleArea('freightTree')

      if(areaObj.area){
        this.form.freight_conf.push(
          {
            item_id: areaObj.area,
            area: areaObj.area,
            area_label: areaObj.area_label,
            start_standard: '',
            start_freight: '',
            add_standard: '',
            add_freight: '',
  
            boundary: '0',
            upper: '',
            freight: '',
            first: true,
            second: false,
            disabledBtn: true
          }
        )
        this.cancelFreight()
      }else{
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: '请选择地区',
          type: 'warning'
        })
      }
    },
    // 运费计算 删除一条记录
    delFreight(index, row){
      this.form.freight_conf = this.form.freight_conf.filter((item)=>{
        return item.area != row.area
      })
    },
    // 运费模板 按金额计价 删除一条记录
    delFreightMoney(index,row){
      this.form.freight_conf[index-1].second = false
      this.form.freight_conf[index-1].disabledBtn = true
      this.form.freight_conf[index-1].upper = ''

      this.form.freight_conf.splice(index, 1)
    },
    // 运费计算 计价方式是金额时
    addMoney(index,row){
      
      if(!isNaN(row.upper) && row.upper>0 && parseFloat(row.upper)>parseFloat(row.boundary)){
        row.second = true
        row.disabledBtn = false
        this.form.freight_conf.splice(index+1,0,
          { 
            item_id: row.area,
            area: row.area,
            area_label: row.area_label,
  
            boundary: row.upper,
            upper: '',
            freight: '',
            first: true,
            second: false,
            disabledBtn: true
          }
        )
      }else{
        this.$message({
          showClose: true,
          message: '请填写正确的金额',
          type: 'warning'
        })
      }
    },
    //计价方式是金额时 表格合并处理方法
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
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
    // 包邮 取消添加
    cancelFree(){
      this.freeDialog = false
      this.$refs.freeTree.setCheckedKeys([])
    },
    // 包邮 添加一条记录
    addFree(){
      let areaObj = this.handleArea('freeTree')

      if(areaObj.area){
        this.form.free_conf.push(
          {
            area: areaObj.area,
            area_label: areaObj.area_label,
            free_type: 1,
            limit_quantity: '',
            limit_money: ''
          }
        )
        this.cancelFree()
      }else{
        this.$message({
          showClose: true,
          message: '请选择地区',
          type: 'warning'
        })
      }
    },
    // 包邮计算 删除一条记录
    delFree(index, row){
      this.form.free_conf = this.form.free_conf.filter((item)=>{
        return item.area != row.area
      })
    },
    // 校验
    checkAll(){
      let canSub = true
      
      //校验运费计算
      this.form.freight_conf.map((item)=>{
        if(this.form.valuation_type == 1){
          !POSNUM.test(item.start_standard) && (canSub = false)
          !POSNUM.test(item.start_freight) && (canSub = false)
          !POSNUM.test(item.add_standard) && (canSub = false)
          !POSNUM.test(item.add_freight) && (canSub = false)
        }else if(this.form.valuation_type == 2){
          !POSINT.test(item.start_standard) && (canSub = false)
          !POSNUM.test(item.start_freight) && (canSub = false)
          !POSINT.test(item.add_standard) && (canSub = false)
          !POSNUM.test(item.add_freight) && (canSub = false)
        }else{
          !POSNUM.test(item.freight) && (canSub = false)
        }
      })
      
      // 校验包邮
      if(this.form.is_select && this.form.valuation_type!=3){
        this.form.free_conf.map((item)=>{
          if(this.form.valuation_type == 1){
            if(item.free_type == 1){  
              !POSNUM.test(item.limit_weight) && (canSub = false)
            }else if(item.free_type == 2){
              !POSNUM.test(item.limit_money) && (canSub = false)
            }else{
              !POSNUM.test(item.limit_weight) && (canSub = false)
              !POSNUM.test(item.limit_money) && (canSub = false)
            }
          }else{
            if(item.free_type == 1){
              !POSINT.test(item.limit_quantity) && (canSub = false)
            }else if(item.free_type == 2){
              !POSNUM.test(item.limit_money) && (canSub = false)
            }else{
              !POSINT.test(item.limit_quantity) && (canSub = false)
              !POSNUM.test(item.limit_money) && (canSub = false)
            }
          }
          
        })
      }

      return canSub
    },
    // 创建运费模板
    submitForm(){
      let newFlag = this.checkAll()

      if(newFlag || this.form.is_free){
        delivery.createTemplate(this.form).then((res)=>{
          if(res.code ===0){
            this.$message({
              type:'success',
              message:'操作成功'
            })
            this.$router.push({ name: 'template' })
          }
        })
      }else{
        this.$message({
          showClose: true,
          message: '请填写正确的运费计算规则或指定条件包邮规则',
          type: 'warning'
        })
      }
      
    },
    // 更新运费模板
    updateForm(){
      let newFlag = this.checkAll()

      if(newFlag || this.form.is_free){
        delivery.updateTemplate(this.form).then((res)=>{
          if(res.code ===0){
            this.$message({
              type:'success',
              message:'操作成功'
            })
            this.$router.push({ name: 'template' })
          }
        })
      }else{
        this.$message({
          showClose: true,
          message: '请填写正确的运费计算规则或指定条件包邮规则',
          type: 'warning'
        })
      }
    },
    // 取消添加或修改模板
    cancelAdd(){
      this.$router.push({ name: 'template' })
    }
  },
  mounted () {    
    if(this.$route.name == "edittemplate"){
      delivery.getDeliveryInfo({template_id: this.$route.params.id}).then((res)=>{
        if(res.code==0){
          this.form = res.data
          this.form.template_id = this.$route.params.id

          if(this.form.is_free){
            this.form.freight_conf = [
              {
                item_id: '',
                area: '',
                area_label: '全国',
                start_standard: '',
                start_freight: '',
                add_standard: '',
                add_freight: '',

                boundary: '0',
                upper: '',
                freight: '',
                first: true,
                second: false,
                disabledBtn: true
              }
            ]
          }else{
            this.isAble = true
          }

          if(this.form.free_conf.length){
            this.$set(this.form,'is_select',true)
          }else{
            this.$set(this.form,'is_select',false)
            this.form.free_conf = [
              {
                area: '',
                area_label: '全国',
                free_type: 1,
                limit_quantity: '',
                limit_money: ''
              }
            ]
          }

          //如果拿到的计价方式为金额
          if(this.form.valuation_type==3){
            this.form.freight_conf.map((item)=>{
              item.item_id = item.area
              item.first = true
              item.boundary = item.boundary.toString()

              if(item.upper){
                item.second = true
                item.disabledBtn = false
              }else{
                item.second = false
                item.disabledBtn = true
              }              
            })
          }

        }
      })
    }
  },
  created() {
    delivery.getAreaList().then((res) => {
      this.areaList = res.data
    })
  },
}

</script>

<style lang='scss' scoped>
.add {
  margin: 20px;
  .form {
    width: 80%;
    .el-input {
      width: 50%;
    }
    .tip{
      display: inline-block;
      margin-left: 20px;
      padding: 0 10px;
      border-radius: 5px;
      color: #fff;
      background: #5bc0de;
    }
    .freight, .free {
      overflow: hidden;
      margin-left: 80px;
      padding: 10px;
      background: #f2f2f2;
      .addBtn {
        margin-top: 10px;
      }
      .el-input {
        width: 60px;
      }
      .el-select {
        width: 105px;
      }
      .inlineBtn{
        float: right;
      }
    }
  }
  .btnGroup {
    text-align: center;
  }
  .dialog {
    .treeBody{
      overflow: auto;
      height: 400px;
    }
    .footer {
      text-align: center;
    }
  }
}
</style>
