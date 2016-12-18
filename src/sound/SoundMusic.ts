/**
 *
 * @author 
 *
 */
class SoundMusic extends BaseSound {
    private volume:number;
    private currName:string;
    private currSound:egret.Sound;
    private currSoundChannel:egret.SoundChannel;
	public constructor() {
        super();
	}
	
	/**
     * 播放音乐
     * @param sName
     */
    public play(sName: string): void {
        if(this.currName == sName){
            return;
        }
        this.stop();
        this.currName = sName;
        var sound: egret.Sound = this.getSound(sName);
        if(sound) {
            this.playSound(sound);
        }
    }
    
    /**
     * 播放
     * @param sound
     */
    private playSound(sound: egret.Sound): void {
        sound.type = egret.Sound.MUSIC;
        this.currSound = sound;
        this.currSoundChannel = this.currSound.play();
        this.currSoundChannel.volume = this.volume;
    }
    
    /**
     * 停止当前音乐
     */
    public stop(): void {
        if(this.currName){
            RES.destroyRes(this.currName);
        }
        if(this.currSoundChannel) {
            this.currSoundChannel.stop();
        }
        this.currSoundChannel = null;
        this.currSound = null;
        this.currName = null;
    }

    /**
     * 资源加载完成后处理播放
     * @param key
     */
    protected loadedPlay(key: string): void {
        if(this.currName == key) {
            this.playSound(RES.getRes(key));
        }
    }
    
    /**
     * 设置音量
     * @param volume
     */
    public setVolume(volume: number): void {
        this.volume = volume;
        if(this.currSoundChannel) {
            this.currSoundChannel.volume = volume;
        }
    }
	
}
