<template>
  <div class="message">
    <el-card>
      <div slot="header">
        <span>店铺信息</span>
      </div>
      <div>
        <p><span>店铺名称：</span>{{message.name}}</p>
        <p><span>店铺描述：</span>{{message.description}}</p>
        <p><span>店铺类型：</span>{{message.type}}</p>
        <p><span>经营品牌：</span>{{message.enter_data.shop_brand}}</p>
        <p><span>店铺开通状态：</span>{{message.is_active?'已开通':'未开通'}}</p>
        <p><span>店铺开通日期：</span>{{message.open_time}}</p>
        <p><span>店主姓名：</span>{{message.enter_data.shopuser_name}}</p>
        <p v-if="message.enter_data.shopuser_identity_img_z">
          <span>店主身份证复印件：</span>
          <span class="imgLabel">正面：</span><img :src="message.enter_data.shopuser_identity_img_z" width="200" height="240">
          <span v-if="message.enter_data.shopuser_identity_img_f" class="imgLabel">反面：</span><img v-if="message.enter_data.shopuser_identity_img_f" :src="message.enter_data.shopuser_identity_img_f" width="200" height="240">
        </p>
        <p><span>详细地址：</span>{{message.address}}</p>
        <p><span>手机号：</span>{{message.mobile}}</p>
        <p><span>电子邮箱：</span>{{message.email}}</p>
      </div>
    </el-card>

    <el-card v-if="message.biz_model == 2">
      <div slot="header">
        <span>营业执照信息</span>
      </div>
      <div>
        <p><span>公司名称：</span>{{message.enter_data.company_name}}</p>
        <p><span>营业执照注册号：</span>{{message.enter_data.license_num}}</p>
        <p><span>法定代表人姓名：</span>{{message.enter_data.representative}}</p>
        <p><span>法人身份证号码：</span>{{message.enter_data.corporate_identity}}</p>
        <p>
          <span>法人身份证复印件：</span>
          <span class="imgLabel">正面：</span><img :src="message.enter_data.corporate_identity_img_z" width="200" height="240">
          <span class="imgLabel">反面：</span><img :src="message.enter_data.corporate_identity_img_f" width="200" height="240">
        </p>
        <p><span>公司成立日期：</span>{{message.enter_data.establish_date}}</p>
        <p><span>营业执照有效期：</span>{{message.enter_data.license_indate}}</p>
        <p><span>法定经营范围：</span>{{message.enter_data.scope}}</p>
        <p><span>公司所在地：</span>{{message.enter_data.company_area}}</p>
        <p><span>公司详细地址：</span>{{message.enter_data.company_addr}}</p>
        <p><span>公司电话：</span>{{message.enter_data.company_phone}}</p>
        <p><span>公司联系人：</span>{{message.enter_data.company_contacts}}</p>
        <p><span>公司联系人手机：</span>{{message.enter_data.company_cmobile}}</p>
        <p>
          <span>营业执照副本复印件：</span>
          <img :src="message.enter_data.license_img" width="200" height="240">
        </p>
        <p><span>注册资本：</span>{{message.enter_data.enroll_capital}}元</p>
        <p><span>公司官网：</span>{{message.enter_data.shop_url}}</p>
      </div>
    </el-card>

    <el-card v-if="message.biz_model == 2">
      <div slot="header">
        <span>组织机构代码证</span>
      </div>
      <div>
        <p><span>组织机构代码证：</span>{{message.enter_data.tissue_code}}</p>
        <p>
          <span>组织机构代码证复印件：</span>
          <img :src="message.enter_data.tissue_code_img" width="200" height="240">
        </p>
      </div>
    </el-card>

    <el-card v-if="message.biz_model == 2">
      <div slot="header">
        <span>税务登记证</span>
      </div>
      <div>
        <p><span>税务登记证号：</span>{{message.enter_data.tax_code}}</p>
        <p>
          <span>税务登记证复印件：</span>
          <img :src="message.enter_data.tax_certificate" width="200" height="240">
        </p>
      </div>
    </el-card>

    <el-card v-if="message.biz_model == 2">
      <div slot="header">
        <span>结算账号</span>
      </div>
      <div>
        <p><span>银行开户公司名：</span>{{message.enter_data.bank_user_name}}</p>
        <p><span>银行开户账号：</span>{{message.enter_data.bank_id}}</p>
        <p><span>开户银行所在地：</span>{{message.enter_data.bank_area}}</p>
        <p><span>开户银行：</span>{{message.enter_data.bank_name}}</p>
      </div>
    </el-card>
  </div>
</template>

<script>
import shops from '@/api/shops'

export default {
  data() {
    return {
      message: {
        enter_data: {}
      }
    }
  },
  methods: {
  },
  created() {
    shops.getShopExtendEnterData().then((res)=>{
      this.message = res.data
    })
  },
}

</script>

<style lang='scss' scoped>
.message{
  margin: 20px;
  p{
    span{
      display: inline-block;
      width: 170px;
      text-align: right;
      vertical-align: top
    }
    .imgLabel{
      display: inline;
      vertical-align: top;
      margin-left: 10px;
    }
  }
}
</style>
