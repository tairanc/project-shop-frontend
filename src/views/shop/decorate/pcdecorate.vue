<template>
  <div class="main">
    <el-card>
      <div slot="header" class="header">
        <span>PC店铺装修</span>
        <div class="btnGroup">
          <el-button @click="prePcDecorate">预览</el-button>
          <el-button type="primary" @click="savePcDecorate">发布</el-button>
        </div>
      </div>
      <div class="body">
        <div class="left">
          <i class="el-icon-tickets" @click="addCoupon"></i>
          <p>优惠券</p>
          <i class="el-icon-menu" @click="addFloor"></i>
          <p>楼层</p>
        </div>
        <div class="right">
          <!-- 店铺信息 -->
          <div class="title">
            <img width="50" height="50" :src="sign.shop_logo+'_t.jpg'" :onerror="defaultImg"><span class="name">{{sign.shop_name}}</span>
          </div>
          <!-- 导航 -->
          <div class="nav">
            <ul class="nav-list">
              <li>所有分类</li>
              <li>首页</li>
              <li v-for="(list,index) in nav" :key="index">{{list.cat_name}}</li>
            </ul>
            <el-button  class="nav-btn" type="primary" @click="showNavDialog">编辑</el-button>
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
            <div class="coupons" v-else>
              <p class="coupons-title">
                优惠券
                <el-button class="fr" @click="deleteFloor(item.sort)">删除</el-button>
                <el-button class="fr" type="text" @click="modulesBottom(index)"><i class="el-icon-back down "></i></el-button>
                <el-button class="fr" type="text" @click="modulesTop(index)"><i class="el-icon-back up"></i></el-button>
              </p>
              <div class="main">
                <ul class="coupons-list">
                  <li v-for="list in item.data">
                    <p>{{list.name}}</p>
                    <p>¥ {{list.deduct_money}}</p>
                    <p>满{{list.limit_money}}可用</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 导航弹窗 -->
    <el-dialog title="导航" :visible.sync="navVisible" :close-on-click-modal="false">
      <span>管理分类（未关联商品的分类不展示）</span>
      <div class="nav-dialog-body">
        <div class="list">
          <div class="first">
            <i style="font-style:normal">首页</i>
          </div>
        </div>
        <div class="list" v-for="(item,index) in nav_message">
          <div class="first">
            <i :class="item.show?'el-icon-remove':'el-icon-circle-plus'" @click="handleNav(item)"> {{item.cat_name}}</i>
            <el-button class="fr delete" type="primary" @click="deleteNav('first',0,item.cat_id)">删除</el-button>
            <el-button class="fr" type="text" @click="navBottom('first',0,index)"><i class="el-icon-back down "></i></el-button>
            <el-button class="fr" type="text" @click="navTop('first',0,index)"><i class="el-icon-back up"></i></el-button>
          </div>
          <div class="second" v-show="item.children.length&&item.show" v-for="(child,num) in item.children">
            <i class="text"> {{child.cat_name}}</i>
            <el-button class="fr delete" type="primary" @click="deleteNav('second',index,child.cat_id)">删除</el-button>
            <el-button class="fr" type="text" @click="navBottom('second',index,num)"><i class="el-icon-back down "></i></el-button>
            <el-button class="fr" type="text" @click="navTop('second',index,num)"><i class="el-icon-back up"></i></el-button>
          </div>
        </div>
      </div>
      <div slot="footer" class="nav-dialog-footer">
        <el-button @click="showCateDialog"><i class="el-icon-plus">添加</i></el-button>
        <el-button type="primary" @click="saveNav"> 保存</el-button>
      </div>
    </el-dialog>

    <!-- 分类选择 -->
    <el-dialog title="添加导航分类" :visible.sync="cateVisible" :close-on-click-modal="false">
      <span>管理分类（未关联商品的分类不展示）</span>
      <div class="nav-dialog-body">
        <el-tree
          :data="shop_cat_list"
          show-checkbox
          node-key="id"
          highlight-current
          ref="tree"
          :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="nav-dialog-footer">
        <el-button type="primary" @click="saveCate"> 保存</el-button>
      </div>
    </el-dialog>

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

    <select-goods :selectVisible="selectVisible" :onlyShelving="'1'" :selectList="[]" @visible-change="handleVisible" @choose-submit="selectGoods"></select-goods>
  </div>
