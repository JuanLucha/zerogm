const vscode = require('vscode');

class ZeroGMMythicProvider {
    constructor(mythic, content) {
        this.mythic = mythic;
        this.content = content;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return [
                new ZeroGMTreeItem('🎲 Fate Check', 'fateCheck', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.fateCheck'),
                new ZeroGMTreeItem('📅 Event Check', 'eventCheck', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.eventCheck'),
                new ZeroGMTreeItem('🔍 Details Check', 'detailsCheck', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.detailsCheck'),
                new ZeroGMTreeItem('⚡ Chaos Factor', 'chaosGroup', vscode.TreeItemCollapsibleState.Collapsed),
                new ZeroGMTreeItem('📖 Event Meaning', 'eventMeaning', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.getEventMeaning'),
                new ZeroGMTreeItem('🎭 Get Action', 'getAction', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.getAction'),
                new ZeroGMTreeItem('📝 Get Description', 'getDescription', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.getDescription'),
            ];
        } else if (element.id === 'chaosGroup') {
            return [
                new ZeroGMTreeItem('📊 Get Chaos Factor', 'getChaos', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.chaosFactor'),
                new ZeroGMTreeItem('⬆️ Increase Chaos', 'increaseChaos', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.increaseChaosFactor'),
                new ZeroGMTreeItem('⬇️ Decrease Chaos', 'decreaseChaos', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.decreaseChaosFactor'),
                new ZeroGMTreeItem('🎯 Set Chaos Factor', 'setChaos', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.mythic.setChaosFactor'),
            ];
        }
        return [];
    }
}

class ZeroGMOracleProvider {
    constructor(content) {
        this.content = content;
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    getChildren(element) {
        if (!element) {
            return [
                new ZeroGMTreeItem('🔮 Oracle Check', 'oracleCheck', vscode.TreeItemCollapsibleState.None, 'zeroGM.oracleCheck'),
                new ZeroGMTreeItem('🎲 Dice Check', 'diceCheck', vscode.TreeItemCollapsibleState.None, 'zeroGM.diceCheck'),
                new ZeroGMTreeItem('⚙️ Change Language', 'changeLanguage', vscode.TreeItemCollapsibleState.None, 'extension.zeroGM.changeLanguage'),
            ];
        }
        return [];
    }
}

class ZeroGMTreeItem extends vscode.TreeItem {
    constructor(label, id, collapsibleState, commandId = null) {
        super(label, collapsibleState);
        this.id = id;
        this.tooltip = label;
        this.contextValue = id;
        
        if (commandId) {
            this.command = {
                command: commandId,
                title: label,
                arguments: []
            };
        }
    }
}

module.exports = {
    ZeroGMMythicProvider,
    ZeroGMOracleProvider,
    ZeroGMTreeItem
};
