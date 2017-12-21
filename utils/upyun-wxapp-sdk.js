var CryptoJS = require('./crypto-js.js');
var util = require('./util.js');
function Upyun(options) {
  this.bucket = options.bucket
  this.operator = options.operator
  this.getSignatureUrl = options.getSignatureUrl
}

Upyun.prototype.upload = function (options) {
  var self = this
  if (!options.remotePath) {
    options.remotePath = options.localPath.split('//')[1]
  }
  var date = (new Date()).toGMTString()
  var imgpath = GetReDate("{$Year}/{$Month}/{$Day}/");
  var filename = options.remotePath.replace('/','')
  //储存在cdn的链接以及文件名，按年月日做目录
  var fname = "/minapp/" + imgpath + GetReDate("{$Year}{$Month}{$Day}{$Hours}{$Minutes}{$Seconds}{$Ms}{$Ran}") + filename;
  var opts = {
    'save-key': fname,
    bucket: self.bucket,
    expiration: Math.round(new Date().getTime() / 1000) + 3600,
    date: date
  }
  var policy = Base64.encode(JSON.stringify(opts))
  console.log('policy= ',policy)
  var data = ['POST', '/' + self.bucket, date, policy].join('&')
  console.log('data= ',data)
  self.getSignature(data, function (err, signature) {
    if (err) {
      options.fail && options.fail(err)
      options.complete && options.complete(err)
      return
    }
    wx.uploadFile({
      url: `https://v0.api.upyun.com/${self.bucket}`,
      filePath: options.localPath,
      name: 'file',
      formData: {
        authorization: `UPYUN ${self.operator}:${signature}`,
        policy: policy
      },
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  })
}

Upyun.prototype.getSignature = function (data, cb) {
  var signature = CryptoJS.HmacSHA1(data, util.upyunConfig.password).toString();
  cb(null, signature);
}
//js正则表达式常量-------------------------------------------------------------------------------------
//字符范围限制
var REGEXP_STRFWXZ6_40 = ".{6,40}" //6-40字符范围限制
//数据检验常量
var REGEXP_NULL = "^[\\S]+$";//非空值校验常量
var REGEXP_EMAIL = "^\\w+((-\\w+)|(\\.\\w+))*\\@\\w+((\\.|-)\\w+)*\\.\\w+$";//电子邮件校验常量
var REGEXP_URL = "^http://([\\w-]+\\.)+[\\w-]+(//[\\w- .//?%&=]*)?"; //网址校验常量
var REGEXP_ZIP = "\\d{6}"; //邮编校验常量
var REGEXP_SSN = "(^\\d{15}$)|(^\\d{17}([0-9]|X|x)$)"; //身份证校验常量
//严格15位身份证校验校验
var REGEXP_IDCARD15 = "^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$";
//严格18位身份证校验校验
var REGEXP_IDCARD18 = "^[1-9][0-7]\\d{4}((\\d{4}(0[13-9]|1[012])(0[1-9]|[12]\\d|30))|(\\d{4}(0[13578]|1[02])31)|(\\d{4}02(0[1-9]|1\\d|2[0-8]))|(\\d{2}([13579][26]|[2468][048]|0[48])0229))\\d{3}(\\d|X|x)$";
var REGEXP_INT = "^\\d{1,}$"; //整数校验常量
var REGEXP_DEMICAL = "^-?(0|\\d+)(\\.\\d+)?$"; //数值校验常量
//IPV4校验常量
var REGEXP_IP = "^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$";
//日期校验常量
var REGEXP_TIME = "^(([0-1][0-9])|(2[0-3])|([0-9])):(([0-5][0-9])|([0-9]))$";//时分格式效验 列如：15:18
var REGEXP_DATE = "";
var REGEXP_SHORTDATE = "^(?:(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(\\//|-|\\.)(?:0?2\\1(?:29))$)|(?:(?:1[6-9]|[2-9]\\d)?\\d{2})(\\//|-|\\.)(?:(?:(?:0?[13578]|1[02])\\2(?:31))|(?:(?:0?[1,3-9]|1[0-2])\\2(29|30))|(?:(?:0?[1-9])|(?:1[0-2]))\\2(?:0?[1-9]|1\\d|2[0-8]))$";
var REGEXP_ZS = "^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$";//正数
var REGEXP_FFZS = "^\\d+$";　　//非负整数（正整数 + 0）
var REGEXP_ZZS = "^[0-9]*[1-9][0-9]*$";　　//正整数
var REGEXP_FZZS = "^((-\\d+)|(0+))$";　　//非正整数（负整数 + 0）
var REGEXP_FZS = "^-[0-9]*[1-9][0-9]*$";　　//负整数
var REGEXP_ZS = "^-?\\d+$";　　　　//整数
var REGEXP_FFFDS = "^\\d+(\\.\\d+)?$";　　//非负浮点数（正浮点数 + 0）
var REGEXP_ZFDS = "^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$";　　//正浮点数
var REGEXP_FZFDS = "^((-\\d+(\\.\\d+)?)|(0+(\\.0+)?))$";　　//非正浮点数（负浮点数 + 0）
var REGEXP_FFDS = "^(-(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*)))$";　　//负浮点数
var REGEXP_FDS = "^(-?\\d+)(\\.\\d+)?$";　　//浮点数
var REGEXP_26YWZM = "^[A-Za-z]+$";　　//由26个英文字母组成的字符串
var REGEXP_26YWZMD = "^[A-Z]+$";　　//由26个英文字母的大写组成的字符串
var REGEXP_26YWZMX = "^[a-z]+$";　　//由26个英文字母的小写组成的字符串
var REGEXP_SZ26YWZM = "^[A-Za-z0-9]+$";　　//由数字和26个英文字母组成的字符串
var REGEXP_SZYWHX = "^[A-Za-z0-9-]+$";　　//由数字和26个英文大小写字母和“-”组成的字符串
var REGEXP_SZ26YWZMXHX = "^\\w+$";　　//由数字、26个英文字母或者下划线组成的字符串
var REGEXP_SZS26YWZMXHX = "^[a-zA-Z]\\w+$";　　//首字符必须是字母后面字符由数字、26个英文字母或者下划线组成的字符串
var REGEXP_REURL = "^[a-zA-Z]+://(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*(\\?\\S*)?$";　　//url
var REGEXP_COLOR = "^#[0-9a-fA-F]{6}$" //颜色值十六进格式制检查
//颜色值十进制格式检查
var REGEXP_COLORSZ = "^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\,(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\,(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$";
var REGEXP_ZWYW = "^[\\u4e00-\\u9fa5A-Za-z0-9]+$"; //由数字、26个英文大小写字母或者中文组成的字符串
var REGEXP_ZWYWX = "^[\\u4e00-\\u9fa5A-Za-z0-9_-]+$"; //由数字、下划线、26个英文大小写字母或者中文组成的字符串
var REGEXP_MOBILEPHONE = "^0?(1[34578][0-9])[0-9]{8}$"; //手机正则表达式效验
var REGEXP_PHONE = "^((\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})|(\\d{4}|\\d{3})-(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1})|(\\d{7,8})-(\\d{4}|\\d{3}|\\d{2}|\\d{1}))$"; //电话正则表达式效验 匹配格式：3-4位区号，7-8位直播号码，1－4位分机号
//js正则表达式常量-------------------------------------------------------------------------------------

//正则表达式检查
//需要检查的字符串对象
//js正则表达式常量或js正则表达式
function IsInRegExp(ssvalue, jsname) {
  if (jsname == "REGEXP_NULL") {
    if (ssvalue.toString().Trim() == "") {
      return false;
    } else { return true; }
  }
  if (jsname == "REGEXP_DATE") {
    if (IsDate(ssvalue) == true) {
      return true;
    } else { return false; }
  }
  var objRegExp = eval(jsname);
  var patrn = new RegExp(objRegExp, "ig");
  return patrn.test(ssvalue);
}
function IsRegExp(sValue, regStr) {
  if (sValue == "") { return false; }
  var patrn = new RegExp(regStr, "ig");
  return patrn.test(sValue);
}

function IsDate(oDateTime) {
  var pat_hd = /^(\d{1,5}-(([1-9]{1})|(0[1-9]{1})|(1[0-2]{1}))-(([1-9]{1})|(0[1-9]{1})|([1-2]{1}[0-9]{1})|(3[0-1]{1}))){1}(\s\d{1,2}:\d{1,2}:\d{1,2})?$/;
  try {
    if (!pat_hd.test(oDateTime)) throw "日期非法！";
    var arr_dt = oDateTime.split(" ");
    if (arr_dt[0] == '') throw "日期非法！";
    var oDate = arr_dt[0];
    var arr_hd = oDate.split("-");
    var dateTmp;
    dateTmp = new Date(arr_hd[0], parseFloat(arr_hd[1]) - 1, parseFloat(arr_hd[2]));
    if (dateTmp.getFullYear() != parseFloat(arr_hd[0]) || dateTmp.getMonth() != parseFloat(arr_hd[1]) - 1 || dateTmp.getDate() != parseFloat(arr_hd[2])) throw "日期非法！";
    if (arr_dt[1] && arr_dt[1] != '') {
      var oTime = arr_dt[1];
      var arr_ht = oTime.split(":");
      dateTmp.setHours(arr_ht[0], arr_ht[1], arr_ht[2]);
      if (dateTmp.getHours() != parseFloat(arr_ht[0]) || dateTmp.getMinutes() != parseFloat(arr_ht[1]) || dateTmp.getSeconds() != parseFloat(arr_ht[2])) throw "日期非法！";
    }
  } catch (ex) {
    if (ex.description) { return false; }
    else { return false; }
  }
  return true;
}

function ToDBC(txtstring) {
  var tmp = "";
  for (var i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) == 32) {
      tmp = tmp + String.fromCharCode(12288);
    }
    if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
    }
  }
  return tmp;
}

