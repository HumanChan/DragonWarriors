/**
 * Created by chanhuman on 16/3/24.
 */
class SlideNode extends BaseView {

    private rect:egret.Rectangle;
    private bg:egret.Sprite;
    private handler:Function;
    private thisObj:any;

    public constructor(rect:egret.Rectangle){
        super();
        this.rect = rect;

        this.width = rect.width;
        this.height = rect.height;

        this.bg = new egret.Sprite();
        this.bg.graphics.clear();
        this.bg.graphics.beginFill(0x000000,0.001);
        this.bg.graphics.drawRect(rect.x,rect.y,rect.width,rect.height);
        this.bg.graphics.endFill();
        this.bg.width = rect.width;
        this.bg.height = rect.height;
        this.addChild(this.bg);

        this.bg.touchEnabled = true;
        this.disposer.addEventListener(this.bg,egret.TouchEvent.TOUCH_BEGIN,this.onBegin,this);
        this.disposer.addEventListener(this.bg,egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.disposer.addEventListener(this.bg,egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onRelaseOutside,this);
    }

    private startPos:egret.Point;


    private onBegin(e:egret.TouchEvent):void {
        this.startPos = new egret.Point(e.stageX,e.stageY);
    }

    private onEnd(e:egret.TouchEvent):void {
        var angle = MathUtils.getAngle2(this.startPos.x,this.startPos.y,e.stageX,e.stageY);
        var dis = MathUtils.getDistance(this.startPos.x,this.startPos.y,e.stageX,e.stageY);
        if(dis>this.width*0.15){
            if(angle<=-120 || angle>120){
                this.onSlide(-1);
            }else if(angle<60 && angle>-60){
                this.onSlide(1);
            }
        }
    }

    private onRelaseOutside(e:egret.TouchEvent):void {
        if(e.stageX>this.rect.x+this.rect.width/2){
            this.onSlide(1);
        }else{
            this.onSlide(-1);
        }
    }

    private onSlide(side:number):void {
        if(this.handler){
            this.handler.apply(this.thisObj,[side]);
        }
    }

    public setOnSlideHandler(handler:Function,thisObj:any):void {
        this.handler = handler;
        this.thisObj = thisObj;
    }

}