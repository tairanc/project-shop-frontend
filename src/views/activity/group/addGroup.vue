<template>
    <section class='group'>
        
           <el-button type="danger" @click="selectVisible=true">选择商品</el-button>
           <p></p>
           <group-goods :selectVisible="selectVisible" :promotionType="type" @visible-change="handleVisible" @choose-submit="handleAdd"></group-goods>
           <div class='pt20'>
               <table-view ref="goodsTable" :loading="loading" :columns="columns" :pageList="goodsList"></table-view>
           </div>
           <el-form :model="addGroup" :rules="addRules" ref="addGroupForm" label-width="128px">
           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="group_person" label="拼团人数：">
                        <el-input type="number" v-model="addGroup.group_person"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='4'>
                    <p class='tips'>至少2人</p>    
                </el-col>    
           </el-row>

           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="group_price" label="拼团价：">
                        <el-input type="number" v-model="addGroup.group_price"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='6'>
                    <p class='tips'>请参考最低售价</p>    
                </el-col>    
           </el-row>

           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="group_type" label="拼团类型：">
                        <el-select v-model="addGroup.group_type" @change="changeType">
                            <el-option value="Normal" label='普通拼团'></el-option>
                            <el-option value="Rookie" label="新人拼团"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span='6'>
                    <p class='tips'>选择新人团后，参团人员仅限新用户</p>
                </el-col>    
           </el-row>

            <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="user_max_join" label="每人最多参团次数:">
                        <el-input type="number" v-model="addGroup.user_max_join" :disabled="dist"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='6'>
                    <p class='tips'>次</p>
                </el-col>    
           </el-row>

           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="open_group_number" label="最高开团次数：">
                        <el-input type="number" v-model="addGroup.open_group_number"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='6'>
                    <p class='tips'>次 请输入最高可开团数，不填写时不做限制</p>    
                </el-col>    
           </el-row>

           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="start_time" label="活动开始时间：">
                        <el-date-picker type="datetime" v-model="addGroup.start_time" placeholder="活动开始时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>  
           </el-row>
           <el-row>
                <el-col :span="10" :offset="1">
                    <el-form-item prop="end_time" label="活动结束时间：">
                        <el-date-picker type="datetime" v-model="addGroup.end_time" placeholder="活动结束时间" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                    </el-form-item>
                </el-col>  
           </el-row>
           <el-row type="flex" justify="center">
                <el-button type="primary" @click="commitGroup()">提交</el-button>
                <el-button @click="backList()">取消</el-button>
            </el-row>
        </el-form>
    </section>
</template>

