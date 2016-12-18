/**
 * Created by chanhuman on 16/1/8.
 */
class ListView extends BaseView {

    public static DIRECTION_VERTICAL = "DIRECTION_VERTICAL";
    public static DIRECTION_HORIZONTAL = "DIRECTION_HORIZONTAL";

    public static ALIGNMENT_LEFT = 1;
    public static ALIGNMENT_CENTER = 2;
    public static ALIGNMENT_RIGHT = 3;

    private _bg: egret.Shape;
    public _scrollView: egret.ScrollView;
    private _view: BaseView;
    private _direction: string;
    private _alignment: number;
    private _height: number;
    private _width: number;
    private _itemSize: egret.Point;
    private _itemSpace: number = 0;
    private _items: any[] = [];
    private _itemCount: number = 0;
    private _startPosX: number = 0;

    private _curStartPoint: egret.Point;

    /*
    width:列表宽度
    height:列表高度
    itemSize:item大小 (point)
    itemSpace:列表间隙
    direction:列表走向
    alignment:对齐方式（只对垂直列表起作用）
     */
    public constructor(params) {
        super();
        this._scrollView = new egret.ScrollView();
        this._scrollView.bounces = false;
        this._width = params.width || 0;
        this._height = params.height || 0;
        this._itemSize = params.itemSize || new egret.Point(10, 10);
        this._itemSpace = params.itemSpace || 0;
        this.setDirection(params.direction || ListView.DIRECTION_VERTICAL);
        this.addBg();

        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            this._curStartPoint = new egret.Point(0, this._height >> 1);
            if (params.startPosX) {
                this._startPosX = params.startPosX;
                this._curStartPoint.x = params.startPosX;
                this._width = this._width - params.startPosX;
            }
        } else {
            switch (params.alignment) {
                case ListView.ALIGNMENT_LEFT:
                    this._alignment = ListView.ALIGNMENT_LEFT;
                    this._curStartPoint = new egret.Point(0, 0);
                    break;
                case ListView.ALIGNMENT_RIGHT:
                    this._alignment = ListView.ALIGNMENT_RIGHT;
                    this._curStartPoint = new egret.Point(this._width, 0);
                    break;
                case ListView.ALIGNMENT_CENTER:
                    this._alignment = ListView.ALIGNMENT_CENTER;
                    this._curStartPoint = new egret.Point(this._width >> 1, 0);
                    break;
                default:
                    this._curStartPoint = new egret.Point(this._width >> 1, 0);
            }
        }

        this._scrollView.width = this._width;
        this._scrollView.height = this._height;
        this._view = new BaseView();
        this._view.disposer.parent = this.disposer;
        this.disposer.addChild(this._view.disposer);

        this._scrollView.setContent(this._view);
        this.addChild(this._scrollView);

