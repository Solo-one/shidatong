/**
 * 小程序网络配置文件
 * 小程序版本末尾数字：
 * 偶数是生产版本
 * 奇数是开发版本
 */
//var domain = "fxm.playgo.xin"
var domain = "app.orisuntech.com"

var host = `https://${domain}/sdt` //正式环境
//var host = "https://app.orisuntech.com/sdt" //正式环境
//var host = "https://fxm.playgo.xin/sdttest" //测式环境
//var host = "http://localhost:8081/sdttest"//测试环境

var config = {
  host,
  // 测试接口
  test: `${host}/test`,
  // 用code换取openId
  openId: `${host}/openId`,
  // 用code换取openId
  openIds: `${host}/openIds`,
  // 注册绑定
  register: `${host}/register`,
  // 获取用户信息
  getUser: `${host}/getUser`,
  // 获取用户信息多个
  getUsers: `${host}/getUsers`,
  // 发布公告
  addPublish: `${host}/addPublish`,
  // 上传图片及表单
  uploadImageUrl: `${host}/uploadImage`,
  // 获取单条公告
  getNoticeOne: `${host}/getNoticeOne`,
  // 获取公告列表
  getNoticeList: `${host}/getNoticeList`,
  // 图片地址
  getImages: `https://${domain}/`,
  // 增加回执信息
  addReceipt: `${host}/addReceipt`,
  // 查询回执情况
  getReceiptList: `${host}/getReceiptList`,
  // 是否回执
  receiptFlag: `${host}/receiptFlag`,
  // 更新昵称
  updateNickname: `${host}/updateNickname`,
  // 搜索通知列表
  searchNotice: `${host}/searchNotice`,
  // 最新公告
  noticeNews: `${host}/noticeNews`,
  // 通讯录  
  contacts: `${host}/contacts`,
  // 删除公告  
  deleteNotice: `${host}/deleteNotice`,
  // 修改信息  
  changeData: `${host}/changeData`,
  // 删除用户  
  deleteUser: `${host}/deleteUser`,


  // 头像照片
  getHeaderImg: `${host}/`,
  // 测试的信道服务接口
  tunnelUrl: `${host}/tunnel`,
  // 生成支付订单的接口
  paymentUrl: `${host}/ml/payment`,
  // 发送模板消息接口
  templateMessageUrl: `${host}/templateMessage`,
  // 上传文件接口
  uploadFileUrl: `${host}/upload`,
  // 下载示例图片接口
  downloadExampleUrl: `${host}/static/weapp.jpg`
};

module.exports = config
