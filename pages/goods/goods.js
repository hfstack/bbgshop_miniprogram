var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const user = require('../../services/user.js');

Page({
  data: {
    route: '',
    id: 0,
    power: 0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    collage: [],
    checkedGoods: [],
    specificationList: [],
    productList: [],
    checkgoodsprice: "",
    checkgoodsku: "",
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    showModalStatus: false,
    typec: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },
  getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
      console.log(res)
      if (res.errno === 0) {
        that.setData({
          goods: res.data.info,
          collage: res.data.collage,
          checkgoodsprice: res.data.info,
          gallery: res.data.gallery,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect
        });

        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        that.getGoodsRelated();
      }
    });

  },
  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
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
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }
    // console.log(checkedValue)
    // console.log(checkedNameValue)

    if (checkedValue.length == checkedNameValue.length) {
      console.log("999999")
      // console.log(this.data.productList)
      var value2 = []
      // var final = ''
      for (var i = 0; i < checkedNameValue.length; i++) {
        // let obj =
        var obj = checkedNameValue[i].valueId
        value2.push(obj)
      }
      console.log(value2)
      let value3 = value2.sort()
      console.log(value3)
      // let ids = value2.join('_')
      util.request(api.FindValues, { data: value3 }, "POST").then(function (res) {
        console.log(res)
        that.setData({
          checkgoodsprice: res.data
          //  checkgoodsku:res.data
          //  checkedProduct
        })
        //  console.log(that.data.checkgoodsku)

      });
      // for (var j = 0; j < value2.length;j++){
      //   // console.log(value2)
      //   final = value2[i] + '_'
      // }
    }

  },
  getCheckedProductItem: function (key) {
    // console.log(this.data.productList)
    //  return this.data.productList
    console.log(key)
    return this.data.productList.filter(function (v) {
      //  console.log(v)
      if (v.goods_specification_ids == key) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let routee = getCurrentPages()
    console.log(routee[1].route)
    this.setData({
      route: routee[1].route,
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();

    util.request(api.CartGoodsCount).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });

      }
    });

  },
  power() {
    let that = this
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo.username == "login") {
      that.setData({
        power: 0
      })
    } else {
      that.setData({
        power: 1
      })
    }

  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(600).step()
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
    animation.translateY(600).step()
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
  checkoutOrder: function () {
    var that = this;
    // if (this.data.openAttr == false) {
    //   //打开规格选择窗口
    //   this.setData({
    //     openAttr: !this.data.openAttr,
    //     collectBackImage: "/static/images/detail_back.png"
    //   });
    // } else {

    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        title: '选择完整规格！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    console.log(checkedProduct)
    if (!this.data.checkgoodsprice || this.data.checkgoodsprice.length <= 0) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '没有库存！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }

    //验证库存
    if (this.data.checkgoodsprice.goods_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '库存不足！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    // console.log("123")
    // console.log(that.data.goods)
    // console.log(that.data)
    // var goodser = that.data.goods
    var checkedGoods = that.data.goods
    //取消购物车商品的选中状态 
    util.request(api.CartCheckeder)
      .then(function (res) { });
    //添加到购物车
    console.log(checkedProduct)
    util.request(api.CartAddcopy, { goodsId: this.data.goods.id, number: this.data.number, productId: this.data.checkgoodsprice.id }, "POST")
      .then(function (res) {
        console.log(res)
        if (res.errmsg == 200) {
          wx.switchTab({
            url: '/pages/cart/cart',
            success: function (res) {
              wx.showToast({
                icon: 'none',
                duration: 2500,
                title: '商品已存在购物车中！' + '点击下单即可！'
              });
            },
            fail: function (res) { },
            complete: function (res) { },
          })
          // return false
        } else {
          let _res = res;
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加到购物车！'
            });
            that.setData({
              // openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data.cartTotal.goodsCount
            });
            if (that.data.userHasCollect == 1) {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }
          util.request(api.BingPhoneFind).then(function (res) {
            console.log(res)
            if (res.data.Result.mobile == "") {
              wx.navigateTo({
                url: '/pages/ucenter/bingphone/bingphone',
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            } else {
              wx.navigateTo({
                url: '../shopping/checkout/checkout',
              })
            }
          });
        }
      });
  },
  checkpower(e) {
    var that = this
    console.log(e)
    let typea = e.currentTarget.dataset.type
    console.log(typea)
    that.setData({
      typec: typea
    })
    wx.showLoading({
      title: '检测授权...',
      mask: true,
    })
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
              user.loginByWeixin().then(res => {
                console.log(res)
                wx.hideLoading()
                that.showModal()
              }).catch(res => {
                console.log(res)
              })
            }
          })
        } else {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/AwxChageUserInfoGet/wxChageUserInfoGet?route=' + that.data.route + "&data=" + that.data.goods.id,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      }
    })
    // user.loginByWeixin().then(res => {  
    //   console.log(that.data.typec)
    //   that.showModal()
    //   app.globalData.userInfo = res.data.userInfo;
    //   app.globalData.token = res.data.token;
    //   wx.hideLoading()
    // }).catch((err) => {
    //   console.log(err)
    //   wx.showModal({
    //     title: '警告!',
    //     content: '拒绝授权会导致未知问题，点击确定重新获取权限！',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.openSetting({
    //           success: function (res) {
    //             console.log(res)
    //             if (res.authSetting["scope.userInfo"]) {
    //               console.log("已授权")
    //                wx.hideLoading()
    //                that.showModal()
    //             }
    //           },
    //           fail: function (res) { },
    //           complete: function (res) { },
    //         })
    //       } else if (res.cancel) {
    //         // console.log('用户点击取消')
    //       }
    //     }
    //   })
    // });
  },
  collect() {
    var that = this;
    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        title: '选择完整规格！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    console.log(checkedProduct)
    if (!this.data.checkgoodsprice || this.data.checkgoodsprice.length <= 0) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '没有库存！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }

    //验证库存
    if (this.data.checkgoodsprice.goods_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '库存不足！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    util.request(api.BingPhoneFind).then(function (res) {
      console.log(res)
      if (res.data.Result.mobile == "") {
        wx.navigateTo({
          url: '/pages/ucenter/bingphone/bingphone',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      } else {
        // console.log(this.data.checkgoodsprice)
        wx.showModal({
          title: '提示',
          content: '规格选择后无法更改（谨慎操作！）',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/collagecheckout/collagecheckout?collageid=' + that.data.collage[0].id + "&goodsid=" + that.data.goods.id + "&skuid=" + that.data.checkgoodsprice.id + "&skuvalue=" + that.data.checkedSpecText,
                success: function (res) { },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    });

  },
  onReady: function () {
    // 页面渲染完成

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
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    }
  },
  closeAttrOrCollect: function () {
    let that = this;
    wx.showLoading({
      title: '登录检测...',
      mask: true
    })
    wx.getSetting({
      success: function (res) {
        wx.hideLoading()
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              //用户已经授权过
              // that.setData({
              //   auth: true
              // })
              util.request(api.CollectAddOrDelete, { typeId: 0, valueId: that.data.id }, "POST")
                .then(function (res) {
                  let _res = res;
                  wx.hideLoading()
                  if (_res.errno == 0) {
                    if (_res.data.type == 'add') {
                      that.setData({
                        'collectBackImage': that.data.hasCollectImage
                      });
                      wx.showToast({
                        title: '收藏成功！',
                        icon: 'success',
                        image: '',
                        duration: 1000,
                        mask: true,
                      })
                    } else {
                      wx.showToast({
                        title: '取消收藏！',
                        icon: 'loading',
                        image: '',
                        duration: 500,
                        mask: true,
                      })
                      that.setData({
                        'collectBackImage': that.data.noCollectImage
                      });
                    }

                  } else {

                    wx.showToast({
                      image: '/static/images/icon_error.png',
                      title: _res.errmsg,
                      mask: true
                    });
                  }
                })
            }
          })
        } else {
          // that.setData({
          //   auth: false
          // })
          wx.showToast({
            title: '未授权！请在“我的”页点击头像授权!',
            icon: 'none',
            duration: 2000,
            mask: true,
          })
        }
      }
    })
    // user.loginByWeixin().then(res => {
    //   app.globalData.userInfo = res.data.userInfo;
    //   app.globalData.token = res.data.token;
    //   util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
    //     .then(function (res) {
    //       let _res = res;
    //       wx.hideLoading()
    //       if (_res.errno == 0) {
    //         if (_res.data.type == 'add') {
    //           that.setData({
    //             'collectBackImage': that.data.hasCollectImage
    //           });
    //           wx.showToast({
    //             title: '收藏成功！',
    //             icon: 'success',
    //             image: '',
    //             duration: 1000,
    //             mask: true,
    //           })
    //         } else {
    //           wx.showToast({
    //             title: '取消收藏！',
    //             icon: 'loading',
    //             image: '',
    //             duration: 500,
    //             mask: true,
    //           })
    //           that.setData({
    //             'collectBackImage': that.data.noCollectImage
    //           });
    //         }

    //       } else {

    //         wx.showToast({
    //           image: '/static/images/icon_error.png',
    //           title: _res.errmsg,
    //           mask: true
    //         });
    // }

    // });
    // }).catch((err) => {
    //   console.log(err)
    //   wx.showModal({
    //     title: '警告!',
    //     content: '拒绝授权会导致未知问题，点击确定重新获取权限！',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.openSetting({
    //           success: function (res) {
    //             console.log(res)
    //             if (res.authSetting["scope.userInfo"]) {
    //               console.log("已授权")
    //               // this.againmoty()
    //               // that.data.cartGoods = []
    //               // that.data.cartTotal = []
    //               // util.request(api.CartList).then(function (res) {
    //               //   if (res.errno === 0) {
    //               //     console.log(res.data);
    //               //     that.setData({
    //               //       cartGoods: res.data.cartList,
    //               //       cartTotal: res.data.cartTotal
    //               //     });
    //               //   }

    //               //   that.setData({
    //               //     checkedAllStatus: that.isCheckedAll()
    //               //   });
    //               // });
    //             }
    //           },
    //           fail: function (res) { },
    //           complete: function (res) { },
    //         })
    //       } else if (res.cancel) {
    //         // console.log('用户点击取消')
    //       }
    // }
    // })
    // });

    // }

  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },
  addToCart: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    // if (this.data.openAttr == false) {
    //   //打开规格选择窗口
    //   this.setData({
    //     openAttr: !this.data.openAttr,
    //     collectBackImage: "/static/images/detail_back.png"
    //   });
    // } else {

    //提示选择完整规格
    if (!this.isCheckedAllSpec()) {
      wx.showToast({
        title: '选择完整规格！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }

    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    console.log()
    if (!this.data.checkgoodsprice || this.data.checkgoodsprice.length <= 0) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '没有库存！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }

    //验证库存
    if (this.data.checkgoodsprice.goods_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      wx.showToast({
        title: '库存不足！',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    // user.loginByWeixin().then(res => {
    //   app.globalData.userInfo = res.data.userInfo;
    //   app.globalData.token = res.data.token;
    util.request(api.CartAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: this.data.checkgoodsprice.id }, "POST")
      .then(function (res) {
        let _res = res;
        if (_res.errno == 0) {
          wx.showToast({
            title: '添加成功'
          });
          that.hideModal()
          that.setData({
            // openAttr: !that.data.openAttr,
            cartGoodsCount: _res.data.cartTotal.goodsCount
          });
          if (that.data.userHasCollect == 1) {
            that.setData({
              'collectBackImage': that.data.hasCollectImage
            });
          } else {
            that.setData({
              'collectBackImage': that.data.noCollectImage
            });
          }
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.errmsg,
            mask: true
          });
        }

      });
    // }).catch((err) => {
    //   console.log(err)
    //   wx.showModal({
    //     title: '警告!',
    //     content: '拒绝授权会导致未知问题，点击确定重新获取权限！',
    //     success: function (res) {
    //       if (res.confirm) {
    //         wx.openSetting({
    //           success: function (res) {
    //             console.log(res)
    //             if (res.authSetting["scope.userInfo"]) {
    //               console.log("已授权")

    //             }
    //           },
    //           fail: function (res) { },
    //           complete: function (res) { },
    //         })
    //       } else if (res.cancel) {
    //         // console.log('用户点击取消')
    //       }
    //     }
    //   })
    // });
    // }

  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  toindex() {
    wx.switchTab({
      url: '/pages/index/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  canelCart() {
    this.hideModal()
  }
})