        this._itemCount = 0;
        this._items = [];

    }

    public dispose() {
        this._scrollView.removeContent();
        this._view.dispose();
        super.dispose();
    }

    public setSize(width: number, height: number) {
        this.x = this.x - (width - this._width) * 0.5;
        this.y = this.y - (height - this._height) * 0.5;

        this._width = width;
        this._height = height;
        this._scrollView.width = this._width;
        this._scrollView.height = this._height;
        this.reDrawBg();
        this.refresh();
    }

    public scrollToTop(): void {
        this._scrollView._onScrollFinished();
        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            this._scrollView.setScrollLeft(0, 0);
        } else {
            this._scrollView.setScrollTop(0, 0);
        }
    }

    public scrollToBottom(): void {
        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            var width = this.count * this._itemSize.x - this._width + this._startPosX;
            this._scrollView.setScrollLeft(width, 1000);
        } else {
            var height = this.count * this._itemSize.y - this._height;
            this._scrollView.setScrollTop(height, 1000);
        }
    }

    public scrollOffSet(offset: number): void {
        var height = offset - this._height;
        this._scrollView.setScrollTop(height, 1000);
    }

    public scrollToIdx(index: number, time: number = 1000, offset: number = 0): void {
        if (index > this.count - 1) {
            Log.error("不能大于列表数量");
            return;
        }
        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            var width = (index + 1) * this._itemSize.x - this._width + this._startPosX + offset;
            this._scrollView.setScrollLeft(width, time);
        } else {
            var height = (index + 1) * this._itemSize.y - this._height + offset;
            this._scrollView.setScrollTop(height, time);
        }
    }

    /**
     * 设置是否回弹
     */
    public set bounces(bounces: boolean) {
        this._scrollView.bounces = bounces;
    }

    public getSize() {
        return new egret.Point(this._width, this._height);
    }

    public set alignment(alignment: number) {
        this._alignment = alignment;
        this.refresh();
    }

    public clear(): void {
        this._view.removeChildren();
        this._itemCount = 0;
        this._items = [];
        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            this._curStartPoint = new egret.Point(0, this._height >> 1);
            if (this._startPosX) {
                this._curStartPoint.x = this._startPosX;
                this._width = this._width - this._startPosX;
            }
        } else {
            switch (this._alignment) {
                case ListView.ALIGNMENT_LEFT:
                    this._alignment = ListView.ALIGNMENT_LEFT;
                    this._curStartPoint = new egret.Point(0, 0);
                    break;
                case ListView.ALIGNMENT_RIGHT:
                    this._alignment = ListView.ALIGNMENT_RIGHT;
                    this._curStartPoint = new egret.Point(this._width, 0);
                    break;
                case ListView.ALIGNMENT_CENTER:
                    this._alignment = ListView.ALIGNMENT_CENTER;
                    this._curStartPoint = new egret.Point(this._width >> 1, 0);
                    break;
                default:
                    this._curStartPoint = new egret.Point(this._width >> 1, 0);
            }
        }
    }

    private refresh() {
        if (this._itemCount < 1)
            return;

        switch (this._direction) {
            case ListView.DIRECTION_HORIZONTAL:
                var mh = this._height >> 1;
                this._curStartPoint.x = 0;
                this._curStartPoint.y = mh;
                var addPoint = new egret.Point();
                for (var i = 0, itemCount = this._itemCount; i < itemCount; i++) {
                    var item = this._items[i];
                    if (item) {
                        addPoint.x = this._curStartPoint.x + this._itemSpace;
                        addPoint.y = this._curStartPoint.y;
                        this._curStartPoint.x = addPoint.x + this._itemSize.x;
                        item.x = addPoint.x;
                        item.y = addPoint.y;
                    }
                }

                break;
            default: //ListView.DIRECTION_VERTICAL
                var addPoint = new egret.Point();

                this._curStartPoint.y = 0;
                var bb = false;
                switch (this._alignment) {
                    case ListView.ALIGNMENT_CENTER:
                        this._curStartPoint.x = this._width >> 1;
                        break;
                    case ListView.ALIGNMENT_LEFT:
                        this._curStartPoint.x = 0;
                        break;
                    case ListView.ALIGNMENT_RIGHT:
                        this._curStartPoint.x = this._width;
                        bb = true;
                        break;
                }
                for (var i = 0, itemCount = this._itemCount; i < itemCount; i++) {
                    var item = this._items[i];
                    if (item) {
                        if (bb) {
                            addPoint.x = this._curStartPoint.x - this._itemSize.x;
                        } else {
                            addPoint.x = this._curStartPoint.x;
                        }
                        addPoint.y = this._curStartPoint.y + this._itemSpace;
                        this._curStartPoint.y = addPoint.y + this._itemSize.y;
                        item.x = addPoint.x;
                        item.y = addPoint.y;
                    }
                }
        }
    }

    public addBg(): void {
        this._bg = new egret.Shape();
        this._bg.graphics.clear();
        this._bg.graphics.beginFill(0x000000, 0.001);
        this._bg.graphics.drawRect(0, 0, this._width, this._height);
        this._bg.graphics.endFill();
        this._bg.width = this._width;
        this._bg.height = this._height;
        this.addChild(this._bg);
        this._bg.touchEnabled = true;
    }

    public reDrawBg(): void {
        this._bg.graphics.clear();
        this._bg.graphics.beginFill(0x000000, 0.001);
        this._bg.graphics.drawRect(0, 0, this._width, this._height);
        this._bg.graphics.endFill();
        this._bg.width = this._width;
        this._bg.height = this._height;
        this._bg.touchEnabled = true;
    }

    public setPosition(point: egret.Point): void {
        point.x = point.x - (this._width >> 1);
        point.y = point.y - (this._height >> 1);
        this.x = point.x;
        this.y = point.y;
    }

    /*
     获取列表item数量
     */
    public get count(): number {
        return this._itemCount;
    }

    /*
     获取列表item数组
     */
    public get itemList(): any {
        return this._items;
    }

    /*
     设置排列方向
     */
    public setDirection(direction: string): void {
        if (direction == ListView.DIRECTION_HORIZONTAL) { //水平
            this._scrollView.verticalScrollPolicy = "off";
            this._scrollView.horizontalScrollPolicy = "on";
            this._direction = ListView.DIRECTION_HORIZONTAL;
        } else {  //垂直
            this._scrollView.verticalScrollPolicy = "on";
            this._scrollView.horizontalScrollPolicy = "off";
            this._direction = ListView.DIRECTION_VERTICAL;
        }
    }

    public getItemAtIndex(index: number = -1) {
        if (index < 0 || index > this._itemCount)
            return null;

        return this._items[index];
    }

    public removeItemByIndex(index: number) {
        var item = this._items[index];
        if (item) {
            this._view.removeChild(item);
        }
        this._items[index] = null;
        this._itemCount -= 1;
        this.refresh();
    }

    public removeItemByIdx(index: number) {
        var item = this._items[index];
        if (item) {
            this._view.removeChild(item);
        }
        this._items.splice(index, 1);
        this._itemCount =  this._items.length;
        this.refresh();
    }

    public addItem(item: any, offset?: number): void {
        var addPoint = new egret.Point();
        switch (this._direction) {
            case ListView.DIRECTION_HORIZONTAL:
                addPoint.x = this._curStartPoint.x + this._itemSpace;
                addPoint.y = this._curStartPoint.y;
                if (offset) {
                    this._curStartPoint.x = addPoint.x + offset;
                } else {
                    this._curStartPoint.x = addPoint.x + this._itemSize.x;
                }
                break;
            default:
                var bb = false;
                switch (this._alignment) {
                    case ListView.ALIGNMENT_CENTER:
                        this._curStartPoint.x = this._width >> 1;
                        break;
                    case ListView.ALIGNMENT_LEFT:
                        this._curStartPoint.x = 0;
                        break;
                    case ListView.ALIGNMENT_RIGHT:
                        this._curStartPoint.x = this._width;
                        bb = true;
                        break;
                    default:
                }

                if (bb) {
                    addPoint.x = this._curStartPoint.x - this._itemSize.x;
                } else {
                    addPoint.x = this._curStartPoint.x;
                }
                addPoint.y = this._curStartPoint.y + this._itemSpace;
                if (offset) {
                    this._curStartPoint.y = addPoint.y + offset;
                } else {
                    this._curStartPoint.y = addPoint.y + this._itemSize.y;
                }
        }
        this._view.addChild(item);
        item.x = addPoint.x;
        item.y = addPoint.y;
        this._items.push(item);
        this._itemCount += 1;

    }

    /**
     * 删除多个item
     */
    public deleteItems(sIdx: number, count: number): void {
        var item;
        var fItem = this._items[sIdx];
        var lItem = this._items[sIdx + count - 1];
        var offsetX = 0;
        var offsetY = 0;
        if (this._direction == ListView.DIRECTION_HORIZONTAL) {
            offsetX = lItem.x - fItem.x + this._itemSpace + this._itemSize.x;
        } else {
            offsetY = lItem.y - fItem.y + this._itemSpace + this._itemSize.y;
        }
        for (var i = sIdx; i < sIdx + count; i++) {
            item = this._items[i];
            item.dispose();
            display.destroy(item);
        }
        this._items.splice(sIdx, count);
        this._itemCount = this._items.length;
        for (var i = sIdx; i < this._itemCount; i++) {
            item = this._items[i];
            item.x = item.x - offsetX;
            item.y = item.y - offsetY;
        }
        if (this._curStartPoint.x) {
            this._curStartPoint.x = this._curStartPoint.x - offsetX;
        }
        if (this._curStartPoint.y) {
            this._curStartPoint.y = this._curStartPoint.y - offsetY;
        }
    }


    /**
     * 移动item到最后
     * @param idx
     */
    public moveItemToLast(idx: number): void {
        var curItem = this.getItemAtIndex(idx);
        if (!curItem) {
            Log.error("item not found");
            return;
        }

        var item;
        for (var i = this.count - 1; i > idx; i--) {
            item = this.getItemAtIndex(i);
            item.y = item.y - this._itemSpace - this._itemSize.y;
        }
        curItem.y = this._curStartPoint.y - this._itemSpace - this._itemSize.y;
    }

}
