<template>
  <div class="searchForm">
    <el-form :ref="forms.name"  label-width="100px" size="medium">

      <el-col :span="6" :offset="1" v-for="form in forms.items" :key="form.label">

        <el-form-item  :label="form.label">
          <el-input v-if="form.type===1" ></el-input>
          
          <el-select v-else-if="form.type===2">
            <el-option v-for="option in form.options" :key="option.label" :label="option.label" :value="option.code"></el-option>
          </el-select>

          <template v-else-if="form.type===3">
            <el-col :span="11">
              <el-form-item>
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2"> 到</el-col>
            <el-col :span="11">
              <el-form-item>
                <el-input></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-form-item>

      </el-col>

      <div class="form-button">
        <el-col :span="8" :offset="7">
          <el-form-item>
            <el-button type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </div>
        
      
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    forms: {
      type: Object
    }
  },
  methods:{
  }
}

</script>

<style lang='scss' scoped>
.searchForm{
  .form-button{
    clear: both;
  }
}
</style>
