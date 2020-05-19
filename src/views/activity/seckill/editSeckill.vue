<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px">
    <div class="basic">
      <el-form-item label="活动名称:" prop="promotion_name">
        <el-input v-model="addCoupon.promotion_name" placeholder="活动名称" :disabled="isduring"></el-input>
      </el-form-item>
      <el-form-item label="每人每件限购:">
        <span>1件</span>
      </el-form-item>
      <el-form-item label="活动发布时间:" prop="release_time">
        <el-date-picker v-model="addCoupon.release_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动发布时间" :disabled="isduring">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动开始时间:" prop="start_time">
        <el-date-picker v-model="addCoupon.start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动开始时间" :disabled="isduring">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间:" prop="end_time">
        <el-date-picker v-model="addCoupon.end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动结束时间" :disabled="isduring">
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
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="属性" prop="spec_text">
          </el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price">
          </el-table-column>
          <el-table-column align="center" label="活动价（元）" >
            <template slot-scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.price}}</span>
              <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="总库存" prop="total_store">
          </el-table-column>
          <el-table-column align="center" label="活动库存" >
            <template slot-scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.promotion_store}}</span>
              <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.promotion_store"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope" >
              <div v-if="isduring">
                <div v-if="scope.row.isinduring">
                  <!-- <el-button type="text" 
                  :disabled="(scope.row.status==0)" 
                  @click="handleClose(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button> -->
                  <el-button type="text" disabled>编辑</el-button>
                  <el-button type="text" disabled>删除</el-button>
                </div>
                <div v-else>
                  <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
                  <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
                </div>
              </div>
              <div v-else>
                <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
                <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
              </div>
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
    <select-goods v-if="isduring"
                  :promotionType="type" 
                  :selectList="selectList" 
                  :selectVisible="selectVisible"
                  :specGoods="specGoods"
                  :goodsinduring="goodsinduring" 
                  @visible-change="handleVisible" 
                  @choose-submit="handleAdd"
                  @choose-spec="handspec" ></select-goods>

    <select-goods :promotionType="type" 
                  :promotionId="(pageInfo.promotion_id).toString()" 
                  :selectList="selectList" 
                  :selectVisible="selectVisible" 
                  @visible-change="handleVisible" 
                  @choose-submit="handleAdd" v-else></select-goods> 

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </el-form>
</template>

