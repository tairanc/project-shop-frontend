<template>
    <section class='group'>
        <el-button type="primary" icon="el-icon-plus" @click='addGroup'>添加拼团活动</el-button>
        <p></p>
        <table-view
            :columns='columns'
            :pageList='groupList'
        ></table-view>
        <pagination-view 
        :currentPage="form.page" 
        :total="total" 
        @size-change="sizeChange" 
        @current-change="pageChange"></pagination-view>
    </section>
</template>
<script>
    import TableView from '@/components/TableView'
    import PaginationView from '@/components/PaginationView'
    import group from '@/api/group'
    export default {
        data(){
            return{
                form:{
                    page:1,
                    page_size:20
                },
                groupList:[],
                total:0,
                columns: [
                    {
                        label: '商品ID',
                        field: 'item_id',
                        align: 'center'
                    },
                     {
                        label: '拼团类型',
                        field: 'group_type',
                        align: 'center',
                    },
                    {
                        label: '最高开团数',
                        field: 'open_group_number',
                        align: 'center'
                    },
                    {
                        label: '商品名称',
                        // field: 'title',
                        align: 'center',
                        isGood: 2
                    },
                     {
                        label: '标准售价',
                        field: 'sell_price',
                        align: 'center'
                    },
                    {
                        label: '拼团价',
                        field: 'price',
                        align: 'center'
                    },
                    {
                        label: '拼团人数',
                        field: 'group_person',
                        align: 'center'
                    },
                    {
                        label: '每人最多参团次数',
                        field: 'user_max_join',
                        align: 'center'
                    },
                    {
                        label: '拼团成功',
                        field: 'verify_success_count',
                        align: 'center'
                    },
                   
                    {
                        label: '拼团开始时间',
                        field: 'start_time',
                        align: 'center'
                    },
                    {
                        label: '拼团结束时间',
                        field: 'end_time',
                        align: 'center'
                    },
                    {
                        label: '报名时间',
                        field: 'created_at',
                        align: 'center'
                    },
                    {
                        label: '活动状态',
                        field: 'status',
                        align: 'center',
                        width: 110,

                        tags: [{
                        index: 10,
                        name: "即将开始",
                        type: "danger"
                        }, {
                        index: 20,
                        name: "已发布",
                        type: "success"
                        }, {
                        index: 30,
                        name: "进行中",
                        type: "success"
                        },{
                        index: 40,
                        name: "已结束",
                        type: "info"
                        }, {
                        index: 50,
                        name: "已关闭",
                        type: "warning"
                        },
                        {
                        index: '/',
                        name: "/",
                        type: "info"
                        }]
                    },
                     {
                        label: '审核状态',
                        field: 'verify_status',
                        align: 'center'
                    },
                    {
                        label: '驳回原因',
                        field: 'refuse_reason',
                        align: 'center'
                    },
                    {
                        label: '操作',
                        align: 'center',
                        actions: [{
                        label: '关闭',
                        type: 'text',
                        size: 'medium',
                        disable: (row, index) => {
                            return !(row.item_status == 1 &&row.status==30 || row.status==10 && row.verify_status =='审核通过');
                        },
                        click: (index, row) => {
                            this.$confirm('拼团活动将会失效，确定关闭？', '关闭提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                            this.downGroup({promotion_id:row.promotion_id,item_id:row.item_id});
                            }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消关闭'
                            });
                            });
                        }
                        }]  
                            
                    }
                ]
            }
        },
    methods: {
        getGroupList(data){
            group.getGroupList(data).then((res) =>{
                this.total=res.data.total_count
                this.groupList=[]
                for(var i in res.data.data){
                    let type =res.data.data[i].group_type
                     switch(type){
                        case 'Normal' :res.data.data[i].group_type='普通拼团';
                        break;
                        case 'Rookie' :res.data.data[i].group_type='新人拼团';
                        break;
                    }
                    let status = res.data.data[i].verify_status
                    switch(status){
                        case 'agree' :res.data.data[i].verify_status='审核通过';
                        break;
                        case 'refuse' :res.data.data[i].verify_status='审核拒绝';
                        break;
                        case 'pending' :res.data.data[i].verify_status='审核中';
                        break;
                    }
                    let open =res.data.data[i].open_group_number
                    switch(open){
                        case 0 :res.data.data[i].open_group_number='/'
                    }
                    this.groupList.push(res.data.data[i])
                }
            })
            .catch(function(error){
                console.log(error)
            })
        },
        downGroup(data){
            group.downGroup(data).then((res) =>{
                this.$message({
                message: "关闭成功",
                type: 'success'
                });
                this.getGroupList(this.form);
            })
            .catch(function(error){
                console.log(error)
            })
        },
        sizeChange(val){
             this.form.page_size = val;
            this.getGroupList(this.form);
        },
        pageChange(val){
            this.form.page = val;
            this.getGroupList(this.form);
      },
      addGroup() {
        this.$router.push({
          name: "addGroup"
        })
      },
    },
    components:{
        TableView,
        PaginationView
    },
    created() {
        this.getGroupList(this.form);
    }
}
</script>

<style lang='scss' scoped>
.group{
    padding: 10px
}
</style>
