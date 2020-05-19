<template>
<div class="add">
  <el-card>
    <el-form :model="addForm">
      <el-form-item label="发货地：">
        <el-input v-model="addForm.area.city.text" @focus="showArea"></el-input>
        <div class="area" v-show="areaShow">
          <div class="header">
            <span :class="areaType===1?'active':''" @click="changeArea" class="title">国内</span>
            <span :class="areaType===2?'active':''" @click="changeArea" class="title">国际</span>
          </div>
          <div class="body">
            <el-input placeholder="请输入城市名" prefix-icon="el-icon-search" @change="searchCity">
            </el-input>
            <div class="letter">
              <a :href="`#${char}`" v-for="char in chars">{{char}}</a>
            </div>
            <div class="main">
              <div v-show="!is_search" class="item" :id="key" v-for="(item,key) in areaList">
                <span class="key">{{key}}</span>
                <div class="province" v-for="province in item">
                  <h4 v-if="areaType==1" class="title">{{province.label}}</h4>
                  <h4 v-else class="title" @click="chooseCountry(province)">{{province.label}}</h4>
                  <ul>
                    <li v-for="city in province.children" class="city" @click="chooseCity(province,city)">{{city.label}}</li>
                  </ul>
                </div>
              </div>

              <div v-show="is_search" class="searchItem">
                <div class="province" v-for="province in areaList">
                  <h4 v-if="areaType==1" class="title">{{province.label}}</h4>
                  <h4 v-else class="title" @click="chooseCountry(province)">{{province.label}}</h4>
                  <ul>
                    <li v-for="city in province.children" class="city" @click="chooseCity(province,city)">{{city.label}}</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>

      </el-form-item>
      <el-form-item label="仓库类型：">
        <el-select v-model="addForm.store_type">
          <el-option label="普通仓" value="1"></el-option>
          <el-option label="保税仓" value="2"></el-option>
          <el-option label="海外仓" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-radio-group v-model="addForm.is_used">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button type="default" @click="handleCancel">取消</el-button>
    </el-form>
  </el-card>
</div>
</template>

<script>
import delivery from '@/api/delivery'

export default {
  data () {
    return {
      chars: [],
      areaList: '',
      is_search:false,
      areaType: 1,
      areaShow: false,
      addForm: {
        area: {
          province: {
            code: '',
            text: ''
          },
          city: {
            code: '',
            text: ''
          }
        },
        store_type: '',
        is_used: 1
      }
    }
  },
  methods: {
    setArea (params) {
      delivery.getWarehouseArea(params).then((res) => {
        if (res.code === 0) {
          this.chars = res.data.chars
          this.areaList = res.data.list
        }
      })
    },
    changeArea () {
      this.areaType = this.areaType === 1 ? 2 : 1
      this.setArea({ area_type: this.areaType })
    },
    showArea () {
      this.areaShow = true
    },
     chooseCountry (province,) {
      this.addForm.area.province.code = province.id
      this.addForm.area.province.text = province.label
      this.addForm.area.city.code = province.id
      this.addForm.area.city.text = province.label
      this.areaShow = false
    },
    chooseCity (province, city) {
      this.addForm.area.province.code = province.id
      this.addForm.area.province.text = province.label
      this.addForm.area.city.code = city.id
      this.addForm.area.city.text = city.label
      this.areaShow = false
    },
    searchCity(params){
       delivery.getWarehouseArea({area_type: this.areaType, keyword:params}).then((res) => {
        if (res.code === 0) {
          if(params == ''){
            this.is_search  = false
            this.chars = res.data.chars
            this.areaList = res.data.list
          }else{
            this.is_search  = true
            this.areaList = res.data
          }
        }
      })
    },
    submitForm(){
      delivery.createWarehouse(this.addForm).then((res)=>{
        if(res.code === 0){
          this.$router.push({name: 'warehouse'})
        }
      })
    },
    handleCancel(){
      this.$router.push({name: 'warehouse'})
    }
  },
  created () {
    this.setArea({ area_type: this.areaType })
  }
}

</script>

<style lang='scss' scoped>
.add {
  margin: 20px;
  .el-input {
    width: 200px;
  }
  .area {
    margin: 10px 0 0 68px;
    width: 500px;
    border: 1px solid #ddd;
    .header {
      .title {
        display: inline-block;
        width: 247px;
        text-align: center;
        border-bottom: 1px solid #ddd;
        background: #f5f5f5;
      }
      .active {
        background: #fff;
        border: none;
      }
    }
    .body {
      .el-input {
        margin: 10px;
      }
      .letter {
        float: right;
        height: 40px;
        margin: 10px;
        a {
          display: inline-block;
          margin: 0 2px;
          color: #2b88cb;
        }
      }
      .main {
        height: 250px;
        overflow: auto;
        .item {
          overflow: hidden;
          .key {
            float: left;
            height: 30px;
            line-height: 30px;
            background: #f1f1f1;
            padding: 0 10px;
            margin-left: 20px;
          }
          .province {
            width: 430px;
            margin-left: 10px;
            float: right;
            .title:hover{
              cursor: pointer;
            }
            ul {
              overflow: hidden;
              .city {
                float: left;
                margin-right: 10px;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
        .searchItem{
          overflow: hidden;
          .province {
            width: 430px;
            ul {
              overflow: hidden;
              .city {
                float: left;
                margin-right: 10px;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
