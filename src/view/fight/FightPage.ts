
class FightPage extends BaseLayer {

    public constructor() {
        super();
    }

    public onInit(): void {
        Log.debug("Fight Page Init..");
        Log.debug(GlobalVar.cx, GlobalVar.cy);
        var mask = display.newDarkMask(this);

        var bm = this.disposer.newBitmapToCenter("txt_sheng_png", GlobalVar.cx, GlobalVar.cy);
        bm.scaleX = 4;
        bm.scaleY = 4;
        this.addChild(bm);

    }    


}