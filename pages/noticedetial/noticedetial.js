const base = require('../../config')
//获取应用实例
const app = getApp()

Page({
  data: {
    gridsImg: [],
    noticeid: '',
    title: '',
    content: '',
    time: '',
    person: '',
    imagesArr: [],
    reFlag: false,
    showView: false,
    imageTitle: '',
    imageShow: true,
    deleteflag: false,
    noticeExist: true,
    purpose: true,
  },
  onLoad: function (options) {
    // 页面渲染完成
    var that = this;
    wx.setNavigationBarTitle({
      title: "公告详情"
    })
    if (options.purpose == "index") {
      this.data.purpose = false;
    }
    this.setData({
      noticeid: options.id,
      purpose: this.data.purpose
    })

    wx.showLoading({
      title: '加载中',
    })
    var status = app.globalData.status;
    switch (status) {
      case -1:
        app.doLogin(function (status) {
          if (status == 0) {
            that.setData({
              showView: false
            })
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '您还没有注册绑定呢，点击确认注册。',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: `../renzheng/renzheng?id=注册绑定`
                  })
                } else if (res.cancel) {
                }
              }
            })
          } else if (status == 1) {
            // 是否回执
            wx.request({
              url: base.receiptFlag,
              data: {
                noticeid: that.data.noticeid,
                openId: app.globalData.openId,
                classId: app.globalData.userJson.classId,
                number: app.globalData.userJson.number
              },
              success: function (res) {
                var flag = res.data;
                that.setData({
                  reFlag: flag
                })
              }
            })
            // 显示公告详情
            wx.request({
              url: base.getNoticeOne,
              data: {
                'noticeid': that.data.noticeid
              },
              success: function (res) {
                var notice = res.data;
                if (notice == "") {
                  that.setData({
                    noticeExist: false
                  })
                  wx.hideLoading()
                  return;
                }

                if (notice.openId == app.globalData.openId) {
                  that.setData({
                    deleteflag: true
                  })
                }

                console.log("回话方式进入小程序" + notice.classId)
                if (notice.classId != app.globalData.userJson.classId) {
                  that.setData({
                    purpose: false
                  })
                }

                that.setData({
                  showView: true
                })
                var baseImageUrl = notice.imageBase;
                var num = notice.imageNum;
                var arr = [];
                if (num == 0) {
                  that.setData({
                    imageShow: false
                  })
                } else {
                  that.setData({
                    imageShow: true
                  })
                  for (var i = 0; i < num; i++) {
                    arr.push(base.getImages + baseImageUrl + i + ".jpg")
                  }
                }

                wx.hideLoading()
                that.setData({
                  title: notice.title,
                  time: '发布时间：' + notice.publishTime,
                  content: notice.content,
                  gridsImg: arr,
                  person: '发布人：' + notice.name + " / " + notice.related,
                  imageTitle: '公告图片：'
                })

              }
            })

          }
        })
        break;
      case 0:
        break;
      case 1:
        wx.request({
          url: base.receiptFlag,
          data: {
            noticeid: options.id,
            openId: app.globalData.openId,
            classId: app.globalData.userJson.classId,
            number: app.globalData.userJson.number
          },
          success: function (res) {
            var flag = res.data;
            that.setData({
              reFlag: flag
            })
          }
        })
        var scene = app.globalData.scene
        if (scene == 1007 || scene == 1008) {
          wx.showLoading({
            title: '加载中',
          })
          app.doLogin(function (status) {
            if (status == 0) {
              that.setData({
                showView: false
              })
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '您还没有注册绑定呢，点击确认注册。',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: `../renzheng/renzheng?id=注册绑定`
                    })
                  } else if (res.cancel) {
                  }
                }
              })
            } else if (status == 1) {
              console.log("sss" + that.data.noticeid)

              // 是否回执
              wx.request({
                url: base.receiptFlag,
                data: {
                  noticeid: that.data.noticeid,
                  openId: app.globalData.openId,
                  classId: app.globalData.userJson.classId,
                  number: app.globalData.userJson.number
                },
                success: function (res) {
                  var flag = res.data;
                  that.setData({
                    reFlag: flag
                  })
                }
              })
              //
              wx.request({
                url: base.getNoticeOne,
                data: {
                  'noticeid': that.data.noticeid
                },
                success: function (res) {
                  var notice = res.data;
                  if (notice == "") {
                    that.setData({
                      noticeExist: false
                    })
                    wx.hideLoading()
                    return;
                  }

                  if (notice.openId == app.globalData.openId) {
                    that.setData({
                      deleteflag: true
                    })
                  }
                  if (notice.classId != app.globalData.userJson.classId) {
                    that.setData({
                      purpose: false
                    })
                  }

                  that.setData({
                    showView: true
                  })
                  var baseImageUrl = notice.imageBase;
                  var num = notice.imageNum;
                  var arr = [];
                  if (num == 0) {
                    that.setData({
                      imageShow: false
                    })
                  } else {
                    that.setData({
                      imageShow: true
                    })
                    for (var i = 0; i < num; i++) {
                      arr.push(base.getImages + baseImageUrl + i + ".jpg")
                    }
                  }

                  wx.hideLoading()
                  that.setData({
                    title: notice.title,
                    time: '发布时间：' + notice.publishTime,
                    content: notice.content,
                    gridsImg: arr,
                    person: '发布人：' + notice.name + " / " + notice.related,
                    imageTitle: '公告图片：'
                  })

                }
              })
            }
          })
        } else {
          wx.request({
            url: base.getNoticeOne,
            data: {
              'noticeid': that.data.noticeid
            },
            success: function (res) {
              var notice = res.data;
              if (notice == "") {
                that.setData({
                  noticeExist: false
                })
                wx.hideLoading()
                return;
              }

              if (notice.openId == app.globalData.openId) {
                that.setData({
                  deleteflag: true
                })
              }

              if (notice.classId != app.globalData.userJson.classId) {
                that.setData({
                  purpose: false
                })
              }

              that.setData({
                showView: true
              })
              var baseImageUrl = notice.imageBase;
              var num = notice.imageNum;
              var arr = [];
              if (num == 0) {
                that.setData({
                  imageShow: false
                })
              } else {
                that.setData({
                  imageShow: true
                })
                for (var i = 0; i < num; i++) {
                  arr.push(base.getImages + baseImageUrl + i + ".jpg")
                }
              }
              wx.hideLoading()
              that.setData({
                title: notice.title,
                time: '发布时间：' + notice.publishTime,
                content: notice.content,
                gridsImg: arr,
                person: '发布人：' + notice.name + " / " + notice.related,
                imageTitle: '公告图片：'
              })
            }
          })
        }
        break;
      default:
        break;
    }

  },
  onShow: function () {
    var that = this;

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '通知公告',
      path: `/pages/noticedetial/noticedetial?id=${that.data.noticeid}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  playCount: function () {
    wx.navigateTo({
      url: `../count/count?id=${this.data.noticeid}`
    })
  },
  playHuizhi: function () {
    var that = this;
    that.setData({
      reFlag: true
    })
    wx.request({
      url: base.addReceipt,
      method: 'POST',
      data: {
        nId: that.data.noticeid,
        openId: app.globalData.openId,
        classId: app.globalData.userJson.classId,
        number: app.globalData.userJson.number
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data == "ok") {
          wx.showToast({
            title: '回执成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '回执失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  playTap: function (e) {
    const dataset = e.currentTarget.dataset;
    wx.previewImage({
      current: dataset.id, // 当前显示图片的http链接
      urls: this.data.gridsImg // 需要预览的图片http链接列表
    })
  },
  playTapRen: function () {
    wx.navigateTo({
      url: `../renzheng/renzheng`
    })
  },
  deleteTap: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除此条公告吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: base.deleteNotice,
            data: {
              noticeid: that.data.noticeid,
              openId: app.globalData.openId
            },
            success: function (res) {
              if (res.data) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                setTimeout(function () {
                  wx.navigateBack()
                }, 1000)
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 1000
                })
              }
            },
            fail: function (res) {
              wx.showToast({
                title: '删除失败',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
  },
  documentTap: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.downloadFile({
      url: 'https://fxm.playgo.xin/www.xlsx', //仅为示例，并非真实的资源
      success: function (res) {
        var filePath = res.tempFilePath
        wx.hideLoading()
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      },
      fail: function (res) {
        console.log('文件下载失败')
      }
    })
  }
})
