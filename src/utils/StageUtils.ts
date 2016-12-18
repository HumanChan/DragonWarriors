/**
 *
 * @author 
 *
 */
class StageUtils {
    private static _instance: StageUtils;
    public static getInstance(): StageUtils {
        if(this._instance == null)
            this._instance = new StageUtils();
        return this._instance;
    }
    
    //当前舞台
    public curStage: egret.Stage;
    //当前游戏宽度
    public width:number;
    //当前游戏高度
    public height:number;
    //当前游戏中心点X
    public cx:number;
    //当前游戏中心点Y
    public cy:number;
    //窗口的长宽比
    public ratio:number;
    
	public constructor() {
        this.curStage = egret.MainContext.instance.stage;
        this.width = this.curStage.stageWidth;
        this.height = this.curStage.stageHeight;
        this.cx = this.width/2;
        this.cy = this.height/2;
        this.ratio = this.height/this.width;
	}
	
    
    //设置帧频
    public setFrameRate(value: number): void {
        this.curStage.frameRate = value;
    }
    
    //设置适配方式
    public setScaleMode(value: string): void {
        this.curStage.scaleMode = value;
    }
    
    /**
     * 锁屏
     */
    public lock(): void {
        this.curStage.touchEnabled = false;
        this.curStage.touchChildren = false;
    }

    /**
     * 解屏
     */
    public unlock(): void {
        this.curStage.touchEnabled = true;
        this.curStage.touchChildren = true;
    }
    
    public dirtyRegionPolicyOff():void{
        this.curStage.dirtyRegionPolicy = egret.DirtyRegionPolicy.OFF; 
    }
    
    public dirtyRegionPolicyOn(): void {
        this.curStage.dirtyRegionPolicy = egret.DirtyRegionPolicy.ON;
    }
    
}
