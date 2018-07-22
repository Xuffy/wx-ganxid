// pages/order/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listype: 'all',
    dataList: [],
    query: {},
  },

  getOrderList(type) {
    app.http('/Iorder/getorderlist', { status: type, openid: app.globalData.userInfo.openid })
      .then(res => {
        this.setData({ dataList: res });
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderList(this.data.query.type || this.data.listype);
  },

  changeType(e) {
    this.getOrderList(e.target.id);
    this.setData({ listype: e.target.id });
  },

  cancelOrder(e) {
    wx.showModal({
      title: '提示',
      content: `是否确认取消订单？`,
      success: res => {
        if (res.confirm) {
          app.http('/Iorder/changeorderstatus', {
            openid: app.globalData.userInfo.openid,
            sn: e.target.id
          }).then(() => {
            this.getOrderList(this.data.listype);
          });
        }
      }
    })
  }

})