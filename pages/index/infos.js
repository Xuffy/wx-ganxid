// pages/index/infos.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.http('/IBusiness/getbusinessinfobyid', { businessid: options.id })
      .then(data => {
        this.setData({
          info: data
        });
      });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },


  previewImage(e) {
    var list = [];
    for (var i = 0; i < this.data.info.businessadslist.length; i++) {
      list.push(this.data.info.businessadslist[i].imgs);
    }
    wx.previewImage({
      current: e.target.id, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  }
})