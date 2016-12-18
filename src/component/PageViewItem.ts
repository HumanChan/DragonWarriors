/**
 * Created by chanhuman on 16/1/8.
 */

class PageViewItem extends BaseView {

    private _index: number;
    private _onStage: boolean = false;
    private _content:any;
    private _clickCallFun:Function;
    private _clickParams = {context: null, data: null};

    public constructor() {
        super();
    }

    public onInitialize(): void {
        this._onStage = true;
    }

    public setContent(content:BaseView){
        this._content = content;
        this.addChild(content);
    }

    public getContent():any {
        return this._content;
    }

    public get index():number {
        return this._index;
    }

    public set index(index:number) {
        this._index = index;
    }

    public get isOnStage(): boolean {
        return this._onStage;
    }

    public setOnClickCallFun(callFun:Function,context:any,data?:any) {
        this._clickCallFun = callFun;
        this._clickParams.context = context;
        this._clickParams.data = data != null ? data : null;
    }

    public onClick():void {
        if(this._clickCallFun)
            this._clickCallFun.apply(this._clickParams.context,[this._clickParams.data]);
    }

}
