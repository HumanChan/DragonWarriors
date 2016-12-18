/**
 * 全局事件中心
 *  用法：
 *  EventCentrer.addEventListener(EventConst.EVENT1, this.testEvent, this)
 *  EventCentrer.dispatch(EventConst.EVENT1, 9999)
 */
class EventCentrer {
    
    //存放所有事件信息
    private static listeners:Object = {};
    
    /**
     * 添加事件监听
     * @param type_  事件的类型
     * @param listener_  处理事件的侦听器函数
     * @param thisObject_  侦听函数绑定的this对象
     */
    public static addEventListener(type_: string,listener_: Function,thisObject_: any):void{
        if(!this.listeners[type_]){
            this.listeners[type_] = [];
        }
        
        this.listeners[type_].push({
            "eventName": type_,
            "listener": listener_,  
            "thisObject": thisObject_
        });
        
    }
    
    /**
     * 将事件分派到事件流中
     * @param type_  事件的类型
     * @param data_  发送给处理事件侦听器函数的数据
     */
    public static dispatchEvent(type_: string,data_: any = null): void {
        var newListeners:any[] = this.listeners[type_];
        if(newListeners){
            var newInfo:Object;
            var newLength:number = newListeners.length;
            for(var i = 0;i < newLength; i++) {
                newInfo = newListeners[i];
                if(newInfo && newInfo["eventName"] == type_){
                    if(newInfo["listener"] && newInfo["thisObject"]){
                        newInfo["listener"].apply(newInfo["thisObject"],[data_]);
                    }
                }
            }
        }
    }
    
    /**
     * 从 EventDispatcher 对象中删除侦听器
     * @param type_   事件的类型
     * @param listener_  处理事件的侦听器函数
     * @param thisObject_  侦听函数绑定的this对象
     */
    public static removeEventListener(type_: string,listener_: Function,thisObject_: any): void {
        var newListeners: any[] = this.listeners[type_];
        if(newListeners) {
            var i:number = 0;
            var newInfo: Object;
            var removeIdList:number[] = [];
            var newLength: number = newListeners.length;
            for(i = 0;i < newLength;i++) {
                newInfo = newListeners[i];
                if(newInfo && newInfo["eventName"] == type_) {
                    if(newInfo["listener"] == listener_ && newInfo["thisObject"] == thisObject_){
                        removeIdList.push(i);
                    }
                }
            }
            
            var removeIdLength: number = removeIdList.length;
            if(removeIdLength > 0){
                for(i = 0;i < removeIdLength; i++) {
                    newListeners.splice(removeIdList[i],1);
                }
                
                if(newListeners.length == 0){
                    this.listeners[type_] = null;
                }else{
                    this.listeners[type_] = newListeners;
                }
                
            }
            
        }
    }
    
    /**
     * 检查 EventDispatcher 对象是否为特定事件类型注册了任何侦听器
     * @param type_  事件的类型
     */
    public static hasEventListener(type_: string): boolean {
        var newListeners: any[] = this.listeners[type_];
        if(newListeners && newListeners.length > 0) {
            return true;
        }
        return false;
    }
    
    /**
     * 删除指定事件名的所有监听
     * @param type_  事件的类型
     */
    public static removeEventListenerByEventName(type_: string): void {
        if(this.listeners[type_]) {
            this.listeners[type_] = null;
        }
    }
    
    /**
     *  删除所有事件
     */
    public static removeAllEventListeners(): void {
        this.listeners = {};
    }
    
}

