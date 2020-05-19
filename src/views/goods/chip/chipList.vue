<template>
    <div class='chipList'>
       <el-form  label-width="100px"  ref="formOnSearch" size="medium">
           <el-row>
               <el-col :span='7' :offset="1">
                   <el-form-item label="商品名称：" prop="title">
                       <el-input v-model="form.title"></el-input>
                   </el-form-item>
               </el-col>
           </el-row>
           <el-row class='tc'>
               <el-button type="primary" @click="getSkuChipList(form)">确定</el-button>
               <el-button @click="resetForm">重置</el-button>
           </el-row>
       </el-form>
       <p></p>
       <table-view   :columns="columns" :pageList="chipList"></table-view>
        <pagination-view 
            v-show="chipList.length"
            :total="total"
            :currentPage="form.page"
            @size-change="handleSizeChange"
            @current-change="handleNumberChange"
        ></pagination-view>
    </div>
</template>
<script>
    import TableView from '@/components/TableView'
    import chip from '@/api/chip/chip'
    import PaginationView from '@/components/PaginationView'

    export default {
            data(){
                return{
                    total:0,
                    form:{
                        title:'',
                        page:1,
                        page_size:20
                    },
                    chipList:[],
                    columns:[
                        {
                           label: '商品名称',
                            field: 'title',
                            align: 'center' 
                        },
                        {
                           label: '规格',
                            field: 'spec_text',
                            align: 'center' 
                        },
                        {
                           label: '有效芯片数量',
                            field: 'active',
                            align: 'center' 
                        },
                        {
                           label: '无效芯片数量',
                            field: 'used',
                            align: 'center' 
                        },{
                            label: '操作',
                            align: 'center',
                            width: 350,
                            actions: [{
                            label: '详情',
                            type: 'text',
                            size: 'medium',
                            click: (index, row) => {
                                this.seeChip(row.sku_id);
                                }
                            }]
                        }
                    ]
                }
            },
            methods:{
                getSkuChipList(data){
                    chip.getSkuChipList(data).then((res) =>{
                        this.chipList=[]
                        for(var i in res.data.list){
                            this.chipList.push(res.data.list[i])
                        }
                        this.total =res.data.total
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                },
                handleSizeChange (val) {
                    this.form.page_size = val
                    this.getSkuChipList(this.form)
                },
                handleNumberChange (val) {
                    this.form.page = val
                    this.getSkuChipList(this.form)
                },
                seeChip(id) {
                    this.$router.push({
                    name: "infoChip",
                    query: {
                        sku_id: id
                    }
                    })
                },
                resetForm(){
                    this.form.title='';
                },
            },
            components:{
                TableView,
                PaginationView
            },
            created:function(){
                this.getSkuChipList(this.form)
            }
        }
</script>
<style lang="scss" scoped>
.chipList{
    padding: 10px
}
.tc{
    text-align: center
}
</style>


