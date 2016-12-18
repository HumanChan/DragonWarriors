/**
 * Created by PC on 2016/1/18.
 */
class Disposer {

    public name: string;
    public parent: Disposer;
    private context: any;
    private children: Disposer[];
    private eventListeners: any[];
    public reses: any[] = [];
    private mcList: Object = {};
    private mcDataCache: Object = {}; //MC对象数据缓存
    private timerList: any[] = [];

    public constructor(context: any) {
        this.context = context;
        this.name = egret.getQualifiedClassName(this) + Math.random();
        this.children = [];
        this.eventListeners = [];
        this.reses = [];
    }

    public setParent(pDisposer: Disposer): void {
        this.parent = pDisposer;
    }

    public getRes(name: string, callback?: Function, thisObject?: any) {
        this.addRes(name);
        return LoadUtils.getInstance().getRes(name, callback, thisObject);
    }

    public addRes(name): void {
        this.reses.push(name);
        GlobalRes.addRes(name);
    }

    /**
     *  添加一个mc，默认添加后就直接播放了
     {
         "mcId", 特效ID
         "rootNode", 添加的父对象
         x,y
         "endFun", 完成回调
         "endfObj"
     }
     */
    public addMc(data_: Object): void {
        var newId: string = data_["mcId"] + "";
        if (!newId) {
            console.error("未找到 " + newId + "的效果");
            return;
        }
        var mcData: egret.MovieClipData = this.mcDataCache[newId];
        if (!mcData) {
            var self = this;
            var dataName = newId + "_json";
            var txtrName = newId + "_png";
            GlobalRes.getResAsync(dataName, function () {
                GlobalRes.getResAsync(txtrName, function () {
                    var d = RES.getRes(dataName);
                    var t = RES.getRes(txtrName);
                    self.addRes(txtrName);
                    var mcDataFactory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(d, t);
                    mcData = mcDataFactory.generateMovieClipData(newId);
                    self.mcDataCache[newId] = mcData;
                    self.playMc(data_, mcData);
                    mcDataFactory.clearCache();
                }, self);
            }, self);
        } else {
            this.playMc(data_, mcData);
        }
    }

    private playMc(data_: Object, mcData: egret.MovieClipData) {
        var rootNode: any = data_["rootNode"];
        var newId: string = data_["mcId"] + "";

        var mc: egret.MovieClip = new egret.MovieClip(mcData);
        mc.x = data_["x"] || 0;
        mc.y = data_["y"] || 0;
        if (data_["scale"]) {
            mc.scaleX = data_["scale"];
            mc.scaleY = data_["scale"];
        }
        if (data_["rotation"]) {
            mc.rotation = data_["rotation"];
        }
        if (data_["idx"]) {
            rootNode.addChildAt(mc, data_["idx"]);
        } else {
            rootNode.addChild(mc);
        }

        var newTag = "";
        if (data_["mcTag"] && typeof (data_["mcTag"] != "undefined")) {
            newTag = data_["mcTag"] + "";
        }

        //记录资源
        var key = rootNode.hashCode + "";
        if (this.mcList[key]) {
            if (!this.mcList[key][newId + newTag]) {
                this.mcList[key][newId + newTag] = mc;
            }
        } else {
            this.mcList[key] = {};
            this.mcList[key][newId + newTag] = mc;
        }
        var callback: Function = data_["callback"]
        if (callback && data_["cbObj"]) {
            callback.apply(data_["cbObj"], [mc]);
        }

        var playTimes: number = data_["play_times"];
        if (!playTimes) {
            playTimes = 1;
        }
        if (playTimes >= 1) {
            var self = this;
            mc.addEventListener(egret.Event.COMPLETE, function () {
                if (data_["endFun"]) {
                    data_["endFun"].apply(data_["endfObj"], [mc]);
                }
                if(!data_["idDispose"]){
                    self.disposeMc(rootNode, data_["mcId"], data_["mcTag"]);
                }
            }, this);
        }
        mc.play(playTimes);
    }