<script>
  import SelectGoods from '@/components/SelectGoods'
  import ticket from '@/api/activity/ticket'
  import seckill from '@/api/activity/seckill'
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
        showBtnBatch:false,    //批量导入按钮
        specGoods:[],     //活动中的商品 item_id
        goodsinduring:[], //活动中商品
        isduring:false,   //是否在活动中
        type: 'SecKill',
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        goodsList: [],
        pageInfo: {
          promotion_id: '',
          page: 1,
          page_size: -1
        },
        addCoupon: {
          promotion_id: '',
          promotion_name: "",
          release_time: "",
          start_time: "",
          end_time: "",
          items: []
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
      spanArr(){
        return spanArr(this.goodsList)
      }
    },
    methods: {
      //获取秒杀信息
      getSeckillDetail(params){
        seckill.getSeckillDetail(params).then((res)=>{
          if(res.code == 0){
            this.addCoupon.promotion_name = res.data.name
            this.addCoupon.release_time = res.data.release_time
            this.addCoupon.start_time = res.data.start_time
            this.addCoupon.end_time = res.data.end_time
            this.showBtnBatch = res.data.activity_status == 10 ? false : true
          }
        })
      },
      // 获取秒杀商品列表
      getSeckillGoodList(params){
        seckill.getSeckillGoodList(params).then((res)=>{
          this.goodsList = res.data.data
          this.specGoods = []
          this.goodsList.map((item)=>{
            this.$set(item,'edit',false)
            if (this.isduring) {
              this.$set(item,'isinduring',true)
              this.specGoods.push(item.item_id)
            }
          })
          let _deletspec = JSON.parse(JSON.stringify(res.data.data))
          let _data = []
            _deletspec.map((item, index)=>{
                item.isinduring = true
                item.selected = false
                _data.push(item)
            })
          this.goodsinduring = _data
          // this.goodsinduring = JSON.parse(JSON.stringify(res.data.data))
        })
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 添加优惠券适用商品
      addGoodsById() {
        if (this.goodsIds) {
          let _item_id = JSON.parse(JSON.stringify(this.goodsIds))
          if (this.showBtnBatch == false) {
            let _goodsids = []
            if (this.goodsIds.indexOf(',') != -1) {
              _goodsids = this.goodsIds.split(',')
            }else if (this.goodsIds.indexOf('，') != -1) {
              _goodsids = this.goodsIds.split('，')
            }else{
              _goodsids.push(this.goodsIds)
            }
            this.goodsList.map((mitem, mindex)=>{
              if (_goodsids.indexOf(mitem.item_id) == -1) {
                _goodsids.push(mitem.item_id)
              }
            })
            _item_id = _goodsids.join(',')
          }
          ticket.importItemsById({
            item_id: _item_id,
            promotion_type: 'SecKill',
            promotion_id: this.isduring ? '' : this.addCoupon.promotion_id,
            return_by: 'sku'
          }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              if (this.isduring) {
                this.goodsAdds(result.itemList);
              }else{
                this.goodsFilter(result.itemList);
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
        this.goodsIds = "";
        this.addVisibleid = false;
      },
      // 展示所有商品
      goodsAdds(items){
        let _addgoods = []
        items.map((item, index)=>{
          let _goodsinduringindex = this.specGoods.indexOf(item.item_id) 
          if (_goodsinduringindex != -1) {
            this.goodsinduring.map((items, indes)=>{
              if (items.item_id == item.item_id) {
                items.isinduring = false
                items.selected = true
              }
            })
          }else{
            item.edit = false
            _addgoods.push(item)
          }
        })
        this.goodsList = this.goodsinduring.concat(_addgoods)
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
            this.$set(items[i],'edit',false)
            this.$set(items[i],'price','')
            this.$set(items[i],'promotion_store','')
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
        let _postval = []
        val.map((item, index)=>{
          let _inindex = this.specGoods.indexOf(item)
          if (_inindex == -1) {
            _postval.push(item)
          }else{
            if (this.goodsinduring[_inindex].selected == true) {
              _postval.push(item)
            }
          }
        })
        let _inportdata = this.isduring ? _postval : val
        if (_inportdata.length < 1) {
          return
        }
        ticket.importItemsById({
          item_id: this.isduring ? _postval : val,
          promotion_type: 'SecKill',
          promotion_id: this.isduring ? '' : this.addCoupon.promotion_id,
          return_by: 'sku'
        }).then((res) => {
          const result = res.data;
          let errMsg = "";
          if (result.itemList.length != 0) {
            if (this.isduring) {
              this.goodsAdds(result.itemList);
            }else{
              this.goodsFilter(result.itemList);
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
      },
      handspec(val){
        let _data = []
        val.map((item, index)=>{
          let _specindex = this.specGoods.indexOf(item.item_id)
          if(_specindex != -1){
            this.goodsinduring.map((items, indes)=>{
              if (items.item_id == item.item_id) {
                items.isinduring = item.selected == true ? false : true
                items.selected = item.selected
              }
            })
          }else{
            _data.push(item)
          }
        })
        this.goodsList = this.goodsinduring.concat(_data)
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
            item.price = item.price.length < 1 ? "" : parseFloat(item.price)
            item.promotion_store =item.promotion_store.length < 1 ? "" :  parseInt(item.promotion_store)
            
            if(!posNumber.test(item.price) || item.price >= parseFloat(item.sell_price) || item.price == 0){    
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: '仅限输入正数，保留两位小数，金额需小于标准售价',
                type: 'warning'
              })
              flag = false
            }else{
              item.price = parseFloat(item.price).toFixed(2)
            }

            if(!posInteger.test(item.promotion_store) || parseFloat(item.promotion_store) > parseFloat(item.store)){
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
       //关闭直降商品
      handleClose(row){
        seckill.closeSeckillDetail({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id
        }).then((res)=>{
          if(res.code == 0){
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: 'success'
            });
            this.getSeckillGoodList(this.pageInfo)
          }
        })
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
                sku_id: item.sku_id,
                price: item.price,
                store: item.promotion_store
              })
            })
            if(this.isduring){
              let _list = []
              let _itemids = []
              this.goodsinduring.map((itemc, indexc)=>{
                if (!itemc.selected) {
                  _itemids.push(itemc.item_id)
                }
              })
              items.map((itemss, indexss)=>{
                if (_itemids.indexOf(itemss.item_id) == -1) {
                  _list.push(itemss)
                }
              })
              this.addCoupon.items = _list
              if (_list.length < 1) {
                this.$message({
                    showClose: true,
                    message: '提交成功',
                    type: 'success'
                })
                this.$router.push({name: 'seckill'})
                return
              }
            }else{
              this.addCoupon.items = JSON.stringify(items)
            }
            seckill.updateSeckill(this.addCoupon,this.isduring).then((res)=>{
              if(res.code==0){
                if (res.data.message && res.data.message.length > 0) {
                    res.data.message.map((item, index)=>{
                      this.$message.error(item);
                    })
                  }else{
                    this.$message({
                      showClose: true,
                      message: '更新成功',
                      type: 'success'
                    })
                    this.$router.push({name: 'seckill'})
                  }
              }
            })
          }
        })
      },
      //取消
      handleCancel(){
        this.$router.push({name: 'seckill'})
      }
    },
    components: {
      SelectGoods
    },
    created() {
      this.isduring =  this.$route.query.activity_status == 30
      this.pageInfo.promotion_id = this.$route.query.promotion_id
      this.addCoupon.promotion_id = this.$route.query.promotion_id
      this.getSeckillDetail(this.pageInfo)
      this.getSeckillGoodList(this.pageInfo)
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
