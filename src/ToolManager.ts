/// <reference path="_all.d.ts" />

interface IToolManagerConfig {
    point: IPoint,
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

    private modules: IModuleList = {
        color: new ColorManager(),
        size: new SizeManager(),
        threshold: new Threshold()
    }

    constructor() {
        this.addEventListeners();
        this.watchModules();
        this.connectToolsWidthModules();
    }
    
    connectToolsWidthModules() {
        for(var toolName in this.tools) {
            var tool = this.tools[toolName];
            for(var moduleName of tool.visibleModules) {
                var module = this.modules[moduleName];
                tool.modules[moduleName] = module;
            }
        }
    }
    
    watchModules() {
        for(var name in this.modules) {
            this.modules[name].on('change', obj => this.activeTool.update(obj))
        }
    }

    getActiveTool() {
        return this.activeTool;
    }

    action(actionName:string, ctx, config: IToolManagerConfig) {
        this.activeTool[actionName] && this.activeTool[actionName](ctx, config);
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
        this.activeTool.activate();

        for (var moduleName in this.modules) {
            this.modules[moduleName].hide();
        }

        for (var modName of this.activeTool.visibleModules) {
            this.modules[modName].show();
        }
    }
}