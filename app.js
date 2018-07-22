//app.js

var http = require('./utils/http.js');
const qs = require('./utils/qs/index.js');

App({
  globalData: {
    userInfo: null,
    app_id:'wx08a38213ed571ba2',
    secret_code:'3f1e262f4b6d67ea12bd11388181fda7',
    amap: "52db7efabd38995067e0df043dd96654",
  },
  onLaunch: function () {
    
  },
  http,
  qs
})