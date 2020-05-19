<template>
  <div class="main">
    <div class="top">
      <span>您当前选择的类目：{{categoryDialog.list_text}}</span>
      <el-button  v-show="showTitle" type="primary" @click="showCategoryDialog" size="mini">选择类目</el-button>
    </div>


    <el-dialog
      title="选择类目"
      width="30%"
      :visible="categoryDialog.isVisable"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      >

      <el-form :model="categoryDialog.form" size="medium">
        <el-form-item label="选择类目：" >
          <el-cascader
            class="categoryDialog"
            ref="categoryList"
            v-model="categoryDialog.form.list"
            :options="bindCategoryList"
            placeholder="选择或搜索类目"
            filterable
            @change="categoryChange"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="getInitClick('hid')">取 消</el-button>
        <el-button type="primary" @click="getInitClick('sure')">确 定</el-button>
      </div>
    </el-dialog>

    <div class="left" v-show="showForm">
      <el-card class="left_base">
        <div slot="header" ref="go1-1">基本信息</div>
        <div>
          <el-form :model="form" label-position="right" label-width="140px" :rules="rules_base" ref="form_sublime">
            <el-form-item label="商品名称：" prop="title" ref="go1-1-1">
              <el-input
                        class="good_name"
                        v-model="form.title"
                        placeholder="最多输入60个汉字或字符"
                        maxlength=60
                        minlength=1
                        clearable></el-input>
              <span>{{form.title.length}}/60</span>
            </el-form-item>
            <el-form-item label="商品副标题：" ref="go1-1-2">
              <el-input class="good_name" v-model="form.sub_title" type="textarea" :rows="5" placeholder="广告卖点、广告语" maxlength=150></el-input>
              <span>{{form.sub_title.length}}/150</span>
            </el-form-item>



            <el-form-item label="店铺分类：" ref="go1-1-3">
              <span class="red_star">*</span>
              <el-cascader v-model="shop_category_id"
                :options="shop_list"
                placeholder="选择或搜索分类"
                filterable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="供应商名称：" prop="supplier_name" ref="go1-1-4" v-if="data.channel !== 'pet' && supply_chain_show && isEdit" >
              <el-input v-model="supplierselect.supplier_name" size="small" class="good_price" v-if="inplaytimeedit == false " :disabled="supplierselect.supplier_code == '' ? false :true"></el-input>
              <el-input v-model="supplierselect.supplier_name" size="small" class="good_price" v-else disabled></el-input>
              <el-button size="small" @click="changeSupplyDialogBtn('show')" :disabled="inplaytimeedit">选择供应商</el-button>
              <el-button size="small" @click="makeSureClearSupply" v-show="supplierselect.supplier_code != ''" :disabled="inplaytimeedit">清空</el-button>
            </el-form-item>

            <el-form-item label="供应商名称：" prop="supplier_name" ref="go1-1-4" v-if="data.channel !== 'pet' && supply_chain_show && isEdit== false " >
              <el-input v-model="form.supplier_name" size="small" class="good_price" minlength=1></el-input>
            </el-form-item>

            <el-form-item label="绑定供应链商品：" v-if="supplierselect.supplier_code != '' && is_multi_spec == false">
              <el-input v-model="sync_supply_sku_base[0].sku_code" size="small" class="good_price" disabled ></el-input>
              <span @click="skuBindShow('update')" class="blue-color" >修改</span>
              <span @click="clearBindSku" class="blue-color" v-show="sync_supply_sku_base[0].sku_code != ''" >清空</span>
              <el-checkbox v-model="sync_supply_sku_base[0].sync_stock" >是否同步库存</el-checkbox>
              <el-checkbox v-model="sync_supply_sku_base[0].sync_supply_price">是否同步供货价</el-checkbox>
              <el-checkbox v-model="sync_supply_sku_base[0].sync_push_order">是否推送订单</el-checkbox>
            </el-form-item>

            <el-form-item label="同步上下架状态：" v-if="supplierselect.supplier_code != ''">
              <el-select v-model="sync_supply_item">
                <el-option label="否" value='false' ></el-option>
                <el-option label="是" value='true' ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="商品类型：" ref="go1-1-5" prop="type">
              <el-select v-model="form.type" :disabled="inplaytimeedit">
                <el-option v-for="(option,key) in (item_type?item_type:data.item_type)"
                  :key="key"
                  :label="option"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="品牌:" ref="go1-1-6" prop="brand_id">
              <el-select v-model="form.brand_id" filterable :disabled="inplaytimeedit">
                <el-option v-for="option in brand_list"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="贸易类型：" prop="trade_type" ref="go1-1-7">
              <el-select v-model="form.trade_type" :disabled="inplaytimeedit">
                <el-option label="一般贸易" value="10"></el-option>
                <el-option label="海淘" value="20" v-if="data.channel !== 'pet'"></el-option>
                <el-option label="跨境保税" value="30"  v-if="data.channel !== 'pet'"></el-option>
                <el-option label="海外直邮" value="40" v-if="data.channel !== 'pet'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="form.trade_type!=10 && data.channel !== 'pet'" label="税率：" prop="tax_rule_id">
              <el-select v-model="form.tax_rule_id">
                <el-option
                  v-for="(option,key) in data.rate_ret"
                    :key="key"
                    :label="option.rate"
                    :value="option.id"></el-option>
              </el-select>
              <span>%</span>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card>
        <div slot="header" ref="go1-2">商品信息</div>
        <div>
          <el-form :model="form" label-position="right" label-width="140px" :rules="rules_base_test" ref="form_sublime_price">
            <el-form-item label="标准售价：" prop="sell_price">
              <el-input class="good_price" v-model="form.sell_price" :disabled="inplaytimeedit"></el-input>
            </el-form-item>
            <el-form-item label="企业专享价：" prop="business_sell_price" v-show="biz_show">
              <span class="red_star_specs">*</span>
              <el-input class="good_price" v-model="form.business_sell_price" maxlength="12"></el-input>
              <span>且购买商品</span>
              <el-input class="good_price" v-model="form.business_threshold"></el-input>
              <span>件以上享受优惠</span>
            </el-form-item>
            <el-form-item label="市场价：" prop="market_price">
              <el-input class="good_price" v-model="form.market_price"></el-input>
            </el-form-item>
            <el-form-item label="成本价：">
              <el-input class="good_price" v-model="form.cost_price"></el-input>
            </el-form-item>
            <el-form-item label="总库存：" prop="store_total" v-if="supplierselect.supplier_code != '' && is_multi_spec == false">
              <el-input class="good_price" v-model.number="form.store_total" v-if="inplaytimeeditspec" disabled></el-input>
              <el-input class="good_price" v-model.number="form.store_total" v-else :disabled="sync_supply_sku_base[0].sync_stock"></el-input>
            </el-form-item>

             <el-form-item label="总库存：" prop="store_total" v-else>
               <el-input class="good_price" v-model.number="form.store_total" v-if="inplaytimeeditspec" disabled></el-input>
              <el-input class="good_price" v-model.number="form.store_total" v-else></el-input>
            </el-form-item>

            <el-form-item label="商品货号：" prop="art_no">
              <el-input class="good_price" v-model="form.art_no" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="条形码：" prop="barcode">
              <el-input class="good_price" v-model="form.barcode" maxlength="100" ></el-input>
            </el-form-item>
            <el-form-item label="品牌国:">
              <el-select v-model="form.country_id" filterable placeholder="请选择">
                <el-option v-for="option in data.brand_country_list"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card v-show="data.nature_list && data.nature_list.length > 0">
        <div slot="header" ref="go1-3">自然属性</div>
        <div>
          <el-form :model="form" label-position="right" label-width="140px" class="natureForm">
            <el-form-item
              v-for="(item,key) in data.nature_list"
              v-model="nature_props[key].id"
              :label="item.name"
              :id="item.id"
              :key="key">
              <el-select v-model="nature_props[key].select" placeholder="请选择" filterable>
                <el-option
                  v-for="option in item.property_value"
                  :key="option.id"
                  :label="option.text"
                  :value="option.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card class="img_base">
        <div slot="header" ref="go1-4">
          商品主图
          <div class="header_info">图片大小不能超过3M，建议尺寸750*750，至少上传1张，最多上传10张</div>
        </div>
        <div>
          <el-form :model="form" label-position="right" label-width="90px" :rules="rules_base">
            <el-form-item label="第一张主图：" prop="upload_img" class="img_sepc">
              <div v-for="(item, index) in selectImgList" :key="index" class="img_edit" v-if="selectImgList.length > 0">
                <img :src="item.url + '_s.jpg'" alt="">
                <div class="img_delete">
                  <div class="right_img_delete" @click="deleteImg(index)">
                    <div class="el-icon-delete"></div>
                  </div>
                  <div class="right_img_move">
                    <div class="el-icon-arrow-left" @click="moveImg('left',index)"></div>
                    <div class="el-icon-arrow-right" @click="moveImg('right',index)"></div>
                  </div>
                </div>
              </div>
               <el-button @click="showImgSelect"><i class="el-icon-plus"></i></el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog
            class="imgSeclect"
            :visible="imgSeclect"
            :show-close="false">
            <imguse ref="refimguse" />

            <div slot="footer" class="footer">
              <el-button @click="hideImgSelect">取 消</el-button>
              <el-button type="primary" @click="sureImgSelect">确 定</el-button>
            </div>
          </el-dialog>

        <!-- 销售属性图片弹窗 -->
          <el-dialog
            class="sellImgSelect"
            :visible="sellImgSelect"
            :show-close="false">
            <sell-img-select ref="refimguse" />

            <div slot="footer" class="footer">
              <el-button @click="sellImgSelectBtn('hid')">取 消</el-button>
              <el-button type="primary" @click="sellImgSelectBtn('sure')">确 定</el-button>
            </div>
          </el-dialog>

          <el-dialog
            class="imgSeclect"
            :visible="imgEditSeclect"
            :show-close="false">
            <!-- <sell-img-select ref="refimguse" /> -->
            <imguse ref="refimguse" />

            <div slot="footer" class="footer">
              <el-button @click="imgEditSeclectBtn('hid')">取 消</el-button>
              <el-button type="primary" @click="imgEditSeclectBtn('true')">确 定</el-button>
            </div>
          </el-dialog>

      </el-card>


      <el-card v-show="sale_list.length > 0">
        <div slot="header" ref="go1-5" >销售属性</div>
        <div>
          <el-form :model="form" label-position="right" label-width="120px">
            <el-form-item
              v-for="(parent,key) in sale_list"
              :label="parent.name"
              :key="key"
              class="sale_base">

              <span v-for="(child , valindex) in parent.spec_value" @change="chooseList" :key="valindex">
                <input type="checkbox" v-model="child.selected" :disabled="inplaytimeedit" >
                <div :class="child.image != '' ? 'choose-img' : 'choose-imghid'">
                  <img :src="child.image + '_s.jpg'" alt="" v-if="child.image != ''">
                </div>
                <input type="text" v-model="child.text" class="sale_input" :disabled="inplaytimeedit">
              </span>

            </el-form-item>
          </el-form>
        </div>


        <div class="show_img_change" v-for="(item, indexs) in storeAerr" :key="indexs" v-if="item.child.length > 0">
          <div class="show_img_change_ul" v-show="item.child[0].image != undefined && item.child[0].image !=''">
              <div class="show_img_change_li_head">
              <div class="show_img_change_li_left">规格</div>
              <div class="show_img_change_li_right">规格图片</div>
            </div>
          </div>
          <div v-for="(child,childi) in item.child" :key="childi" class="show_img_change_ul" >
            <div  class="show_img_change_li" v-show="child.image" >
              <div class="show_img_change_li_left">
                <img :src="child.storeimg + '_s.jpg'" alt="" >
                <span>{{child.name}}</span>
              </div>

              <div class="show_img_change_li_right">
                  <img :src="child.image + '_s.jpg'" alt=""  @click="sellImgSelectBtn('show',indexs, childi , child)">
              </div>
            </div>
          </div>
        </div>

        <div class="goods_sku_mes" v-if="this.goodsInfo">
            <span class="goods_sku_title">
              <span class="star">*</span>
              标准价及库存：
            </span>
            <span class="goods_sku_world">1、多规格时，标准售价要介于SKU最低价和最高价之间；无多个规格时，即为真实售价。2、多规格时，库存为各SKU之和</span>
        </div>
        <div v-if="isEdit">
          <div class="goods-sku" v-if="this.goodsInfo">
              <div class="goods-sku-li">
                <div class="goods-sku-name">规格值</div>
                <div class="goods-sku-edit"></div>
              </div>
              <div class="goods-sku-li" v-for="(item,index) in goodsInfoList" :key="index">
                <div class="goods-sku-name">
                  <span v-for="(itemlist, itemindex) in item" :key="itemindex">{{itemlist.parent_text}}:{{itemlist.text}}</span>
                </div>
                <div class="goods-sku-edit">
                  <div class="goods-sku-edit-list">
                    <div><span>*</span>销售价(元)</div>
                    <div><span>*</span>市场价(元)</div>
                    <div>成本价(元)</div>
                    <div><span>*</span>库存(件)</div>
                    <div><span>*</span>条形码</div>
                    <div>绑定供应链sku</div>
                    <div>操作</div>
                  </div>
                  <div class="goods-sku-edit-list">
                    <el-input v-model="goodsInfoListEdit[index][0].sell_price" size="small" maxlength="10" :disabled="inplaytimeedit"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].market_price"  size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].cost_price" size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].store_total" size="small" maxlength="10" v-if="inplaytimeeditspec" disabled></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].store_total" size="small" maxlength="10" v-else :disabled="sync_supply_sku[index].sync_stock"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].barcode" size="small" maxlength="100"></el-input>
                    <div class="goods-sku-edit-skus" v-if="sync_supply_sku[index].canedit != true || supplierselect.supplier_code == ''">
                      <el-input v-model="sync_supply_sku[index].sku_code" size="small" disabled></el-input>
                      <button  disabled>绑定</button>
                      <button  disabled>清空</button>
                    </div>
                    <div class="goods-sku-edit-skus" v-else>
                      <el-input v-model="sync_supply_sku[index].sku_code" size="small" disabled></el-input>
                      <button @click="skuBindShow('show',index)" >绑定</button>
                      <button v-if="sync_supply_sku[index].sku_code == ''" disabled>清空</button>
                      <button @click="skuBindShow('clear',index)" v-else>清空</button>
                    </div>
                    <div class="goods-sku-edit-todo" v-if="sync_supply_sku[index].canedit != true || supplierselect.supplier_code == ''" >
                      <el-checkbox  v-model="sync_supply_sku[index].sync_stock" disabled>是否同步库存</el-checkbox>
                      <el-checkbox  v-model="sync_supply_sku[index].sync_supply_price" disabled>是否同步供货价</el-checkbox>
                      <el-checkbox  v-model="sync_supply_sku[index].sync_push_order" disabled>是否推送订单</el-checkbox>
                    </div>
                    <div class="goods-sku-edit-todo" v-else >
                      <el-checkbox v-model="sync_supply_sku[index].sync_stock" >是否同步库存</el-checkbox>
                      <el-checkbox v-model="sync_supply_sku[index].sync_supply_price">是否同步供货价</el-checkbox>
                      <el-checkbox v-model="sync_supply_sku[index].sync_push_order">是否推送订单</el-checkbox>
                    </div>
                  </div>
                  <div class="goods-sku-edit-list-biz" v-if="biz_show">
                    <span>企业专享价：</span>
                    <el-input class="good_price" v-model="goodsInfoListEdit[index][0].business[0].sell_price" maxlength="12" size="small"></el-input>
                    <span>且购买商品</span>
                    <el-input class="good_price" v-model="goodsInfoListEdit[index][0].business[0].threshold" size="small"></el-input>
                    <span>件以上享受优惠</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-else>
          <div class="goods-sku" v-if="this.goodsInfo">
              <div class="goods-sku-li">
                <div class="goods-sku-name">规格值</div>
                <div class="goods-sku-edit"></div>
              </div>
              <div class="goods-sku-li" v-for="(item,index) in goodsInfoList" :key="index">
                <div class="goods-sku-name">
                  <span v-for="(itemlist, itemindex) in item" :key="itemindex">{{itemlist.parent_text}}:{{itemlist.text}}</span>
                </div>
                <div class="goods-sku-edit">
                  <div class="goods-sku-edit-list">
                    <div><span>*</span>销售价(元)</div>
                    <div><span>*</span>市场价(元)</div>
                    <div>成本价(元)</div>
                    <div><span>*</span>库存(件)</div>
                    <div><span>*</span>条形码</div>
                  </div>
                  <div class="goods-sku-edit-list">
                    <el-input v-model="goodsInfoListEdit[index][0].sell_price" size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].market_price"  size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].cost_price" size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].store_total" size="small" maxlength="10"></el-input>
                    <el-input v-model="goodsInfoListEdit[index][0].barcode" size="small" maxlength="100"></el-input>
                  </div>
                  <div class="goods-sku-edit-list-biz" v-if="biz_show">
                      <span>企业专享价：</span>
                      <el-input class="good_price" v-model="goodsInfoListEdit[index][0].business[0].sell_price" maxlength="12" size="small"></el-input>
                      <span>且购买商品</span>
                      <el-input class="good_price" v-model="goodsInfoListEdit[index][0].business[0].threshold" size="small"></el-input>
                      <span>件以上享受优惠</span>
                  </div>
                </div>
              </div>
          </div>
        </div>


      </el-card>


      <el-card>
        <div slot="header" ref="go1-6">图文详情</div>
        <div class="edit_container">
          <el-form :model="form" label-position="right" label-width="120px">
            <el-form-item>
              <quill-editor v-model="form.pc_detail"
                          :content="pc_detail_content"
                          ref="myQuillEditor_pc"
                          :options="editorOption"
                          class="editer"
                          @change="onEditorChange($event)">
              </quill-editor>
            </el-form-item>
          </el-form>
          </div>
         <!-- <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="电脑端  wap端" name="pc">
              <div class="edit_container">
                <el-form :model="form" label-position="right" label-width="120px">
                  <el-form-item>
                    <quill-editor v-model="form.pc_detail"
                                :content="pc_detail_content"
                                ref="myQuillEditor_pc"
                                :options="editorOption"
                                class="editer"
                                @change="onEditorChange($event)">
                    </quill-editor>
                  </el-form-item>
                </el-form>
                </div>
          </el-tab-pane>
          <el-tab-pane label="wap端" name="wap">
            <div class="edit_container">
              <el-form :model="form" label-position="right" label-width="120px">
                <el-form-item>
                  <quill-editor v-model="form.wap_detail"
                              :content="wap_detail_content"
                              ref="myQuillEditor_wap"
                              :options="editorOption"
                              class="editer"
                              @change="onEditorChange($event)"
                              >
                  </quill-editor>
                </el-form-item>
              </el-form>
              </div>
          </el-tab-pane>
        </el-tabs> -->
      </el-card>

      <el-card>
        <div slot="header" ref="go1-7">包装及物流信息</div>
        <div>
          <el-form :model="form" label-position="right" label-width="120px" :rules="rules_base" ref="form_sublime_city">
            <el-form-item label="商品重量：" prop="weight">
              <el-input v-model="form.weight" class="good_weight"></el-input>
              <span>千克(kg)/件</span>
            </el-form-item>
            <el-form-item label="运费模板：">
              <span class="red_star">*</span>
              <el-select v-model="logistics_template_id">
                <el-option v-for="option in data.freight_template_list"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货仓库：" prop="warehouse_id">
              <el-select v-model="form.warehouse_id">
                <el-option v-for="option in data.warehouse_ret"
                  :key="option.id"
                  :label="option.name"
                  :value="option.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可配送区域：">
                <!-- <el-button @click="showAresDialog">+添加区域</el-button> -->
                <el-button @click="addPeovinceCity('show')">+添加区域</el-button>

              <div class="show_area_text" v-if="area_text.length > 0">
                <div class="show_area_li" v-for="(im, ix) in area_text" :key="ix">
                  <span class="show_area_province" v-if="im.isShow == 'false'">{{im.label}}</span>
                  <span  v-else>
                  <span class="show_area_province">{{im.label + '  :  '}}</span>
                  <span class="show_area_city">(</span>
                  <span class="show_area_city" v-for="(child,index) in im.children" :key="index">
                    <span v-if="child.isShow == 'true'">{{child.label + ','}}</span>
                  </span>
                  <span class="show_area_city">)</span>
                </span>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="下单数量要求：" v-if="data.channel == 'trmall' && data.model == 1  && data.biz_model == 1">
              <el-row>
                <el-col :span="4">
                  <el-select v-model="form.MOQ_type" :disabled="inplaytimeedit" @change="changeMoqType" style="display: inline-block">
                  <el-option v-for="option in MOQ_type_option"
                             :key="option.value"
                             :label="option.label"
                             :value="option.value">
                  </el-option>
                </el-select>
                </el-col>
                <el-col :span="8" v-if="MOQ_amount_display"><el-input v-model="form.MOQ_amount" type="number" :disabled="inplaytimeedit" placeholder="请输入数量"></el-input></el-col>
                <el-col :span="12"></el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>

        <el-dialog title="选择供应商" :visible.sync="changeSupplyDialog" width="30%" class="change-supply-dialog" :show-close="false">
          <el-input placeholder="请输入内容" v-model="searchsupplier">
            <el-button slot="append" icon="el-icon-search" @click="searchSupplier"></el-button>
          </el-input>
          <el-radio-group v-model="supplierselect">
            <el-radio :label="item" v-for="(item,index) in restaurants" :key="index">{{item.supplier_name}}</el-radio>
          </el-radio-group>
          <div slot="footer" class="dialog-footer">
            <el-button @click="changeSupplyDialogBtn('hid')" size="small">取 消</el-button>
            <el-button type="primary" @click="changeSupplyDialogBtn('sure')" size="small" :disabled="supplierselect.supplier_code == ''">确 定</el-button>
          </div>
        </el-dialog>

          <el-dialog
            class="dialog-arealist"
            title="选择地区"
            :visible="areaListDialog"
            :show-close="false">
            <el-tree
              ref="areaListTree"
              :data="areaList"
              node-key="id"
              :default-checked-keys="province_codes_city"
              show-checkbox
              @check="setSelectProvince"
              >
            </el-tree>
            <div slot="footer" class="footer">
              <el-button @click="addPeovinceCity('hide')">取 消</el-button>
              <el-button type="primary" @click="addPeovinceCity('sure')">确 定</el-button>
            </div>
          </el-dialog>

          <el-dialog
            title="绑定供应链商品"
            :visible.sync="centerDialogVisible"
            width="80%"
            center
            :show-close="false">
            <div class="goods-skulist-search">
              <div class="search-content">
                <el-form  :model="formsku" class="demo-form-inline" ref="goodsskulist" :inline="true">
                  <el-form-item>
                    供应商名称：{{supplierselect.supplier_name}}
                  </el-form-item>
                  <el-form-item label="商品名称：">
                    <el-input v-model="formsku.item_name" placeholder="商品名称：" size="small"></el-input>
                  </el-form-item>
                  <el-form-item label="是否已映射">
                    <el-select v-model="formsku.is_mapped" placeholder="是否已映射：" size="small">
                      <el-option label="是" value="1"></el-option>
                      <el-option label="否" value="0"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="贸易类型：">
                    <span>{{formsku_type}}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitFormSku" size="small">查询</el-button>
                    <el-button @click="resetFormSku" size="small">重置</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="search-result">
                  <table-view
                      :loading="loading"
                      :columns="columns"
                      :pageList="columnslist"
                      :bindmodel='bindmodel'
                      @radioBackRowData="radioBackRowData"
                      ></table-view>
                  <pagination-view :currentPage="formsku.page" :total="total" @size-change="sizeChange" @current-change="pageChange"></pagination-view>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="skuBindShow('hid')">取 消</el-button>
              <el-button type="primary" @click="skuBindShow('sure')">确 定</el-button>
            </span>
          </el-dialog>

      </el-card>

      <el-card>
        <div slot="header" ref="go1-8">其他信息</div>
        <div>
          <el-form :model="form" label-position="right" label-width="140px">
            <el-form-item label="售后保障：">
              <el-checkbox v-model="free_refund">服务承诺：“七天无理由退换货”。勾选则表示支持，未勾选则表示不支持</el-checkbox>
            </el-form-item>
            <el-form-item label="库存计数：">
              <el-radio-group v-model="form.deduct_store_type">
                <el-radio :label="10">下单减库存</el-radio>
                <el-radio :label="20">付款减库存</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否开启自动下架：">
              <el-select v-model="off_shelves_auto">
                <el-option label="否" :value="0"></el-option>
                <el-option label="是" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库存阈值" v-if="off_shelves_auto == 1">
              <span class="red_star_spec">*</span>
              <el-input v-model="off_shelves_threshold" class="good_threshold"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-button @click="createGood"  size="medium" :disabled="creatGoodBtnClick">保存</el-button>
    </div>

  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

