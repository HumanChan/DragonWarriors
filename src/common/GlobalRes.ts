/**
 *
 * @author 
 *
 */

module GlobalRes {
    
    export var ResRef: Object = {};
    export function addRes(name: string): void {
        if (!this.ResRef[name]) {
            this.ResRef[name] = 1;
        } else {
            this.ResRef[name] += 1;
        }
    }

    export function disposeRes(name: string, isDispose: boolean = true): void {
        if (this.ResRef[name] && this.ResRef[name] > 1) {
            this.ResRef[name] -= 1;
        } else {
            if (isDispose == true) {
                RES.destroyRes(name);
            }
        }
    }

    export function getResAsync(key, compFunc?, thisObject?): any {
        RES.getResAsync(key, compFunc, thisObject);
    }

}
