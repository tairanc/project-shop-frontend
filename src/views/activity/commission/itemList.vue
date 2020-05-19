<template>
    <div class='itemList'>
        <el-button type="primary" icon="el-icon-plus"  @click="selectVisible=true" :disabled="noClick">新增主推商品</el-button>
        <el-button @click="deleteAll" :disabled="noClick">删除选中项</el-button>
        <p></p>
        <el-table class="table" :data="list" border align="center"  @selection-change="handleSelectionChange">
            <el-table-column  
            type="selection"
            width="35">
            </el-table-column>
            <el-table-column  label="商品名称" width='350'>
                <template  slot-scope="scope">
                    <img :src='scope.row.item_image+"_t.jpg"' width="100">
                    <div style="display: inline-block;vertical-align:top;width:60%">
                        <p><a :href="defaultUrl('item_id',scope.row)" target="_blank" class='goods_url'> {{scope.row.item_title}}</a></p>
                        <p>¥{{scope.row.sell_price}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="推广时间" width='250'>
                <template  slot-scope="scope">
                    <div v-show="!scope.row.edit">
                        <p>开始：{{scope.row.begin_at}}</p>
                        <p>结束：{{scope.row.end_at}}</p>
                    </div>
                    <div v-show="scope.row.edit" >
                        <el-date-picker
                            v-model="scope.row.begin_at"
                            type="date"
                            placeholder="选择开始日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options='pickerOptions1'>
                        </el-date-picker>
                        <p></p>
                        <el-date-picker
                            v-model="scope.row.end_at"
                            type="date"
                            placeholder="选择结束日期"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            :picker-options='pickerOptions1'>
                        </el-date-picker>
                    </div>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" label="优惠卷信息">
                <template  slot-scope="scope">
                    <div v-show="!scope.row.edit">
                    <div v-if='scope.row.coupon_id'>
                        <p>店铺劵ID：{{scope.row.coupon_id}}</p>
                        <p>满{{scope.row.limit_money}}减{{scope.row.deduct_money}}</p>
                        <p>({{scope.row.left_quantity}}/{{scope.row.send_quantity}})</p>
                    </div>
                    <span v-else>无</span>
                    </div>
                    <a v-show="scope.row.edit" @click="clickCoupon(scope.row.item_id,scope.row.begin_at,scope.row.end_at)" style="color:#409EFF">编辑优惠卷</a>             
                </template>
            </el-table-column> -->
            <el-table-column align="center" label="佣金比率">
                <template  slot-scope="scope">
                    <span v-show="!scope.row.edit">{{(scope.row.rate*1).toFixed(2)}}</span>
                    <el-input v-show="scope.row.edit" v-model="scope.row.rate" style="width:100px"></el-input>%
                </template>
            </el-table-column>
            <el-table-column align="center" label="推广状态" prop="status">
            </el-table-column>  
            <el-table-column align="center" label="操作">
                <template  slot-scope="scope">
                    <div v-show="!scope.row.edit" style="color:#409EFF">
                        <el-button type="text" @click="handleEdit(scope.row)" :disabled="noClick">编辑</el-button>
                        <el-button type="text" @click="handleDelete(scope.row)" :disabled="noClick">删除</el-button>
                    </div>
                    <el-button type="primary" v-show="scope.row.edit" @click="handleCheck(scope.row)" :disabled="noClick">保存修改</el-button>
                </template>
            </el-table-column>
        </el-table> 
        <pagination-view 
        :currentPage="form.page" 
        :total="total" 
        @size-change="sizeChange"
        @current-change="pageChange">
        </pagination-view>
        <!-- 优惠劵列表  -->
        <el-dialog
            title="编辑优惠劵"
            :visible.sync="centerDialogVisible"
            width="90%"
            center>
            <el-button type="primary" @click="goCoupon">前往设置优惠劵</el-button>
            <el-button type="primary" plain @click="getValidCouponList(couponData)">刷新</el-button>
            <span style="fontSize:14px;color:#999;margin-left:50px">
                此处只展示有效等店铺优惠劵，且在商品推广时间范围内。
            </span>
            <p></p>
            <el-table class="table" :data="couponList" border align="center">
                <el-table-column align="center" label="" width="35">
                    <template  slot-scope="scope">
                        <el-radio-group v-model="radio">
                        <el-radio  v-model="scope.row.id" :label='scope.row.id' @change.native="getCoupon(scope.row)" ></el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="优惠劵ID" prop="id">
                </el-table-column>  

                <el-table-column align="center" label="优惠劵名称" prop="name">
                </el-table-column>  

                <el-table-column align="center" label="优惠金额" prop="deduct_money">
                </el-table-column>  

                <el-table-column align="center" label="门槛金额" prop="limit_money">
                </el-table-column>  

                <el-table-column align="center" label="领取时间">
                    <template  slot-scope="scope">
                        <p v-if='scope.row.obtain_start_time'>开始:{{scope.row.obtain_start_time}}</p>
                        <p v-if='scope.row.obtain_end_time'>结束:{{scope.row.obtain_end_time}}</p>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="每人限量" prop="user_obtain_limit">
                </el-table-column>  

                <el-table-column align="center" label="发放数量" prop="send_quantity">
                </el-table-column> 

                <el-table-column align="center" label="剩余数量" prop="remain_quantity">
                </el-table-column> 
            </el-table>
            <pagination-view 
            :currentPage="couponData.page" 
            :total="couponTotal" 
            @size-change="couponSizeChange"
            @current-change="couponPageChange">
            </pagination-view>
            <span slot="footer" class="dialog-footer">
                <el-button @click="centerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="clicksaveCoupon">确 定</el-button>
            </span>
        </el-dialog>
        <commission-goods :saleType="type" :selectVisible="selectVisible" :selectList="selectList"  @visible-change="handleVisible"
        @choose-submit="handleAdd"></commission-goods>
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import commission from '@/api/activity/commission'
import ticket from '@/api/activity/ticket'
import commissionGoods from '@/components/commissionGoods'

export default {
    data(){
        return{
            centerDialogVisible:false,
            selectVisible: false,
            list:[],
            type:'commission',
            goodsList:[],
            radio:'不使用优惠劵',
            id:{item_ids:[]},
            couponList:[],
            total:0,
            couponTotal:0,
            form:{
                page:1,
                page_size:20
            },
            couponData:{
                item_id:'',
                start_time:'',
                end_time:'',
                page:1,
                page_size:20
            },
            saveCoupon:{
                item_id:'',
                coupon_id:''
            },
            pickerOptions1:{
                disabledDate(time) {
                    return time.getTime() <= Date.now();
                },
            },
            noClick:false
        }
    },
    methods:{
        getItemList(data){
            commission.getItemList(data).then((res)=>{
                this.total =res.data.total_count
                this.noClick =res.data.is_gray
                this.list =[]
                for(let i in res.data.list){
                    this.list.push(res.data.list[i])
                    this.$set(res.data.list[i],'edit',false)
                }
            })
        },
        //勾选
        handleSelectionChange (val) {
             this.id.item_ids=[]
             for(var i in val){
                this.id.item_ids.push(val[i].item_id)
             }
         },
         //编辑优惠劵
        getValidCouponList(data){
             commission.getValidCouponList(data).then((res) =>{
                 this.couponList=[]
                 this.couponTotal = res.data.total_count
                 var couponOne = {
                     name:'',
                     id:'不使用优惠劵',
                     deduct_money:'',
                     limit_money:'',
                     user_obtain_limit:'',
                     send_quantity:'',
                     remain_quantity:'',
                     radio:''
                 }
                this.couponList.push(couponOne)
                for(var i in res.data.data){
                     this.couponList.push(res.data.data[i])
                     this.$set(res.data.data[i],'radio','')
                 }
                 
             })
         },
         //编辑主推商品
         updateCommissionItem(data){
            
         },
         //去优惠劵页面
         goCoupon(){
             this.$router.push({path:'/goods-activity/activity/ticket'})
         },
         //删除商品
         exitSpecialItem(data){
             let _this = this
             commission.exitSpecialItem(data).then((res) =>{
                _this.getItemList(_this.form)
                _this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            }).catch(()=>{
                _this.getItemList(_this.form)
            })
         },
        clickCoupon(id,begin_at,end_at){
             this.couponData.item_id =id
             this.saveCoupon.item_id=id
             this.couponData.start_time =begin_at
             this.couponData.end_time = end_at
             this.getValidCouponList(this.couponData)
             this.centerDialogVisible=true
         },
        //行编辑
        handleEdit(row){
            this.list.map((item)=>{
            if(item.item_id == row.item_id){
                item.edit = true
            }
            })
        },
        //行保存
        handleCheck(row){
            let flag = true
         
            var item ={
                item_id:row.item_id,
                effecting_rate:row.rate,
                start_at:row.begin_at,
                end_at:row.end_at,
                category_id:row.category_id
            }
            commission.updateCommissionItem(item).then((res) =>{
                    this.getItemList(this.form)
                    row.edit = false
             })
           
        },
        //总删除
        deleteAll(){
            this.exitSpecialItem(this.id)
        },
        //行删除
        handleDelete(row){
            // this.goodsList =this.goodsList.filter((item)=>{
            // return item.item_id != row.item_id
            // })
            this.id.item_ids=[]
            this.id.item_ids.push(row.item_id)
            this.exitSpecialItem(this.id)

        },
        getCoupon(row){
            this.saveCoupon.coupon_id=row.id
        },
        //绑定优惠劵
        bindCommissionCoupon(data){
            commission.bindCommissionCoupon(data).then((res) =>{
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                
            })
        },
        //保存优惠劵信息
        clicksaveCoupon(){
            if(this.saveCoupon.coupon_id =='不使用优惠劵'){
                this.saveCoupon.coupon_id=''
                this.bindCommissionCoupon(this.saveCoupon)
            }else{
                 this.bindCommissionCoupon(this.saveCoupon)
            }
            this.centerDialogVisible=false
        },
        //新增主推商品
        createCommissionItem(data){
            commission.createCommissionItem(data).then((res) =>{
                 this.getItemList(this.form)
            })
        },
        sizeChange(val){
            this.form.page_size=val;
            this.getItemList(this.form)
       },
        pageChange(val){
            this.form.page =val;
            this.getItemList(this.form)
       },
       couponSizeChange(val){
            this.couponData.page_size=val;
            this.getValidCouponList(this.couponData)
       },
       couponPageChange(val){
            this.couponData.page =val;
            this.getValidCouponList(this.couponData)
       },
       // 处理选择商品弹框显示与隐藏
      handleVisible(val){
        this.selectVisible = val;
      },
    //   handleAdd(val){
    //       console.log(val);
          
    //   }
      handleAdd(val){
         ticket.importItemsById({
            item_id: val
          }).then((res) => {
            const result = res.data;
            this.getItemList(this.form)
            let errMsg = "";
            // if (result.itemList.length != 0) {
            //   this.goodsList = result.itemList
            // }
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
    },
    components:{
        PaginationView,
        commissionGoods
    },
    created:function(){
        this.getItemList(this.form)
    },
    computed: {
      selectList(){
        let list = []
        this.goodsList.map((item)=> {
          (list.indexOf(item.item_id) == -1) && list.push(item.item_id)
        })
        return list
      },
    }
}
</script>
<style lang="scss" scoped>
.itemList{
    padding: 10px
}
.goods_url{
      cursor: pointer;}
.goods_url:hover{
        color: #409EFF
      }
</style>

