//app.js
const openIds = require('./config').openIds
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var self = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.doLogin(null);
  },
  onShow: function (options) {
    console.log(options.scene)
    var self = this
    self.globalData.scene = options.scene
  },
  doLogin: function (cb) {
    var self = this
    //调用登录接口
    wx.login({
      success: function (data) {
        wx.request({
          url: openIds,
          data: {
            code: data.code
          },
          success: function (res) {
            self.globalData.openId = res.data[0].openId;
            self.globalData.status = res.data[0].status;
            self.globalData.userJson = res.data[0];
            self.globalData.userJsonArr = res.data;
            console.log(res.data)
            if (cb != null) {
              cb(self.globalData.status)
            }

          },
          fail: function (res) {
            console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
            if (cb != null) {
              cb(res)
            }

          }
        })
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        if (cb != null) {
          cb(res)
        }
      }
    })

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        withCredentials: false,
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })

    }
  },
  globalData: {
    userInfo: null,//用户简明信息（微信头像，微信昵称）
    status: -1, //登陆状态值
    openId: null, //微信用户openid
    userJson: null,//用户详情信息 （师达园注册信息）
    userJsonArr:[],
    scene:1001 //场景值
  }
})