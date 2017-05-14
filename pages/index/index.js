//index.js
//获取应用实例
var app = getApp()
var name_time="大师兄"
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
    pageX: 0,//初始位置记录
    pageY: 0,//记录Y轴的位置
    animation: {},
    isMoveRight: false,
    txt:name_time
  },
  // 页面加载
  onLoad: function (options) {

    // 4.请求服务器，显示附近的单车，用marker标记
    wx.request({
      url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: (res) => {
        this.setData({
          markers: res.data.data
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // 页面显示
  onShow: function () {
    // 1.创建地图上下文，移动当前位置到地图中心
    this.mapCtx = wx.createMapContext("ofoMap");
    this.movetoPosition()
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费
      case 2: if (this.timer === "" || this.timer === undefined) {
        // 没有在计费就扫码
        wx.scanCode({
          success: (res) => {
            // 正在获取密码通知
            wx.showLoading({
              title: '正在获取密码',
              mask: true
            })
            // 请求服务器获取密码和车号
            wx.request({
              url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
              data: {},
              method: 'GET',
              success: function (res) {
                // 请求密码成功隐藏等待框
                wx.hideLoading();
                // 携带密码和车号跳转到密码页
                wx.redirectTo({
                  url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                  success: function (res) {
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 1000
                    })
                  }
                })
              }
            })
          }
        })
        // 当前已经在计费就回退到计费页
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
        break;
      // 点击保障控件，跳转到报障页
      case 3: wx.navigateTo({
        url: '../warn/index'
      });
        break;
      // 点击头像控件，跳转到个人中心
      case 5: wx.navigateTo({
        url: '../my/index'
      });
        break;
      default: break;
    }
  },
  // 地图视野改变事件
  bindregionchange: function (e) {
    // 拖动地图，获取附件单车位置
    if (e.type == "begin") {
      wx.request({
        url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/biyclePosition',
        data: {},
        method: 'GET',
        success: (res) => {
          this.setData({
            _markers: res.data.data
          })
        }
      })
      // 停止拖动，显示单车位置
    } else if (e.type == "end") {
      this.setData({
        markers: this.data._markers
      })
    }
  },
  // 地图标记点击事件，连接用户位置和点击的单车位置
  bindmarkertap: function (e) {
    let _markers = this.data.markers;
    let markerId = e.markerId;
    let currMaker = _markers[markerId];
    this.setData({
      polyline: [{
        points: [{
          longitude: this.data.longitude,
          latitude: this.data.latitude
        }, {
          longitude: currMaker.longitude,
          latitude: currMaker.latitude
        }],
        color: "#FF0000DD",
        width: 1,
        dottedLine: true
      }],
      scale: 18
    })
  },
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  start: function (e) {
    var pageX = e.touches[0].clientX;//记录触摸位置X方向
    var pageY = e.touches[0].clientY;//记录触摸位置Y方向
    var marginLeft = this.data.marginLeft;

    if (Math.abs(marginLeft) == 100) {//点击回到原点
      this.animation.translate(100).step({ duration: 800 });
      this.setData({
        animation: this.animation.export(),
      })
      var that = this;
      setTimeout(function () {
        that.setData({
          marginLeft: 0
        })
      }, 800)
      return;
    }

    this.setData({
      pageX: pageX,
      pageY: pageY
    })
    console.log(pageX);
  },
  move: function (e) {
    var pageX = this.data.pageX;
    var pageY = this.data.pageY;
    var marginLeft = this.data.marginLeft;
    var moveX = e.changedTouches[0].clientX - pageX;//记录当前移动的X轴
    var moveY = e.changedTouches[0].clientY - pageY;//记录当前移动Y轴

    if (moveX > 0) {
      this.setData({
        marginLeft: 0,
      })
      return;
    }

    if (Math.abs(marginLeft) >= 90) {//为了快速拖动不出现空白区域
      this.setData({
        marginLeft: -100,
        isMoveRight: true
      })
      return;
    }


    console.log(moveX)
    var isMoveRight = false;
    if (Math.abs(moveX) > Math.abs(moveY) && Math.abs(moveX) > 0) { //判断是左向右滑动
      //当marginLfet最大值时才可以向右滑动,且moveX=所设置的最大值
      if (Math.abs(marginLeft) >= 100) {
        moveX = -100; //因为是左滑动 所以是负
        isMoveRight = true;
      }

      this.setData({
        marginLeft: moveX,
        isMoveRight: isMoveRight
      })
    }
  },
  end: function (e) {
    var marginLeft = this.data.marginLeft;
    var isMoveRight = this.data.isMoveRight;
    var that = this;
    if (!isMoveRight) {
      if (Math.abs(marginLeft) > 50) {//超过一半时，自动到滑动到最大
        var tx = 100 - Math.abs(marginLeft);
        that.animation.translate(-tx).step({ duration: 500 });
        that.setData({
          animation: that.animation.export(),
        })
        setTimeout(function () {
          that.setData({
            marginLeft: -100,
            isMoveRight: true
          })
        }, 500)
      } else { //没有一半时，自动滑动到0

        that.animation.translate(Math.abs(marginLeft)).step({ duration: 500 });
        that.setData({
          animation: that.animation.export(),
        })
        setTimeout(function () {
          that.setData({
            marginLeft: 0,
            isMoveRight: false
          })
        }, 500)
      }
    }
  }
})