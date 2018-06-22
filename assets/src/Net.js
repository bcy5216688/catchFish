cc.Class({
    extends: cc.Component,

    properties: {
        anim_net: {
            default: null,
            type: cc.Animation,
        }
    },

    onLoad () {
        this.game = null;
        this.curLevel = 1;
    },

    init(position, game, level) {
        this.curLevel = level;
        this.node.parent = cc.director.getScene();
        this.node.position = position;
        this.game = game;
        this.anim_net.play('net_'+this.curLevel);
    },

    despawnNet() {
        this.game.despawnNet(this.node);
    },
});
