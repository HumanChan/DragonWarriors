/**
 *
 * @author 
 *
 */
module MathUtils {

    // 把字符串转成整数数据类型。而不会出现NaN
    export function toInt(v: string): number {
        var t: number = parseInt(v);
        if(isNaN(t)) return 0;
        return t;
    }
    
    // 把字符串转成浮点数据类型。而不会出现NaN
    export function toFloat(v: string): number {
        var t: number = parseFloat(v);
        if(isNaN(t)) return 0;
        return t;
    }
    
    /** 
       * 获取整数随机数。随机范围是min到min+dis（不含）之间。
       * @param min 最小值 
       * @param dis 随机范围(应该是一个大于0的值)
   */
    export function rand(min: number,dis: number): number {
        return (Math.random() * dis + min) >> 0;
    }
    
    /** 
        * 获取整数随机数。随机范围是min到max（不含）之间。
        * @param min 最小值 
        * @param dis 最大值
    **/
    export function rand2(min: number,max: number): number {
        return (Math.random() * (max - min) + min) >> 0;
    }
    
    //弧度制转换为角度值
    export function getAngle(radian: number): number {
        return 180 * radian / Math.PI;
    }
    
    //获取两点间角度  
    export function getAngle2(p1X: number,p1Y: number,p2X: number,p2Y: number): number {
        var xdis: number = p2X - p1X;
        var ydis: number = p2Y - p1Y;
        return Math.atan2(ydis,xdis) * 180 / Math.PI;
    }
    
    //角度值转换为弧度制
    export function getRadian(angle: number): number {
        return Math.PI = angle / 180 * Math.PI;
    }

    //获取两点间弧度
    export function getRadian2(p1X: number,p1Y: number,p2X: number,p2Y: number): number {
        var xdis: number = p2X - p1X;
        var ydis: number = p2Y - p1Y;
        return Math.atan2(ydis,xdis);
    }

    //获取两点间距离
    export function getDistance(p1X: number,p1Y: number,p2X: number,p2Y: number): number {
        var disX: number = p2X - p1X;
        var disY: number = p2Y - p1Y;
        var disQ: number = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    }

    /**
     * 计算战力
     * @param b
     * @returns {number}
     */
    export function calculateCombat(b:number[]):number {
        //基础战力 = （生命/12）+（攻击/2）+（防御/2）+（破甲/2）+（命中/100000*攻击/2）+（闪避/100000*生命/12）+（暴击/100000*1.5*攻击/2）+（韧性/100000*生命/12）
        var result = b[0]/12+b[1]/2+b[2]/2+b[3]/2+((b[4]/100000)*b[1]/2)+((b[5]/100000)*b[0]/12)+((b[6]/100000)*1.5*b[1]/2)+((b[7]/100000)*b[0]/12);
        result = Math.floor(result);
        return result;
    }

    /**
     * 计算卡牌属性
     * @param attr0
     * @param attr1
     * @param attr2
     * @param tp
     * @param tc
     * @param zp
     * @param zc
     * @returns {number}
     */
    export function calculateCardAttr(attr0:number,attr1:number,attr2:number,tp:number,tc:number,zp:number,zc:number,jx:number,qmd:number,zz:number,hh:number):number {
        //卡牌属性 = [ 卡牌本身属性 + 亲密度属性 + 卡牌升级属性 + （卡牌突破属性 + 卡牌进阶属性）* (100+卡牌天赋百分比属性)/100 ] * (100+卡牌组合技百分比属性)/100 + 卡牌天赋固定值属性 + 卡牌组合技固定值加成 + 卡牌觉醒属性 + 全身精炼加成属性 + 助阵加成 + 幻化加成
        var p1 = (100+tp)/100;
        var p2 = (100+zp)/100;
        var result = (attr0+qmd+attr1+attr2*p1)*p2+tc+zc+jx+zz+hh;
        return Math.floor(result);
    }

}
