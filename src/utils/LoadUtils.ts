/**
 *
 * @author 
 *
 */
class LoadUtils {
    private static _instance: LoadUtils;
    public static getInstance(): LoadUtils {
        if (this._instance == null)
            this._instance = new LoadUtils();
        return this._instance;
    }

    private configs: Array<any>;
    private loadList: Array<any>;
    private currLoadData: Object;
    private isLoading: boolean;
    private countGroupError: number;

    public constructor() {
        this.configs = [];
        this.loadList = [];
    }

    private backFun: Function;
    private backObj: any;
    private progressFun: Function;

    /**
     * 加载单个资源组
     * @param resName_  资源组名
     * @param backFun_ 加载完成后的回调函数
     * @param backObj_ 加载完成后的回调对象
     * @param backData_ 加载完成后的回调参数
     */
    public loadRes(resName_: string, backFun_: Function = null, backObj_: any = null, backData_: any = null, $isPro?: boolean): void {

        var isExist: boolean = false;
        var arrayLength: number = this.loadList.length;
        for (var i = 0; i < arrayLength; i++) {
            if (this.loadList[i]["resName"] == resName_) {
                isExist = true;
            }
        }
        if (isExist == true) {
            Log.log(resName_ + "在加载列表中已存在");
            return;
        }
        this.loadList.push({ resName: resName_, backObj: backObj_, backFun: backFun_, backData: backData_, isPro: $isPro });

        this.startLoad();
    }

    public startLoad(): void {
        if (this.isLoading != true) {
            if (this.loadList.length > 0) {
                this.initEvents();
                this.isLoading = true;
                this.countGroupError = 0;
                this.currLoadData = this.loadList.shift();
                RES.loadGroup(this.currLoadData["resName"]);
            }
        }
    }

    private initEvents(): void {
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    }

    private removeEvents(): void {
        RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
    }

    private onResourceLoadError(e: RES.ResourceEvent): void {
        if (++this.countGroupError < 3) {
            RES.loadGroup(e.groupName);
        } else {
            // GlobalView.openAlert(e.groupName + "资源加载失败,请刷新重试", function (): void {
            //     location.reload(false);
            // });
        }
    }

    private onResourceProgress(e: RES.ResourceEvent): void {
        if (e.groupName == this.currLoadData["resName"]) {
            if (this.currLoadData["isPro"]) {
            }
        }
    }

    private onResourceLoadComplete(e: RES.ResourceEvent): void {
        Log.log("加载 " + e.groupName + "完成");
        if (e.groupName == this.currLoadData["resName"]) {
            this.removeEvents();
            if (this.currLoadData["backFun"] != null) {
                var isCall: boolean = true;
                var backObj = this.currLoadData["backObj"];
                if (isCall == true) {
                    this.currLoadData["backFun"].apply(backObj, [this.currLoadData["backData"]]);
                }
            }
            this.isLoading = null;
            this.startLoad();
        }
    }

    /**
     * 同时加载多个
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadCustomGroups($groupName: string, $subGroups: string[], $onResourceLoadComplete: Function, $onResourceLoadTarget: any, $isPro?: boolean): void {
        RES.createGroup($groupName, $subGroups, true);
        this.loadRes($groupName, $onResourceLoadComplete, $onResourceLoadTarget, null, $isPro);
    }

    /**
     *加载资源，如果有资源的了话马上返回，如果没有，则异步加载之后回调(回调参数是加载的资源)
     */
    public getRes(name: string, callback?: Function, thisObject?: any) {
        var res = RES.getRes(name);
        if (!res) {
            GlobalRes.getResAsync(name, function () {
                if (callback) {
                    var r = RES.getRes(name);
                    callback.apply(thisObject, [r]);
                }
            }, this);
        } else {
            return res;
        }
    }

}