import { mapActions, mapGetters } from 'vuex'
import goods from '@/api/goods'
import { interSection } from '@/utils/array/index'
import delivery from '@/api/delivery'
import axios from '@/api/interception'
import Imguse from '../imgspace/imguse'
import SellImgSelect from '../imgspace/sellimgselect'
import TableView from '@/components/TableView'
import PaginationView from '@/components/PaginationView'
import shops from "@/api/shops"

const Font = Quill.import('formats/font');
// We do not add Aref Ruqaa since it is the default
Font.whitelist =['Arial', 'serif',  '宋体', 'monospace', 'cursive'];
Quill.register(Font, true);
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  // [{'header': 1}, {'header': 2}],               // custom button values
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
  [{'align': []}],
  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  // [{'direction': 'rtl'}],                         // text direction
  [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  [{'font': ['Arial', 'serif',  '宋体',  'monospace', 'cursive']}],
  ['link', 'image'],
  ['code-block']
]

export default {
  data () {
    var checknum = (rule, value, callback) => {
      debugger
      if (!value) {
        return callback(new Error(rule.msg));
      }
      if (!Number(value)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value < 0) {
          callback(new Error('价格不能为负值'));
        }else{
          callback();
        }

      }
    };
    var _this = this;
    return {
      new_wap_detail_content:"",
      wap_detail_content:'',

      new_pc_detail_content:"",
      pc_detail_content:'',
      editorOption: {
          placeholder: '',
          theme: 'snow',  // or 'bubble'
          modules: {
            toolbar: {
              container: toolbarOptions,  // 工具栏
              handlers: {
                'image': function (value) {
                  let that = this
                  if (value) {
                    _this.imgEditSeclect = true
                    _this.storeselectImgList = JSON.parse(JSON.stringify(_this.selectImgList))
                    _this.setImgSelect([])
                  }
                },
                'code-block' : function (params) {
                  if (params) {
                    _this.codeBlock()
                  }
                }
              }
            }
          }
        },
      imgEditSeclect : false,
      creatGoodBtnClick: false, //提交按钮 延时处理
      storeskulistdata: [],     //sku 数据记忆
      storeskulist: [],         //sku 列表记忆数据
      storesku:[],              //sku 编辑记忆数据
      bindmodel:'',                 //列表单选选中
      inplaytimeedit: false,        //编辑商品时候 部分不可编辑
      inplaytimeeditspec: false,    //编辑商品时候 库存不可编辑
      storesupplierselect : null,   //保存供应商选择
      is_multi_spec : false,        //单规格false 多规格true
      biz_show:false,                //企业购
      storeselectImgList : [],       //修复取消时候选中图片问题
      sellimglist:[],                 // 销售属性图片处理
      // 编辑供应链数据
      total : 0,                      //总条数
      formsku_type : null ,           //弹框 贸易类型显示问题
      formsku:{
        trade_type : '',              //新加贸易类型
        is_mapped:'',
        page : 1 ,
        page_size : 20,
        item_name: '',
        supplier_type : 'self',
        supplier_code : '',
      },                 //sku商品列表查询 goodsname:商品名称 map 是否映射
      sync_supply_sku_base : [{
        sku_id : '',
        sku_code : '',
        sync_stock : false,
        sync_supply_price : false,
        sync_push_order : false
      }],    //没有绑定供应链商品时候的基础绑定
      sync_supply_sku_li : [],      //供应链数据处理优化
      sync_supply_item : 'false',        //自动下架 true false
      sync_supply_sku : [] ,        //新加供应链数据
      changeSupplyDialog : false,   //供应商选择弹框
      centerDialogVisible : false,  //居中内容弹框
      searchsupplier : '',          //搜索供应商名称
      supplierselect:{
        supplier_code:"",
        supplier_id:-1,
        supplier_kind_code:"",
        supplier_name:"",
        supplier_type_code:""
      },          //供应商信息
      goodsInfoListEditSelectIndex:-1,  //选中index
      goodsInfoListEditSelect: null, //选中的商品信息
      isEdit : false,           // 是新增还是 编辑 false true
      supply_chain_show : false,    //是否有供应商选择 对一个供应链 false 无 true 有

      // 地区选择处理
      province_codes_city : [], //默认地区显示选中 province 和 city
      imgSeclect : false,       //图片选择

      sellImgSelect : false,    //销售图片选择
      sellimgffindex : null,    //当前选中的图片最外层 index
      sellimgfindex : null ,    //当前选中的图片外层 index
      sellimgitem : null,       //当前选中的图片 item

      activeName: 'pc',         //电脑端 wap 端选择
      // restaurants: [{ "value": "泰然城"},{ "value": "京东慧采"},{ "value": "粮油"},{ "value": "粮油1"},{ "value": "泰然城城"}],
      restaurants : [],         //供应商列表
      free_refund: false,       //监听选择
      off_shelves_threshold: '', //还是监听问题
      off_shelves_auto : 0 ,    //多层监听问题
      logistics_template_id : '',//多层监听问题处理
      fileImage : [],           //图片列表
      showTitle : false,         //是否显示 选择类目按钮
      showForm : false,         //确定或者编辑 才显示列表数据
      storeAerr:[],             //spec_props 数据处理
      storeImage:[],            //记录图片列表 用于操作
      store_area_text : [],     //存储地区选择
      area_text:[],             //地区显示
      areaList: [],             //地区选择
      areaListDialog : false,     //判断是否显示地区选择
      goodsInfoListEdit:null,   //销售属性叠加字段处理
      goodsInfoList : null,     //销售属性组合排列数据
      goodsInfo:false,
      goodsListData : [],      //销售属性数据处理优化
      goodsListLi : [],        //销售属性比对数据
      brand_list: [],           //品牌列表
      storecategoryDialogform:[], //存储类目选择列表
      storecategoryDialogFormId:'', //存储类目选择id
      categoryDialog: {
        isVisable: false,
        form: {
          list: [],
          item: '',
        },
        list_text: ''
      },
      nature_props : [],         //自然属性
      shop_list: [],
      shop_category_id: [],
      sale_list: [],
      post_list:[],
      data: {},
      MOQ_type_option:[{
        label:"无",
        value:""
      },{
        label:"最小起订量",
        value:"10"
      },{
          label:"最小包装数量",
          value:"20"
        }],
      form: {
        MOQ_type:"",
        MOQ_amount:"",
        business_sell_price : '',           //起批价格
        business_threshold : '' ,             //起批数量
        title: '',
        sub_title: '',
        art_no: '',
        barcode: '',
        type: '',
        trade_type: '',
        deduct_store_type: 10,
        cost_price: '',
        sell_price: '',
        market_price: '',
        supplier_name : '',
        store_total: '',
        pc_detail: '',
        wap_detail: '',
        primary_image : '',
        // primary_image: 'https://t12.baidu.com/it/u=256410731,3452185199&fm=173&s=64449B4747FA8DD04CD834A10300E091&w=550&h=366&img.JPEG',
        images: [
          // 'https://t12.baidu.com/it/u=256410731,3452185199&fm=173&s=64449B4747FA8DD04CD834A10300E091&w=550&h=366&img.JPEG',
        ],
        weight: '',
        logistics_template: {id:''},
        brand_id: '',
        country_id: '',
        warehouse_id: '',
        tax_rule_id: '',
        category_id: '',
        shop_category:[{
          category_id: ''
        }],
        is_all_areas: '',
        province_codes: [], //后台需要传入省份
        city_codes:[],      //后台需要处理 城市选择
        free_fund: 0,
        off_shelves: {
          auto: '',
          threshold: ''
        },
        nature_props: [],
        spec_props: {},
        sku_list: [
          {
            sell_price: '',
            market_price: '',
            cost_price: '',
            barcode: '',
            // store_freeze: '',
            store_total: '',
            spec_desc: [
              {
                prop_id:'',
                prop_value_id: '',
                prop_value_name: ''
              }
            ]
          }
        ],
      },
      loading: false,
      columnslist : [],
      columns: [{
            label: '选中',
            isradio: true,
            align: 'center'
          },{
              label: '是否已映射',
              field: 'is_mapped',
              align: 'center',
              tags: [
              {
                index: 1,
                name: "是",
                type: "success"
              },
              {
                index: 0,
                name: "否",
                type: "danger"
              }
            ]
          },{
              label: '供应商名称',
              field: 'supplier_name',
              align: 'center'
          },{
              label: '商品标题',
              field: 'item_name',
              align: 'center'
          },{
              label: 'skuid',
              field: 'sku_code',
              align: 'center'
          },{
              label: '状态',
              field: 'status',
              align: 'center',
              tags: [
              {
                index: 'shelved',
                name: "上架",
                type: "success"
              },
              {
                index: 'stock',
                name: "下架",
                type: "danger"
              }
            ]
          },{
              label: 'sku属性',
              field: 'properties',
              align: 'center'
          },{
              label: '商品类型',
              field: 'name',
              align: 'center'
          },{
              label: '贸易类型',
              field: 'trade_type',
              align: 'center'
          },{
              label: '商品分类',
              field: 'category',
              align: 'center'
          },{
              label: '品牌名称',
              field: 'brand',
              align: 'center'
          },{
              label: '品牌国',
              field: 'itemCount',
              align: 'center'
          },{
              label: '仓库名称',
              field: 'warehouse',
              align: 'center'
          },{
              label: '供货价',
              field: 'cost_price',
              align: 'center'
          },{
              label: '库存',
              field: 'stock',
              align: 'center'
          }],

      rules_base: {
        supplier_name :[{ required: false, min: 1, max: 20, message: '请输入供应商名字', trigger: 'blur' }],
        title: [{ required: true, min: 1, max: 60, message: '最多输入60个汉字或字符', trigger: 'blur' }],
        tax_rule_id : [{required:false , message:"请选择税率"}],
        type : [{required:true, message:"请选择商品类型"}],
        brand_id : [{required:true, message:"请选择品牌"}],
        trade_type : [{required:true, message:"请选择贸易类型"}],
        upload_img : [{ required: true,  trigger: 'change' }],
        weight : [{ required:true, message:"请输入商品重量"}],
        warehouse_id : [{required:true , message:"请选择发货仓库"}]
      },
      rules_base_test : {
        store_total : [{required:true,message:"请输入库存"},{ type: 'number', message: '必须为数字值'}],
        art_no : [{required:true, min:1 , message:"请输入商品货号" }],
        sell_price : [{required:true, min:1 , message:"请输入标准售价" }],
        business_sell_price : [{validator: checknum, msg:"请输入企业专享价" ,trigger: 'blur'}],
        market_price : [{required:true, min:1 , message:"请输入市场价"}],
        barcode : [{required:true, min:1 , message:"请输入条形码"}],
      }
    }
  },
  components: {
    Imguse,
    SellImgSelect,
    quillEditor,
    TableView,
    PaginationView
  },
  methods: {
    ...mapActions([
      'getBindCategoryList' , 'getGoodsInfoList' , 'setImgSelect' , 'setSkuSelect','getShopInfo'
    ]),
    changeMoqType(){
      this.form.MOQ_amount = "";
    },
    onEditorChange({ editor, html, text }) {
      let _isPc = this.activeName == 'pc' ? true : false
      if (_isPc) {
        this.new_pc_detail_content = text
      }else{
        this.new_wap_detail_content = text
      }

    },
    codeBlock(){
      let that = this
      let _isPc = that.activeName == 'pc' ? true : false
      if (_isPc) {
        if (that.pc_detail_content.indexOf("<xmp>") != -1) {
          that.pc_detail_content = that.new_pc_detail_content
          that.form.pc_detail = that.pc_detail_content
        }else{
          let _newpcall =  '<xmp>' + that.form.pc_detail + "</xmp>"
          that.pc_detail_content = _newpcall
          that.form.pc_detail = that.pc_detail_content
        }
      }else{
         if (that.wap_detail_content.indexOf("<xmp>") != -1) {
          that.wap_detail_content = that.new_wap_detail_content
          that.form.wap_detail = that.wap_detail_content
        }else{
          let _newpcall =  '<xmp>' + that.form.wap_detail + "</xmp>"
          that.wap_detail_content = _newpcall
          that.form.wap_detail = that.wap_detail_content
        }
      }
    },
    imgEditSeclectBtn(type){
      let vm = this
      switch (type) {
        case 'true':
          vm.imgEditSeclect = false
          let _selectImgListReserve = JSON.parse(JSON.stringify(vm.selectImgList.reverse()))
          // let _selectImgListReserve = vm.selectImgList
          _selectImgListReserve.map((item,index)=>{
            let value = item.url
            // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
            if (vm.activeName == 'pc') {
              vm.addRange = vm.$refs.myQuillEditor_pc.quill.getSelection()
              vm.$refs.myQuillEditor_pc.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, 'image', value, Quill.sources.USER)
            }else{
              vm.addRange = vm.$refs.myQuillEditor_wap.quill.getSelection()
              vm.$refs.myQuillEditor_wap.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, 'image', value, Quill.sources.USER)
            }
          })
          if (vm.activeName == 'pc') {
            let _alllength = 0
              vm.$refs.myQuillEditor_pc.quill.editor.delta.ops.map((items, indexs)=>{
                if (typeof(items.insert) == 'string') {
                  _alllength += items.insert.length
                }else{
                  _alllength += 1
                }
              })
              vm.$refs.myQuillEditor_pc.quill.setSelection(_alllength)
          }else{
            let _alllengths = 0
              vm.$refs.myQuillEditor_wap.quill.editor.delta.ops.map((items, indexs)=>{
                if (typeof(items.insert) == 'string') {
                  _alllengths += items.insert.length
                }else{
                  _alllengths += 1
                }
              })
              vm.$refs.myQuillEditor_wap.quill.setSelection(_alllengths)
          }
          vm.setImgSelect(this.storeselectImgList)
          break;
        case 'hid':
          vm.imgEditSeclect = false
          vm.setImgSelect(this.storeselectImgList)
          break;

        default:
          break;
      }
    },
    showCategoryDialog(){
      this.categoryDialog.isVisable = true
    },
    categoryChange(value){
      this.categoryDialog.form.item = value[value.length-1]
    },
    hideImgSelect(){
      this.setImgSelect(this.storeselectImgList)
      this.imgSeclect = false
    },
    deleteImg(index){
      this.selectImgList.splice(index,1)
      this.setImgSelect(this.selectImgList)
    },
    moveImg(type,index){
      let _selectImgListData = JSON.parse(JSON.stringify(this.selectImgList))
      let _indexData = JSON.parse(JSON.stringify(_selectImgListData[index]))
      switch (type) {
        case 'left':
          if (index != 0) {
            let _indexDataLeft =  JSON.parse(JSON.stringify(_selectImgListData[index - 1]))
            _selectImgListData[index] = _indexDataLeft
            _selectImgListData[index - 1] = _indexData
            this.setImgSelect(_selectImgListData)
          }
          break;
        case 'right':
          if (index + 1 != _selectImgListData.length) {
            let _indexDataRight = JSON.parse(JSON.stringify(_selectImgListData[index + 1]))
            _selectImgListData[index] = _indexDataRight
            _selectImgListData[index + 1] = _indexData
            this.setImgSelect(_selectImgListData)
          }
          break;

        default:
          break;
      }
    },
    showImgSelect(){
      this.storeselectImgList = JSON.parse(JSON.stringify(this.selectImgList))
      this.imgSeclect = true
    },
    sureImgSelect(){
      this.imgSeclect = false
    },
    sellImgSelectBtn(type , ffindex, findex, item){
      let self = this
      switch (type) {
        case 'show':
        if (self.inplaytimeedit) {
          return
        }
        self.sellimgffindex = ffindex
        self.sellimgfindex = findex
        self.sellimgitem = item

        self.sellImgSelect = true
          break;
        case 'hid':
        self.sellImgSelect = false
          break;
        case 'sure':
        let _child = self.storeAerr[self.sellimgffindex].child
        let _item =_child[self.sellimgfindex]
        self.storeAerr[self.sellimgffindex].child[self.sellimgfindex].images = self.sellImgSrc
        self.$set(_item,'image',self.sellImgSrc)
        self.sellImgSelect = false
          break;

        default:
        self.sellImgSelect = false
          break;
      }
    },
    createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.supplier_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
    },
    changeSupplyDialogBtn(type){
      switch (type) {
        case 'hid':
          if (this.storesupplierselect) {
            this.supplierselect = this.storesupplierselect
          }
          this.changeSupplyDialog = false
          break;
        case 'show':
          this.storesupplierselect = JSON.parse(JSON.stringify(this.supplierselect))
          this.changeSupplyDialog = true
          break;
        case 'sure':
          if (this.isEdit) {
            this.$confirm('供应商绑定已修改，这会清空供应链sku绑定，确定要修改？', '操作提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                if (this.supplierselect.supplier_code == '') {
                  this.$message({
                    type: 'warning',
                    message: '请先选择供应商！'
                  });
                }else{
                    this.form.supplier_name = this.supplierselect.supplier_name
                    let _data = {
                      item_id : this.$route.params.id.trim(),
                      supplier_code : this.supplierselect.supplier_code
                    }
                    // 发送商品到供应商
                    delivery.setItemToSupplier(_data).then((res) => {
                      if (res.code === 0) {
                        this.changeSupplyDialog = false
                        this.clearSpuOrSkuBind()
                      }
                    })
                }
            }).catch(() => {

            });
          }else{
            this.form.supplier_name = this.supplierselect.supplier_name
            this.changeSupplyDialog = false
          }
          break;

        default:
          break;
      }
    },
    clearSpuOrSkuBind(){
      let that = this
      if (this.goodsInfo) {
        that.sync_supply_sku.map((_keyword, index)=>{
          that.$set(_keyword,'sku_code','')
          that.$set(_keyword,'sync_stock',false)
          that.$set(_keyword,'sync_supply_price',false)
          that.$set(_keyword,'sync_push_order',false)
        })
      }else{
        that.clearSyncSupplySkuBase()
      }
    },
    clearSyncSupplySkuBase(){
      let that = this
      that.sync_supply_sku_base[0].sku_code = ''
      that.sync_supply_sku_base[0].sync_stock = false
      that.sync_supply_sku_base[0].sync_supply_price = false
      that.sync_supply_sku_base[0].sync_push_order = false
    },
    makeSureClearSupply(){
      if (this.isEdit) {
        this.$confirm('清空供应商会同时清空供应链绑定，确定要清空吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 解绑供应商 及所有绑定关系 及 清洗数据
            delivery.unBindSupplier({item_id : this.$route.params.id.trim()})
            let _data = []
            this.sync_supply_sku.map((item, index)=>{
              item.sku_code = ''
              _data.push(item)
            })
            this.sync_supply_sku = _data
            this.clearSupplierSelect()
            this.clearSyncSupplySkuBase()
          }).catch(() => {

          });
      }else{
        this.clearSupplierSelect()
      }

    },
    searchSupplier(){
      let _data = {
        supplier:this.searchsupplier, //输入搜索内容
        page:1,
        page_size : 20
      }
      this.supplierselect = {
        supplier_code:"",
        supplier_id:-1,
        supplier_kind_code:"",
        supplier_name:"",
        supplier_type_code:""
      }
      this.initSupplyer(_data)
    },
    submitFormSku() {
      this.formsku.supplier_code = this.supplierselect.supplier_code
      this.formsku.supplier_type = this.supplierselect.supplier_code == 'QD001' ? 'self' : 'external'
      delivery.supplySkuList(this.formsku).then((res) => {
        if (res.code === 0) {
          let _data = []
          if (res.data.skus.length > 0) {
            res.data.skus.map((item, index)=>{
              item.radioLable = item.sku_code
              item.showradiovalue = null
              _data.push(item)
            })
          }
          this.bindmodel = ''
          this.columnslist = _data
          this.total = res.data.total
        }
      })
    },
    sizeChange(val){
      this.formsku.page_size = val;
      this.submitFormSku(this.formsku);
    },
    // page变化函数
    pageChange(val){
      this.formsku.page = val;
      this.submitFormSku(this.formsku);
    },
    radioBackRowData(val){
      this.bindmodel = val
    },
    resetFormSku() {
      this.formsku.item_name = ''
      this.formsku.is_mapped = ''
    },
    skuBindShow(type,index=-1){
      let that = this
      // 贸易类型处理
      if (that.form.trade_type == 10) {
          that.formsku_type = '一般贸易'
          that.formsku.trade_type = 'Domestic'
        } else if (that.form.trade_type == 20) {
          that.formsku_type = '海淘'
          that.formsku.trade_type = 'Overseas'
        }else if (that.form.trade_type == 30) {
          that.formsku_type = '跨境保税'
          that.formsku.trade_type = 'Bonded'
        }else if(that.form.trade_type == 40){
          that.formsku_type = '跨境直邮'
          that.formsku.trade_type = 'Direct'
        }else{
          that.formsku_type = ''
          that.formsku.trade_type = ''
        }
      switch (type) {
        case 'sure':
          if (that.skuitem.sku_code) {
            let _supplier_type = this.supplierselect.supplier_code == 'QD001' ? 'self' : 'external' //供应商类型 QD001泰然城对应code 不用名字判断 self external
            let _data = {
              sku_id : that.goodsInfoListEditSelect.sku_id,
              supply_sku_code : that.skuitem.sku_code, //sku_code
              supplier_type : _supplier_type
            }

            delivery.bindSkuToSku(_data).then((res) => {
              if (res.code === 0) {
                if (that.goodsInfo) {
                  let _keyword = that.sync_supply_sku[that.goodsInfoListEditSelectIndex]
                  that.$set(_keyword,'sku_code',that.skuitem.sku_code)
                }else{
                  that.$set(that.sync_supply_sku_base[0],'sku_code',that.skuitem.sku_code)
                }
              }
            })
          }

          that.centerDialogVisible = false
          that.columnslist = []
          break;
        case 'show':
          that.goodsInfoListEditSelectIndex = index
          that.goodsInfoListEditSelect = that.sync_supply_sku[index]
          that.centerDialogVisible = true
          break;

        case 'update':
          that.goodsInfoListEditSelect = that.sync_supply_sku_base[0]
          that.centerDialogVisible = true
          break

        case 'clear' :
          that.$confirm('确定要清空供应链 sku 绑定吗？', '操作提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let _keyword = that.sync_supply_sku[index]
            let _data = {
              sku_id : _keyword.sku_id,
              sku_code : _keyword.sku_code
            }
            delivery.unBindSku(_data).then((res) => {
              if (res.code === 0) {
                // that.$set(_keyword,'canedit',false)
              }
            })
            that.$set(_keyword,'sku_code','')
            that.$set(_keyword,'sync_stock',false)
            that.$set(_keyword,'sync_supply_price',false)
            that.$set(_keyword,'sync_push_order',false)
          }).catch(() => {
            that.$message({
              type: 'info',
              message: '已取消'
            })
          });
          // sync_stock sync_supply_price sync_push_order
          break
        case 'hid':
          that.centerDialogVisible = false
          that.columnslist = []
          break;

        default:
          break;
      }
    },
    clearBindSku(){
      this.$confirm('确定要清空供应链 sku 绑定吗？', '操作提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        let _keyword = this.sync_supply_sku_base[0]
        let _data = {
          sku_id : _keyword.sku_id,
          sku_code : _keyword.sku_code
        }
        delivery.unBindSku(_data).then((res) => {
          if (res.code === 0) {
            // that.$set(_keyword,'canedit',false)
            this.clearSyncSupplySkuBase()
          }
        })
        this.$set(_keyword,'sku_code','')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
    getInitClick(type){
      let that = this
      if (type === 'hid') {
        that.categoryDialog.form.list = that.storecategoryDialogform
        that.categoryDialog.form.item = that.storecategoryDialogFormId
        that.categoryDialog.isVisable = false
        return
      }

      that.initData() //初始一下数据
      let category_id = that.categoryDialog.form.item
      if (category_id == "" || that.categoryDialog.form.list.length < 3) {
        return
      }
      that.storecategoryDialogform = JSON.parse(JSON.stringify(that.categoryDialog.form.list))
      that.storecategoryDialogFormId = JSON.parse(JSON.stringify(that.categoryDialog.form.item))
      that.form.category_id = category_id
      let _data = {
        no_limit:1,
        category_id: category_id,
        level : that.categoryDialog.form.list.length
      }
      that.areaListData() //地区选择数据
      goods.getInit(_data).then((res)=>{
        if(res.code === 0 ){
          that.setImgSelect([])
          that.showForm = true
          that.data = Object.assign(res.data,that.data);

          that.sale_list = res.data.sale_list
          that.biz_show = res.data.biz_show || false
          // 判断是否显示供应商选择 res.data.supply_chain_show 发布初始化这个字段删除
          that.supply_chain_show = res.data.supplier_show || false
          //插入自然属性字段
          for(let i=0;i<that.data.nature_list.length;i++){
            that.nature_props.push(
              {
                id: that.data.nature_list[i].id,
                select: ''
              }
            )
          }
          // 税率数据修改
          that.data.rate_ret.map((ret,retindex)=>{
            ret.rate = ret.rate == 0 ? '0' : Number(ret.rate) * 100
          })

          //修改店铺分类数据格式
          for(let parent in that.data.shop_category_tree){
            let item = that.data.shop_category_tree[parent]
            that.shop_list.push({
              value: item.id,
              label: item.name
            })

            if(item.children){
              let length = that.shop_list.length
              that.shop_list[length-1].children = []
              for(let i=0;i<item.children.length;i++){
                that.shop_list[length-1].children.push({
                  value: item.children[i].id,
                  label: item.children[i].name
                })
              }
            }

          }
          //页面展示分类数据
          that.categoryDialog.list_text = that.$refs.categoryList.$el.innerText
          that.categoryDialog.isVisable = false
        }
      })
      goods.setBrandList(_data).then((res)=>{
          if (res.code === 0) {
            that.brand_list = res.data
          }
      })

    },
    chooseList: function () {
      let arr = []
      let allList = []
      this.sale_list.map((parent) => {
        arr.push({
          id: parent.id,
          name: parent.name,
          child: []
        })
        parent.spec_value.map((children)=>{
          if(children.selected){
            arr[arr.length-1].child.push({
              id: children.id,
              parent_text : parent.name,
              image : children.image||'',
              storeimg : children.image||'',
              baseimg : '',
              text : children.text,

              name : children.text,
              prop_id : parent.id,
              prop_value_id : children.id,
            })
          }
        })
      })

      function getProducts(specs) {
          if (!specs || specs.length == 0) {
              return [];
          } else {
              return joinSpec([[]], specs, 0, specs.length-1);
          }
          function joinSpec(prevProducts, specs, i, max) {
              var currentProducts = [], currentProduct, currentSpecs = specs[i];
              if ( i > max ) {
                  return prevProducts;
              }
              prevProducts.forEach(function(prevProduct) {
                  currentSpecs.forEach(function(spec) {
                      currentProduct = prevProduct.slice(0);
                      currentProduct.push(spec);
                      currentProducts.push(currentProduct);
                  });
              });
              return joinSpec(currentProducts, specs, ++i, max);
          }
      }


      if (arr === [] || arr.length < 1) {
        return
      }else{
        this.storeAerr = arr
        let arrChildList = []
        for (let index = 0; index < arr.length; index++) {
          if (arr[index].child === [] || arr[index].child.length < 1) {
            this.$message({
              message: '每个规格项至少选中一项，才能组合成完整的货品信息。',
              type: 'warning'
            });
          }else{
            arrChildList.push(arr[index].child)
          }
        }
        if (arrChildList.length == arr.length) {
          this.goodsInfo = true
          let arrayList = getProducts(arrChildList) //排列后数组格式
          this.goodsInfoList = JSON.parse(JSON.stringify(arrayList))
          let _storearrayList = []
          let _sync_supply_sku = []
          for (let ii = 0; ii < arrayList.length; ii++) {
             //数组第一位置为需要表格数据
              let _oldarray = arrayList[ii];
              // 企业购 显示内容
              let _addField = this.biz_show ? {
                id : null,
                sell_price: '',
                market_price : '',
                cost_price : '',
                barcode : '',
                store_total : '',
                business : [
                  {
                    threshold : '',
                    sell_price : ''
                  }
                ]
              } : {
                id : null,
                sell_price: '',
                market_price : '',
                cost_price : '',
                barcode : '',
                store_total : ''
              }
              let _skudata = {
                  canedit : false,
                  sku_id :  '',
                  sku_code : '',
                  sync_stock :  false,
                  sync_supply_price :  false,
                  sync_push_order :  false
                }

            _oldarray.unshift(_addField)
            _storearrayList.push(_oldarray)
            _sync_supply_sku.push(_skudata)
          }
          this.goodsInfoListEdit = _storearrayList
          this.sync_supply_sku = _sync_supply_sku

          this.goodsListData.push(this.goodsInfoListEdit)
          this.goodsListLi.push(this.goodsInfoList)
          this.sync_supply_sku_li.push(this.sync_supply_sku)

          // 优化用户输入情况
          if (this.goodsListLi.length > 2) {
            this.goodsListLi.shift()
            this.goodsListData.shift()
            this.sync_supply_sku_li.shift()
          }
          // 多层遍历处理数据情况
          if (this.goodsListLi.length == 2) {
            for (let new_i = 0; new_i < this.goodsListLi[1].length; new_i++) {
                let new_i_item = this.goodsListLi[1][new_i]
                for (let old_i = 0; old_i < this.goodsListLi[0].length; old_i++) {
                  let old_i_item = this.goodsListLi[0][old_i]
                  if (new_i_item.length == old_i_item.length) {
                    let _addnum = 0
                    for (let child_i = 0; child_i < new_i_item.length; child_i++) {
                      for (let child_i_s = 0; child_i_s < old_i_item.length; child_i_s++) {
                        if (new_i_item[child_i].prop_value_id == old_i_item[child_i_s].prop_value_id ) {
                          _addnum ++
                        }
                      }
                    }
                    if (_addnum == new_i_item.length) {
                      this.goodsListData[1][new_i] = this.goodsListData[0][old_i]
                      this.goodsInfoListEdit = this.goodsListData[1]

                      this.sync_supply_sku_li[1][new_i] = this.sync_supply_sku_li[0][old_i]
                      this.sync_supply_sku = this.sync_supply_sku_li[1]
                    }
                  }
                }
            }
          }

          // 处理sku 数据
          this.goodsInfoList.map((sitem,sindex)=>{
            let _inarray = false
            let _usedataindex = -1
            // sitem.map((ssitem,ssindex)=>{
              this.storeskulist.map((item, index)=>{
                let _num = 0
                item.map((items,indexs)=>{
                  if (items.prop_value_id == sitem[indexs].prop_value_id) {
                    _num++
                  }
                })
                if (_num == item.length) {
                  _inarray = true
                  _usedataindex = index
                }
              })
              if (_inarray) {
                this.goodsInfoListEdit[sindex] = this.storeskulistdata[_usedataindex] //销售数据
                this.sync_supply_sku[sindex] = this.storesku[_usedataindex]  //sku 数据
              }else{

                this.storesku.push(this.sync_supply_sku[sindex])
                this.storeskulist.push(sitem)
                this.storeskulistdata.push(this.goodsInfoListEdit[sindex])
              }
            // })
          })
        }else{
          this.goodsInfo = false
        }
      }

      // return arr

    },
    provinceCity(data){
      let _province = []
      let _city = []
      data.map((item, index)=>{
        if (item.isShow == 'false') {
          _province.push(item.id)
        }else{
          if ('children' in item) {
            item.children.map((childim,childix)=>{
              if (childim.isShow == 'true') {
                _city.push(childim.id)
              }
            })
          }
        }
      })
      this.form.province_codes = _province
      this.form.city_codes = _city
    },
    addPeovinceCity(type){
      switch (type) {
        case 'show':
          this.areaListDialog = true
          break;
        case 'hide':
          this.areaListDialog = false
          break;
        case 'sure':
          this.provinceCity(this.store_area_text)
          this.area_text = this.store_area_text
          this.areaListDialog = false
          break;

        default:
          break;
      }
    },
    setSelectProvince(items,nodes){
      let _province_city = []
      if (nodes.halfCheckedNodes.length > 0) {
        nodes.halfCheckedNodes.map((halfchild,halfindex)=>{
          halfchild.isShow = 'true'
          _province_city.push(halfchild)
        })
      }
      if (nodes.checkedNodes.length > 0) {
        nodes.checkedNodes.map((checkitem, checkindex)=>{
          if ('children' in checkitem) {
            checkitem.isShow = 'false'
            _province_city.push(checkitem)
          }else{
            _province_city.map((childi, childindex)=>{
              childi.children.map((childhas, childhasindex)=>{
                if (nodes.checkedKeys.indexOf(childhas.id) != -1) {
                  childhas.isShow = 'true'
                }else{
                  childhas.isShow = 'false'
                }
              })
            })
          }
        })
      }
      this.store_area_text = _province_city
    },
    initSupplyer(val){
      // 创建后 创建供应商选择
      delivery.getSupperlier(val).then((res) => {
        if (res.code === 0) {
          let _data = res.data.supplier_external.suppliers
              _data.unshift(res.data.supplier_self)
          this.restaurants = _data
        }
      })
    },
    sortNumber(a,b){
      return a - b
    },
    createGood(){
      let that = this
      // 按钮操作
      that.$refs.form_sublime.validate((valid)=>{
        if (!valid) {
            return
          }
      })
      that.$refs.form_sublime_price.validate((valid)=>{
        if (!valid) {
            return
          }
      })

      that.$refs.form_sublime_city.validate((valid)=>{
        if (!valid) {
            return
          }
      })

      that.creatGoodBtnClick = true
      setTimeout(() => {
        that.creatGoodBtnClick = false
      }, 3000)
      let _data = that.form
      _data.is_all_areas = that.area_text == '' ? true : false
       //店铺分类取数据 问题处理
      if (that.shop_category_id.length < 1) {
        that.$message({
          message: '请选择店铺分类！',
          type: 'warning'
        });
        return
      }
      // 编辑直接输入了base64 数据处理
      if (_data.pc_detail.indexOf('base64') != -1 && (_data.pc_detail.indexOf('data:img') != -1 || _data.pc_detail.indexOf('data:image') != -1)) {
        that.$message({
          message: '图片上传有误，请重新上传。',
          type: 'warning'
        });
        return
      }
      _data.shop_category=[{
        category_id: that.shop_category_id[that.shop_category_id.length-1]
        }]


      // 一般贸易情况下 处理税率
      if (_data.trade_type == 10) {
        _data.tax_rule_id = ''
      }

      // 处理图片选中
      if (that.selectImgList.length < 1) {
        that.$message({
          message: '至少上传一张商品图！',
          type: 'warning'
        });
        return
      }else{
        let _images = []
        that.selectImgList.map((items, indexs)=>{
          _images.push(items.url)
        })
        _data.images = _images
        _data.primary_image = _images[0]
      }

      if (that.goodsInfoList && that.goodsInfoList.length > 0 && that.goodsInfo) {
        let _spec_props = {}
        let _sku_list = []

        let _test_sell_price = 0;
        let _test_market_price = 0;
        let _test_store_total = 0;
        let _sell_price_list = []

        for (let i = 0; i < that.goodsInfoList.length; i++) {
          _sku_list[i] = that.goodsInfoListEdit[i][0]
          _sku_list[i].spec_desc = that.goodsInfoList[i]

          if (Number(that.goodsInfoListEdit[i][0].market_price) <= Number(that.goodsInfoListEdit[i][0].sell_price)) {
            that.$message({
              message: '市场价必须大于标准售价！',
              type: 'warning'
            });
            return
          }
          _test_sell_price += Number(that.goodsInfoListEdit[i][0].sell_price)
          _test_market_price += Number(that.goodsInfoListEdit[i][0].market_price)
          _test_store_total += Number(that.goodsInfoListEdit[i][0].store_total)
          _sell_price_list.push(Number(that.goodsInfoListEdit[i][0].sell_price))

          if (that.biz_show) {
            if (that.goodsInfoListEdit[i][0].business[0].sell_price == '') {
              // 企业购专享价不能为空
              that.$message({
                message: '请输入企业专享价',
                type: 'warning'
              });
              return
            }
            _sku_list[i].business[0].threshold = _sku_list[i].business[0].threshold== '' ?  1 : _sku_list[i].business[0].threshold
          }
        }
        for (let ii = 0; ii < that.storeAerr.length; ii++) {
            let _keyId = that.storeAerr[ii].id
            let _filterSelect = JSON.parse(JSON.stringify(that.storeAerr[ii].child))
            _filterSelect.map((item , index)=>{
              if (that.$route.name == "add") {
                  item.image = item.storeimg == item.image ? "" : item.image
              }else{
                if (item.baseimg != '') {
                  item.image = item.baseimg == item.image ? "" : item.image
                }
              }

            })
            _spec_props[_keyId] = {
              id : _keyId,
              select : _filterSelect
            }
          }

        // that.form.store_total = _test_store_total.toString()
        // that.$set(that.form , 'store_total' , _test_store_total)
        _data.store_total = _test_store_total
        _data.sku_list = _sku_list
        _data.spec_props = _spec_props

        // 输入销售属性 价格参数比对
        if (_sku_list.length == 1) {
          // sell_price market_price store_total
          if ((Number(_data.sell_price) !=  Number(_sku_list[0].sell_price)) ) {
            that.$message({
              message: '商品信息价格与销售属性价格不一致！',
              type: 'warning'
            });
            return
          }
        }else{
          let _chekcprice = _sell_price_list.sort(that.sortNumber)
          if ((_data.sell_price < _chekcprice[0]) || (_data.sell_price > _chekcprice[_chekcprice.length-1])){
            that.$message({
              message: '标准售价需介于sku最低价（大于或等于）和最高价（小于或等于）之间！',
              type: 'warning'
            });
            return
          }
        }
      }else{
        _data.sku_list = []
        _data.spec_props = {}
      }
      // 企业购特殊处理
      if (that.biz_show) {
        let _business = []
        let _businessOne = {
          threshold : _data.business_threshold || 1,
          sell_price : _data.business_sell_price,
        }
        _business.push(_businessOne)
        if (_businessOne.sell_price == undefined) {
          _business = []
        }
        _data.business = _business
      }


      // 特殊处理性质字段
      _data.logistics_template.id = that.logistics_template_id
      if (that.off_shelves_auto == 1 && Number(that.off_shelves_threshold) < 0) {
        that.$message({
          message: '请输入正确库存阈值！',
          type: 'warning'
        });
        return
      }
      _data.off_shelves = {
        auto: that.off_shelves_auto,
        threshold : that.off_shelves_threshold
      }
      _data.free_fund = that.free_refund ? 1 : 0
      _data.nature_props = that.nature_props

      if (that.supply_chain_show && that.data.channel !== 'pet') {
        if (that.isEdit) {
          if (that.supplierselect.supplier_name.trim().length < 1) {
            that.$message({
              message: '请输入供应商名称！',
              type: 'warning'
            });
            return
          }
        }else{
          if (that.form.supplier_name.trim().length < 1) {
            that.$message({
              message: '请输入供应商名称！',
              type: 'warning'
            });
            return
          }
        }
      }
      //下单数量要求
      if(that.form.MOQ_type){
        if(!that.form.MOQ_amount){
          that.$message({
            message: '请输入下单数量要求的数量！',
            type: 'warning'
          });
          return
        }else{
          let MOQ = {
            type:that.form.MOQ_type,
            amount:that.form.MOQ_amount
          }
          _data.MOQ = MOQ
        }
      }else{
        _data.MOQ = null;
      }

      if (that.$route.name === "add") {
        goods.createGood(_data).then((res)=>{
          if(res.code===0){
            // 跳转商品管理
            that.$router.push({
                name: "manage"
              })
          }
        })
      }else{
        delete _data['skus']
        let _item_id = that.$route.params.id.trim()
          _data.item_id = _item_id

          // 绑定sku 数据待处理 需要过滤
          if (that.supplierselect.supplier_code != '') {
            // if (that.supplierselect.supplier_id && that.supplierselect.supplier_id != -1) {
            let _sync_supply_sku = []
            let _sync_supply_sku_list = that.goodsInfo ? that.sync_supply_sku : that.sync_supply_sku_base
            _sync_supply_sku_list.map((item, index)=>{
              if (item.sku_code != '' && item.sku_id != '') {
                _sync_supply_sku.push(item)
              }
            })
            _data.sync_supply_sku = _sync_supply_sku
            let _testdata = {
              sync_shelf : that.sync_supply_item == 'true' ? true : false //false true 同步上下
            }
            _data.sync_supply_item = _testdata
          }
          // 供应商名字和 code
          _data.supplier_name = that.supplierselect.supplier_name
          _data.supplier_code = that.supplierselect.supplier_code
        // console.log(_data)
        // return
        goods.updateGood(_data).then((res)=>{
          if(res.code===0){
            // 跳转商品管理
            that.$router.push({
                name: "manage"
              })
          }
        })
      }
    },
    // 清空供应商信息
    clearSupplierSelect(){
      let that = this
      that.supplierselect = {
          supplier_code:"",
          supplier_id:-1,
          supplier_kind_code:"",
          supplier_name:"",
          supplier_type_code:""
        }
    },
    initData (){
      // 清洗数据原始值
      let that = this
      that.creatGoodBtnClick = false
      that.storeskulistdata = []     //sku 数据记忆
      that.storeskulist = []         //sku 列表记忆数据
      that.storesku = []              //sku 编辑记忆数据
      that.inplaytimeedit = false        //编辑商品时候 部分不可编辑
      that.inplaytimeeditspec = false    //编辑商品时候 库存不可编辑
      that.storesupplierselect = null   //保存供应商选择
      that.is_multi_spec = false        //单规格false 多规格true
      that.biz_show = false                //企业购
      that.storeselectImgList = []
      that.sellimglist = []           // 销售属性图片处理
      // 编辑供应链数据
      that.total  =  0         //总条数
      that.searchsupplier = ''
      that.formsku = {
        trade_type : '',
        is_mapped:'',
        page : 1 ,
        page_size : 20,
        item_name: '',
        supplier_type : 'self',
        supplier_code : '',
      }                 //sku商品列表查询 goodsname:商品名称 map 是否映射
      that.sync_supply_sku_base = [{
        sku_id : '',
        sku_code : '',
        sync_stock : false,
        sync_supply_price : false,
        sync_push_order : false
      }]    //没有绑定供应链商品时候的基础绑定
      that.sync_supply_sku_li  =  []     //供应链数据处理优化
      that.sync_supply_item  =  'false'        //自动下架 true false
      that.sync_supply_sku  =  []         //新加供应链数据
      that.changeSupplyDialog  =  false   //供应商选择弹框
      that.centerDialogVisible  =  false  //居中内容弹框
      that.searchsupplier  =  ''         //搜索供应商名称
      that.supplierselect = {
        supplier_code:"",
        supplier_id:-1,
        supplier_kind_code:"",
        supplier_name:"",
        supplier_type_code:""
      },          //供应商信息
      that.goodsInfoListEditSelectIndex = -1  //选中index
      that.goodsInfoListEditSelect =  null //选中的商品信息
      that.isEdit  =  false           // 是新增还是 编辑 false true
      that.supply_chain_show  =  false    //是否有供应商选择 对一个供应链 false 无 true 有

      // 地区选择处理
      that.province_codes_city  =  [] //默认地区显示选中 province 和 city
      that.imgSeclect  =  false       //图片选择

      that.sellImgSelect  =  false    //销售图片选择
      that.sellimgffindex  =  null    //当前选中的图片最外层 index
      that.sellimgfindex  =  null     //当前选中的图片外层 index
      that.sellimgitem  =  null       //当前选中的图片 item

      that.activeName =  'pc'         //电脑端 wap 端选择
      // restaurants: [{ "value": "泰然城"},{ "value": "京东慧采"},{ "value": "粮油"},{ "value": "粮油1"},{ "value": "泰然城城"}],
      that.restaurants  =  []         //供应商列表
      that.free_refund =  false       //监听选择
      that.off_shelves_threshold =  '' //还是监听问题
      that.off_shelves_auto  =  0     //多层监听问题
      that.logistics_template_id  =  ''//多层监听问题处理
      that.fileImage  =  []           //图片列表
      that.showTitle  =  true         //是否显示 选择类目按钮
      that.showForm  =  false         //确定或者编辑 才显示列表数据
      that.storeAerr = []             //spec_props 数据处理
      that.storeImage = []            //记录图片列表 用于操作
      that.area_text = []             //地区显示
      that.areaList =  []             //地区选择
      that.areaListDialog  =  false     //判断是否显示地区选择
      that.goodsInfoListEdit = null   //销售属性叠加字段处理
      that.goodsInfoList  =  null     //销售属性组合排列数据
      that.goodsInfo = false
      that.goodsListData  =  []      //销售属性数据处理优化
      that.goodsListLi  =  []        //销售属性比对数据
      that.brand_list =  []           //品牌列表
      that.storecategoryDialogform = [] //存储类目选择列表
      that.storecategoryDialogFormId = '' //存储类目选择id
      that.nature_props = []
      that.shop_list =  []
      that.shop_category_id =  []
      that.sale_list =  []
      that.post_list = []

      let shopInfo = {
        channel:that.data.channel,
        model:that.data.model,
        biz_model:that.data.biz_model
      }

      that.data =  shopInfo   //不清空店铺相关数据
      that.form =  {
        MOQ_type:"",
        MOQ_amount:"",
        business_sell_price : '',           //起批价格
        business_threshold : '' ,             //起批数量
        title: '',
        sub_title: '',
        art_no: '',
        barcode: '',
        type: '',
        trade_type: '',
        deduct_store_type: 10,
        cost_price: '',
        sell_price: '',
        market_price: '',
        supplier_name : '',
        store_total: '',
        pc_detail: '',
        wap_detail: '',
        primary_image : '',
        // primary_image: 'https://t12.baidu.com/it/u=256410731,3452185199&fm=173&s=64449B4747FA8DD04CD834A10300E091&w=550&h=366&img.JPEG',
        images: [
          // 'https://t12.baidu.com/it/u=256410731,3452185199&fm=173&s=64449B4747FA8DD04CD834A10300E091&w=550&h=366&img.JPEG',
        ],
        weight: '',
        logistics_template: {id:''},
        brand_id: '',
        country_id: '',
        warehouse_id: '',
        tax_rule_id: '',
        category_id: '',
        shop_category:[{
          category_id: ''
        }],
        is_all_areas: '',
        province_codes: [], //后台需要传入省份
        city_codes:[],      //后台需要处理 城市选择
        free_fund: 0,
        off_shelves: {
          auto: '',
          threshold: ''
        },
        nature_props: [],
        spec_props: {},
        sku_list: [
          {
            sell_price: '',
            market_price: '',
            cost_price: '',
            barcode: '',
            // store_freeze: '',
            store_total: '',
            spec_desc: [
              {
                prop_id:'',
                prop_value_id: '',
                prop_value_name: ''
              }
            ]
          }
        ],
      }
      that.loading = false
      that.columnslist  = []
    },
    areaListData(){
      delivery.getAreaList().then((res) => {
        if (res.code === 0) {
          for (var i = 0; i < res.data.length; i++) {
            this.areaList.push({
              id: res.data[i].value,
              label: res.data[i].label,
              children: []
            })
            let children = res.data[i].children
            for (var j = 0; j < children.length; j++) {
              this.areaList[i].children.push({
                id: children[j].value,
                label: children[j].label,
              })
            }
          }
        }
      })
    },
    editGetSaleListData(_params){
      let that = this
      goods.getEditSaleList(_params).then((res) => {
        if (res.code === 0) {
                    // 销售属性处理
          that.sale_list = res.data
          let arr = []
          that.sale_list.map((parent) => {
            arr.push({
              id: parent.id,
              name: parent.name,
              child: []
            })
            parent.spec_value.map((children)=>{
              if(children.selected){
                arr[arr.length-1].child.push({
                  id: children.id,
                  name: children.text,
                  image: children.image ?  children.image:children.original_image,
                  storeimg : children.image ?  children.image:children.original_image,
                  baseimg:children.original_image,
                  text : children.text,

                  parent_text : parent.name,
                  prop_id : parent.id,
                  prop_value_id : children.id,
                })
              }
              if (children.original_image) {
                children.image = children.image ? children.image : children.original_image
              }else{
                children.image = ''
              }
            })
          })
          that.storeAerr = arr
        }
      })
    },
    // 获取店铺渠道
    getShopInfo() {
      let that = this;
      return new Promise((resolve,reject) => {
        shops.getShopInfo().then((res) => {
          that.data.model = res.data.model;
          that.data.biz_model = res.data.biz_model;
          that.data.channel = res.data.channel;
          console.log(that.data,333)
          resolve(res.data.channel)
        });
      })
    },
  },
  computed: {
    ...mapGetters([
      'bindCategoryList' , 'goodsIntInfo' , 'selectImgList' , 'skuitem' , 'sellImgSrc'
    ]),
    MOQ_amount_display(){
      if(this.form.MOQ_type)return true
    },
    item_type(){
      //微宠城店铺只能发布普通商品
      let data = this.data;
      if(data.channel === 'pet'){
        let item_type = {};
          for(let key in data.item_type){
            if(key == 10){
              item_type[key] = data.item_type[key]
            }
          }
          return item_type
      }
    }

  },
  mounted(){
    let that = this
    if (that.$route.name === "add") {
      that.isEdit = false
      that.getShopInfo().then((data) => {
        that.getBindCategoryList({channel:data});
      })

      that.showTitle = true
      that.categoryDialog.isVisable = true
    }else{
      that.getShopInfo();
      that.isEdit = true ;  //是编辑状态
      that.areaListData();
      let _params = {item_id : that.$route.params.id.trim()}
      axios({
          methods: 'get',
          url: '/trmall/item/init_edit',
          params : _params
        }).then((res)=>{
          if (res.code !== 0) {
              console.log("数据错误")
              return
          }
          that.showForm = true
          let goodInfoMess = res.data

          let is_logistics_template = 0
          let is_warehouse_id = 0

          goodInfoMess.freight_template_list.map((item) => {
            if(item.id == goodInfoMess.item_info.logistics_template_id){
              is_logistics_template = 1
            }
          })

          goodInfoMess.warehouse_ret.map((item) => {
            if(item.id == goodInfoMess.item_info.warehouse_id){
              is_warehouse_id = 1
            }
          })


          if(!is_logistics_template){
            goodInfoMess.item_info.logistics_template_id = ''
          }

          if(!is_warehouse_id){
            goodInfoMess.item_info.warehouse_id =''
          }

          let _list_text = []
          that.biz_show = res.data.biz_show || false   //编辑时候 是否是企业购 条件
          goodInfoMess.common_category_list.map((item,index)=>{
            _list_text.unshift(item.name)
          })

          that.supply_chain_show = goodInfoMess.supply_chain_show  //编辑获取用户是否去绑定供应链
          if (goodInfoMess.supply_chain_show && goodInfoMess.channel !== 'pet') {
            that.initSupplyer({})
            that.supplierselect = goodInfoMess.item_sync_supply
            that.supplierselect.supplier_name = goodInfoMess.item_info.supplier_name
            that.supplierselect.supplier_code = goodInfoMess.item_info.supplier_code
            that.sync_supply_item = goodInfoMess.item_sync_supply.item_state.shelf ? 'true' : 'false'
          }

          that.showTitle = false
          let _joined_promotions = ['FlashSale', 'SecKill' , 'SpecialFlashSale'] //添加专场特卖 逻辑
          let _goods_joined_promotions = goodInfoMess.joined_promotions
          if (goodInfoMess.joined_promotions.length > 0) {
            that.inplaytimeedit = true // 不可编辑
            that.inplaytimeeditspec = false // 库存仍可编辑
            if (interSection(_joined_promotions,_goods_joined_promotions).length > 0) {
              that.inplaytimeeditspec = true // 库存不可编辑
            }
          }

          that.categoryDialog= {
            isVisable: false,
            form: {
              list: [],
              item: "true",
            },
            list_text: _list_text.join(" / ")
          }

          // data 数据处理 测试处理税率为0
          let _rate_ret = goodInfoMess.rate_ret
          _rate_ret.map((ret,retindex)=>{
            ret.rate = ret.rate == 0 ? '0' : Number(ret.rate) * 100
          })
          that.data = Object.assign({},that.data,{
            item_type : goodInfoMess.item_type,
            trade_type : goodInfoMess.trade_type,
            rate_ret : _rate_ret,
            shop_category_tree : goodInfoMess.shop_category_tree,
            nature_list : goodInfoMess.nature_list || [],
            freight_template_list : goodInfoMess.freight_template_list ,
            warehouse_ret : goodInfoMess.warehouse_ret,
            brand_country_list : goodInfoMess.brand_country_list,
            channel:goodInfoMess.channel,
            // channel_list : goodInfoMess.channel_list
          })
        console.log(that.data,222);

        // 处理 form 数据 先放入整体数据 再进行处理
          that.form = Object.assign({},that.form,goodInfoMess.item_info)//解决form字段丢失问题
          goods.setBrandList({category_id: goodInfoMess.item_info.category_id , no_limit:1 ,level : 3}).then((res)=>{
              if (res.code === 0) {
                that.brand_list = res.data
                let _hasBrandid = false
                that.brand_list.map((item, index)=>{
                  if (item.id == that.form.brand_id) {
                    _hasBrandid = true
                  }
                })
                that.form.brand_id = _hasBrandid ? that.form.brand_id : ''
              }
          })

          that.logistics_template_id = that.form.logistics_template_id
          that.form.logistics_template = {
            id: that.form.logistics_template_id
          }
          that.form.spec_props = goodInfoMess.item_info.specs
          that.form.shop_category = goodInfoMess.item_info.shop_categories
            // 编辑 wap 和电脑
          if (goodInfoMess.item_info.description) {
            that.form.pc_detail = goodInfoMess.item_info.description.pc || ''
            that.form.wap_detail = goodInfoMess.item_info.description.wap || ''
          }

          that.off_shelves_auto = that.form.auto_off_shelves
          that.off_shelves_threshold = that.form.auto_off_shelves_threshold
          // 处理地区选择勾选
          that.free_refund = that.form.free_refund == 1 ? true : false

          // 地区选择数据 特殊处理 先获取 再拼接 不是全选才处理文字
          if (goodInfoMess.item_info.delivery.is_all_areas != 1) {
            if (goodInfoMess.item_info.delivery.province_codes != undefined) {
              that.form.province_codes = goodInfoMess.item_info.delivery.province_codes
            }else{
              that.form.province_codes = []
            }
            if (goodInfoMess.item_info.delivery.city_codes != undefined) {
              that.form.city_codes = goodInfoMess.item_info.delivery.city_codes
            }else{
              that.form.city_codes = []
            }
            that.province_codes_city = that.form.province_codes.concat(that.form.city_codes)
             //显示 地区 拼接
            // let _area_text = []
            let _province_city = []
            if (that.form.province_codes.length > 0 || that.form.city_codes.length > 0) {
              that.areaList.map((im, ix)=>{
                if (that.form.province_codes.includes(im.id)) {
                  // _area_text.push(im.label)
                  im.isShow = 'false'
                  im.children.map((childim,childix)=>{
                    childim.isShow = 'true'
                  })
                  _province_city.push(im)
                }
                if (im.children) {
                  im.children.map((child_im , child_ix)=>{
                    if (that.form.city_codes.includes(child_im.id)) {
                      // _area_text.push(child_im.label)
                      im.isShow = 'true'
                      if (!_province_city.includes(im)) {
                        _province_city.push(im)
                      }
                    }
                  })
                }
              })
              _province_city.map((city_im, city_ix)=>{
                if (city_im.isShow == 'true') {
                  city_im.children.map((chi_im, chi_ix)=>{
                    if (that.form.city_codes.includes(chi_im.id)) {
                      chi_im.isShow = 'true'
                    }else{
                      chi_im.isShow = 'false'
                    }
                  })
                }
              })
              that.area_text = _province_city
            }
          }

          // 基本信息处理

          that.form.type = that.form.type.toString()
          that.form.trade_type = that.form.trade_type.toString()

          that.form.warehouse_id = that.form.warehouse_id
          that.form.tax_rule_id = Number(that.form.tax_rule_id)
          that.form.category_id = that.form.category_id.toString()

          that.$set(that.form, 'store_total', that.form.total_store)
          // that.form.store_total = that.form.total_store
          // 品牌国 未选中时候 显示默认
          if (that.form.country_id === 0) {
            that.form.country_id = ''
          }

          // 企业购 数据处理
          if (that.biz_show) {
            if (goodInfoMess.item_info.business.length > 0) {
              that.form.business_sell_price = goodInfoMess.item_info.business[0].sell_price || ''
              that.form.business_threshold = goodInfoMess.item_info.business[0].threshold || ''
            }
          }

          if (Array.isArray(goodInfoMess.item_info.properties) && goodInfoMess.nature_list.length == goodInfoMess.item_info.properties.length) {
            that.nature_props = goodInfoMess.item_info.properties
          }else{
            // let _properties = Object.values(goodInfoMess.item_info.properties)
            let _nature_props = []
            goodInfoMess.nature_list.map((item, index)=>{
              let _item = {
                  id: item.id,
                  select: ''
                }
              _nature_props.push(_item)
            })
            that.nature_props = _nature_props
          }
          //  处理默认显示图片 显示添加字段 image_domain
          if (that.form.images.length > 0) {
            let _fileImage = []
            for (let imgindex = 0; imgindex < that.form.images.length; imgindex++) {
              let _imgurl = {
                  url: that.form.images[imgindex]
              }
              _fileImage.push(_imgurl)
            }
            that.setImgSelect(_fileImage) //编辑时候 生成默认图集
          }else{
            that.setImgSelect([])
          }
          // 销售属性
          that.editGetSaleListData(_params)
          // skus处理
          that.is_multi_spec = goodInfoMess.item_info.is_multi_spec == 0 ? false : true //单规格 多规格
          // if (goodInfoMess.item_info.skus.length > 0) {
            if (that.is_multi_spec) {
              that.goodsInfo = true
              let _skuslist = goodInfoMess.item_info.skus
              let _newgoodsInfoList = []
              let _newgoodsInfoListEdit = []
              let _sync_supply_sku = []
              if (_skuslist && _skuslist.length > 0) {
                for (let skui = 0; skui < _skuslist.length; skui++) {
                  let _skui_spec_value = _skuslist[skui].spec_value
                  let _store_skui_spec_value =  JSON.parse(JSON.stringify(_skuslist[skui].spec_value))
                  let _business = [{
                    threshold : '',
                    sell_price : ''
                  }]
                  if (that.biz_show && _skuslist[skui].business.length > 0) {
                    _business =  _skuslist[skui].business
                  }
                  let _addField = that.biz_show ? {
                    id : _skuslist[skui].id || null,
                    sell_price: _skuslist[skui].sell_price || '',
                    market_price : _skuslist[skui].market_price || '',
                    cost_price : _skuslist[skui].cost_price || '',
                    barcode : _skuslist[skui].barcode || '',
                    store_total : _skuslist[skui].store_total || '0',
                    business : _business
                  } : {
                      id : _skuslist[skui].id || null,
                      sell_price: _skuslist[skui].sell_price || '',
                      market_price : _skuslist[skui].market_price || '',
                      cost_price : _skuslist[skui].cost_price || '',
                      barcode : _skuslist[skui].barcode || '',
                      store_total : _skuslist[skui].store_total || '0'
                    }


                  let _skudata = {
                    canedit : true,
                    sku_id : _skuslist[skui].id || '',
                    sku_code : _skuslist[skui].sku_code || '',
                    sync_stock : _skuslist[skui].sync_stock || false,
                    sync_supply_price : _skuslist[skui].sync_supply_price || false,
                    sync_push_order : _skuslist[skui].sync_push_order || false
                  }
                  _sync_supply_sku.push(_skudata) //新加供应链数据
                  _store_skui_spec_value.unshift(_addField)
                  _newgoodsInfoList.push(_skui_spec_value)
                  _newgoodsInfoListEdit.push(_store_skui_spec_value)
                }
              }

              that.sync_supply_sku = _sync_supply_sku
              that.goodsInfoList = _newgoodsInfoList
              that.goodsInfoListEdit = _newgoodsInfoListEdit

              that.sync_supply_sku_li = []
              that.goodsListData = []
              that.goodsListLi = []

              that.goodsListData.push(that.goodsInfoListEdit)
              that.goodsListLi.push(that.goodsInfoList)
              that.sync_supply_sku_li.push(that.sync_supply_sku)

              that.storesku = that.sync_supply_sku
              that.storeskulistdata = that.goodsInfoListEdit
              that.storeskulist = that.goodsInfoList
            }else{
              // 无sku 时候 初始化
              let _sync_supply_sku_base = []
              let _sync_supply_sku_base_data = {
                sku_id : goodInfoMess.item_info.skus[0].id || '',
                sku_code : goodInfoMess.item_info.skus[0].sku_code || '',
                sync_stock : goodInfoMess.item_info.skus[0].sync_stock || false,
                sync_supply_price : goodInfoMess.item_info.skus[0].sync_supply_price || false,
                sync_push_order : goodInfoMess.item_info.skus[0].sync_push_order || false
              }
              _sync_supply_sku_base.push(_sync_supply_sku_base_data)
              that.sync_supply_sku_base = _sync_supply_sku_base
            }
          // }

          //修改店铺分类数据格式 处理选中
          that.shop_category_id = []
          for(let parent in that.data.shop_category_tree){
            let item = that.data.shop_category_tree[parent]
            that.shop_list.push({
              value: item.id,
              label: item.name
            })
            if (item.selected === true) {
              that.shop_category_id.push(item.id)
            }
            if(item.children){
              let length = that.shop_list.length
              that.shop_list[length-1].children = []
              for(let i=0;i<item.children.length;i++){
                that.shop_list[length-1].children.push({
                  value: item.children[i].id,
                  label: item.children[i].name
                })
                if (item.children[i].selected === true) {
                  that.shop_category_id.push(item.children[i].id)
                }
              }
            }
          }
          //编辑初始化表单下单数量要求
        if(goodInfoMess.item_info.MOQ){
          that.form.MOQ_type = goodInfoMess.item_info.MOQ.type+"";
          that.form.MOQ_amount = goodInfoMess.item_info.MOQ.amount;
        }
      })
    }
  },
  watch : {
      '$route' (to , from) {
        // 修复编辑时候 点击发布商品没跳转问题
          if (to.name == 'add') {
            // this.$router.go(0)
            this.$router.replace({
              path:'/views/goods/edit/backAdd',
              name : 'backadd'
          })
        }
      }
  }
}

