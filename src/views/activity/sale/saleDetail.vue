<template>
  <div class="detail">
    <div class="content">
      <span v-show="message.refuse_reason" class="reason">审核驳回原因： {{message.refuse_reason}}</span>
      <h3>活动信息</h3>
      <el-row>
        <el-col>
          <p>活动名称： {{message.name}}</p>
        </el-col>
        <el-col>
          <p>活动标签： {{message.type}}</p>
        </el-col>
        <el-col>
          <p>每人每件限购： {{message.user_buy_limit}}件</p>
        </el-col>
        <el-col>
          <p>店铺商品限量： {{message.shop_apply_limit}}件</p>
        </el-col>
        <el-col>
          <p>商品折扣范围： {{message.discount_min}}%~{{message.discount_max}}%</p>
        </el-col>
        <el-col>
          <p>店铺类型： {{message.used_shop_type}}</p>
        </el-col>
        <el-col>
          <p>适用分类： {{message.used_category}}</p>
        </el-col>
        <el-col>
          <p>活动创建时间： {{message.created_at}}</p>
        </el-col>
        <el-col>
          <p>活动发布时间： {{message.release_time}}</p>
        </el-col>
        <el-col>
          <p>活动开始时间： {{message.start_time}}</p>
        </el-col>
        <el-col>
          <p>活动结束时间： {{message.end_time}}</p>
        </el-col>
        <el-col>
          <p>报名开始时间： {{message.apply_start_time}}</p>
        </el-col>
        <el-col>
          <p>报名结束时间： {{message.apply_end_time}}</p>
        </el-col>
        <div v-if="message.special_flash_sale_title">
          <el-col>
            <p class="pic">专场广告图：<img :src="message.special_flash_sale_image" width="500"></p>
          </el-col>
          <el-col>
            <p>专场主标题：{{message.special_flash_sale_title}}</p>
          </el-col>
          <el-col>
            <p>专场副标题：{{message.special_flash_sale_subtitle}}</p>
          </el-col>
        </div>
      </el-row>
      <div  class="goods" v-show="goodsList.length">
        <h3>商品信息</h3>
        <div class="table">
          <el-table :data="goodsList" border :span-method="spanMethod" >
            <el-table-column  align="center" label="商品ID" prop="item_id">
            </el-table-column>
            <el-table-column align="center"  label="商品名称">
              <template slot-scope="scope">
                <a class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
              </template>
            </el-table-column>
            <el-table-column align="center"  label="属性" prop="spec_text">
            </el-table-column>
            <el-table-column align="center" label="市场价（元）" prop="market_price">
            </el-table-column>
            <el-table-column align="center" label="标准售价（元）" prop="sell_price">
            </el-table-column>
            <el-table-column align="center" label="活动价（元）" prop="promotion_price">
            </el-table-column>
            <el-table-column align="center" label="可售库存" prop="store">
            </el-table-column>
            <el-table-column align="center" label="活动库存" prop="promotion_store">
            </el-table-column>
            <el-table-column align="center" label="销量" prop="sales">
            </el-table-column>
            <el-table-column align="center" label="审核状态" prop="verify_status">
            </el-table-column>
          </el-table>
        </div>
        <pagination-view :currentPage="pageInfo.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
      </div>
      <el-row>
        <el-col :offset="10">
          <el-button type="primary" @click="goBack">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import sale from '@/api/activity/sale'
  import { spanArr } from '@/utils/spanArr'


  export default {
    data() {
      return {
        flash_sale_id: '',
        total: 0,
        pageInfo: {
          apply_id: '',
          page: 1,
          page_size: 20
        },
        message: {},
        goodsList: []
      }
    },
    computed: {
      spanArr(){
        return spanArr(this.goodsList)
      }
    },
    methods: {
      //获取特卖信息
      getFlashSaleDetail(params){
        sale.getFlashSaleDetail(params).then((res)=>{
          if(res.code == 0){
            this.message = res.data

            switch(this.message.type){
              case 'FlashSale': 
                  this.message.type = '单品特卖'
                  break
              case 'SpecialFlashSale': 
                  this.message.type = '专场特卖'
                  break
            }
          }
        })
      },
      // 获取商品列表
      getFlashSaleApplyList(params){
        sale.getFlashSaleApplyList(params).then((res)=>{
          if(res.code == 0){
            this.total = res.data.total_count
            this.goodsList = res.data.list
            this.goodsList.map((item)=>{
              switch(item.verify_status){
                case 'pending': 
                    item.verify_status = '未审核'
                    break
                case 'agree': 
                    item.verify_status = '审核通过'
                    break
                case 'refuse': 
                    item.verify_status = '审核未通过'
                    break
              }
            })
          }
        })
      },
      // pageSize变化函数
      sizeChange(val){
        this.pageInfo.page_size = val;
        this.getFlashSaleApplyList(this.pageInfo)
      },
      // page变化函数
      pageChange(val){
        this.pageInfo.page = val;
        this.getFlashSaleApplyList(this.pageInfo)
      },
      //表格合并处理方法
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex==0 || columnIndex==1 || columnIndex== 9) {
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
      goBack(){
        this.$router.go(-1)
      }
    },
    components: {
      PaginationView
    },
    created() {
      this.flash_sale_id = this.$route.query.sale_id
      if(this.$route.query.apply_id!=-1){
        this.pageInfo.apply_id=this.$route.query.apply_id
        this.getFlashSaleApplyList(this.pageInfo)
      }
      this.getFlashSaleDetail({
        flash_sale_id: this.flash_sale_id,
        apply_id: this.pageInfo.apply_id
      })
    }
  }

</script>

<style lang='scss' scoped>
  .detail {
    overflow: hidden;
    padding: 10px 20px;
    .reason{
      display: inline-block;
      padding: 8px 0;
      background: #f3f3f3;
    }
    .pic{
      display: inline-block;
      img{
        vertical-align: top
      }
    }
    .goods{
      overflow: hidden;
    }
    .table{
      width: 85%;
      .goods_url{
        cursor: pointer;
        &:hover{
          color: #409EFF
        }
      }
    }
    .el-pagination{
      margin-right: 15%
    }
  }
</style>
