<template>
  <el-card class="invoice">
    <div  class="block">
      <span>发票类型：</span>
      <el-checkbox-group v-model="message.invoice_type">
        <el-checkbox :label="3" disabled>电子发票</el-checkbox>
        <el-checkbox :label="1">普通发票</el-checkbox>
        <el-checkbox :label="2">增值税发票</el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="block">
        <p class='red'>为响应政策号召，泰然城全面启用电子发票，若商家不支持电子发票，可使用普通纸质发票代替</p>
    </div>
    <div class="block">
      <span>发票内容：</span>
      <el-checkbox-group v-model="message.invoice_content">
        <el-checkbox :label="1" disabled>明细</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-button  class="btn" type="primary" @click="setInvoice">保存</el-button>
  </el-card>
</template>

<script>
import shops from '@/api/shops'

export default {
  data() {
    return {
      message: {
        invoice_type: [],
        invoice_content: []
      }
    }
  },
  methods: {
    setInvoice(){
      shops.setInvoice(this.message).then((res)=>{
        if(res.code===0){
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          shops.getInvoice().then((res)=>{
            this.message = res.data
          })
        }
      })
    }
  },
  created() {
    shops.getInvoice().then((res)=>{
      this.message = res.data
    })
  },
}

</script>

<style lang='scss' scoped>
.invoice{
  margin: 20px;
  .block{
    overflow: hidden;
    margin: 20px 0;
    span{
      float: left;
    }
  }
  .btn{
    margin-left: 30%
  }
  .red{
    color: red
  }
}
</style>
