<template>
  <div class="main">
    <el-card>
      <div slot="header" class="header">
        <span>WAP店铺装修</span>
        <div class="btnGroup">
          <el-button type="primary" @click="savePcDecorate">发布</el-button>
        </div>
      </div>
      <div class="body">
        <div class="left">
          <i class="el-icon-picture" @click="addSlide"></i>
          <p>轮播图</p>
          <i class="el-icon-tickets" @click="addCoupon"></i>
          <p>优惠券</p>
          <i class="el-icon-menu" @click="addFloor"></i>
          <p>楼层</p>
        </div>
        <div class="right">
          <el-input  style="width:100%" size="small" placeholder="搜索本店内商品"></el-input>
          <!-- 店铺信息 -->
          <div class="title">
            <img width="50" height="50" :src="sign.shop_logo+'_t.jpg'" :onerror="defaultImg"><span class="name">{{sign.shop_name}}</span>
          </div>
          <!-- 导航 -->
          <div class="nav">
            <ul class="nav-list">
              <li>店铺首页</li>
              <li>全部商品</li>
            </ul>
          </div>
          <div class="content">
            <!-- 商品 -->
            <div class="goods" v-for="(item,index) in modules" :key="index"  v-if="item.type=='floor'">
              <p class="goods-title">
                {{item.name}}
                <el-button class="fr" @click="deleteFloor(item.sort)">删除</el-button>
                <el-button class="fr" @click="showFloorDialog(item,index)">编辑</el-button>
                <el-button class="fr" type="text" @click="modulesBottom(index)"><i class="el-icon-back down "></i></el-button>
                <el-button class="fr" type="text" @click="modulesTop(index)"><i class="el-icon-back up"></i></el-button>
              </p>
              <div class="main">
                <ul class="goods-list">
                  <li v-for="list in item.data">
                    <img :src="list.primary_image+'_s.jpg'">
                    <p class="name">{{list.title}}</p>
                    <span>¥{{list.sell_price}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 优惠券 -->
            <div class="coupons" v-else-if="item.type=='coupon'">
              <p class="coupons-title">
                优惠券
                <el-button class="fr" @click="deleteFloor(item.sort)">删除</el-button>
                <el-button class="fr" type="text" @click="modulesBottom(index)"><i class="el-icon-back down "></i></el-button>
                <el-button class="fr" type="text" @click="modulesTop(index)"><i class="el-icon-back up"></i></el-button>
              </p>
              <div class="main">
                <ul class="coupons-list">
                  <li v-if="index<2" v-for="(list,index) in item.data">
                    <p>{{list.name}}</p>
                    <p>¥ {{list.deduct_money}}</p>
                    <p>满{{list.limit_money}}可用</p>
                  </li>
                </ul>
              </div>
            </div>
            <!-- 轮播图 -->
            <div class="slide" v-else>
              <p class="slide-title">
                轮播图
                <el-button class="fr" @click="deleteFloor(item.sort)">删除</el-button>
                <el-button class="fr" @click="showSlideDialog(item,index)">编辑</el-button>
                <el-button class="fr" type="text" @click="modulesBottom(index)"><i class="el-icon-back down "></i></el-button>
                <el-button class="fr" type="text" @click="modulesTop(index)"><i class="el-icon-back up"></i></el-button>
              </p>
              <div class="main">
                <img  v-if="item.data.length" :src="item.data[0].image">
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 商品楼层弹窗 -->
    <el-dialog title="楼层" :visible.sync="floorVisible" :close-on-click-modal="false">
      <div>
        <span>楼层标题：</span>
        <el-input v-model="floor_message.name" size="small"></el-input>
        10个字符以内，推荐使用四个汉字
      </div>
      <div class="floor-dialog-body">
        <el-table :data="floor_message.data" border >
          <el-table-column
            label="上传商品">
            <template slot-scope="scope">
              <img class="table-img" width="50" height="50" :src="scope.row.primary_image+'_t.jpg'">
              <span style="margin-left: 10px">{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goodsTop(scope.$index)"><i class="el-icon-back up"></i></el-button>
              <el-button type="text" size="small" @click="goodsBottom(scope.$index)"><i class="el-icon-back down "></i></el-button>
              <el-button class="delete" type="primary" size="small" @click="deleteGood(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="floor-dialog-footer">
        <el-button @click="selectVisible=true"><i class="el-icon-plus">添加商品</i> </el-button>
        <el-button type="primary" @click="saveGood"> 保存</el-button>
      </div>
    </el-dialog>

    <!-- 轮播图弹窗 -->
    <el-dialog title="轮播图"  width="70%" :visible.sync="slideVisible" :close-on-click-modal="false">
      <div class="floor-dialog-body slide-dialog-body">
        <el-table :data="floor_message.data" border >
          <el-table-column
            label="图片地址">
            <template slot-scope="scope">
              图片地址：<el-input v-model="scope.row.image"></el-input>
              <el-button size="samll" @click="showPicSelect(scope.$index)">选择图片</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="链接地址">
            <template slot-scope="scope">
              链接地址：<el-input v-model="scope.row.link"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            width="180"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="goodsTop(scope.$index)"><i class="el-icon-back up"></i></el-button>
              <el-button type="text" size="small" @click="goodsBottom(scope.$index)"><i class="el-icon-back down "></i></el-button>
              <el-button class="delete" type="primary" size="small" @click="deleteGood(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="floor-dialog-footer">
        <el-button @click="addSlideList"><i class="el-icon-plus">添加</i> </el-button>
        <el-button type="primary" @click="saveSlide"> 保存</el-button>
      </div>
    </el-dialog>

    <!-- 图片选择 -->
    <el-dialog width="70%" :visible="imgSeclect" :show-close="false" :close-on-click-modal="false">
      <sell-img-select ref="refimguse" />
      <div slot="footer" class="floor-dialog-footer">
        <el-button @click="imgSeclect=false">取消</el-button>
        <el-button type="primary" @click="savePic">确定</el-button>
      </div>
    </el-dialog>

    <select-goods :selectVisible="selectVisible" :onlyShelving="'1'" :selectList="[]" @visible-change="handleVisible" @choose-submit="selectGoods"></select-goods>
  </div>
</template>

<script>
import SellImgSelect from '@/views/goods/imgspace/sellimgselect'
import SelectGoods from '@/components/SelectGoods'  
import { mapGetters } from 'vuex'
import shops from '@/api/shops'
import ticket from '@/api/activity/ticket'

const urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[trc\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/

export default {
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../assets/good-defalut.png') + '"',
      selectVisible: false,
      sign: {},
      modules: [],
      has_coupon: false,
      floorVisible: false,
      floor_message: {},
      slideVisible: false,
      imgSeclect: false,
      currentModule: {},
      picIndex: 0
    }
  },
  methods: {
    selectGoods(val){
      ticket.importItemsById({
        item_id: val
      }).then((res)=>{
        if(res.code == 0){
          let length = this.floor_message.data.length

          for(let i = 0; i < length; i++){
            res.data.itemList = res.data.itemList.filter((item)=>{
              return item.id != this.floor_message.data[i].id
            })
          }

          res.data.itemList.map((item,index)=>{
            item.sort = length+index
            this.floor_message.data.push(item)
          })
        }
      })
      
    },
    // 处理选择商品弹框显示与隐藏
    handleVisible(val){
      this.selectVisible = val;
    },
    // 初始化页面
    wapIndex(params){
      shops.wapIndex(params).then((res)=>{
        if(res.code==0){
          this.sign = res.data.sign
          this.modules = res.data.shop_decoration_data.modules

          this.modules.map((item)=>{
            item.type=="coupon" && (this.has_coupon = true)
          })
        }
      })
    },
    //显示商品楼层选择框
    showFloorDialog(item,index){
      this.floorVisible = true
      this.currentModule = index
      this.floor_message = JSON.parse(JSON.stringify(item))
    },
    //删除楼层
    deleteFloor(val){
      if(this.modules[val].type == "coupon"){
        this.has_coupon = false
      }
      
      for(let i=val+1;i<this.modules.length;i++){
        this.modules[i].sort -= 1
      }

      this.modules.splice(val,1)
    },
    //添加优惠券
    addCoupon(){
      if(this.has_coupon){
        this.$message({
          showClose: true,
          message: '优惠券只能添加一份',
          type: 'warning'
        })
      }else{
        shops.shopCoupons().then((res)=>{
          if(res.data.length){
            this.modules.push({
              name: '优惠券',
              type: 'coupon',
              data: res.data,
              sort: this.modules.length
            })
            this.has_coupon = true
            this.$message({
              showClose: true,
              message: '添加优惠券楼层成功',
              type: 'success'
            })
          }else{
            this.$message({
              showClose: true,
              message: '请先配置优惠券',
              type: 'error'
            })
          }
        })
      }
    },
    //添加楼层
    addFloor(){
      this.modules.push({
        name: '新楼层',
        type: 'floor',
        sort: this.modules.length,
        data: []
      })
      this.$message({
        showClose: true,
        message: '添加楼层成功',
        type: 'success'
      })
    },
    //添加轮播图
    addSlide(){
      this.modules.push({
        name: '轮播图',
        type: 'slide',
        sort: this.modules.length,
        data: []
      })
      this.$message({
        showClose: true,
        message: '添加楼层成功',
        type: 'success'
      })
    },
    //模块上移
    modulesTop(val){
      if(val==0){
        return
      }else{
        let flag = this.modules[val-1]
        this.modules.splice(val-1,1,this.modules[val])
        this.modules.splice(val,1,flag)

        this.modules[val-1].sort --
        this.modules[val].sort ++
      }
    },
    //模块下移
    modulesBottom(val){
      if(val==this.modules.length-1){
        return
      }else{
        let flag = this.modules[val+1]
        this.modules.splice(val+1,1,this.modules[val])
        this.modules.splice(val,1,flag)

        this.modules[val+1].sort ++
        this.modules[val].sort --
      }
    },
    //删除商品
    deleteGood(id){
      this.floor_message.data = this.floor_message.data.filter((item)=>{
        return item.id !== id
      })

      this.floor_message.data.map((item,index)=>{
        item.sort = index
      })
    },
    //商品上移
    goodsTop(val){
      if(val==0){
        return
      }else{
        let data = this.floor_message.data
        let flag = data[val-1]
        data.splice(val-1,1,data[val])
        data.splice(val,1,flag)

        data[val-1].sort --
        data[val].sort ++
      }
    },
    //商品下移
    goodsBottom(val){
      let data = this.floor_message.data

      if(val==data.length-1){
        return
      }else{
        let flag = data[val+1]
        data.splice(val+1,1,data[val])
        data.splice(val,1,flag)

        data[val+1].sort ++
        data[val].sort --
      }
    },
    //保存商品
    saveGood(){
      if(this.floor_message.name.length > 10 || this.floor_message.name.length == 0){
        this.$message({
          showClose: true,
          message: '请填写符合要求的楼层名',
          type: 'error'
        })
      }else{
        this.$set(this.modules,this.currentModule,JSON.parse(JSON.stringify(this.floor_message)))
        this.floorVisible = false
      }
    },
    //显示轮播图弹窗
    showSlideDialog(item,index){
      this.slideVisible = true
      this.currentModule = index
      this.floor_message = JSON.parse(JSON.stringify(item))

      this.floor_message.data.map((item,index)=>{
        item.id = index
      })
    },
    //添加轮播图一张
    addSlideList(){
      this.floor_message.data.push({
        image: '',
        link: '',
        sort: this.floor_message.data.length-1,
        id: this.floor_message.data.length-1
      })
    },
    //展示选图框
    showPicSelect(index){
      this.picIndex = index
      this.imgSeclect = true
    },
    //选图确定
    savePic(){
      if(!this.floor_message.data.length){
        this.floor_message.data = [{}]
      }
      this.$set(this.floor_message.data[this.picIndex],"image",this.sellImgSrc)
      this.imgSeclect = false
    },
    //保存轮播图
    saveSlide(){
      if(this.floor_message.data.length == 0 || this.floor_message.data.length > 10){
        this.$message({
          showClose: true,
          message: '至少配置一张图片及链接且不超过10张',
          type: 'error'
        })
      }else{
        let isNull = false
        this.floor_message.data.map((item)=>{
          if(!item.image || !item.link || !urlReg.test(item.link)){
            isNull = true
          }
        })
        if(isNull){
          this.$message({
            showClose: true,
            message: '请填写正确的图片链接或者泰然城链接',
            type: 'error'
          })
        }else{
          this.$set(this.modules,this.currentModule,JSON.parse(JSON.stringify(this.floor_message)))
          this.slideVisible = false
        }
      }
    },
    //发布
    savePcDecorate(){
      let params = {
        platform: 'app',
        modules_data: []
      }

      this.modules.map((item)=>{
        if(item.type == 'coupon'){
          params.modules_data.push({
            name: '优惠券',
            sort: item.sort,
            data: {
              type: 'coupon',
              is_show_coupon: '1'
            }
          })
        }else if(item.type == 'floor'){
          let item_list =[]
          item.data.map((obj)=>{
            item_list.push({
              item_id: obj.id,
              sort: obj.sort
            })
          })

          params.modules_data.push({
            name: item.name,
            sort: item.sort,
            data: {
              type: 'floor',
              item_list: item_list
            }
          })
        }else{
          let list =[]
          item.data.map((obj)=>{
            list.push({
              link: obj.link,
              image: obj.image,
              sort: obj.sort
            })
          })

          params.modules_data.push({
            name: "轮播图",
            sort: item.sort,
            data: {
              type: 'slide',
              list: list
            }
          })
        }
      })

      shops.saveWapDecorate(params).then((res)=>{
        if(res.code == 0){
          res.data.result && this.$message({
            showClose: true,
            message: '发布成功',
            type: 'success'
          })  
          this.wapIndex({platform:'app'})
        }
      })
    }
  },
  computed: {
    ...mapGetters([
      'sellImgSrc'
    ])
  },
  components: {
    SellImgSelect,
    SelectGoods
  },
  created(){
    this.wapIndex({platform:'app'})
  }
}

</script>

<style lang='scss' scoped>

.main{
  margin: 20px;
  .header{
    overflow: hidden;
    height: 40px;
    line-height: 38px;
    .btnGroup{
      float: right
    }
  }
  .body{
    overflow: hidden;
    .left{
      float: left;
      width: 80px;
      text-align: center;
      i{
        font-size: 30px;
        cursor: pointer;
      }
      p{
        margin: 10px 0 
      }
    }
    .right{
      float: left;
      width: 400px;
      padding: 20px; 
      border: 2px solid #ddd;
      .title{
        height: 80px;
        line-height: 80px;
        img{
          margin-bottom: 10px;
        }
        .name{
          display: inline-block;
          overflow: hidden;
          width: 294px;
          height: 80px;
          margin-left: 10px; 
          color: #2b88cb;
          font-size: 22px;
        }
      }
      .nav{
        height: 50px;
        line-height: 50px;
        border: 1px solid #ddd;
        .nav-list{
          overflow: hidden;
          li{
            float: left;
            text-align: center;
            width: 50%;
            border-right: 1px solid #ddd;
          }
        }
        .nav-btn{
          float: right;
          margin: 5px;
        }
      }
      .content{
        .goods{
          .goods-title{
            margin: 10px 0;
            padding-left: 20px;
            border: 1px solid #ddd;
            height: 54px;
            line-height: 54px;
            .el-button{
              margin: 5px 5px; 
            }
          }
          .main{
            margin: 0;
            overflow: hidden;
            .goods-list{
              overflow: hidden;
              li{
                float: left;
                width: 170px;
                margin-bottom: 10px; 
                &:nth-child(2n+1){
                  margin-right: 16px; 
                }
                img{
                  border: 1px solid #ddd;
                  padding: 10px;
                  width: 164px;
                  height: 164px;
                }
                .name{
                  height: 36px;
                  margin: 0;
                  margin-bottom: 10px;
                  overflow: hidden;
                }

              }
            }
          }
        }
        .coupons{
          .coupons-title{
            margin: 10px 0;
            padding-left: 20px;
            border: 1px solid #ddd;
            height: 54px;
            line-height: 54px;
            .el-button{
              margin: 5px 5px; 
            }
          }
          .main{
            margin: 0;
            overflow: hidden;
            .coupons-list{
              overflow: hidden;
              li{
                float: left;
                background: #fff4f1;
                border: 1px solid #e6ddda;
                width: 168px;
                margin-bottom: 10px;
                margin-right: 10px;
                p{
                  text-align: center;
                  color: #D12548;
                } 
              }
            }
          }
        }
        .slide{
          .slide-title{
            margin: 10px 0;
            padding-left: 20px;
            border: 1px solid #ddd;
            height: 54px;
            line-height: 54px;
            .el-button{
              margin: 5px 5px; 
            }
          }
          .main{
            margin: 0;
            img{
              width: 100%;
              height: 120px;
            }
          }
        }
      }
    }
  }
  .floor-dialog-footer{
    text-align: center
  }
  .floor-dialog-body{
    margin-top: 10px;
    height: 450px;
    border: 1px solid #ddd;
    overflow: auto;
  }
  .slide-dialog-body{
    .el-input{
      margin-right: 10px;
    }
  }
  .up{
    font-size: 24px;
    transform:rotate(90deg);
  }
  .down{
    font-size: 24px;
    transform:rotate(270deg);
  }
  .fr{
    float: right;
  }
  .el-input{
    width: 150px;
    margin-right: 100px;
  }
  .table-img{
    vertical-align: middle
  }
}
</style>
