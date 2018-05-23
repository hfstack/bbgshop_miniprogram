var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    showcounp:false,
    freetext: '',
    show:0,
    ordersn:0,
    goodsidList: [],//商品id
    addressInfo:[],
    checkedAddress: {},
    // checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    // couponIdid: 0,
    selectconponlist:[],
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    // 页面初始化 options为页面跳转所带来的参数
    // console.log(options.goodsid)
    // this.setData({
    //   selectid: options.goodsid
    // })
    try {
      var addressId = wx.getStorageSync('addressId');
      // console.log(addressId)
      if (addressId != '') {
        this.setData({
          'addressId': addressId
        });
      }

      // var couponId = wx.getStorageSync('couponId');
      // if (couponId) {
      //   this.setData({
      //     'couponId': couponId
      //   });
      // }

      var couponId = wx.getStorageSync('couponId');
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
    this.FindCup()
    
  },
  freetext(event){
    // console.log(event)
    this.setData({
      freetext:event.detail.value
    })
    console.log(this.data.freetext)

  },
  backindex(){
    wx.switchTab({
      url: '/pages/index/index',
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },
  getCheckoutInfo: function () {
    let that = this;
    console.log(that.data.addressId)
    console.log(that.data.couponId)
    // if (that.data.couponIdid == 0){
    //   // console.log("that")
    //   var conpig = 1
    //   util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: conpig }).then(function (res) {
    //     if (res.errno === 0) {
    //       console.log(res.data);
    //       that.setData({
    //         goodsidList: res.data.checkedGoodsList,
    //         addressInfo: res.data.addressInfo,
    //         addressId: res.data.addressId,
    //         checkedGoodsList: res.data.checkedGoodsList,
    //         checkedAddress: res.data.checkedAddress,
    //         actualPrice: res.data.actualPrice,
    //         checkedCoupon: res.data.checkedCoupon,
    //         couponList: res.data.couponList,
    //         couponPrice: res.data.couponPrice,
    //         freightPrice: (res.data.freightPrice).toFixed(2),
    //         goodsTotalPrice: (res.data.goodsTotalPrice).toFixed(2),
    //         orderTotalPrice: res.data.orderTotalPrice
    //       });
    //     }

    //     wx.hideLoading();
    //   });

    // }else {
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
        if (res.errno === 0) {
          console.log(res.data);
          that.setData({
            addressId: res.data.addressId,
            checkedGoodsList: res.data.checkedGoodsList,
            checkedAddress: res.data.checkedAddress,
            actualPrice: res.data.actualPrice,
            // checkedCoupon: res.data.checkedCoupon,
            couponList: res.data.couponList,
            couponPrice: res.data.couponPrice,
            freightPrice: (res.data.freightPrice).toFixed(2),
            goodsTotalPrice: (res.data.goodsTotalPrice).toFixed(2),
            orderTotalPrice: res.data.orderTotalPrice
          });
          console.log(that.data.checkedGoodsList)

        }

        wx.hideLoading();
      });

    // }

  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  selectcoupon() {
    var that = this
    console.log(that.data.goodsTotalPrice)
    console.log(that.data.checkedGoodsList)
    // console.log(this.data.goodsidList)
    let idlist = []
    for (var i = 0; i < that.data.checkedGoodsList.length;i++){
      let goodsLiss = that.data.checkedGoodsList[i]
      let obj = {}
      obj = goodsLiss.goods_id
      idlist.push(obj)
    }
    console.log(idlist)
    let id = idlist.join(',')
    wx.navigateTo({
      url: '/pages/shopping/shcoupon/shcoupon?Price=' + that.data.goodsTotalPrice + '&Goods=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  backindextip(){
    wx.showModal({
      title: '警告',
      content: '此按钮是为了应对一些场景无法返回主页的情况，是否放弃订单返回主页？',
      success: function(res) {
        if(res.confirm){
          wx.switchTab({
            url: '/pages/index/index',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  FindCup(){
    var that = this
    console.log(this.data.couponId)
    util.request(api.CouponFind, { couponId: this.data.couponId },"POST").then(function (res) {
      console.log(res);
      that.setData({
        selectconponlist: res.data.couponList,
      })

    })
    that.getCheckoutInfo();
    
  },
  onReady: function () {
    // 页面渲染完成
    // console.log(this.data.checkedAddress)
    // console.log(this.data.couponIdid)
   
  },
  onShow: function () {
    // 页面显示
    // try {
    //   wx.setStorageSync('couponId', 0);
    // } catch (e) {

    // }
    console.log()
    this.onLoad()

  },
  onHide: function () {
    // 页面隐藏
    // 页面关闭
    try {
      wx.setStorageSync('couponId', 0);
    } catch (e) {

    }
  },
  onUnload: function () {
    // 页面关闭
    try {
      wx.setStorageSync('couponId', 0);
    } catch (e) {

    }
    // util.request(api.CartCheckeder).then(res => {
    //   console.log(res)
    // });
  },
  submitOrder: function () {
    var that = this
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    if (this.data.checkedAddress.name == '') {
      util.showErrorToast('收货地址错误');
      return false;
    }
    if (this.data.checkedAddress.mobile == '') {
      util.showErrorToast('收货地址错误');
      return false;
    }
    if (this.data.checkedAddress.mobile == '') {
      util.showErrorToast('收货地址错误');
      return false;
    }
    if (this.data.checkedAddress.full_region == null) {
      util.showErrorToast('收货地址错误');
      return false; 
    }
    if (this.data.actualPrice * 100 <= 0 ){
      // console.log(this.actualPrice)
      // util.showErrorToast('下单失败');
      wx.showToast({
        title: '哼，订单金额小于0了，别想骗我！',
        icon: 'none',
        duration: 2500,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return false;
    }
    wx.showLoading({
      title: '订单提交中...',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    console.log(this.data.checkedGoodsList)
    console.log(this.data.actualPrice)
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, postscript: this.data.freetext, GoodsList: this.data.checkedGoodsList}, 'POST').then(res => {
      console.log(res)
      if (res.errno === 0) {
        console.log(res.data.orderInfo);
        var orderid = res.data.orderInfo.id
        util.request(api.OrderDetail,{
          orderId: orderid
        }).then(function (res) {
          wx.hideLoading()
          if (res.errno === 0) {
            console.log(res.data);
            var actualprice = res.data.orderInfo.actual_price
            var ordertrueId = res.data.orderInfo.order_sn
            wx.navigateTo({
              url: '/pages/pay/pay?Price=' + actualprice + '&orderId=' + ordertrueId,
            })

          }
          that.getCheckoutInfo();
        });
        // const orderId = res.data.orderInfo.id;
        // pay.payOrder(parseInt(orderId)).then(res => {
        //   wx.redirectTo({
        //     url: '/pages/payResult/payResult?status=1&orderId=' + orderId
        //   });
        // }).catch(res => {
        //   wx.redirectTo({
        //     url: '/pages/payResult/payResult?status=0&orderId=' + orderId
        //   });
        // });
      } else {
        wx.hideLoading()
        util.showErrorToast('下单失败');
      }
    });
  }
})