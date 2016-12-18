/**
 *
 * @author 
 *
 */
class TimerVO {
    /**执行间隔*/
    public delay: number = 0;
    /**重复执行次数,0|永远重复执行 1|执行一次*/
    public repeatCount: number = 0;
    /**是否用帧率*/
    public userFrame: boolean;
    /**执行时间*/
    public exeTime: number = 0;
    /**处理函数*/
    public method: Function;
    /**处理函数所属对象*/
    public methodObj: any;
    /**上次的执行时间*/
    public dealTime: number = 0;

    /**清理*/
    public clear(): void {
        this.method = null;
        this.methodObj = null;
    }
    
	public constructor() {
	}
}
