<template>
  <el-pagination
    :paginationName="paginationName"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total||0">
  </el-pagination>
</template>

<script>
export default {
  props: {
    paginationName: {
      type: String,
      default: ''
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 0
    },
    pagesize : {
      type : Number,
      default : 20
    }
  },
  methods: {
    handleSizeChange (val) {
      this.$emit('size-change', val, this.paginationName)
    },
    handleCurrentChange (val) {
      this.$emit('current-change', val, this.paginationName)
    }
  }
}
</script>
<style>
.el-pagination {
  float: right;
  margin-top: 10px;
  margin-right: 10px;
}
</style>