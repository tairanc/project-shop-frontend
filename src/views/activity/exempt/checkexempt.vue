<template>
  <div class="checkexempt">
    <div class="content">
      <h3>优惠券信息</h3>
      <el-row>
        <el-col>
          <p>优惠券ID： {{couponDetail.id}}</p>
        </el-col>
        <el-col>
          <p>优惠券名称： {{couponDetail.name}}</p>
        </el-col>
        <el-col>
          <p>发放数量： {{couponDetail.send_quantity}}</p>
        </el-col>
        <el-col>
          <p>每人每张限领： {{couponDetail.user_obtain_limit}}</p>
        </el-col>
        <el-col>
          <p>适用平台： {{platform}}</p>
        </el-col>
        <el-col>
          <p>可免单的商品ID： {{couponDetail.item_id}}</p>
        </el-col>
        <el-col>
          <p>可免单的商品别名： {{couponDetail.alias}}</p>
        </el-col>
        <el-col :span="16" class="mt20">
          <table-view :loading="loading" :columns="columns" :pageList="itemList"></table-view>
        </el-col>
        <el-col>
          <p>领取开始时间： {{couponDetail.obtain_start_time}}</p>
        </el-col>
        <el-col>
          <p>领取结束时间： {{couponDetail.obtain_end_time}}</p>
        </el-col>
        <el-col>
          <p>有效期： {{couponDetail.expiry_date}}</p>
        </el-col>
      </el-row>
    </div>
    <el-row class="mt40" type="flex" justify="center">
      <el-col :span="4">
        <el-button type="primary" @click="checkexport">查看已导出的兑换码</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="backList">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import exempt from '@/api/activity/exempt'
  import ticket from '@/api/activity/ticket'
  import TableView from '@/components/TableView'

  export default {
    data() {
      return {
        loading: false,
        addVisibleid: false,
        selectVisible: false,
        goodsIds: "",
        itemList: [],
        total: 0,
        goodsVisible: false,
        couponInfo: {
          coupon_id: undefined
        },
        pageInfo: {
          page: 1,
          page_size: 10,
          coupon_id: undefined
        },
        couponDetail: {
          extend: {}
        },
        columns: [{
            label: '商品ID',
            field: 'id',
            align: 'center'
          },
          {
            label: '商品名称',
            // field: 'title',
            align: 'center',
            isGood: 1
          },
          {
            label: '市场价(元)',
            field: 'market_price',
            align: 'center'
          },
          {
            label: '标准售价(元)',
            field: 'sell_price',
            align: 'center'
          }
        ],
      }
    },
    methods: {
      // 获取优惠券详情
      getCouponDetail(params) {
        exempt.getShopcoupon(params).then((res) => {
          this.couponDetail = res.data;
          let _item = []
          _item.push(res.data.item)
          this.itemList = _item;
        });
      },
    //   查看已经导出的兑换码
      checkexport(){
        this.$router.push({
          name: "checkexport",
          query: {
            id: this.couponInfo.coupon_id
          }
        })
      },
      // 返回列表页
      backList() {
        this.$router.push({
          name: "exempt"
        })
      },
    },
    components: {
      TableView,
    },
    computed: {
      platform: function () {
        let platText = ''
        let plat  = this.couponDetail.applicable_platform
        if(plat == undefined){
          return 
        }
        if (plat.indexOf('ALL') != -1) {
          platText += '全平台，'
        }
        let _content = 0
        if(plat.indexOf('PC')!= -1){
          platText += 'PC端，'
          _content = _content + 1
        }
        if(plat.indexOf('WX')!= -1){
          platText += '微信端，'
          _content = _content + 1
        }
        if(plat.indexOf('APP')!= -1){
          platText += 'APP端，'
          _content = _content + 1
        }
        if(plat.indexOf('WAP')!= -1){
          platText += 'WAP端，'
          _content = _content + 1
        }
        if (_content == 4) {
          platText = '全平台，'
        }
        return platText.slice(0,-1)
      }
    },
    created() {
      this.couponInfo.coupon_id = this.$route.query.id;
      this.getCouponDetail(this.couponInfo);
    }
  }

</script>

<style lang='scss' scoped>
  .checkexempt {
    padding: 10px 20px;
    .content{
        p{
            // font-size: 12px;
        }
    }
  }

  .mt40 {
    margin-top: 40px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb30 {
    margin-bottom: 30px;
  }

</style>
