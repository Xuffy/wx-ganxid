//index.js
const app = getApp();
var amapFile = require('../../libs/amap-wx.js');

Page({

  data: {
    dataList: [],
    bannerList: [],
    markers: [],
    listype: 1,
    longitude: 0,
    latitude: 0,
  },

  onLoad: function () {

  },

  onShow: function () {

    var _this = this;
    // var myAmapFun = new amapFile.AMapWX({ key: app.globalData.amap });
    // myAmapFun.getPoiAround({
    //   success: function (data) {
    //     console.log(data);
    //   },
    //   fail: function (info) {
    //     // console.log(info)
    //   }
    // })

    wx.login({
      success(loginRes) {
        _this.authorization(loginRes.code).then(res => {
          // res.openid = 'oXe1B1LR9yIvSyS8U2r21p0HA4J1';
          _this.login(res)
        });
      }
    });

    wx.getLocation({
      complete: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        _this.getIndexList(res.longitude, res.latitude);
        // _this.getIndexList();
      },
    });

  },

  clickMap(e) {
    wx.navigateTo({
      url: `/pages/index/infos?id=${e.markerId}`
    })
  },

  getIndexList(xlng, ylat) {
    app.http('/ILogin/index', { xlng: xlng || '', ylat: ylat || '' })
      .then(data => {
        var list = data.businesslist || []
          , mkList = [];

        for (var i = 0; i < list.length; i++) {
          mkList.push({
            id: list[i].business_id,
            // latitude: 30.57447 + i || list[i].ylat,
            // longitude: 103.92377 + i || list[i].xlng,
            latitude: list[i].ylat,
            longitude: list[i].xlng,
            width: 30,
            height: 30,
            callout: {
              content: list[i].business_name,
              // x: -35,
              // y: -45,
              padding: 10,
              bgColor: '#FF0000',
              borderColor: '#D3D3D3',
              color: '#ffffff',
              borderRadius: 10
            }
          });
        }

        this.setData({
          dataList: list,
          bannerList: data.bannerlist,
          markers: mkList
        });
      });
  },

  authorization(code) {
    return app.http('', {
      appid: app.globalData.app_id,
      secret: app.globalData.secret_code,
      js_code: code,
      grant_type: 'authorization_code'
    }, { method: 'get', baseUrl: 'https://api.weixin.qq.com/sns/jscode2session' })
      .then(res => {
        res.code = code;
        return res;
      });
  },

  login(params) {
    wx.getUserInfo({
      success: function (res) {
        var userInfo = res.userInfo;
        app.http('/ILogin/login', { nickName: userInfo.nickName, avatarUrl: userInfo.avatarUrl, code: params.code, openid: params.openid })
          .then(data => {
            app.globalData.userInfo = data;
          });
      }
    })
  },
  ////////////////////////////////////////////

  changeType: function (e) {
    var _this = this;
    _this.setData({ listype: e.currentTarget.id });
  },


})
