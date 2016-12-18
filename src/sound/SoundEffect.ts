/**
 *
 * @author 
 *
 */
class SoundEffect extends BaseSound {
    private volume: number;
	public constructor() {
        super();
        this.cache = {};
        TimerManager.getInstance().doTimer(30000,0,this.clearSound,this);//30秒检测一次
	}
	
	private clearSound():void{
	    var currTime:number = egret.getTimer();
        for(var key in this.cache){
            if(currTime -this.cache[key] >= 60000){//音效播放时间最大1分钟
                delete this.cache[key];
                RES.destroyRes(key);
            }
        }
	}
	
	/**
     * 播放一个音效
     * @param sName
     */
    public play(sName:string):void {
        var sound: egret.Sound = this.getSound(sName);
        if (sound) {
            this.playSound(sound);
        }
    }
    
    /**
     * 播放
     * @param sound
     */
    private playSound(sound:egret.Sound):void {
        var channel:egret.SoundChannel = sound.play(0, 1);
        channel.volume = this.volume;
    }
    
    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume:number):void {
        this.volume = volume;
    }
    
    /**
     * 资源加载完成后处理播放
     * @param key
     */
    public loadedPlay(key:string):void {
        this.playSound(RES.getRes(key));
    }
    
}
