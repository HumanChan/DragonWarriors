/**
 *
 * @author 
 * 全局变量
 */

module GlobalVar {

	export var version:string = "0";

    /**debug等级   <2|常规log  <3|警告   =3|常规debug  错误log默认打印 */
    export var debugLv: number = 3;

    export var stageWith: number = 480;

    export var stageHeight: number = 800;

    export var cx: number = 240;

    export var cy: number = 400;

    export function init(): void {
        var stageUtils = StageUtils.getInstance();
        stageWith = stageUtils.width;
        stageHeight = stageUtils.height
        cx = stageUtils.cx;
        cy = stageUtils.cy;
    }

}
