const tools = {
    pulicFormat(name, type) {//验证文件后缀
        var reg = '';
        if (type == "img") {
            reg = /\.(png|jpg)$/i;
        } else if (type == "audio") {
            reg = /\.mp3$/i;
        } else if (type == 'zip') {
            reg = /\.zip$/i;

        } else if (type == 'video') {
            reg = /\.mp4$/i;

        }
        return reg.test(name);
    },
    verifyPhone(phone) {//电话验证
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        return myreg.test((phone))
    },
    verifyIds(card) {//身份证简单验证(身份证为15位或者18位，15位的全为数字，18位的前17位为数字，最后一位为数字或者大写字母”X“。)
        let reg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
        return reg.test(card)
    },
    transitionTime(time) {  //时间戳转换
        //获得当前运行环境时间
        let data;
        if (time.toString().length != 13) {
            data = time * 1000
        } else {
            data = time;
        }
        let nowData = new Date(data);
        //算得时区
        var time_zone = -nowData.getTimezoneOffset() / 60;
        if (time_zone < 0) {
            //西区 西区应该用时区绝对值加京八区
            time_zone = Math.abs(time_zone) + 8;
            data = data + time_zone * 60 * 60 * 1000
        } else {
            time_zone -= 8;
            data = data - time_zone * 60 * 60 * 1000
        }
        let now = new Date(data);
        let year = now.getFullYear();       //年
        let month = now.getMonth() + 1;     //月
        let day = now.getDate()             //日
        let clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day + " ";
        if (time.toString().length == 13) {
            let hh = now.getHours()             //时
            let mm = now.getMinutes();          //分
            let ss = now.getSeconds();          //秒
            if (hh < 10)
                clock += "0";
            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm + ":";
            if (ss < 10) clock += '0';
            clock += ss;
        }
        return clock;
    },
    fileType(fileName) {
      let suffix = ''
      if (fileName.indexOf('.') !== -1) {
        // suffix = fileName.split('.')[1]
        suffix = fileName.split('.').pop()
      }
      let fileT = ''
      // 图片类型
      const imageTypeList = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      // 视频类型
      const videoTypeList = [
        'mp4',
        'avi',
        'rmvb',
        'rm',
        'wmv',
        'mkv',
        'flv',
        'mov',
        '3gp',
        'mov',
      ]
      // 音频类型
      const audioTypeList = ['mp3', 'wav', 'ogg', 'wma', 'aac', 'flac']
      // 压缩包类型
      const zipTypeList = ['zip', 'rar', '7z', 'tar', 'gz']
      // doc文档类型
      const docTypeList = ['doc', 'docx']
      // xls文档类型
      const xlsTypeList = ['xls', 'xlsx']
      // ppt文档类型
      const pptTypeList = ['ppt', 'pptx']
      // pdf文档类型
      const pdfTypeList = ['pdf']
      // txt文档类型
      const txtTypeList = ['txt']
      // console.log('suffix:', suffix)
      // 判断是否是文件夹
      if (fileName.indexOf('.') === -1) {
        fileT = 'fileFolder'
      } else if (imageTypeList.includes(suffix)) {
        fileT = 'image'
      } else if (videoTypeList.includes(suffix)) {
        fileT = 'video'
      } else if (audioTypeList.includes(suffix)) {
        fileT = 'audio'
      } else if (zipTypeList.includes(suffix)) {
        fileT = 'zip'
      } else if (docTypeList.includes(suffix)) {
        fileT = 'doc'
      } else if (xlsTypeList.includes(suffix)) {
        fileT = 'xls'
      } else if (pptTypeList.includes(suffix)) {
        fileT = 'ppt'
      } else if (pdfTypeList.includes(suffix)) {
        fileT = 'pdf'
      } else if (txtTypeList.includes(suffix)) {
        fileT = 'txt'
      } else {
        fileT = 'other'
      }
      // console.log('文件类型为:', fileT)
      return fileT
    },
    // 是否是url
    isUrl(url) {
      let reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
      return reg.test(url)
    }
}

export default tools;
