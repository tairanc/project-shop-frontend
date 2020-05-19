<template>
    <div class="gift">
    
        <el-tabs type="border-card" v-model="tabName" @tab-click="tabClick">
            <el-tab-pane label="我的报名" name ='my'>
                <table-view
                :columns="columns"
                :pageList="list"
                ></table-view>
                <pagination-view 
                 :currentPage="page.page" 
                 :total="total" 
                 @size-change="sizeChange"
                 @current-change="pageChange">
                 </pagination-view>
            </el-tab-pane>
            <el-tab-pane label="活动列表" name='activity'>
                 <table-view
                :columns="columns"
                :pageList="list"
                ></table-view>
                 <pagination-view 
                 :currentPage="page.page" 
                 :total="total" 
                 @size-change="sizeChange"
                 @current-change="pageChange">
                 </pagination-view>
            </el-tab-pane>
            <el-tab-pane label="历史报名" name ='history'>
                 <table-view
                :columns="columns"
                :pageList="list"
                ></table-view>
                 <pagination-view 
                 :currentPage="page.page" 
                 :total="total" 
                 @size-change="sizeChange"
                 @current-change="pageChange">
                 </pagination-view>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import gift from '@/api/activity/gift'
export default {
    data() {
        return {
            tabName:'activity',
            total:0,
            list:[],
            columns:[
                {label: '礼包ID',field: 'package_id',align: 'center'},
                {label: '礼包名称',field: 'package_name',align: 'center'},
                {label: '报名开始时间',field: 'apply_start_time',align: 'center'},
                {label: '领取开始时间',field: 'obtain_start_time',align: 'center'},
                {label: '领取结束时间',field: 'obtain_end_time',align: 'center'},
                {label: '报名情况',align: 'center',gift:'1'},
                {label: '参与情况',field: 'activity_status',align: 'center'},
                {label: '操作',align: 'center',actions: [
                     {
                        label: '查看',
                        type: 'text',
                        size: 'medium',
                          disable: (row, index) => {
                         return row.activity_status == '可参与' 
                        },
                        click: (index, row) => {
                        this.openGift(row.package_id,row.apply_id,row.is_applied)
                        }
                    }, 
                    {
                        label: '报名',
                        type: 'text',
                        size: 'medium',
                        disable: (row, index) => {
                        return row.activity_status == '报名未开始' || row.activity_status == '报名已结束' || row.activity_status == '不可参与'|| row.activity_status == '报名已取消'
                        },
                        click: (index, row) => {
                          this.openGiftBm(row.package_id,row.apply_id)
                        }
                    }, 
                ]},

            ],
            page:{
                page:1,
                page_size:20,
                type:'activity'
            }
        }
    },
    methods:{
       getGiftList (data){
           gift.getGiftList(data).then((res) =>{
               this.total =res.data.total_count
               this.list=[]
               var _this =this
               for(var i in res.data.data){
                   let status =res.data.data[i].activity_status
                   switch(status){
                       case 10 :res.data.data[i].activity_status ='报名未开始';
                       break
                       case 20 :res.data.data[i].activity_status ='可参与';
                       break
                       case 30 :res.data.data[i].activity_status ='报名已结束';
                       break
                       case 40 :res.data.data[i].activity_status ='不可参与';
                       break
                       case 50 :res.data.data[i].activity_status ='报名已取消';
                       break
                   }
                   _this.list.push(res.data.data[i])
               }
           })
           .catch(function(error){
               console.log(error)
           })
       },
       tabClick(e,t){
            this.page.type=e.name
            this.getGiftList(this.page)
       },
       sizeChange(val){
           this.page.page_size=val;
           this.getGiftList(this.page)
       },
       pageChange(val){
           this.page.page =val;
           this.getGiftList(this.page)
       },
       openGift(id,apply_id,is_applied){
           this.$router.push({
               name:'giftInfo',
               query: {
               package_id:id,
               apply_id:apply_id,
               is_applied:is_applied
               }
           })
       },
       openGiftBm(id,apply_id){
           this.$router.push({
               name:'giftBm',
               query: {
               package_id:id,
               apply_id:apply_id
               }
           })
       }
    },
    created:function(){
        this.getGiftList(this.page)
    },
    components:{
        PaginationView,
        TableView
    }

}
</script>

<style lang="scss" scoped>
.gift{
    padding: 10px
}
</style>
