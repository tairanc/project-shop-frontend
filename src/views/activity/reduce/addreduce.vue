<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px" class="addreduce" label-position="left">
    <div class="basic">
        <el-row>
            <el-col :span="15">
                <el-form-item label="活动名称:" prop="promotion_name" >
                    <el-input v-model="addCoupon.promotion_name" placeholder="活动名称" size="small"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-button type="primary" size="small" @click="addReduceList">
                    <span class="el-icon-plus"></span>
                    添加{{isfullreduce ? "满折" : "满减"}}区间规则
                </el-button>
            </el-col>
            <el-col :span="10">
                <p class="tips">最多可同时设置5条{{isfullreduce ? "满折" : "满减"}}区间规则</p>
            </el-col>
        </el-row>
        <el-row v-if="reduceList.length > 0" class="addreduce-basic-rule">
            <el-col :span="20" v-for="(item, index) in reduceList" :key="index">
                <el-col :span="2"><span>消费满</span></el-col>
                <el-col :span="4"><el-input v-model="item.full" size="small" type="number" @blur="inputFull(item)" placeholder="请输入有效的整数值"></el-input></el-col>
                <el-col :span="2"><span>{{isfullreduce ? "件，给予" : "元，减" }}</span></el-col>
                <el-col :span="4"><el-input v-model="item.percent" size="small" type="number" @blur="inputReduce(item)" placeholder="请输入有效的整数值"></el-input></el-col>
                <el-col :span="2"><span>{{isfullreduce ? "%折扣" : "元" }}</span></el-col>
                <el-col :span="2"><span class="has-bluecolor" @click="deleteRedece(index)">删除</span></el-col>
                <el-col :span="6" v-if="isfullreduce && item.full.length > 0 && item.percent.length > 0"><span class="has-redcolor">注意：页面将显示{{item.full}}件{{item.percent / 10}}折</span></el-col>
            </el-col>
            <el-col :span="20" v-if="!isfullreduce">
                <el-checkbox v-model="checked">上不封顶（若勾选，则按照最后一条规则成比例优惠递减，如最后一条设置了满200减20，则默认为满400减40，满800减80，以此类推。)</el-checkbox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="15">
            <el-form-item label="活动开始日期:" prop="start_time">
                <el-date-picker v-model="addCoupon.start_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="活动开始日期" size="small">
                </el-date-picker>
            </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="15">
                <el-form-item label="活动结束时间:" prop="end_time">
                    <el-date-picker v-model="addCoupon.end_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="活动结束时间" size="small">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
    <div class="goods">
      <el-row>
        <el-col class="title">
          <p>选择适用商品</p>
        </el-col>
      </el-row>
      <el-row class="pl20">
        <el-col>
          <el-button type="danger" @click="selectVisible=true">选择商品</el-button>
          <el-button type="danger" @click="addItemBomb" >批量导入商品</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="all">
      <el-row>
        <el-col :span="24">
            <el-table class="table" :data="goodsList" border align="center" :span-method="spanMethod" >
              <el-table-column align="center" label="商品ID" prop="item_id"></el-table-column>
              <!-- <el-table-column align="center" label="商品编号" prop="art_no"></el-table-column> -->
              <!-- <el-table-column align="center" label="商品名称" prop="title"></el-table-column> -->
              <el-table-column align="center"  label="商品名称">
                <template slot-scope="scope">
                  <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
                </template>
              </el-table-column>
              <el-table-column align="center" label="属性" prop="spec_text"></el-table-column>
              
              <el-table-column align="center" label="市场价（元）" >
                <template slot-scope="scope">
                  <span v-show="!scope.row.edit">{{scope.row.market_price}}</span>
                  <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.market_price"></el-input>
                </template>
              </el-table-column>
              <el-table-column align="center" label="标准售价（元）" prop="sell_price"></el-table-column>
              <el-table-column align="center" label="可售库存" prop="store"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteGoods(scope.row.item_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </el-col>
      </el-row>
    </div>
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleid">
      <el-input type="textarea" :rows="6" v-model="goodsIds" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleid=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods v-if="promotionId != -1"
                  :promotionType="promotionType" 
                  :promotionId="promotionId" 
                  :selectList="selectList"  
                  :selectVisible="selectVisible" 
                  @visible-change="handleVisible" 
                  @choose-submit="handleAdd" ></select-goods>
     <select-goods :promotionType="promotionType"
                  :selectVisible="selectVisible"
                  :selectList="selectList"
                  @visible-change="handleVisible" 
                  @choose-submit="handleAdd" v-else></select-goods>             
    <!-- <select-goods :promotionType="promotionType" :promotionId="promotionId" :selectVisible="selectVisible" :selectList="selectList"  @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods> -->
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="commitCoupon">提交</el-button>
      <el-button @click="backList">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
  import TableView from '@/components/TableView'
  import SelectGoods from '@/components/SelectGoods'
  import reduce from '@/api/activity/reduce'
  import { spanArr } from '@/utils/spanArr'

  export default {
    data() {
      return {
        showBtnBatch:false,    //批量导入按钮
        promotionId  : -1 ,                 //商品类型id
        promotionType : 'FullDiscount',    //图片选择对应类型  FullMinus 满减； FullDiscount 满折；
        isfullreduce : true,    // 满折 reducebreak 还是 满减 reducefull
        isEditfullreduce : -1 ,     // 编辑状态下的新增
        reduceList : [
                {
                full:'',
                percent : '' 
                }
            ],        //满减规则
        checked:false,   //满减上限
        detailInfo: {
            promotion_id : '',
            page : 1 ,
            page_size : -1
        },

        loading: false,
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        goodsList: [],
        commitData: {},
        addCoupon: {
          promotion_name: "",
          items: "",
          start_time: "",
          end_time: "",
        },
        addRules: {
          promotion_name: [{
              required: true,
              message: '请输入1~60个字符',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 60,
              message: '请输入1~60个字符',
              trigger: 'blur'
            }
          ],
          start_time: [{
            required: true,
            message: "请选择领取开始时间",
            trigger: 'change'
          }],
          end_time: [{
            required: true,
            message: "请选择领取结束时间",
            trigger: 'change'
          }],
        }
      }
    },
    methods: {
        // 添加规则
      addReduceList(){
          if (this.reduceList.length >=5) {
            this.$message({
                message: '最多添加5条规则!',
                type: 'warning'
            });
          }else{
            let _addlist = {
               full:'',
               percent : '' 
            }
            this.reduceList.push(_addlist)
          }
      },
      deleteRedece(index){
        this.reduceList.splice(index, 1)
      },
      inputFull(item){
          let type="^[0-9]*[1-9][0-9]*$"; 
          let r=new RegExp(type); 
          let _flag = r.test(item.full)
          if (!_flag) {
             this.$set(item, 'full' , '') 
          }
      },
      inputReduce(item){
          let type="^[0-9]*[1-9][0-9]*$"; 
          let r=new RegExp(type); 
          let _flag = r.test(item.percent)
          if (this.isfullreduce) {
             if (_flag) {
               if (item.percent >= 100 || item.percent < 30) {
                  this.$message.error('折扣力度需控制在三折及以上');
                  // this.$set(item, 'percent' , '') 
               }
            }else{
              this.$message.error('请输入有效的整数值');
              // this.$set(item, 'percent' , '') 
            } 
          }else{
              if (!_flag) {
                this.$message.error('请输入有效的整数值');
                // this.$set(item, 'percent' , '') 
            } 
          }
          
      },
      // ID添加商品弹框
      addItemBomb() {
        this.addVisibleid = true;
        this.goodsIds = "";
      },
      // 添加优惠券适用商品
      addGoodsById() {;
        if (this.goodsIds) {
          let that = this;
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
          let _postdata = {
            item_id: _item_id,
            promotion_type: that.promotionType,
            return_by: 'sku'
          }
          if (that.isEditfullreduce != -1) {
            _postdata.promotion_id = that.$route.query.id
          }
          reduce.importItemsById(_postdata).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              that.goodsFilter(result.itemList);
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
              if (items[i].id == this.goodsList[j].id) {
                flag = true;
              }
            }
          }
          if (!flag) {
            this.goodsList.push(items[i]);
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
      // 删除添加商品
      deleteGoods(id) {
        this.goodsList = this.goodsList.filter(function (item) {
          return item.item_id != id;
        })
      },
      // 提交添加商品
      commitCoupon() {
        let ids = [];
        this.goodsList.forEach(function (item) {
          let _items = {
            item_id : item.item_id,
            sku_id : item.sku_id,
            id: item.id
          }
          ids.push(_items);
        })
        if (!this.isfullreduce) {
          // 满折添加上限
          this.addCoupon.has_high_limit = this.checked ? 0 : 1
          let _reduceList = []
          if (this.reduceList.length > 0) {
            this.reduceList.map((item,index)=>{
              let _changedata = {
                limit_money:item.full ,
                deduct_money :item.percent
              }
              _reduceList.push(_changedata)
            })
          }
          this.addCoupon.rules = JSON.stringify(_reduceList) ;
        }else{
          this.addCoupon.rules = JSON.stringify(this.reduceList) ;
        }
        
        this.addCoupon.items = JSON.stringify(ids) ;
        this.commitData = this.addCoupon
        
        if (this.addCoupon.items == "") {
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: "请选择优惠券商品～",
            type: 'warning'
          });
        } else {
          let that = this;
          this.$refs.addCoupon.validate((valid) => {
            if (valid) {
              if (this.isEditfullreduce != -1) {
                that.commitData.promotion_id = that.$route.query.id
              }
              reduce.createPlay(that.commitData , this.isfullreduce , this.isEditfullreduce).then((res) => {
                if (res.code == 0) {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: "成功",
                    type: 'success'
                  });
                  let _name = this.isfullreduce ? 'reducebreak' : 'reducefull'
                    this.$router.push({
                        name: _name
                    })
                } else {
                  this.$message({
                    showClose: true,
                    dangerouslyUseHTMLString: true,
                    message: res.message,
                    type: 'warning'
                  });
                }
              })
            } else {
              return false;
            }
          });
        }
      },
      // 返回列表页
      backList() {
        let _name = this.isfullreduce ? 'reducebreak' : 'reducefull'
        this.$router.push({
          name: _name
        })
      },
      // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
      //选择商品添加
      handleAdd(val){
          let _postdata = {
            item_id: val,
            promotion_type: this.promotionType,
            return_by: 'sku'
          }
          if (this.isEditfullreduce != -1) {
            _postdata.promotion_id = this.$route.query.id
          }
         reduce.importItemsById(_postdata).then((res) => {
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
      //行编辑
      handleEdit(row){
        this.goodsList.map((item)=>{
          if(item.item_id == row.item_id){
            item.edit = true
          }
        })
      },
      // 编辑界面
      getDetail(params){
        reduce.getShopcoupon(params, this.isfullreduce).then((res) => {
          this.addCoupon = res.data;
          this.addCoupon.promotion_name = res.data.name
          this.goodsList = res.data.itemList.list;
          this.total = res.data.itemList.total_count;
          this.showBtnBatch = res.data.status == 10 ? false : true

          if (this.isfullreduce) {
            this.reduceList = this.addCoupon.rules 
          }else{
            let _reduceList = []
            if (res.data.rules.rule.length > 0) {
              res.data.rules.rule.map((item,index)=>{
                let _changedata = {
                  full:item.limit_money ,
                  percent :item.deduct_money
                }
                _reduceList.push(_changedata)
              })
            }
            this.reduceList = _reduceList ;

            this.checked = res.data.rules.has_high_limit == 0 ? true : false
          }
        });
      },
    },
    components: {
      TableView,
      SelectGoods
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
    created(){
        let that = this
        that.isfullreduce = that.$route.name === "addBreakReduce" || that.$route.name === "editBreakReduce" ?  true : false
        that.promotionType = that.$route.name === "addBreakReduce" || that.$route.name === "editBreakReduce" ?  'FullDiscount' : 'FullMinus' //图片选择对应类型  FullMinus 满减； FullDiscount 满折

        if (that.$route.name === "editBreakReduce" ) {
          that.detailInfo.promotion_id = that.$route.query.id
          that.promotionId = that.$route.query.id.toString()
          that.getDetail(that.detailInfo)
          that.isEditfullreduce = "editBreakReduce"
        }
        if (that.$route.name === "editFullReduce") {
          that.detailInfo.promotion_id = that.$route.query.id
          that.promotionId = that.$route.query.id.toString()
          that.getDetail(that.detailInfo)
          that.isEditfullreduce = "editFullReduce"
        }

    },
  }

</script>

<style lang='scss' scoped>
.addreduce{
     .basic {
        margin: 20px;
        padding: 20px;
        padding-bottom: 0px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .inline {
        display: inline-block;
        margin-left: 30px;
    }

    .goods,
    .all {
        margin: 20px;
        padding-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .all {
        padding-bottom: 0px;
        padding-top: 20px;
    }

    .title {
        margin-bottom: 20px;
        padding-left: 20px;
        background-color: #f5f5f5;
    }

    .pl20 {
        padding-left: 20px;
    }

    .pt20 {
        padding-bottom: 20px;
    }

    .el-col-10 .tips {
        margin-top: 12px;
        margin-bottom: 10px;
        margin-left: 20px;
        color: #ccc;
        font-size: 14px;
    }

    .addreduce-basic-rule{
        .el-col{
            .el-col{
                line-height: 30px;
                font-size: 14px;
                text-align: center;
                margin-bottom: 10px;
                .has-bluecolor{
                    color: blue;
                }
                .has-redcolor{
                    color: red;
                }
            }
        }
        .el-col:nth-child(1){
            .el-col{
                .has-bluecolor{
                    display: none;
                }
            }
        }
    }
}


</style>
