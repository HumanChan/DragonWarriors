/**
 *
 * @author 
 *
 */
class TimerManager {
    private static _instance: TimerManager;
    public static getInstance(): TimerManager {
        if(this._instance == null)
            this._instance = new TimerManager();
        return this._instance;
    }
    
    private _handlers: Array<TimerVO>;
    private _delHandlers: Array<TimerVO>;
    private _currTime: number;
    private _currFrame: number;
    private _count: number;
    private _timeScale: number;

    public constructor() {
        this.init();
        egret.startTick(this.onEnterFrame,this);
    }
    
    private init():void{
        this._handlers = [];
        this._delHandlers = [];
        this._count = 0;
        this._currFrame = 0;
        this._timeScale = 1;
        this._currTime = 0;
    }

    /**
     * 设置时间参数
     * @param timeScale
     */
    public setTimeScale(timeScale: number): void {
        this._timeScale = timeScale;
    }

    /**
     * 每帧执行函数
     * @param frameTime
     */
    private onEnterFrame(dt: number): boolean {
        var self = this;
        self._currFrame++;
        self._currTime = dt;
        for(var i: number = 0;i < self._count;i++) {
            var handler: TimerVO = self._handlers[i];
            var t: number = handler.userFrame ? self._currFrame : self._currTime;
            if(t >= handler.exeTime) {
                handler.method.call(handler.methodObj);
                handler.dealTime = self._currTime;
                handler.exeTime += handler.delay;
                if(handler.repeatCount > 0){
                    handler.repeatCount--;
                    if(handler.repeatCount < 1) {
                        self._delHandlers.push(handler);
                    }
                }  
            }
        }
        while(self._delHandlers.length) {
            var handler: TimerVO = self._delHandlers.pop();
            self.remove(handler.method,handler.methodObj);
        }
        self._delHandlers = [];
        
        return true;
    }

    private create(useFrame: boolean,delay: number,repeatCount: number,method: Function,methodObj: any): void {
        //参数监测
        if(delay < 0 || repeatCount < 0 || method == null) {
            return;
        }
        
        //先删除相同函数的计时
        this.remove(method,methodObj);

        //创建
        var handler: TimerVO = new TimerVO();
        //var handler: TimerVO = ObjectPoolManager.getInstance().pop("TimerVO");
        handler.userFrame = useFrame;
        handler.repeatCount = repeatCount;
        handler.delay = delay;
        handler.method = method;
        handler.methodObj = methodObj;
        handler.exeTime = delay + (useFrame ? this._currFrame : this._currTime);
        handler.dealTime = this._currTime;
        this._handlers.push(handler);
        this._count++;
    }

    /**
     *
     * 定时执行
     * @param delay 执行间隔:毫秒
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    public doTimer(delay: number,repeatCount: number,method: Function,methodObj: any): void {
        this.create(false,delay,repeatCount,method,methodObj);
    }

    /**
     *
     * 定时执行
     * @param delay 执行间隔:帧频
     * @param repeatCount 执行次数, 0为无限次
     * @param method 执行函数
     * @param methodObj 执行函数所属对象
     * @param complateMethod 完成执行函数
     * @param complateMethodObj 完成执行函数所属对象
     *
     */
    public doFrame(delay: number,repeatCount: number,method: Function,methodObj: any): void {
        this.create(true,delay,repeatCount,method,methodObj);
    }

    /**
     * 定时器执行数量
     * @return
     *
     */
    public get count(): number {
        return this._count;
    }

    /**
     * 清理
     * @param method 要移除的函数
     * @param methodObj 要移除的函数对应的对象
     */
    public remove(method: Function,methodObj: any): void {
        for(var i: number = 0;i < this._count;i++) {
            var handler: TimerVO = this._handlers[i];
            if(handler.method == method && handler.methodObj == methodObj) {
                handler.clear();
                handler = null;
                //ObjectPoolManager.getInstance().push(handler);
                this._handlers.splice(i,1);
                this._count--;
                break;
            }
        }
    }

    /**
     * 清理
     * @param methodObj 要移除的函数对应的对象
     */
    public removeAllByObj(methodObj: any): void {
        for(var i: number = 0;i < this._count;i++) {
            var handler: TimerVO = this._handlers[i];
            if(handler.methodObj == methodObj) {
                handler.clear();
                handler = null;
                //ObjectPoolManager.getInstance().push(handler);
                this._handlers.splice(i,1);
                this._count--;
                i--;
            }
        }
    }
    
    public removeAll(): void {
        for(var i: number = 0;i < this._count;i++) {
            var handler: TimerVO = this._handlers[i];
            if(handler){
                handler.clear();
                handler = null;
            }
        }
        this.init();
    }


    /**
     * 检测是否已经存在
     * @param method
     * @param methodObj
     *
     */
    public isExists(method: Function,methodObj: any): boolean {
        for(var i: number = 0;i < this._count;i++) {
            var handler: TimerVO = this._handlers[i];
            if(handler.method == method && handler.methodObj == methodObj) {
                return true;
            }
        }
        return false;
    }
}

