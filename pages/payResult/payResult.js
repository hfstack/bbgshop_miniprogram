var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
  data: {
    // status: true,
    paystatues:true,
    // orderId: 0
  },
  onLoad: function (options) {
    var that = this
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    that.setData({
      // orderId: options.orderId || 24,
      paystatues: options.status
    })
    console.log(that.data.paystatues)
    
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      this.setData({
        paystatues: true
      });
    }).catch(res => {
      util.showErrorToast('支付失败');
    });
  }
})