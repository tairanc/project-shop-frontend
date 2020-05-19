<template>
    <div>
       <el-table class="table" :data="list" border align="center" >
          <el-table-column align="center" label="一级分类" prop="name">
          </el-table-column>
          <el-table-column align="center" label="佣金比率">
              <template  slot-scope="scope">
                <span v-show="!scope.row.edit">{{scope.row.rate}}</span>
                <el-input v-show="scope.row.edit" size="mini" v-model.number="scope.row.rate" style="width:200px"></el-input>%
                <div v-show="scope.row.edit" style="color:red;fontSize:14px">佣金比率需≥0%</div>
              </template>
          </el-table-column>
    
          <el-table-column align="center" label="操作">
            <template  slot-scope="scope">
              <el-button v-show="!scope.row.edit" type="text" @click="handleEdit(scope.row)" :disabled="noClick">编辑</el-button>
              <el-button v-show="scope.row.edit" type="text" @click="handleCheck(scope.row)" :disabled="noClick">保存</el-button>
             </template>
          </el-table-column>
      
       </el-table>           
    </div>
</template>
<script>
import PaginationView from '@/components/PaginationView'
import TableView from '@/components/TableView'
import commission from '@/api/activity/commission'
import { spanArr } from '@/utils/spanArr'
export default {
    data() {
        return {
            list:[],
            form:{
                page:1,
                page_size:20
            },
            noClick:false
        }   
    },
    methods:{
        getShopCategoryList(data){
            commission.getShopCategoryList(data).then((res) =>{
                this.list =[]
                this.noClick =res.data.is_gray
                for(var i in res.data.list){
                    this.list.push(res.data.list[i])
                    this.$set(res.data.list[i],'edit',false)
                }
            })
        },
        //行编辑
      handleEdit(row){
        this.list.map((item)=>{
          if(item.category_id == row.category_id){
            item.edit = true
          }
        })
      },
      //保存比率
      editShopCategory(data){
         commission.editShopCategory(data).then((res) =>{
            this.$message({
                 message: '保存成功',
                 type: 'success'
            })
         })
      },
      //行保存
      handleCheck(row){
        let flag = true
        row.rate = row.hasOwnProperty('rate') ?  row.rate : 0
        if(row.rate == 0 || row.rate >= 1 ){
            let data ={
                category_id:row.category_id,
                rate:row.rate
            }
        commission.editShopCategory(data).then((res) =>{
            this.$message({
                 message: '保存成功',
                 type: 'success'
            })
            row.edit = false
         })
         
        }else{
            this.$message({
                 message: '佣金比率需≥0%',
                 type: 'warning'
            })
        }
      },
    },
    components:{
        TableView,
        PaginationView
    },
    created:function(){
        this.getShopCategoryList(this.form)
    },
    computed: {
    }
}
</script>

