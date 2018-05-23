// pages/AwxChageUserInfoGet/wxChageUserInfoGet.js
const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    route:'',
    data:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option)
    let route = ''
    let data = ''
    if (option.data) {
      // console.log("99")
      route = option.route
      data = option.data
      this.setData({
        route: option.route,
        data: option.data
      })
    }else {
      // console.log("88")
    }
    // console.log(typec)
    // 查看是否授权
    // wx.showLoading({
    //   title: '核实中...',
    //   mask: true,
    // })
    wx.getSetting({
      success: function (res) {
        wx.hideLoading()
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
              user.loginByWeixin().then(res => {
                console.log(res)
                console.log(typec)
                if (typec == ''){
                  wx.switchTab({
                    url: '/pages/index/index',
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }else{
                  wx.redirectTo({
                    url: "/" + that.data.route + '?id=' + that.data.data,
                    success: function (res) { },
                    fail: function (res) { },
                    complete: function (res) { },
                  })
                }
              })
              .catch(res => {
                  console.log(res)
              })
            }
          })
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    let that = this
    console.log(that.data.route)
    if (e.detail.userInfo) {
      console.log("允许授权")
      console.log(e.detail.userInfo)
      user.loginByWeixin().then(res =>{
        console.log(res)
      })
      if (that.data.route == ''){
        wx.switchTab({
          url: '/pages/index/index',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else {
        wx.redirectTo({
          url: "/" + that.data.route + '?id=' + that.data.data,
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
      //用户按了允许授权按钮
    } else {
      //用户按了拒绝按钮
      console.log("拒绝授权")
      wx.showToast({
        title: '拒绝授权！ 点击按钮重新授权！',
        icon: 'none',
        duration: 2000,
        mask: true,
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})