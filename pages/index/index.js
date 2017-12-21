var util = require('../../utils/util.js');
const Upyun = require('../../utils/upyun-wxapp-sdk.js');
const upyun = new Upyun(util.upyunConfig);
Page({
  chooseImage: function () {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        console.log('chooseImage success, temp path is', res.tempFilePaths[0])
        const imageSrc = res.tempFilePaths[0]
        upyun.upload({
          localPath: imageSrc,
          remotePath: '/wxapp/demo',
          success: function (res) {
            console.log('uploadImage success, res is:', res)
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })

            self.setData({
              imageSrc
            })
          },
          fail: function ({errMsg}) {
            console.log('uploadImage fail, errMsg is', errMsg)
          }
        })
      },
      fail: function ({errMsg}) {
        console.log('chooseImage fail, err is', errMsg)
      }
    })
  }
})
