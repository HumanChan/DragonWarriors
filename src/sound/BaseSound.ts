/**
 *
 * @author 
 *
 */
class BaseSound {
    public cache: Object;
    public loadingCache: Array<string>;

    /**
     * 构造函数
     */
    public constructor() {
        this.loadingCache = [];
    }

    /**
     * 获取Sound
     * @param key
     * @returns {egret.Sound}
     */
    public getSound(key: string): egret.Sound {
        var sound: egret.Sound = RES.getRes(key);
        if(sound) {
            if(this.cache && this.cache[key]) {
                this.cache[key] = egret.getTimer();
            }
        } else {
            if(this.loadingCache.indexOf(key) != -1) {
                return null;
            }
            this.loadingCache.push(key);
            GlobalRes.getResAsync(key,this.onResourceLoadComplete,this);
        }
        return sound;
    }

    /**
     * 资源加载完成
     * @param event
     */
    private onResourceLoadComplete(data: any,key: string): void {
        var index: number = this.loadingCache.indexOf(key);
        if(index != -1) {
            this.loadingCache.splice(index,1);
            if(this.cache){
                this.cache[key] = egret.getTimer();
            }
            this.loadedPlay(key);
        }
    }

    /**
     * 资源加载完成后处理播放，子类重写
     * @param key
     */
    protected loadedPlay(key: string): void {

    }

    /**
     * 检测一个文件是否要清除，子类重写
     * @param key
     * @returns {boolean}
     */
    public checkCanClear(key: string): boolean {
        return true;
    }
}