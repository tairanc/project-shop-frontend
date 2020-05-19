import Vue from "vue";
import Router from "vue-router";
import Layout from "@/views/layout/layout";

Vue.use(Router);

/**
* hidden: true                   是否在侧边栏隐藏
* redirect: noredirect           是否在面包屑中不需要链接
* name:'router-name'             后续会用在<keep-alive>中 （必须设置！！！！）
* meta : {
    title: 'title'               会展示在侧边栏和面包屑中（建议设置！）
  }
**/

//异步路由
export const asynRouterMap=[

//权限管理
{
  path: "/shop-admin",
  name: "shop-admin",
  key:'account',
  bottom: 'accountManage',
  redirect: {name: 'permissions'},
},
 //商品管理
{
  path: "/goods-manage",
  name: "goods-manage",
  key:'item',
  bottom: 'itemInfo',
  redirect: {name: 'goods'}
},
//交易管理
{
  path: "/goods-deal",
  name: "goods-deal",
  key:'trade',
  bottom: 'tradeManage',
  redirect: {name: 'trade'},
},

//营销活动
{
  path: "/goods-activity",
  name: "goods-activity",
  key:'promotion',
  bottom: 'promotionManage',
  redirect: {name: 'activity'},
},
//店铺管理
{
  path: "/shop-manage",
  name: "shop-manage",
  key:'shop',
  bottom: 'shopManage',
  redirect: {name: 'shop'},
},
//数据结算
{
  path: "/settlement-manage",
  name: "settlement-manage",
  key:'settlement',
  bottom: 'settlementManage',
  redirect: {name: 'settlement'},
},
/*
  左边sidebar路由配置
  一级目录path以对应头部的path开头
  一级目录meta 需添加 对应头部的头部内容到parent
 */
// 交易管理路由
{
  path: "/goods-deal/trade",
  name: "trade",
  component: Layout,
  top:'trade',
  key:'tradeManage',
  redirect: {name: 'tradeDeal'},
  meta: {
    title: "订单管理",
    parent: "交易管理",
  },
  children: [
    //订单管理
    {
      path: "tradeDeal",
      name: "tradeDeal",
      key:'showTrade',
      component: () => import("@/views/deal/trade/tradeDeal"),
      meta: {
        title: "订单列表",
      },
    },
    //订单发货
    {
      path:'shipments',
      name:'shipments',
      key:'showTrade',
      hidden:true,
      component: () => import('@/views/deal/trade/shipments'),
      meta: {
        title: "订单发货",
      },
    },
    //订单详情
    {
      path:'orderInfo',
      name:'orderInfo',
      key:'showTrade',
      hidden:true,
      component: () => import('@/views/deal/trade/orderInfo'),
      meta: {
        title: "订单详情",
      },



    },
    //批量发货
    {
      path:'batchShipment',
      name:'batchShipment',
      key:'showTrade',
      hidden:true,
      component: () => import('@/views/deal/trade/batchShipment'),
      meta: {
        title: "批量发货",
      },

    },
    //售后管理
    {
      path: "afterSales",
      name: "afterSales",
      key:'aftersales',
      component: () => import("@/views/deal/trade/afterSales"),
      meta: {
        title: "售后管理",
      },
    },
    //售后详情
    {
      path: "salesInfo",
      name: "salesInfo",
      key:'aftersales',
      hidden:true,
      component: () => import("@/views/deal/trade/salesInfo"),
      meta: {
        title: "售后详情",
      },

    },

  ],
},
//评论管理
{
  path: "/goods-deal/rate",
  name: "rate",
  component: Layout,
  top:'trade',
  key:'rateManage',
  redirect: {name: 'comments'},
  meta: {
    title: "评论管理",
    parent: "交易首页",
  },
  children:[
    //评论列表
    {
      path: "comments",
      name: "comments",
      key:'rate',
      component: () => import("@/views/deal/rate/comments"),
      meta: {
        title: "评论列表",
      },
    },
    //申诉列表
    {
      path: "rateAppeal",
      name: "rateAppeal",
      key:'rateAppeal',
      component: () => import("@/views/deal/rate/rateAppeal"),
      meta: {
        title: "申诉列表",
      },
    },
    //评论概况
    {
      path: "rateCount",
      name: "rateCount",
      key:'rateCount',
      component: () => import("@/views/deal/rate/rateCount"),
      meta: {
        title: "评论概况",
      },
    },
  ]
},
// 权限路由
{
  path: "/shop-admin/permissions",
  name: "permissions",
  component: Layout,
  redirect: {name: 'admin'},
  key:'accountManage',
  top:'account',
  meta: {
    title: "权限管理",
    parent: "权限管理",
  },
  children: [
    {
      path: "admin",
      name: "admin",
      key:'seller',
      component: () => import("@/views/permissions/admin"),
      meta: {
        title: "账号管理",
      },
    },
    {
      path: "role",
      name: "role",
      key:'roles',
      component: () => import("@/views/permissions/role"),
      meta: {
        title: "角色管理",
      },
    },
    {
      path: "log",
      name: "log",
      key:'log',
      component: () => import("@/views/permissions/log"),
      meta: {
        title: "操作日志",
      },
    },
    {
      path: "addAdmin",
      name: "addAdmin",
      key:'seller',
      hidden:true,
      component: () => import("@/views/permissions/addAdmin"),
      meta: {
        title: "添加账号",
      },
    },
    {
      path: "addRole",
      name: "addRole",
      key:'roles',
      hidden:true,
      component: () => import("@/views/permissions/addRole"),
      meta: {
        title: "添加权限",
      },
    },

  ],
},
// 商品管理路由
{
  path: "/goods-manage/goods",
  name: "goods",
  component: Layout,
  key:'itemInfo',
  top:'item',
  redirect: {name: 'manage'},
  meta: {
    title: "商品信息",
    parent: "商品管理",
  },
  children: [
    {
      path: 'add',
      name: 'add',
      key:'addItem',
      component: () => import('@/views/goods/edit/add'),
      meta: { title: '发布商品' }
    },
    {
      path: 'edit/:id',
      key:'addItem',
      name: 'edit',
      hidden:true,
      component: () => import('@/views/goods/edit/add'),
      meta: { title: '编辑商品' }
    },
    {
      path: 'backadd',
      name: 'backadd',
      key:'addItem',
      hidden:true,
      component: () => import('@/views/goods/edit/backAdd')
    },
    {
      key:'showItem',
      path: 'manage',
      name: 'manage',
      component: () => import('@/views/goods/manage/index'),
      redirect: '/goods-manage/goods/manage/sale',
      meta: { title: '管理商品' },
      children: [
        {
          path: "sale",
          name: "sale",
          hidden: true,
          component: () => import("@/views/goods/manage/onSale"),
          meta: {
            title: "正在销售",
          },
        },
        {
          path: "checking",
          name: "checking",
          hidden: true,
          component: () => import('@/views/goods/manage/onChecking'),
          meta: { title: '审核中' }
        },
        {
          path: 'stock',
          name: 'stock',
          hidden: true,
          component: () => import('@/views/goods/manage/downStock'),
          meta: { title: '仓库中' }
        }
      ]
    },
    {
      path: "chip",
      name: "chip",
      key:'chipManage',
      component: () => import("@/views/goods/chip/index"),
      meta: {
        title: "芯片管理",
      },
    },
    {
      path: "chipList",
      name: "chipList",
      key:'itemClip',
      component: () => import("@/views/goods/chip/chipList"),
      meta: {
        title: "商品芯片列表",
      },
    },
    {
      path: "addChip",
      name: "addChip",
      key:'chipManage',
      hidden: true,
      component: () => import("@/views/goods/chip/addChip"),
      meta: {
        title: "芯片写入",
      },
    },
    {
      path: "infoChip",
      name: "infoChip",
      key:'itemClip',
      hidden: true,
      component: () => import("@/views/goods/chip/infoChip"),
      meta: {
        title: "芯片详情",
      },
    },
    {
      path: 'category',
      name: 'category',
      key:'showItemCat',
      component: () => import('@/views/goods/category/index'),
      meta: { title: '商品分类' }
    },
    // 供应链列表
    {
      path: "supplyitem",
      name: "supplyitem",
      key: "supplyItem",
      component: () => import("@/views/goods/supplyitem/index"),
      meta: {
        title: "供应链商品",
      },
    },
    {
      key:'image',
      path: 'imgspace',
      name: 'imgspace',
      component: () => import('@/views/goods/imgspace/index'),
      meta: { title: '图片空间' }
    },
  ]
},
//物流管理路由
{
  path: "/goods-manage/logistics",
  name: "logistics",
  top:'item',
  key:'LogisticsManage',
  component: Layout,
  redirect: {name: 'template'},
  meta: {
    title: "物流管理",
    parent: "商品管理",
  },
  children: [
    {
      path: "template",
      name: "template",
      key:'dlytmpl',
      component: () => import("@/views/goods/template/index"),
      meta: {
        title: "运费模板",
      },
    },
    {
      path: 'addtemplate',
      name: 'addtemplate',
      key:'dlytmpl',
      hidden: true,
      component: () => import('@/views/goods/template/add'),
      meta: { title: '新增运费模板' },
    },
    {
      path: 'edittemplate/:id',
      name: 'edittemplate',
      key:'dlytmpl',
      hidden: true,
      component: () => import('@/views/goods/template/add'),
      meta: { title: '编辑运费模板' },
    },
    {
      path: 'company',
      name: 'company',
      key:'dlycorp',
      component: () => import('@/views/goods/logistics/index'),
      meta: { title: '快递公司' }
    },
    {
      path: 'warehouse',
      name: 'warehouse',
      key:'warehouse',
      component: () => import('@/views/goods/warehouse/index'),
      meta: { title: '仓库管理' }
    },
    {
      path: 'addstore',
      name: 'addstore',
      key:'warehouse',
      hidden: true,
      component: () => import('@/views/goods/warehouse/add'),
      meta: { title: '新增仓库' },
    }
  ]
},
// 营销活动路由
{
  path: "/goods-activity/activity",
  name: "activity",
  top:'promotion',
  key:'promotionManage',
  component: Layout,
  redirect: {name: 'ticket'},
  meta: {
    title: "营销活动",
  },
  children: [
    //店铺优惠券
    {
      path: "ticket",
      name: "ticket",
      key:'shopcoupon',
      component: () => import("@/views/activity/ticket/ticket"),
      meta: {
        title: "店铺券管理",
      },
    },
    {
      path: "addTicket",
      name: "addTicket",
      key:'shopcoupon',
      hidden: true,
      component: () => import("@/views/activity/ticket/addTicket"),
      meta: {
        title: "添加优惠券",
      },
    },
    {
      path: "ticketDetail",
      name: "ticketDetail",
      key:'shopcoupon',
      hidden: true,
      component: () => import("@/views/activity/ticket/ticketDetail"),
      meta: {
        title: "查看优惠券",
      },
    },
    {
      path: "editTicket",
      name: "editTicket",
      key:'shopcoupon',
      hidden: true,
      component: () => import("@/views/activity/ticket/editTicket"),
      meta: {
        title: "编辑优惠券",
      },
    },
    // 免单券管理
    {
      path: "exempt",
      name: "exempt",
      key: "freecoupon",
      // hidden: true,
      component: () => import("@/views/activity/exempt/index"),
      meta: {
        title: "免单券管理",
      },
    },
    {
      path: "checkexempt",
      name: "checkexempt",
      key: "freecoupon",
      hidden: true,
      component: () => import("@/views/activity/exempt/checkexempt"),
      meta: {
        title: "查看免单券",
      },
    },
    {
      path: "editexempt",
      name: "editexempt",
      key: "freecoupon",
      hidden: true,
      component: () => import("@/views/activity/exempt/addexempt"),
      meta: {
        title: "编辑免单券",
      },
    },
    {
      path: "addexempt",
      name: "addexempt",
      key: "freecoupon",
      hidden: true,
      component: () => import("@/views/activity/exempt/addexempt"),
      meta: {
        title: "添加免单券",
      },
    },
    {
      path: "checkexport",
      name: "checkexport",
      key: "freecoupon",
      hidden: true,
      component: () => import("@/views/activity/exempt/checkexport"),
      meta: {
        title: "查看已导出的兑换码",
      },
    },
    // 满折 满减 管理
    {
      path: "reducebreak",
      name: "reducebreak",
      key:'fulldiscount',
      // hidden: true,
      component: () => import("@/views/activity/reduce/index"),
      meta: {
        title: "满折管理",
      },
    },
    {
      path: "reducefull",
      name: "reducefull",
      key:'fullminus',
      // hidden: true,
      component: () => import("@/views/activity/reduce/index"),
      meta: {
        title: "满减管理",
      },
    },
    {
      path: "addBreakReduce",
      name: "addBreakReduce",
      key:'fulldiscount',
      hidden: true,
      component: () => import("@/views/activity/reduce/addreduce"),
      meta: {
        title: "添加满折活动 ",
      },
    },
    {
      path: "addFullReduce",
      name: "addFullReduce",
      key:'fullminus',
      hidden: true,
      component: () => import("@/views/activity/reduce/addreduce"),
      meta: {
        title: "添加满减活动 ",
      },
    },
    {
      path: "editBreakReduce",
      name: "editBreakReduce",
      key:'fulldiscount',
      hidden: true,
      component: () => import("@/views/activity/reduce/addreduce"),
      meta: {
        title: "编辑满折活动 ",
      },
    },
    {
      path: "editFullReduce",
      name: "editFullReduce",
      key:'fullminus',
      hidden: true,
      component: () => import("@/views/activity/reduce/addreduce"),
      meta: {
        title: "编辑满减活动 ",
      },
    },
    {
      path: "reduceBreakDetail",
      name: "reduceBreakDetail",
      key:'fulldiscount',
      hidden: true,
      component: () => import("@/views/activity/reduce/reducedetail"),
      meta: {
        title: "查看满折",
      },
    },
    {
      path: "reduceFullDetail",
      name: "reduceFullDetail",
      key:'fullminus',
      hidden: true,
      component: () => import("@/views/activity/reduce/reducedetail"),
      meta: {
        title: "查看满减",
      },
    },
    //拼团
    {
      path: "group",
      name: "group",
      key:'groupbuylist',
      component: () => import("@/views/activity/group/group"),
      meta: {
        title: "拼团列表",
      },
    },
    {
      path: "addGroup",
      name: "addGroup",
      key:'groupbuylist',
      hidden: true,
      component: () => import("@/views/activity/group/addGroup"),
      meta: {
        title: "添加拼团活动",
      },
    },
    //秒杀
    {
      path: "seckill",
      name: "seckill",
      key:'seckill',
      component: () => import("@/views/activity/seckill/seckill"),
      meta: {
        title: "秒杀管理",
      },
    },
    {
      path: "addSeckill",
      name: "addSeckill",
      key:'seckill',
      hidden: true,
      component: () => import("@/views/activity/seckill/addSeckill"),
      meta: {
        title: "添加秒杀活动",
      },
    },
    {
      path: "editSeckill",
      name: "editSeckill",
      key:'seckill',
      hidden: true,
      component: () => import("@/views/activity/seckill/editSeckill"),
      meta: {
        title: "编辑秒杀活动",
      },
    },
    {
      path: "seckillDetail",
      name: "seckillDetail",
      key:'seckill',
      hidden: true,
      component: () => import("@/views/activity/seckill/seckillDetail"),
      meta: {
        title: "秒杀查看",
      },
    },
    //特卖
    {
      path: "sale",
      name: "activitysale",
      key:'flashsale',
      component: () => import("@/views/activity/sale/index"),
      redirect: '/goods-activity/activity/sale/list',
      meta: { title: "特卖报名" },
      children: [
        {
          path: "applylist",
          name: "applylist",
          hidden: true,
          component: () => import("@/views/activity/sale/applyList"),
          meta: {
            title: "我的报名",
          }
        },
        {
          path: "list",
          name: "list",
          hidden: true,
          component: () => import("@/views/activity/sale/list"),
          meta: {
            title: "活动列表",
          }
        },
        {
          path: "history",
          name: "history",
          hidden: true,
          component: () => import("@/views/activity/sale/history"),
          meta: {
            title: "历史报名",
          }
        }
      ]
    },
    //分佣计划管理
    {
      path: "commission",
      name: "commission",
      key:'commission',
      component: () => import("@/views/activity/commission/commission"),
      redirect: '/goods-activity/activity/commission/itemList',
      meta: { title: "分佣管理" },
      children: [
        {
          path: "classification",
          name: "classification",
          key:'platformcoupon',
          hidden: true,
          component: () => import("@/views/activity/commission/classification"),
          meta: {
            title: "分佣分类",
          }
        },
        {
          path: "itemList",
          name: "itemList",
          key:'platformcoupon',
          hidden: true,
          component: () => import("@/views/activity/commission/itemList"),
          meta: {
            title: "分佣商品推荐",
          }
        },
        {
          path: "orderInfo",
          name: "commissionOrderInfo",
          key:'platformcoupon',
          hidden: true,
          component: () => import("@/views/activity/commission/orderInfo"),
          meta: {
            title: "分佣订单细明",
          }
        },
        {
          path: "orderAll",
          name: "orderAll",
          key:'platformcoupon',
          hidden: true,
          component: () => import("@/views/activity/commission/orderAll"),
          meta: {
            title: "分佣订单汇总",
          }
        },
      ]
    },
    {
      path: "addSale",
      name: "addSale",
      key:'flashsale',
      hidden: true,
      component: () => import("@/views/activity/sale/addSale"),
      meta: {
        title: "报名特卖活动",
      }
    },
    {
      path: "saleDetail",
      name: "saleDetail",
      key:'flashsale',
      hidden: true,
      component: () => import("@/views/activity/sale/saleDetail"),
      meta: {
        title: "查看特卖活动",
      }
    },
    //直降
    {
      path: "direct",
      name: "direct",
      key:'directreduction',
      component: () => import("@/views/activity/direct/direct"),
      meta: {
        title: "直降管理",
      },
    },
    {
      path: "addDirect",
      name: "addDirect",
      key:'directreduction',
      hidden: true,
      component: () => import("@/views/activity/direct/addDirect"),
      meta: {
        title: "添加直降活动",
      },
    },
    {
      path: "directDetail",
      name: "directDetail",
      key:'directreduction',
      hidden: true,
      component: () => import("@/views/activity/direct/directDetail"),
      meta: {
        title: "查看直降活动",
      },
    },
    {
      path: "editDirect",
      name: "editDirect",
      key:'directreduction',
      hidden: true,
      component: () => import("@/views/activity/direct/editDirect"),
      meta: {
        title: "编辑直降活动",
      },
    },
     //n元任选
     {
      path: "option",
      name: "option",
      key:'optionbuy',
      component: () => import("@/views/activity/option/option"),
      meta: {
        title: "N元任选管理",
      },
    },
    {
      path: "addOption",
      name: "addOption",
      key:'optionbuy',
      hidden: true,
      component: () => import("@/views/activity/option/addOption"),
      meta: {
        title: "添加N元任选活动",
      },
    },
    {
      path: "optionDetail",
      name: "optionDetail",
      key:'optionbuy',
      hidden: true,
      component: () => import("@/views/activity/option/optionDetail"),
      meta: {
        title: "查看N元任选活动",
      },
    },
    {
      path: "editOption",
      name: "editOption",
      key:'optionbuy',
      hidden: true,
      component: () => import("@/views/activity/option/editOption"),
      meta: {
        title: "编辑N元任选活动",
      },
    },
      //跨店优惠券
      {
        path: "shopcross",
        name: "shopcross",
        key:'platformcoupon',
        component: () => import("@/views/activity/shopcross/index"),
        redirect: '/goods-activity/activity/shopcross/list',
        meta: { title: "跨店优惠券报名" },
        children: [
          {
            path: "applylist",
            name: "shopapplylist",
            key:'platformcoupon',
            hidden: true,
            component: () => import("@/views/activity/shopcross/applyList"),
            meta: {
              title: "我的报名",
            }
          },
          {
            path: "list",
            name: "shoplist",
            key:'platformcoupon',
            hidden: true,
            component: () => import("@/views/activity/shopcross/list"),
            meta: {
              title: "优惠券列表",
            }
          },
          {
            path: "history",
            name: "shophistory",
            key:'platformcoupon',
            hidden: true,
            component: () => import("@/views/activity/shopcross/history"),
            meta: {
              title: "历史报名",
            }
          }
        ]
      },

       //直销管理
       {
        path: "inviteSell",
        name: "inviteSell",
        key:'inviteSell',
        component: () => import("@/views/activity/inviteSell/inviteSell"),
        redirect: '/goods-activity/activity/inviteSell/goodsBonus',
        meta: { title: "直销管理" },
        children: [
          {
            path: "goodsBonus",
            name: "goodsBonus",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/goodsBonus"),
            meta: {
              title: "商品提成列表",
            }
          },
          {
            path: "bonusCateList",
            name: "bonusCateList",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/bonusCateList"),
            meta: {
              title: "分类提成列表",
            }
          },
          {
            path: "bonusOrderDetail",
            name: "bonusOrderDetail",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/bonusOrderDetail"),
            meta: {
              title: "提成订单明细",
            }
          },
          {
            path: "rebatesDetail",
            name: "rebatesDetail",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/rebatesDetail"),
            meta: {
              title: "返点订单细明",
            }
          },
          {
            path: "bonusOrderSum",
            name: "bonusOrderSum",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/bonusOrderSum"),
            meta: {
              title: "提成订单总汇",
            }
          },
          {
            path: "bonusRebateSum",
            name: "bonusRebateSum",
            hidden: true,
            component: () => import("@/views/activity/inviteSell/bonusRebateSum"),
            meta: {
              title: "返点订单总汇",
            }
          },
        ]
      },
      {
        path: "addShop",
        name: "addShop",
        key:'platformcoupon',
        hidden: true,
        component: () => import("@/views/activity/shopcross/addShop"),
        meta: {
          title: "报名跨店优惠券",
        }
      },
      {
        path: "shopDetail",
        name: "shopDetail",
        key:'platformcoupon',
        hidden: true,
        component: () => import("@/views/activity/shopcross/shopDetail"),
        meta: {
          title: "查看跨店优惠券",
        }
      },
      //买赠
      {
        path: "giftbuy",
        name: "giftbuy",
        key:  'presentGift',
        component: () => import("@/views/activity/giftbuy/giftBuy"),
        meta: {
          title: "买赠管理",
        },
      },
      {
        path: "addGiftbuy",
        name: "addGiftbuy",
        key:  'presentGift',
        hidden: true,
        component: () => import("@/views/activity/giftbuy/addGiftbuy"),
        meta: {
          title: "添加买赠活动",
        },
      },
      {
        path: "editGiftbuy",
        name: "editGiftbuy",
        key:  'presentGift',
        hidden: true,
        component: () => import("@/views/activity/giftbuy/editGiftbuy"),
        meta: {
          title: "编辑买赠活动",
        },
      },
      {
        path: "giftbuyDetail",
        name: "giftbuyDetail",
        key:  'presentGift',
        hidden: true,
        component: () => import("@/views/activity/giftbuy/giftbuyDetail"),
        meta: {
          title: "买赠查看",
        },
      },
      //加价换购
      {
        path: "exchange",
        name: "exchange",
        key:  'exchangebuy',
        component: () => import("@/views/activity/exchange/exchange"),
        meta: {
          title: "加价换购管理",
        },
      },
      {
        path: "addExchange",
        name: "addExchange",
        key:  'exchangebuy',
        hidden: true,
        component: () => import("@/views/activity/exchange/addExchange"),
        meta: {
          title: "添加加价换购活动",
        },
      },
      {
        path: "editExchange",
        name: "editExchange",
        key:  'exchangebuy',
        hidden: true,
        component: () => import("@/views/activity/exchange/editExchange"),
        meta: {
          title: "编辑加价换购活动",
        },
      },
      {
        path: "exchangeDetail",
        name: "exchangeDetail",
        key:  'exchangebuy',
        hidden: true,
        component: () => import("@/views/activity/exchange/exchangeDetail"),
        meta: {
          title: "加价换购查看",
        },
      },
      //礼包报名
      {
        path:"giftpackage",
        name:"giftpackage",
        key:"giftpackage",
        component: () => import("@/views/activity/gift/index"),
        meta: {
          title: "礼包报名",
        },
      },
      //礼包查看/报名
      {
        path:"giftInfo",
        name:"giftInfo",
        key:"giftpackage",
        hidden:true,
        component: () => import("@/views/activity/gift/giftInfo"),
        meta: {
          title: "礼包查看",
        },
      },
      {
        path:"giftBm",
        name:"giftBm",
        key:"giftpackage",
        hidden:true,
        component: () => import("@/views/activity/gift/giftBm"),
        meta: {
          title: "礼包报名",
        },
      }
  ],
},
//店铺管理路由
{
  path: "/shop-manage/shop",
  name: "shop",
  top:'shop',
  key:'shopManage',
  component: Layout,
  redirect: {name: 'config'},
  meta: {
    title: "店铺设置",
    parent: "店铺管理",
  },
  children: [
    {
      path: "config",
      name: "config",
      key:'shopsetting',
      component: () => import("@/views/shop/config/index"),
      meta: {
        title: "店铺配置",
      },
    },
    {
      path: "pcDecorate",
      name: "pcDecorate",
      key:'newdecorate',
      component: () => import("@/views/shop/decorate/pcdecorate"),
      meta: {
        title: "PC店铺装修",
      }
    },
    {
      path: "wapDecorate",
      name: "wapDecorate",
      key:'wapdecorate',
      component: () => import("@/views/shop/decorate/wapdecorate"),
      meta: {
        title: "wap店铺装修",
      }
    },
    {
      path: "message",
      name: "message",
      key:'shopapply',
      component: () => import("@/views/shop/message/index"),
      meta: {
        title: "商家入驻信息",
      }
    },
    {
      path: "invoice",
      name: "invoice",
      key:'invoice',
      component: () => import("@/views/shop/invoice/index"),
      meta: {
        title: "发票设置",
      }
    },
    {
      path: "categoryApply",
      name: "categoryApply",
      key:'categoryApply',
      component: () => import("@/views/shop/categoryApply/index"),
      meta: {
        title: "申请类目权限",
      }
    },
    {
      path: "brandApply",
      name: "brandApply",
      key:'brandApply',
      component: () => import("@/views/shop/brandApply/index"),
      meta: {
        title: "品牌申请",
      }
    }
  ]
},
//数据结算
{
    path: "/settlement-manage/settlement",
    name: "settlement",
    top:'settlement',
    key:'settlementForms',//settlementManage
    component: Layout,
    redirect: {name: 'summary'},
    meta: {
      title: "结算报表",
      parent: "数据结算",
    },
    children: [
      {
        path: "summary",
        name: "summary",
        key:'periodicStatement',
        component: () => import("@/views/settle/summary/index"),
        meta: {
          title: "结算汇总表",
        },
      },
      {
        path: "orderDetail",
        name: "orderDetail",
        key:'orderGoodBill',
        component: () => import("@/views/settle/orderdetail/index"),
        meta: {
          title: "订单明细",
        }
      },
      {
        path: "settleRefund",
        name: "settleRefund",
        key:'refundBill',
        component: () => import("@/views/settle/settlerefund/index"),
        meta: {
          title: "退款明细",
        }
      },
      {
        path: "payFreight",
        name: "payFreight",
        key:'freightBill',
        component: () => import("@/views/settle/payfreight/index"),
        meta: {
          title: "垫付运费",
        }
       },
      {
        path: "violatFine",
        name: "violatFine",
        key:'fineBill',
        component: () => import("@/views/settle/violatfine/index"),
        meta: {
          title: "违规罚款",
        }
      },
      {
        path: "othersFine",
        name: "othersFine",
        key:'incidentalBill',
        component: () => import("@/views/settle/othersfine/index"),
        meta: {
          title: "其他款项",
        }
      },
      {
        path: "loadList",
        name: "loadList",
        key:'downloadList',
        component: () => import("@/views/settle/loadList/index"),
        meta: {
          title: "下载列表",
        }
      }
    ]
  }

];

//同步路由
export const constantRouterMap = [
  /**
   * 头部导航路由配置
   * 配置后将path加入到header组件的 el-menu-item index中
   **/
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path:'/login',
    name:'/login',
    component: () => import('@/views/login/index')
  },
  {
    path:'/registered',
    name:'/registered',
    component: () => import('@/views/login/registered')
  },
  {
    path:'/enterin',
    name:'/enterin',
    component: ()=> import('@/views/enter/index')
  },
  {
    path:'/home',
    name:'/home',
    component: () => import('@/views/homePage/home')
  }
];

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