<script>
import TableView from '@/components/TableView'
import groupGoods from '@/components/groupGoods'
import group from '@/api/group'
const ISINT =/^-?[1-9]+[0-9]*$/;
export default {
    data(){
        
        const isGroup_person = (rule, value, callback) => {
            if (value) {
                if(value <2){
                    callback(new Error('请输入大于等于2的数值'));
                }else{
                    callback()
                }
            } else {
                callback(new Error('请填写必填项目'));
            }
        };

        const isGroup_price = (rule, value, callback) => {
            if (value) {
                if(value <0){
                    callback(new Error('请输入大于等于0的数值'));
                }else{
                    callback()
                }
            } else {
                callback(new Error('请填写必填项目'));
            }
        };

        const isUser_max_join =(rule,value,callback) => {
            if (value) {
                if(value <1 || value>10 || !ISINT.test(value)){
                    callback(new Error('请输入大于等于1/小于等于10/有效的整数值'));
                }else{
                    callback()
                }
            } else {
                callback(new Error('请填写必填项目'));
            }
        }

        const isOpen_group_number =(rule,value,callback) => {
            if (value) {
                if(value <1 || !ISINT.test(value)){
                    callback(new Error('请输入大于等于1/有效的整数值'));
                }else{
                    callback()
                }
            } else {
                callback();
            }
        }

        const isStart_time =(rule,value,callback) => {
            if (value) {
                callback()
            } else {
                callback(new Error('请填写必填项目'));
            }
        }
        
        const isEnd_time =(rule,value,callback) => {
            if (value) {
                callback()
            } else {
                callback(new Error('请填写必填项目'));
            }
        }
        return{
            selectVisible:false,
            goodsList:[],
            loading:false,
            type:'GroupBuy',
            dist:false,
            addGroup:{
                group_person:'',
                group_price:'',
                group_type:'Normal',
                user_max_join:'',
                open_group_number:'',
                start_time:'',
                end_time:'',
                item_ids:[]
            },
            addRules:{
                group_person:[{ validator: isGroup_person, trigger: 'blur' }],
                group_price:[{validator:isGroup_price,trigger: 'blur' }],
                user_max_join:[{ validator: isUser_max_join, trigger: 'blur' }],
                open_group_number:[{validator:isOpen_group_number,trigger:'blur'}],
                start_time:[{validator:isStart_time,trigger:'blur'}],
                end_time:[{validator:isEnd_time,trigger:'blur'}],
            }, 
            columns: [
                {
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
                    label: '标准售价(元)',
                    field: 'sell_price',
                    align: 'center'
                },
                {
                    label: '操作',
                    align: 'center',
                    actions: [{
                        label: '删除',
                        type: 'primary',
                        size: 'mini',
                        click: (index, row) => {
                        this.deleteGoods(row.id);
                        }
                    }]
                }
            ],
        }
            
    },
    methods:{
        // 添加过滤已经存在的商品
        goodsFilter(items) {
            for (let i = 0; i < items.length; i++) {
            let flag = false;
            if (this.goodsList.length != 0) {
                for (let j = 0; j < this.goodsList.length; j++) {
                (items[i].id == this.goodsList[j].id) && (flag = true)
                }
            }
            if(!flag) {
                this.goodsList.push(items[i])
            }
            }
        },
        handleAdd(val){
            group.importItemsById({
            item_id: val
            }).then((res) => {
            const result = res.data;
            let errMsg = "";
            if (result.itemList.length != 0) {
              this.goodsFilter(result.itemList)
            }
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
        // 处理选择商品弹框显示与隐藏
        handleVisible(val){
                this.selectVisible = val;
            },
        deleteGoods(id) {
            this.goodsList = this.goodsList.filter(function (item) {
            return item.id != id;
            })
        },
        createGroupBuy(data){
            group.createGroupBuy(data).then((res) =>{
                this.$message({
                    type:'success',
                    message:'拼团活动创建成功'
                })
                this.$router.push({
                    name: "group"
                    })
            })
            .catch(function(error){
                this.$message({
                        message: error.message,
                        type: 'error'
                    });
            })
        },
        changeType(){
            if(this.addGroup.group_type =='Rookie'){
                this.addGroup.user_max_join=1
                this.dist =true;
            }else{
                this.dist =false
            }
        },
        commitGroup(){
            this.$refs.addGroupForm.validate((valid) => {
            if(valid){
                            this.addGroup.item_ids = [];
                            let addGroup =this.addGroup
                            this.goodsList.forEach(function (item) {
                            addGroup.item_ids.push(item.id);
                            })
                    if(this.addGroup.end_time<this.addGroup.start_time){
                    this.$message({
                            message: '活动结束时间应该大于活动开始时间',
                            type: 'warning'
                    })
                    return false
                }else if(this.addGroup.item_ids ==''){
                    this.$message({
                            message: '请选择商品',
                            type: 'warning'
                    })
                }else{
                            this.createGroupBuy(this.addGroup)
                        
                        }
                    } else{
                        return false;
                    }
            })
        },
        backList(){
            this.$router.push({
            name: "group"
            })
        }
    },
    components:{
        groupGoods,
        TableView
    },
}
</script>

<style>
.group{
    padding: 10px
}


.pt20 {
    width: 90%;
    padding-bottom: 20px;
  }
.tips {
    margin-top: 12px;
    margin-bottom: 10px;
    margin-left: 20px;
    color: #ccc;
    font-size: 14px;
  }  
</style>