
const util = require('../../utils/util.js');

Page({
    data: {
        // text:"这是一个页面"
        data: [],
        databody: null,
        comments: [{
            author: "杨哲",
            avatar: "http://pic1.zhimg.com/5427b230bc394d76829d41567ea30bf4_im.jpg",
            content: "为什么你们的关注点都在标点符号，而且还数着感叹号来看…",
            id: 29013071,
            likes: 0,
            reply_to: { content: "看见第五个叹号的时候就完全失去了阅读兴趣。", status: 0, id: 29012722, author: "Azeroths" },
            time: 1494916280
        },
        {
            author: "咬咬就有电了",
            avatar: "http://pic3.zhimg.com/5d5afe9ee44e74ffc408f394261ec81a_im.jpg",
            content: "按最低交，多的部分想交可以从收入里扣，一样的举个手。🤷🏻‍♂️",
            id: 29012976,
            likes: 0,
            time: 1494915202
        }
        ],  // 评论

        winHeight: 0,   // 设备高度

        // 弹窗
        modalHidden: true,
        modalValue: null,

        /**
         * 分享配置
         */
        shareShow: 'none',
        shareOpacity: {},
        shareBottom: {},

    },
    onLoad: function (options) {
        // 页面初始化 options 为页面跳转所带来的参数
        var that = this
        var id = options.id;


        // // 请求内容数据
        util.AJAX("detail", function (res) {
            var arr = res.data;
            var body = arr.body;
            body = body.match(/<p>.*?<\/p>/g);
            var ss = [];
            for (var i = 0, len = body.length; i < len; i++) {
                ss[i] = /<img.*?>/.test(body[i]);
                if (ss[i]) {
                    body[i] = body[i].match(/(http:|https:).*?\.(jpg|jpeg|gif|png)/);
                } else {
                    body[i] = body[i].replace(/<p>/g, '')
                        .replace(/<\/p>/g, '')
                        .replace(/<strong>/g, '')
                        .replace(/<\/strong>/g, '')
                        .replace(/<a.*?\/a>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/&ldquo;/g, '"')
                        .replace(/&rdquo;/g, '"');
                }
            }
            // 重新写入数据
            that.setData({
                data: arr,
                databody: body
            });

            //页面渲染完成
            //修改页面标题
            wx.setNavigationBarTitle({
                title: that.data.data.title
            })
        });

        //请求评论
        // util.AJAX( "story/" + id + "/short-comments", function( res ) {
        var arr = that.comments;
        if (arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i]['times'] = util.getTime(arr[i].time);
            }
            // 重新写入数据
            that.setData({
                comments: arr
            });
        }

        //});

        /**
         * 获取系统信息
         */
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                });
            }
        });


    },
    /**
     * 显示分享
     */
    showShare: function (e) {

        //创建动画
        var animation = wx.createAnimation({
            duration: 100,
            timingFunction: "ease",
        })
        this.animation = animation;

        var that = this;
        that.setData({
            shareShow: "block",
        });

        setTimeout(function () {
            that.animation.bottom(0).step();
            that.setData({
                shareBottom: animation.export()
            });
        }.bind(this), 400);

        // 遮罩层
        setTimeout(function () {
            that.animation.opacity(0.3).step();
            that.setData({
                shareOpacity: animation.export()
            });
        }.bind(this), 400);

    },

    /**
     * 关闭分享
     */
    shareClose: function () {
        // 创建动画
        var animation = wx.createAnimation({
            duration: 0,
            timingFunction: "ease"
        })
        this.animation = animation;

        var that = this;

        setTimeout(function () {
            that.animation.bottom(-210).step();
            that.setData({
                shareBottom: animation.export()
            });
        }.bind(this), 500);

        setTimeout(function () {
            that.animation.opacity(0).step();
            that.setData({
                shareOpacity: animation.export()
            });
        }.bind(this), 500);

        setTimeout(function () {
            that.setData({
                shareShow: "none",
            });
        }.bind(this), 1500);
    },

    /**
     * 点击分享图标弹出层
     */
    modalTap: function (e) {
        var that = this;
        that.setData({
            modalHidden: false,
            modalValue: e.target.dataset.share
        })
    },

    /**
     * 关闭弹出层
     */
    modalChange: function (e) {
        var that = this;
        that.setData({
            modalHidden: true
        })
    },

    onReady: function () {

    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})