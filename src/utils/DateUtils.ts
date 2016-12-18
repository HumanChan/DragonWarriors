/**
 *
 * @author 
 *
 */
module DateUtils {

	/**
     * 根据秒数格式化字符串
     * @param second 秒数
     * @param type 1:00:00:00   2:00:00  3：XX天XX时XX分XX秒  4:xx天前，xx小时前，xx分钟前  5:yyyy-mm-dd h:m:s    6:xx天，xx小时，xx分钟  ，xx秒   
     * @return
     *
     */
    export function getFormatBySecond(second: number, type: number = 1): string {
        var str: string = "";
        switch (type) {
            case 1:
                str = this.getFormatBySecond1(second);
                break;
            case 2:
                str = this.getFormatBySecond2(second);
                break;
            case 3:
                str = this.getFormatBySecond3(second);
                break;
            case 4:
                str = this.getFormatBySecond4(second);
                break;
            case 5:
                str = this.getFormatBySecond5(second);
                break;
            case 6:
                str = this.getFormatBySecond6(second);
                break;
        }
        return str;
    }

    //1: 00:00:00
    export function getFormatBySecond1(t: number = 0): string {
        var hourst: number = Math.floor(t / 3600);
        var hours: string;
        if (hourst == 0) {
            hours = "00";
        } else {
            if (hourst < 10)
                hours = "0" + hourst;
            else
                hours = "" + hourst;
        }
        var minst: number = Math.floor((t - hourst * 3600) / 60);
        var secondt: number = Math.floor((t - hourst * 3600) % 60);
        var mins: string;
        var sens: string;
        if (minst == 0) {
            mins = "00";
        } else if (minst < 10) {
            mins = "0" + minst;
        } else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        } else if (secondt < 10) {
            sens = "0" + secondt;
        } else {
            sens = "" + secondt;
        }
        return hours + ":" + mins + ":" + sens;
    }

    //2: 00:00
    export function getFormatBySecond2(t: number = 0): string {
        var hourst: number = Math.floor(t / 3600);
        var minst: number = Math.floor((t - hourst * 3600) / 60);
        var secondt: number = Math.floor((t - hourst * 3600) % 60);
        var mins: string;
        var sens: string;
        if (minst == 0) {
            mins = "00";
        } else if (minst < 10) {
            mins = "0" + minst;
        } else {
            mins = "" + minst;
        }
        if (secondt == 0) {
            sens = "00";
        } else if (secondt < 10) {
            sens = "0" + secondt;
        } else {
            sens = "" + secondt;
        }
        return mins + ":" + sens;
    }

    //XX天XX时XX分XX秒
    export function getFormatBySecond3(t: number = 0): string {
        var day: number = Math.floor(t / (60 * 60 * 24)); //天
        var left: number = t - day * 60 * 60 * 24;

        var hour: number = Math.floor(left / (60 * 60)); //时
        left = left - hour * 60 * 60;

        var minute: number = Math.floor(left / 60); //分
        left = left - minute * 60; //秒

        var timeStr: string;
        if (day == 0 && hour == 0 && minute == 0) {
            timeStr = left + "秒";
        } else if (day == 0 && hour == 0) {
            timeStr = minute + "分" + left + "秒";
        } else if (day == 0) {
            timeStr = hour + "时" + minute + "分" + left + "秒";
        } else {
            timeStr = day + "天" + hour + "时" + minute + "分" + left + "秒";
        }
        return timeStr;
    }

    //4:xx天前，xx小时前，xx分钟前
    export function getFormatBySecond4(time: number): string {
        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "天前";
            }
            else {
                return t + "小时前";
            }
        }
        else {
            return Math.floor(time / 60) + "分钟前";
        }
    }

    //5:yyyy-mm-dd h:m:s
    export function getFormatBySecond5(time: number): string {
        var date: Date = new Date(time);
        var year: number = date.getFullYear();
        var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        var day: number = date.getDate();
        var hours: number = date.getHours();
        var minute: number = date.getMinutes();
        var second: number = date.getSeconds();
        return year + "-" + month + "-" + day + "  " + hours + ":" + minute + ":" + second;

    }

    //4:xx天前，xx小时前，xx分钟前
    export function getFormatBySecond6(time: number): string {

        var t = Math.floor(time / 3600);
        if (t > 0) {
            if (t > 24) {
                return Math.floor(t / 24) + "天";
            }
            else {
                return t + "小时";
            }
        } else {
            if (time > 60) {
                return Math.floor(time / 60) + "分钟";
            } else {
                return time + "秒";
            }
        }
    }

    export function getFormatBySecond7(): string {
        var currDate = new Date();
        var hours: number = currDate.getHours();
        var minutes: number = currDate.getMinutes();
        var seconds: number = currDate.getSeconds();

        var timeStr: string = '';
        if (hours == 0) {
            timeStr = timeStr + "00:";
        } else if (hours < 10) {
            timeStr = timeStr + "0" + hours + ":";
        } else {
            timeStr = timeStr + hours + ":";
        }
        if (minutes == 0) {
            timeStr = timeStr + "00:";
        } else if (minutes < 10) {
            timeStr = timeStr + "0" + minutes + ":";
        } else {
            timeStr = timeStr + minutes + ":";
        }

        if (seconds == 0) {
            timeStr = timeStr + "00";
        } else if (seconds < 10) {
            timeStr = timeStr + "0" + seconds;
        } else {
            timeStr = timeStr + seconds;
        }
        return timeStr;
    }
}
