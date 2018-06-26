
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
    },

    onLoad () {
        this.curLevel = 1;
        this.total = this.anim_weapon.getClips().length;

        this.label_power = this.node.getChildByName("label_power");
        this.nodeAdd = this.node.getChildByName("btn_add");
        this.nodeReduce = this.node.getChildByName("btn_reduce");
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
            this.label_power.rotation = 180;
            nodeInfo.position = cc.p(-272,77);
        } else if (index === 3) {
            nodeInfo.rotation = 180;
            this.label_power.rotation = 180;
            nodeInfo.position = cc.p(276,77);
        }
    },

    plus () {
        if (this.curLevel + 1 > this.total) {
            this.curLevel = this.total;
        } else {
            this.curLevel++;
        }
        this.anim_weapon.play('weapon_level_' + this.curLevel);
    },

    reduce () {
        if (this.curLevel < 2) {
            this.curLevel = 1;
        } else {
            this.curLevel--;
        }
        this.anim_weapon.play('weapon_level_' + this.curLevel);
    },
});
