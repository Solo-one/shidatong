//index.js
var base = require('../../config')
//获取应用实例
var app = getApp()
Page({
  data: {
    headerImage: '',
    motto: '您还没有注册呢——',
    userInfo: { avatarUrl: '', nickName: '' },
    showView: true,
    roleflag: true,
    role: '',
    name: '',
    classId: '',
    number: '',
    phone: '',
    related: '',
    classIdAndNumber: '',
    classIdAndNumberArr: [],
    userJsonArrExceptTeacher: [],
    showModalStatus: false,
    changeData: '新手机号:',
    index: 0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindPickerChange: function (e) {
    var relatedTmp = this.data.userJsonArrExceptTeacher[e.detail.value].related;
    var phoneTmp = this.data.userJsonArrExceptTeacher[e.detail.value].phone;
    if (relatedTmp == "" || relatedTmp == null) {
      relatedTmp = "无"
    }
    if (phoneTmp == "" || phoneTmp == null) {
      phoneTmp = "无"
    }
    var sexId = this.data.userJsonArrExceptTeacher[e.detail.value].sex;
    var sex = '男'
    if (sexId == 0) {
      sex = '男'
    } else if (sexId == 1) {
      sex = '女'
    }
    this.setData({
      index: e.detail.value,
      classId: this.data.userJsonArrExceptTeacher[e.detail.value].classId,
      number: this.data.userJsonArrExceptTeacher[e.detail.value].number,
      name: this.data.userJsonArrExceptTeacher[e.detail.value].name + '（' + sex + '）',
      phone: phoneTmp,
      related: relatedTmp,
      classIdAndNumber: ''
    })
    //很重要
    app.globalData.userJson = this.data.userJsonArrExceptTeacher[e.detail.value]
  },
  onLoad: function () {
    console.log('onLoad.mine')
    var that = this;
    var status = app.globalData.status;
    console.log(status)
    switch (status) {
      case -1:
        wx.showLoading({
          title: '加载中',
        })
        app.doLogin(function (status) {
          if (status == 0) {
            that.setData({
              showView: true
            })
            app.getUserInfo(function (userInfo) {
              that.setData({
                userInfo: userInfo
              })
              wx.hideLoading()
            })
          } else if (status == 1) {
            that.getData();
          }
        })
        break;
      case 0:
        that.setData({
          showView: true
        })
        app.getUserInfo(function (userInfo) {
          that.setData({
            userInfo: userInfo
          })
          wx.hideLoading()
        })
        break;
      case 1:
        that.getData();
        break;
      default:
        break;
    }

  },
  onShow: function () {
    var that = this
    var status = app.globalData.status;
    if (status == 11) {
      that.setData({
        showView: false
      })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: base.getUsers,
        data: {
          'openId': app.globalData.openId
        },
        success: function (res) {
          var userJsonArr = res.data;
          // that.setData({
          //   classIdAndNumber: ''
          // })
          app.globalData.status = userJsonArr[0].status;
          app.globalData.userJson = userJsonArr[0];//很重要
          app.globalData.userJsonArr = userJsonArr;
          that.getData();
          //that.changeData(userJsonArr[0]);
          wx.hideLoading()

        }
      })
    }

  },
  playTap: function (e) {
    wx.navigateTo({
      url: `../renzheng/renzheng`
    })
  },
  getData: function () {
    var that = this;
    that.setData({
      showView: false
    })
    var userJsonArr = app.globalData.userJsonArr
    var classIdAndNumberArrTmp = []
    var userJsonArrExceptTeacherTmp = []
    for (var i = 0, len = userJsonArr.length; i < len; i++) {
      if (userJsonArr[i].number == "-1") {
        continue;
      }
      classIdAndNumberArrTmp.push(userJsonArr[i].classId + ' / ' + userJsonArr[i].number)
      userJsonArrExceptTeacherTmp.push(userJsonArr[i])
    }
    that.setData({
      classIdAndNumber: classIdAndNumberArrTmp[0],
      classIdAndNumberArr: classIdAndNumberArrTmp,
      userJsonArrExceptTeacher: userJsonArrExceptTeacherTmp
    })

    var userJson = app.globalData.userJson
    that.changeData(userJson);
  },
  changeData: function (res) {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })

      wx.request({
        url: base.updateNickname,
        data: {
          openId: app.globalData.openId,
          nickname: userInfo.nickName
        },
        success: function (res) {
          console.log("昵称更新成功")
        }
      })
      wx.hideLoading()
    })

    // if (res == null || res == "" || res == "{}" || res.status == null) {
    //   wx.showLoading({
    //     title: '加载中',
    //   })
    //   wx.request({
    //     url: base.getUsers,
    //     data: {
    //       'openid': app.globalData.openid
    //     },
    //     success: function (res) {
    //       var userJson = res.data[0];
    //       that.changeData(userJson);
    //       wx.hideLoading()
    //     }
    //   })
    //   return;
    // }

    var userJson = res;
    var sex = "男"

    if (userJson.sex == 0) {
      sex = "男"
    } else if (userJson.sex == 1) {
      sex = "女"
    }

    var relatedTmp = "";
    var phoneTmp = "";
    if (userJson.related == null || userJson.related.length == 0) {
      relatedTmp = "无"
    } else {
      relatedTmp = userJson.related
    }
    if (userJson.phone == null || userJson.phone.length == 0) {
      phoneTmp = "无"
    } else {
      phoneTmp = userJson.phone
    }

    if (userJson.role == 0) {
      that.setData({
        roleflag: false,
        role: "老师",
        name: userJson.name + '（' + sex + '）',
        classId: userJson.classId,
        phone: phoneTmp,
        related: relatedTmp
      })
    } else if (userJson.role == 1) {
      that.setData({
        roleflag: true,
        role: "学生家长",
        name: userJson.name + '（' + sex + '）',
        classId: userJson.classId,
        number: userJson.number,
        phone: phoneTmp,
        related: relatedTmp
      })
    }
  },
  changeTap: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    var id = e.currentTarget.dataset.id;
    if (id == "phone") {
      this.setData({
        changeData: '新手机号:'
      })
    } else if (id == "related") {
      this.setData({
        changeData: '新增关系:'
      })
    }
    this.util(currentStatu)
  },
  deleteTap: function () {
    var that = this
    var tmparr = that.data.userJsonArrExceptTeacher
    var arr = []
    for (var x in tmparr) {
      arr.push(tmparr[x].classId + " / " + tmparr[x].number)
    }
    wx.showActionSheet({
      itemList: arr,
      success: function (res) {
        if (res.tapIndex == undefined) {
          return;
        }
        wx.showModal({
          title: '提示',
          content: '确定要注销 ' + arr[res.tapIndex] + ' 吗？',
          success: function (resdata) {
            if (resdata.confirm) {
              //console.log('用户点击确定')
              console.log(tmparr[res.tapIndex])
              var delUser = tmparr[res.tapIndex]
              wx.request({
                url: base.deleteUser,
                data: {
                  sysNumber: delUser.sysNumber,
                },
                success: function (res) {
                  wx.showToast({
                    title: '注销成功',
                    icon: 'success',
                    duration: 2000
                  })
                }
              })


              delete tmparr[res.tapIndex];
              if (arr.length == 1) {
                that.setData({
                  showView: true
                })
                app.globalData.status = -1
                return
              }

              var selectArr = [], userJsonArrExceptTeacher = []
              for (var item in tmparr) {
                selectArr.push(tmparr[item].classId + " / " + tmparr[item].number)
                userJsonArrExceptTeacher.push(tmparr[item])
              }
              console.log(selectArr)
              console.log(userJsonArrExceptTeacher)
              that.setData({
                classIdAndNumberArr: selectArr,
                userJsonArrExceptTeacher: userJsonArrExceptTeacher
              })

              if (that.data.index == res.tapIndex) {
                that.changeData(userJsonArrExceptTeacher[0])
                //很重要
                app.globalData.userJson = userJsonArrExceptTeacher[0]
              }

            } else if (resdata.cancel) {
              //console.log('用户点击取消')
            }
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  subChangeTap: function (e) {
    var that = this
    var changemobile = e.detail.value.changemobile
    //var changerelated = e.detail.value.changerelated
    var currentStatu = e.currentTarget.dataset.statu;
    var id = e.currentTarget.dataset.id;
    if (changemobile.length == 0) {
      this.util("close")
      return;
    }

    wx.request({
      url: base.changeData,
      data: {
        openId: app.globalData.openId,
        classId: app.globalData.userJson.classId,
        number: app.globalData.userJson.number,
        changemobile: changemobile,
        changerelated: changemobile,
        change: id
      },
      success: function (res) {
        console.log(res.data)
        if (res.data) {
          if (id == "新手机号:") {
            var tmpArr = that.data.userJsonArrExceptTeacher
            tmpArr[that.data.index]["phone"] = changemobile
            that.setData({
              phone: " " + changemobile,
              userJsonArrExceptTeacher: tmpArr
            })
          } else if (id == "新增关系:") {
            var tmpArr = that.data.userJsonArrExceptTeacher
            tmpArr[that.data.index]["related"] = changemobile
            that.setData({
              related: " " + changemobile,
              userJsonArrExceptTeacher: tmpArr
            })
          }
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'success',
            duration: 2000
          })
        }
        that.util(currentStatu)
      },
      fail: function (res) {
        wx.showToast({
          title: '修改失败',
          icon: 'success',
          duration: 2000
        })
      }
    })

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 100,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 100)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }
})
