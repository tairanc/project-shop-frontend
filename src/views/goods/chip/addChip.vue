<template>
    <div class='chip'>
        <el-button type="danger" @click="selectVisible=true">选择商品</el-button>
        <p></p>
        <select-goods :selectVisible="selectVisible" :selectList="selectList" :subType="type" @visible-change="handleVisible" @choose-submit="handleAdd"></select-goods>

        <!-- <table-view ref="goodsTable" :columns="columns" :pageList="goodsList"></table-view> -->
        <table style="width:100%">
            <tr class='chips'>
                <td>商品名称</td>
                <td>规格</td>
            </tr>
            <tr v-for="(item,index) in goodsList" class='tdTc' :key="index">
                <td>{{item.title}}</td>
                <td>
                    <span class='color' v-if='suk_if'>单规格商品不可编辑</span>
                    <span>{{spec_text}}</span>
                    <el-button @click="skuClick({item_id:item_code.item_id})" :disabled="suk_if">选择规格</el-button>
                </td>
            </tr>
        </table>
        <p></p>
        <h4>芯片编码列表</h4>
        <table-view ref="goodsTable" :columns="chip_columns" :pageList="chipCodeList"></table-view>
        <pagination-view :total="total" :currentPage="form.page" @size-change="handleSizeChange" @current-change="handleNumberChange"></pagination-view>
        <p></p>
        <div class='color'>
            <p>注:</p>
            <p>1.最多一次性写入50条</p>
            <p>2.数量默认为1</p>
            <p>3.芯片写入后将不可更改商品</p>
        </div>
        <el-dialog title="规格选择" :visible.sync="centerDialogVisible" width="50%" center>
            <div v-for='(list,index) in skus' :key="index">
                <h4>{{list.name}}</h4>
                <div class='sku-dom'>
                    <span v-for='(sku,index) in list.values' @click="xzClick($event,sku.spec_value_id)" :id='sku.spec_value_id' :key="index">{{sku.text}}</span>
                </div>
                <p></p>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="savaSku" >确 定</el-button>
                </span>
        </el-dialog>
        <p style="text-align: center">
            <el-button type="primary" @click="saveChips">保存</el-button>
            <el-button @click="fh">取消</el-button>
        </p>
    </div>
</template>
<script>
    import TableView from '@/components/TableView'
    import SelectGoods from '@/components/SelectGoods'
    import PaginationView from '@/components/PaginationView'
    import chip from '@/api/chip/chip'
    export default {
        data() {
            return {
                selectVisible: false,
                skus: [],
                only_sku_id: '',
                info_skus: '',
                id: [],
                centerDialogVisible: false,
                suk_if: false,
                value: '',
                type: 'chip',
                options: [],
                type: 'chip',
                chipCodeList: [],
                spec_text: '',
                total: 0,
                form: {
                    page: 1,
                    page_size: 20
                },
                goodsList: [],
                chip_columns: [
                    {
                        label: '芯片编码',
                        field: 'chip_code',
                        align: 'center'
                    }
                ],
                item_code: {
                    item_id: '',
                    sku_id: ''
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                this.form.page_size = val
                this.initChipManager(this.form)
            },
            handleNumberChange(val) {
                this.form.page = val
                this.initChipManager(this.form)
            },
            handleVisible(val) {
                this.selectVisible = val;
            },
            deleteGoods(id) {
                this.goodsList = this.goodsList.filter(function (item) {
                    return item.id != id;
                })
            },
            //保存芯片
            saveChips() {
                chip.saveChips().then((res) => {
                    this.$router.push({
                        name: 'chip'
                    })
                })
            },
            //保存被选择的商品芯片信息
            saveSelectedItem(data) {
                chip.saveSelectedItem(data).then((res) => {
                    this.spec_text = res.data.spec_text
                })
            },
            //保存规格
            savaSku() {
                var red = document.getElementsByClassName('red');
                this.id = []
                for (var j = 0; j < red.length; j++) {
                    this.id.push(red[j].id)
                }
                var sku_id = this.id.join('_')
                this.item_code.sku_id = this.info_skus[sku_id].sku_id
                this.item_code.item_id = this.info_skus[sku_id].item_id
                this.saveSelectedItem(this.item_code)
                this.centerDialogVisible = false
            },
            initChipManager(data) {
                chip.initChipManager(data).then((res) => {
                    this.chipCodeList = [];
                    for (var i in res.data.chipInfo) {
                        var code = {
                            chip_code: ''
                        }
                        code.chip_code = res.data.chipInfo[i]
                        this.total = res.data.total
                        this.chipCodeList.push(code)
                    }
                })
                    .catch(function (error) {
                        console.log(error)
                    })
            },
            handleAdd(val) {
                chip.importItemsById({
                    item_id: val
                }).then((res) => {
                    const result = res.data;
                    let errMsg = "";
                    if (result.itemList.length != 0 && result.itemList.length < 2) {
                        this.goodsList = result.itemList
                        this.options = this.goodsList[0].skus
                        this.item_code.item_id = this.goodsList[0].skus[0].item_id
                        this.item_code.sku_id = this.goodsList[0].skus[0].sku_id
                        this.saveSelectedItem(this.item_code)
                        this.options.length < 2 ? this.suk_if = true : this.suk_if = false
                    } else {
                        this.$message({
                            message: '只能选择一个商品',
                            type: 'error'
                        });
                        return false
                    }
                    if (result.inValidItems.length != 0) {
                        for (let i = 0; i < result.inValidItems.length; i++) {
                            errMsg += "<p>异常商品ID:" + result.inValidItems[i] + "</p>"
                        }
                    }
                    if (result.unsatisfiedItems.length != 0) {
                        for (let i = 0; i < result.unsatisfiedItems.length; i++) {
                            errMsg += "<p>参加了不可叠加的商品:" + result.unsatisfiedItems[i] + "</p>"
                        }
                    }
                    if (errMsg) {
                        this.$message({
                            showClose: true,
                            dangerouslyUseHTMLString: true,
                            message: errMsg,
                            type: 'warning'
                        });
                    }
                })
            },
            skuClick(id) {
                chip.getSkuDetail(id).then((res) => {
                    this.info_skus = res.data.info.skus
                    this.skus = []
                    for (var i in res.data.info.specs) {
                        this.skus.push(res.data.info.specs[i])
                    }
                    this.centerDialogVisible = true
                })
            },
            //点击添加样式
            xzClick(event, id) {
                for (var i = 0; i < event.target.parentNode.childNodes.length; i++) {
                    event.target.parentNode.childNodes[i].className = ''
                }
                event.target.className = 'red'
            },
            fh() {
                this.$router.push({
                    name: 'chip'
                })
            }
        },
        computed: {
            selectList() {
                let list = []
                this.goodsList.map((item) => {
                    list.push(item.id);
                })
                return list
            },

        },
        components: {
            SelectGoods,
            TableView,
            PaginationView
        },
        created: function () {
            this.initChipManager(this.form)
        }

    }

</script>
<style>
    .chip {
        padding: 10px
    }

    .chips td {
        border-bottom: 1px solid #ebeef5;
        text-align: center;
        background: #f5f7fa;
        white-space: nowrap;
        overflow: hidden;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        color: #909399;
        border-collapse: separate;
        font-size: 14px;
        line-height: 40px;
        -webkit-box-sizing: inherit;
        box-sizing: inherit;
        height: 40px;
    }

    .tdTc td {
        text-align: center
    }

    .color {
        color: red;
        font-size: 14px
    }

    .red {
        color: red;
        font-size: 14px
    }

    .sku-dom span {
        cursor: pointer;
        margin-left: 10px
    }
</style>