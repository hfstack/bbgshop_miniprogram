// pages/bargaingoods/bargaingoods.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');
var WxParse = require('../../lib/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainInfo: {},
    bargainMainInfo: {},
    // openidInfo: {},
    // bargainUserInfo:{},
    id: '',
    goodsInfo:{},
    userInfo:{},
    userInfo_in: {},
    otherGoods:[],
    iscut: 0, //1为已砍过，0为没砍过，17为已砍到底价
    cutList: [],
    addressList:[],
    cutprice: 0,
    noauth:false,//未授权 按钮失效状态
    showModalStatusAress: false,
    showHelp: false,
    showFCPrice: false,
    isEnd:false,
    showModalStatus: false,
    route:'',
    // list:['0','1']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    let routee = getCurrentPages()
    console.log(routee[0].route)
    this.setData({
      route: routee[0].route
    })
    wx.showLoading({
      title: '跳转中...',
      mask: true
    })
    this.setData({
      id: options.id
    })
    this.getopenid()
    
  },
  getopenid(){
    wx.showLoading({
      title: '登录检测...',
      mask: true
    })
    var that = this
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
                that.setData({
                  userInfo_in: res.data
                })
                that.getInfo()
              })
                .catch(res => {
                  console.log(res)
                })
            }
          })
        } else {
          wx.redirectTo({
            url: '/pages/AwxChageUserInfoGet/wxChageUserInfoGet?route=' + that.data.route +"&data=" + that.data.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
  },
  getInfo() {
    var that = this
    wx.showLoading({
      title: '获取数据...',
      mask: true
    })
    console.log(that.data.id)
    util.request(api.FindUserBargain, {
      bargainid: that.data.id
    }).then(function (res) {
      console.log(res)
      that.setData({
        bargainInfo: res.data.bargainuser,
        bargainMainInfo: res.data.bargainmain,
        goodsInfo: res.data.goods,
        userInfo: res.data.user,
        otherGoods: res.data.othergoods,
      })
      WxParse.wxParse('goodsDetail', 'html', res.data.bargainmain.activity_detail, that);

      that.setTimeloop()
      that.checkopenid()
      console.log(that.data.userInfo)
    });
  },
  checkopenid(){
    var that = this
    console.log(that.data.bargainInfo)
    console.log(that.data.userInfo_in)
    util.request(api.FindIsCut, {
      userInfo_in: that.data.userInfo_in,
      userInfo: that.data.userInfo,
      bargoods: that.data.bargainInfo
    }, 'POST').then(res => {
      console.log(res)
      if (res.data.data.length > 0){
        console.log("已砍过")
        that.setData({
          iscut: 1
        })
      }else {
        that.setData({
          iscut: 0
        })
      }

      that.getcutlist()

    })

  },
  getcutlist(){
    var that = this
    util.request(api.FindCutList, {
      userInfo: that.data.userInfo,
      // openidInfo: that.data.openidInfo,
      bargoods: that.data.bargainInfo
    }, 'POST').then(res => {
      console.log(res)
      that.setData({
        cutList: res.data.data
      })
      that.findagain()

    })
  },
  findagain(){
    var that = this
    util.request(api.FindCutAgain, {
      bargoods: that.data.bargainInfo
    }, 'POST').then(res => {
      console.log(res)
      if (res.errno == 1) {
        that.setData({
          iscut: 17
        })
      } else if (res.errno == 0) {
        that.setData({
          bargainInfo: res.data.data
        })
        console.log(that.data.userInfo_in)        
        console.log(that.data.userInfo)  
        if (that.data.userInfo.weixin_openid == that.data.userInfo_in.sessionData.openid){
          // console.log("9999")
          that.showModal()
          // that.sharebtn()
        }else {
          util.request(api.FindIsCut, {
            userInfo_in: that.data.userInfo_in,
            bargoods: that.data.bargainInfo
          }, 'POST').then(res => {
            console.log(res)
            if (res.data.data.length > 0) {
              // console.log("已砍过")
              that.setData({
                iscut: 16,
                noauth: true
              })
              // that.setData({
              //   iscut: 0
              // })
            } else {
              that.setData({
                iscut: 0
              })
            }

            // that.getcutlist()

          })
        }  
        
      }

    })
    wx.hideLoading()
    // wx.showToast({
    //   title: '成功！',
    //   icon: 'none',
    //   image: '',
    //   duration: 2000,
    //   mask: true,
    // })
  },
  sharebtn(){
    var that = this
    console.log(that.data.iscut)
      if (that.data.iscut == "1"){
      //已经砍过 分享按钮
      // console.log("99879798797878")
      that.showModal()
      } else if (that.data.iscut == '0'){
      //没有砍过 砍价按钮
      // userInfo_in
      wx.showLoading({
        title: '砍价中...',
        mask: true
      })
      util.request(api.FriendCut, {
        userInfo_in: that.data.userInfo_in,
        userInfo: that.data.userInfo,
        bargoods: that.data.bargainInfo
      }, 'POST').then(res => {
        console.log(res)
        wx.hideLoading()
        if (res.errno == 217) {
          wx.showToast({
            title: '您已砍过了！',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
          that.setData({
            iscut: 16,
            noauth: true
          })
        } else if (res.errno == 503) {
          that.setData({
            iscut: 17
          })
          // console
        } else {
          console.log(res.data.cutprice)
          that.setData({
            showFCPrice: true,
            cutprice: res.data.cutprice
          })
          that.friendcutthen()
        }
      })
    } else if (that.data.iscut == '17'){
      // that.setData({
      //   showModalAress:
      // })
        //判断用户是否为发起者
        that.islaunch()

    }
    
    // }

    
  },
  islaunch(){
    var that = this
    util.request(api.CheckIsLaunch, {
      userInfo_in: that.data.userInfo_in,
      userInfo: that.data.userInfo,
      bargainInfo: that.data.bargainInfo
    }, 'POST').then(res => {
      console.log(res)
      if (res.errno == 0){
        //如果是，获取地址列表

        that.getaddressList()
      } else if (res.errno == 6){
        var order = res.data
        console.log(order[0].order_sn)
        this.setData({
          noauth:true
        })
        wx.showToast({
          title: '此订单已存在！',
          icon: 'none',
          image: '',
          duration: 2000,
          mask: true,
          success: function (res) { 
            
            // wx.navigateTo({
            //   url: '/pages/ucenter/orderDetail/orderDetail?id=' + parseInt(order[0].id),
            //   success: function(res) {},
            //   fail: function(res) {},
            //   complete: function(res) {},
            // })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }else if(res.errno == 17){
        wx.showModal({
          title: '提示',
          content: '您已经帮好友砍到底价啦！',
          success: function(res) {
            if(res.confirm){
              wx.switchTab({
                url: '/pages/index/index',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      // that.writefriend()
      // that.setData({
      //   bargainInfo: res.data.data,
      //   cutList: res.data.barlist
      // })
    })
    
  },
  getaddressList(){
    var that = this
    that.showModalAress()
    util.request(api.BarAddressList).then(res => {
      console.log(res)
      that.setData({
        addressList: res.data
      })
    })
  },
  friendcutthen(){
    var that = this
    util.request(api.FindCutAgain, {
      bargoods: that.data.bargainInfo
    }, 'POST').then(res => {
      console.log(res)
      // that.writefriend()
      that.setData({
        bargainInfo: res.data.data,
        cutList: res.data.barlist
      })
      if (Number(res.data.data.have_cut_lest) <= Number(res.data.data.goods_lowest_price)){
        // console.log("999999999999999999999999")
        that.setData({
          iscut: 17
        })

        that.islaunch()

      }
    })
    // console.log(that.data.bargainInfo.have_cut_lest)
    // that.checkprice() 
  },
  // checkprice(){
  //   var that = this
  //   // console.log("999999999999999999999999")
  //   console.log(that.data.bargainInfo.have_cut_lest)
  //   if (Number(that.data.bargainInfo.have_cut_lest) <= 0.00) {
  //       console.log("123456789")
  //       // return true
  //   }else {
  //       return false
  //   }
  // },
  // writefriend(){

  // },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(250).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(250).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  showModalAress: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(250).step()
    this.setData({
      animationDataAress: animation.export(),
      showModalStatusAress: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationDataAress: animation.export()
      })
    }.bind(this), 200)
  },
  hideModalAress: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(250).step()
    this.setData({
      animationDataAress: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationDataAress: animation.export(),
        showModalStatusAress: false
      })
    }.bind(this), 200)
  },
  selectAddress(e){
    var that = this
    console.log(e.currentTarget.dataset.addressid)
    var id = e.currentTarget.dataset.addressid
    util.request(api.BarAddressDetail, {
      id: id
    }, 'POST').then(res => {
      console.log(res)
      var address = res

      wx.showModal({
        title: '请确认！',
        content: '确认收货地址为' + address.data.full_region + address.data.address + " , " + address.data.name + " , " + address.data.mobile +" 吗 ？",
        showCancel: true,
        cancelText: '取消',
        cancelColor: '',
        confirmText: '确认',
        confirmColor: '#ff5555',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            console.log(address.data.id)
            console.log(that.data.bargainInfo)
            wx.showModal({
              title: '请再次确认！',
              content: '请确认商品为' + that.data.bargainInfo.goods_name + " , " + that.data.bargainInfo.goods_sku_value + " , " + " 吗 ？ 点击确认支付 " + that.data.bargainInfo.goods_lowest_price + " 元购买 ！ ",
              showCancel: true,
              cancelText: '取消',
              cancelColor: '',
              confirmText: '确认',
              confirmColor: '#ff5555',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  // console.log(address.data.id)
                  // 二次确认后，生成订单并跳转
                  wx.showLoading({
                    title: '订单生成中...',
                    mask:true
                  })
                  that.setOrderPay(address.data)

                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    })
  },
  setOrderPay(address){
    var that = this
    console.log(address)
    console.log(that.data.bargainInfo)
    util.request(api.BarsetOrder,{
      addressInfo: address,
      bargaingoods: that.data.bargainInfo,
      userInfo: that.data.userInfo

    },"POST").then(res => {
      console.log(res)

      if (res.errno === 0){
        that.hideModalAress()
        wx.navigateTo({
          url: '/pages/pay/pay?Price=' + res.data.orderPrice + '&orderId=' + res.data.orderId,
        })
      }else {
        wx.showToast({
          title: '未知错误，请重试！',
          icon: 'none',
          duration: 2500,
          mask: true,
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }
      wx.hideLoading()
    })
  },
 
  exit(){
    wx.navigateBack({
      delta: 1,
    })
  },
  toAddress(){
    wx.navigateTo({
      url: '/pages/ucenter/addressAdd/addressAdd',
      success: function(res) {
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  setTimeloop() {
    var that = this
     var loop = setInterval(function () {
      if ((parseInt(that.data.bargainInfo.end_time) - new Date().getTime()) < 0) {
        that.setData({
          isEnd: true
        })
        that.hideModal()

        clearInterval(loop)
      }
        var list = that.data.bargainInfo
        var time = parseInt(list.end_time) - new Date().getTime()
        list.listtime = util.timestampToTw(time)
      that.setData({
        bargainInfo: that.data.bargainInfo
      })
    }, 100)
  },
  help(){
    var that = this
    that.setData({
      showHelp: !that.data.showHelp
    })
  },
  offmask(){
    this.setData({
      showHelp: false,
      showFCPrice:false
    })
  },

  share_wechat_friend(){
    console.log("分享到微信好友")
  },
  share_wechat_qzone(){
    console.log("分享到微信朋友圈")
  },
  share_qq_friend() {
    console.log("分享到qq好友")
  },
  share_qq_qzone() {
    console.log("分享到qq空间")
  },
  toindex(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  tobargain(){
    wx.navigateTo({
      url: '/pages/bargain/bargain',
    })
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