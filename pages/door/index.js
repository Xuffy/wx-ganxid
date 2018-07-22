// pages/door/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoList: [],
    imageList: [],
    info: {},
    startTime: '',
    endTime: '',
    region: ['', '', ''],
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
    this.getInfo();
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

  getInfo() {
    app.http('/IBusiness/getbusinessinfobyopenid', { openid: app.globalData.userInfo.openid })
      .then(res => {
        var imgs = [];
        if (res.businessadslist) {
          for (var i = 0; i < res.businessadslist.length; i++) {
            var item = res.businessadslist[i];
            imgs.push({ id: item.id, url: item.imgs });
          }
        }

        this.setData({
          logoList: [{ imgpath: res.business_logo }],
          imageList: imgs,
          info: res,
          startTime: res.begintime || '',
          endTime: res.endtime || '',
          region: [res.business_provinceid || '北京市', res.business_cityid || '北京市', res.business_countyid || '东城区']
        });
      });
  },

  startTimeChange(e) {
    this.data.info.begintime = e.detail.value || '';
    this.setData({ startTime: e.detail.value || '' });
  },

  endTimeChange(e) {
    this.data.info.endtime = e.detail.value || '';
    this.setData({ endTime: e.detail.value || '' });
  },


  regionChange(e) {
    this.data.info.business_provinceid = e.detail.value[0];
    this.data.info.business_cityid = e.detail.value[1];
    this.data.info.business_address = e.detail.value[2];
    this.setData({ region: e.detail.value });
  },

  deleteImage(e) {
    wx.showModal({
      title: '提示',
      content: `是否确认删除门店照片？`,
      success: res => {
        if (res.confirm) {
          var arr = [];
          for (var i = 0; i < this.data.imageList.length; i++) {
            if (i !== parseInt(e.currentTarget.id)) {
              arr.push(this.data.imageList[i]);
            } else {
              if (this.data.imageList[i] && this.data.imageList[i].id) {
                app.http('/IBusiness/delbusinessbanner', {
                  businessbannerid: this.data.imageList[i].id,
                  openid: app.globalData.userInfo.openid
                });
              }
            }
          }
          this.setData({ imageList: arr });
        }
      }
    })
  },

  uploadLogo() {
    wx.chooseImage({
      count: 1,
      success: res => {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: 'https://water.ulittile.com/Home/IPublic/uploadimgbyisream', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: { type: 1 },
          success: res => {
            var data = JSON.parse(res.data).result;

            this.setData({ logoList: data });
          }
        })
      }
    })
  },

  uploadImage() {
    wx.chooseImage({
      success: res => {

        for (var i = 0; i < res.tempFilePaths.length; i++) {
          wx.uploadFile({
            url: 'https://water.ulittile.com/Home/IPublic/uploadimgbyisream', //仅为示例，非真实的接口地址
            filePath: res.tempFilePaths[i],
            name: 'file',
            formData: { type: 2 },
            success: res => {
              var data = JSON.parse(res.data).result;
              var list = this.data.imageList || [];
              for (var i = 0; i < data.length; i++) {
                list.push({ url: data[i].imgpath });
              }
              this.setData({ imageList: list });
            }
          })
        }
      }
    })
  },

  inputChange(e) {
    this.data.info[e.target.id] = e.detail.value;
  },

  submit() {
    var str = ''
      , params = null
      , bannerList = []
      , { business_name, tel, business_provinceid, business_cityid, business_countyid, business_address, begintime, endtime } = this.data.info;

    if (!business_name) {
      str = '请输入店铺名称';
    } else if (!tel) {
      str = '请输入联系电话';
    } else if (!business_provinceid || !business_cityid) {
      str = '请选择店铺区域';
    } else if (!business_address) {
      str = '请输入详细地址';
    } else if (!begintime) {
      str = '请选择开始营业时间';
    } else if (!endtime) {
      str = '请选择结束营业时间';
    } else if (this.data.imageList.length > 5) {
      str = '门店照片最多上传5张';
    }

    if (str) {
      return wx.showToast({
        title: str,
        icon: 'none',
        duration: 1000
      })
    }
    params = { business_name, tel, business_provinceid, business_cityid, business_countyid, business_address, begintime, endtime };

    if (this.data.logoList[0]) {
      params.business_logo = this.data.logoList[0].imgpath;
    }

    for (var i = 0; i < this.data.imageList.length; i++) {
      var item = this.data.imageList[i];
      item && item.url && bannerList.push(item.url);
    }
    params.bannerimg = bannerList;
    params.openid = app.globalData.userInfo.openid;
    console.log(params)
    app.http('/IBusiness/updatamybusinessinfo', params).then(res => {
      wx.showToast({
        title: '更新成功',
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
  }
})