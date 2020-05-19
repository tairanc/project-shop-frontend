const getters = {
  menuItem: state => state.menuItems.menuItem,
  headMenu: state => state.menuItems.headMenu,
  deliveryTplUpList: state => state.delivery.templateUpList,
  categoryList: state => state.shop.categoryList,
  bindCategoryList: state => state.shop.bindCategoryList,
  goodsIntInfo : state => state.shop.goodsIntInfo, //新加getter
  selectImgList: state => state.shop.selectImgList, //新加 发布商品图片选中列表
  selcctImgListUrl: state => state.shop.selcctImgListUrl, // 新加 图片url 数组
  sellImgSrc : state => state.shop.sellImgSrc,            //销售选中图片
  accountId: state => state.shop.accountId,
  shopId: state => state.shop.shoId,
  roles: state => state.permission.roles, //权限
  skuitem : state => state.shop.skuitem , // 新加获取 sku select
  brandImgUrlList: state => state.shop.brandImgUrlList , //新加品牌图片
  selectBrandImgList:state => state.shop.selectBrandImgList, //新加选中品牌列表
}
export default getters
