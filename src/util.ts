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
    
    export function Point(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

