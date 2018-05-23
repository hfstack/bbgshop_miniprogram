/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录
 */
function payOrder(orderId) {
  console.log(orderId)
  return new Promise(function (resolve, reject) {
    util.request(api.PayPrepayId, {
      orderId: orderId
    }).then((res) => {
      console.log(res)
      wx.hideLoading()
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}
function payCollageOrder(orderId) {
  console.log(orderId)
  return new Promise(function (resolve, reject) {
    util.request(api.PrepayCollage, {
      orderId: orderId
    }).then((res) => {
      console.log(res)
      wx.hideLoading()
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            resolve(res);
          },
          'fail': function (res) {
            reject(res);
          },
          'complete': function (res) {
            reject(res);
          }
        });
      } else {
        reject(res);
      }
    });
  });
}

// function payOrder(orderId) {
//   console.log(orderId)
//   return new Promise(function (resolve, reject) {
//     util.request(api.PayCollageUserOrder, {
//       orderId: orderId
//     }).then((res) => {
//       console.log(res)
//       wx.hideLoading()
//       if (res.errno === 0) {
//         const payParam = res.data;
//         wx.requestPayment({
//           'timeStamp': payParam.timeStamp,
//           'nonceStr': payParam.nonceStr,
//           'package': payParam.package,
//           'signType': payParam.signType,
//           'paySign': payParam.paySign,
//           'success': function (res) {
//             resolve(res);
//           },
//           'fail': function (res) {
//             reject(res);
//           },
//           'complete': function (res) {
//             reject(res);
//           }
//         });
//       } else {
//         reject(res);
//       }
//     });
//   });
// }



module.exports = {
  payOrder,
  payCollageOrder,
  // payUserCollageOrder,
};











