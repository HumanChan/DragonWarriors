/**
 * Created by PC on 2016/1/18.
 */
class BaseView extends egret.DisplayObjectContainer {

    public name:string;
    public dataVal:any;
    public disposer:Disposer;

    public constructor(){
        super();
        this.name = egret.getQualifiedClassName(this)+Math.random();
        this.disposer = new Disposer(this);
        this.disposer.addEventListener(this,egret.Event.ADDED_TO_STAGE,this.initialize,this);
    }

    public getDisopser(){
        return this.disposer;
    }

    public initialize():void {
        this.initDisposer();
        this.disposer.removeEventListener(this,egret.Event.ADDED_TO_STAGE,this.initialize,this);
        this.onInit();
    }

    /**
     * 初始化完成之后的回调
     */
    protected onInit():void {
    }

    private initDisposer():void {
        var pDisposer = BaseViewHelper.parentDisposer(this);
        if(pDisposer != null){
            this.disposer.setParent(pDisposer);
            pDisposer.addChild(this.disposer);
        }
    }

    public setName(name:string):void {
        this.name = name;
    }

    public getName() {
        return this.name;
    }

    public dispose():void {
        this.disposer.dispose();
    }
}