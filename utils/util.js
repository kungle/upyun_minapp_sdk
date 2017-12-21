
var upyunConfig = {
  bucket: '',  //空间名
  operator: '', //操作员
  password: '', //密码md5值
  getSignatureUrl: 'http://localhost:8080' //签名服务器 没暖用
}
module.exports = {
  upyunConfig:upyunConfig,
  cdnImageUrl:"" //你的cdn地址host
}
