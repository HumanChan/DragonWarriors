/**
 *
 * @author 
 *
 */

module display {

    //创建一个Sprite
    export function newSprite(): egret.Sprite {
        var result: egret.Sprite = new egret.Sprite();
        return result;
    }

    //创建一个Node
    export function newNode(): egret.DisplayObjectContainer {
        var result: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        return result;
    }

    //创建一个图片
    export function newBitmap(name?: string, x: number = 0, y: number = 0, alignCenter?: boolean): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        if (name) {
            result.texture = RES.getRes(name);
        }
        result.x = x;
        result.y = y;
        if (alignCenter) {
            result.anchorOffsetX = result.width >> 1;
            result.anchorOffsetY = result.height >> 1;
        }
        return result;
    }

    //创建一个大背景图
    export function newBg(name?: string, x: number = 0, y: number = 0): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        if (name) {
            result.texture = RES.getRes(name);
        }
        result.width = GlobalVar.stageWith;
        result.height = GlobalVar.stageHeight;
        result.x = x;
        result.y = y;
        return result;
    }

    //创建一个九宫格图片
    export function newScale9Grid(name: string, w: number, h: number, rect: egret.Rectangle, x: number = 0, y: number = 0): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var res = RES.getRes(name);
        if (res) {
            result.texture = RES.getRes(name);
        } else {
            GlobalRes.getResAsync(name, function () {
                result.texture = RES.getRes(name);
            }, this);
        }
        result.scale9Grid = rect;
        result.width = w;
        result.height = h;
        result.x = x;
        result.y = y;
        return result;
    }


    //创建一个文本
    export function newTextField(descStr: string, x: number = 0, y: number = 0, color: number = 0xffffff, align: string = "center", fontSize: number = 20): egret.TextField {
        var newTextField = new egret.TextField();
        newTextField.fontFamily = "SimHei";
        newTextField.x = x;
        newTextField.y = y;
        newTextField.text = descStr;
        newTextField.size = fontSize;
        newTextField.textColor = color;
        newTextField.textAlign = align;
        return newTextField
    }

    export function newDarkMask(rootNode: any, maskAlpha: number = 0.8): egret.Shape {
        var darkMask: egret.Shape = new egret.Shape();
        darkMask.graphics.clear();
        darkMask.graphics.beginFill(0x000000, maskAlpha);
        darkMask.graphics.drawRect(0, 0, GlobalVar.stageWith, GlobalVar.stageHeight);
        darkMask.graphics.endFill();
        darkMask.width = GlobalVar.stageWith;
        darkMask.height = GlobalVar.stageHeight;
        rootNode.addChild(darkMask);
        return darkMask;
    }
    export function newRect(x: number = 0, y: number = 0, w: number = 0, h: number = 0, color: number = 0xffffff, maskAlpha: number = 0.5, bool: boolean = false): egret.Shape {
        var darkMask: egret.Shape = new egret.Shape();
        darkMask.graphics.clear();
        darkMask.graphics.beginFill(color, maskAlpha);
        darkMask.graphics.drawRect(x, y, w, h);
        darkMask.graphics.endFill();
        darkMask.touchEnabled = bool;
        return darkMask;
    }

    //消除一个对象
    export function destroy(thisArgs: any = null): void {
        if (thisArgs) {
            egret.Tween.removeTweens(thisArgs);
            if (thisArgs.parent) {
                thisArgs.parent.removeChild(thisArgs);
            }
        }
    }

}
