// pages/user/addr_add.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    userPhone: '',
    userAddr: '',
    addrStatus: true,
    city: [],
    county: [],
    province: [],
    regionValue: [],
    value: [9999, 0, 0],
    query: {},
    region: ['北京市', '北京市', '东城区'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({ query: options });
    if (options.id) {
      this.getAddressInfo(options.id);
    }

    this.getRegionsList();
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

  getRegionsList() {
    var provinceList = wx.getStorageSync('provinceList');

    if (provinceList) {
      this.changeRegion([0, 0, 0]);
    } else {
      app.http('/IAccAddr/getcountrymsg').then(res => {
        wx.setStorageSync('provinceList', res);
      });
    }
  },

  getAddressInfo(id) {
    app.http('/IAccAddr/getinfobyid', { id }).then(res => {
      this.setData({
        userName: res.name,
        userPhone: res.phone,
        userAddr: res.street,
        addrStatus: res.status === '1',
        region: [res.province, res.city, res.label],
      });
    });
  },

  submitAddress() {
    var str = '';
    if (!this.data.userName) {
      str = '请填写姓名';
    } else if (!this.data.userPhone) {
      str = '请输入手机号';
    } else if (this.data.userPhone < 11) {
      str = '请输入正确的手机号';
    } else if (!this.data.userAddr) {
      str = '请输入详细地址';
    }

    if (str) {
      return wx.showToast({
        title: str,
        icon: 'none',
        duration: 1000
      })
    }

    app.http(this.data.query.id ? '/Comm/upAddrs' : '/Comm/opAddrs', {
      ids: this.data.query.id || '',
      openid: app.globalData.userInfo.openid,
      name: this.data.userName,
      phone: this.data.userPhone,
      province: this.data.region[0],
      city: this.data.region[1],
      label: this.data.region[2],
      street: this.data.userAddr,
      status: this.data.addrStatus ? '1' : '0'
    }).then(res => {
      wx.showToast({
        title: '操作成功',
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
  inputChange(e) {
    // var json = {};
    // json[e.target.dataset.key] = e.detail.value;
    // this.setData(json);
    this.data[e.target.dataset.key] = e.detail.value;
  },

  bindChange: function (e) {
    const val = e.detail.value;
    this.changeRegion(val);
  },

  changeRegion(value) {
    var provinceList = wx.getStorageSync('provinceList')
      , provinceIndex = value[0]
      , cityIndex = value[1]
      , countyIndex = value[2]
      , city = []
      , county = [];

    for (var i = 0; i < provinceList.city.length; i++) {
      var item = provinceList.city[i];
      if (provinceList.province[provinceIndex] && provinceList.province[provinceIndex].id === item.parent) {
        city.push(item);
      }
    }

    for (var i = 0; i < provinceList.county.length; i++) {
      var item = provinceList.county[i];
      if (city[cityIndex] && city[cityIndex].id === item.parent) {
        county.push(item);
      }
    }

    this.setData({
      city: city,
      county: county,
      province: provinceList.province,
      regionValue: [provinceList.province[provinceIndex], city[cityIndex], county[countyIndex]]
    });

  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  }

})