//默认当月时间方法

let _this = this;

const timeAdd0 = (str) => {
  if (str.length <= 1) {
    str = '0' + str;
  }
  return str
}
export const getInitDay = (flag) => {
  let str, date, nowyear, nowmonth, nextMonth, nowday, oneDay, nextMonthFirstDay, sjc, y, m, d;
  date = new Date();//获取当前时间
  nowyear = date.getFullYear();//获取年（yyyy）
  nowmonth = date.getMonth();//获取月份（0-11，0代表1月）
  if (flag == 'start') {
    nowday = '01' + " ";//获取日
    str = nowyear + "-" + timeAdd0(nowmonth + 1) + "-" + nowday + '00:00:00';
  } else if (flag == 'end') {
    nextMonth = ++nowmonth;
    nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    oneDay = 1000 * 60 * 60 * 24;
    sjc = new Date(nextMonthFirstDay - oneDay);
    y = sjc.getFullYear();
    m = sjc.getMonth();
    d = sjc.getDate();
    str = y + '-' + timeAdd0(m + 1) + '-' + d + ' 23:59:59'
  }
  return str
};

