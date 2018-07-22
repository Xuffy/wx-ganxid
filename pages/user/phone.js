// pages/user/phone.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    userPhone: '',
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
    this.setData({ info: app.globalData.userInfo });
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

  inputPhone(e) {
    this.setData({ userPhone: e.detail.value });
  },

  bindPhone(e) {
    if (this.data.userPhone.length < 11){
      return wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    }

    app.http('/IUser/editUserinfo', { openid: this.data.info.openid, phone: this.data.userPhone, code: 123 })
      .then(res => {
        // this.getUserInfo();
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000, 
          complete(){
            setTimeout(()=>{
              wx.navigateBack({
                delta: 1
              })
            },1000);
          }
        });
      });
  },

  getUserInfo() {
    app.http('/IUser/getaccountinfo', { openid: app.globalData.userInfo.openid })
      .then(res => {
        app.globalData.userInfo = res;
      });
  }
})