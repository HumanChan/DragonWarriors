/**
 *
 * @author 
 *
 */
class LayerManager {
    private static _instance: LayerManager;
    public static getInstance(): LayerManager {
        if (!this._instance) {
            this._instance = new LayerManager();
        }
        return this._instance;
    }
    public constructor() {
    }

    //页面层
    public pageLayer: BaseLayer;
    //战斗层
    public fightLayer: FightPage;
    //上层功能菜单层
    public menuLayer: BaseLayer;
    //窗口层
    public winLayer: BaseLayer;
    //引导层
    public guideLayer: BaseLayer;
    //飘字提示层
    public tipsLayer: BaseLayer;
    //最顶层层
    public topLayer: BaseLayer;

    public init(rootBase: BaseView): void {

        this.pageLayer = new BaseLayer();
        rootBase.addChild(this.pageLayer);

        this.fightLayer = new FightPage();
        rootBase.addChild(this.fightLayer);

        this.menuLayer = new BaseLayer();
        rootBase.addChild(this.menuLayer);

        this.winLayer = new BaseLayer();
        rootBase.addChild(this.winLayer);

        this.guideLayer = new BaseLayer();
        rootBase.addChild(this.guideLayer);

        this.tipsLayer = new BaseLayer();
        rootBase.addChild(this.tipsLayer);

        this.topLayer = new BaseLayer();
        rootBase.addChild(this.topLayer);

    }

}
