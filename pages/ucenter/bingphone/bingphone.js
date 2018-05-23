// pages/ucenter/bingphone/bingphone.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 45,
    isbing:false,
    inputMobile:"",
    inputcode:"",
    userinfo: "",
    truesode: 0,
    codeloading:false,
    codedisabled:false,
    checkdisabled:true,
    sendcodetext:" 发送验证码 ",
    changeisabled:false,
    auth:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
              that.findphone();

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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  findphone: function () {
    let that = this;
    util.request(api.BingPhoneFind).then(function (res) {
      console.log(res)
      if (res.data.Result.mobile == "") {
        that.setData({
          isbing:false,
          userinfo: res.data.Result,
          bingisnottext: "您还没有绑定手机号！"
        })
      }else {
        that.setData({
          isbing: true,
          userinfo: res.data.Result
        })
      }
    });

  },
  bindinputMobile: function (event){
    this.setData({
      inputMobile: event.detail.value
    })
    console.log(this.data.inputMobile)
  },
  bindinputcode: function (event) {
    this.setData({
      inputcode: event.detail.value
    })
    console.log(this.data.inputcode)
  },
  sendcode: function () {
    var that = this
    if (this.data.inputMobile == ""){
      util.showErrorToast('请输入手机号码');
      // return false;
    }else {
      util.request(api.BingPhoneText, {
        Phone: that.data.inputMobile
      }, 'POST').then(function (res) {
        console.log(res)
        if (res.errno === 1001) {
          util.showErrorToast('手机号格式错误');
        } 
        else {
          //验证手机号
          //发送验证码
          util.request(api.SedSode,{
            phone: that.data.inputMobile
          }, 'POST').then(function (res){
            console.log(res)
            wx.showToast({
              title: '验证码已发送！',
              icon: 'success',
              duration: 2000
            })
            console.log(res.data.num)
            that.setData({
              truesode:res.data.num
            })
          })
          //按钮倒计时
      var second = that.data.second;
          that.setData({
            sendcodetext: second + '秒后重试',
            codedisabled: true,
            codeloading: true,
            checkdisabled: false,
          })
          const timer = setInterval(() => {
            second--;
            if (second) {
              that.setData({
                sendcodetext: second + '秒后重试',
                codedisabled:true ,
                codeloading: true,
              })
            } else {
              clearInterval(timer);
              that.setData({
                sendcodetext: '获取验证码',
                codedisabled: false ,
                codeloading: false,
              })
            }
          }, 1000);
        }
      })
    }
  },
  
  checked: function () {
    var that = this
    console.log(that.data.truesode)
    if (that.data.inputcode == '') {
      util.showErrorToast('验证码为空！');
    } else {
      //验证手机号
      // util.request(api.CheckSode,{
      //   phone: that.data.inputMobile,
      //   code: that.data.inputcode,
      // }, 'POST').then(function (res){
      //   console.log(res)
      if (that.data.truesode !== that.data.inputcode){
          util.showErrorToast('验证码错误！');
        }else {
        //  console.log("124879")
          util.request(api.BingPhoneBing,{
            bingphone: that.data.inputMobile,
          }).then(function(res){
            console.log(res)
            if ( res.data.Findresult === 1){
              wx.showToast({
                title: '绑定成功',
                icon: 'success',
                duration: 2000
              })
              util.request(api.BingPhoneFind).then(function (res) {
                console.log(res)
                that.setData({
                  isbing: true,
                  userinfo: res.data.Result
                })
              });
            }
          })
        }
      // })
    }
  },
  changed: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否更换绑定手机号？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            isbing: false ,
            bingisnottext: "更换绑定手机号"
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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