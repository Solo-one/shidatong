//index.js
var base = require('../../config')
//获取应用实例
var app = getApp()
Page({
  data: {
    noticeTitle: '',
    noticeContent: '',
    gridsImg: ["/images/suonuetu.png"]
  },
  onLoad: function () {
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: "发布公告"
    })
  },
  onReady: function () {

  },
  addImageTap: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //var tempFilePaths = res.tempFilePaths;
        that.setData({
          gridsImg: res.tempFilePaths
        });
      }
    })
  },
  submitTap: function (e) {
    var that = this;
    if (e.detail.value.noticeTitle.length == 0 ||
      e.detail.value.noticeContent.length == 0) {
      wx.showModal({
        title: '提示',
        content: '所填项不能为空！',
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
      return;
    }


    that.setData({
      noticeTitle: e.detail.value.noticeTitle,
      noticeContent: e.detail.value.noticeContent
    })
    var timestamp = Date.parse(new Date());
    var images = that.data.gridsImg;
    var publishId = app.globalData.openId + '_' + timestamp;
    if (images[0] == '/images/suonuetu.png') {
      images = []
    }
    wx.request({
      url: base.addPublish,
      method: 'POST',
      data: {
        id: publishId,
        openId: app.globalData.openId,
        classId: app.globalData.userJson.classId,
        number: app.globalData.userJson.number,
        title: that.data.noticeTitle,
        content: that.data.noticeContent,
        imageNum: images.length
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {

      },
      fail: function (res) {
        wx.showToast({
          title: '表单提交失败',
          icon: 'success',
          duration: 2000
        })
      }
    })

    if (images.length == 0 || images[0] == '/images/suonuetu.png') {
      wx.redirectTo({
        url: `../noticedetial/noticedetial?id=${publishId}`
      })
      return;
    }
    var upnum = 0;
    for (var i = 0, len = images.length; i < len; i++) {
      wx.uploadFile({
        url: base.uploadImageUrl,
        filePath: images[i],
        name: 'file',
        header: { "Content-Type": "multipart/form-data" },
        formData: {
          publishId: publishId,
          num: i
        },
        success: function (res) {
          var data = res.data
          upnum++;
          //do something  
          if (upnum == images.length) {
            wx.redirectTo({
              url: `../noticedetial/noticedetial?id=${publishId}`
            })
          }
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        },
        fail: function (res) {
          wx.showToast({
            title: '发布失败',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideLoading()
          }, 1000)
        }
      })

      if (upnum == images.length) {

      }

      wx.showLoading({
        title: '提交中',
      })
    }

  }
})
