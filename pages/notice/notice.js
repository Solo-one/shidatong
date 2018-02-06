//index.js
var base = require('../../config')
//获取应用实例
const app = getApp()

Page({
  data: {
    notices: [],
    search:''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: options.id
    })
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: base.getNoticeList,
      data: {
        'classId': app.globalData.userJson.classId
      },
      success: function (res) {
        that.setData({
          notices: res.data
        })
      }
    })
  },
  playTap: function (e) {
    const dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../noticedetial/noticedetial?id=${dataset.id}`
    })
  },
  publishTap: function () {
    wx.navigateTo({
      url: `../publish/publish`
    })
  },
  searchTap: function () {
    var that = this;
    wx.request({
      url: base.searchNotice,
      data: {
        search: this.data.search,
        classId: app.globalData.userJson.classId
      },
      success: function (res) {
        that.setData({
          notices: res.data
        })
      }
    })
  },
  inputSearch: function (e) {
    this.setData({
      search: e.detail.value
    })
  },
})
