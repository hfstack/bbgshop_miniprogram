var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    userinfoinfo: '',
    route: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let routee = getCurrentPages()
    console.log(routee[0].route)
    this.setData({
      route: routee[0].route
    })
    console.log(app.globalData)
  },
  onReady: function () {

  },
  onShow: function () {

    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  goLogin(){
    let that = this 
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
              user.loginByWeixin().then(res => {
                that.setData({
                  userInfo: res.data.userInfo
                })
                app.globalData.userInfo = res.data.userInfo;
                app.globalData.token = res.data.token;
              })
            }
          })
        } else {
          wx.navigateTo({
            url: '/pages/AwxChageUserInfoGet/wxChageUserInfoGet',
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      }
    })   
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
})