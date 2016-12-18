/**
 *
 * @author 
 *
 */
class SoundManager {
    private static _instance: SoundManager;
    public static getInstance(): SoundManager {
        if(this._instance == null)
            this._instance = new SoundManager();
        return this._instance;
    }
    
    //背景音开关
    private musicOn:number;
    //音效开关
    private effectOn: number;
    //背景音乐的音量
    private musicVolume:number;
    //音效的音量
    private effectVolume:number;
    //当前播放的音乐名
    private currMusicName:string;
    private soundMusic:SoundMusic;
    private soundEffect: SoundEffect;
    private soundFlag: boolean = true;
    
    public constructor() {
        //if (!GlobalVar.isApp && DeviceUtils.IsMobile()) {
            this.soundFlag = false;
        //}

        this.musicOn = this.getSoundOn(0);
        this.effectOn = this.getSoundOn(1);
        this.musicVolume = this.getSoundVolume(0);
        this.effectVolume = this.getSoundVolume(1);
        // this.musicOn = 0;
        // this.effectOn = 0;
        this.soundMusic = new SoundMusic();
        this.soundMusic.setVolume(this.musicVolume);    
        this.soundEffect = new SoundEffect();
	    this.soundEffect.setVolume(this.effectVolume);
    }

    public init():void {
        this.musicOn = this.getSoundOn(0);
        this.effectOn = this.getSoundOn(1);
        this.musicVolume = this.getSoundVolume(0);
        this.effectVolume = this.getSoundVolume(1);
        this.soundMusic.setVolume(this.musicVolume);
        this.soundEffect.setVolume(this.effectVolume);
        if(this.musicOn == 0){
            this.stopMusic();
        }
    }

    //播放音乐<背景音>
    public playMusic(sName: string): void{
        if (!this.soundFlag) {
            return;
        }
        if(!sName){
            return;
        }
        this.currMusicName = sName;
        if(this.musicOn == 0){
            return;
        }
        this.soundMusic.play(sName);
    }
    
    //停止背景音
    public stopMusic(): void{
        if (!this.soundFlag) {
            return;
        }
        this.soundMusic.stop();
    }

    //播放音效
    public playEffect(sName: string): void {
        if (!this.soundFlag) {
            return;
        }
        if(!sName) {
            return;
        }
        if(this.effectOn == 0) {
            return;
        }
        this.soundEffect.play(sName);
    }
	
	/**
	 * 获取声音开关  
	 * @param type_ 声音类型  0|背景音<默认>   1|音效
	 */
	public getSoundOn(type_:number = 0):number{
        var key: string = "music_s";
        if(type_ == 1){
            key = "effect_s";
        }
        var ons: number = this.getSaveNumber(key);
        if(ons == 0){
            return 0;
        }else{
            return 1;
        }
	}
	
    /**
     * 设置保存声音开关
     * @param type_ 声音类型  0|背景音<默认>   1|音效
     * @param state_  0|关   1|开<默认>
     */
    public setSoundOn(type_: number = 0,state_:number = 1): void {
        var key: string;
        if(type_ == 0) {
            key = "music_s";
            this.musicOn = state_;
            if(state_ == 0) {
                this.stopMusic();
            } else {
                this.playMusic(this.currMusicName);
            }
        }else{
            key = "effect_s";
            this.effectOn = state_;
        }
        this.saveNumber(key,state_);
	}
	
	/**
	 * 获取声音音量  
	 * @param type_ 声音类型  0|背景音<默认>   1|音效
	 */
    public getSoundVolume(type_: number = 0): number {
        var key: string = "music_v";
        if(type_ == 1) {
            key = "effect_v";
        }
        var volume: string = this.getSaveData(key);
        if(volume) {
            return MathUtils.toInt(volume);
        } else {
            return 0.5;
        }
    }
    
    /**
     * 设置保存声音音量
     * @param type_ 声音类型  0|背景音<默认>   1|音效
     * @param value_  音量值<默认0.5>
     */
    public setSoundVolume(type_: number = 0,value_: number = 0.5): void {
        var key: string;
        if(type_ == 0) {
            key = "music_v_s";
            this.musicVolume = value_;
            this.soundMusic.setVolume(value_);
        } else {
            key = "effect_v";
            this.effectVolume = value_;
            this.soundEffect.setVolume(value_);
        }
        this.saveNumber(key,value_);
    }

    private saveNumber(key:string,value_:number):void {
        try {
            egret.localStorage.setItem(key,value_+"");
        } catch(e) { }
    }

    private getSaveData(key:string):string {
        var itemStr:string;
        try {
            itemStr = egret.localStorage.getItem(key);
        } catch(e) { }
        return itemStr;
    }

    private getSaveNumber(key:string):number {
        var temp = this.getSaveData(key);
        var result = parseInt(temp);
        return result;
    }
	
}
