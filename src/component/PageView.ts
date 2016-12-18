/**
 * Created by chanhuman on 16/1/8.
 */

class PageView extends BaseView {

    private static SCROLL_SPEED = 4;

    private _items:any[];
    private _viewRect:egret.Rectangle;
    private _speed:number;
    private _colum:number;
    private _row:number;
    private _columSpace:number;
    private _rowSpace:number;
    private _padding = {left: 0, right: 0, top: 0, bottom: 0};
    private _view:BaseView;
    private _pageCallBack:Function;
    private _param:any = {context: null, data: null};

    private _pages:any[];
    private _curPageIndex:number;
    private _curPage:any;
    private _tag:number = 0;
    private _useAction:boolean;
    private _bDrag:boolean;
    private _bScroll:boolean;
    private _preTouchPoint:egret.Point = new egret.Point();
    private _startTouchPoint:egret.Point = new egret.Point();
    private _curDistance:egret.Point = new egret.Point();


    /*
    viewRect : 显示方块
    colum    : 列数
    row      : 行数
    columSpace : 列距
    rowSpace   : 行距
    padding    : {left: 0, right: 0, top: 0, bottom: 0}
    useAction  : 开启跟随手指移动的动作
     */
    public constructor(params) {
        super();

        this._bDrag = false;
        this._bScroll = false;
        this._items = [];
        this._pages = [];
        this._viewRect = params.viewRect != null ? params.viewRect : new egret.Rectangle(0, 0, 100, 100);
        this._speed = (this._viewRect.width/PageView.SCROLL_SPEED)/100;
        this._colum = params.colum != null ? params.colum : 1;
        this._row = params.row != null ? params.row : 1;
        this._columSpace = params.columSpace != null ? params.columSpace : 0;
        this._rowSpace = params.rowSpace != null ? params.rowSpace : 0;
        this._padding = params.padding != null ? params.padding : {left: 0, right: 0, top: 0, bottom: 0};
        this._useAction = params.useAction != null ? params.useAction : true;
        this.drawBg();

        this._view = new BaseView;
        this._view.scrollRect = this._viewRect;

        this.addChild(this._view);

        this.touchEnabled = true;
        this.disposer.addEventListener(this,egret.TouchEvent.TOUCH_BEGIN, this.touchBegan, this);
        this.disposer.addEventListener(this,egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
        this.disposer.addEventListener(this,egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        this.disposer.addEventListener(this,egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.touchEnd,this);
    }

    public setScrollEnable(enable:boolean):void {
        this.touchEnabled = enable;
    }

    public get viewRect(){
        return this._viewRect;
    }

    public setOnGoToPageCallBack(callback:Function, context:any, data?:any):void {
        this._pageCallBack = callback;
        this._param.context = context;
        this._param.data = data;
    }

    private onGoToPage(idx:number):void {
        if (this._pageCallBack) {
            this._pageCallBack.apply(this._param.context, [idx,this._param.data]);
        }
    }

    private drawBg():void {
        var bg = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0x000000, 0.001);
        bg.graphics.drawRect(0, 0, this._viewRect.width, this._viewRect.height);
        bg.graphics.endFill();
        bg.width = this._viewRect.width;
        bg.height = this._viewRect.height;
        this.addChild(bg);
    }

    public newItem() {
        var item = new PageViewItem();
        item.width = (this._viewRect.width - this._padding.left - this._padding.right
            - this._columSpace * (this._colum - 1)) / this._colum;
        item.height = (this._viewRect.height - this._padding.top - this._padding.bottom
            - this._rowSpace * (this._row - 1)) / this._row;

        return item;
    }

    public addItem(item:PageViewItem):void {
        this._items.push(item);
        item.index = this._items.length;
    }

    public removeItems(itemIndex: number, count: number = 1): void {
        Log.debug("removeItems1:"+this._items.length);
        this._items.splice(itemIndex,count);
        for (var i = itemIndex + count - 1; i < this._items.length; i++){
            this._items[i].index = i + 1;
        }
        Log.debug("removeItems2:"+this._items.length);
    }

    public getItem(idx:number) {
        return this._items[idx - 1];
    }

    public getItemCount(): number {
        return this._items.length;
    } 

    public reload(index:number = 1):void {
        var page;
        var pageCount:number;
        var idx:number = index;

        this._view.removeChildren();

        pageCount = this.getPageCount();
        if (pageCount < 1)
            return;

        if (index < 1) {
            idx = 1;
        } else if (index > pageCount) {
            idx = pageCount;
        }

        if (pageCount > 0) {
            for (var i = 1,pEnd = pageCount+1; i < pEnd; i++) {
                page = this.createPage(i);
                this._pages.push(page);

                if (i == idx) {
                    this._view.addChild(page);
                    this._curPageIndex = idx;
                }
            }
        }
        this.gotoPage(index);
    }


    private createPage(pageNo:number) {
        var page = new egret.Sprite();

        var item:PageViewItem;
        var beginIdx = this._row * this._colum * (pageNo - 1) + 1;

        var itemW = (this._viewRect.width - this._padding.left - this._padding.right
            - this._columSpace * (this._colum - 1)) / this._colum;
        var itemH = (this._viewRect.height - this._padding.top - this._padding.bottom
            - this._rowSpace * (this._row - 1)) / this._row;

        var bBreak = false;
        for (var row = 1,rEnd = this._row+1; row < rEnd; row++) {
            for (var colum = 1,cEnd = this._colum+1; colum < cEnd; colum++) {
                item = this.getItem(beginIdx);
                beginIdx = beginIdx + 1;
                if (item == null) {
                    bBreak = true;
                    break;
                }
                page.addChild(item);
                item.x = this._padding.left + (colum - 1) * this._columSpace + (colum - 1) * itemW;
                item.y = this._padding.top + (row - 1) * this._rowSpace + (row - 1) * itemH;
            }
            if (bBreak)
                break;
        }
        return page;
    }

    public getPageCount():number {
        return Math.ceil(this._items.length / (this._colum * this._row));
    }

    public getCurPage(){
        return this._pages[this._curPageIndex-1];
    }

    private getPrePage(){
        return (this._curPageIndex > 1) ? this._pages[this._curPageIndex-2] : null;
    }

    private getNextPage(){
        return (this._curPageIndex < this.getPageCount()) ? this._pages[this._curPageIndex] : null;
    }

    private touchBegan(e:egret.TouchEvent):void {
        this._bDrag = true;
        this._preTouchPoint.x = e.stageX;
        this._preTouchPoint.y = e.stageY;
        this._startTouchPoint.x = e.stageX;
        this._startTouchPoint.y = e.stageY;
        this._curDistance.x = 0;
        this._curDistance.y = 0;
    }

    private touchMove(e:egret.TouchEvent):void {
        if(!this._bDrag)
            return;

        var curPoint = new egret.Point(e.stageX, e.stageY);
        var distance = this._preTouchPoint.subtract(curPoint);

        this._preTouchPoint.x = curPoint.x;
        this._preTouchPoint.y = curPoint.y;
        this._curDistance.x = distance.x;
        this._curDistance.y = distance.y;

        if(this._useAction){
            this.movePage(curPoint);
        }
    }

    private movePage(curPoint:egret.Point):void {
        var curPage = this.getCurPage();
        if(!curPage){
            return;
        }
        var tempx = curPage.x;
        curPage.x = curPoint.x - this._startTouchPoint.x;
        var xx = curPage.x - tempx;
        if(this._tag == 0){
            var page;
            var aimPosX;
            var temp = 0;
            if(xx > 0){
                page = this.getPrePage();
                aimPosX = -this._viewRect.width + xx;
                temp = -1;
            }else if(xx < 0){
                page = this.getNextPage();
                aimPosX = this._viewRect.width + xx;
                temp = 1;
            }
            if(page){
                this._view.addChild(page);
                page.x = aimPosX;
                this._tag = temp;
            }
        }else{
            var page;
            if(this._tag == -1){
                page = this.getPrePage();
            }else{
                page = this.getNextPage();
            }
            if(page){
                page.x = page.x + xx;
            }
        }
    }

    private touchEnd(e:egret.TouchEvent):void {
        if (!this._bDrag)
            return;

        if(this._useAction){
            if (this._curDistance.y < 10 && this._curDistance.y > -10) {
                if (this._curDistance.x < -5) {
                    this.setEndPage(-1);
                    return;
                } else if (this._curDistance.x > 5) {
                    this.setEndPage(1);
                    return;
                }
            }
            var dd = this._startTouchPoint.subtract(new egret.Point(e.stageX, e.stageY));
            if (dd.x < -this._viewRect.width * 0.3) {
                this.setEndPage(-1);
            } else if (dd.x > this._viewRect.width * 0.3) {
                this.setEndPage(1);
            } else{
                this.setEndPage(0);
            }
        }else{
            if (this._curDistance.y < 10 && this._curDistance.y > -10) {
                if (this._curDistance.x < -2) {
                    this.scrollToLeft();
                    return;
                } else if (this._curDistance.x > 2) {
                    this.scrollToRight();
                    return;
                }
            }
            var dd = this._startTouchPoint.subtract(new egret.Point(e.localX, e.localY));
            if (dd.y < 10 && dd.y > -10) {
                if (dd.x < -this._viewRect.width * 0.3) {
                    this.scrollToLeft();
                } else if (dd.x > this._viewRect.width * 0.3) {
                    this.scrollToRight();
                }
            }
        }
    }

    private setEndPage(left:number):void {
        if (this._bScroll)
            return;
        this._bScroll = true;
        this._bDrag = false;

        var curPage = this.getCurPage();
        if(!curPage){
            return;
        }

        var prePage = this.getPrePage();
        var nextPage = this.getNextPage();
        if(left == 0){  //回弹
            var tt1 = Math.abs(curPage.x/this._speed);
            egret.Tween.get(curPage).to({x:0},tt1).call(function(){
                this._tag = 0;
                this._bScroll = false;
            },this);
            switch (this._tag){
                case -1:
                    egret.Tween.get(prePage).to({x:-this._viewRect.width},tt1).call(function(){
                        egret.Tween.removeTweens(prePage);
                        this._view.removeChild(prePage);
                    },this);
                    break;
                case 1:
                    egret.Tween.get(nextPage).to({x:this._viewRect.width},tt1).call(function(){
                        egret.Tween.removeTweens(nextPage);
                        this._view.removeChild(nextPage);
                    },this);
                    break;
            }
        }else if(left == -1){  //左
            if(!prePage){
                egret.Tween.get(curPage).to({x:0},Math.abs(curPage.x/this._speed)).call(function(){
                    this._bScroll = false;
                },this);
            }else{
                var dis = this._viewRect.width - curPage.x;
                var t = Math.abs(dis/this._speed);
                egret.Tween.get(curPage).to({x:this._viewRect.width},t).call(function(){
                    egret.Tween.removeTweens(curPage);
                    this._view.removeChild(curPage);
                    this._tag = 0;
                    this._bScroll = false;
                    this._curPageIndex = this._curPageIndex - 1;
                    this.onGoToPage(this._curPageIndex);
                },this);
                egret.Tween.get(prePage).to({x:0},t);
            }
        }else if(left == 1){  //右
            if(!nextPage){
                egret.Tween.get(curPage).to({x:0},Math.abs(curPage.x/this._speed)).call(function(){
                    this._bScroll = false;
                },this);
            }else{
                var dis = -this._viewRect.width - curPage.x;
                var t = Math.abs(dis/this._speed);
                egret.Tween.get(curPage).to({x:-this._viewRect.width},t).call(function(){
                    egret.Tween.removeTweens(curPage);
                    this._view.removeChild(curPage);
                    this._tag = 0;
                    this._bScroll = false;
                    this._curPageIndex = this._curPageIndex + 1;
                    this.onGoToPage(this._curPageIndex);
                },this);
                egret.Tween.get(nextPage).to({x:0},t);
            }
        }
    }

    public gotoPage(pageIdx:number,action?:boolean) {
        if (pageIdx < 1 || pageIdx > this.getPageCount())
            return;
        if (this._curPageIndex == null)
            this._curPageIndex = 1;
        if (pageIdx != this._curPageIndex) {
            var page = this._pages[pageIdx - 1];
            if (pageIdx > this._curPageIndex) {
                this.scrollToRight(page,action,pageIdx);
            } else {
                this.scrollToLeft(page,action,pageIdx);
            }
        }

    }

    public goToPrePage():void {
        if (this._curPageIndex == 1)
            return;

        this.scrollToLeft(this._pages[this._curPageIndex - 2]);
    }

    public goToNextPage():void {
        if (this._curPageIndex == this.getPageCount())
            return;

        this.scrollToRight(this._pages[this._curPageIndex]);
    }

    private scrollToLeft(page?:egret.DisplayObject,action?:boolean,pageIdx?:number):void {
        if (this._bScroll)
            return;

        if (this._curPageIndex == 1)
            return;
        this._bScroll = true;
        this._bDrag = false;
        var page:egret.DisplayObject = page != null ? page : this._pages[this._curPageIndex - 2];
        var curPage = this._pages[this._curPageIndex - 1];

        page.x = -this._viewRect.width;
        this._view.addChild(page);
        var t = Math.abs((this._viewRect.width - curPage.x)/this._speed);
        if(action == false){
            t = 0;
        }
        egret.Tween.get(curPage).to({x: this._viewRect.width}, t).call(function () {
            egret.Tween.removeTweens(curPage);
            this._view.removeChild(curPage);
            this._bScroll = false;
            if(pageIdx){
                this._curPageIndex = pageIdx;
            }else{
                this._curPageIndex = this._curPageIndex - 1;
            }
            this.onGoToPage(this._curPageIndex);
        }, this);
        egret.Tween.get(page).to({x: 0}, t);
    }

    private scrollToRight(page?:egret.DisplayObject,action?:boolean,pageIdx?:number):void {
        if (this._bScroll)
            return;

        if (this._curPageIndex == this.getPageCount())
            return;

        this._bScroll = true;
        this._bDrag = false;
        var page:egret.DisplayObject = page != null ? page : this._pages[this._curPageIndex];
        var curPage = this._pages[this._curPageIndex - 1];

        page.x = this._viewRect.width;
        this._view.addChild(page);
        var t = Math.abs((-this._viewRect.width - curPage.x)/this._speed);
        if(action == false){
            t = 0;
        }
        egret.Tween.get(curPage).to({x: -this._viewRect.width}, t).call(function () {
            egret.Tween.removeTweens(curPage);
            this._view.removeChild(curPage);
            this._bScroll = false;
            if(pageIdx){
                this._curPageIndex = pageIdx;
            }else{
                this._curPageIndex = this._curPageIndex + 1;
            }
            this.onGoToPage(this._curPageIndex);
        }, this);
        egret.Tween.get(page).to({x: 0}, t);
    }

    public clearAll():void {
        this._items = [];
        this._pages = [];
        this._curPageIndex = null;
        this._preTouchPoint.x = 0;
        this._preTouchPoint.y = 0;
        this._startTouchPoint.x = 0;
        this._startTouchPoint.y = 0;
        this._curDistance.x = 0;
        this._curDistance.y = 0;
        this._view.removeChildren();
    }

}