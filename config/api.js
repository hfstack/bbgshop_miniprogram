// const ApiRootUrl = 'http://127.0.0.1:8360/api/';

module.exports = {
  IndexUrl: ApiRootUrl + 'index/index', //首页数据接口
  CatalogList: ApiRootUrl + 'catalog/index',  //分类目录全部分类数据接口
  CatalogCurrent: ApiRootUrl + 'catalog/current',  //分类目录当前分类数据接口

  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录

  GoodsCount: ApiRootUrl + 'goods/count',  //统计商品总数
  GoodsList: ApiRootUrl + 'goods/list',  //获得商品列表
  GoodsCategory: ApiRootUrl + 'goods/category',  //获得分类数据
  GoodsDetail: ApiRootUrl + 'goods/detail',  //获得商品的详情
  GoodsNew: ApiRootUrl + 'goods/new',  //新品
  GoodsHot: ApiRootUrl + 'goods/hot',  //热门
  GoodsRelated: ApiRootUrl + 'goods/related',  //商品详情页的关联商品（大家都在看）

  BrandList: ApiRootUrl + 'brand/list',  //品牌列表
  BrandDetail: ApiRootUrl + 'brand/detail',  //品牌详情

  CartList: ApiRootUrl + 'cart/index', //获取购物车的数据
  CartAdd: ApiRootUrl + 'cart/add', // 添加商品到购物车
  CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
  CartDelete: ApiRootUrl + 'cart/delete', // 删除购物车的商品
  CartChecked: ApiRootUrl + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: ApiRootUrl + 'cart/goodscount', // 获取购物车商品件数

  CartAddcopy: ApiRootUrl + 'cart/addcopy',
  CartCheckeder: ApiRootUrl + 'cart/checkeder', 
  CartCheckout: ApiRootUrl + 'cart/checkout', // 下单前信息确认
  CartCheckSku: ApiRootUrl + 'cart/checksku', // 下单前信息确认
  CartDelChangeSku: ApiRootUrl + 'cart/delchangesku', // 下单前信息确认

  OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
  PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id
  RefundOrder: ApiRootUrl + 'pay/refund', //退款订单
  CanelRefundOrder: ApiRootUrl + 'pay/canelrefund', //撤销退款申请

  CollectList: ApiRootUrl + 'collect/list',  //收藏列表
  CollectAddOrDelete: ApiRootUrl + 'collect/addordelete',  //添加或取消收藏

  CommentList: ApiRootUrl + 'comment/list',  //评论列表
  CommentCount: ApiRootUrl + 'comment/count',  //评论总数
  CommentLunch: ApiRootUrl + 'comment/lunch',   //发表评论
  CheckComment: ApiRootUrl + 'comment/checkcomment',   
  ListIsComment: ApiRootUrl + 'comment/listiscomment',  
  UpdateComment: ApiRootUrl + 'comment/updatecomment',  
  // ListIsCommented: ApiRootUrl + 'comment/listiscommented',  

  TopicList: ApiRootUrl + 'topic/list',  //专题列表
  TopicDetail: ApiRootUrl + 'topic/detail',  //专题详情
  TopicRelated: ApiRootUrl + 'topic/related',  //相关专题

  SearchIndex: ApiRootUrl + 'search/index',  //搜索页面数据
  SearchResult: ApiRootUrl + 'search/result',  //搜索数据
  SearchHelper: ApiRootUrl + 'search/helper',  //搜索帮助
  SearchClearHistory: ApiRootUrl + 'search/clearhistory',  //搜索帮助

  AddressList: ApiRootUrl + 'address/list',  //收货地址列表
  AddressDetail: ApiRootUrl + 'address/detail',  //收货地址详情
  AddressSave: ApiRootUrl + 'address/save',  //保存收货地址
  AddressDelete: ApiRootUrl + 'address/delete',  //保存收货地址

  RegionList: ApiRootUrl + 'region/list',  //获取区域列表

  OrderList: ApiRootUrl + 'order/list',  //订单列表
  OrderDetail: ApiRootUrl + 'order/detail',  //订单详情
  OrderCancel: ApiRootUrl + 'order/cancel',  //取消订单
  OrderExpress: ApiRootUrl + 'order/express', //物流详情

  FootprintList: ApiRootUrl + 'footprint/list',  //足迹列表
  FootprintDelete: ApiRootUrl + 'footprint/delete',  //删除足迹


  AddressTextphone: ApiRootUrl + 'address/textphone',  //保存收货地址
  BingPhoneFind: ApiRootUrl + 'bingphone/find',  //保存收货地址
  BingPhoneBing: ApiRootUrl + 'bingphone/bing',  //保存收货地址
  BingPhoneText: ApiRootUrl + 'bingphone/text',  //保存收货地址

  FeedBackExchange: ApiRootUrl + 'feedback/exchange',  //保存收货地址 OrderFind
  
  CartFind: ApiRootUrl + 'Cart/find',  //保存收货地址
  FindValues: ApiRootUrl + 'goods/findvalueprice',  //保存收货地址    


  SetOrder: ApiRootUrl + 'pay/setorder', 
  SedSode: ApiRootUrl + 'bingphone/sedsode',  
  CheckSode: ApiRootUrl + 'bingphone/checksode', 


  BargainList: ApiRootUrl + 'bargain/bargainlist',  //获取所有砍价类表
  FindBargain: ApiRootUrl + 'bargain/findbargain',  //按id查找砍价信息
  FindGoodsku: ApiRootUrl + 'bargain/findgoodsku',  //按id查找商品信息
  FindBarValues: ApiRootUrl + 'bargain/findvalueprice', 
  SetUserBargain: ApiRootUrl + 'bargain/setuserbargain', 
  FindUserBargain: ApiRootUrl + 'bargain/finduserbargain', 
  UserBargainList: ApiRootUrl + 'bargain/userbargainlist', 
  
  //砍价
  FindCutList: ApiRootUrl + 'bargain/findcutlist', 
  Cut: ApiRootUrl + 'bargain/cut', 
  FindCutAgain: ApiRootUrl + 'bargain/cutagain', 
  FindIsCut: ApiRootUrl + 'bargain/iscut',
  FriendCut: ApiRootUrl + 'bargain/friendcut',
  BarAddressList: ApiRootUrl + 'bargain/addresslist', 
  BarAddressDetail: ApiRootUrl + 'bargain/addressdetail', 
  CheckIsLaunch: ApiRootUrl + 'bargain/checkislaunch', 
  BarsetOrder: ApiRootUrl + 'bargain/barsetorder', 
  CheckErrPrice: ApiRootUrl + 'pay/checkerrprice', 
  FindBarOrder: ApiRootUrl + 'bargain/findbarorder', 
  DelBarOrder: ApiRootUrl + 'bargain/delbarorder', 
  
    //  优惠券中心
  CouponList: ApiRootUrl + 'coupon/list',
  CouponFind: ApiRootUrl + 'coupon/find',   
  FindInputCup: ApiRootUrl + 'coupon/findinput',   
  UserGetCup: ApiRootUrl + 'coupon/userget',   
  
  //  用户优惠券
  UserCouponList: ApiRootUrl + 'coupon/userlist',
  RepCupList: ApiRootUrl + 'coupon/repcuplist',

  //订单界面优惠券
  CheckCupList: ApiRootUrl + 'coupon/checkcuplist',

  //上传图片到七牛云 
  GetTooken: ApiRootUrl + 'upload/token', //获取token


  // 拼团 
  CollageFindGoods: ApiRootUrl + 'collage/findgoods', //查找拼团商品
  PrepayCollage: ApiRootUrl + 'pay/prepayCollage', //支付拼团订单 
  setCollageOrder: ApiRootUrl + 'collage/setCollageorder', //写入拼团订单 
  PaypayCollageOrder: ApiRootUrl + 'collage/payCollageorder', //拼团订单 付款
  FindCollageUser: ApiRootUrl + 'collage/findCollageuaer', //用户是否已发起过

  //拼团goods
  ColGoodsFindInfo: ApiRootUrl + 'collagegoods/colgoodsfindinfo',  //查找拼团信息
  ColSuccess: ApiRootUrl + 'collagegoods/collagesuccess',  //拼团成功
  SnFindOrder: ApiRootUrl + 'collagegoods/snfindorder',  //拼团成功SnFindOrder

  //拼团用户进入付款
  ColGoodsPayFind: ApiRootUrl + 'collageuserin_pay/colgoodspay_find',  //查找拼团信息
  WriteCollageOrder: ApiRootUrl + 'collageuserin_pay/writecollageorder',  //写入拼团订单 
  PaypayCollageOrderUser: ApiRootUrl + 'collageuserin_pay/paypaycollageorderuser',  //支付拼团订单

  //订单界面跳转到拼团界面判断是否为发起者或拼团者
  ColFriendFindMain: ApiRootUrl + 'collagegoods/colfriendfindmain', //拼团者查找拼团主订单
  CollageIsOutTime: ApiRootUrl + 'collagegoods/collage_isouttime', //拼团者查找拼团主订单
};