function ToCDB(str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp
}
function AddIntStr(sst, wst, bst) {
  if (sst.length < wst) {
    for (var i = -1; i < wst - sst.length; i++) { sst = bst + sst }
  }
  return sst;
}
function IsExt(url, opt) {
  var sTemp;
  var b = false;
  var s = opt.toUpperCase().split("|");
  for (var i = 0; i < s.length; i++) {
    sTemp = url.substr(url.length - s[i].length - 1);
    sTemp = sTemp.toUpperCase();
    s[i] = "." + s[i];
    if (s[i] == sTemp) {
      b = true;
      break;
    }
  }
  return b;
}

function ChangeTwoDecimal(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) { return false; }
  var f_x = Math.round(x * 100) / 100;
  return f_x;
}
function ChangeTwoDecimal_f(x) {
  var f_x = parseFloat(x);
  if (isNaN(f_x)) { return false; }
  var f_x = Math.round(x * 100) / 100;
  var s_x = f_x.toString();
  var pos_decimal = s_x.indexOf(".");
  if (pos_decimal < 0) {
    pos_decimal = s_x.length; s_x += ".";
  }
  while (s_x.length <= pos_decimal + 2) {
    s_x += "0";
  }
  return s_x;
}
function GetReDate() {
  var Rstr = null;
  var dateTime = null;
  if (arguments.length > 0) {
    Rstr = arguments[0];
    if (arguments.length > 1) {
      dateTime = arguments[1];
    }
  }
  if (dateTime == null) {
    dateTime = new Date();
  }
  if (Rstr == null) {
    return dateTime.getFullYear().toString() + AddIntStr((dateTime.getMonth() + 1).toString(), 2, "0") + AddIntStr(dateTime.getDate().toString(), 2, "0") + AddIntStr(dateTime.getHours().toString(), 2, "0") + AddIntStr(dateTime.getMinutes().toString(), 2, "0") + AddIntStr(dateTime.getSeconds().toString(), 2, "0") + AddIntStr(dateTime.getMilliseconds().toString(), 3, "0") + GetRandom(1000000, 9999999).toString();
  } else {
    Rstr = Rstr.replace("{$Year}", dateTime.getFullYear().toString());
    Rstr = Rstr.replace("{$Month}", AddIntStr((dateTime.getMonth() + 1).toString(), 2, "0"));
    Rstr = Rstr.replace("{$Day}", AddIntStr(dateTime.getDate().toString(), 2, "0"));
    Rstr = Rstr.replace("{$Hours}", AddIntStr(dateTime.getHours().toString(), 2, "0"));
    Rstr = Rstr.replace("{$Minutes}", AddIntStr(dateTime.getMinutes().toString(), 2, "0"));
    Rstr = Rstr.replace("{$Seconds}", AddIntStr(dateTime.getSeconds().toString(), 2, "0"));
    Rstr = Rstr.replace("{$Ms}", AddIntStr(dateTime.getMilliseconds().toString(), 3, "0"));
    Rstr = Rstr.replace("{$Week}", GetWeek(dateTime));
    Rstr = Rstr.replace("{$Ran}", GetRandom(1000000, 9999999).toString());
    return Rstr;
  }
}

