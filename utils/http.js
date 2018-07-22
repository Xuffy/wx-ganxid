
const qs = require('./qs/index.js');

const http = (url, data, options = {}) => {
  var promise = new Promise((resolve, reject) => {

    var baseUrl = options.baseUrl || 'https://water.ulittile.com/Home';

    wx.request({
      url: `${baseUrl}${url}`,
      data: options.method ? data : qs.stringify(data),
      method: options.method || 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {//服务器返回数据
        if (options.baseUrl) {
          resolve(res.data);
        } else {
          if (res.data.status === 200) {
            resolve(res.data.result);
          } else {//返回错误提示信息
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            });
            reject(res.data.msg);
          }
        }


      },
      error: function (e) {
        wx.showToast({
          title: '网络繁忙，请稍后重试',
          icon: 'none',
          duration: 1000
        });
        reject('网络繁忙，请稍后重试');
      }
    })
  });
  return promise;
};

module.exports = http
