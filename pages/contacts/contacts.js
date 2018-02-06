//index.js
var base = require('../../config')
//获取应用实例
const app = getApp()

Page({
  data: {
    contacts: [],
    pnum: 0,
    classId: ''
  },
  onLoad: function (options) {
    var that = this;
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: options.id
    })
    wx.showLoading({
      title: '加载中',
    })

    wx.request({
      url: base.contacts,
      data: {
        classId: app.globalData.userJson.classId
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          contacts: res.data,
          pnum: res.data.length,
          classId: res.data[0].classId
        })
      }
    })

  },
  playTap:function(e){
    const dataset = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: dataset.id 
    })
  }
})
