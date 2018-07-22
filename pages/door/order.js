// pages/door/order.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getDataList();
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

  },

  getDataList() {
    app.http('/Iorder/getMorderlist', { openid: app.globalData.userInfo.openid, status: 'all' })
      .then(res => {
        this.setData({ dataList: res });
      });
  },

  agreeOrder(e) {
    wx.showModal({
      title: '提示',
      content: `是否确认接单？`,
      success: res => {
        if (res.confirm) {
          app.http('/Iorder/agreeorderstatus', {
            openid: app.globalData.userInfo.openid,
            sn: e.target.id
          }).then(() => {
            this.getDataList();
          });
        }
      }
    })
  },

  cancelOrder(e) {
    wx.showModal({
      title: '提示',
      content: `是否确认拒绝订单？`,
      success: res => {
        if (res.confirm) {
          app.http('/Iorder/noagreeorderstatus', {
            openid: app.globalData.userInfo.openid,
            sn: e.target.id
          }).then(() => {
            this.getDataList();
          });
        }
      }
    })
  },

  completeOrder(e) {
    wx.showModal({
      title: '提示',
      content: `是否确认订单完成？`,
      success: res => {
        if (res.confirm) {
          app.http('/Iorder/commitorder', {
            openid: app.globalData.userInfo.openid,
            sn: e.target.id
          }).then(() => {
            this.getDataList();
          });
        }
      }
    })
  },
})