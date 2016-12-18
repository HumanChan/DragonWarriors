/**
 *
 * @author 
 *
 */
module StringUtils {

	/**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    export function trimSpace(str: string): string {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');
    }

    /**
     * 字符串是否为空
     */
    export function isEmpty(s: string): boolean {
        return (s == null) || (s.length == 0);
    }

    /**
     * 检查名字是否合法
     * 如果测试到的字符串中还有非法字符 返回false
     */
    export function nameCheck(txt: string): boolean {
        var pattern: RegExp = /^([\u4e00-\u9fa5]|[A-Za-z0-9])+$/g;
        if (!pattern.test(txt) == true) {
            return false;
        }
        return true;
    }

    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    export function getStringLength(str: string): number {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (RegUtils.isChinese(s)) {
                length += 3;
            } else {
                length += 1;
            }
        }
        return length;
    }

    /**
     * 数字转换为段位 */
    export function numberToStage(num: number): string {
        var msg: string = '';
        switch (num) {
            case 0:
                msg = "无段位";
                break;
            case 1:
                msg = "青铜";
                break;
            case 2:
                msg = "白银";
                break;
            case 3:
                msg = "黄金";
                break;
            case 4:
                msg = "白金";
                break;
            case 5:
                msg = "忍币";
                break;
            case 6:
                msg = "大师";
                break;
            case 7:
                msg = "王者";
                break;
        }
        return msg;
    }

    /**
     * 数字转换为星级 */
    export function starToChinese(star: number): string {
        var msg: string = '';
        switch (star) {
            case 1:
                msg = "一星";
                break;
            case 2:
                msg = "二星";
                break;
            case 3:
                msg = "三星";
                break;
            case 4:
                msg = "四星";
                break;
            case 5:
                msg = "五星";
                break;
            case 6:
                msg = "六星";
                break;
            case 7:
                msg = "七星";
                break;
        }
        return msg;
    }

    /**
     * 通过属性值转换成字符串名字
     * @param value
     */
    export function attrValueToStringName(value: number): string {
        var msg: string = '';
        switch (value) {
            case 1:
                msg = "生命";
                break;
            case 2:
                msg = "攻击";
                break;
            case 3:
                msg = "护甲";
                break;
            case 4:
                msg = "破甲";
                break;
            case 5:
                msg = "命中";
                break;
            case 6:
                msg = "闪避";
                break;
            case 7:
                msg = "暴击";
                break;
            case 8:
                msg = "韧性";
                break;
            case 51:
                msg = "初始怒气";
                break;
        }
        return msg;
    }

    export function attrValueToKey(value: number): string {
        var msg: string = '';
        switch (value) {
            case 1:
                msg = "hp";
                break;
            case 2:
                msg = "att";
                break;
            case 3:
                msg = "def";
                break;
            case 4:
                msg = "armor";
                break;
            case 5:
                msg = "hit";
                break;
            case 6:
                msg = "dodge";
                break;
            case 7:
                msg = "crit";
                break;
            case 8:
                msg = "tough";
                break;
            case 51:
                msg = "anger";
                break;
        }
        return msg;
    }

    /**
     * 章节转换为汉字 */
    export function chapterToChinese(idx: number): string {
        var strList: Array<string> = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五'];
        return strList[idx];
    }

    /**
     * 数字转换为中文 */
    export function numberToChinese(num: number) {
        var chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
        var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
        var chnUnitChar = ["", "十", "百", "千"];
        function SectionToChinese(section) {
            var strIns = '', chnStr = '';
            var unitPos = 0;
            var zero = true;
            while (section > 0) {
                var v = section % 10;
                if (v === 0) {
                    if (!zero) {
                        zero = true;
                        chnStr = chnNumChar[v] + chnStr;
                    }
                } else {
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        }
        var unitPos = 0;
        var strIns = '', chnStr = '';
        var needZero = false;
        if (num === 0) {
            return chnNumChar[0];
        }
        while (num > 0) {
            var section = num % 10000;
            if (needZero) {
                chnStr = chnNumChar[0] + chnStr;
            }
            strIns = SectionToChinese(section);
            strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
            chnStr = strIns + chnStr;
            needZero = (section < 1000) && (section > 0);
            num = Math.floor(num / 10000);
            unitPos++;
        }
        return chnStr;
    }

    /**将过亿的数字转为文字 */
    export function numberToChinese2(num: number): string {
        var norm: number = 100000000;
        if (num > norm) {
            return Math.floor(num / norm * 100) / 100 + '亿';
        } else if (num == norm) {
            return '1亿';
        } else {
            return num + '';
        }
    }
}