</script>

<style lang='scss' scoped>
.main {
  margin: 20px;
  overflow: hidden;
  .top{
    clear: both;
    margin-bottom: 20px;
  }
  .categoryDialog{
    width: 300px;
  }
  .dialog-footer{
    text-align: center;
  }
  .show_area_text{
    font-size: 12px;
    padding-left: 25px;
    display: flex;
    flex-wrap: wrap;
    .show_area_li{
      margin-right: 10px;
      .show_area_province{
        font-weight: 900;
      }
    }
  }

  .left {
    float: left;
    width: 100%;
    .red_star ,.red_star_spec,.red_star_specs{
      color: #f56c6c;
      position: absolute;
      left: -91px;
      top: 2px;
    }
    .red_star_specs{
      left:-105px
    }
    .red_star_spec{
      left: -80px;
    }
    .left_base{
      // width: 100%;

      .good_name{
        width: 70%;
      }
    }
    .good_price,.good_weight,.good_threshold,.suppliser_base{
        width: 193px;
    }

    .blue-color{
      color: #409EFF;
    }

    .img_base{
      &:nth-child(2){
        padding: 20px 0;
      }
    }

    .natureForm{
        // margin-top: 10px;
        // margin-left: 100px;
        display: flex;
        flex-wrap: wrap;
    }

    .nature{
      .title{
        margin-left: 10px;
        font-size: 14px;
        color: #606266;
      }
    }
  }
  .right {
    // 右边导航 功能未完善 不显示
    position: fixed;
    right: 0;
    width: 12%;
    display: none;
  }

  // 销售属性下 图片修改 show_img_change
  .show_img_change{
    display: flex;
    flex-direction: column;
    // border: 1px solid #ccc;
    // border-bottom:1px solid transparent;
    .show_img_change_ul{
      .show_img_change_li ,.show_img_change_li_head{
        display: flex;
        flex-direction: row;
        // justify-content: space-around;
        border: 1px solid #ccc;

        .show_img_change_li_left{
          width: 50%;
          border-right: 1px solid #ccc;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          padding-left: 10px;
          align-items: center;

          &>img{
            width: 36px;
            height: 36px;
          }
        }

        .show_img_change_li_right{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          padding-left: 10px;
          align-items: center;

          &>img{
            width: 48px;
            height: 48px;
          }
        }
      }
      .show_img_change_li_head{
        height: 40px;

      }
    }
  }

  // 自然属性内容
  .goods_sku_mes{
    font-size: 14px;
    margin: 10px;
    .goods_sku_title{
      .star{
        color: red;
      }
    }
    .goods_sku_world{
      color: #999;
    }
  }
  .goods-sku{
    display: flex;
    flex-direction: column;
    border: 1px solid #999;
    border-bottom: transparent;

    &>:nth-child(1){
      height: 34px;
      background-color:#f5f5f5;
      color: #333;
      font-weight: bold;
    }

    .goods-sku-li{
        display: flex;
        flex-direction: row;
        font-size: 12px;
        border-bottom: 1px solid #999;

        &>:nth-child(1){
          width: 10%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          vertical-align: middle;
          border-right: 1px solid #999;
        }
        &>:nth-child(2){
          width: 90%;
          justify-content: center;
          display: flex;
          align-items: center;
          vertical-align: middle;
          // border: 1px solid #999;
        }
        .goods-sku-edit{
            display: flex;
            flex-direction: column;

            &>:nth-child(1){
              height: 34px;
              line-height: 34px;
              background-color:#f5f5f5;
              font-weight: bold;
              span{
                color: red;
                margin: 3px;
                position: relative;
                top: 3px;
              }
            }
            .goods-sku-edit-list{
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              margin: 5px 0;

              &>:nth-child(n){
                width: 15%;
                text-align: center;
              }
            }
            .goods-sku-edit-list-biz{
               width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              margin: 5px 0;
              align-items: center;

              &>:nth-child(n){
                width: 15%;
                text-align: center;
              }
              &>:nth-child(3){
                width: 10%;
                text-align: center;
              }
            }
        }
    }
  }
}
          // 能否编辑 字段解析说明
          // 'FullMinus';//满减
          // 'FullDiscount';//满折
          // 'FlashSale';//特卖-----
          // 'SpecialFlashSale';//专场特卖
          // 'DirectReduction';//直降
          // 'GroupBuy';//拼团-------
          // 'SecKill';//秒杀------
          // 'OptionBuy';//N元任选
          // 'ExchangeBuy';//加价换购
          // 'GiftBuy';//买赠
          // interSection 取两个数组交集
