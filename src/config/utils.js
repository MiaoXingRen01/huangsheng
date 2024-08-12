import { CreateReport, SyncReportLoad, SyncReportLoadData, urlAddRandomNo, CreatePrintViewerEx, CreateDisplayViewerEx, insertReportViewer } from "@/config/grf/CreateControl.js"
import CryptoJS from 'crypto-js';
export default {
  gridGrfPrint(grfName, data, isView = true) {
    const grfLink = `${grfName}?${Math.random()}`
    // const dataLink = `${imageURL}${dataUrl}`
    if (isView) {
      CreatePrintViewerEx('100%', '100%', grfLink, data, true, '');
    }
    // setTimeout(() => {
    //   const Report = CreateReport("ReportViewer");
    //   // SyncReportLoad(Report, grfLink);
    //   // SyncReportLoadData(Report, data);
    //   // par1:1.只生成报表表单数据。2.只生成报表内容数据。3.生成报表所有数据。4.预览报表全部内容，但只打印出内容数据。
    //   // par2:指示在打印前是否显示打印对话框。
    //   Report.PrintEx(4, true);
    //   window.location.reload();
    // }, 500);
  },
  
  getMD5String(str) {
    if (!str) {
      return '';
    }
    return CryptoJS.MD5(str).toString();
  },
  isUndefined(v) {
    return typeof v === 'undefined';
  },
  isNull(v) {
    return v === null;
  },
  isEmpty(v) {
    return this.isUndefined(v) || this.isNull(v) || (v + '').trim().length == 0;
  },
  isInt(v) {
    return /^\-?\d+$/.test(v);
  },
  isNumber(v) {
    return !this.isEmpty(v) && !isNaN(Number(v));
  },
  isHttp(str) {
    return /^http/.test(str);
  },
  isBase64(str) {
    if (this.isEmpty(str)) {
      return false
    }
    try {
      return btoa(atob(str)) == str
    } catch (e) {
      return false
    }
  },
  isIp(ip) {
    return /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/g.test(ip);
  },
  isPort(port) {
    if (this.isEmpty(port)) {
      return false;
    }
    port *= 1
    if (port < 0 || port > 65535) {
      return false;
    }

    return true;
  },
  dateTimeFormat(str) {
    if (this.isEmpty(str)) {
      return ''
    }
    return str.substring(0, 19);
  },
  meterFormat(meter) {
    if (this.isEmpty(meter)) {
      return '';
    }
    if ((meter * 1 / 1000) > 1) {
      return `${(meter * 1 / 1000).toFixed(1)} km`;
    }
    return `${(meter * 1).toFixed(1)} m`;
  },
  dateFormatter(time) {
    return time ? time.substring(0, 10) : '';
  },
  delay: ms => new Promise((resolve, reject) => setTimeout(resolve, ms)),
  isInstallPlugin(name) {
    //name转为小写
    name = name.toLowerCase();
    for (var i = 0; i < window.navigator.plugins.length; i++) {
      if (window.navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
        return true;
      }
    }
    return false;
  },
  base64ToFile(base64, suffix = '.jpg') {
    console.log(suffix);
    let arr = base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let theBlob = new Blob([u8arr], { type: mime });
    return new File([theBlob], new Date().getTime() + suffix, {
      type: mime,
      lastModified: Date.now(),
    });
  },
  fileToBase64(file) {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    return new Promise((resolve) => {
      fileReader.onload = function () {
        resolve(this.result)
      }
    });
  },
  getStrByReg(str, reg) {
    var match = str.match(new RegExp(reg))
    if (match == null || match.length < 1) {
      return ""
    }
    return match[0]
  },
  formatBeginEndDateTime(planTimeBegin, planTimeEnd) {
    const regExp1 = new RegExp("\\d{4}\\-")
    const regExp2 = new RegExp("\\d{4}\\-\\d{2}\\-\\d{2}")
    return `${planTimeBegin.replace(regExp1, "")}-${planTimeEnd.replace(this.getStrByReg(planTimeBegin, regExp2) == this.getStrByReg(planTimeEnd, regExp2) ? regExp2 : regExp1, '')}`
  },
};
