var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
    auth: false
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // this.getAddressList();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this
    wx.getSetting({
      success: function (res) {
        wx.hideLoading()
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
              that.setData({
                auth: true
              })
              that.getAddressList();

            }
          })
        } else {
          that.setData({
            auth: false
          })
          wx.showToast({
            title: '未授权！请在“我的”页点击头像授权!',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
        }
      }
    })
  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  noauth(){
    wx.showToast({
      title: '未授权！请在“我的”页点击头像授权!',
      icon: 'none',
      duration: 2000,
      mask: true,
    })
  },
  addressAddOrUpdate (event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  deleteAddress(e){
    console.log(e)
    let that = this;
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = e.currentTarget.dataset.addressId;
          util.request(api.AddressDelete, { id: addressId }, 'POST').then(function (res) {
            if (res.errno === 0) {
              that.getAddressList();
            }
          });
          console.log('用户点击确定')
        }
      }
    })
    return false;
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})