<template>
  <div class="enter">
    <el-steps :active="activeStep" align-center finish-status="success">
      <el-step title="填写店铺分类"></el-step>
      <el-step title="填写企业信息"></el-step>
      <el-step title="填写联系人/结算信息"></el-step>
      <el-step title="上传资料"></el-step>
      <el-step title="提交审核"></el-step>
    </el-steps>
    <el-card class="form" v-show="firstShow">
      <div slot="header">店铺信息</div>
      <el-form :model="form" ref="firstForm" label-width="135px" label-position="right" :rules="firstRules">
        <el-form-item label="店铺类型：" prop="shop_type">
          <el-select v-model="form.shop_type" placeholder="请选择店铺类型：" @change="handleTypeChange">
            <el-option label="品牌旗舰店" :value="1"></el-option>
            <el-option label="品牌专卖店" :value="2"></el-option>
            <el-option label="类目专营店" :value="3"></el-option>
            <el-option label="多品类通用店" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺名称：" prop="shop_name">
          <el-input v-model="form.shop_name"></el-input>
          <div class="shop-name-show" v-if="form.shop_type != ''">{{form.shop_type==1?'(请命名为"品牌名+（海外/品牌）旗舰店"，比如"阿玛尼品牌旗舰店"或"阿玛尼海外旗舰店")':(form.shop_type==2?'(请命名为"品牌名+企业商号/或关联名称+（海外）旗舰店"，比如"阿玛尼XXX专卖店"或"阿玛尼XXX海外专卖店")':(form.shop_type==3?'(请命名为"企业商号/或关联名称+类目名称+专营店"，比如"XXX服饰专营店")':'(请命名为"企业商号/或关联名称+多品类专营店"，比如"XXX多品类专营店")'))}}</div>
        </el-form-item>
        <el-form-item label="店铺经营类目：">
          <el-select :key="1" v-if="form.shop_type==4" v-model="form.shop_cat.primary_cat"
            filterable
            multiple
            :multiple-limit=5
            placeholder="请选择一级类目"
            @change="handleFirst">
            <el-option
              v-for="item in firtCate"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

           <el-select :key="2" v-else v-model="form.shop_cat.primary_cat"
              filterable
              placeholder="请选择一级类目"
              @change="handleFirst">
              <el-option
                v-for="item in firtCate"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

           <el-select  class="secondly_cat" v-model="form.shop_cat.secondly_cat"
            filterable
            multiple
            :multiple-limit= secondLen
            placeholder="请选择二级类目"
            @change="getBrandList"
            >
            <el-option-group v-for="child in secondCate"
              :key="child.id"
              :label="child.label"
            >
              <el-option
                v-for="item in child.children"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                >
              </el-option>
            </el-option-group>

          </el-select>
        </el-form-item>
        <el-form-item label="经营品牌：" prop="shop_brand">
          <el-select
            v-if="form.shop_type==3 || form.shop_type==4"
            :key="4"
            v-model="form.shop_brand"
            filterable
            multiple
            :multiple-limit= 10>
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>

          <el-select
            v-else
            v-model="form.shop_brand"
            :key="5"
            filterable>
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="品牌授权书：" prop="brand_warranty">
          <div v-for="(item, index) in brandImg" :key="index" class="img_edit">
            <img :src="item.url" alt="">
            <div class="img_delete" @click="removeBrandImg(index)">
              <div class="el-icon-delete"></div>
            </div>
          </div>
          <el-upload
            action="1"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_brand_list"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :show-file-list="false"
            class="enterin-img"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>最多可上传10张，图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="店铺描述：" prop="shop_descript">
          <el-input v-model="form.shop_descript"></el-input>
        </el-form-item>
        <el-form-item label="店主姓名：" prop="shopuser_name">
          <el-input v-model="form.shopuser_name"></el-input>
        </el-form-item>
        <el-form-item label="店主身份证正面：" prop="shopuser_identity_img_z">
          <el-upload
            v-model="form.shopuser_identity_img_z"
            action="2"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_userid_z_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgZ"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="店主身份证反面：" prop="shopuser_identity_img_f">
          <el-upload
            action="3"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_userid_f_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgF"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="地址：" prop="shop_addr">
          <el-input v-model="form.shop_addr"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <div class="btnGroup">
          <el-button type="primary" @click="handleNext('firstForm','firstShow','secondShow')">下一步</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="form" v-show="secondShow">
      <div slot="header">基本信息</div>
      <el-form
        :model="form" ref="secondForm"
        label-width="135px" label-position="right"
        :rules="secondRules">
        <el-form-item label="公司名称：" prop="company_name">
          <el-input v-model="form.company_name"></el-input>
        </el-form-item>
        <el-form-item label="公司性质：" prop="shop_way">
          <el-radio-group v-model="form.shop_way">
            <el-radio :label="1">境内公司</el-radio>
            <el-radio :label="2">境外公司</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所在地区：" prop="company_area">
          <el-input v-model="form.company_area"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="company_addr">
          <el-input v-model="form.company_addr"></el-input>
        </el-form-item>
        <el-form-item label="成立日期：" prop="establish_date">
          <el-date-picker
            v-model="form.establish_date"
            value-format="timestamp"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="法人姓名：" prop="representative">
          <el-input v-model="form.representative"></el-input>
        </el-form-item>
        <el-form-item label="法人身份：" prop="is_mainland">
          <el-radio-group v-model="form.is_mainland">
            <el-radio :label="1">中国大陆居民</el-radio>
            <el-radio :label="2">非中国大陆居民</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证："  v-show="form.is_mainland==1" prop="corporate_identity">
          <el-input v-model="form.corporate_identity"></el-input>
        </el-form-item>
        <el-form-item label="护照：" v-show="form.is_mainland==2" prop="passport_number">
          <el-input v-model="form.passport_number"></el-input>
        </el-form-item>
        <el-form-item label="营业执照号码：" prop="license_num">
          <el-input v-model="form.license_num"></el-input>
        </el-form-item>
        <el-form-item label="营业期限：" prop="license_indate">
          <el-date-picker
            v-model="form.license_indate"
            value-format="timestamp"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组织机构代码：" prop="tissue_code">
          <el-input v-model="form.tissue_code"></el-input>
        </el-form-item>
        <el-form-item label="税务登记证号：" prop="tax_code">
          <el-input v-model="form.tax_code"></el-input>
        </el-form-item>
        <el-form-item label="经营范围：" prop="scope">
          <el-input v-model="form.scope"></el-input>
        </el-form-item>
        <el-form-item label="注册资本：" prop="enroll_capital">
          <el-input v-model="form.enroll_capital"></el-input>
        </el-form-item>
        <el-form-item label="公司官网：" prop="shop_url">
          <el-input v-model="form.shop_url"></el-input>
        </el-form-item>
        <div class="btnGroup">
          <el-button type="primary" @click="handlePrev('secondShow','firstShow')">上一步</el-button>
          <el-button type="primary" @click="handleNext('secondForm','secondShow','thirdShow')">下一步</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="form" v-show="thirdShow">
      <div slot="header">联系人/结算信息</div>
      <el-form
        :model="form" ref="thirdForm"
        label-width="135px" label-position="right"
        :rules="thirdRules">
        <el-form-item label="公司联系人：" prop="company_contacts">
          <el-input v-model="form.company_contacts"></el-input>
        </el-form-item>
        <el-form-item label="联系人手机：" prop="company_cmobile">
          <el-input v-model="form.company_cmobile"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="company_phone">
          <el-input v-model="form.company_phone"></el-input>
        </el-form-item>
        <el-form-item label="售后联系人：" prop="seller_contacts">
          <el-input v-model="form.seller_contacts"></el-input>
        </el-form-item>
        <el-form-item label="售后联系人手机：" prop="seller_mobile">
          <el-input v-model="form.seller_mobile"></el-input>
        </el-form-item>
        <el-form-item label="退货地址：" prop="seller_address">
          <el-input v-model="form.seller_address"></el-input>
        </el-form-item>
        <el-form-item label="售后联系人电话：" prop="seller_phone">
          <el-input v-model="form.seller_phone"></el-input>
        </el-form-item>
        <el-form-item label="银行开户公司名：" prop="bank_user_name">
          <el-input v-model="form.bank_user_name"></el-input>
        </el-form-item>
        <el-form-item label="银行开户账号：" prop="bank_id">
          <el-input v-model="form.bank_id"></el-input>
        </el-form-item>
        <el-form-item label="开户银行所在地：" prop="bank_area">
          <el-input v-model="form.bank_area"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="bank_name">
          <el-input v-model="form.bank_name"></el-input>
        </el-form-item>
        <el-form-item label="SWIFT CODE：" prop="bank_swift_code">
          <el-input v-model="form.bank_swift_code"></el-input>
          <span>境外公司必填，境内公司无需填写</span>
        </el-form-item>
        <div class="btnGroup">
          <el-button type="primary" @click="handlePrev('thirdShow','secondShow')">上一步</el-button>
          <el-button type="primary" @click="handleNext('thirdForm','thirdShow','forthShow')">下一步</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card class="form" v-show="forthShow">
      <div slot="header">资料上传</div>
      <el-form :model="form" ref="forthForm" label-width="135px" label-position="right" :rules="forthRules">
        <el-form-item label="法人身份证/护照正面：" prop="corporate_identity_img_z">
          <el-upload
            action="4"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_corporid_z_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeIdentityZ"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="法人身份证/护照反面：" prop="corporate_identity_img_f">
          <el-upload
            action="5"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_corporid_f_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeIdentityF"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="营业执照副本：" prop="license_img">
          <el-upload
            action="6"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_license_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgLicense"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="组织机构代码证：" prop="tissue_code_img">
          <el-upload
            action="7"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_tissue_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgTissue"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="税务登记证：" prop="tax_certificate">
          <el-upload
            action="8"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_tax_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgTax"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="银行开户证明：" prop="bank_account_certificate">
          <el-upload
            action="9"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_bank_account_list"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :on-remove="removeImgBank"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="进口报关单或海外购物凭证："  prop="customs_entry_img">
          <div v-for="(item, index) in entryImg" :key="index" class="img_edit">
            <img :src="item.url" alt="">
            <div class="img_delete" @click="removeEntryImg(index)">
              <div class="el-icon-delete"></div>
            </div>
          </div>
          <el-upload
            action="10"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_entry_list"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :show-file-list="false"
            class="enterin-img"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>最多可上传10张，图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>
        <el-form-item label="合同协议：" prop="agreement_img">
          <div v-for="(item, index) in agreeImg" :key="index" class="img_edit">
            <img :src="item.url" alt="">
            <div class="img_delete" @click="removeAgreeImg(index)">
              <div class="el-icon-delete"></div>
            </div>
          </div>
          <el-upload
            class="enterin-img"
            action="11"
            accept="image/*"
            list-type="picture-card"
            :file-list="imgList.img_agreement_list"
            multiple
            :limit="10"
            :on-exceed="handleExceed"
            :before-upload="beforeAvatarUpload"
            :http-request="upload"
            :show-file-list="false"
            >
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>最多可上传10张，图片请控制在5M以内，支持jpe,jpeg.png,bmp格式</div>
        </el-form-item>

        <div class="btnGroup">
          <el-button type="primary" @click="handlePrev('forthShow','thirdShow')">上一步</el-button>
          <el-button v-show="!isUpdate" type="primary" @click="handleSubmit">提交审核</el-button>
          <el-button v-show="isUpdate" type="primary" @click="updateEnterApply">提交审核</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card   class="proTable" v-show="fiveShow">
      <div slot="header">审核进度</div>
      <table class="progress"  border cellspacing="0">
        <tr>
          <th class="first">入驻流程</th>
          <th class="second">日期</th>
          <th class="third">提示</th>
        </tr>
        <tr v-show="table.create_time">
          <td>提交入驻申请</td>
          <td>{{table.create_time}}</td>
          <td>您提交了入驻申请，请耐心等待泰然城平台审核</td>
        </tr>
        <tr v-show="table.refuse_time">
          <td>审核驳回</td>
          <td>{{table.refuse_time}}</td>
          <td>您的入驻申请被驳回，驳回理由：{{table.refuse_reason}} <el-button v-show="updateBtn" type="primary" size="mini" @click="getEnterApply">重新申请</el-button></td>
        </tr>
        <tr v-show="table.update_time">
          <td>重新提交入驻申请</td>
          <td>{{table.update_time}}</td>
          <td>您重新提交了入驻申请，请耐心等待泰然城平台审核</td>
        </tr>
        <tr v-show="table.agree_time">
          <td>审核通过</td>
          <td>{{table.agree_time}}</td>
          <td>您的入驻申请已审核通过，请耐心等待泰然城平台为您开通店铺。</td>
        </tr>
      </table>
    </el-card>
  </div>
