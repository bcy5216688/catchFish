
cc.Class({
    extends: cc.Component,

    properties: {
        anim_coin: {
            default: null,
            type: cc.Animation,
        },
    },

    init(ctr) {
        this.cointroller = ctr;
        this.anim_coin.play('gold_down');
    },

    goDown(pos, toPos) {
        this.node.parent = cc.director.getScene()
        this.node.position = pos;
        let spawn = cc.spawn(cc.moveTo(0.8, toPos), cc.scaleTo(0.8, 0.5));
        let cb = cc.callFunc(this.despawnCoin, this);
        let acf = cc.sequence(spawn, cb);
        this.node.runAction(acf);
    },
    
    despawnCoin() {
        this.cointroller.despawnCoins(this.node);
    },
});