</style>
<style lang="scss">
  .quill-editor {
    /*工具栏内用*/
    .ql-font {
      span[data-value="Arial"]::before {
        content: "Arial" !important;
        font-family: "Arial";
      }
      span[data-value="serif"]::before {
        content: "serif" !important;
        font-family: "serif";
      }
      span[data-value="宋体"]::before {
        content: "宋体" !important;
        font-family: "宋体";
      }
      span[data-value="monospace"]::before {
        content: "monospace" !important;
        font-family: "monospace";
      }
      span[data-value="cursive"]::before {
        content: "cursive" !important;
        font-family: "cursive";
      }
    }
  /*编辑器内容用*/
    .ql-font-Arial {
      font-family: "Arial";
    }
    .ql-font-Arial {
      font-family: "serif";
    }
    .ql-font-宋体 {
      font-family: "宋体";
    }
    .ql-font-monospace {
      font-family: "monospace";
    }
    .ql-font-cursive {
      font-family: "cursive";
    }
  }
  .ql-snow .ql-picker {
    height:35px;
  }
  .ql-formats:focus{
    outline:none;
  }
  .ql-toolbar.ql-snow .ql-formats :focus{
    outline:none;
  }
  .img_base{
      // 图片处理
    .header_info{
        display: inline-block;
        color: #999;
        padding-left: 10px;
        font-size: 14px;
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

      .img_edit{
          width: 68px;
          height: 68px;
          background-color: #fff;
          border: 1px solid #c0ccda;
          border-radius: 6px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 0 8px 8px 0;
          position: relative;
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
            line-height: 64px;
            color: white;

            .right_img_delete{
              width:100%;
              height: 60%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .right_img_move{
              width:100%;
              height: 40%;
              display: flex;
              align-items: center;
              justify-content: center;
              &>div{
                width: 45%;
                height: 100%;
                display: inline-table;
              }
            }
          }
        &:hover{
          .img_delete{
              display: block;
          }
        }
      }
      .el-button{
          width: 68px;
          height: 68px;
          font-size: 24px;
      }
    }
    .imgSeclect,.sellImgSelect{
      .el-dialog{
        width: 70%;
        margin-top:10vh !important;
        .el-dialog__header,.el-dialog__body{
          padding:0;
        }
      }
    }
  }

  .change-supply-dialog{
    .el-dialog__body{
      padding:0 30px;
      .el-radio-group{
        .el-radio{
          display:block;
          margin:10px 0 0 0;
        }
      }
    }
  }

   //地区选择
  .dialog-arealist {
    .el-tree{
      display: flex;
      flex-wrap: wrap;
      .el-tree-node.is-expanded>.el-tree-node__children{
        display: flex;
        flex-wrap: wrap;
      }
    }
    .footer {
      text-align: center;
    }
  }


  .edit_container{
      .editer{
        width: 90%;
        .ql-container{
            height: 600px;
            border: 1px solid #CCC;
        }
      }
      .el-form-item__content{
        margin-left: 0;
      }
    }

  .sale_base{
    &>div{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      span{
          margin: 5px;
          .sale_input{
            height: 34px;
            padding: 6px 12px;
            font-size: 14px;
            line-height: 1.42857;
            color: #555555;
            background-color: #fff;
            background-image: none;
            border: 1px solid #ccc;
            border-radius: 4px;
            -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
            box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
          }

          .choose-img{
            width: 36px;
            height: 36px;
            display: inline-block;
            position: relative;
            top: 13px;

            &>img{
              width:100%;
              height: 100%;
            }
          }
          .choose-imghid{
            display: none;
          }
      }
    }
  }
  .goods-sku-edit-list{
    .goods-sku-edit-todo{
      .el-checkbox{
        margin-left: 28px;
        text-align: left;
        display: block;
      }
    }
  }

</style>

