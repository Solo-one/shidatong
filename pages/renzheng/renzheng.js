//index.js
var base = require('../../config')
//获取应用实例
var app = getApp()
Page({
  data: {
    headerImage: '/images/header.png',
    role: 0,
    classId: '',
    number: '',
    name: '',
    sex: 0,
    phone: '',
    roleflag: true,
    roles: [
      { name: 0, value: '老师', checked: 'true' },
      { name: 1, value: '家长', },
    ],
    sexs: [
      { name: 0, value: '男', checked: 'true' },
      { name: 1, value: '女', },
    ],
    roleTip: '老师职务',
    roleArr: [{ id: -100, name: '班主任' }, { id: -99, name: '语文老师' }, { id: -98, name: '数学老师' }, { id: -97, name: '英语老师' }, { id: -96, name: '物理老师' }, { id: -95, name: '化学老师' }, { id: -94, name: '地理老师' }, { id: -93, name: '历史老师' }, { id: -92, name: '生物老师' }, { id: -91, name: '政治老师' }, { id: -90, name: '音乐老师' }, { id: -89, name: '美术老师' }, { id: -88, name: '体育老师' }, { id: -87, name: '信息老师' }]
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      roleTip: this.data.roleArr[e.detail.value].name,
      number: this.data.roleArr[e.detail.value].id
    })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    // 页面渲染完成
    wx.setNavigationBarTitle({
      title: '注册绑定'
    })
  },
  onReady: function () {

  },
  radioChangeRole: function (e) {
    var flagTmp = true;
    if (e.detail.value == 0) {
      flagTmp = true;
    } else if (e.detail.value == 1) {
      flagTmp = false;
    }
    this.setData({
      role: e.detail.value,
      roleflag: flagTmp
    })
  },
  radioChangeSex: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  playTap: function (e) {
    this.takephoto();
  },
  playSub: function (e) {
    var that = this;
    var tmpNumber = "";
    var tmpRelated = "";
    if (that.data.role == 0) {
      tmpNumber = that.data.number
      tmpRelated = that.data.roleTip
    } else if (that.data.role == 1) {
      tmpNumber = e.detail.value.number
      tmpRelated = e.detail.value.related
    }

    if (e.detail.value.phone.length == 0 || tmpRelated.length == 0) {
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

    this.setData({
      classId: e.detail.value.classId,
      number: tmpNumber,
      name: e.detail.value.name,
      phone: e.detail.value.phone,
      related: tmpRelated
    })

    if (this.data.headerImage == "/image/face.png") {
      wx.showModal({
        title: '提示',
        content: '必须上传人脸照片',
        success: function (res) {
          if (res.confirm) {
            that.takephoto();
          } else if (res.cancel) {
            //console.log('用户点击取消')
          }
        }
      })
      return;
    }

    //提交数据
    this.submitData(e.detail.formId);
  },
  takephoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          headerImage: tempFilePaths[0]
        });
      }
    })
  },
  submitData: function (formId) {
    var that = this;
    wx.showLoading({
      title: '注册中',
    })
    wx.request({
      url: base.register,
      method: 'POST',
      data: {
        openId: app.globalData.openId,
        role: that.data.role,
        classId: that.data.classId,
        number: that.data.number,
        name: that.data.name,
        sex: that.data.sex,
        phone: that.data.phone,
        related: that.data.related
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        var data = res.data
        console.log(data);
        if (data == 'ok') {
          //do something  
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000
          })
          app.globalData.status = 11;
          setTimeout(function () {
            wx.hideLoading()
            wx.switchTab({
              url: '../mine/mine',
            })
          }, 1000)
        } else {
          wx.showModal({
            title: '提示',
            content: '数据库无此信息，注册失败。',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })

        }


      },
      fail: function (res) {
        wx.showToast({
          title: '提交失败',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
    })
  }

})