</template>

<script>
import enter from '@/api/enter'
import goods from '@/api/goods'

const CHECK_PHONE = /^1\d{10}$/
const CHECK_URL = /^http[s]?:\/\/.*.com$/
const CHECK_ID = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/


export default {
  data () {
    let checkMobile = (rule, value, callback) => {
      if (!CHECK_PHONE.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    let checkEmail = (rule, value, callback) => {
      if (value) {
        if (value.indexOf('@') == -1) {
          callback(new Error('请输入正确的邮箱'))
        } else if (!(value.slice(-4) == '.com')) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }

    let checkUrl = (rule, value, callback) => {
      if (value) {
        if (value.length > 60){
          callback(new Error('最多输入60个字符'))
        } else if(!CHECK_URL.test(value)){
          callback(new Error('请输入正确的网址'))
        }else {
          callback()
        }
      }else{
        callback()
      }
    }

    let checkId = (rule, value, callback) => {
      if(this.form.is_mainland==1){
        if (!CHECK_ID.test(value)) {
          callback(new Error('请输入正确的身份证号'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }

    let checkPassport = (rule, value, callback) => {
      if(this.form.is_mainland==2){
        if (!value) {
          callback(new Error('请输入必填项'))
        } else if(value.length>50) {
          callback(new Error('最多输入50个字符'))
        }else {
          callback()
        }
      }else{
        callback()
      }
    }

    let checkCode = (rule, value, callback) => {
      if (this.form.shop_way==1) {
        if(!value){
          callback(new Error('请填写必填项'))
        }else {
          callback()
        }
      } else {
        callback()
      }
    }

    let checkSwiftCode = (rule, value, callback) => {
      if (this.form.shop_way==2) {
        if(!value){
          callback(new Error('请填写必填项'))
        }else {
          callback()
        }
      } else {
        callback()
      }
    }

    let checkTissueImg = (rule, value, callback) => {
      if (this.form.shop_way==1) {
        if(!value){
          callback(new Error('请填写必填项'))
        }else {
          callback()
        }
      } else {
        callback()
      }
    }

    let checkTaxCertificate = (rule, value, callback) => {
      if (this.form.shop_way==1) {
        if(!value){
          callback(new Error('请填写必填项'))
        }else {
          callback()
        }
      } else {
        callback()
      }
    }

    return {
      channelType:this.$route.query.channelType,
      updateBtn: '',
      activeStep: 0,
      firstShow: true,
      secondShow: false,
      thirdShow: false,
      forthShow: false,
      fiveShow: false,
      cateGory: {},
      firtCate: [],
      secondCate: [],
      secondLen: 0,
      brandList: [],
      brandImg: [],
      entryImg: [],
      agreeImg: [],
      firstRules: {
        shop_type: [
          { required: true, message: '请选择店铺类型', trigger: 'change' }
        ],
        shop_name: [
          { required: true, message: '请填写店铺名称', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        shop_brand: [
          { required: true, message: '请选择经营品牌', trigger: 'change' }
        ],
        brand_warranty: [
          { required: true, message: '请上传品牌授权书', trigger: 'change' }
        ],
        shop_descript: [
          { max: 400, message: '最多只能输入400个字符', trigger: 'blur' }
        ],
        shopuser_name: [
          { required: true, message: '请填写店主姓名', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        shopuser_identity_img_z: [
          { required: true, message: '请上传店主身份证正面', trigger: 'change' }
        ],
        shopuser_identity_img_f: [
          { required: true, message: '请上传店主身份证反面', trigger: 'change' }
        ],
        shop_addr: [
          { required: true, message: '请填写地址', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      secondRules: {
        company_name: [
          { required: true, message: '请填写公司名称', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        shop_way: [
          { required: true, message: '请选择公司性质', trigger: 'blur' }
        ],
        company_area: [
          { required: true, message: '请填写公司所在地区', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        company_addr: [
          { required: true, message: '请填写公司地址', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        establish_date: [
          { required: true, message: '请填写公司成立日期', trigger: 'blur' }
        ],
        representative:[
          { required: true, message: '请填写法人姓名', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        is_mainland: [
          { required: true, message: '请填写法人身份', trigger: 'blur' }
        ],
        corporate_identity: [
          { validator: checkId, trigger: 'blur' }
        ],
        passport_number: [
          { validator: checkPassport, trigger: 'blur' }
        ],
        license_num: [
          { required: true, message: '请填写公司营业执照号码', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        license_indate: [
          { required: true, message: '请填写公司营业期限', trigger: 'blur' }
        ],
        tissue_code: [
          { validator: checkCode, trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        tax_code: [
          { validator: checkCode, trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        scope: [
          { required: true, message: '请填写公司经营范围', trigger: 'blur' },
          { max: 400, message: '最多只能输入400个字符', trigger: 'blur' }
        ],
        enroll_capital: [
          { required: true, message: '请填写公司注册资本', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        shop_url: [
          { validator: checkUrl, trigger: 'blur' }
        ]
      },
      thirdRules: {
        company_contacts: [
          { required: true, message: '请填写公司联系人', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        company_cmobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        company_phone: [
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        seller_contacts: [
          { required: true, message: '请填写售后联系人', trigger: 'blur' },
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        seller_mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        seller_phone: [
          { max: 40, message: '最多只能输入40个字符', trigger: 'blur' }
        ],
        seller_address: [
          { required: true, message: '请填写退货地址', trigger: 'blur' },
          { max: 200, message: '最多只能输入200个字符', trigger: 'blur' }
        ],
        bank_user_name: [
          { required: true, message: '请填写银行开户公司名', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        bank_id: [
          { required: true, message: '请填写银行开户账号', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        bank_area: [
          { required: true, message: '请填写开户银行所在地', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        bank_name: [
          { required: true, message: '请填写开户银行', trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ],
        bank_swift_code: [
          { validator: checkSwiftCode, trigger: 'blur' },
          { max: 100, message: '最多只能输入100个字符', trigger: 'blur' }
        ]
      },
      forthRules: {
        corporate_identity_img_z: [
          { required: true, message: '请填写必填项', trigger: 'change' }
        ],
        corporate_identity_img_f: [
          { required: true, message: '请填写必填项', trigger: 'change' }
        ],
        license_img: [
          { required: true, message: '请填写必填项', trigger: 'change' }
        ],
        tissue_code_img: [
          { validator: checkTissueImg, trigger: 'change' }
        ],
        tax_certificate: [
          { validator: checkTaxCertificate, trigger: 'change' }
        ],
        bank_account_certificate: [
          { required: true, message: '请填写必填项', trigger: 'change' }
        ]
      },
      form: {
        seller_id: '',
        shop_name: '',
        company_name: '',
        shop_type: '',
        shopuser: '',
        shop_way: '',
        seller_address: '',
        new_brand: '',
        company_area: '',
        company_addr: '',
        establish_date: '',
        representative: '',
        is_mainland: '',
        corporate_identity: '',
        passport_number: '',
        license_num: '',
        license_indate: '',
        tissue_code: '',
        scope: '',
        enroll_capital: '',
        shop_url: '',
        company_contacts: '',
        company_cmobile: '',
        company_phone: '',
        seller_contacts: '',
        seller_mobile: '',
        seller_phone: '',
        corporate_identity_img_z: '',
        corporate_identity_img_f: '',
        license_img: '',
        tissue_code_img: '',
        tax_code: '',
        bank_user_name: '',
        bank_id: '',
        bank_area: '',
        bank_name: '',
        brand_warranty: [],
        shopuser_identity_img_z: '',
        shopuser_identity_img_f: '',
        shop_descript: '',
        shop_addr: '',
        mobile: '',
        email: '',
        bank_swift_code: '',
        tax_certificate: '',
        bank_account_certificate: '',
        customs_entry_img: [],
        agreement_img: [],
        shop_cat: {
          primary_cat: [],
          secondly_cat: [],
        },
        shop_brand: []
      },
      table: {
        id: '',
        status: '',
        create_time: '',
        refuse_time: '',
        refuse_reason: '',
        update_time: '',
        agree_time: '',
      },
      imgList: {
        img_brand_list: [],
        img_userid_z_list: [],
        img_userid_f_list: [],
        img_corporid_z_list: [],
        img_corporid_f_list: [],
        img_license_list: [],
        img_tissue_list: [],
        img_tax_list: [],
        img_bank_account_list: [],
        img_entry_list: [],
        img_agreement_list: []
      },
      isUpdate: false
    }
  },
  computed: {
    accountId(){
      let info = JSON.parse(localStorage.getItem('id'))
      return info.account_id
    }
  },
  methods: {
    formatTime(number){
      let time = new Date(number*1000)
      return time.toLocaleString()
    },
    removeBrandImg (index) {
      let self = this
      self.brandImg.splice(index, 1)
      self.form.brand_warranty.splice(index, 1)

      // let self = this
      // let url = file.url
      // let urlIndex = url.lastIndexOf('/')

      // this.brandImg.map((item, index) => {
      //   if (item == url.slice(urlIndex)) {
      //     self.brandImg.splice(index, 1)
      //     self.form.brand_warranty.splice(index, 1)
      //   }
      // })
    },
    removeEntryImg (index) {
      let self = this
      self.entryImg.splice(index, 1)
      self.form.customs_entry_img.splice(index, 1)

      // let self = this
      // let url = file.url
      // let urlIndex = url.lastIndexOf('/')

      // this.entryImg.map((item, index) => {
      //   if (item == url.slice(urlIndex)) {
      //     self.entryImg.splice(index, 1)
      //     self.form.customs_entry_img.splice(index, 1)
      //   }
      // })
    },
    removeAgreeImg (index) {
      let self = this
      self.agreeImg.splice(index, 1)
      self.form.agreement_img.splice(index, 1)

      // let self = this
      // let url = file.url
      // let urlIndex = url.lastIndexOf('/')

      // this.agreeImg.map((item, index) => {
      //   if (item.url == url.slice(urlIndex)) {
      //     self.agreeImg.splice(index, 1)
      //     self.form.agreement_img.splice(index, 1)
      //   }
      // })
    },
    handlePrev(formShow,prevShow){
      this.activeStep --
      this[formShow] = false
      this[prevShow] = true
    },
    handleNext(form,formShow,nextShow) {
      let self = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          self.activeStep ++
          self[formShow] = false
          self[nextShow] = true
        }
      });
    },
    beforeAvatarUpload (file) {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error('上传图片大小不能超过 5MB!');
      }
      return isLt5M;
    },
    handleExceed (files, fileList) {
      this.$message.warning('已达到最大上传数量');
    },
    upload (value) {
      let self = this
      let render = new FileReader();
      render.readAsDataURL(value.file)
      render.onload = function (e) {
        goods.uploadImg({
          file_name: value.file.name,
          file_content: e.target.result,
          target_type: '30',
          image_type: 'shop_apply',
          seller_id: self.accountId,
          is_private:1
        }).then((res) => {
          if (res.code == 0) {
            console.log(value.action);

            if (value.action == "1") {
              self.form.brand_warranty.push(res.data.ident)
              self.brandImg.push({url:res.data.url})
            }
            if (value.action == "2") {
              self.form.shopuser_identity_img_z = res.data.ident
            }
            if (value.action == "3") {
              self.form.shopuser_identity_img_f = res.data.ident
            }
            if (value.action == "4") {
              self.form.corporate_identity_img_z = res.data.ident
            }
            if (value.action == "5") {
              self.form.corporate_identity_img_f = res.data.ident
            }
            if (value.action == "6") {
              self.form.license_img = res.data.ident
            }
            if (value.action == "7") {
              self.form.tissue_code_img = res.data.ident
            }
            if (value.action == "8") {
              self.form.tax_certificate = res.data.ident
            }
            if (value.action == "9") {
              self.form.bank_account_certificate = res.data.ident
            }
            if (value.action == "10") {
              self.form.customs_entry_img.push(res.data.ident)
              self.entryImg.push({url:res.data.url})
            }
            if (value.action == "11") {
              self.form.agreement_img.push(res.data.ident)
              self.agreeImg.push({url:res.data.url})
            }
          }
        })
      }
    },
    removeImgZ (file, fileList) {
      this.form.shopuser_identity_img_z = ''
    },
    removeImgF (file, fileList) {
      this.form.shopuser_identity_img_f = ''
    },
    removeIdentityZ (file, fileList) {
      this.form.corporate_identity_img_z = ''
    },
    removeIdentityF (file, fileList) {
      this.form.corporate_identity_img_f = ''
    },
    removeImgLicense (file, fileList) {
      this.form.license_img = ''
    },
    removeImgTissue (file, fileList) {
      this.form.tissue_code_img = ''
    },
    removeImgTax (file, fileList) {
      this.form.tax_certificate = ''
    },
    removeImgBank (file, fileList) {
      this.form.bank_account_certificate = ''
    },
    handleTypeChange (value) {
      this.secondCate = []
      this.brandList = []

      this.form.shop_cat.secondly_cat = []
      this.form.shop_cat.primary_cat = ''
      this.form.shop_brand = ''
      if (value == 4) {
        this.form.shop_cat.primary_cat = []
      }
      if (value == 3 || value == 4) {
        this.form.shop_brand = []
      }
    },
    handleFirst (value) {
      this.secondCate = []
      this.brandList = []

      this.form.shop_cat.secondly_cat = []
      this.form.shop_brand = ''

      if (this.form.shop_type == 3 || this.form.shop_type == 4) {
        this.form.shop_brand = []
      }

      if (this.form.shop_type == 4) {
        this.secondLen = 5 * value.length
        for (let i = 0; i < value.length; i++) {
          for (let item in this.cateGory) {
            if (value[i] == this.cateGory[item].id) {
              this.secondCate.push({
                id: this.cateGory[item].id,
                label: this.cateGory[item].name,
                children: this.cateGory[item].children
              })
            }
          }
        }
      } else {
        this.secondLen = 5
        for (let item in this.cateGory) {
          if (value == this.cateGory[item].id) {
            this.secondCate.push({
              id: this.cateGory[item].id,
              label: this.cateGory[item].name,
              children: this.cateGory[item].children
            })
          }
        }
      }

    },
    getBrandList (value) {
      if (value == '') {
        this.brandList = []
        if(this.form.shop_type==3 || this.form.shop_type==4){
          this.form.shop_brand = []
        }else{
          this.form.shop_brand = ""
        }
        return
      }
      let id = value.join(',')

      enter.getRelBrandList({ category_secondly_id: id }).then((res) => {
        if (res.code === 0) {
          this.brandList = res.data
          if(this.form.shop_type==3 || this.form.shop_type==4){
            this.form.shop_brand = []
          }else{
            this.form.shop_brand = ""
          }
        }
      })


    },
    handleSubmit(){
      let {channelType}=this;
      this.$refs.forthForm.validate((valid) => {
        if (valid) {
          this.form.seller_id = this.accountId
          this.form.establish_date /= 1000
          this.form.license_indate /= 1000

          enter.createEnterApply(this.form,channelType).then((res)=>{
            if(res.code==0){
              this.forthShow = false
              this.getApplyStatusInfo({seller_id: this.accountId})
              this.fiveShow = true
              this.updateBtn = false
              thi.activeStep ++
            }else {

              this.form.establish_date *= 1000
              this.form.license_indate *= 1000

              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 1000
              })
            }
          }).catch((err)=>{
            this.form.establish_date *= 1000
            this.form.license_indate *= 1000
          })
        }
      })
    },
    getApplyStatusInfo(params){
      enter.getApplyStatusInfo(params).then((res)=>{
        if(res.code == 0){
          if(res.data.id != null){

            if(res.data.status == 4){
              this.$router.push({path: '/home'})
            }

            if(res.data.status == 1&&res.data.status == 2 ){
              this.updateBtn = false
            }

            if(res.data.status == 3){
              this.updateBtn = true
            }

            this.activeStep = 4
            this.firstShow = false
            this.fiveShow = true

            this.table = res.data

            this.table.create_time = this.table.create_time?this.formatTime(this.table.create_time):''
            this.table.refuse_time = this.table.refuse_time?this.formatTime(this.table.refuse_time):''
            this.table.update_time = this.table.update_time?this.formatTime(this.table.update_time):''
            this.table.agree_time = this.table.agree_time?this.formatTime(this.table.agree_time):''


          }
        }else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 1000
          })
        }
      }).catch((err)=>{
        this.$message({
            showClose: true,
            message: err.message,
            type: 'error',
            duration: 1000
          })
      })
    },
    getEnterApply(){
      let params = {apply_id: this.table.id}
      enter.getEnterApply(params).then((res)=>{
        if(res.code == 0){

          this.isUpdate = true

          this.activeStep = 0
          this.firstShow = true
          this.fiveShow = false

          let newRes = JSON.stringify(res.data.enter_data)
          this.form =  JSON.parse(newRes)
          let _useforqiniu = JSON.parse(JSON.stringify(res.data.enter_data))
          this.form.shop_name = res.data.shop_name
          this.form.shop_type = res.data.shop_type
          if(this.form.shop_type != 4){
            this.form.shop_cat.primary_cat = parseInt(this.form.shop_cat.primary_cat)
          }
          if(this.form.shop_type == 3 || this.form.shop_type == 4){
            !this.form.shop_brand && this.$set(this.form,'shop_brand',[])
          }
          if(!this.form.brand_warranty){
            this.$set(this.form,'brand_warranty',[])
          }

          this.form.is_mainland = parseInt(this.form.is_mainland)

          this.form.company_name = res.data.company_name

          this.form.establish_date *= 1000
          this.form.license_indate *= 1000

          this.handleFirst(this.form.shop_cat.primary_cat)
          this.form.shop_cat.secondly_cat = res.data.enter_data.shop_cat.secondly_cat

          let secondly_id = this.form.shop_cat.secondly_cat.join(',')

          enter.getRelBrandList({ category_secondly_id: secondly_id}).then((res) => {
            if (res.code === 0) {
              this.brandList = res.data
            }
          })

          this.form.shop_brand = res.data.enter_data.shop_brand

          let _imglistwarry = []
          for(let i=0;i<this.form.brand_warranty.length;i++){
            this.imgList.img_brand_list.push({
              uid: i,
              url: this.form.brand_warranty[i].url
            })
            this.brandImg.push({url:this.form.brand_warranty[i].url})
            _imglistwarry.push(this.form.brand_warranty[i].ident)
          }
          this.form.brand_warranty = _imglistwarry

          this.imgList.img_userid_z_list.push({
            uid: 0,
            url: this.form.shopuser_identity_img_z.url
          })
          this.form.shopuser_identity_img_z = _useforqiniu.shopuser_identity_img_z.ident || ''

          this.imgList.img_userid_f_list.push({
            uid: 0,
            url: this.form.shopuser_identity_img_f.url
          })
          this.form.shopuser_identity_img_f = _useforqiniu.shopuser_identity_img_f.ident || ''

          this.imgList.img_corporid_z_list.push({
            uid: 0,
            url: this.form.corporate_identity_img_z.url
          })
          this.form.corporate_identity_img_z = _useforqiniu.corporate_identity_img_z.ident || ''

          this.imgList.img_corporid_f_list.push({
            uid: 0,
            url: this.form.corporate_identity_img_f.url
          })
          this.form.corporate_identity_img_f = _useforqiniu.corporate_identity_img_f.ident || ''

          this.imgList.img_license_list.push({
            uid: 0,
            url: this.form.license_img.url
          })
          this.form.license_img = _useforqiniu.license_img.ident || ''

          if(this.form.tissue_code_img){
            this.imgList.img_tissue_list.push({
              uid: 0,
              url: this.form.tissue_code_img.url
            })
            this.form.tissue_code_img = _useforqiniu.tissue_code_img.ident
          }


          if(this.form.tax_certificate){
            this.imgList.img_tax_list.push({
              uid: 0,
              url: this.form.tax_certificate.url
            })
            this.form.tax_certificate = _useforqiniu.tax_certificate.ident
          }

          this.imgList.img_bank_account_list.push({
            uid: 0,
            url: this.form.bank_account_certificate.url
          })
          this.form.bank_account_certificate = _useforqiniu.bank_account_certificate.ident || ''

          if(this.form.customs_entry_img){
            let _imglist = []
            for(let j=0;j<this.form.customs_entry_img.length;j++){
              this.imgList.img_entry_list.push({
                uid: j,
                url: this.form.customs_entry_img[j].url
              })
              this.entryImg.push({url:this.form.customs_entry_img[j].url})
              _imglist.push(this.form.customs_entry_img[j].ident)
            }
            this.form.customs_entry_img = _imglist
          }

          if(this.form.agreement_img){
            let _imglists = []
            for(let z=0;z<this.form.agreement_img.length;z++){
              this.imgList.img_agreement_list.push({
                uid: z,
                url: this.form.agreement_img[z].url
              })
              this.agreeImg.push({url:this.form.agreement_img[z].url})
              _imglists.push(this.form.agreement_img[z].ident)
            }
            this.form.agreement_img = _imglists
          }

        }else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 1000
          })
        }
      })
          // .catch((err)=>{
      //   this.$message({
      //       showClose: true,
      //       message: err.message+'55555',
      //       type: 'error',
      //       duration: 1000
      //     })
      // })
    },
    updateEnterApply(){
      let {channelType}=this;
      this.$refs.forthForm.validate((valid) => {
        if (valid) {
          this.form.seller_id = this.accountId
          this.form.apply_id = this.table.id

          this.form.establish_date /= 1000
          this.form.license_indate /= 1000

          enter.updateEnterApply(this.form,channelType).then((res)=>{
            if(res.code==0){
              this.forthShow = false
              this.getApplyStatusInfo({seller_id: this.accountId})
              this.fiveShow = true
              this.updateBtn = false
              thi.activeStep ++
            }else {
              this.form.establish_date *= 1000
              this.form.license_indate *= 1000

              this.$message({
                showClose: true,
                message: res.message,
                type: 'error',
                duration: 1000
              })
            }
          }).catch((err)=>{
            this.form.establish_date *= 1000
            this.form.license_indate *= 1000
          })
        }
      })
    }
  },
  created () {
    enter.getCategory().then((res) => {
      if (res.code === 0) {
        this.cateGory = res.data
        for (let item in res.data) {
          this.firtCate.push({
            id: res.data[item].id,
            name: res.data[item].name
          })
        }
      }
    })
    this.getApplyStatusInfo({seller_id: this.accountId})
  }
}

</script>

<style lang='scss' scoped>
.enter {
  padding: 100px 20%;
  background: #2b88cb;
  min-height: 100vh;
  .shop-name-show{
    font-size: 8px;
  }
  .el-input {
    width: 300px;
  }
  .form {
    margin-left: 70px;
    margin-top: 20px;
    .secondly_cat {
      width: 50%;
    }
    .btnGroup {
      text-align: center;
    }
    .img_sepc{
      .el-form-item__label{
          font-size: 8px;
          padding: 0;
      }
      .el-form-item__content{
          margin-left: 100px;
          display: flex;
          flex-direction: row;
          .el-upload--picture-card{
            width: 68px;
            height: 68px;
            line-height: 75px;
          }
      }

      .el-upload-list--picture-card{
        .el-upload-list__item{
            width: 68px;
            height: 68px;
        }
      }
      .el-button{
          width: 68px;
          height: 68px;
          font-size: 24px;
      }
    }
  }
  .enterin-img{
    display: contents;
  }
  .img_edit{
      width: 148px;
      height: 148px;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0 8px 8px 0;
      position: relative;
      display: inline-flex;
      &>img{
        width:100%;
        height: 100%;
      }
      .img_delete{
        width: 100%;
        height: 100%;
        position: absolute;
        display: none;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,0.3);
        text-align: center;
        line-height: 146px;
        color: white;
        align-items: center;
        justify-content: center;
      }
    &:hover{
      .img_delete{
        display: flex;
      }
    }
  }

  .proTable{
    margin-top: 20px;
    .progress{
      width: 100%;
      color: #606266;
      font-size: 18px;
      font-weight: 500;
      line-height: 38px;
      .first{
        width: 20%;
      }
      .second{
        width: 28%;
      }
    }
  }
}
</style>
