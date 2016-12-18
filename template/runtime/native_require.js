
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/res/res.js",
	"libs/modules/tween/tween.js",
	"libs/modules/dragonBones/dragonBones.js",
	"bin-debug/core/BaseView.js",
	"bin-debug/GameScene.js",
	"bin-debug/Main.js",
	"bin-debug/cache/Cache.js",
	"bin-debug/common/GlobalRes.js",
	"bin-debug/common/GlobalVar.js",
	"bin-debug/component/ListView.js",
	"bin-debug/component/PageView.js",
	"bin-debug/component/PageViewItem.js",
	"bin-debug/component/SlideNode.js",
	"bin-debug/const/EventConst.js",
	"bin-debug/core/BaseLayer.js",
	"bin-debug/core/BaseViewHelper.js",
	"bin-debug/core/Disposer.js",
	"bin-debug/core/EventCentrer.js",
	"bin-debug/manager/LayerManager.js",
	"bin-debug/manager/ObjectPoolManager.js",
	"bin-debug/manager/TimerManager.js",
	"bin-debug/sound/BaseSound.js",
	"bin-debug/sound/SoundEffect.js",
	"bin-debug/sound/SoundManager.js",
	"bin-debug/sound/SoundMusic.js",
	"bin-debug/utils/Base64.js",
	"bin-debug/utils/DateUtils.js",
	"bin-debug/utils/DeviceUtils.js",
	"bin-debug/utils/DisplayUtils.js",
	"bin-debug/utils/GameUtils.js",
	"bin-debug/utils/LoadUtils.js",
	"bin-debug/utils/Log.js",
	"bin-debug/utils/MathUtils.js",
	"bin-debug/utils/RegUtils.js",
	"bin-debug/utils/StageUtils.js",
	"bin-debug/utils/StringUtils.js",
	"bin-debug/view/fight/FightPage.js",
	"bin-debug/vo/TimerVO.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    if(egret_native.featureEnable) {
        //控制一些优化方案是否开启
        var result = egret_native.featureEnable({
            
        });
    }
    egret_native.requireFiles();
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 30,
		scaleMode: "showAll",
		contentWidth: 480,
		contentHeight: 800,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel("/system/fonts/DroidSansFallback.ttf", 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};