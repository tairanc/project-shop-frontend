<template>
  <el-table
    v-loading="loading"
    :data="pageList"
    :height="height"
    :selection="selection"
    stripe
    border
    highlight-current-row
    @selection-change="handleSelectionChange"
    style="width: 100%">

    <el-table-column
      v-if="selection"
      type="selection"
      width="35">
    </el-table-column>

    <el-table-column
      v-if="index"
      label="序号"
      width="50"
      type="index"
      :index="indexFn"
    >
    </el-table-column>

   <!--  普通单元格 -->
    <el-table-column
      v-for="(item,index) in columns"
      v-if="item.field&&!item.link&&!item.desField&&!item.tags&&!item.isGood"
      :key="'col'+index"
      :header-align="item.headerAlign||'center'"
      :label="item.label"
      :align="item.align"
      :prop="item.field"
      :width="item.width"
      :min-width="item.minWidth"
      :formatter="item.formatter">
    </el-table-column>

    <!-- 商品链接 -->
     <el-table-column
      v-else-if="!item.field&&item.isGood"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <a v-if="item.isGood==1" class="goods_url" :href="defaultUrl('id',scope.row)" target="_blank">{{scope.row.title}}</a>
        <a v-else class="goods_url" :href="defaultUrl('item_id',scope.row)" target="_blank">{{scope.row.title}}</a>
      </template>
    </el-table-column>

    <!-- 自定义 左图右标题 下自定义信息 -->
    <el-table-column
      v-else-if="!item.field&&item.desField"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <img :src="scope.row.primary_image+'_t.jpg'" :onerror="defaultImg" class="main-img">
        <span><a class="goods_url" :href="defaultUrl('id',scope.row)" target="_blank">{{scope.row.title}}</a></span>
        <div><span>商品货号(SPU)：{{scope.row.art_no}}</span></div>
      </template>
    </el-table-column>
     <!-- 自定义 礼包报名情况 -->
    <el-table-column
      v-else-if="!item.field&&item.gift"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <div><span>未审核：{{scope.row.pending_num}}</span></div>
        <div><span>审核通过：{{scope.row.agree_num}}</span></div>
        <div><span>审核未通过：{{scope.row.refuse_num}}</span></div>
      </template>
    </el-table-column>
     <!-- 自定义 左图右标题 下自定义信息 有编辑框-->
    <el-table-column
      v-else-if="!item.field&&item.desFields"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <img :src="imageDomains(scope.row.primary_image)+'_t.jpg'" class="main-img">
        <span>{{scope.row.title}}</span>
        <div><span>{{scope.row.spec_nature_info}}</span></div>
      </template>
    </el-table-column>

    <el-table-column
      v-else-if="!item.field&&item.textp"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <p v-for="option in scope.row.textp">{{option}}</p>
      </template>
    </el-table-column>
    <!--表单 单选-->
    <el-table-column
      v-else-if="!item.field&&item.isradio"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      width="35">
      <template slot-scope="scope">
        <el-radio v-model="bindmodels" :label="scope.row.radioLable" @change="backRowData(scope.row)">{{scope.row.showradiovalue}}</el-radio>
      </template>
    </el-table-column>
    <!--免单券领取时间 拼接-->
    <el-table-column
      v-else-if="!item.field&&item.obtaintime"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <span>{{scope.row.obtain_start_time}}~{{scope.row.obtain_end_time}}</span>
      </template>
    </el-table-column>
    <!--有编辑框-->
    <el-table-column
      v-else-if="!item.field&&item.text"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :align="item.align"
      :label="item.label"
      :width="item.width">
      <template slot-scope="scope">
        <el-input type="number" v-model="scope.row.num"></el-input>
      </template>
    </el-table-column>
    <!-- 链接 -->
    <el-table-column
      v-else-if="item.field&&item.link"
      :header-align="item.headerAlign||'center'"
      :key="'col'+index"
      :label="item.label"
      :align="item.align"
      :width="item.width">
      <template slot-scope="scope">
        <router-link style="color:#2b88cb" :to="`${item.link}/${scope.row[scope.row[item.field].option]} `">{{scope.row[item.field].text}}</router-link>
      </template>
    </el-table-column>

    <!-- 单元格下多级 -->
    <el-table-column
      v-else-if="!item.field&&item.children"
      :key="'col'+index"
      :header-align="item.headerAlign||'center'"
      :label="item.label">
      <el-table-column
        v-for="(item,index) in item.children"
        :key="'col'+index"
        :label="item.label"
        :prop="item.field"
        :width="item.width"
        :align="item.align"
        :formatter="item.formatter">
      </el-table-column>
    </el-table-column>

    <!-- 单元格内为操作按钮 -->
    <el-table-column
      v-else-if="!item.field&&item.actions"
      :fixed="item.fixed"
      :header-align="item.headerAlign||'center'"
      :label="item.label"
      :align="item.align"
      :width="item.width">
      <template slot-scope="scope">
        <el-button
          v-for="(subItem,index) in item.actions"
          v-if="subItem.visible?subItem.visible(scope.row):true"
          :key="'action'+index"
          :type="subItem.type"
          :size="subItem.size||'mini'"
          :disabled="subItem.disable?subItem.disable(scope.row,index):false"
          @click.stop="subItem.click(scope.$index,scope.row)">
          {{subItem.label}}
        </el-button>
      </template>
    </el-table-column>

    <!-- tag单元格 -->
    <el-table-column
      v-else-if="item.field&&item.tags"
      :header-align="item.headerAlign||'center'"
      :align="item.align"
      :label="item.label"
      :props="item.field">
      <template slot-scope="scope">
       <el-tag
        v-for="(tag,index) in item.tags"
        v-if="scope.row[item.field]==tag.index"
        :type="tag.type"
        :color="tag.color"
        :key="index">{{tag.name}}
       </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    bindmodel : '',
    selection: false,
    index: false,
    height: {
      type: Number
    },
    loading: {
      type: Boolean,
      default: false
    },
    pageList: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    },
    indexMethod: {
      type: Function
    },
    imageDomain:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bindmodels:this.bindmodel,
      defaultImg: 'this.src="' + require('../../assets/good-defalut.png') + '"',
    }
  },
  methods: {
    ...mapActions([
      'setSkuSelect'
    ]),

    handleSelectionChange (val) {
      this.$emit('select-change', val)
    },
    indexFn (index) {
      return (this.indexMethod && this.indexMethod(index)) || (index + 1)
    },
    imageDomains(img){
      var newstr="";
      var imgs=img.substring(0,1);

      var estr=img.substring(1,imgs.length);

      newstr+=this.imageDomain+img+estr;

      return newstr;
    },
    backRowData (val){
      this.setSkuSelect(val)
    }
  },
  watch : {
    bindmodel(val){
      this.bindmodels = val
    },
    bindmodels(val){
      this.$emit('radioBackRowData', val)
    }
  }
}
</script>

<style lang="scss">
.main-img{
  width: 60px;
  height: 60px;
  vertical-align: middle;
}
.goods_url{
  cursor: pointer;
  &:hover{
    color: #409EFF
  }
}
</style>
