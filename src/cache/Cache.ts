/**
 *
 * @author 
 *
 */
class Cache {
    private static _instance: Cache;
    public static getInstance(): Cache {
        if(this._instance == null)
            this._instance = new Cache();
        return this._instance;
    }
    
	public constructor() {
	}
	
	public init():void{
    }
    
}
