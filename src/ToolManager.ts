/// <reference path="_all.d.ts" />

interface IToolManagerConfig {
    point: IPoint,
    lastPoint: IPoint;
    width: number;
    height: number;
}

class ToolManager {
    private tools = {
        pen: new Pen(),
        rubber: new Rubber(),
        fill: new Filler()
    }
    private activeTool: ITool;

    private modules = {
        color: new ColorManager(),
        size: new SizeManager()
    }

    constructor() {
        this.addEventListeners();
    }

    getActiveTool() {
        return this.activeTool;
    }

    action(actionName:string, ctx, config: IToolManagerConfig) {
        var obj = {};

        for (var c in config) {
            obj[c] = config[c];
        }
        
        for (var moduleName in this.activeTool.visibleModules) {
            obj[moduleName] = this.modules[moduleName].get();
        }
        
        this.activeTool[actionName] && this.activeTool[actionName](ctx, obj);
    }

    private addEventListeners() {
        var self = this;
        $('#tools a').on('click', setActiveTool);

        function setActiveTool() {
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            var toolName = $(this).attr('id');
            self.activateTool(toolName);
        }

        setActiveTool.call($('#tools a').eq(0));
    }

    private activateTool(toolName: string) {
        this.activeTool = this.tools[toolName];

        for (var moduleName in this.modules) {
            this.modules[moduleName].hide();
        }

        for (var moduleName in this.activeTool.visibleModules) {
            this.modules[moduleName].show();
        }
    }
}