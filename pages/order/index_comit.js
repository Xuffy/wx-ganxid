// pages/order/index_comit.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    info: {},
    points: 5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ query: options });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.getOrderInfo(this.data.query.sn);
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

  submit() {
    app.http('/Iorder/addevaluate', {
      openid: app.globalData.userInfo.openid,
      sn: this.data.info.sn,
      points: this.data.points
    }).then(()=>{
      wx.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 1000,
        complete() {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }
      });
    });
  },

  getOrderInfo(sn) {
    app.http('/Iorder/getorderinfo', { sn }).then(res => {
      this.setData({ info: res });
    });
  },

  changePoints(e) {
    this.setData({ points: parseInt(e.target.id) });
  }
})