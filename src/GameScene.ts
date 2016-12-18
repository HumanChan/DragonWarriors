/**
 *
 * @author 
 *
 */
class GameScene extends BaseView {

    public constructor() {
        super();
    }

    protected onInit(): void {
        Log.debug("Enter Game Scene");
        this.initEvent();
        Cache.getInstance().init();
        SoundManager.getInstance().init();
        LayerManager.getInstance().init(this);
    }

    private initEvent(): void {
        if (DeviceUtils.IsMobile() == true) {
            egret.MainContext.instance.stage.addEventListener(egret.Event.ACTIVATE, this.onAppActivate, this);
            egret.MainContext.instance.stage.addEventListener(egret.Event.DEACTIVATE, this.onAppDeactivate, this);
        }
    }

    private onAppActivate() {

    }

    private onAppDeactivate(): void {

    }



}
