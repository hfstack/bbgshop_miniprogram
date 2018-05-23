// pages/Bargain/bargain.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainList: [],//砍价商品列表
    goods: {},
    showscreen: 0,
    openidInfo:{},
    thisbargoods:'',
    isCut: 0,//0为未砍到底价，1为已砍到底价但未领取，2为已付款领取，3为已超时
    specificationList: [],
    productList: [],
    userbargainList: [],
    checkgoodsprice: "",
    checkedSpecText: '请选择规格',
    chooseSize: false,
    number: 1,
    animationData: {},
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
              that.getList()
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
  getList(){
    // wx.hideLoading()
    
    var that = this
    wx.showLoading({
      title: '登录检测...',
      mask: true
    })
    user.loginByWeixin().then(res => {
      that.setData({
        openidInfo:res.data
      })
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
      // util.request(api.BargainList).then(function (res) {
      //   console.log(res)
        wx.hideLoading()
      //   if (res.errno == 0) {
      //     that.setData({
      //       bargainList: res.data.data
      //     })
      //   } else {

      //   }

      //   console.log(that.data.bargainList)
      // });
    })
    // .then((res) => {
    //   console.log(res)
    // })
    .catch((err) => {
      console.log(err)
      wx.hideLoading()
      if (err.errMsg !== "login:ok"){
        wx.hideLoading()
        wx.showToast({
          title: '未授权！',
          icon: 'none',
          duration: 2000,
          mask: true,
          success: function(res) {
            wx.switchTab({
              url: '/pages/cart/cart',
              success: function(res) {
                wx.showToast({
                  title: '请授权！',
                  icon: 'none',
                  image: '',
                  duration: 2000,
                  mask: true,
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              },
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      }else {
        // console.log("65487945321")
        // util.request(api.BargainList).then(function (res) {
        //   console.log(res)
        //   wx.hideLoading()
        //   if (res.errno == 0) {
        //     that.setData({
        //       bargainList: res.data.data
        //     })
        //   } else {

        //   }

        //   console.log(that.data.bargainList)
        // });
      }
    })
    util.request(api.BargainList).then(function (res) { 
      console.log(res)
      wx.hideLoading()
      if(res.errno == 0){
        that.setData({
          bargainList: res.data.data
        })
      }else {

      }
      // that.getList()
      console.log(that.data.bargainList)
    });
    wx.hideLoading()
  },
  skupriceinfo(barid){
    console.log(barid)
    var that = this
    util.request(api.FindBargain,{
      bargainid: barid
    }).then(function (res) {
      console.log(res.data.data[0])
      that.setData({
        thisbargoods:res.data.data[0]
      })
      // that.setData({
      //   bargainList: res.data.data
      // })
      // console.log(that.data.bargainList)
    });
  },
  skuinfo(id){
    var that = this
    console.log(id)
    var goodsid = id
    util.request(api.FindGoodsku,{
      id: goodsid
    }).then(res => {
      console.log(res)
      that.setData({
        // goods: res.data.info
        goods: res.data.info,
        checkgoodsprice: res.data.info,
        // gallery: res.data.gallery,
        // attribute: res.data.attribute,
        // issueList: res.data.issue,
        // comment: res.data.comment,
        // brand: res.data.brand,
        specificationList: res.data.specificationList,
        productList: res.data.productList,
        // userHasCollect: res.data.userHasCollect
      })
    })
  },
  showModal: function (e) {
    // 显示遮罩层
    // console.log(e)
    // wx.showLoading({
    //   title: '登录检测...',
    //   mask: true
    // })
    var id = e.target.dataset.goodsid
    var barid = e.target.dataset.barid
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
    this.setData({
      checkedSpecText: '请选择规格',
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
    this.skuinfo(id)
    this.skupriceinfo(barid)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(500).step()
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
    // this.setData({
    //   specificationList: [],
    //   productList: []
    // })
  },
  skuSure(){
    //提示选择完整规格
    var that = this
    console.log(that.isCheckedAllSpec())
    if (!that.isCheckedAllSpec()) {
      wx.showToast({
        title: '选择完整规格！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = that.getCheckedProductItem(that.getCheckedSpecKey());
    // console.log(checkedProduct)
    if (!that.data.checkgoodsprice || that.data.checkgoodsprice.length <= 0) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '没有库存！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }

    //验证库存
    if (that.data.checkgoodsprice.goods_number < that.data.number) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '库存不足！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    if (that.data.checkgoodsprice == {}){
      wx.showToast({
        title: '异常！请重试！',
        icon: 'none',
        duration: 1500,
      })
    }

    wx.showModal({
      title: '提示！',
      content: '是否确认发起 ' + that.data.thisbargoods.goods_name + "\r\n" + that.data.checkedSpecText+"款砍价，发起后"+"砍价商品和规格不可更改！",
      success: function(res) {
        if(res.confirm) {
        util.request(api.SetUserBargain, {
          bargoods: that.data.thisbargoods,
          skuid: that.data.checkgoodsprice,
          skuvalue: that.data.checkedSpecText,
        },'POST').then(res => {
          that.final(res)
        })
        
        console.log(that.data.checkgoodsprice)
        console.log(that.data.thisbargoods)
        console.log(that.data.checkedSpecText)
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  final(res){
    var that = this
    // console.log("13246578987654321")
    // console.log(res)
    // console.log(res.errno)
    console.log(that.data.openidInfo)
    console.log(that.data.thisbargoods)
    console.log(that.data.checkgoodsprice)
    this.hideModal()
    console.log(res)
    // this.data.showModalStatus 
    if (res.errno === 217){
      wx.navigateTo({
          url: '/pages/bargaingoods/bargaingoods?id='+res.data[0].id,
          success: function(res) {
                  wx.showToast({
                    title: '您已发起过此商品规格的砍价！',
                    icon: 'none',
                    duration: 1500,
                    mask: true,
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                  })
          },
          fail: function(res) {},
          complete: function(res) {},
      })
    } else if (res.errno === 503){
      wx.showModal({
        title: '提示',
        content: '您曾经发起过此次砍价，但失败了，所以不能发起第二次！',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (res.errno === 506) {
      wx.showModal({
        title: '提示',
        content: '您曾经发起过此次砍价，但已超时，不能发起第二次！',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
  
      wx.navigateTo({
        url: '/pages/bargaingoods/bargaingoods?id=' + res.data,
        success: function (res) { 
          wx.showToast({
            title: '发起成功！',
            icon: 'none',
            duration: 1500,
            mask: true,
            success: function (res) {
              wx.showLoading({
                title: '砍价中...',
                mask: true,
              }) 
              util.request(api.Cut, {
                openidInfo: that.data.openidInfo,
                barGoods: that.data.thisbargoods,
                goodsSku: that.data.checkgoodsprice
              }, 'POST').then(res => {
                console.log(res)
                wx.hideLoading()
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specification_id == specNameId) {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();
    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      console.log(v)
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      console.log(v.valueId)
      return v.valueId;
    });

    return checkedValue.reverse().join('_');
  },
  changeSpecInfo: function () {
    var that = this
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('/')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格'
      });
    }
    // console.log(checkedValue)
    // console.log(checkedNameValue)

    if (checkedValue.length == checkedNameValue.length) {
      // console.log("999999")
      var value2 = []
      for (var i = 0; i < checkedNameValue.length; i++) {
        var obj = checkedNameValue[i].valueId
        value2.push(obj)
      }
      console.log(value2)
      util.request(api.FindBarValues, { data: value2 }, "POST").then(function (res) {
         console.log(res)
        that.setData({
          checkgoodsprice: res.data
        })
      });
      
      // for (var j = 0; j < value2.length;j++){
      //   // console.log(value2)
      //   final = value2[i] + '_'
      // }
      // console.log(final)
    }

  },
  getCheckedProductItem: function (key) {
    // console.log(this.data.productList)
    //  return this.data.productList
    console.log(key)
    return this.data.productList.filter(function (v) {
      if (v.goods_specification_ids == key) {
        return true;
      } else {
        return false;
      }
    });
  },


  bargoodsscreen(){
    var that = this
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    // clearInterval(loop)
    util.request(api.BargainList).then(function (res) {
      console.log(res)
      wx.hideLoading()
      if (res.errno == 0) {
        that.setData({
          bargainList: res.data.data
        })
      } else {

      }
    })
    this.setData({
      showscreen: 0
    })
  },
  baruserscreen() {
    var that = this
    wx.showLoading({
      title: '获取中...',
      mask: true
    })
    util.request(api.UserBargainList).then(res => {
      console.log(res)
      wx.hideLoading()
      that.setData({
        userbargainList:res.data.data
      })
      that.setTimeloop()
    })
    // console.log(that.data.userbargainList[0])
    
    this.setData({
      showscreen: 1
    })
  },
  setTimeloop(){
    var that = this
    // console.log(that.data.userbargainList)
    var loop = setInterval(function (){
      for (var i = 0; i < that.data.userbargainList.length; i++) {
        var list = that.data.userbargainList[i]
        if (parseInt(list.end_time) - new Date().getTime() < 0) {
          list.listtime = "0"
        }else{
          var time = parseInt(list.end_time) - new Date().getTime()
          // console.log(util.timestampToDate(time)) 
          list.listtime = util.timestampToDate(time)
        }
      }
      that.setData({
        userbargainList: that.data.userbargainList
      })
      // console.log(that.data.userbargainList)
      if (that.data.showscreen == 0) {
        clearInterval(loop)
      }
    },1000)
    
    
      // that.setData({
      //   userbargainList:
      // })
    // that.data.userbargainList.set(obj)
    // that.data.userbargainList.push(obj)
    console.log(that.data.userbargainList)
    
  },
  contonpay(e) {
    var that = this
    // console.log(e.target.dataset.id)
    // console.log(that.data.checkgoodsprice)
    util.request(api.FindBarOrder, {
      bargoods: e.target.dataset.id
    }, 'POST').then(res => {
      console.log(res)
      wx.navigateTo({
        url: '/pages/pay/pay?Price=' + res.data.acprice + '&orderId=' + res.data.ordersn,
      })
    })
  },
  contoncut(e){
    console.log(e.target.dataset.id)
    wx.navigateTo({
      url: '/pages/bargaingoods/bargaingoods?id=' + e.target.dataset.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  contonendcut(e){
    var that = this
    var e = e 
    wx.showLoading({
      title: '加载中',
    })
    util.request(api.FindBarOrder, {
      bargoods: e.target.dataset.id
    }, 'POST').then(res => {
      console.log(res)
      var order = res.data
      wx.hideLoading()
      // wx.navigateTo({
      //   url: '/pages/pay/pay?Price=' + res.data.acprice + '&orderId=' + res.data.ordersn,
        
      // })
      wx.showModal({
        title: '警告',
        content: '此订单已失效，是否删除？（此操作不可逆！）',
        success: function (res) {
          if (res.confirm) {
            // if (order.ordersn == '0'){
            //   console.log(e.target.dataset.id)
            // }else {
              util.request(api.DelBarOrder,{
                orderid: order.ordersn,
                id: e.target.dataset.id
              },'POST').then(res =>{
                console.log(res)
                if(res.errno == 0){
                  that.baruserscreen()
                }
              })
            // }
            // console.log('用户点击确定')
          } else if (res.cancel) {

            // console.log('用户点击取消')
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    })
    
    wx.showToast({
      title: '此砍价已结束或已超时！',
      icon: 'none',
      duration: 2000
    })
  },
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    // wx.showLoading({
    //   title: '获取中...',
    //   mask: true
    // })
    // console.log("9999999999999999999999999999999999999999")
    // clearInterval(loop)
    util.request(api.BargainList).then(function (res) {
      console.log(res)
      // wx.hideLoading()
      if (res.errno == 0) {
        that.setData({
          bargainList: res.data.data
        })
        util.request(api.UserBargainList).then(res => {
          console.log(res)
          wx.hideLoading()
          that.setData({
            userbargainList: res.data.data
          })
          that.setTimeloop()
        })
      } else {

      }
    })
    
    // this.setData({
    //   showscreen: 0
    // })
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