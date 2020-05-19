<template>
  <div class="batchShipment">
    <p>
      <span style="font-weight: 700;color: #303133;">批量导入发货订单</span>
      <span style="fontSize:14px">(批量导入订单只支持一个店铺订单对应一个运单号的情况)</span>
    </p>

    <el-form style="margin-top:50px">
      <el-row>
        <el-col :offset="1" :span="6">
          <el-form-item>
            <!-- <el-upload
                        class="upload-demo"
                        action="/trmall/order/batch_delivery"
                        :on-change="handleChange"
                        :on-success='successUpdata'
                        :on-error='errorUPdata'
                        :limit="1"
                        :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                       
            </el-upload>-->
            <input
              id="upload"
              ref="importfxx"
              class="ipt"
              type="file"
              v-on:change="importfxx(this, $event)"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
          </el-form-item>
        </el-col>
        <el-col :offset="1" :span="6">
          <a :href="md" download="batch_delivery.xlsx" class="goods_url">下载模版</a>
          <!-- <el-table class="table" border align="center" :data='list' v-show='false' id="rebateSetTable">
                        <el-table-column align="center" label="店铺订单号" prop="order_shop_no">
                        </el-table-column>
                        <el-table-column align="center" label="物流公司编码" prop="corp_code">
                        </el-table-column>
                        <el-table-column align="center" label="运单号" prop="express_no">
                        </el-table-column>
          </el-table>-->
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="18" class="height-scroll" v-if="successArray != ''">
          <p v-if="showArrayInfo">需要发货总包裹数量：{{allDataLength}}条</p>
          <p v-if="showArrayInfo">已处理的包裹数量：{{successArray}}条</p>
          <div v-if="failureArray != ''">
            <!-- <p>导入失败：{{failureArray.length}}条</p> -->
            <p>订单信息：</p>
            <p v-for="(failure,index) in failureArray" :key="index">{{failure}}</p>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="6">
          <el-form-item>
            <!-- <el-button @click="clickDr(updataList)">导入</el-button> -->
            <el-button @click="inputNew" size="small" type="primary">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
  <script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import md from "@/assets/mb.xlsx";
import order from "@/api/deal/order";
import { randomFun } from '@/utils/common';

let uniquetime = '';
export default {
  data() {
    return {
      url: "",
      md: md,
      fileList: [],
      updataList: [],
      allDataLength: 0,
      successArray: "",
      failureArray: [],
      showArrayInfo: true,
      upFileType:"",
      list: []
    };
  },
  methods: {
    handleChange(file, fileList) {
      console.log(fileList);
    },
    successUpdata(response, file, fileList) {
      this.$message({
        type: "success",
        message: "上传成功"
      });
    },
    errorUPdata(err, file, fileList) {
      this.$message({
        type: "error",
        message: "上传失败"
      });
    },
    init_batch_delivery() {
      order.init_batch_delivery().then(res => {
        this.url = res.data.demo_dir;
        window.open(this.url);
      });
    },
    downMB() {
      let wb = XLSX.utils.table_to_book(
        document.querySelector("#rebateSetTable")
      );
      let wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "批量发货模版.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
      // this.init_batch_delivery()
    },
    batch_delivery(data) {
        let _this = this
        let _randomnum = randomFun(1,100);
        let _newDate = new Date().getTime();
        let _unique = _newDate + 'a' + _randomnum; //拼接一个随机数和当前时间戳
        uniquetime = _unique
        let _data = {
           unique: _unique,
           list: data
        }
      order.batch_delivery(_data).then(res => {
        this.$message({
          type: "success",
          message: "上传成功"
        });
        _this.packBatchInfo(); //查询批量发货控制台信息
      });
    },
    // 循环查询订单状态 订单状态在进行中 就继续循环请求
    packBatchInfo(){
        let _this = this
        let _data = {
            unique: uniquetime
        }
        order.packBatchConsoleInfo(_data).then(res => {
            if(res.status == "loading"){
              _this.showArrayInfo = false
              _this.successArray = "0";
              _this.failureArray = res.console;
            }else{
              _this.showArrayInfo = true
              _this.allDataLength = parseInt(res.totalCount) || 0
              _this.successArray = res.processedCount;
              _this.failureArray =  (_this.upFileType == "loading" ? [] : _this.failureArray).concat(res.console);
            }
            
            if (res.status == "loading" || res.status == "running") {
                _this.upFileType = res.status
                setTimeout(() => {
                    _this.packBatchInfo()
                }, 1000);
            }
      });
    },
    inputNew() {
      this.upFileType = ""
      this.$refs.importfxx.value = null;
      this.allDataLength = 0;
      this.successArray = "";
      this.failureArray = [];
    },
    clickDr(data) {
      let _this = this;

      let dsq = setInterval(function() {
        if (!this.flag) {
          if (data != "") {
            _this.batch_delivery(data);
          }
        } else {
          clearInterval(dsq);
        }
      }, 500);
    },
    importfxx(obj, events) {
      let _this = this;
      let inputDOM = this.$refs.inputer;

      // 通过DOM取文件数据
      let event = event || window.event || events;
      this.file = event.currentTarget.files[0];

      var rABS = false; //是否将文件读取为二进制字符串
      var f = this.file;

      var reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function(f) {
        var binary = "";
        var rABS = false; //是否将文件读取为二进制字符串
        var pt = this;
        var wb; //读取完成的数据
        var outdata;
        var reader = new FileReader();
        reader.onload = function(e) {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          this.updataList = [];
          for (let i in outdata) {
            var object = {
              order_shop_no: "",
              corp_code: "",
              express_no: "",
              order_good_no: "",
              num: ""
            };
            object.order_shop_no = outdata[i]["店铺订单号"];
            object.corp_code = outdata[i]["物流公司编码"];
            object.express_no = outdata[i]["运单号"];
            object.order_good_no = outdata[i]["商品级订单号"];
            object.num = outdata[i]["发货数量"];
            this.updataList.push(object);
          }
          _this.batch_delivery(this.updataList);
        };
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.batchShipment {
  padding: 10px;
  .height-scroll{
    height: 300px;
    overflow: scroll;
    border: 1px solid #d8d8d8;
    padding: 10px;
  }
  .goods_url {
    cursor: pointer;
  }
  .goods_url:hover {
    color: #409eff;
  }
  .ipt {
  }
}
</style>

