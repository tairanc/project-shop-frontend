<template>
  <div class="config">
    <el-form :model="shopConfig" ref="configForm">
      <el-col>
        <p>店铺名称： {{shopConfig.name}}</p>
      </el-col>
      <el-col>
        <el-form-item label="店铺LOGO：">
          <img :src="shopConfig.logo" width="50" height="50" @click="imgSeclect=true">
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="店铺描述：" prop="description">
          <el-input type="textarea" v-model="shopConfig.description" style="width:500px"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="店铺是否开放:">
          <el-radio-group v-model="shopConfig.is_open">
            <el-radio :label="1" :disabled="shopConfig.channel == 'pet'">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </el-col>
    </el-form>


    <!-- 图片选择 -->
    <el-dialog width="70%"  style="margin-top:-8vh" :visible="imgSeclect" :show-close="false" :close-on-click-modal="false">
      <sell-img-select ref="refimguse" />
      <div slot="footer" class="floor-dialog-footer">
        <el-button @click="imgSeclect=false">取消</el-button>
        <el-button type="primary" @click="savePic">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import shops from '@/api/shops'
import { mapGetters } from 'vuex'
import SellImgSelect from '@/views/goods/imgspace/sellimgselect'


export default {
  data() {
    return {
      shopConfig: {},
      imgSeclect: false,
      configRules: {
        description: [
          { max: 200, message: '长度200个字符以内', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          if(!this.shopConfig.logo&&this.shopConfig.is_open == 1){
            this.$message({
              showClose: true,
              message: '请上传店铺LOGO',
              type: 'warning'
            })
          }else{
            shops.updateShopInfo({
              logo: this.shopConfig.logo,
              description: this.shopConfig.description,
              is_open: this.shopConfig.is_open
            }).then((res)=>{
              if(res.code == 0){
                this.$message({
                  showClose: true,
                  message: '保存成功',
                  type: 'success'
                })
                shops.getShopExtendData().then((res)=>{
                  if(res.code == 0){
                    this.shopConfig = res.data
                  }
                })
              }
            })
          }
        }
      });
    },
    savePic(){
      this.shopConfig.logo = this.sellImgSrc
      this.imgSeclect = false
    }
  },
  computed: {
    ...mapGetters([
      'sellImgSrc'
    ])
  },
  components: {
    SellImgSelect
  },
  created() {
    shops.getShopExtendData().then((res)=>{
      if(res.code == 0){
        this.shopConfig = res.data
      }
    })
  },
}

</script>

<style lang='scss' scoped>
.config{
  margin: 20px;
  overflow: hidden;
  font-size: 15px;
  color: #606266;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  p{
    line-height: 40px
  }
  img{
    cursor: pointer;
  }
}
</style>
