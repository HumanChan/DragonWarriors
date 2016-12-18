

class Main extends BaseView {


    public constructor() {
        super();
    }

    protected onInit(): void {
        GlobalVar.init();
        this.initEvents();
        this.initResConfig();
    }

    private initEvents(): void {
    }

    private removeEvents(): void {
    }

    /**
     * 初始化Resource资源加载库
     */
    private initResConfig(): void {
        var version: string = GlobalVar.version;
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource_" + version + ".json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        Log.debug("Start load [RES] first_load");
        RES.loadGroup("first_load");
    }
    
    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        if (event.groupName == "first_load") {
            Log.debug("Start load [RES] main");
            RES.loadGroup("main");
        } else if (event.groupName == "main") {
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            this.initGameConfig();
        }
    }

    /**
     * 资源组加载进度
     * @param event
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
    }

    /**
     * 资源组加载出错
     * @param event
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {  
    }
    

    /**
     * 初始化游戏配置
     */
    private initGameConfig(): void {
        Log.debug("Start init game config..");

        this.enterGameScene();
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private enterGameScene(): void {
        this.removeEvents();

        var gameScene = new GameScene();
        this.addChild(gameScene);
    }

}