function GetReDate8() {

  var currentDate = new Date();
  var Year = currentDate.getFullYear();
  var Month = currentDate.getMonth() + 1;
  if (Month < 10) {
    Month = "0" + Month;
  }
  var Day = currentDate.getDate();
  if (Day < 10) {
    Day = "0" + Day
  }
  var Num = "";
  for (var i = 0; i < 4; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  var str = Year + Month + Day + Num;
  return str

}
function GetWeek() {
  var dateTime = null;
  if (arguments.length > 0) {
    dateTime = arguments[0];
  }
  if (dateTime == null) {
    dateTime = new Date();
  }
  var weekday = dateTime.getDay();
  if (weekday == 0) { return "星期日"; }
  if (weekday == 1) { return "星期一"; }
  if (weekday == 2) { return "星期二"; }
  if (weekday == 3) { return "星期三"; }
  if (weekday == 4) { return "星期四"; }
  if (weekday == 5) { return "星期五"; }
  if (weekday == 6) { return "星期六"; }
}

function GetRandom(minnum, maxnum) {
  return parseInt(Math.random() * (minnum - maxnum + 1) + maxnum);
}

function GetStrLen(sChars) {
  return sChars.replace(/[^\x00-\xff]/g, "xx").length;
}

function MidStr(sSource, iLen) {
  if (sSource.replace(/[^\x00-\xff]/g, "xx").length <= iLen) {
    return sSource;
  }
  var str = "";
  var l = 0;
  var schar;
  for (var i = 0; schar = sSource.charAt(i); i++) {
    str += schar;
    l += (schar.match(/[^\x00-\xff]/) != null ? 2 : 1);
    if (l >= iLen) {
      break;
    }
  }
  return str;
}

//去掉字符串左边空格
function LTrim(s) {
  return s.replace(/^(\s+)/g, "");
}

//去掉字符串右边空格
function RTrim(s) {
  return s.replace(/(\s+)$/g, "");
}

//去掉字符串两边空格
function Trim(s) {
  return RTrim(LTrim(s));
}

//去掉字符串所有空格
function TrimAll(s) {
  return s.replace(/(\s)/g, "");
}

//将字符串解码并删除左右空白
function UnTrim(s) {
  return Trim(unescape(s));
}

// 替换所有匹配字符串
function ReplaceAll(s, s1, s2) {
  return s.replace(new RegExp(s1, "gm"), s2);
}

// 判断变量是否为数组
function isArray(o) {
  return Object.prototype.toString.call(o) == '[object Array]';
}

// 判断对象是否为空，如果为空则返回true,否则返回false
function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

//判断对象值是否为null或undefined如果是则返回空字符串，否则返回该值
function GetValue(oval) {
  if (oval == null || oval == "undefined") {
    return "";
  }
  return oval;
}

//判断对象值是否为null或undefined如果是则返回默认值，否则返回该值
function GetValues(oval, defval) {
  if (oval == null || oval == "undefined") {
    return defval;
  }
  return oval;
}

//判断对象值是否为null或undefined如果是则返回默认值，否则返回该值
function GetAddNew(oval) {
  if (oval == null || oval == "undefined" || oval == "") {
    return true;
  }
  return false;
}

//获取上一级页面对象
function GetParentPage() {
  var pages = getCurrentPages();
  if (pages.length > 1) {
    return pages[pages.length - 2];
  }
  return null;
}

//获取指定层级页面对象
function GetAppointPage(index) {
  var pages = getCurrentPages();
  if (index > -1 && index < pages.length) {
    return pages[index];
  }
  return null;
}
/* eslint-disable */
var Base64 = {
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  encode: function (input) {
    var output = ''
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4
    var i = 0
    input = Base64._utf8_encode(input)
    while (i < input.length) {
      chr1 = input.charCodeAt(i++)
      chr2 = input.charCodeAt(i++)
      chr3 = input.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4)
    }
    return output
  },
  // public method for decoding
  decode: function (input) {
    var output = ''
    var chr1, chr2, chr3
    var enc1, enc2, enc3, enc4
    var i = 0
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++))
      enc2 = this._keyStr.indexOf(input.charAt(i++))
      enc3 = this._keyStr.indexOf(input.charAt(i++))
      enc4 = this._keyStr.indexOf(input.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = Base64._utf8_decode(output)
    return output
  },
  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n')
    var utftext = ''
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  },
  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    var string = ''
    var i = 0
    var c = c1 = c2 = 0
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }
    return string
  }
}
module.exports = Upyun
