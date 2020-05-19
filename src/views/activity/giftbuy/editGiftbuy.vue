<template>
  <el-form :model="addCoupon" :rules="addRules" ref="addCoupon" label-width="120px">
    <div class="basic">
      <el-form-item label="活动名称:" prop="promotion_name">
        <el-input :disabled="isduring" v-model="addCoupon.promotion_name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动开始时间:" prop="start_time">
        <el-date-picker
          :disabled="isduring"
          v-model="addCoupon.start_time"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动开始时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动结束时间:" prop="end_time">
        <el-date-picker
          :disabled="isduring"
          v-model="addCoupon.end_time"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="活动结束时间"
        ></el-date-picker>
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
        <el-table class="table" :data="goodsList" border align="center" :span-method="spanMethod">
          <el-table-column align="center" label="商品ID" prop="item_id"></el-table-column>
          <el-table-column align="center" label="商品编号" prop="art_no"></el-table-column>
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <a
                class="goods_url"
                :href="defaultUrl('item_id',scope.row)"
                target="_blank"
              >{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="属性" prop="spec_text"></el-table-column>
          <el-table-column align="center" label="市场价（元）" prop="market_price"></el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price"></el-table-column>
          <el-table-column align="center" label="可售库存" prop="store"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <!-- <el-button type="text"
                  v-if="scope.row.isinduring" 
                  :disabled="(scope.row.status==0)" 
              @click="handleClose(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button>-->
              <el-button type="text" v-if="scope.row.isinduring" disabled>删除</el-button>
              <el-button type="text" v-else @click="handleDelete(scope.row)">删除</el-button>
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
        <el-table class="table" :data="goodsListGift" border align="center">
          <el-table-column align="center" label="商品ID" prop="item_id"></el-table-column>
          <el-table-column align="center" label="商品编号" prop="art_no"></el-table-column>
          <el-table-column align="center" label="商品名称">
            <template slot-scope="scope">
              <a
                class="goods_url"
                :href="defaultUrl('item_id',scope.row)"
                target="_blank"
              >{{scope.row.title}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="市场价（元）" prop="market_price"></el-table-column>
          <el-table-column align="center" label="标准售价（元）" prop="sell_price"></el-table-column>
          <el-table-column align="center" label="可售库存" prop="store"></el-table-column>
          <el-table-column align="center" label="赠送数量/件">
            <template slot-scope="scope">
              <span v-show="!scope.row.edit">{{scope.row.quantity}}</span>
              <el-input v-show="scope.row.edit" size="mini" v-model="scope.row.quantity"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <div v-if="isduring">
                <div v-if="scope.row.isinduring">
                  <!-- <el-button type="text"
                  v-if="scope.row.isinduring" 
                  :disabled="(scope.row.status==0)" 
                  @click="handleGiftClose(scope.row)">{{scope.row.status==0?'已关闭':'关闭'}}</el-button>-->
                  <el-button type="text" disabled>编辑</el-button>
                  <el-button type="text" disabled>删除</el-button>
                </div>
                <div v-else>
                  <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
                  <el-button type="text" @click="handleDeleteGift(scope.row)">删除</el-button>
                </div>
              </div>
              <div v-else>
                <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)">保存</el-button>
                <el-button type="text" @click="handleDeleteGift(scope.row)">删除</el-button>
              </div>
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
    <select-goods
      v-if="isduring"
      :promotionType="typeMain"
      :selectList="selectList"
      :selectVisible="selectVisible"
      :specGoods="specGoods"
      :goodsinduring="goodsinduring"
      @visible-change="handleVisible"
      @choose-submit="handleAdd"
      @choose-spec="handspec"
    ></select-goods>
    <select-goods
      v-else
      :promotionType="typeMain"
      :promotionId="(addCoupon.promotion_id).toString()"
      :selectList="selectList"
      :selectVisible="selectVisible"
      @visible-change="handleVisible"
      @choose-submit="handleAdd"
    ></select-goods>

    <!-- 赠品 -->
    <el-dialog width="500px" title="请输入商品ID，多个商品ID需用逗号间隔输入" :visible.sync="addVisibleidGift">
      <el-input type="textarea" :rows="6" v-model="goodsIdsGift" placeholder="请输入商品ID"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisibleidGift=false">取 消</el-button>
        <el-button type="primary" @click="addGoodsById('gift')">确 定</el-button>
      </div>
    </el-dialog>
    <select-goods
      v-if="isduring"
      :subType="'gift'"
      :promotionType="type"
      :specGoods="specGiftGoods"
      :goodsinduring="goodsgiftinduring"
      :selectList="selectListGift"
      :selectVisible="selectVisibleGift"
      @visible-change="handleVisibleGift"
      @choose-submit="handleAddGift"
      @choose-spec="handgiftspec"
    ></select-goods>
    <select-goods
      v-else
      :subType="'gift'"
      :promotionType="type"
      :promotionId="(addCoupon.promotion_id).toString()"
      :selectList="selectListGift"
      :selectVisible="selectVisibleGift"
      @visible-change="handleVisibleGift"
      @choose-submit="handleAddGift"
    ></select-goods>

    <el-row type="flex" justify="center">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </el-form>
</template>
<script>
import SelectGoods from "@/components/SelectGoods";
import ticket from "@/api/activity/ticket";
import giftbuy from "@/api/activity/giftbuy";
import { spanArr } from "@/utils/spanArr";

export default {
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择活动开始时间"));
      } else {
        this.$refs.addCoupon.validateField("end_time");
        callback();
      }
    };

    const validateEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择活动结束时间"));
      } else {
        if (value < this.addCoupon.start_time) {
          callback(new Error("活动结束时间需要大于活动开始时间"));
        } else {
          callback();
        }
      }
    };

    return {
      showBtnBatch:false,    //批量导入按钮
      specGoodsGiftSkuid:[], //副品sku
      specGoodsSkuid:[],  //主sku
      specGiftGoods: [], //活动中 关闭的商品
      specGoods: [], //活动中 关闭的商品
      goodsgiftinduring: [], //活动中商品
      goodsinduring: [], //活动中商品
      isduring: false, //是否在活动中
      typeMain: "GiftBuy",
      type: "gift",
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
        promotion_id: "",
        start_time: "",
        end_time: "",
        items: [],
        arguments: {
          gifts: []
        }
      },
      addRules: {
        promotion_name: [
          { required: true, message: "请输入1~60个字符", trigger: "blur" },
          { min: 1, max: 60, message: "请输入1~60个字符", trigger: "blur" }
        ],
        start_time: [{ validator: validateStartTime, trigger: "blur" }],
        end_time: [{ validator: validateEndTime, trigger: "blur" }]
      }
    };
  },
  computed: {
    selectList() {
      let list = [];
      this.goodsList.map(item => {
        list.indexOf(item.item_id) == -1 && list.push(item.item_id);
      });
      return list;
    },
    selectListGift() {
      let list = [];
      this.goodsListGift.map(item => {
        list.indexOf(item.item_id) == -1 && list.push(item.item_id);
      });
      return list;
    },
    spanArr() {
      return spanArr(this.goodsList);
    },
    spanArrGift() {
      return spanArr(this.goodsListGift);
    }
  },
  methods: {
    //获取初始数据
    getGiftBuyDetail(params) {
      giftbuy.getGiftBuyDetail(params).then(res => {
        if (res.code == 0) {
          this.addCoupon.promotion_name = res.data.activity_info.name;
          this.addCoupon.start_time = res.data.activity_info.start_time;
          this.addCoupon.end_time = res.data.activity_info.end_time;
          this.showBtnBatch = res.data.activity_info.status == 10 ? false : true

          this.goodsList = res.data.main_items;
          this.goodsListGift = res.data.gift_items;
          this.goodsList.map(item => {
            if (this.isduring) {
              this.$set(item, "isinduring", true);
              this.specGoods.push(item.item_id);
              this.specGoodsSkuid.push(item.sku_id)
            }
          });
          let _deletspec = JSON.parse(JSON.stringify(res.data.main_items));
          let _data = [];
          _deletspec.map((item, index) => {
            item.selected = false;
            _data.push(item);
          });
          this.goodsinduring = _data;
          // this.goodsinduring = JSON.parse(JSON.stringify(res.data.main_items))

          this.goodsListGift.map(item => {
            this.$set(item, "edit", false);
            if (this.isduring) {
              this.$set(item, "isinduring", true);
              this.specGiftGoods.push(item.item_id);
              this.specGoodsGiftSkuid.push(item.sku_id)
            }
          });
          let _deletspecgift = JSON.parse(JSON.stringify(res.data.gift_items));
          let _datagift = [];
          _deletspecgift.map((item, index) => {
            item.selected = false;
            _datagift.push(item);
          });
          this.goodsgiftinduring = _datagift;
          // this.goodsgiftinduring = JSON.parse(JSON.stringify(res.data.gift_items))
        }
      });
    },
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
      let promotion_type_code = type == "goods" ? "GiftBuy" : "gift";

      if (this.goodsIds || this.goodsIdsGift) {
        let _item_id = ''
        if (type == 'goods') {
            _item_id = JSON.parse(JSON.stringify(this.goodsIds))
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
        }else{
          _item_id = JSON.parse(JSON.stringify(this.goodsIdsGift))
          if (this.showBtnBatch == false) {
            let _goodsids = []
            if ( this.goodsIdsGift.indexOf(',') != -1) {
              _goodsids =  this.goodsIdsGift.split(',')
            }else if ( this.goodsIdsGift.indexOf('，') != -1) {
              _goodsids =  this.goodsIdsGift.split('，')
            }else{
              _goodsids.push( this.goodsIdsGift)
            }
            this.goodsListGift.map((mitem, mindex)=>{
              if (_goodsids.indexOf(mitem.item_id) == -1) {
                _goodsids.push(mitem.item_id)
              }
            })
            _item_id = _goodsids.join(',')
          }
        }
        
        ticket.importItemsById({
            item_id: _item_id,
            promotion_type: promotion_type_code,
            promotion_id: this.isduring ? '' : this.addCoupon.promotion_id,
            return_by: "sku"
          })
          .then(res => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              if (type == "goods") {
                // this.goodsFilter(result.itemList);
                if (this.isduring) {
                  this.goodsAdds(result.itemList);
                }else{
                  this.goodsFilter(result.itemList);
                }
              } else if (type == "gift") {
                if (this.isduring) {
                  this.goodsAddsGift(result.itemList);
                }else{
                  this.goodsFilterGift(result.itemList);;
                }
              }
            }
            if (result.inValidItems.length != 0) {
              for (let i = 0; i < result.inValidItems.length; i++) {
                errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>";
              }
            }
            if (result.unsatisfiedItems.length != 0) {
              for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                errMsg +=
                  "<p>参加了不可叠加的商品:" +
                  result.unsatisfiedItems[i] +
                  "</p>";
              }
            }
            if (errMsg) {
              this.$message({
                showClose: true,
                dangerouslyUseHTMLString: true,
                message: errMsg,
                type: "warning"
              });
            }
          });
      }

      if (type == "goods") {
        this.goodsIds = "";
        this.addVisibleid = false;
      } else if (type == "gift") {
        this.goodsIdsGift = "";
        this.addVisibleidGift = false;
      }
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
            let _skuhas = this.specGoodsSkuid.indexOf(item.sku_id)
            if (_skuhas == -1) {
                item.edit = false
                _addgoods.push(item)
            }
          }else{
            item.edit = false
            _addgoods.push(item)
          }
        })
        this.goodsList = this.goodsinduring.concat(_addgoods)
      },
      // 展示所有商品
      goodsAddsGift(items){
        let _addgoods = []
        items.map((item, index)=>{
          let _goodsinduringindex = this.specGiftGoods.indexOf(item.item_id) 
          if (_goodsinduringindex != -1) {
            this.goodsgiftinduring.map((items, indes)=>{
              if (items.item_id == item.item_id) {
                items.isinduring = false
                items.selected = true
              }
            })
            let _skuhas = this.specGoodsGiftSkuid.indexOf(item.sku_id)
            if (_skuhas == -1) {
                item.edit = false
                _addgoods.push(item)
            }
          }else{
            item.edit = false
            _addgoods.push(item)
          }
        })
        this.goodsListGift = this.goodsgiftinduring.concat(_addgoods)
      },
    // 添加过滤已经存在的商品
    goodsFilter(items) {
      for (let i = 0; i < items.length; i++) {
        let flag = false;
        if (this.goodsList.length != 0) {
          for (let j = 0; j < this.goodsList.length; j++) {
            items[i].sku_id == this.goodsList[j].sku_id && (flag = true);
          }
        }
        if (!flag) {
          this.goodsList.push(items[i]);
        }
      }

      let list = [];
      items.map(item => {
        list.push(item.item_id);
      });

      for (let n = 0; n < this.goodsList.length; n++) {
        if (list.indexOf(this.goodsList[n].item_id) == -1) {
          this.goodsList.splice(n, 1);
          n--;
        }
      }
    },
    goodsFilterGift(items) {
      for (let i = 0; i < items.length; i++) {
        let flag = false;
        if (this.goodsListGift.length != 0) {
          for (let j = 0; j < this.goodsListGift.length; j++) {
            items[i].sku_id == this.goodsListGift[j].sku_id && (flag = true);
          }
        }
        if (!flag) {
          this.goodsListGift.push(items[i]);
          this.$set(items[i], "edit", false);
          this.$set(items[i], "quantity", 1);
        }
      }

      let listGift = [];
      items.map(item => {
        listGift.push(item.item_id);
      });

      for (let n = 0; n < this.goodsListGift.length; n++) {
        if (listGift.indexOf(this.goodsListGift[n].item_id) == -1) {
          this.goodsListGift.splice(n, 1);
          n--;
        }
      }
    },
    // 处理选择商品弹框显示与隐藏
    handleVisible(val) {
      this.selectVisible = val;
    },
    handleVisibleGift(val) {
      this.selectVisibleGift = val;
    },
    //选择商品添加
    handleAdd(val) {
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
          promotion_type: "GiftBuy",
          promotion_id: this.isduring ? '' :  this.addCoupon.promotion_id,
          return_by: "sku"
        })
        .then(res => {
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
              errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>";
            }
          }
          if (result.unsatisfiedItems.length != 0) {
            for (let i = 0; i < result.unsatisfiedItems.length; i++) {
              errMsg +=
                "<p>参加了不可叠加的商品:" +
                result.unsatisfiedItems[i] +
                "</p>";
            }
          }
          if (errMsg) {
            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: errMsg,
              type: "warning"
            });
          }
        });
    },
    handleAddGift(val) {
      let _postval = []
      val.map((item, index)=>{
        let _inindex = this.specGiftGoods.indexOf(item)
        if (_inindex == -1) {
          _postval.push(item)
        }else{
          if (this.goodsgiftinduring[_inindex].selected == true) {
            _postval.push(item)
          }
        }
      })
      ticket.importItemsById({
          item_id: this.isduring ? _postval : val,
          promotion_type: "gift",
          promotion_id: this.isduring ? '' : this.addCoupon.promotion_id,
          return_by: "sku"
        })
        .then(res => {
          const result = res.data;
          let errMsg = "";
          if (result.itemList.length != 0) {
            if (this.isduring) {
              this.goodsAddsGift(result.itemList);
            }else{
              this.goodsFilterGift(result.itemList);;
            }
          }
          if (result.inValidItems.length != 0) {
            for (let i = 0; i < result.inValidItems.length; i++) {
              errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>";
            }
          }
          if (result.unsatisfiedItems.length != 0) {
            for (let i = 0; i < result.unsatisfiedItems.length; i++) {
              errMsg +=
                "<p>参加了不可叠加的商品:" +
                result.unsatisfiedItems[i] +
                "</p>";
            }
          }
          if (errMsg) {
            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: errMsg,
              type: "warning"
            });
          }
        });
    },
    handspec(val) {
       let _data = []
        val.map((item, index)=>{
          let _specindex = this.specGoods.indexOf(item.item_id)
          if(_specindex != -1){
            // this.goodsinduring[_specindex].isinduring = item.selected == true ? false : true
            // this.goodsinduring[_specindex].selected = item.selected
            this.goodsinduring.map((items, indes)=>{
              if (items.item_id == item.item_id) {
                items.isinduring = item.selected == true ? false : true
                items.selected = item.selected
              }
            }) 
            let _skuhas = this.specGoodsSkuid.indexOf(item.sku_id)
            if (_skuhas == -1) {
                item.edit = false
                _data.push(item)
            }
          }else{
            _data.push(item)
          }
        })
        this.goodsList = this.goodsinduring.concat(_data)
    },
    handgiftspec(val) {
      let _data = []
        val.map((item, index)=>{
          let _specindex = this.specGiftGoods.indexOf(item.item_id)
          if(_specindex != -1){
            this.goodsgiftinduring.map((items, indes)=>{
              if (items.item_id == item.item_id) {
                items.isinduring = item.selected == true ? false : true
                items.selected = item.selected
              }
            })
            let _skuhas = this.specGoodsGiftSkuid.indexOf(item.sku_id)
            if (_skuhas == -1) {
                item.edit = false
                _data.push(item)
            }
          }else{
            _data.push(item)
          }
        })
        this.goodsListGift = this.goodsgiftinduring.concat(_data)
    },
    //表格合并处理方法
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        columnIndex === 1 ||
        columnIndex === 2 ||
        columnIndex === 7
      ) {
        if (this.spanArr[rowIndex] == 1) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if (this.spanArr[rowIndex] == 0) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          };
        }
      }
    },
    //行编辑
    handleEdit(row) {
      this.goodsListGift.map(item => {
        if (item.id == row.id) {
          item.edit = true;
        }
      });
    },
    //验证赠送数量
    handleCheck(row) {
      const posInteger = /^(\d+)$/;

      if (
        !posInteger.test(row.quantity) ||
        parseInt(row.quantity) > row.store ||
        row.quantity == 0
      ) {
        this.$message({
          showClose: true,
          message: "仅限输入正整数，活动库存不得大于可售库存",
          type: "warning"
        });
      } else {
        row.edit = false;
      }
    },
    // 关闭主商品
    handleClose(row) {
      giftbuy
        .closeItem({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id
        })
        .then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: "success"
            });
            this.getGiftBuyDetail({
              promotion_id: this.addCoupon.promotion_id,
              page: 1,
              page_size: -1
            });
          }
        });
    },
    // 关闭赠品
    handleGiftClose(row) {
      giftbuy
        .closeItem({
          promotion_id: this.pageInfo.promotion_id,
          item_id: row.item_id,
          sku_id: row.sku_id
        })
        .then(res => {
          if (res.code == 0) {
            this.$message({
              showClose: true,
              message: "关闭商品成功",
              type: "success"
            });
            this.getGiftBuyDetail({
              promotion_id: this.addCoupon.promotion_id,
              page: 1,
              page_size: -1
            });
          }
        });
    },
    //删除商品
    handleDelete(row) {
      this.goodsList = this.goodsList.filter(item => {
        return item.item_id != row.item_id;
      });
    },
    handleDeleteGift(row) {
      this.goodsListGift = this.goodsListGift.filter(item => {
        return item.sku_id != row.sku_id;
      });
    },
    // 提交添加商品
    handleSubmit() {
      this.$refs.addCoupon.validate(valid => {
        if (valid) {
          let items = [];
          let argumentsList = [];

          this.goodsList.map(item => {
            items.push({
              item_id: item.item_id,
              sku_id: item.sku_id,
              price: item.promotion_price
            });
          });

          this.goodsListGift.map(item => {
            argumentsList.push({
              item_id: item.item_id,
              sku_id: item.sku_id,
              quantity: item.quantity
            });
          });

          if (this.isduring) {
            let _list = this.returnHasList(this.goodsinduring, items);
            let _listgift = this.returnHasList(this.goodsgiftinduring,argumentsList);

            let _postData = JSON.parse(JSON.stringify(this.addCoupon));
                  _postData.items = _list
                  _postData.gifts = _listgift
            // let _postGiftData = JSON.parse(JSON.stringify(this.addCoupon));

            // let _appendoktime = 0;
            // if (_list.length > 0) {
              // _postData.items = _list;
              if (_list.length < 1 && _listgift.length < 1) {
                this.appendOk();
                return
              }
              giftbuy.appendItems(_postData).then(res => {
                if (res.code == 0) {
                  // _appendoktime++;
                  // if (_appendoktime >= 2) {
                    if (res.data.message && res.data.message.length > 0) {
                      res.data.message.map((item, index)=>{
                        this.$message.error(item);
                      })
                    }else{
                      this.appendOk();
                    }
                      
                    // }
                }
              });
          } else {
            this.addCoupon.items = JSON.stringify(items);
            this.addCoupon.arguments.gifts = argumentsList;
            this.addCoupon.arguments = JSON.stringify(this.addCoupon.arguments);

            giftbuy.updateGiftBuy(this.addCoupon).then(res => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  message: "创建成功",
                  type: "success"
                });
                this.$router.push({ name: "giftbuy" });
              }
            });

            this.addCoupon.arguments = JSON.parse(this.addCoupon.arguments);
          }
        }
      });
    },
    returnHasList(list = [], newlist = []) {
      let _list = [];
      let _itemids = [];
      list.map((itemc, indexc) => {
        if (!itemc.selected) {
          _itemids.push(itemc.item_id);
        }
        // _itemids.push(itemc.item_id)
      });
      newlist.map((itemss, indexss) => {
        if (_itemids.indexOf(itemss.item_id) == -1) {
          _list.push(itemss);
        }
      });
      return _list;
    },
    appendOk() {
      this.$message({
        showClose: true,
        message: "创建成功",
        type: "success"
      });
      this.$router.push({ name: "giftbuy" });
    },
    //取消
    handleCancel() {
      this.$router.push({ name: "giftbuy" });
    }
  },
  components: {
    SelectGoods
  },
  created() {
    this.isduring = this.$route.query.activity_status == 30;
    this.addCoupon.promotion_id = this.$route.query.promotion_id;
    this.getGiftBuyDetail({
      promotion_id: this.addCoupon.promotion_id,
      page: 1,
      page_size: -1
    });
  }
};
</script>

<style lang='scss' scoped>
.basic {
  margin: 20px;
  padding: 20px;
  padding-bottom: 0px;
  border: 1px solid #ddd;
  border-radius: 4px;
  .el-input {
    width: 200px;
  }
}
.goods,
.gifts {
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
  .btn {
    margin-bottom: 20px;
  }
  .goods_url {
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
