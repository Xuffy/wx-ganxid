// pages/order/preview.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    addrInfo: null,
    dateTime: '',
    startTime: '',
    queryString: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ startTime: this.getNowFormatDate(), dateTime: this.getNowFormatDate(), queryString: options });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo(this.data.queryString);
  },

  /////////////////////////
  getInfo(options) {
    app.http('/Iorder/addorderindex',
      { openid: app.globalData.userInfo.openid, businessid: options.id, type: options.type })
      .then(res => {
        this.setData({
          info: res.businessinfo,
          addrInfo: res.addrlist[0] || null
        });
      });
  },
  dateTimeChange(e) {
    this.setData({ dateTime: e.detail.value });
  },

  submitOrder() {
    if (!this.data.addrInfo){
      return wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 1000
      })
    }
    wx.showModal({
      title: '提示',
      content: `是否确认预约时间为 ${this.data.dateTime} ？`,
      success: res => {
        if (res.confirm) {
          app.http('/Iorder/addorder', {
            businessid: this.data.info.business_id,
            openid: app.globalData.userInfo.openid,
            type: this.data.queryString.type,
            dotime: this.data.dateTime,
            addrid: this.data.addrInfo.id
          }).then((res) => {
            wx.navigateTo({
              url: `/pages/order/prisucc?id=${res}`,
            })
          });
        }
      }
    })

  },

  getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }
})