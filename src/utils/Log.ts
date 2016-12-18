/**
 *
 * @author 
 *
 */
module Log {
    /**
     * Debug_Log
     * @param messsage 内容
     * @constructor
     */
    export function log(...optionalParams: any[]): void {
        if (GlobalVar.debugLv < 2) {
            optionalParams[0] = "[Log] " + optionalParams[0];
            console.log.apply(console, optionalParams);
        }
    }

    export function warn(...optionalParams: any[]): void {
        if (GlobalVar.debugLv < 3) {
            optionalParams[0] = "[Warn] " + optionalParams[0];
            console.warn.apply(console, optionalParams);
        }
    }

    export function debug(...optionalParams: any[]): void {
        if (GlobalVar.debugLv == 3) {
            optionalParams[0] = "[Debug] " + optionalParams[0];
            console.log.apply(console, optionalParams);
        }
    }

    export function error(...optionalParams: any[]): void {
        optionalParams[0] = "[Error] " + optionalParams[0];
        console.error.apply(console, optionalParams);
    }

    export var startTimes: Object = {};
    /**
     * 开始
     * @param key 标识
     * @param minTime 最小时间
     *
     */
    export function start(key: string): void {
        this.startTimes[key] = egret.getTimer();
    }

    /**
     * 停止
     *
     */
    export function stop(key: string): number {
        if (!this.startTimes[key]) {
            return 0;
        }

        var cha: number = egret.getTimer() - this.startTimes[key];
        this.warn(key + "_时间差---" + cha);
        return cha;
    }

}