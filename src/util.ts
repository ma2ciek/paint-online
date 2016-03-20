/// <reference path="_all.d.ts" />

class EventEmitter {
    private events = {};

    on(name: string, fn: Function) {
        if (!this.events[name])
            this.events[name] = [];
        this.events[name].push(fn);
    }

    emit(name: string, value: any) {
        if (!this.events[name])
            return;
        for (var fn of this.events[name]) {
            fn(value);
        }
    }
}

module util {  
    export interface IPoint {
        x: number;
        y: number;
    }
    
    export class Point {
        x: number;
        y: number;
        
        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }
        
        public static distance(p1: IPoint, p2: IPoint) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }
    }
}

