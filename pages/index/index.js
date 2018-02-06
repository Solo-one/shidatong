//index.js
var base = require('../../config')
//获取应用实例
var app = getApp()
Page({
  data: {
    timeArr: [],
    notices: [],
    time: '',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {},
    grids: ["注册绑定", '通知公告', '请假办事', '通讯录'],
    gridsImg: ["/images/register.png", "/images/gonggao.png", "/images/qingjia.png", "/images/tongxunlu.png"]
  },
  onLoad: function () {
    // 关闭调试
    // wx.setEnableDebug({
    //   enableDebug: false
    // })
    var that = this
    wx.request({
      url: base.noticeNews,
      data: {

      },
      success: function (res) {
        var json3 = res.data
        var tmpArr = []
        for (var i = 0, len = json3.length; i < len; i++) {
          tmpArr.push(json3[i].publishTime)
        }
        that.setData({
          notices: res.data,
          timeArr: tmpArr,
          time: tmpArr[0]
        })
      }
    })

  },
  changeSwiper: function (e) {
    var index = e.detail.current;
    this.setData({
      time: this.data.timeArr[index]
    })
  },
  playTap: function (e) {
    const dataset = e.currentTarget.dataset;
    if (dataset.id == '注册绑定') {
      wx.navigateTo({
        url: `../renzheng/renzheng?id=${dataset.id}`
      })
      return;
    }
    var status = app.globalData.status;
    switch (status) {
      case -1:
        wx.showLoading({
          title: '加载中',
        })
        app.doLogin(function (status) {
          if (status == 0) {
            wx.showModal({
              title: dataset.id,
              content: '请先完成注册绑定',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `../renzheng/renzheng`
                  })
                } else if (res.cancel) {

                }
              }
            })
            wx.hideLoading()
          } else if (status == 1) {
            if (dataset.id == '通知公告') {
              wx.navigateTo({
                url: `../notice/notice?id=${dataset.id}`
              })
              return;
            } else if (dataset.id == '通讯录') {
              wx.navigateTo({
                url: `../contacts/contacts?id=${dataset.id}`
              })
              return;
            } else {
              wx.showModal({
                title: dataset.id,
                content: '暂缓开通',
                success: function (res) {
                  if (res.confirm) {

                  } else if (res.cancel) {

                  }
                }
              })
            }
          }
        })
        break;
      case 0:
        wx.showModal({
          title: dataset.id,
          content: '请先完成注册绑定',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `../renzheng/renzheng`
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 1:
        if (dataset.id == '通知公告') {
          wx.navigateTo({
            url: `../notice/notice?id=${dataset.id}`
          })
          return;
        } else if (dataset.id == '通讯录') {
          wx.navigateTo({
            url: `../contacts/contacts?id=${dataset.id}`
          })
          return;
        } else {
          wx.showModal({
            title: dataset.id,
            content: '暂缓开通',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })
        }
        break;
      default:
        break;
    }
  },
  playTapNews: function (e) {
    const dataset = e.currentTarget.dataset;
    var status = app.globalData.status;
    switch (status) {
      case -1:
        wx.showLoading({
          title: '加载中',
        })
        app.doLogin(function (status) {
          if (status == 0) {
            wx.showModal({
              title: "提示",
              content: '请先完成注册绑定',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `../renzheng/renzheng`
                  })
                } else if (res.cancel) {

                }
              }
            })
            wx.hideLoading()
          } else if (status == 1) {
            wx.navigateTo({
              url: `../noticedetial/noticedetial?id=${dataset.id}&purpose=index`
            })
          }
        })
        break;
      case 0:
        wx.showModal({
          title: "提示",
          content: '请先完成注册绑定',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `../renzheng/renzheng`
              })
            } else if (res.cancel) {

            }
          }
        })
        break;
      case 1:
        wx.navigateTo({
          url: `../noticedetial/noticedetial?id=${dataset.id}&purpose=index`
        })
        break;
      default:
        break;
    }
  }
})
