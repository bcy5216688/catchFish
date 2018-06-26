
cc.Class({
    extends: cc.Component,

    properties: {
        anim_weapon: {
            default: null,
            type: cc.Animation,
        },
        node_info: {
            default: null,
            type: cc.Node,
        },
        sprFrame_twoCannon: {
            default: null,
            type: cc.SpriteFrame,
        },
        sprFrame_thrCannon: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    onLoad () {
        this.curPower = 10.00;

        this.label_power = this.node.getChildByName("label_power").getComponent(cc.Label);
        this.label_power.string = this.curPower + "";
        this.nodeAdd = this.node.getChildByName("btn_add");
        this.nodeReduce = this.node.getChildByName("btn_reduce");
        this.cannonSpr = this.node.getChildByName("spr_weapon").getComponent(cc.Sprite);
    },

    setGameControl (gameControl) {
        this.gameControl = gameControl;
    },

    refreshBtnView (flag) {
        this.nodeAdd.active = flag;
        this.nodeReduce.active = flag;
    },

    initInfoNode (index) {
        var nodeInfo = cc.instantiate(this.node_info);
        nodeInfo.parent = this.node;
        nodeInfo.active = true;
        if (index === 0) {
            nodeInfo.position = cc.p(-272,0);
            this.refreshBtnView(true);
        } else if (index === 1) {
            nodeInfo.position = cc.p(276,0);
        } else if (index === 2) {
            nodeInfo.rotation = 180;
            this.label_power.node.rotation = 180;
            nodeInfo.position = cc.p(-272,77);
        } else if (index === 3) {
            nodeInfo.rotation = 180;
            this.label_power.node.rotation = 180;
            nodeInfo.position = cc.p(276,77);
        }
    },

    btnOnAdd () {
        this.curPower += 10;
        if (this.curPower > 100)  this.curPower = 10.00;
        this.changeCannon();
        this.label_power.string = this.curPower + "";
    },

    btnOnReduce () {
        this.curPower -= 10;
        if (this.curPower < 10)  this.curPower = 100.00;
        this.changeCannon();
        this.label_power.string = this.curPower + "";
    },

    changeCannon () {
        if (this.curPower > 50) {
            this.cannonSpr.spriteFrame = this.sprFrame_thrCannon;
        } else {
            this.cannonSpr.spriteFrame = this.sprFrame_twoCannon;
        }
    },
});
