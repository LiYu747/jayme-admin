function time(data, dayFlag, flag, ssFlag) {
    //获得当前运行环境时间
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
    let hh = now.getHours()             //时
    let mm = now.getMinutes();          //分
    let ss = now.getSeconds();          //秒
    let clock = year + "-";
    if (month < 10)
        clock += "0";
    clock += month;
    if (dayFlag) {
        return clock;
    }
    clock += "-";
    if (day < 10)
        clock += "0";
    clock += day + " ";
    if (flag) {
        return clock;
    }
    if (hh < 10)
        clock += "0";
    clock += hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    if (ssFlag) {
        return clock
    }
    clock += ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

export {
    time
}
