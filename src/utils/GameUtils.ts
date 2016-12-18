/**
 *
 * @author 
 *
*/

module GameUtils{
    
    //深度复制<array和object>
    export function copyData(obj: any): any {
        var newObj;
        if(obj instanceof Array) {
            newObj = [];
        }
        else if(obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for(var i: number = 0,len = keys.length;i < len;i++) {
            var key = keys[i];
            newObj[key] = this.copyData(obj[key]);
        }
        return newObj;
    }
    
    //格式化数字
    export function transFormNum(num):string{
        var numStr:string;
        var w: number = 1000000 //万
        var y: number = 100000000 //亿 
        if(num < w){
            return num+"";
        }
        if(num >= y){
            numStr = Math.floor(num / y) + "亿";
        }else{
            if(num >= w){
                var ww: number = Math.floor(num / (w / 100))
                var qq: number = Math.floor((num - ww * 10000) / 1000)
                if(qq == 0){
                    numStr = ww + "万";
                }else{
                    numStr = ww + "." + qq + "万";
                }
            }
        }
        
        return numStr;
    }
    
    /**
     * 读取cookie
     */
    export function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if(arr != null) {
            return decodeURIComponent(arr[2]);
        } else {
            return null;
        }
    }   
    
    /**
     * 获取当前地址
    */
    export function getCurUrl(): string {
        if (window && window.location && window.location.href) {
            return window.location.href;
        }else{
            return '';
        }
    }

    /** 
     * 读取url参数
    */
    export function getQueryString($name):string{
        var m = [];
        var r = new RegExp("(\\?|#|&)" + $name + "=([^&#]*)(&|#|$)");
        var currUrl:string = getCurUrl();
        if(currUrl != ''){
            m = currUrl.match(r);
        }
        if(m){
            return decodeURIComponent(m[2]);
        }else{
            return '';
        } 
    }

    export function numberToChinese(num: number) {
        var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
        var chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
        var chnUnitChar = ["", "十", "百", "千"];
        function SectionToChinese(section){
            var strIns = '', chnStr = '';
            var unitPos = 0;
            var zero = true;
            while(section > 0){
                var v = section % 10;
                if(v === 0){
                if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                }
                }else{
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
        if(num === 0){
            return chnNumChar[0];
        }
        while(num > 0){
            var section = num % 10000;
            if(needZero){
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
    
}