</template>

<script>
import SelectGoods from '@/components/SelectGoods'  
import shops from '@/api/shops'
import ticket from '@/api/activity/ticket'

export default {
  data() {
    return {
      defaultImg: 'this.src="' + require('../../../assets/good-defalut.png') + '"',
      selectVisible: false,
      sign: {},
      nav: [],
      modules: [],
      has_coupon: false,
      shop_cat_list: [],
      navVisible: false,
      cateVisible: false,
      floorVisible: false,
      floor_message: {},
      currentModule: {},
      nav_message: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      checkedKey: []
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
    pcIndex(params){
      shops.pcIndex(params).then((res)=>{
        if(res.code==0){
          this.sign = res.data.sign
          this.shop_cat_list = res.data.shop_cat_list
          this.nav = res.data.shop_decoration_data.nav
          this.modules = res.data.shop_decoration_data.modules

          this.modules.map((item)=>{
            item.type=="coupon" && (this.has_coupon = true)
          })

          this.nav&&this.nav.map((item)=>{
            this.$set(item,'show',true)
          })
        }
      })
    },
    //显示导航选择框
    showNavDialog(){
      this.navVisible = true
      this.nav_message = JSON.parse(JSON.stringify(this.nav))
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
      }else if(this.floor_message.data.length == 0 || this.floor_message.data.length >50){
        this.$message({
          showClose: true,
          message: '商品至少添加一个且不能超过50个',
          type: 'error'
        })
      }else{
        this.$set(this.modules,this.currentModule,JSON.parse(JSON.stringify(this.floor_message)))
        this.floorVisible = false
      }
    },
    //分类的收缩
    handleNav(item){
      item.show = !item.show
    },
    //导航上移
    navTop(type,parent,val){
      let data
      if(type == 'first'){
        data = this.nav_message
      }else {
        data = this.nav_message[parent].children
      }

      if(val==0){
        return
      }else{
        let flag = data[val-1]
        data.splice(val-1,1,data[val])
        data.splice(val,1,flag)

        data[val-1].cat_sort --
        data[val].cat_sort ++
      }
    },
    //导航下移
    navBottom(type,parent,val){
      let data
      if(type == 'first'){
        data = this.nav_message
      }else {
        data = this.nav_message[parent].children
      }

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
    //导航删除
    deleteNav(type,parent,id){
      if(type == 'first'){
        this.nav_message = this.nav_message.filter((item)=>{
          return item.cat_id != id
        }) 

        this.nav_message.map((item,index)=>{
          item.cat_sort = index
        })
      }else {
        this.nav_message[parent].children = this.nav_message[parent].children.filter((item)=>{
          return item.cat_id != id
        }) 

        this.nav_message[parent].children.map((item,index)=>{
          item.cat_sort = index
        })
        
      }  
    },
    //导航保存
    saveNav(){
      this.nav = JSON.parse(JSON.stringify(this.nav_message))
      this.navVisible = false
    },
    //选择分类弹窗
    showCateDialog(){
      this.cateVisible = true

      this.nav_message.map((item)=>{
        this.checkedKey.push(item.cat_id)
        if(item.children && item.children.length){
          item.children.map((child)=>{
            this.checkedKey.push(child.cat_id)
          })
        }
      })

      this.$nextTick(()=>{
        this.$refs.tree.setCheckedKeys(this.checkedKey)
      })
    },
    //保存分类
    saveCate(){
      let key = this.$refs.tree.getCheckedKeys()
      let newArr = []
      let child = []

      for(let i=0;i<this.shop_cat_list.length;i++){
        if(this.shop_cat_list[i].children){
          child = this.shop_cat_list[i].children.filter((item)=>{
            return key.indexOf(item.id) != -1
          })

          if(child.length>0){
            newArr.push(this.shop_cat_list[i])
            newArr[newArr.length-1].children = child
          }
        }else{
          key.indexOf(this.shop_cat_list[i].id) != -1 && newArr.push(this.shop_cat_list[i])
        }
      }

      this.nav_message = newArr
      this.nav_message.map((item,index)=>{
        item.cat_id = item.id
        item.cat_name = item.label
        item.cat_sort = index

        this.$set(item,'show',true)

        if(item.children){
          item.children.map((child,num)=>{
            child.cat_id = child.id
            child.cat_name = child.label
            child.cat_sort = num
          })
        }

      })
      this.cateVisible = false
    },
    //预览
    prePcDecorate(){
      let params = {
        platform: 'pc',
        modules_data: []
      }

      // 插入导航数据
      let list = []
      this.nav && this.nav.map((item)=>{
        list.push({
          cat_id: item.cat_id,
          sort: item.cat_sort
        })
        if(item.children){
          list[list.length-1].children = []
          item.children.map((child)=>{
            list[list.length-1].children.push({
              at_id: child.cat_id,
              sort: child.cat_sort
            })
          })
        }
      })
      params.modules_data.push({
        name: '店铺分类导航',
        sort: 1,
        data: {
          type: 'nav',
          list: list
        }
      })

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
        }else{
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

        }
      })

      shops.prePcDecorate(params).then((res)=>{
        if(res.code == 0){
          window.open(res.data.url)
        }
      })
    },
    //发布
    savePcDecorate(){
      let params = {
        platform: 'pc',
        modules_data: []
      }

      // 插入导航数据
      let list = []
      this.nav && this.nav.map((item)=>{
        list.push({
          cat_id: item.cat_id,
          sort: item.cat_sort
        })
        if(item.children){
          list[list.length-1].children = []
          item.children.map((child)=>{
            list[list.length-1].children.push({
              cat_id: child.cat_id,
              sort: child.cat_sort
            })
          })
        }
      })
      params.modules_data.push({
        name: '店铺分类导航',
        sort: 1,
        data: {
          type: 'nav',
          list: list
        }
      })

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
        }else{
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

        }
      })

      shops.savePcDecorate(params).then((res)=>{
        if(res.code == 0){
          res.data.result && this.$message({
            showClose: true,
            message: '发布成功',
            type: 'success'
          })  
          this.pcIndex({platform:'pc'})
        }
      })
    }
  },
  components: {
    SelectGoods
  },
  created(){
    this.pcIndex({platform:'pc'})
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
      width: 90%;
      padding-left: 20px; 
      border-left: 2px solid #ddd;
      .title{
        height: 80px;
        line-height: 80px;
        img{
          vertical-align: middle
        }
        .name{
          color: #2b88cb;
          margin-left: 10px; 
          font-size: 24px;
        }
      }
      .nav{
        height: 50px;
        line-height: 50px;
        border: 1px solid #ddd;
        .nav-list{
          float: left;
          overflow: hidden;
          li{
            float: left;
            padding: 0 20px;
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
                width: 220px;
                margin-bottom: 10px; 
                img{
                  border: 1px solid #ddd;
                  padding: 10px;
                  width: 198px;
                  height: 198px;
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
                width: 180px;
                margin-bottom: 10px;
                margin-right: 10px;
                p{
                  width: 100%;
                  height: 18px;
                  text-align: center;
                  color: #D12548;
                  overflow: hidden;
                } 
              }
            }
          }
        }
      }
    }
  }
  .nav-dialog-body{
    overflow: auto;
    margin-top: 10px;
    height: 400px;
    border: 1px solid #ddd;
    .list{
      .first,.second{
        overflow: hidden;
        border-bottom: 1px solid #ddd;
        i{
          margin-left: 10px;
          height: 36px;
          line-height: 36px;
          font-size: 16px;
        }
        .fr{
          float: right;
          padding: 0;
          margin: 0 5px;
          i{
           margin-left: 0;
          }
        }
        .delete{
          margin-top: 4px;
          font-size: 16px;
          padding: 5px 10px;
        }
      }
      .second{
        .text{
          margin-left: 28px;
          font-style: normal;
        }
      }
      .first:hover,.second:hover{
        background: #ddd;
        cursor: pointer;
      }
    }
  }
  .nav-dialog-footer,.floor-dialog-footer{
    text-align: center
  }
  .floor-dialog-body{
    margin-top: 10px;
    height: 450px;
    border: 1px solid #ddd;
    overflow: auto;
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
