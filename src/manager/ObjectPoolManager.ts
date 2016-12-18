/**
 *
 * @author 
 * 对象管理器<对象池>
 */
class ObjectPoolManager {
    private static _instance: ObjectPoolManager;
    public static getInstance(): ObjectPoolManager {
        if(this._instance == null)
            this._instance = new ObjectPoolManager();
        return this._instance;
    }
	public constructor() {
	}
	
    private pools:Object = {};
    
    //根据对象名获取对象池中是否已经存在缓存
    public getPoolObjIsExist(objName: string): boolean {
        var pool: any[] = this.pools[objName];
        if(pool && pool.length > 0) {
            return true;
        }else{
            return false;
        }
    }
    
    
    /**
     * 取出一个对象<如果该对象在对象池中存在，则直接返回；如果不存在则返回一个新的对象>
     * @param objName
     * @param args
     * @param isPush 
     */
    public pop(objName: string, args?: any[]): any {
        var pool: any[] = this.pools[objName];
        if(pool && pool.length > 0) {
            return pool.pop();
        }else {   
            var newObj: any = this.construct(objName,args);
            return newObj;
        }
    }
    
    /**
     * 放入一个对象
     * @param obj
     *
     */
    public push(obj: any = null,objName?: string): void {
        if(obj == null) {
            return;
        }
        if(!objName){
            objName = egret.getQualifiedClassName(obj);
        }
        if(!this.pools[objName]) {
            this.pools[objName] = [];
        }
        this.pools[objName].push(obj);
    }
    
    /**
     * 清理指定对象<注意：这里只是清除掉对象池中的缓存>
     * @param obj 对象
     */
    public disposeObjectByObj(obj: any):void{
        if(obj == null) {
            return;
        }
        var objName: string = egret.getQualifiedClassName(obj);
        var pool: any[] = this.pools[objName];
        if(pool){
            var poolLength:number = pool.length;
            for(var i = 0;i < poolLength; i++) {
                if(pool[i] == obj){
                    pool.splice(i,1);
                    break;
                }
            }
        }
    }
    
    
    /**
     * 清除指定对象名的所有对象<注意：这里只是清除掉对象池中的缓存>
     * @param objName
     */
    public disposeObjectByName(objName: string):void{
        if(this.pools[objName]){
            this.pools[objName] = [];
        }
    }
    
	//用来构造一个对象的类和一个参数数组
    public construct(objName: string,parameters: any[] = []): any {
        var newClass: any = egret.getDefinitionByName(objName);
        var argsLen: number = parameters.length;
        switch(argsLen) {
            case 0:
                return new newClass();
            case 1:
                return new newClass(parameters[0]);
            case 2:
                return new newClass(parameters[0],parameters[1]);
            case 3:
                return new newClass(parameters[0],parameters[1],parameters[2]);
            case 4:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3]);
            case 5:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4]);
            case 6:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5]);
            case 7:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6]);
            case 8:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7]);
            case 9:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7],parameters[8]);
            case 10:
                return new newClass(parameters[0],parameters[1],parameters[2],parameters[3],parameters[4],parameters[5],parameters[6],parameters[7],parameters[8],parameters[9]);
            default:
                return null;
        }
    }
    
}
