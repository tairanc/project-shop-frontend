<template>
    <div class='padding'>
         <table-view
            :pageList="list"
            :columns='columns'
            ></table-view>
             <pagination-view 
              v-show="list.length"
              :paginationName="name"
              :total="total"
              :currentPage="form.page"
              @size-change="handleSizeChange"
              @current-change="handleNumberChange"
            ></pagination-view>
    </div>
</template>
<script>
    import TableView from '@/components/TableView'
    import PaginationView from '@/components/PaginationView'
    import chip from '@/api/chip/chip'
    import { urlParse } from '@/utils/urlParse'
    export default {
                data(){
                    return{
                        list:[],
                        name:'formOnSearch',
                        total:0,
                        form:{
                            page:1,
                            page_size:20,
                            sku_id:urlParse().sku_id
                        },
                        columns: [{
                            label: '商品名称',
                            field: 'title',
                            align: 'center'
                        },{
                            label: '规格',
                            field: 'spec_text',
                            align: 'center'
                        },{
                            label: '芯片编码',
                            field: 'chip_code',
                            align: 'center'
                        },{
                            label: '芯片状态',
                            field: 'status',
                            align: 'center'
                        },
                        ],

                    }
                },
                methods:{
                    handleSizeChange (val) {
                        this.form.page_size = val
                        this.getSkuChipInfo(this.form)
                    },
                    handleNumberChange (val) {
                        this.form.page = val
                        this.getSkuChipInfo(this.form)
                    },
                    getSkuChipInfo(data){
                        chip.getSkuChipInfo(data).then((res) =>{
                            this.list=[]
                            for(var i in res.data.list){
                                var status =res.data.list[i].status
                                switch(status){
                                    case 1 :res.data.list[i].status ='已上架'
                                    break
                                    case 2 :res.data.list[i].status ='已核销'
                                    break
                                }
                                this.list.push(res.data.list[i])
                            }
                            this.total =res.data.total
                        })
                        .catch(function(error){
                            console.log(error)
                        })
                    }
                },
                components:{
                   TableView ,PaginationView
                },
                created:function(){
                    this.getSkuChipInfo(this.form)
                }
            }
</script>
<style lang="scss" scoped>
.padding{
    padding: 10px
}
</style>
