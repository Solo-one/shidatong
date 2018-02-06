//index.js
var base = require('../../config')
//获取应用实例
const app = getApp()

Page({
  data: {
    receipts: [],
    pnum: 0
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
      title: "回执统计"
    })
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: base.getReceiptList,
      data: {
        'nId': options.id
      },
      success: function (res) {
        var total = 0;
        if (res.data.length == 0) {
          total = 0
        } else {
          total = res.data[0].receiptAll
        }
        wx.hideLoading()
        that.setData({
          receipts: res.data,
          pnum: total
        })
      }
    })

  }
})
