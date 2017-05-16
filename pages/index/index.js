//index.js
//获取应用实例
var app = getApp()
var name_time = "大师兄"
Page({
  data: {
    imgUrls: [
      '../../images/lzKvwU2.jpg',
      '../../images/slide3.jpg',
      '../../images/timg.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    marginLeft: 0,
    animation: {},
    isMoveRight: false,
    txt: name_time
  },
  // 页面加载
  onLoad: function (options) {

    // 4.请求服务器，显示附近的单车，用marker标记
    // wx.request({
    //   url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
    //   data: {},
    //   method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    //   // header: {}, // 设置请求的 header
    //   success: (res) => {
    //     this.setData({
    //       markers: res.data.data
    //     })
    //   },
    //   fail: function (res) {
    //     // fail
    //   },
    //   complete: function (res) {
    //     // complete
    //   }
    // })
  },
  // 跳转至钱包
  movetoDetail: function(){
    wx.navigateTo({
      url: '../detail/detail'
    })
  },
  // 页面显示
  onShow: function () {
    
  }
})