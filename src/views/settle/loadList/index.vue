<template>
  <div class="summary">
    <el-tabs type="border-card" style="margin-bottom: 50px">
      <el-form>
        <el-row>
            <!--<el-col :span='6' :offset="1">
              <el-form-item label="开始时间：" prop="start_at">
                <el-date-picker v-model="form.start_date" type="datetime" placeholder="开始时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span='6' :offset="1">
              <el-form-item label="结束时间：" prop="end_at">
                <el-date-picker v-model="form.end_date" type="datetime" placeholder="结束时间"
                                format="yyyy-MM-dd HH:mm:ss"
                                value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
              </el-form-item>
            </el-col>-->
          <el-col :span="12" :offset="1">
            <el-form-item label="创建时间:" prop="trade_time">
              <el-date-picker
                v-model="trade_time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span='5' :offset="1">
            <el-button type="primary" icon="el-icon-search" @click="searchFormdata(form)">搜索</el-button>
            <el-button @click="clearBtn">清空条件</el-button>

          </el-col>
        </el-row>
      </el-form>
    </el-tabs>
    <table-view
      :columns="columns"
      :pageList="list"
      id='rebateSetTable'
    ></table-view>

    <pagination-view
      :height="600"
      :currentPage="form.page"
      :total="total"
      @size-change="sizeChange"
      @current-change="pageChange">
    </pagination-view>
    <el-dialog
      title="提示"
      :visible.sync="urldialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>{{fileUrl}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="urldialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  import PaginationView from '@/components/PaginationView'
  import TableView from '@/components/TableView'
  import commission from '@/api/settle/loadlist'
  import {getInitDay} from '@/utils/createtime.js'


  export default {
    data() {
      return {
        total: 0,
        trade_time:[],
        urldialogVisible:false,
        fileUrl:'',
        form: {
          page: 1,
          page_size: 20,
        },
        list: [],
        columns: [
          /*{label: '操作者id', field: 'operator_id', align: 'center'},*/
          {label: '文件名', field: 'file_name', align: 'center'},
          /*{label: '存储驱动', field: 'storage', align: 'center'},
          {label: '来源', field: 'from', align: 'center'},*/
          {label: '创建时间', field: 'created_at', align: 'center'},
          /*{label: '更新时间', field: 'updated_at', align: 'center'},*/
          {
            label: '操作',
            align: 'center',
            actions: [
              {
                label: '下载',
                type: 'text',
                size: 'medium',
                click: (index, row) => {
                  this.openInfo(row.file_name)
                }
              },
            ]
          }
        ]
      }
    },
    methods: {
      searchFormdata(form){
        form.page=1;
        this.searchDownloadList(form);
      },
      searchDownloadList(data) {
        if(this.trade_time){
          this.form.start_date =this.trade_time[0]
          this.form.end_date =this.trade_time[1]
        }
        commission.searchDownloadList(data).then((res) => {
          this.total = res.data.total_count
          this.list = []
          for (var i in res.data.list) {
            this.list.push(res.data.list[i])
          }
        })
      },
      sizeChange(val) {
        this.form.page_size = val;
        this.searchDownloadList(this.form)
      },
      pageChange(val) {
        this.form.page = val;
        this.searchDownloadList(this.form)
      },
      //行项目下载
      openInfo(filename){
        console.log('filename',filename);
        this.info(filename);
      },
      //行项目下载
      info(filename){
        let data = {
          filename:filename
        };
        console.log(data);
        commission.getDownloadAuthUrl(data).then((res) => {
          if(res.code==0){
            console.log(res.data.authUrl);
            window.open(res.data.authUrl,filename);
          }
        })
      },
      //清空
      clearBtn(){
        this.form.start_date=''
        this.form.end_date=''
        this.trade_time=[]
      }
    },
    created: function () {
      this.trade_time[0] = getInitDay('start');
      this.trade_time[1] = getInitDay('end');
      this.searchDownloadList(this.form)
    },
    components: {
      TableView,
      PaginationView
    }
  }
</script>
<style lang="scss" scoped>
  .summary {
    padding: 20px
  }
  .btn {
    margin-top: 10px;
    padding: 5px
  }
</style>