    public hasMc(rootNode: any, mcId: string, mcTag: string = ""): boolean {
        if (rootNode) {
            var obj = this.mcList[rootNode.hashCode + ""];
            if (obj) {
                obj = obj[mcId + mcTag];
                if (obj) {
                    if (obj.parent) {
                        return true;
                    }
                    return false
                } else {
                    return false
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public disposeMc(rootNode: any, mcId: string, mcTag: string = ""): void {
        if (rootNode) {
            var obj = this.mcList[rootNode.hashCode + ""];
            if (obj) {
                obj = obj[mcId + mcTag];
                if (obj) {
                    if (obj.parent) {
                        obj.parent.removeChild(obj);
                        //console.log("清理：",mcId + "_json",mcId + "_png");
                        //RES.destroyRes(mcId + "_json");
                        //RES.destroyRes(mcId + "_png");
                    }
                    this.mcList[rootNode.hashCode + ""][mcId + mcTag] = null;
                } else {
                    this.mcList[rootNode.hashCode + ""] = null;
                }
            } else {
                this.mcList[rootNode.hashCode + ""] = null;
            }
        }
    }

    /**
     * 创建一个图片
     */
    public newBitmap(name: string, x: number = 0, y: number = 0, callback?: Function, context?: any): egret.Bitmap {
        var bm = new egret.Bitmap();
        bm.x = x;
        bm.y = y;
        this.updateTexture(bm, name, callback, context);
        return bm;
    }

    // public newBitmap2(name: string, x: number = 0, y: number = 0, callback?: Function, context?: any): egret.Bitmap {
    //     var bm = new egret.Bitmap();
    //     bm.x = x;
    //     bm.y = y;
    //     this.updateTexture(bm, name, callback, context);
    //     return bm;
    // }

    /**
     * 创建一个锚点在中心的图片
     */
    public newBitmapToCenter(name: string, x: number = 0, y: number = 0, callback?: Function, context?: any): egret.Bitmap {
        var bm = new egret.Bitmap();
        bm.x = x;
        bm.y = y;
        this.updateTexture(bm, name, function (nbm) {
            bm.anchorOffsetX = bm.width >> 1;
            bm.anchorOffsetY = bm.height >> 1;
            if (callback) {
                callback.apply(context, [bm]);
            }
        }, context);
        return bm;
    }

    public updateTexture(target: egret.Bitmap, name: string, callback?: Function, context?: any) {
        if (target && name) {
            var res = this.getRes(name, function (r) {
                target.texture = r;
                if (callback) {
                    callback.apply(context, [target]);
                }
            }, this);
            if (res) {
                target.texture = res;
                if (callback) {
                    callback.apply(context, [target]);
                }
            }
        }
    }

    public dispose(): void {
        this.disposeChildren();
        this.disposeSelf();
        this.parent = null;
    }

    public disposeSelf(): void {
        this.disposeAllMc();
        this.disposeAllTweens();
        this.disposeEventListeners();
        this.disposeReses();
        this.disposeTimers();
    }

    public addChild(d: Disposer): void {
        this.children.push(d);
    }

    public removeChild(d: Disposer): void {
        this.children.forEach((c, index) => {
            if (d == c) {
                this.children.splice(index, 1);
            }
        })
    }

    /**
     * doTimer
     * @param delay
     * @param repeatCount
     * @param handler
     * @param thisObj
     */
    public addTimerHandler(delay: number, repeatCount: number, handler: Function, thisObj: any): void {
        TimerManager.getInstance().doTimer(delay, repeatCount, handler, thisObj);
        this.timerList.push({
            delay: delay,
            repeatCount: repeatCount,
            handler: handler,
            thisObj: thisObj
        });
    }

    public hasTimerHandler(delay: number, repeatCount: number, handler: Function, thisObj: any): number {
        var has = -1;
        this.timerList.forEach((d, index) => {
            if (delay == d.delay && repeatCount == d.repeatCount && handler == d.handler && thisObj == d.thisObj) {
                has = index;
                return has
            }
        }, this);
        return has;
    }

    public removeTimerHandler(delay: number, repeatCount: number, handler: Function, thisObj: any): void {
        var has = this.hasTimerHandler(delay, repeatCount, handler, thisObj);
        if (has != -1) {
            this.timerList.splice(has, 1);
            TimerManager.getInstance().remove(handler, thisObj);
        } else {
            //            console.log("找不到该事件监听");
        }
    }

    public addEventListener(context: any, type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
        if (this.hasEvenListener(context, type, listener, thisObject, useCapture, priority) == -1) {
            context.addEventListener(type, listener, thisObject, useCapture, priority);
            this.eventListeners.push({
                dispatcher: context,
                type: type,
                listener: listener,
                thisObject: thisObject,
                useCapture: useCapture
            });
        } else {
            //            console.log("has same event");
        }
    }

    public hasEvenListener(context: any, type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): number {
        var has = -1;
        this.eventListeners.forEach((d, index) => {
            if (context == d.dispatcher && type == d.type && listener == d.listener && thisObject == d.thisObject) {
                has = index;
                return has
            }
        }, this);
        return has;
    }

    public removeEventListener(context: any, type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void {
        context.removeEventListener(type, listener, thisObject, useCapture, priority);
        var has = this.hasEvenListener(context, type, listener, thisObject, useCapture, priority);
        if (has != -1) {
            this.eventListeners.splice(has, 1);
        } else {
            //            console.log("找不到该事件监听");
        }
    }

    public disposeEventListeners(): void {
        this.eventListeners.forEach((d) => {
            d.dispatcher.removeEventListener(d.type, d.listener, d.thisObject, d.useCapture);
        }, this);
        this.eventListeners = [];
    }

    public disposeRes(name: string): void {
        RES.destroyRes(name);
    }

    public disposeReses(): void {
        for (var i = 0, len = this.reses.length; i < len; i++) {
            GlobalRes.disposeRes(this.reses[i]);
        }
        this.reses = [];
    }

    public disposeTimers(): void {
        this.timerList.forEach((d) => {
            TimerManager.getInstance().remove(d.handler, d.thisObj);
        }, this);
        this.timerList = [];
    }

    public disposeAllTweens(): void {
        egret.Tween.removeTweens(this.context);
    }

    public disposeAllMc(): void {
        for (var key in this.mcList) {
            var obj = this.mcList[key];
            if (obj) {
                for (var kk in obj) {
                    var mc = obj[kk];
                    if (mc && mc.parent) {
                        mc.parent.removeChild(mc);
                        this.disposeRes(kk + "_json");
                        GlobalRes.disposeRes(kk + "_png");
                    }
                }
            }
        }
    }

    public disposeChildren(): void {
        this.children.forEach((d) => {
            d.dispose();
        }, this);
        this.children = [];
    }


}


















