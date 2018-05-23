const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    // newGoodslist: [],
    hotGoods: [],
    // hotGoodslist: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: []
  },
  onShareAppMessage: function () {
    return {
      title: '贝堡商城',
      desc: '贝堡商城微信小程序',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel
        });
        // for (var i = 0; i < that.data.newGoodslist.length;i++){
        //   if (i<4){
        //     let obj = {}
        //     obj = that.data.newGoodslist[i]
        //     // that.setData({
        //       that.data.newgoods.push(obj)
        //     // })
           
        //   }
        // }
        util.request(api.GoodsCount).then(function (res) {
          that.setData({
            goodsCount: res.data.goodsCount
          });
        });
      }
    });
  },

  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // console.log("1111111")
    // 页面渲染完成
  },
  goLogin() {
    // user.loginByWeixin().then(res => {
    //   console.log(res)
    // })
    // let code = null
    // util.login().then((res) => {
    //   code = res.code;
    //   console.log(res)
    // })
    // user.loginByWeixin().then(res => {
    //   app.globalData.userInfo = res.data.userInfo;
    //   app.globalData.token = res.data.token;
    // }).catch((err) => {
    //   console.log(err)
    //   wx.showModal({
    //     title: '警告',
    //     content: '拒绝授权会导致未知问题，点击确定重新获取权限！',
    //     success: function (res) {
    //       if (res.confirm) {
    //         // console.log('用户点击确定')
    //         // this.goLogin()
    //         wx.openSetting({
    //           success: function(res) {
    //             console.log(res)
    //             if (res.authSetting["scope.userInfo"]) {

    //             }
    //           },
    //           fail: function(res) {},
    //           complete: function(res) {},
    //         })
    //       } else if (res.cancel) {
    //         // console.log('用户点击取消')
    //       }
    //     }
    //   })
    // });

  },
  onShow: function () {
    // 页面显示
    this.goLogin()
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
